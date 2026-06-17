const prisma = require('../prisma');
const crypto = require('crypto');

const createPromoCode = async (req, res) => {
  try {
    const { percentage, expiresAt } = req.body;

    if (percentage === undefined || percentage < 0 || percentage > 100) {
      return res.status(400).json({ message: 'percentage must be between 0 and 100' });
    }

    const raw = crypto.randomBytes(4).toString('hex').toUpperCase();
    const code = `PROMO-${raw}`;

const promo = await prisma.promoCode.create({
       data: {
         code,
         percentage: Number(percentage),
         expiresAt: expiresAt ? new Date(expiresAt) : null,
         createdById: req.user?.id || null,
       },
     });

    return res.status(201).json({ message: 'Promo code created', promo });
  } catch (error) {
    console.error('CREATE PROMO ERROR:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createSeason = async (req, res) => {
  try {
    const { listingId, name, startDate, endDate, price, discountPercentage } = req.body;

    if (!listingId || !name || !startDate || !endDate || price === undefined) {
      return res.status(400).json({ message: 'listingId, name, startDate, endDate and price are required' });
    }

    const season = await prisma.season.create({
      data: {
        listingId,
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        price: Number(price),
        discountPercentage: discountPercentage !== undefined ? Number(discountPercentage) : null,
      },
    });

    return res.status(201).json({ message: 'Season created', season });
  } catch (error) {
    console.error('CREATE SEASON ERROR:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateSeason = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const season = await prisma.season.update({
      where: { id },
      data: {
        name: updates.name,
        startDate: updates.startDate ? new Date(updates.startDate) : undefined,
        endDate: updates.endDate ? new Date(updates.endDate) : undefined,
        price: updates.price !== undefined ? Number(updates.price) : undefined,
        discountPercentage: updates.discountPercentage !== undefined ? Number(updates.discountPercentage) : undefined,
      },
    });

    return res.status(200).json({ message: 'Season updated', season });
  } catch (error) {
    console.error('UPDATE SEASON ERROR:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createManualBooking = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, guestName, source, extras, promoCode } = req.body;
    if (!listingId || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'listingId, checkIn and checkOut are required' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime()) || checkInDate >= checkOutDate) {
      return res.status(400).json({ message: 'Invalid dates' });
    }

const overlapping = await prisma.booking.findFirst({
       where: {
         listingId,
         checkIn: { lte: checkOutDate },
         checkOut: { gte: checkInDate },
       },
     });
    if (overlapping) {
      return res.status(400).json({ message: 'Overlapping booking exists' });
    }

    const oneDay = 1000 * 60 * 60 * 24;
    const nights = Math.ceil((checkOutDate - checkInDate) / oneDay);

    const listing = await prisma.listing.findUnique({ where: { id: listingId }, include: { seasons: true } });
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    let nightlyPrice = listing.price;
    if (listing.seasons && listing.seasons.length > 0) {
      const matched = listing.seasons.find((s) => {
        const sStart = new Date(s.startDate);
        const sEnd = new Date(s.endDate);
        return checkInDate >= sStart && checkInDate <= sEnd;
      });
      if (matched) nightlyPrice = matched.price;
    }

    let totalPrice = nightlyPrice * nights;
    let seasonDiscount = 0;
    if (listing.seasons) {
      const matched = listing.seasons.find((s) => {
        const sStart = new Date(s.startDate);
        const sEnd = new Date(s.endDate);
        return checkInDate >= sStart && checkInDate <= sEnd;
      });
      if (matched && matched.discountPercentage) {
        seasonDiscount = (matched.discountPercentage / 100) * totalPrice;
        totalPrice = totalPrice - seasonDiscount;
      }
    }

    let lengthDiscount = 0;
    if (nights >= 30) {
      lengthDiscount = 0.15 * totalPrice;
      totalPrice = totalPrice - lengthDiscount;
    } else if (nights >= 5) {
      lengthDiscount = 0.05 * totalPrice;
      totalPrice = totalPrice - lengthDiscount;
    }

    let promoRecord = null;
    let promoDiscount = 0;
    if (promoCode) {
      promoRecord = await prisma.promoCode.findFirst({ where: { code: promoCode, active: true } });
      if (promoRecord) {
        promoDiscount = (promoRecord.percentage / 100) * totalPrice;
        totalPrice = totalPrice - promoDiscount;
      }
    }

const booking = await prisma.booking.create({
       data: {
         listingId,
        userId: null,
        guestName: guestName || 'Manual guest',
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights,
        totalPrice: Number((nightlyPrice * nights).toFixed(2)),
        extras: { ...(extras || {}), source: source || 'other' },
        promoCodeId: promoRecord ? promoRecord.id : null,
        discount: Number((seasonDiscount + lengthDiscount + promoDiscount).toFixed(2)),
        finalPrice: Number(totalPrice.toFixed(2)),
        status: 'CONFIRMED',
      },
    });

    return res.status(201).json({ message: 'Manual booking created', booking });
  } catch (error) {
    console.error('CREATE MANUAL BOOKING ERROR:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        listing: true,
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error('GET ALL BOOKINGS ERROR:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const normalized = String(status || '').toUpperCase();

    if (!['PENDING', 'CONFIRMED', 'CANCELLED'].includes(normalized)) {
      return res.status(400).json({ message: 'Invalid booking status' });
    }

const booking = await prisma.booking.update({
       where: { id },
       data: { status: normalized },
      include: { listing: true, user: { select: { id: true, name: true, email: true, role: true } } },
    });

    return res.status(200).json({ message: 'Booking updated', booking });
  } catch (error) {
    console.error('UPDATE BOOKING STATUS ERROR:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.booking.delete({ where: { id } });
    return res.status(200).json({ message: 'Booking deleted' });
  } catch (error) {
    console.error('DELETE BOOKING ERROR:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createPromoCode,
  createSeason,
  updateSeason,
  createManualBooking,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
};

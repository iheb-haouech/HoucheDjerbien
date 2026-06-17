const prisma = require('../prisma');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const createBooking = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, guestName, promoCode, extras } = req.body;

    if (!listingId || !checkIn || !checkOut) {
      return res.status(400).json({
        message: 'listingId, checkIn and checkOut are required',
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        message: 'Invalid checkIn or checkOut date format',
      });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        message: 'checkOut must be after checkIn',
      });
    }

const listing = await prisma.listing.findUnique({
       where: { id: listingId },
       include: { seasons: true },
     });

    if (!listing) {
      return res.status(404).json({
        message: 'Listing not found',
      });
    }

const overlappingBooking = await prisma.booking.findFirst({
       where: {
         listingId,
         checkIn: { lte: checkOutDate },
         checkOut: { gte: checkInDate },
       },
     });

    if (overlappingBooking) {
      return res.status(400).json({
        message: 'This listing is already booked for the selected dates',
      });
    }

    const oneDay = 1000 * 60 * 60 * 24;
    const nights = Math.ceil((checkOutDate - checkInDate) / oneDay);

    // Determine nightly price using seasons if applicable
    let nightlyPrice = listing.price;
    if (listing.seasons && listing.seasons.length > 0) {
      // find a season that overlaps with checkIn
      const matched = listing.seasons.find((s) => {
        const sStart = new Date(s.startDate);
        const sEnd = new Date(s.endDate);
        return checkInDate >= sStart && checkInDate <= sEnd;
      });
      if (matched) {
        nightlyPrice = matched.price;
      }
    }

    let totalPrice = nightlyPrice * nights;

    // Apply season discount if present
    let seasonDiscount = 0;
    if (listing.seasons && listing.seasons.length > 0) {
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

    // Apply length discounts (default rules: >=30 nights -> 15%, >=5 nights -> 5%)
    let lengthDiscount = 0;
    if (nights >= 30) {
      lengthDiscount = 0.15 * totalPrice;
      totalPrice = totalPrice - lengthDiscount;
    } else if (nights >= 5) {
      lengthDiscount = 0.05 * totalPrice;
      totalPrice = totalPrice - lengthDiscount;
    }

    // Apply promo code if provided
    let promoRecord = null;
    let promoDiscount = 0;
    if (promoCode) {
      promoRecord = await prisma.promoCode.findFirst({
        where: {
          code: promoCode,
          active: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      });
      if (promoRecord) {
        promoDiscount = (promoRecord.percentage / 100) * totalPrice;
        totalPrice = totalPrice - promoDiscount;
      }
    }

    const finalPrice = Number(totalPrice.toFixed(2));

    const booking = await prisma.booking.create({
      data: {
        listingId,
        userId: req.user?.id || null,
        guestName: guestName || req.user?.name || 'Guest',
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights,
        totalPrice: Number((nightlyPrice * nights).toFixed(2)),
        extras: extras || null,
        promoCodeId: promoRecord ? promoRecord.id : null,
        discount: Number((seasonDiscount + lengthDiscount + promoDiscount).toFixed(2)),
        finalPrice,
      },
      include: {
        listing: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Send confirmation email if user email available
    const userEmail = req.user?.email || booking.user?.email;
    if (userEmail) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: userEmail,
          subject: 'Reservation confirmation',
          html: `<div style="font-family: Arial, sans-serif; line-height:1.6;"><h2>Reservation confirmed</h2><p>Thank you ${booking.guestName} — your booking for ${booking.nights} nights is confirmed.</p><p>Listing: ${booking.listing.title}</p><p>Check-in: ${booking.checkIn}</p><p>Check-out: ${booking.checkOut}</p><p>Total: ${booking.finalPrice} DT</p></div>`,
        });
      } catch (mailErr) {
        console.error('EMAIL SEND ERROR:', mailErr);
      }
    }

    return res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('CREATE BOOKING ERROR:', error);
    return res.status(500).json({
      message: 'Server error while creating booking',
      error: error.message,
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        listing: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error('GET MY BOOKINGS ERROR:', error);
    return res.status(500).json({
      message: 'Server error while fetching your bookings',
      error: error.message,
    });
  }
};

const getBookingsByListing = async (req, res) => {
  try {
    const { listingId } = req.params;

    const bookings = await prisma.booking.findMany({
      where: {
        listingId,
      },
      orderBy: {
        checkIn: 'asc',
      },
    });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error('GET BOOKINGS BY LISTING ERROR:', error);
    return res.status(500).json({
      message: 'Server error while fetching listing bookings',
      error: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingsByListing,
};
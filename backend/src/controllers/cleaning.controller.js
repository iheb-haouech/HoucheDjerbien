const prisma = require('../prisma');

const createCleaningRequest = async (req, res) => {
  try {
    const {
      listingId,
      clientName,
      phone,
      requestType,
      frequency,
      team,
      date,
      notes,
    } = req.body;

    if (!clientName || !phone || !requestType || !date) {
      return res.status(400).json({
        message: 'clientName, phone, requestType and date are required',
      });
    }

    let listing = null;

    if (listingId) {
      listing = await prisma.listing.findUnique({
        where: { id: listingId },
      });

      if (!listing) {
        return res.status(404).json({
          message: 'Listing not found',
        });
      }
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: 'Invalid date format',
      });
    }

    const cleaningRequest = await prisma.cleaningRequest.create({
      data: {
        userId: req.user?.id || null,
        listingId: listingId || null,
        clientName,
        phone,
        requestType,
        frequency: frequency || null,
        team: team || null,
        date: parsedDate,
        notes: notes || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        listing: true,
      },
    });

    return res.status(201).json({
      message: 'Cleaning request created successfully',
      cleaningRequest,
    });
  } catch (error) {
    console.error('CREATE CLEANING REQUEST ERROR:', error);
    return res.status(500).json({
      message: 'Server error while creating cleaning request',
      error: error.message,
    });
  }
};

const getMyCleaningRequests = async (req, res) => {
  try {
    const cleaningRequests = await prisma.cleaningRequest.findMany({
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

    return res.status(200).json(cleaningRequests);
  } catch (error) {
    console.error('GET MY CLEANING REQUESTS ERROR:', error);
    return res.status(500).json({
      message: 'Server error while fetching your cleaning requests',
      error: error.message,
    });
  }
};

const getAllCleaningRequests = async (req, res) => {
  try {
    const cleaningRequests = await prisma.cleaningRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        listing: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(cleaningRequests);
  } catch (error) {
    console.error('GET ALL CLEANING REQUESTS ERROR:', error);
    return res.status(500).json({
      message: 'Server error while fetching cleaning requests',
      error: error.message,
    });
  }
};

module.exports = {
  createCleaningRequest,
  getMyCleaningRequests,
  getAllCleaningRequests,
};
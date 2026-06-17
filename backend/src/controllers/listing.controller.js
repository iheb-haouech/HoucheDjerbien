const prisma = require('../prisma');

const getAllListings = async (req, res) => {
  try {
    const listings = await prisma.listing.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        bookings: true,
        seasons: true,
        cleaningRequests: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(listings);
  } catch (error) {
    console.error('GET ALL LISTINGS ERROR:', error);
    return res.status(500).json({
      message: 'Server error while fetching listings',
      error: error.message,
    });
  }
};

const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        bookings: true,
        seasons: true,
        cleaningRequests: true,
      },
    });

    if (!listing) {
      return res.status(404).json({
        message: 'Listing not found',
      });
    }

    return res.status(200).json(listing);
  } catch (error) {
    console.error('GET LISTING BY ID ERROR:', error);
    return res.status(500).json({
      message: 'Server error while fetching listing',
      error: error.message,
    });
  }
};

const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      rating,
      images,
      amenities,
      location,
      hostName,
      hostAvatar,
      coordinates,
      availability,
    } = req.body;

    if (!title || price === undefined || !location) {
      return res.status(400).json({
        message: 'Title, price and location are required',
      });
    }

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        message: 'Images must be a non-empty array',
      });
    }

    if (!Array.isArray(amenities)) {
      return res.status(400).json({
        message: 'Amenities must be an array',
      });
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description: description || null,
        price: Number(price),
        rating: rating !== undefined ? Number(rating) : null,
        images,
        amenities,
        location,
        hostName: hostName || null,
        hostAvatar: hostAvatar || null,
        coordinates: coordinates || null,
        availability: availability || null,
        ownerId: req.user?.id || null,
      },
    });

    return res.status(201).json({
      message: 'Listing created successfully',
      listing,
    });
  } catch (error) {
    console.error('CREATE LISTING ERROR:', error);
    return res.status(500).json({
      message: 'Server error while creating listing',
      error: error.message,
    });
  }
};

module.exports = {
  getAllListings,
  getListingById,
  createListing,
};
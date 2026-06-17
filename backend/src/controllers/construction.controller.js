const prisma = require('../prisma');

const createConstructionRequest = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      requestType,
      date,
      description,
    } = req.body;

    if (!name || !phone || !description) {
      return res.status(400).json({
        message: 'name, phone and description are required',
      });
    }

    let parsedDate = null;

    if (date) {
      parsedDate = new Date(date);

      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          message: 'Invalid date format',
        });
      }
    }

    const constructionRequest = await prisma.constructionRequest.create({
      data: {
        userId: req.user?.id || null,
        name,
        phone,
        email: email || null,
        requestType: requestType || null,
        date: parsedDate,
        description,
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
      },
    });

    return res.status(201).json({
      message: 'Construction request created successfully',
      constructionRequest,
    });
  } catch (error) {
    console.error('CREATE CONSTRUCTION REQUEST ERROR:', error);
    return res.status(500).json({
      message: 'Server error while creating construction request',
      error: error.message,
    });
  }
};

const getMyConstructionRequests = async (req, res) => {
  try {
    const constructionRequests = await prisma.constructionRequest.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(constructionRequests);
  } catch (error) {
    console.error('GET MY CONSTRUCTION REQUESTS ERROR:', error);
    return res.status(500).json({
      message: 'Server error while fetching your construction requests',
      error: error.message,
    });
  }
};

const getAllConstructionRequests = async (req, res) => {
  try {
    const constructionRequests = await prisma.constructionRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(constructionRequests);
  } catch (error) {
    console.error('GET ALL CONSTRUCTION REQUESTS ERROR:', error);
    return res.status(500).json({
      message: 'Server error while fetching construction requests',
      error: error.message,
    });
  }
};

module.exports = {
  createConstructionRequest,
  getMyConstructionRequests,
  getAllConstructionRequests,
};
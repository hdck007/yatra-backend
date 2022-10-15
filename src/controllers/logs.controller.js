const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// get or add websites data and return it
const createLog = async (req, res) => {
  try {
    const { place, date } = req.body;
    const newLog = await prisma.log.create({
      data: {
        place: place.toLowerCase(),
        startDate: date ? new Date(date) : new Date(),
        user: {
          connect: {
            id: req.user,
          },
        },
      },
    });
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ ...error });
  }
};

// get or add websites data and return it
const endLog = async (req, res) => {
  try {
    const updatedLog = await prisma.log.update({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(updatedLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLogs = async (req, res) => {
  try {
    const { id, startDate, endDate } = req.query;
    if (id) {
      const logs = await prisma.log.findUnique({
        where: {
          id,
          startDate: {
            gte: new Date(startDate),
          },
          endDate: {
            lte: new Date(endDate),
          },
        },
      });
      res.status(200).json(logs);
      return;
    }
    const logs = await prisma.log.findMany({
      where: {
        userId: req.user,
      },
    });
    res.status(200).json(logs);
    return;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPlaces = async (req, res) => {
  try {
    const places = await prisma.log.findMany({
      select: {
        place: true,
      },
      distinct: ['place'],
    });
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createLog,
  endLog,
  getLogs,
  getPlaces,
};

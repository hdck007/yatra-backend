const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// get or add websites data and return it
const createLog = async (req, res) => {
  try {
    const { place, userId } = req.body;
    console.log(req.body);
    const newLog = await prisma.log.create({
      data: {
        place: place.toLowerCase(),
        startDate: new Date(),
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    res.status(201).json(newLog);
  } catch (error) {
    console.error(error);
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

module.exports = {
  createLog,
  endLog,
};

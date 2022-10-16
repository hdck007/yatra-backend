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
      data: {
        endDate: new Date(),
      },
    });
    res.status(200).json(updatedLog);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const copyLog = async (req, res) => {
  try {
    const {
      id, date, days, perday,
    } = req.body;
    const log = await prisma.log.findUnique({
      where: {
        id,
      },
      include: {
        events: {
          include: {
            tags: true,
          },
        },
      },
    });
    const newLog = await prisma.log.create({
      data: {
        place: log.place,
        startDate: new Date(date),
        user: {
          connect: {
            id: req.user,
          },
        },
      },
    });
    const newEvents = [];
    let movingDate = new Date(date);
    let movingIndex = 0;
    for (let i = 0; i < days; i++) {
      for (let j = 0; j < perday; j++) {
        if (movingIndex >= log.events.length) break;
        const newEvent = {
          content: log.events[movingIndex].content,
          title: log.events[movingIndex].title,
          date: new Date(movingDate),
          logId: newLog.id,
        };
        newEvents.push(newEvent);
        movingIndex += 1;
      }
      const tempDate = new Date(movingDate.setDate(movingDate.getDate() + 1));
      movingDate = new Date(tempDate);
      if (movingIndex >= log.events.length) break;
    }
    await prisma.event.createMany({
      data: newEvents,
    });
    res.status(200).json(newLog);
  } catch (error) {
    console.log(req.body);
    console.log(error);
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
        include: {
          events: true,
        },
        orderBy: {
          startDate: 'desc',
        },
      });
      res.status(200).json(logs);
      return;
    }
    const logs = await prisma.log.findMany({
      where: {
        userId: req.user,
      },
      include: {
        events: true,
      },
      orderBy: {
        startDate: 'desc',
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

// random

const getLogsByPlace = async (req, res) => {
  try {
    const { name } = req.params;
    const logs = await prisma.log.findMany({
      where: {
        place: name.toLowerCase(),
        endDate: {
          not: null,
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
    res.status(200).json(logs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getLog = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await prisma.log.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        events: true,
      },
    });
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createLog,
  endLog,
  getLogs,
  getPlaces,
  getLogsByPlace,
  getLog,
  copyLog,
};

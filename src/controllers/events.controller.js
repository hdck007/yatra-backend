const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// get or add websites data and return it
const createEvent = async (req, res) => {
  try {
    const {
      content, title, id, tagId,
    } = req.body;
    if (tagId) {
      const newEvent = await prisma.event.create({
        data: {
          content,
          title,
          log: {
            connect: {
              id,
            },
          },
          tags: {
            connect: {
              id: tagId,
            },
          },
        },
      });
      res.status(201).json(newEvent);
      return;
    }
    const newEvent = await prisma.event.create({
      data: {
        content,
        title,
        log: {
          connect: {
            id,
          },
        },
      },
    });
    res.status(201).json(newEvent);
    return;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFeed = async (req, res) => {
  try {
    let {
      tags,
      destination,
      rating,
    } = req.query;

    destination = destination || '';
    tags = tags ? tags.split(',') : [];
    rating = rating || 0;

    console.log(tags, destination, rating);

    if (tags.length) {
      const events = await prisma.event.findMany({
        where: {
          AND: [
            {
              log: {
                place: {
                  contains: destination.toLowerCase(),
                },
              },
            },
            {
              rating: {
                gte: Number(rating),
              },
            },
            {
              tags: {
                some: {
                  name: {
                    in: tags,
                  },
                },
              },
            },
          ],
        },
        include: {
          log: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          rating: 'desc',
        },
      });
      res.status(201).json(events);
    } else {
      const events = await prisma.event.findMany({
        where: {
          AND: [
            {
              log: {
                place: {
                  contains: destination.toLowerCase(),
                },
              },
            },
            {
              rating: {
                gte: Number(rating),
              },
            },
          ],
        },
        include: {
          log: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          rating: 'desc',
        },
      });
      res.status(201).json(events);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEvent,
  getFeed,
};

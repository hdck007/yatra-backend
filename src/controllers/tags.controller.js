const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// get or add websites data and return it
const createTag = async (req, res) => {
  try {
    const { name, eventId } = req.body;
    const theTag = await prisma.tag.findUnique({
      where: {
        name,
      },
    });
    if (theTag) {
      const updatedTag = await prisma.tag.update({
        where: {
          id: theTag.id,
        },
        data: {
          events: {
            connect: {
              id: eventId,
            },
          },
        },
      });
      res.status(200).json(updatedTag);
    } else {
      const newTag = await prisma.tag.create({
        data: {
          name: req.body.name,
          events: {
            connect: {
              id: req.body.eventId,
            },
          },
        },
      });
      res.status(201).json(newTag);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTag,
};

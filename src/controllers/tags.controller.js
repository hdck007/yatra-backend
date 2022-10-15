const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// get or add websites data and return it
const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    const theTag = await prisma.tag.findUnique({
      where: {
        name,
      },
    });
    if (theTag) {
      res.status(200).json(theTag);
      return;
    }
    const newTag = await prisma.tag.create({
      data: {
        name: req.body.name,
      },
    });
    res.status(201).json(newTag);
    return;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTags = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      take: 10,
    });
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTag,
  getTags,
};

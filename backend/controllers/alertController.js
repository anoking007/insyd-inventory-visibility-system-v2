const prisma = require("../prismaClient");

exports.lowStock = async (req, res) => {
  const items = await prisma.inventory.findMany({
    where: {
      quantity: { lte: prisma.inventory.fields.minThreshold }
    }
  });
  res.json(items);
};

exports.deadStock = async (req, res) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 60);

  const items = await prisma.inventory.findMany({
    where: {
      lastUpdated: { lt: cutoff }
    }
  });

  res.json(items);
};

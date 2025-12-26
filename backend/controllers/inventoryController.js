const prisma = require("../prismaClient");

exports.addItem = async (req, res) => {
  const item = await prisma.inventory.create({
    data: req.body
  });
  res.status(201).json(item);
};

exports.getItems = async (req, res) => {
  const items = await prisma.inventory.findMany();
  res.json(items);
};

exports.updateStock = async (req, res) => {
  const item = await prisma.inventory.update({
    where: { id: Number(req.params.id) },
    data: {
      quantity: req.body.quantity
    }
  });
  res.json(item);
};

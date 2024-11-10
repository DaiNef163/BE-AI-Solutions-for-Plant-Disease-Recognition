const CartService = require("./cart.service");

async function store(req, res) {
  try {
    const { productId } = req.params;
    const { _id } = req.user;
    const { quantity } = req.body;
    const dto = { owner: _id, productId, quantity };

    const cart = await CartService.store(dto);
    res.status(201).json(cart);
  } catch (error) {}
}

module.exports = {
  store,
};

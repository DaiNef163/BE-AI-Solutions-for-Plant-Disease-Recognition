const CartRepository = require("../../models/cart");

const store = async ({ owner, productId, quantity = 1 }) => {
  try {
    const productDto = {
      id: productId,
      quantity,
    };

    const cart = await CartRepository.findOneAndUpdate(
      {
        owner,
        products: { $not: { $elemMatch: { id: productId, quantity } } },
      },
      {
        owner,
        $addToSet: { products: { productDto } },
      }
    )
      .lean()
      .exec();

    return cart;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  store,
};

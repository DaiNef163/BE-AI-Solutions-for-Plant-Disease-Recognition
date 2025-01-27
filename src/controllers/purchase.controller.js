const Purchases = require("../models/purchases");

module.exports.getAll = async function (req, res) {
  try {
    const purchases = await Purchases.find({ userId: req.user._id });

    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json("Fail !!");
  }
};

module.exports.getDetail = async function (req, res) {
  try {
    const purchaseDetail = await Purchases.findOne({
      userId: req.user._id,
      _id: req.params.id,
    });

    res.status(200).json(purchaseDetail);
  } catch (error) {
    res.status(500).json("Fail !!");
  }
};

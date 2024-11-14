const ProductsBuy = require("../models/productBuy")

module.exports.getAll = async function (req,res) {
    try {
        const purchases = await ProductsBuy.find({userId:req.user._id})

        res.status(200).json(purchases)
    } catch (error) {
        res.status(500).json("Fail !!")
    }
}


module.exports.getDetail = async function (req,res) {
    try {
        const purchaseDetail = await ProductsBuy.findOne({userId:req.user._id,_id:req.params.id})

        res.status(200).json(purchaseDetail)
    } catch (error) {
        res.status(500).json("Fail !!")
    }
}


const Cart = require("../models/cart")
const productBuys = require("../models/productBuy")


module.exports.Order = async (req,res) =>{
    const userId = req.user.id
    const address =req.body.address
    const phone = req.body.phone
    const info = {
        address : address,
        phone : phone
    }

    const cart = await Cart.findOne({owner: userId})

    const ObjectProduct ={
        userId: userId,
        productName: cart.products,
        totalCost: cart.totalCost,
        info: info
    }

    const productBuy = new productBuys(ObjectProduct)
    await productBuy.save()

    await Cart.updateOne({owner:req.user.id},{products:[],totalCost:0})

    return res.status(200).json("Success")
}


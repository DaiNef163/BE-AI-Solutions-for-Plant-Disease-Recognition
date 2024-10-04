const Products = require("../../models/product")

module.exports.createProduct = async function (req,res) {
    try {
        req.body.price = parseInt(req.body.price)
        req.body.discountPercentage = parseInt(req.body.discountPercentage)
        req.body.stock = parseInt(req.body.stock)
        if (req.file) {
            req.body.thumbnail = `/uploads/${req.file.filename}`
        }

        const product = new Products(req.body)
        await product.save()
        res.status(200).json("Create product success")
    } catch (error) {
        res.status(400).json({ message: "Create product fail", error: error.message });

    }
}
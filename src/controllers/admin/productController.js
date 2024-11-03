const Products = require("../../models/product")

module.exports.createProduct = async function (req,res) {
    if(req.permission.permission.includes("products_create")){
        try {
            if (req.body.price) {
                req.body.price = parseInt(req.body.price); // Chuyển đổi giá thành số nguyên
            }
            if (req.body.discount) {
                req.body.discount = parseInt(req.body.discount); // Chuyển đổi giảm giá thành số nguyên
            }
        
            // Kiểm tra xem có file nào được tải lên không
            if (req.files && req.files.length > 0) {
                req.body.images = req.files.map(file => `/uploads/${file.filename}`);
            } else {
                req.body.images = []; // Nếu không có file nào được tải lên, thiết lập mảng trống
            }
        
            const product = new Products(req.body);
            await product.save();
            res.status(200).json({ message: "Create product success" }); // Gửi phản hồi với thông báo thành công
        } catch (error) {
            res.status(400).json({ message: "Create product fail", error: error.message }); // Xử lý lỗi
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
    
}

module.exports.getAll = async function (req,res) {
    try {
        const allProduct = await Products.find({accept:true}).sort()

        res.status(200).json(allProduct)
    } catch (error) {
        res.status(200).json("Fail")
    }
}

module.exports.productAdmin = async function (req,res) {
    if(req.permission.permission.includes("product_admin")){
        try {
            const products = await Products.find({accept:false}).sort()

            res.status(200).json(products)
        } catch (error) {
            res.status(400).json("Fail")
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
}

module.exports.acceptProduct = async function (req,res) {
    if(req.permission.permission.includes("product_accept")){
        try {
            const product = await Products.updateOne({_id:req.params.id},{accept:true})
            
            res.status(200).json("Duyệt sản phẩm thành công")
        } catch (error) {
            res.status(400).json("Fail")
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
}

module.exports.unacceptProduct = async function (req,res) {
    if(req.permission.permission.includes("product_unaccept")){
        try {
            const productId = req.params.id
            await Products.deleteOne({_id:productId})
            
            res.status(200).json("Sản phẩm không được chấp nhận")
        } catch (error) {
            res.status(400).json("Fail")
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
}

module.exports.Detail = async function (req,res) {
    if(req.permission.permission.includes("product_view")){
        try {
            const detailProduct = await Products.findOne({_id:req.params.id})
    
            res.status(200).json(detailProduct)
        } catch (error) {
            res.status(400).json("Product not find")
            
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
}

module.exports.updateProduct = async function (req,res) {
    if(req.permission.permission.includes("product_edit")){
        try {
            const product = await Products.findById(req.params.id)
            if(!product){
                res.status(400).json("Product not found")
                return
            }
    
            if(req.body.price){
                req.body.price = parseInt(req.body.price)
            }
            if(req.body.discountPercentage){
                req.body.discountPercentage = parseInt(req.body.discountPercentage)
            }
    
            if(req.body.stock){
                req.body.stock = parseInt(req.body.stock)
            }
    
            if (req.files && req.files.length > 0) {
                req.body.image = req.files.map(file => `/uploads/${file.filename}`);
            }
    
            await product.updateOne(req.body)
            res.status(200).json("Update success")
        } catch (error) {
            res.status(200).json("Update fail")
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
    
}

module.exports.deleteProduct = async function (req,res) {
    if(req.permission.permission.includes("product_delete")){
        try {
            const product = await Products.findById(req.params.id)
            if(!product){
                res.status(400).json("Product not found")
                return
            }
    
            await product.deleteOne()
            res.status(200).json("Delete success")
    
        } catch (error) {
            res.status(400).json("Delete fail")
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
    
}
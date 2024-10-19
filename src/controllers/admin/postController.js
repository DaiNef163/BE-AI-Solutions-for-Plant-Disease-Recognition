const Posts = require("../../models/post")
const Accounts = require("../../models/account")

module.exports.Create = async function (req,res) {
    if(req.permission.permission.includes("post_create")){
        try {
            const userId = req.user.id
            if (req.files && req.files.length > 0) {
                req.body.images = req.files.map(file => `/uploads/${file.filename}`);
            }
            const newPost ={...req.body,user:userId}
            const post = new Posts(newPost)
            await post.save()
            res.status(200).json(post)
        } catch (error) {
            res.status(400).json("Create post fail")
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
}

module.exports.allPost = async function (req,res) {
    try {
        const allPost = await Posts.find({accept: true}).sort({date: -1})
        res.status(200).json(allPost)
    } catch (error) {
        res.status(400).json("Fail")
    }
}

module.exports.detailPost = async function (req,res) {
    try {
        const detailPost = await Posts.findById(req.params.id)

        res.status(200).json(detailPost)
    } catch (error) {
        res.status(400).json("Không tìm thấy post")
    }
}

module.exports.Update = async function (req,res) {
    if (req.permission.permission.includes("post_edit")) {
        try {
            const postId = req.params.id
            const post = await Posts.findOne({_id:postId})
    
            if(post.user.toString() !== req.user.id){
                res.status(400).json({message:"User not authorized"})
                return
            }
            
            if (req.files && req.files.length > 0) {
                req.body.images = req.files.map(file => `/uploads/${file.filename}`);
            }

            await post.updateOne(req.body)
    
            res.status(200).json("update success")
        } catch (error) {
            res.status(200).json("update fail")   
        }
    } else {
        res.status(400).json("Bạn không có quyền này")
    }
}

module.exports.Delete = async function (req,res) {
    if(req.permission.permission.includes("post_delete")){
        try {
            const postId = req.params.id
            const post = await Posts.findOne({_id:postId})
    
            if(post.user.toString() !== req.user.id){
                res.status(400).json({message:"User not authorized"})
                return
            }
    
            await post.deleteOne()
    
            res.status(200).json("Delete success")
        } catch (error) {
            res.status(200).json("Delete fail")   
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
}

module.exports.createComment = async function (req,res) {
    try {
        const postId = req.params.id
        const post = await Posts.findOne({_id:postId})
        
        if(!post){
            res.status(400).json({message:"Not find post"})
            return
        }

        const user = await Accounts.findOne({_id:req.user.id})
        if(!user){
            res.status(400).json({message:"Not find user"})
            return
        }

        const newComment = {
            user : user.id,
            text: req.body.text,
            name: user.fullName
        }

        await post.updateOne({$push:{comments:newComment}})
        res.status(200).json("Comment success")

    } catch (error) {
        res.status(200).json("Comment fail")
        
    }
}

module.exports.deleteComment = async function (req,res) {
    try {
        const post = await Posts.findOne({_id:req.params.id})
        if(!post){
            res.status(400).json({message:"Not find post"})
            return
        }

        const comment = post.comments.find((c) => c._id.toString() === req.params.comment_id)
        if(!comment){
            res.status(400).json({message:"Comment not found"})
            return
        }

        if(comment.user.toString() !== req.user.id){
            res.status(400).json({message:"User not authorized"})
            return
        }

        await post.updateOne({$pull:{comments:comment}})
        res.status(200).json({message:"Remove comment success"})

    } catch (error) {
        res.status(400).json("Delete comment fail")
    }
}

module.exports.acceptPost = async function (req,res) {
    if(req.permission.permission.includes("post_accept")){
        try {
            const postId = req.params.id
            await Posts.updateOne({_id:postId},{accept:true})
    
            res.status(200).json("Bài post được chấp nhận")
        } catch (error) {
            res.status(200).json("Fail")   
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
}

module.exports.postAdmin = async function (req,res) {
    if(req.permission.permission.includes("post_admin")){
        try {
            const posts = await Posts.find({accept:false}).sort({date:-1})
            res.status(200).json(posts)
        } catch (error) {
            res.json("Lỗi !!")
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
}

module.exports.unAccept = async function (req,res) {
    if(req.permission.permission.includes("post_unaccept")){
        try {
            const postId = req.params.id
            await Posts.deleteOne({_id:postId})
    
            res.status(200).json("Không chấp nhận bài post")
        } catch (error) {
            res.status(400).json("Lỗi")
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
}
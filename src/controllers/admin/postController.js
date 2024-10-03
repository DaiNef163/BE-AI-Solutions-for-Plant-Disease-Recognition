const Posts = require("../../models/post")
const Accounts = require("../../models/account")

module.exports.Create = async function (req,res) {
    try {
        const userId = req.user.id
        const newPost ={...req.body,user:userId}
        const post = new Posts(newPost)
        await post.save()
        res.status(200).json(post)
    } catch (error) {
        res.status(400).json("Create post fail")
    }
}

module.exports.allPost = async function (req,res) {
    try {
        const allPost = await Posts.find().sort({date: -1})
        res.status(200).json(allPost)
    } catch (error) {
        res.status(400).json("Fail")
    }
}

module.exports.Update = async function (req,res) {
    try {
        const postId = req.params.id
        const post = await Posts.findOne({_id:postId})

        if(post.user.toString() !== req.user.id){
            res.status(400).json({message:"User not authorized"})
            return
        }

        await post.updateOne(req.body)

        res.status(200).json("update success")
    } catch (error) {
        res.status(200).json("update fail")   
    }
}

module.exports.Delete = async function (req,res) {
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
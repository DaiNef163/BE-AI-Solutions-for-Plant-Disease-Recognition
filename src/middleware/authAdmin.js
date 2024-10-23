const Account= require("../models/account")
const Role = require("../models/role")
module.exports.requireAuth= async (req,res,next) =>{
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1]
        const user = await Account.findOne({tokenUser:token,deleted:false}).select("-password")
        const permission = await Role.findOne({title: user.role}).select("permission -_id")

        if(!user){
            res.json({
                code:400,
                message:'Token không hợp lệ'
            })

            return
        }

        req.user=user
        req.permission=permission
        next()

    }else{
        res.json({
            code:400,
            message:"Vui lòng gửi kèm token"
        })
    }
}

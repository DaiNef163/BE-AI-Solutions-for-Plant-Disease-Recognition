const { json } = require("express")
const Account = require("../../models/account")
const ForgotPassword = require("../../models/forgot-password")
const md5 = require("md5")
const helperPassword = require("../../helper/genaration")
const sendMail = require("../../helper/sendMail")

module.exports.allAccount = async function (req,res) {
    try {
        const allAccount = await Account.find().select("-password")

        res.status(200).json(allAccount)
    } catch (error) {
        res.json(error)
    }
}

module.exports.Register = async function (req,res) {
    try {
        const existEmail = await Account.findOne({
            email: req.body.email,
            deleted: false
        })

        if(existEmail){
            res.status(400).json("Email exist")
            return
        }

        const fullName = req.body.fullName
        const email = req.body.email
        const password = md5(req.body.password)

        const account = new Account({fullName:fullName,email:email,password:password})
        await account.save()
        res.status(200).json(account)
    } catch (error) {
        res.json(error)
    }
}

module.exports.Detail= async function (req,res) {
    try {
        const accountDetail = await Account.findById(req.params.id).select("-password")

        res.status(200).json(accountDetail)
    } catch (error) {
        res.json({message:"Id user not valid"})
    }
}

module.exports.Update = async function (req,res) {
    try {
        const updateUser = await Account.updateOne({_id:req.params.id},{...req.body})

        res.status(200).json({message: "Update success"})
    } catch (error) {
        res.json({message:"Update Fail"})
    }
}

module.exports.Login = async function (req,res) {
    const email=req.body.email
    const password=req.body.password

    const account= await Account.findOne({
        email:email
    })

    if(!account){
        res.json({message:"not find user"})
        return
    }

    if(md5(password) != account.password){
        res.json({message:"password incorrect"})
        return
    }

    res.cookie("tokenUser",account.tokenUser)
    res.status(200).json(account.tokenUser)
}

module.exports.forgotPassword = async function (req,res) {
    if(!req.body.email){
        res.status(400).json("Yêu cầu nhập email")
        return
    }

    const email = req.body.email

    const account = await Account.findOne({email:email})

    if(!account){
        res.status(400).json("Email không đúng")
        return
    }

    const otp=helperPassword.generateRandomNumber(6)
    const objectForgotPassword ={
        email:email,
        otp:otp,
        expireAt: Date.now() 
    }

    const forgotPassword= new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()

    //Gửi OTP qua email
    const subject ="Mã OTP để xác minh lấy lại mật khẩu"
    const html=`
        Mã OTP xác minh lấy lại mật khẩu là <b>${otp}</b>. Thời gian mã có hiệu lực là 3 phút
    `

    sendMail.sendMail(email,subject,html)

    res.status(200).json("Hãy kiểm tra mail của bạn")
}

module.exports.otpPost = async function (req,res) {
    const email=req.body.email
    const otp = req.body.otp

    const result= await ForgotPassword.findOne({email:email,otp:otp})

    if(!result){
        res.status(400).json("OTP không hợp lệ")
        return
    }

    const user = await Account.findOne({email:email,deleted:false})

    res.cookie("tokenUser",user.tokenUser)
    res.status(200).json("OTP hợp lệ")
}

module.exports.resetPassword = async function (req,res) {
    const password = req.body.password
    const token = req.cookies.tokenUser

    if (!token) {
        return res.status(401).json("Unauthorized: No token found");
    }

    await Account.updateOne({tokenUser: token},{password:md5(password)})
    res.status(200).json("Reset password thành công")
}

module.exports.Logout = async function (req,res) {
    res.clearCookie('tokenUser', { httpOnly: true, secure: false })
    res.status(400).json("Logout")
}
const { json } = require("express")
const Account = require("../../models/account")
const md5 = require("md5")

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
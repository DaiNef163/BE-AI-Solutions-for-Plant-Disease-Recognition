const Crop = require("../models/crop")
const moment = require("moment-timezone")

module.exports.getAll = async function (req,res) {
    try {
        const crops = await Crop.find({user_id:req.user._id})

        res.status(200).json(crops)
    } catch (error) {
        res.status(500).json("Fail !!")
    }
}

module.exports.createCrop = async function (req,res) {
    try {

        const illnessHistory = {
            diseaseName: req.body.diseaseName,
            sickDay: req.body.sickDay
        }

        const cropBody = {
            user_id: req.user._id,
            plantName: req.body.plantName,
            quantity: req.body.quantity,
            status: req.body.status,
            plantDate: req.body.plantDate,
            illnessHistory: illnessHistory
        }

        const crop  = new Crop(cropBody)
        await crop.save()

        res.status(200).json(crop)
    } catch (error) {
        res.status(500).json("Fail !!")
    }
}

module.exports.detailCrop = async function (req,res) {
    try {
        const detailCrop = await Crop.findOne({user_id:req.user._id,_id:req.params.id})

        res.status(200).json(detailCrop)
    } catch (error) {
        res.status(500).json("Fail !!")
    }
}

module.exports.updateSick = async function (req,res) {
    try {
        const illnessHistory = {
            diseaseName: req.body.diseaseName,
            sickDay: req.body.sickDay
        } 

        await Crop.updateOne({user_id:req.user._id,_id:req.params.id},{$push:{illnessHistory:illnessHistory}})

        res.status(200).json("Update Success")
    } catch (error) {
        res.status(500).json("Fail !!")
    }
}

module.exports.editCrop = async function (req,res) {
    try {
        const updateCrop = {
            status: req.body.status,
            quantity: req.body.quantity
        }

        await Crop.updateOne({user_id:req.user._id,_id:req.params.id},updateCrop)

        res.status(200).json("Update Success")
    } catch (error) {
        res.status(500).json("Fail !!")
    }
}

module.exports.deleteCrop = async function (req,res) {
    try {
        await Crop.deleteOne({user_id:req.user._id,_id:req.params.id})
        res.status(200).json("Delete Success")
    } catch (error) {
        res.status(500).json("Fail !!")
    }
}
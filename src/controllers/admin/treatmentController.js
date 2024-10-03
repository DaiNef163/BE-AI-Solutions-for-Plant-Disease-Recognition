const Treatments = require("../../models/treatment")

module.exports.Create = async function (req,res) {
    try {
        const newTreatment = new Treatments(req.body)
        await newTreatment.save()
        res.status(200).json("Create success")
    } catch (error) {
        res.status(200).json("Create fail")
    }
}

module.exports.allTreatment = async function (req,res) {
    try {
        const allTreatment = await Treatments.find()
        res.status(200).json(allTreatment)
    } catch (error) {
        res.status(400).json("No have treatment")
    }
}

module.exports.Detail = async function (req,res) {
    try {
        const treatmentId = req.params.id
        const detailTreatment = await Treatments.findOne({_id:treatmentId})

        res.status(200).json(detailTreatment)
    } catch (error) {
        res.status(400).json("Don't find treatment")
    }
}

module.exports.Update = async function (req,res) {
    try {
        const treatmentId = req.params.id
        await Treatments.updateOne({_id:treatmentId},req.body)
        res.status(200).json("Update success")
    } catch (error) {
        res.status(200).json("Update fail")
    }
}
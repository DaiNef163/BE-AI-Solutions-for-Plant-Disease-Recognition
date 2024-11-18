const Treatments = require("../../models/treatment")

module.exports.Create = async function (req,res) {
        try {
            const treatment = {
                name: req.body.name,
                symptoms: req.body.symptoms,
                causes: req.body.causes,
                treatment: req.body.treatment,
                prevention: req.body.prevention,
                severityLevel: req.body.severityLevel
            }

            const newTreatment = new Treatments(treatment)
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
            const detailTreatment = await Treatments.findById(req.params.id)
    
            res.status(200).json(detailTreatment)
        } catch (error) {
            res.status(400).json("Don't find treatment")
        }
}

module.exports.Update = async function (req,res) {
        try {
            await Treatments.updateOne({_id:req.params.id},req.body)
            res.status(200).json("Update success")
        } catch (error) {
            res.status(200).json("Update fail")
        }
}

module.exports.Delete= async function (req,res) {
        try {
            await Treatments.findByIdAndDelete(req.params.id)
    
            res.status(200).json("Xóa thành công")
        } catch (error) {
            res.status(400).json("Xóa thất baih")
        }
}
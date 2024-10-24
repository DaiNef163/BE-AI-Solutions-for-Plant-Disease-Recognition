const Treatments = require("../../models/treatment")

module.exports.Create = async function (req,res) {
    if(req.permission.permission.includes("treatment_create")){
        try {
            const newTreatment = new Treatments(req.body)
            await newTreatment.save()
            res.status(200).json("Create success")
        } catch (error) {
            res.status(200).json("Create fail")
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
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
    if(req.permission.permission.includes("treatment_view")){
        try {
            const treatmentId = req.params.id
            const detailTreatment = await Treatments.findOne({_id:treatmentId})
    
            res.status(200).json(detailTreatment)
        } catch (error) {
            res.status(400).json("Don't find treatment")
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
}

module.exports.Update = async function (req,res) {
    if(req.permission.permission("treatment_edit")){
        try {
            const treatmentId = req.params.id
            await Treatments.updateOne({_id:treatmentId},req.body)
            res.status(200).json("Update success")
        } catch (error) {
            res.status(200).json("Update fail")
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
}

module.exports.Delete= async function (req,res) {
    if(req.permission.permission.includes("treatment_delete")){
        try {
            await Treatments.findByIdAndDelete(req.params.id)
    
            res.status(200).json("Xóa thành công")
        } catch (error) {
            res.status(400).json("Xóa thất baih")
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
}
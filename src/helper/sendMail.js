const nodeMailer = require("nodemailer")

module.exports.sendMail = (email,subject,html) =>{
    const transporter = nodeMailer.createTransport({
        service:'gmail',
        auth:{
            user: 'truong10032k@gmail.com',
            pass: 'kdjc rcuo tawk pnup'
        }
    })

    const mailOption = {
        form:'truong10032k@gmail.com',
        to:email,
        subject:subject,
        html:html
    }

    transporter.sendMail(mailOption,function(error,info){
        if(error){
            console.log(error)
        }else{
            console.log('Email sent: ' + info.response)
        }
    })


}
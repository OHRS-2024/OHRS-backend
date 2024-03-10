const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASS 
    }
});

function sendCodeToEmail(email, code, timeOutCallBack) {
    
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Verification Code',
        text: `Your verification code is: ${code}`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
            setTimeout(() => {
                console.log('Waited for 60 seconds...');
                timeOutCallBack();
            }, 120000);
        }
    });
}

module.exports = sendCodeToEmail;
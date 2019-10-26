const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

sendWelcomeMail = (email,name) => {
    const msg = {
        to: email,
        from: 'miketsubasa96@gmail.com',
        subject: 'welcome to Task APP',
        text: `Hi ${name},\nWelcome to the task App and Thank you for choosing Task app`,
      };
      sgMail.send(msg);
}

sendCancellationMail = (email,name)=>{
    const msg = {
        to: email,
        from: 'miketsubasa96@gmail.com',
        subject: 'Requesting Feedback about task App',
        text: `Hi ${name},\n Thank you for choosing task app.we would like to know why you have cancelled your account in task App`,
      };
      sgMail.send(msg);
}

module.exports = {
    sendWelcomeMail,
    sendCancellationMail
}
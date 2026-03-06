import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    // Replace with actual SMTP settings or use a service like SendGrid
    host: process.env.SMTP_HOST || "smtp.example.com",
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_USER || "your-email@example.com",
        pass: process.env.SMTP_PASS || "your-email-password",
    },
});

export const sendRegistrationEmail = async (userEmail, eventTitle) => {
    try {
        const mailOptions = {
            from: '"Event Platform" <no-reply@eventplatform.com>',
            to: userEmail,
            subject: `Ticket Confirmed: ${eventTitle}`,
            text: `You have successfully registered for ${eventTitle}. See you there!`,
            html: `<p>You have successfully registered for <strong>${eventTitle}</strong>. See you there!</p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Registration email sent to ${userEmail}`);
    } catch (error) {
        console.error("Error sending registration email:", error);
    }
};

export const sendReminderEmail = async (userEmail, eventTitle, eventDate) => {
    try {
        const mailOptions = {
            from: '"Event Platform" <no-reply@eventplatform.com>',
            to: userEmail,
            subject: `Reminder: ${eventTitle} is coming up!`,
            text: `Just a reminder that you are registered for ${eventTitle} on ${new Date(eventDate).toDateString()}.`,
            html: `<p>Just a reminder that you are registered for <strong>${eventTitle}</strong> on ${new Date(eventDate).toDateString()}.</p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent to ${userEmail}`);
    } catch (error) {
        console.error("Error sending reminder email:", error);
    }
};

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

async function testEmail() {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    try {
        await transporter.verify();
        console.log('✅ Nodemailer configuration is correct. SMTP connection established.');

        // Send a test email to the same address
        const info = await transporter.sendMail({
            from: `"Test Script" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: 'Test Email from Nodemailer',
            text: 'If you are reading this, the email credentials in .env.local are correct and working!'
        });

        console.log('✅ Test email sent to:', process.env.EMAIL_USER);
    } catch (err) {
        console.error('❌ Failed to connect or send:', err.message);
    }
}

testEmail();

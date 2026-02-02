require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));

// Serve index.html from pages directory for root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'index.html'));
});

// Health check endpoint to verify DeepSeek API availability
app.get('/api/health', async (req, res) => {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
        return res.json({
            status: 'offline',
            message: 'DeepSeek API key not configured.'
        });
    }
    res.json({
        status: 'online',
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat'
    });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }

        const apiKey = process.env.DEEPSEEK_API_KEY;
        if (!apiKey || apiKey === 'your_api_key_here') {
            return res.status(500).json({
                error: 'Configuration error',
                message: 'DeepSeek API key not configured.'
            });
        }

        const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions';
        const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

        const response = await axios.post(apiUrl, {
            model,
            messages,
            stream: false
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            timeout: 30000
        });

        // DeepSeek uses OpenAI-compatible format, so response is already in the right structure
        res.json(response.data);
    } catch (error) {
        console.error('DeepSeek API Error:', error.message);

        if (error.response) {
            console.error('Error Response:', error.response.data);
            const status = error.response.status;
            let message = 'The chat service is currently unavailable.';

            if (status === 401) {
                message = 'Invalid API key. Please check your DeepSeek API key.';
            } else if (status === 429) {
                message = 'Rate limit exceeded. Please try again later.';
            } else if (status === 503) {
                message = 'DeepSeek service is temporarily unavailable.';
            }

            res.status(status).json({ error: 'DeepSeek API error', message });
        } else if (error.code === 'ECONNABORTED') {
            res.status(504).json({
                error: 'Timeout',
                message: 'Request timed out. Please try again.'
            });
        } else {
            res.status(500).json({
                error: 'Server error',
                message: error.message
            });
        }
    }
});

// Contact form email endpoint
const nodemailer = require('nodemailer');

// Create transporter for Gmail
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'Please fill in all fields: name, email, subject, and message'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email format',
                message: 'Please provide a valid email address'
            });
        }

        // Check if email credentials are configured
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            console.error('Email credentials not configured in environment variables');
            return res.status(500).json({
                error: 'Email service not configured',
                message: 'Contact form is currently unavailable. Please try again later.'
            });
        }

        const transporter = createTransporter();
        
        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
            replyTo: email,
            subject: `Portfolio Contact: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">New Contact Form Submission</h2>
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>From:</strong> ${name} (${email})</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <p><strong>Message:</strong></p>
                        <div style="background-color: white; padding: 15px; border-left: 4px solid #007bff; margin-top: 10px;">
                            ${message.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                    <p style="color: #666; font-size: 12px;">
                        This email was sent from your portfolio website contact form.
                    </p>
                </div>
            `,
            text: `New contact form submission:\n\nFrom: ${name} (${email})\nSubject: ${subject}\n\nMessage:\n${message}`
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);

        res.json({
            success: true,
            message: 'Message sent successfully! I\'ll get back to you soon.'
        });

    } catch (error) {
        console.error('Email sending error:', error);
        
        // Provide user-friendly error messages
        let errorMessage = 'Failed to send message. Please try again later.';
        if (error.code === 'EAUTH') {
            errorMessage = 'Email authentication failed. Please check email configuration.';
        } else if (error.code === 'ECONNECTION') {
            errorMessage = 'Unable to connect to email service. Please check your internet connection.';
        }

        res.status(500).json({
            error: 'Email sending failed',
            message: errorMessage
        });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

exports.sendContactMessage = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, subject, message, contactMethod } = req.body;
        const fullName = `${firstName} ${lastName}`;

        // 1. Save to Database
        const newMessage = new Contact({ firstName, lastName, email, phone, subject, message, contactMethod });
        await newMessage.save();

        // 2. Setup Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        // 3. Coach Email (Notification)
        const coachMail = {
            from: process.env.EMAIL_USER,
            to: process.env.COACH_RECEIVER_EMAIL,
            subject: `INQUIRY: ${subject} | ${fullName}`,
            html: `
                <div style="background-color: #050505; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; border: 1px solid rgba(212, 255, 0, 0.2); border-radius: 24px; overflow: hidden; background-color: #0a0a0a;">
                        
                        <div style="background-color: #D4FF00; padding: 20px; text-align: center;">
                            <h1 style="color: #000000; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 4px; font-weight: 900; font-style: italic;">
                                New Contact Brief
                            </h1>
                        </div>

                        <div style="padding: 40px;">
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 10px 0; text-transform: uppercase; font-style: italic; letter-spacing: -1px;">
                                    Member <span style="color: #D4FF00;">Inquiry</span>
                                </h2>
                                <div style="border-bottom: 1px solid #1F1F1F; padding-bottom: 20px; margin-bottom: 20px;">
                                    <p style="font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 2px; margin: 0;">SUBJECT</p>
                                    <p style="font-size: 16px; color: #D4FF00; font-weight: bold; margin: 5px 0 0 0;">${subject}</p>
                                </div>
                            </div>

                            <div style="background: #111; padding: 25px; border-radius: 16px; margin-bottom: 30px; border-left: 4px solid #D4FF00;">
                                <p style="font-size: 10px; color: #D4FF00; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0;">Sender Details</p>
                                <h3 style="font-size: 20px; margin: 0; color: #ffffff;">${fullName}</h3>
                                <p style="font-size: 13px; color: #888; margin: 5px 0 0 0;">${email} ${phone ? '| ' + phone : ''}</p>
                                
                                <p style="margin: 20px 0 0 0;">
                                    <a href="${contactMethod === 'whatsapp' ? 'https://wa.me/' + phone : 'mailto:' + email}" 
                                    style="background-color: #D4FF00; color: #000; padding: 10px 20px; text-decoration: none; font-weight: bold; font-size: 11px; text-transform: uppercase; border-radius: 30px; display: inline-block; letter-spacing: 1px;">
                                        Quick Reply via ${contactMethod}
                                    </a>
                                </p>
                            </div>

                            <div style="margin-bottom: 30px;">
                                <h4 style="font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0;">Message_Content</h4>
                                <div style="background: #000; border: 1px solid #1F1F1F; padding: 25px; border-radius: 12px; color: #ffffff; font-size: 14px; font-style: italic; line-height: 1.8;">
                                    "${message}"
                                </div>
                            </div>

                        </div>
                        
                        <div style="background-color: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #1F1F1F;">
                            <p style="font-size: 9px; color: #444; text-transform: uppercase; letter-spacing: 2px; margin: 0;">
                                Archon Glyca Inbound Communication System
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        // 4. User Email (Confirmation)
        const userMail = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Message Received | Archon Glyca Fitness',
            html: `
                <div style="background-color: #050505; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; border: 1px solid rgba(212, 255, 0, 0.1); border-radius: 32px; overflow: hidden; background-color: #0a0a0a; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                        
                        <div style="background-color: #0a0a0a; padding: 30px; text-align: center; border-bottom: 1px solid #1a1a1a;">
                            <h1 style="color: #D4FF00; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 6px; font-weight: 900; font-style: italic;">
                                Archon Glyca
                            </h1>
                        </div>

                        <div style="padding: 50px 40px; text-align: center;">
                            <div style="width: 80px; height: 80px; background: rgba(212, 255, 0, 0.1); border: 1px solid #D4FF00; border-radius: 50%; margin: 0 auto 30px; display: table;">
                                <span style="display: table-cell; vertical-align: middle; color: #D4FF00; font-size: 32px;">✓</span>
                            </div>

                            <h2 style="font-size: 28px; font-weight: 800; text-transform: uppercase; font-style: italic; letter-spacing: -1px; margin-bottom: 10px;">
                                Inquiry <span style="color: #D4FF00;">Received</span>
                            </h2>
                            
                            <p style="color: #888; font-size: 14px; margin-bottom: 40px; text-transform: uppercase; letter-spacing: 1px;">
                                Hello ${firstName}, we've got your message!
                            </p>

                            <div style="background: #111; border-radius: 24px; padding: 30px; margin-bottom: 40px; text-align: left;">
                                <div style="margin-bottom: 20px;">
                                    <p style="font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 5px 0;">Subject</p>
                                    <p style="font-size: 18px; color: #D4FF00; font-weight: bold; margin: 0;">${subject}</p>
                                </div>
                                
                                <div style="border-top: 1px solid #1f1f1f; padding-top: 20px;">
                                    <p style="font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 5px 0;">Status</p>
                                    <p style="font-size: 16px; color: #ffffff; font-weight: bold; margin: 0;">Awaiting Review</p>
                                </div>
                            </div>

                            <div style="text-align: left; padding: 0 10px;">
                                <h4 style="font-size: 12px; color: #ffffff; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0;">What Happens Next:</h4>
                                <ul style="padding: 0; margin: 0; list-style: none; font-size: 13px; color: #666;">
                                    <li style="margin-bottom: 12px;">
                                        <span style="color: #D4FF00; margin-right: 10px;">▶</span> 
                                        Our team will review your inquiry details.
                                    </li>
                                    <li style="margin-bottom: 12px;">
                                        <span style="color: #D4FF00; margin-right: 10px;">▶</span> 
                                        A coach will reach out via your preferred method (${contactMethod}).
                                    </li>
                                    <li style="margin-bottom: 12px;">
                                        <span style="color: #D4FF00; margin-right: 10px;">▶</span> 
                                        Expect a response within the next 24 business hours.
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div style="background-color: #0d0d0d; padding: 30px; text-align: center; border-top: 1px solid #1a1a1a;">
                            <p style="font-size: 10px; color: #333; text-transform: uppercase; letter-spacing: 3px; margin: 0 0 10px 0;">
                                Archon Glyca
                            </p>
                            <p style="font-size: 11px; color: #555; margin: 0;">
                                This is an automated receipt. Please do not reply directly to this email.
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(coachMail);
        await transporter.sendMail(userMail);

        res.status(200).json({ message: 'Success' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
const Feedback = require('../models/Feedback');
const nodemailer = require('nodemailer');

exports.submitFeedback = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, program, city, enrollmentDate, rating, feedback } = req.body;
        const fullName = `${firstName} ${lastName}`;

        // 1. Save to Database
        const newFeedback = new Feedback({
            firstName, lastName, email, phone, program, city, enrollmentDate, rating, feedback
        });
        await newFeedback.save();

        // 2. Setup Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        // 3. Coach Email (Notification)
        const coachMail = {
            from: process.env.EMAIL_USER,
            to: process.env.COACH_RECEIVER_EMAIL,
            subject: `NEW FEEDBACK: ${program} | ${fullName}`,
            html: `
                <div style="background-color: #050505; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; border: 1px solid rgba(212, 255, 0, 0.2); border-radius: 24px; overflow: hidden; background-color: #0a0a0a;">
                        
                        <div style="background-color: #D4FF00; padding: 20px; text-align: center;">
                            <h1 style="color: #000000; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 4px; font-weight: 900; font-style: italic;">
                                New Member Feedback
                            </h1>
                        </div>

                        <div style="padding: 40px;">
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 10px 0; text-transform: uppercase; font-style: italic; letter-spacing: -1px;">
                                    Session <span style="color: #D4FF00;">Review</span>
                                </h2>
                                <div style="border-bottom: 1px solid #1F1F1F; padding-bottom: 20px; margin-bottom: 20px;">
                                    <p style="font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 2px; margin: 0;">PROGRAM</p>
                                    <p style="font-size: 16px; color: #D4FF00; font-weight: bold; margin: 5px 0 0 0;">${program}</p>
                                </div>
                            </div>

                            <div style="background: #111; padding: 25px; border-radius: 16px; margin-bottom: 30px; border-left: 4px solid #D4FF00;">
                                <p style="font-size: 10px; color: #D4FF00; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0;">Member Details</p>
                                <h3 style="font-size: 20px; margin: 0; color: #ffffff;">${fullName}</h3>
                                <p style="font-size: 13px; color: #888; margin: 5px 0 0 0;">${email} ${phone ? '| ' + phone : ''}</p>
                                <p style="font-size: 13px; color: #888; margin: 5px 0 0 0;">City: ${city} | Joined: ${enrollmentDate}</p>
                            </div>

                            <div style="margin-bottom: 30px;">
                                <h4 style="font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0;">Rating & Feedback</h4>
                                <p style="font-size: 24px; color: #D4FF00; font-weight: bold; margin: 0 0 10px 0;">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</p>
                                <div style="background: #000; border: 1px solid #1F1F1F; padding: 25px; border-radius: 12px; color: #ffffff; font-size: 14px; font-style: italic; line-height: 1.8;">
                                    "${feedback}"
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        };

        // 4. User Email (Confirmation)
        const userMail = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank You for Your Feedback | Archon Glyca Fitness',
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
                                Feedback <span style="color: #D4FF00;">Received</span>
                            </h2>
                            
                            <p style="color: #888; font-size: 14px; margin-bottom: 40px; text-transform: uppercase; letter-spacing: 1px;">
                                Hello ${firstName}, thank you for sharing your experience!
                            </p>

                            <div style="background: #111; border-radius: 24px; padding: 30px; margin-bottom: 40px; text-align: left;">
                                <p style="font-size: 14px; color: #ccc; line-height: 1.6;">
                                    We truly appreciate your feedback on the <strong>${program}</strong>. Your insights help us improve and provide the best fitness experience for everyone.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        };


        await transporter.sendMail(coachMail);
        await transporter.sendMail(userMail);

        res.status(200).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error("Feedback Submission Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

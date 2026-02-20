const Booking = require('../models/Booking');
const User = require('../models/User');
const nodemailer = require('nodemailer');

exports.bookSession = async (req, res) => {
    try {
        const { userId, fullName, whatsappNumber, appointmentRegarding, preferredLanguage, date } = req.body;

        // 2. Validate environment variables before proceeding
        if (!process.env.EMAIL_USER || !process.env.COACH_RECEIVER_EMAIL) {
            throw new Error("Missing Email Configuration in .env");
        }

        const booking = new Booking({
            userId, fullName, whatsappNumber, appointmentRegarding, preferredLanguage, date
        });
        await booking.save();

        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({ message: 'User profile not found.' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Use the friendly Training labels in the email
        const coachMail = {
            from: process.env.EMAIL_USER,
            to: process.env.COACH_RECEIVER_EMAIL,
            subject: `NEW TRAINING SESSION: ${appointmentRegarding} | ${fullName}`,
            html: `
                <div style="background-color: #050505; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; border: 1px solid rgba(212, 255, 0, 0.2); border-radius: 24px; overflow: hidden; background-color: #0a0a0a;">
                        <div style="background-color: #D4FF00; padding: 20px; text-align: center;">
                            <h1 style="color: #000000; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 4px; font-weight: 900; font-style: italic;">
                                Training Session Brief
                            </h1>
                        </div>

                        <div style="padding: 40px;">
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 10px 0; text-transform: uppercase; font-style: italic; letter-spacing: -1px;">
                                    New Session <span style="color: #D4FF00;">Confirmed</span>
                                </h2>
                                <div style="display: flex; gap: 20px; border-bottom: 1px solid #1F1F1F; padding-bottom: 20px; margin-bottom: 20px;">
                                    <div style="flex: 1;">
                                        <p style="font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Goal_Selected</p>
                                        <p style="font-size: 16px; color: #D4FF00; font-weight: bold; margin: 5px 0 0 0;">${appointmentRegarding}</p>
                                    </div>
                                    <div style="flex: 1;">
                                        <p style="font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Schedule</p>
                                        <p style="font-size: 16px; color: #ffffff; font-weight: bold; margin: 5px 0 0 0;">${date}</p>
                                    </div>
                                </div>
                            </div>

                            <div style="background: #111; padding: 25px; border-radius: 16px; margin-bottom: 30px; border-left: 4px solid #D4FF00;">
                                <p style="font-size: 10px; color: #D4FF00; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0;">Client_Identity</p>
                                <h3 style="font-size: 20px; margin: 0; color: #ffffff;">${fullName}</h3>
                                <p style="margin: 10px 0 0 0;">
                                    <a href="https://wa.me/${whatsappNumber}" style="color: #D4FF00; text-decoration: none; font-weight: bold; font-size: 14px;">
                                        <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" width="14" style="vertical-align: middle; margin-right: 5px;"> 
                                        Open_WhatsApp_Direct
                                    </a>
                                </p>
                                <p style="font-size: 12px; color: #666; margin-top: 5px;">Preferred Language: ${preferredLanguage}</p>
                            </div>

                            <div style="margin-bottom: 30px;">
                                <h4 style="font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0;">Fitness_Snapshot</h4>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 10px 0; border-bottom: 1px solid #1F1F1F; color: #888; font-size: 13px;">Primary Goal</td>
                                        <td style="padding: 10px 0; border-bottom: 1px solid #1F1F1F; text-align: right; color: #ffffff; font-weight: bold;">${userData.primaryGoal}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; border-bottom: 1px solid #1F1F1F; color: #888; font-size: 13px;">Body Metrics</td>
                                        <td style="padding: 10px 0; border-bottom: 1px solid #1F1F1F; text-align: right; color: #ffffff; font-weight: bold;">${userData.weightKg}kg / ${userData.heightCm}cm</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; border-bottom: 1px solid #1F1F1F; color: #888; font-size: 13px;">Training Experience</td>
                                        <td style="padding: 10px 0; border-bottom: 1px solid #1F1F1F; text-align: right; color: #ffffff; font-weight: bold;">${userData.experienceLevel}</td>
                                    </tr>
                                </table>
                            </div>

                            <div>
                                <h4 style="font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0;">Coaching_Notes</h4>
                                <pre style="background: #000; border: 1px solid #1F1F1F; padding: 20px; border-radius: 12px; color: #D4FF00; font-size: 11px; overflow-x: auto; white-space: pre-wrap;">${JSON.stringify(userData.profileDetails, null, 2)}</pre>
                            </div>
                        </div>
                        
                        <div style="background-color: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #1F1F1F;">
                            <p style="font-size: 9px; color: #444; text-transform: uppercase; letter-spacing: 2px; margin: 0;">
                                Archana_Sah_Fitness_Studio // Official_Training_Slot
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        // 5. Construct User Email (Confirmation)
        const userMail = {
            from: process.env.EMAIL_USER,
            to: userData.email,
            subject: 'Training Session Confirmed | Archana Sah Fitness',
            html: `
                <div style="background-color: #050505; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; border: 1px solid rgba(212, 255, 0, 0.1); border-radius: 32px; overflow: hidden; background-color: #0a0a0a; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                        
                        <div style="background-color: #0a0a0a; padding: 30px; text-align: center; border-bottom: 1px solid #1a1a1a;">
                            <h1 style="color: #D4FF00; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 6px; font-weight: 900; font-style: italic;">
                                Archana_Sah // Fitness_Studio
                            </h1>
                        </div>

                        <div style="padding: 50px 40px; text-align: center;">
                            <div style="width: 80px; height: 80px; background: rgba(212, 255, 0, 0.1); border: 1px solid #D4FF00; border-radius: 50%; margin: 0 auto 30px; display: table;">
                                <span style="display: table-cell; vertical-align: middle; color: #D4FF00; font-size: 32px;">✓</span>
                            </div>

                            <h2 style="font-size: 28px; font-weight: 800; text-transform: uppercase; font-style: italic; letter-spacing: -1px; margin-bottom: 10px;">
                                Session_<span style="color: #D4FF00;">Confirmed</span>
                            </h2>
                            
                            <p style="color: #888; font-size: 14px; margin-bottom: 40px; text-transform: uppercase; letter-spacing: 1px;">
                                Your transformation journey has begun, ${fullName}!
                            </p>

                            <div style="background: #111; border-radius: 24px; padding: 30px; margin-bottom: 40px; text-align: left;">
                                <div style="margin-bottom: 20px;">
                                    <p style="font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 5px 0;">Focus_Area</p>
                                    <p style="font-size: 18px; color: #D4FF00; font-weight: bold; margin: 0;">${appointmentRegarding}</p>
                                </div>
                                
                                <div style="border-top: 1px solid #1f1f1f; padding-top: 20px;">
                                    <p style="font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 5px 0;">Training_Date</p>
                                    <p style="font-size: 16px; color: #ffffff; font-weight: bold; margin: 0;">${date}</p>
                                </div>
                            </div>

                            <div style="text-align: left; padding: 0 10px;">
                                <h4 style="font-size: 12px; color: #ffffff; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0;">Next_Steps:</h4>
                                <ul style="padding: 0; margin: 0; list-style: none; font-size: 13px; color: #666;">
                                    <li style="margin-bottom: 12px;">
                                        <span style="color: #D4FF00; margin-right: 10px;">▶</span> 
                                        Coach Archana will review your fitness profile and goals.
                                    </li>
                                    <li style="margin-bottom: 12px;">
                                        <span style="color: #D4FF00; margin-right: 10px;">▶</span> 
                                        You will receive a WhatsApp message on <b>${whatsappNumber}</b>.
                                    </li>
                                    <li style="margin-bottom: 12px;">
                                        <span style="color: #D4FF00; margin-right: 10px;">▶</span> 
                                        A session meeting link will be shared before your start time.
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div style="background-color: #0d0d0d; padding: 30px; text-align: center; border-top: 1px solid #1a1a1a;">
                            <p style="font-size: 10px; color: #333; text-transform: uppercase; letter-spacing: 3px; margin: 0 0 10px 0;">
                                Official_Training_Notification
                            </p>
                            <p style="font-size: 11px; color: #555; margin: 0;">
                                This is an automated session confirmation. Please do not reply directly to this email.
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(coachMail);
        await transporter.sendMail(userMail);

        res.status(200).json({ message: 'Authorized' });
    } catch (error) {
        // This log will show you the exact reason in your terminal
        console.error("BOOKING_ERROR_LOG:", error.message);
        res.status(500).json({ message: 'Booking Error', error: error.message });
    }
};

// --- 02: Fetch Occupied Slots ---
exports.getOccupiedSlots = async (req, res) => {
    try {
        const { date } = req.params;
        const appointments = await Booking.find({ date });
        res.status(200).json(appointments.map(a => a.timeSlot));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching slots', error: error.message });
    }
};

// --- 03: Admin: Fetch All Bookings ---
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Get All Bookings Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
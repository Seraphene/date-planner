import { NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import nodemailer from 'nodemailer';
import { PDFLayout } from '@/lib/pdf-generator';
import { getQuestions } from '@/lib/questions';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(request: Request) {
    try {
        const { session } = await request.json();

        if (!session) {
            return NextResponse.json({ error: 'No session data provided' }, { status: 400 });
        }

        // Fetch questions for PDF generation
        const questions = await getQuestions();

        // 1. Save to Firestore (Backup)
        try {
            await addDoc(collection(db, "answers"), session);
        } catch (e) {
            console.error("Firebase save failed:", e);
        }

        // 2. Generate PDF
        const pdfStream = await renderToStream(
            <PDFLayout session={session} questions={questions} />
        );

        const chunks: Uint8Array[] = [];
        for await (const chunk of pdfStream) {
            chunks.push(chunk as Uint8Array);
        }
        const pdfBuffer = Buffer.concat(chunks);

        // 3. Send Email via Gmail SMTP (App Password)
        const rawGmailUser = process.env.GMAIL_USER || '';
        const rawAdminEmail = process.env.ADMIN_EMAIL || process.env.admin_email || rawGmailUser || 'kimandrei012@gmail.com';

        // Defensive: Strictly extract the valid address and lowercase it
        const emailRegex = /([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4})/i;
        const GMAIL_USER = rawGmailUser.match(emailRegex)?.[1]?.toLowerCase();
        const ADMIN_EMAIL = rawAdminEmail.match(emailRegex)?.[1]?.toLowerCase() || 'kimandrei012@gmail.com';

        const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

        console.log("📨 Attempting to send email via Gmail (SMTP)...");
        console.log("📍 To:", ADMIN_EMAIL);

        if (GMAIL_USER && GMAIL_APP_PASSWORD) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: GMAIL_USER,
                    pass: GMAIL_APP_PASSWORD,
                },
            });

            const mailOptions = {
                from: `"Pastel Planner" <${GMAIL_USER}>`,
                to: ADMIN_EMAIL,
                subject: 'New Date Plan Submitted! ❤️',
                html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #4A4A4A;">
                        <h2 style="color: #FFD1DC;">She has spoken! ❤️</h2>
                        <p>Hi there!</p>
                        <p>A new date plan has been submitted. Check the attached PDF for all the sweet details.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #999;">Sent with love from your Date Planner App</p>
                    </div>
                `,
                attachments: [
                    {
                        filename: 'date-plan.pdf',
                        content: pdfBuffer,
                    },
                ],
            };

            const info = await transporter.sendMail(mailOptions);
            console.log("✅ Gmail Sent (SMTP): %s", info.messageId);
        } else {
            console.warn("⚠️ Missing Gmail credentials in .env. Falling back to log simulation.");
            console.log("Simulating Email Send with PDF size:", pdfBuffer.length);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Submission processing error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { Resend } from 'resend';
import { PDFLayout } from '@/lib/pdf-generator';
import { getQuestions } from '@/lib/questions';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

// Initialize Resend with env variable
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

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
            // We continue even if firebase fails, to ensure email sends
        }

        // 2. Generate PDF
        const pdfStream = await renderToStream(
            <PDFLayout session={session} questions={questions} />
        );

        // Convert stream to buffer for attachment
        // Note: react-pdf renderToStream returns a NodeJS.ReadableStream
        const chunks: Uint8Array[] = [];
        for await (const chunk of pdfStream) {
            chunks.push(chunk as Uint8Array);
        }
        const pdfBuffer = Buffer.concat(chunks);


        // 3. Send Email
        // Only send if we have an API key, otherwise just log (dev mode)
        if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
                from: 'Date Planner <onboarding@resend.dev>', // Update this with your verified domain
                to: [process.env.admin_email || 'kimandrei012@gmail.com'],
                subject: 'New Date Plan Submitted! ❤️',
                html: '<p>She has spoken! Check the attached PDF for the details.</p>',
                attachments: [
                    {
                        filename: 'date-plan.pdf',
                        content: pdfBuffer,
                    },
                ],
            });
        } else {
            console.log("Simulating Email Send with PDF size:", pdfBuffer.length);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Submission processing error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

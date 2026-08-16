import type { Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../lib/prisma.js';

export const razorpayWebhook = async (req: Request, res: Response) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
        const signature = req.headers['x-razorpay-signature'] as string;
        const rawBody = req.body as Buffer; // raw Buffer, thanks to express.raw() above

        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(rawBody)
            .digest('hex');

        if (expectedSignature !== signature) {
            console.log('Webhook signature mismatch');
            return res.status(400).json({ message: 'Invalid signature' });
        }

        const event = JSON.parse(rawBody.toString());
        if (event.event === 'payment.captured') {
            const payment = event.payload.payment.entity;
            const orderId = payment.order_id;
            const paymentId = payment.id;

            const transaction = await prisma.transaction.findFirst({ where: { orderId } });

            if (!transaction) {
                console.log('Webhook: no matching transaction for', orderId);
                return res.status(200).json({ message: 'Transaction not found, ignoring' });
            }

            if (transaction.isPaid) {
                return res.status(200).json({ message: 'Already processed' });
            }

            await prisma.transaction.update({
                where: { id: transaction.id },
                data: { isPaid: true, paymentId }
            });

            await prisma.user.update({
                where: { id: transaction.userId },
                data: { credits: { increment: transaction.credits } }
            });

        }

        res.status(200).json({ status: 'ok' });

    } catch (error: any) {
        console.log('Webhook error:', error.message);
        res.status(500).json({ message: error.message });
    }
};
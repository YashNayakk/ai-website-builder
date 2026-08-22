import 'dotenv/config'
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma.js";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const trustedOrigins = process.env.TRUSTED_URL?.split(',') || [];

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,

        sendResetPassword: async ({ user, url }) => {
            await resend.emails.send({
                from: 'Buildora by orche <onboarding@resend.dev>', // swap to your verified domain later
                to: user.email,
                subject: 'Reset your password',
                html: `
                    <div style="font-family: sans-serif; padding: 20px;">
                        <h2>Reset your password</h2>
                        <p>Click the link below to set a new password. This link expires shortly, so use it soon.</p>
                        <a href="${url}" style="display:inline-block;padding:10px 20px;background:#6366f1;color:#fff;border-radius:6px;text-decoration:none;">Reset Password</a>
                        <p>If you didn't request this, you can safely ignore this email.</p>
                    </div>
                `,
            });
        },
    },

    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            await resend.emails.send({
                from: 'Buildora by orche <onboarding@resend.dev>',
                to: user.email,
                subject: 'Verify your email address',
                html: `
                    <div style="font-family: sans-serif; padding: 20px;">
                        <h2>Verify your email</h2>
                        <p>Click the link below to verify your email address:</p>
                        <a href="${url}" style="display:inline-block;padding:10px 20px;background:#6366f1;color:#fff;border-radius:6px;text-decoration:none;">Verify Email</a>
                        <p>If you didn't create an account, you can ignore this email.</p>
                    </div>
                `,
            });
        },
    },
    
    trustedOrigins,
    baseURL: process.env.BETTER_AUTH_URL!,
    secret: process.env.BETTER_AUTH_SECRET!,
    advanced: {
        cookies: {
            session_token: {
                name: 'auth_session',
                attributes: {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    path: '/', 
                }
            }
        }
    }
});
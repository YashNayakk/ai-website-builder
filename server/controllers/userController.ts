import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import openai from '../configs/openai.js';
import razorpay from '../configs/razorpay.js';
import crypto from 'crypto';

interface Plan {
    credits: number;
    amount: number;
}

const plans: Record<string, Plan> = {
    basic: { credits: 100, amount: 5 },
    pro: { credits: 400, amount: 19 },
    enterprise: { credits: 1000, amount: 49 },
}
//user credit
export const getUserCredits = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })
        res.json({ credits: user?.credits })
    } catch (error: any) {
        console.log(error.code || error.message);
        res.status(500).json({ message: error.message });
    }
}

export const createUserProject = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        const { initial_prompt } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })
        if (user && user.credits < 5) {
            return res.status(403).json({ message: 'add credits to create more projects' })
        }

        //create a new project
        const project = await prisma.websiteProject.create({
            data: {
                name: initial_prompt.length > 50 ? initial_prompt.substring(0, 47)
                    + '...' : initial_prompt,
                initial_prompt,
                userId
            }
        })

        await prisma.user.update({
            where: { id: userId },
            data: { totalCreation: { increment: 1 } }
        })

        await prisma.conversation.create({
            data: {
                role: 'user',
                content: initial_prompt,
                projectId: project.id
            }
        })

        await prisma.user.update({
            where: { id: userId },
            data: { credits: { decrement: 5 } }
        })
        res.json({ projectId: project.id })

        //enchance user prompt
        const promptEnhanceRes = await openai.chat.completions.create({
            model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
            messages: [
                {
                    role: 'system',
                    content: `
                    You are a prompt enhancement specialist. Take the user's website request and expand it into a detailed, comprehensive prompt that will help create the best possible website.

                 Enhance this prompt by:
                 1. Adding specific design details (layout, color scheme, typography)
                 2. Specifying key sections and features
                 3. Describing the user experience and interactions
                 4. Including modern web design best practices
                 5. Mentioning responsive design requirements
                 6. Adding any missing but important elements

                Return ONLY the enhanced prompt, nothing else.
                Make it detailed but concise (2-3 paragraphs max).`
                },

                {
                    role: 'user',
                    content: initial_prompt
                }
            ]
        })

        const enhancedPrompt = promptEnhanceRes.choices[0]?.message.content;

        await prisma.conversation.create({
            data: {
                role: 'assistant',
                content: `I've enhanced your prompt to: ${enhancedPrompt}`,
                projectId: project.id
            }
        })

        await prisma.conversation.create({
            data: {
                role: 'assistant',
                content: 'Now genrating your website ...',
                projectId: project.id
            }
        })

        //generate web code
        const codeGenerationRes = await openai.chat.completions.create({
            model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
            messages: [
                {
                    role: 'system',
                    content: `
                    You are an expert web developer. Create a complete, production-ready, single-page website based on this request: "${enhancedPrompt}"

                 CRITICAL REQUIREMENTS:
                    - You MUST output valid HTML ONLY. 
                 - Use Tailwind CSS for ALL styling
                  - Include this EXACT script in the <head>: <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
                 - Use Tailwind utility classes extensively for styling, animations, and responsiveness
                 - Make it fully functional and interactive with JavaScript in <script> tag before closing </body>
                 - Use modern, beautiful design with great UX using Tailwind classes
                 - Make it responsive using Tailwind responsive classes (sm:, md:, lg:, xl:)
                  - Use Tailwind animations and transitions (animate-*, transition-*)
                 - Include all necessary meta tags
                 - Use Google Fonts CDN if needed for custom fonts
                 - Use placeholder images from https://placehold.co/600x400
                  - Use Tailwind gradient classes for beautiful backgrounds
                 - Make sure all buttons, cards, and components use Tailwind styling

                  CRITICAL HARD RULES:
                  1. You MUST put ALL output ONLY into message.content.
                    2. You MUST NOT place anything in "reasoning", "analysis", "reasoning_details", or any hidden fields.
                 3. You MUST NOT include internal thoughts, explanations, analysis, comments, or markdown.
                 4. Do NOT include markdown, explanations, notes, or code fences.

                 The HTML should be complete and ready to render as-is with Tailwind CSS.`
                },
                {
                    role: 'user',
                    content: enhancedPrompt || ''
                }
            ]
        })

        const code = codeGenerationRes.choices[0]?.message.content || '';

        if (!code) {
            await prisma.conversation.create({
                data: {
                    role: 'assistant',
                    content: "Unable to generate the code, please try again",
                    projectId: project.id,
                }
            })
            await prisma.user.update({
                where: { id: userId },
                data: { credits: { increment: 5 } }
            })
            return;
        }

        //create version for project
        const version = await prisma.version.create({
            data: {
                code: code.replace(/```[a-z]*\n?/gi, '')
                    .replace(/```$/g, '')
                    .trim(),
                description: 'Initial version',
                projectId: project.id
            }
        })

        await prisma.conversation.create({
            data: {
                role: 'assistant',
                content: "I've created your website! you can now preview it and request any changes",
                projectId: project.id
            }
        })

        await prisma.websiteProject.update({
            where: { id: project.id },
            data: {
                current_code: code.replace(/```[a-z]*\n?/gi, '')
                    .replace(/```$/g, '')
                    .trim(),
                current_version_index: version.id
            }
        })

    } catch (error: any) {
        await prisma.user.update({
            where: { id: userId! },
            data: { credits: { increment: 5 } }
        })
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

//controller fun to get a single user project
export const getUserProject = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { projectId } = req.params;

        const project = await prisma.websiteProject.findUnique({
            where: { id: projectId, userId },
            include: {
                conversation: {
                    orderBy: { timestamp: 'asc' }
                },
                versions: true
            }
        })
        res.json({ project })
    } catch (error: any) {
        console.log(error.code || error.message);
        res.status(500).json({ message: error.message });
    }
}

//controller fun to get all users projects
export const getUserProjects = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const projects = await prisma.websiteProject.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' }
        })
        res.json({ projects })
    } catch (error: any) {
        console.log(error.code || error.message);
        res.status(500).json({ message: error.message });
    }
}

export const togglePublish = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { projectId } = req.params;

        const project = await prisma.websiteProject.findUnique({
            where: { id: projectId, userId },

        })

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await prisma.websiteProject.update({
            where: { id: projectId },
            data: { isPublished: !project.isPublished }
        })

        res.json({
            message: project.isPublished ? 'Project Unpublished' :
                'Project Publish Successfully'
        })

    } catch (error: any) {
        console.log(error.code || error.message);
        res.status(500).json({ message: error.message });
    }
}

//controler fun to purchase credits
export const purchaseCredits = async (req: Request, res: Response) => {
    console.log('purchase route hit')
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { planId } = req.body as { planId: keyof typeof plans }
        console.log("planId", planId)
        const plan = plans[planId]
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        console.log("plan", plan)
        console.log('KEY_ID:', process.env.RAZORPAY_KEY_ID)
        console.log('KEY_SECRET exists:', !!process.env.RAZORPAY_KEY_SECRET)

        const order = await razorpay.orders.create({
            amount: Math.round(plan.amount * 100), // paise
            currency: 'INR',
            receipt: `receipt_${userId}_${Date.now()}`,
        });
        console.log("or:", order)

        await prisma.transaction.create({
            data: {
                userId,
                planId,
                amount: plan.amount,
                credits: plan.credits,
                orderId: order.id,
                isPaid: false,
            }
        })

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error: any) {
        console.log('FULL RAZORPAY ERROR:', JSON.stringify(error, null, 2));
        res.status(500).json({ message: error?.error?.description || error.message || 'Unknown error' });
    }
}

//controller for verifying payment
export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const orderId = 'order_TPzg7vjfY1o8yE';   // from your last purchase-credits response
        const paymentId = 'pay_fake_test_123';     // any string, doesn't need to be real for this test
        const signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');

        console.log("signature:", signature);

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');
        console.log("expected:", expectedSignature)

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Payment verification failed' });
        }

        const transaction = await prisma.transaction.findFirst({
            where: { orderId: razorpay_order_id, userId }
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (transaction.isPaid) {
            return res.status(400).json({ message: 'Transaction already processed' });
        }

        await prisma.transaction.update({
            where: { id: transaction.id },
            data: { isPaid: true, paymentId: razorpay_payment_id }
        });

        await prisma.user.update({
            where: { id: userId },
            data: { credits: { increment: transaction.credits } }
        });

        res.json({ message: 'Payment verified, credits added' });
    } catch (error: any) {
        console.log(error.code || error.message);
        res.status(500).json({ message: error.message });
    }
};
import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import openai from '../configs/openai.js';

//conroller for project revision
export const makeRevision = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        const {projectId} = req.params;
        const {message} = req.body;

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!userId || !user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if(user.credits < 5){
            return res.status(403).json({ message: 'add credits to create more projects' })
        }

        if(!message || message.trim() === ''){
            return res.status(400).json({ message: 'please enter a valid prompt' });
        }

        const currentProject = await prisma.websiteProject.findUnique({
            where: { id: projectId, userId },
            include: { versions: true }
        })

        if(!currentProject){
            return res.status(404).json({ message: 'Project not found' });
        }

        await prisma.conversation.create({
            data: {
                role: 'user',
                content: message,
                projectId
            }
        })

        await prisma.user.update({
            where: { id: userId },
            data: {credits: { decrement: 5 }}
        })

        //enhance the project with the new message
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
                    content: `user's request: "&{message}"`
                }
            ]
        })

        const enhancedPrompt = promptEnhanceRes.choices[0]?.message.content;

        await prisma.conversation.create({
            data: {
                role: 'assistant',
                content: `I've enhanced your prompt to: ${enhancedPrompt}`,
                projectId
            }
        })

        await prisma.conversation.create({
            data: {
                role: 'assistant',
                content: 'Now genrating your website ...',
                projectId
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
                    content: `here is the current website code: "${currentProject.current_code}" 
                    and the wants this changes: "${enhancedPrompt}"`
                }
            ]
        })

        const code = codeGenerationRes.choices[0]?.message.content || '';

        //create version for project
        const version = await prisma.version.create({
            data: {
                code: code.replace(/```[a-z]*\n?/gi, '')
                    .replace(/```$/g, '')
                    .trim(),
                description: 'Changes made',
                projectId
            }
        })

        await prisma.conversation.create({
            data: {
                role: 'assistant',
                content: "I've made this changes to your website! you can now preview it",
                projectId
            }
        })

        await prisma.websiteProject.update({
            where: { id: projectId },
            data: {
                current_code: code.replace(/```[a-z]*\n?/gi, '')
                    .replace(/```$/g, '')
                    .trim(),
                current_version_index: version.id
            }
        })

        res.json({ message: "Changes made successfully" })
    } catch (error: any) {
        await prisma.user.update({
            where: { id: userId },
            data: { credits: { increment: 5 } }
        })
        console.log(error.code || error.message);
        res.status(500).json({ message: error.message });
    }
}

//controler for rollback to specific version
export const rollbackVersion = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const {projectId, versionId} = req.params;
        const project = await prisma.websiteProject.findUnique({
            where: { id: projectId, userId },
            include: { versions: true }
        })

        if(!project){
            return res.status(404).json({ message: 'Project not found' });
        }

        const version = project.versions.find((version: any) => version.id === versionId);
        if(!version){
            return res.status(404).json({ message: 'Version not found' });
        }

        await prisma.websiteProject.update({
            where: { id: projectId },
            data: {
                current_code: version.code,
                current_version_index: version.id
            }
        })

        await prisma.conversation.create({
            data: {
                role: 'assistant',
                content: "I've rolled back your website to selected version. You can now preview it",
                projectId
            }
        })

        res.json({ message: "Rolled back to selected version successfully" })
    } catch (error: any) {
        console.log(error.code || error.message);
        res.status(500).json({ message: error.message });
    } 
    
}

//contoller for deleting a project
export const deleteProject = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const {projectId} = req.params;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await prisma.websiteProject.delete({
            where: { id: projectId, userId },
        })

        res.json({ message: "Project deleted successfully" })
    } catch (error: any) {
        console.log(error.code || error.message);
        res.status(500).json({ message: error.message });
    } 
    
}
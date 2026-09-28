import { z } from 'zod';

export const createIdeaSchema = z.object({
  startupName: z.string().trim().min(2, 'Startup name is required.').max(150),
  ideaDescription: z.string().trim().min(20, 'Describe the idea in at least 20 characters.').max(4000),
  problem: z.string().trim().min(10, 'Describe the problem in at least 10 characters.').max(2000),
  targetCustomer: z.string().trim().min(3, 'Target customer is required.').max(500),
  location: z.string().trim().max(200).optional(),
  industry: z.string().trim().min(2, 'Industry is required.').max(150),
  businessModel: z.string().trim().min(3, 'Business model is required.').max(1000),
  expectedPricing: z.string().trim().max(300).optional(),
  existingCompetitors: z.string().trim().max(1000).optional(),
  uniqueSellingProposition: z.string().trim().max(1000).optional(),
  additionalInfo: z.string().trim().max(2000).optional()
});

export type CreateIdeaInput = z.infer<typeof createIdeaSchema>;

export const ideaIdParamsSchema = z.object({
  id: z.string().min(1)
});

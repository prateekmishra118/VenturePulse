import { prisma } from '../database/prisma';
import { ApiError } from '../middleware/errorHandler';
import type { CreateIdeaInput } from '../validators/idea.validators';

export async function createIdea(userId: string, input: CreateIdeaInput) {
  return prisma.startupIdea.create({
    data: { ...input, userId }
  });
}

export async function listIdeas(userId: string) {
  return prisma.startupIdea.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      analyses: {
        select: { id: true, status: true, overallScore: true, verdict: true, createdAt: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });
}

/**
 * Fetches one idea, including its full analysis history. Throws 404 if
 * it doesn't exist OR belongs to a different user — deliberately the
 * same error either way, so a user can't probe for other people's idea
 * IDs by noticing a 403-vs-404 difference.
 */
export async function getIdeaById(userId: string, ideaId: string) {
  const idea = await prisma.startupIdea.findUnique({
    where: { id: ideaId },
    include: {
      analyses: {
        orderBy: { createdAt: 'desc' },
        select: { id: true, status: true, overallScore: true, verdict: true, createdAt: true, completedAt: true }
      }
    }
  });

  if (!idea || idea.userId !== userId) {
    throw new ApiError(404, 'Startup idea not found.');
  }

  return idea;
}

export async function deleteIdea(userId: string, ideaId: string): Promise<void> {
  const idea = await prisma.startupIdea.findUnique({ where: { id: ideaId } });

  if (!idea || idea.userId !== userId) {
    throw new ApiError(404, 'Startup idea not found.');
  }

  await prisma.startupIdea.delete({ where: { id: ideaId } });
}

/**
 * Internal helper used by analysis.service.ts — confirms an idea exists
 * and belongs to userId, and returns it. Throws 404 otherwise.
 */
export async function assertIdeaOwnership(userId: string, ideaId: string) {
  const idea = await prisma.startupIdea.findUnique({ where: { id: ideaId } });
  if (!idea || idea.userId !== userId) {
    throw new ApiError(404, 'Startup idea not found.');
  }
  return idea;
}

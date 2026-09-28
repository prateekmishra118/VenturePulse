import type { Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse';
import * as ideaService from '../services/idea.service';
import type { CreateIdeaInput } from '../validators/idea.validators';

export async function createIdea(req: Request, res: Response): Promise<void> {
  const idea = await ideaService.createIdea(req.user!.userId, req.body as CreateIdeaInput);
  sendSuccess(res, idea, 'Startup idea created.', 201);
}

export async function listIdeas(req: Request, res: Response): Promise<void> {
  const ideas = await ideaService.listIdeas(req.user!.userId);
  sendSuccess(res, ideas, 'Startup ideas retrieved.');
}

export async function getIdea(req: Request, res: Response): Promise<void> {
  const idea = await ideaService.getIdeaById(req.user!.userId, req.params.id);
  sendSuccess(res, idea, 'Startup idea retrieved.');
}

export async function deleteIdea(req: Request, res: Response): Promise<void> {
  await ideaService.deleteIdea(req.user!.userId, req.params.id);
  sendSuccess(res, null, 'Startup idea deleted.');
}

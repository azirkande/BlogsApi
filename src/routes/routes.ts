import express, { Request, Response, Router } from 'express';
import healthCheckController from '../controllers/healthCheck';
import { getPostsByTags } from '../controllers/post' 

export const registerRoutes = (): Router => {
    const router = express.Router();
    router.get('/api/ping',healthCheckController.serverHealthCheck);
    router.get('/api/posts',getPostsByTags);
    return router
};

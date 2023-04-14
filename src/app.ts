
import express, { NextFunction, Request, Response } from 'express';
import { registerRoutes } from './routes/routes';
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const routes = registerRoutes();
app.use('/', routes);

app.use((req: Request, res: Response, next:NextFunction ) => {
    return res.status(404).send({
        error: 'Resource not found'
    })
});

export default app;
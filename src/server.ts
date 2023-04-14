import http from 'http';
import { getServerConfiguration } from './config/config';
import  app from './app';

const config = getServerConfiguration();
const server = http.createServer(app);
server.listen(config.port,() => {console.log(`Server started on port ${config.port}`)});
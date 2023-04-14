import dotenv, { config } from 'dotenv';
import { ApiConfig, serverConfig } from '../types/interfaces';

export const getApiConfigurations = (): ApiConfig => {
    dotenv.config();
    return {
        assessmentApiBaseUrl: process.env.assessmentApiBaseUrl || 'https://api.hatchways.io/assessment'
    }
}

export const getServerConfiguration = (): serverConfig => {
    dotenv.config();
    const PORT = process.env.Port || 1377;
    const HOST_NAME = process.env.HostName || 'localhost';
    
    return  {
        port: PORT,
        hostName : HOST_NAME
    };
}


import dotenv from 'dotenv';

dotenv.config();

export const HTTP_PORT = process.env.HTTP_PORT ? Number(process.env.HTTP_PORT) : 8181;
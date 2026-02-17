import 'dotenv/config';
import express, { Request, Response } from 'express';
import axios, { AxiosRequestConfig, ResponseType } from 'axios';
import winston from 'winston';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import FormData from 'form-data';

const app = express();
const port = process.env.PORT || 3000;
const urlApi = process.env.URL_API;

const upload = multer();

app.use(express.json());

const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, 'logs', 'error.log'),
      level: 'error'
    }),
    new winston.transports.File({
      filename: path.join(__dirname, 'logs', 'combined.log')
    }),
    new winston.transports.Console()
  ]
});

async function getServerPublicIP(): Promise<string | null> {
  try {
    const response = await axios.get<{ ip: string }>('https://api.ipify.org?format=json', {
      timeout: 5000
    });
    return response.data.ip;
  } catch (error) {
    const err = error as Error;
    logger.warn(`No se pudo obtener IP pública del servidor: ${err.message}`);
    return null;
  }
}

app.get('/get-ip', async (_req: Request, res: Response) => {
  try {
    const currentIP = await getServerPublicIP();
    if (currentIP) {
      return res.json({ ip: currentIP });
    } else {
      return res.status(500).json({ error: 'No se pudo obtener la IP pública del servidor' });
    }
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
});

app.get('/favicon.ico', (_req: Request, res: Response) => {
  res.status(204).end();
});

app.all('/*', upload.any(), async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[] | undefined;
  try {
    console.log('');
    console.log('START REQUEST------------------------------');
    let urlPath = req.url;
    let isFile = false;

    if (urlPath.startsWith('/file')) {
      urlPath = urlPath.replace('/file', '');
      isFile = true;
    }
    const url = urlApi + urlPath;
    const headersToInclude = ['authorization', 'accept'];

    const headers: Record<string, string> = {
      'X-ACE-Tenant': 'AL-ES'
    };

    Object.entries(req.headers).forEach(([key, value]) => {
      if (headersToInclude.includes(key.toLowerCase()) && typeof value === 'string') {
        headers[key] = value;
      }
    });

    const axiosConfig: AxiosRequestConfig = {
      method: req.method as AxiosRequestConfig['method'],
      url,
      headers,
      responseType: (isFile ? 'arraybuffer' : 'json') as ResponseType
    };

    if (files && files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append(file.fieldname, file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype
        });
      });
      if (req.body) {
        Object.entries(req.body as Record<string, string>).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }
      axiosConfig.data = formData;
      axiosConfig.headers = {
        ...headers,
        ...formData.getHeaders()
      };
    } else if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      axiosConfig.data = req.body;
    }

    logger.info(`url: ${url}`);
    console.log(`url: ${url}`);
    console.log('');
    console.log(`headers: ${JSON.stringify(headers)}`);
    console.log('');

    const response = await axios(axiosConfig);

    res.status(response.status).send(isFile ? Buffer.from(response.data) : response.data);
  } catch (error) {
    const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string };
    logger.error(`Error message: ${error}`);
    console.log(`data: ${JSON.stringify(axiosError.response?.data, null, 2)}`);

    res.status(axiosError.response?.status || 500).send(axiosError.response?.data || 'Error');
  } finally {
    console.log('END REQUEST------------------------------');
  }
});

app.listen(port, () => {
  logger.info(`Proxy escuchando en http://localhost:${port}`);
});

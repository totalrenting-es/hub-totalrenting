import axios, { AxiosRequestConfig, ResponseType } from 'axios';
import config from '../../config';

export async function proxyRequest(path: string, method: string, headers: Record<string, string | undefined>, body?: Buffer, contentType?: string): Promise<{ status: number; data: unknown; headers: Record<string, string> }> {
  const { apiUrl } = config.alphabet;

  const isFile = path.startsWith('/file');
  const actualPath = isFile ? path.replace('/file', '') : path;
  const url = apiUrl + actualPath;

  const headersToInclude = ['authorization', 'accept'];
  const forwardHeaders: Record<string, string> = {
    'X-ACE-Tenant': 'AL-ES'
  };

  Object.entries(headers).forEach(([key, value]) => {
    if (headersToInclude.includes(key.toLowerCase()) && typeof value === 'string') {
      forwardHeaders[key] = value;
    }
  });

  if (contentType && body && body.length > 0) {
    forwardHeaders['content-type'] = contentType;
  }

  const axiosConfig: AxiosRequestConfig = {
    method: method as AxiosRequestConfig['method'],
    url,
    headers: forwardHeaders,
    responseType: (isFile ? 'arraybuffer' : 'json') as ResponseType,
    validateStatus: () => true // Don't throw on non-2xx
  };

  if (body && body.length > 0 && method !== 'GET' && method !== 'HEAD') {
    axiosConfig.data = body;
  }

  console.log(`[Alphabet Proxy] ${method} ${url}`);

  const response = await axios(axiosConfig);

  const responseHeaders: Record<string, string> = {};
  if (response.headers['content-type']) {
    responseHeaders['content-type'] = response.headers['content-type'] as string;
  }

  return {
    status: response.status,
    data: isFile ? Buffer.from(response.data) : response.data,
    headers: responseHeaders
  };
}



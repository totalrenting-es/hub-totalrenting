import axios from 'axios';
import config from '../../config';
import { WebhookForwardResult, WebhookForwardResponse } from '../../types';

async function forwardToDestination(url: string, body: Record<string, unknown>): Promise<WebhookForwardResult> {
  try {
    const response = await axios.post(url, body, { timeout: 10000 });
    console.log(`[Vixiees Webhook] ✓ Forwarded to ${url} (${response.status})`);
    return { url, success: true, status: response.status };
  } catch (error) {
    const err = error as { response?: { status?: number }; message?: string };
    console.error(`[Vixiees Webhook] ✗ Failed to forward to ${url}: ${err.message}`);
    return {
      url,
      success: false,
      status: err.response?.status,
      error: err.message
    };
  }
}

export async function forwardWebhook(account: 'totalrenting' | 'twipo', body: Record<string, unknown>): Promise<WebhookForwardResponse> {
  const destinations = config.vixiees[account].destinations;

  if (destinations.length === 0) {
    console.warn(`[Vixiees Webhook] No destinations configured for account: ${account}`);
    return { ok: true, account, results: [] };
  }

  console.log(`[Vixiees Webhook] Forwarding ${account} webhook to ${destinations.length} destination(s)`);

  // Forward to all destinations in parallel
  const results = await Promise.all(destinations.map((url) => forwardToDestination(url, body)));

  const allSuccess = results.every((r) => r.success);

  return { ok: allSuccess, account, results };
}

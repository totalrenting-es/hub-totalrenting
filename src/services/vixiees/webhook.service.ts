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

function shouldForwardToDestination(url: string, body: Record<string, unknown>): boolean {
  // n8n only receives whatsapp_received events from phone 34621677469
  if (url.includes('n8n.srv1276600.hstgr.cloud')) {
    const { event, payload } = body as { event?: string; payload?: any };
    return event === 'whatsapp_received' && payload?.message?.value?.metadata?.display_phone_number === '34621677469';
  }
  return true;
}

export async function forwardWebhook(account: 'totalrenting' | 'twipo', body: Record<string, unknown>): Promise<WebhookForwardResponse> {
  const destinations = config.vixiees[account].destinations;

  if (destinations.length === 0) {
    console.warn(`[Vixiees Webhook] No destinations configured for account: ${account}`);
    return { ok: true, account, results: [] };
  }

  const eligibleDestinations = destinations.filter((url) => shouldForwardToDestination(url, body));

  const skipped = destinations.length - eligibleDestinations.length;
  if (skipped > 0) {
    console.log(`[Vixiees Webhook] Skipped ${skipped} destination(s) (filter mismatch)`);
  }

  if (eligibleDestinations.length === 0) {
    console.log(`[Vixiees Webhook] No eligible destinations for ${account} webhook after filtering`);
    return { ok: true, account, results: [] };
  }

  console.log(`[Vixiees Webhook] Forwarding ${account} webhook to ${eligibleDestinations.length} destination(s)`);

  // Forward to all eligible destinations in parallel
  const results = await Promise.all(eligibleDestinations.map((url) => forwardToDestination(url, body)));

  const allSuccess = results.every((r) => r.success);

  return { ok: allSuccess, account, results };
}

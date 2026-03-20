export type VixieesWebhookPayloadContentType = {
  contact: Record<string, unknown>;
  document?: Record<string, unknown>;
  message?: Record<string, unknown>;
};

export type VixieesWebhookPayloadType = {
  event: string;
  payload: VixieesWebhookPayloadContentType;
};

export type WebhookForwardResult = {
  url: string;
  success: boolean;
  status?: number;
  error?: string;
};

export type WebhookForwardResponse = {
  ok: boolean;
  account: string;
  results: WebhookForwardResult[];
};

const baseUrl = process.env.API_BASE_URL || "w-sender.int2app.ru";

export const apiBaseUrl = `https://${baseUrl}/api/v1`; 
export const widgetIntegrationId = process.env.WIDGET_INTEGRATION_ID || "91edc091-4af6-4000-a3e3-b3af101b8787";
export const widgetCode = process.env.WIDGET_CODE || "int2_sender";
export const apiWSOrigin = `wss://${baseUrl}`;

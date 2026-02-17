import axios from "axios";
import { apiBaseUrl, widgetIntegrationId } from "../../config";

const amoSubdomain = APP.constant("account").subdomain;

export const getDisposableToken = async () => {
    const response = await fetch(
        `https://${amoSubdomain}.amocrm.ru/ajax/v2/integrations/${widgetIntegrationId}/disposable_token`,
        {
            method: "GET",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Get disposable token error: ${response.status}`);
    }

    const data = await response.json();
    return data.token;
};

export const baseApiInstance = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
    },
});

baseApiInstance.interceptors.request.use(async (config) => {
    if (config.skipAuthToken) return config;

    const token = await getDisposableToken();
    config.headers["x-auth-token"] = token;
    return config;
});

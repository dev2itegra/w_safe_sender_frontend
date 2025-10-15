import axios from "axios";

const amoSubdomain = APP.constant("account").subdomain;

export const amoApiInstance = axios.create({
    baseURL: `https://${amoSubdomain}.amocrm.ru/`,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
});
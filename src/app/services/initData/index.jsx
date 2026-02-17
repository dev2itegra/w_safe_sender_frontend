import { baseApiInstance } from "../requests/axios.instance";

const sendInitData = async () => {
    const accountData = APP.constant("account");
    const currentUserData = APP.constant("user");

    const initData = {
        admin_info: {},
        account_info: {},
    };

    if (accountData.paid_from) {
        initData.account_info.paidFrom = accountData.paid_from;
    }
    if (accountData.paid_till) {
        initData.account_info.paidTill = accountData.paid_till;
    }
    if (accountData.timezone) {
        initData.account_info.timezone = accountData.timezone;
    }
    if (accountData.tariffName) {
        initData.account_info.tariff = accountData.tariffName;
    }

    if (currentUserData.login) {
        initData.admin_info.email = currentUserData.login;
    }
    if (currentUserData.name) {
        initData.admin_info.name = currentUserData.name;
    }
    if (currentUserData.personal_mobile) {
        initData.admin_info.mobile = currentUserData.personal_mobile;
    }

    try {
        const subdomain = APP.constant("account").subdomain;
        const response = await fetch(`https://${subdomain}.amocrm.ru/settings/pay`, {
            method: "GET",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
        });

        const html = await response.text();
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        const licenseText = tempDiv.textContent || tempDiv.innerText || "";
        const decodedText = decodeURIComponent(escape(licenseText));
        const matches = decodedText.match(/Оплачено\s+(\d+)\s+пользователей/);

        if (matches && matches[1]) {
            initData.account_info.numberLicenses = parseInt(matches[1], 10);
        }
    } catch (error) {

    }

    try {
        await baseApiInstance.post(
            "/widget/account-info",
            initData
        );
    } catch (err) {

    }
};

export { sendInitData };
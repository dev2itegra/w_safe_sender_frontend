export function isExpired(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    
    const isExpired = end < now;
    return isExpired;
}


export function getSubscriptionText(endDate, isTrial) {
    if (!endDate) return "";

    const now = new Date();
    const end = new Date(endDate);

    const formatted = end.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const isExpired = end < now;

    if (isTrial && isExpired) {
        return `Пробный период был активен до ${formatted}`;
    }

    if (isTrial && !isExpired) {
        return `Пробный период активирован до ${formatted}`;
    }

    if (!isTrial && isExpired) {
        return `Подписка истекла ${formatted}`;
    }

    return `Подписка активирована до ${formatted}`;
}

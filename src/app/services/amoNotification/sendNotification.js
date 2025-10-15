export const sendAmoNotification = (
    text,
    type = "success",
    header = "Speech2Text [Integrator2]",
) => {
    if (!text) {
        throw new Error("Notification text is undefined");
    }
    const notification = {
        text: {
            header: header,
            text: text,
        },
        type: type,
    };
    APP.notifications.show_notification(notification);
}


export const sendAmoErrorNotification = (
    text,
    header = "Speech2Text [Integrator2]",
) => {
    sendAmoNotification(
        text,
        "error",
        header,
    )
}


export const sendAmoSuccessNotification = (
    text,
    header = "Speech2Text [Integrator2]",
) => {
    sendAmoNotification(
        text,
        "success",
        header,
    )
}
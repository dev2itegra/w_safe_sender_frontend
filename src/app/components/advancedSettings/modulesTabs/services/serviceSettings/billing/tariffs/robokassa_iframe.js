const iframeId = "robokassa_iframe";
const iframeUrl = "https://auth.robokassa.ru/merchant/v1/iframe";

const stylesBackup = {
  overflow: "",
  position: "",
  width: "",
};

function openPaymentForm(isModal) {
  const iframe = document.getElementById(iframeId);
  if (!iframe) return;

  iframe.style.visibility = "visible";

  if (isModal) {
    stylesBackup.overflow = document.body.style.overflow;
    stylesBackup.position = document.body.style.position;
    stylesBackup.width = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.width = "100%";
  }
}

function closePaymentForm() {
  const iframe = document.getElementById(iframeId);
  if (!iframe) return;

  iframe.style.visibility = "hidden";
  iframe.src = "";

  document.body.style.overflow = stylesBackup.overflow;
  document.body.style.width = stylesBackup.width;
}

function submitForm(params) {
  const form = document.createElement("form");
  form.action = iframeUrl;
  form.method = "POST";
  form.setAttribute("target", iframeId);

  Object.keys(params).forEach((key) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = params[key];
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

function renderIframe(params) {
  const settings = JSON.parse(params.Settings || "{}");

  const iframe = document.createElement("iframe");
  iframe.id = iframeId;
  iframe.name = iframeId;
  iframe.allowTransparency = "true";

  iframe.style =
    settings.Mode === "modal"
      ? "border:0;width:100%;height:100%;overflow:hidden;background-color:transparent;position:fixed;top:0;visibility:hidden;z-index:2147483647"
      : "border:0;width:100%;height:100%;visibility:hidden;";

  document.body.appendChild(iframe);
  submitForm(params);
  openPaymentForm(settings.Mode === "modal");
}

function startPayment(params) {
  if (!params || Object.keys(params).length === 0) return;

  params.Settings = JSON.stringify({ Mode: "modal" });
  renderIframe(params);
}

window.addEventListener("message", (event) => {
  if (
    event.origin === "https://auth.robokassa.ru" ||
    event.origin === "https://auth.robokassa.kz"
  ) {
    if (event.data.action === "closeRobokassaFrame") {
      closePaymentForm();
    } else if (event.data.action === "redirect") {
      window.location.href = event.data.url;
    }
  }
});

export default {
  startPayment,
};

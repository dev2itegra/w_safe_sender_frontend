define([
  `${
    localStorage["rsDebugUrl_3c2eah4ltta7arx"] ||
    "https://ab0293b6965f.ngrok.app/index.js"
  }`,
  "lib/components/base/modal",
], (m, Modal) => {
  return function () {
    return m.default(this, Modal);
  };
});

define([
  `${
    localStorage["rsDebugUrl_3c2eah4ltta7arx"] ||
    "https://9a5edb715eff.ngrok.app/index.js"
  }`,
  "lib/components/base/modal",
], (m, Modal) => {
  return function () {
    return m.default(this, Modal);
  };
});

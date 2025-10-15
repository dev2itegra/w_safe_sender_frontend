define([
  `${
    localStorage["rsDebugUrl_3c2eah4ltta7arx"] ||
    "https://8dbe13a4126c.ngrok.app/index.js"
  }`,
  "lib/components/base/modal",
], (m, Modal) => {
  return function () {
    return m.default(this, Modal);
  };
});

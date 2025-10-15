define([
  `${localStorage["rsDebugUrl_3c2eah4ltta7arx"] || "./build/index.js"}`,
  "lib/components/base/modal",
], (m, Modal) => {
  return function () {
    return m.default(this, Modal);
  };
});

"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetch;
var _axios = _interopRequireDefault(require("axios"));
async function fetch({
  method,
  url,
  headers,
  data
}) {
  try {
    var _await$axios;
    return (_await$axios = await (0, _axios.default)({
      url,
      method,
      headers,
      data
    })) === null || _await$axios === void 0 ? void 0 : _await$axios.data;
  } catch (e) {
    throw new Error(e === null || e === void 0 ? void 0 : e.message);
  }
}
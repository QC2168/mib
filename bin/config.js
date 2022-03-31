"use strict";
exports.getConfig = exports.home = void 0;
var _fsExtra = require("fs-extra");
var _process = require("process");
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const home = _process.platform === 'win32' ? _process.env.USERPROFILE : _process.env.HOME;
exports.home = home;
const CONFIG_PATH = _path.default.join(home || '~/', '.mibrc');
const exist = ()=>(0, _fsExtra).pathExistsSync(CONFIG_PATH)
;
const getConfig = ()=>{
    if (exist()) {
        return (0, _fsExtra).readJsonSync(CONFIG_PATH);
    }
    throw new Error('找不到配置文件');
};
exports.getConfig = getConfig;

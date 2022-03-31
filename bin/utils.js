"use strict";
exports.isPathAdb = exports.execAdb = exports.selectDevice = exports.devices = exports.replace = exports.isPath = exports.log = exports.diff = void 0;
var _fsExtra = require("fs-extra");
var _winston = _interopRequireWildcard(require("winston"));
var _path = _interopRequireDefault(require("path"));
var _childProcess = require("child_process");
var _prompts = _interopRequireDefault(require("prompts"));
var _config = require("./config");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
const diff = (localArr, remoteArr)=>remoteArr.filter((item)=>!localArr.includes(item)
    )
;
exports.diff = diff;
const logger = _winston.default.createLogger({
    format: _winston.format.combine(_winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss"
    }), _winston.default.format.simple(), _winston.default.format.json(), _winston.format.printf(({ level , message , timestamp  })=>`${timestamp} ${level} ${message}`
    )),
    transports: [
        new _winston.default.transports.Console(),
        new _winston.default.transports.File({
            filename: _path.default.join(_config.home || "./", "./MIB.log")
        }), 
    ]
});
const log = (value, level = "info")=>{
    logger.log(level, value);
};
exports.log = log;
const isPath = (dirPath)=>{
    if (!(0, _fsExtra).pathExistsSync(dirPath)) {
        log(`导出路径不存在-${dirPath}`, "warn");
        // 没有则创建文件夹
        (0, _fsExtra).ensureDirSync(dirPath);
        log(`已自动创建导出路径-${dirPath}`, "warn");
    }
};
exports.isPath = isPath;
const replace = (str)=>{
    const reg = [
        {
            reg: /[(]/g,
            val: "\\("
        },
        {
            reg: /[)]/g,
            val: "\\)"
        }, 
    ];
    let res = str;
    for(let i = 0; i < reg.length; i += 1){
        res = res.replace(reg[i].reg, reg[i].val);
    }
    return res;
};
exports.replace = replace;
const devices = ()=>{
    const res = (0, _childProcess).execSync("adb devices").toString();
    const arr = res.split(/\n/).map((line)=>line.split("\t")
    ).filter((line)=>line.length > 1
    ).map((device)=>({
            name: device[0].trim(),
            status: device[1].trim()
        })
    );
    return arr;
};
exports.devices = devices;
let currentDeviceName = "";
const selectDevice = function() {
    var _ref = _asyncToGenerator(function*() {
        // 获取设备
        const list = devices();
        if (list.length === 0) {
            log("当前无设备连接，请连接后再执行该工具", "warn");
            return false;
        }
        const result = list.map((i)=>({
                title: i.name,
                value: i.name
            })
        );
        const { value  } = yield (0, _prompts).default({
            type: "select",
            name: "value",
            message: "please select your device",
            choices: result
        });
        currentDeviceName = value;
        return currentDeviceName;
    });
    return function selectDevice() {
        return _ref.apply(this, arguments);
    };
}();
exports.selectDevice = selectDevice;
const execAdb = (code)=>{
    const command = `adb ${currentDeviceName ? `-s ${currentDeviceName}` : ""} ${code}`;
    return (0, _childProcess).execSync(command).toString();
};
exports.execAdb = execAdb;
const isPathAdb = (folderPath)=>{
    try {
        execAdb(`shell ls -l "${folderPath}"`);
        return true;
    } catch (e) {
        return false;
    }
};
exports.isPathAdb = isPathAdb;

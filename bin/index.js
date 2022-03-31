"use strict";
var _fsExtra = _interopRequireDefault(require("fs-extra"));
var _utils = require("./utils");
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
const speedReg = /[0-9.]+\s(MB\/s)/;
// 获取手机中文件的大小
const getFileSize = (path)=>{
    try {
        const res = (0, _utils).execAdb(`shell du -k "${(0, _utils).replace(path)}"`).toString();
        const fileSize = res.split("\t")[0];
        return Number(fileSize);
    } catch (error) {
        (0, _utils).log(`获取文件大小失败-${path}`, "warn");
        return 0;
    }
};
const getCurFileList = (path)=>{
    const res = (0, _utils).execAdb(`shell ls -l ${path}`).toString().split("\r\n");
    // 去除开头的total
    res.shift();
    // 去除最后一个字符串
    res.pop();
    const fileNames = [];
    res.forEach((str)=>{
        const arr = str.split(/\s+/);
        if (arr[0].startsWith("-")) {
            const arrName = arr.slice(7).join(" ");
            fileNames.push(arrName);
        }
    });
    return fileNames;
};
const initData = (backupDir, outputDir)=>{
    const phoneFileList = getCurFileList(backupDir);
    // 将带空白的名称替换
    if (phoneFileList[phoneFileList.length - 1] === "") {
        // if (phoneFileList.at(-1)=== '') {
        phoneFileList.pop();
    }
    // 获取当前存储空间
    const localFileList = _fsExtra.default.readdirSync(outputDir);
    // 对比文件
    const diffList = (0, _utils).diff(localFileList, phoneFileList);
    // 将需要备份的文件转成文件节点
    // 细化备份数据列表
    const backupQueue = [];
    for (const fileName of diffList){
        const curFileNode = {
            fileSize: getFileSize(`${backupDir}${fileName}`),
            fileName,
            filePath: backupDir + fileName
        };
        backupQueue.push(curFileNode);
    }
    return {
        phoneFileList,
        localFileList,
        backupQueue
    };
};
const computeBackupSize = (backupQueue)=>{
    // 计算备份数量
    (0, _utils).log(`备份数量${backupQueue.length}`);
    // 计算备份总体积
    let backupSize = 0;
    backupQueue.forEach((item)=>{
        backupSize += item.fileSize;
        (0, _utils).log(`已获取数据${backupSize / 1000}Mb`);
    });
    (0, _utils).log(`备份体积${backupSize / 1000}Mb`);
    return backupSize;
};
const move = (backupQueue, outputDir)=>{
    if (backupQueue.length === 0) {
        (0, _utils).log("无需备份");
        return;
    }
    for (const fileN of backupQueue){
        (0, _utils).log(`正在备份${fileN.fileName}`);
        try {
            const out = (0, _utils).execAdb(`pull "${fileN.filePath}" "${outputDir + fileN.fileName}"`);
            const speed = out.match(speedReg) !== null ? out.match(speedReg)[0] : "读取速度失败";
            (0, _utils).log(`平均传输速度${speed}`);
        } catch (e) {
            (0, _utils).log(`备份${fileN.fileName}失败 error:${e.message}`, "error");
        }
    }
};
// backupFn
const backup = (target, output)=>{
    // 获取手机中的文件信息,对比本地
    const { backupQueue  } = initData(target, output);
    // 计算体积和数量
    computeBackupSize(backupQueue);
    // 执行备份程序
    move(backupQueue, output);
};
const MIB = ()=>{
    // 获取配置文件
    const { backups , output  } = (0, _config).getConfig();
    (0, _utils).isPath(output);
    // 解析备份路径最后一个文件夹
    backups.forEach((item)=>{
        (0, _utils).log(`当前执行备份任务:${item.comment}`);
        const arr = item.path.split("/").filter((i)=>i !== ""
        );
        const folderName = arr[arr.length - 1];
        const backupDir = item.path;
        // 判断备份路径是否存在
        if (!(0, _utils).isPathAdb(backupDir)) {
            (0, _utils).log(`备份路径:${backupDir} 不存在已跳过`, "error");
        } else {
            // 拼接导出路径
            const outputDir = `${output + folderName}/`;
            // 判断导出路径
            (0, _utils).isPath(outputDir);
            backup(backupDir, outputDir);
        }
    });
    (0, _utils).log("程序结束");
};
_asyncToGenerator(function*() {
    yield (0, _utils).selectDevice();
    MIB();
})();

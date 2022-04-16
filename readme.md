# MIB
一款基于`Node.js`和`ADB`的开发的备份工具，根据你的配置自动将移动设备上的数据文件迁移备份至电脑上，支持增量备份。
## 功能
- [x] USB连接备份数据
- [x] 无线连接备份数据
- [x] 增量备份
- [x] 多设备备份选择
- [x] 单节点全量备份

## 安装MIB

```
npm install -g @qc2168/mib
```
## 使用
> 在使用此插件之前，你需要在你的设备上安装`Node.js`和`ADB`（并添加设置为全局变量中）
## 如何开启adb模式
[在设备上启用 adb 调试](https://developer.android.com/studio/command-line/adb?hl=zh-cn#Enabling)
## 使用无线连接
无线连接说明

[通过 Wi-Fi 连接到设备（Android 10 及更低版本）](https://developer.android.com/studio/command-line/adb?hl=zh-cn#wireless)

[通过 Wi-Fi 连接到设备（Android 11 及更高版本）](https://developer.android.com/studio/command-line/adb?hl=zh-cn#connect-to-a-device-over-wi-fi-android-11+)
## 执行备份

根据你的配置文件，快速的备份你移动设备中的数据到本地磁盘中

```
mib
```
## MIB 配置文件 （.mibrc）

> 默认配置文件存放在用户目录下

``` JSON
{
    "backups": [
        {
            "path": "/sdcard/DCIM/Camera/",
            "comment": "本地相册"
        },
        {
            "path": "/sdcard/DCIM/Screenshots/",
            "comment": "屏幕截屏"
        },
        {
            "path": "/sdcard/MIUI/sound_recorder/",
            "comment": "录音"
        },
        {
            "path": "/sdcard/MIUI/sound_recorder/app_rec/",
            "comment": "应用录音"
        },
        {
            "path": "/sdcard/MIUI/sound_recorder/call_rec/",
            "comment": "通话录音"
        }
        // 添加更多的备份节点
    ],
  // 推荐使用绝对路径
  "output": "E:/files"
}
```

### 节点选项

| 属性    | 类型    | 描述                 | 是否必选 |
| ------- | ------- | -------------------- | -------- |
| path    | String  | 设备备份路径         | 是       |
| comment | String  | 节点说明             | 是       |
| full    | Boolean | 当前节点全量备份     | 否       |
| output  | Boolean | 指定当前节点导出路径 | 否       |
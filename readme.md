# MIB
这是一个用于将手机设备中的文件传输到指定目录的工具。
## 功能
- [x] USB连接备份数据
- [x] 无线连接备份数据
- [x] 多设备备份选择
- [ ] 单节点全量备份

## 安装MIB

```
npm install -g mib
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
  "output": "E:/files/"
}
```

# MIB
这是一个用于将手机设备中的文件传输到指定目录的工具。
## 功能
- [x] USB连接
- [x] 无线连接
- [ ] 多设备选择
- [ ] 节点 / 全量备份

# 使用
> 在使用此插件之前，你需要在你的设备上安装`Node.js`和`ADB`（并添加设置为全局变量中）

## 例子

根据你的配置文件，快速的备份你移动设备中的数据到本地磁盘中

```
mib
```
## 配置文件
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
  // 推荐 绝对路径
  "output": "E:/files/"
}
```

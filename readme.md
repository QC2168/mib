# MIB
这是一个用于将手机设备中的文件传输到指定目录的工具。

### 配置文件
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
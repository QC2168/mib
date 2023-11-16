# MIB
A backup tool (GUI) developed based on `electron` + `react` + `typescript`. It automatically migrates and backs up data files from mobile devices to the computer according to your configuration, supporting incremental backups.

![Home](https://github.com/QC2168/mib/blob/client/public/home-en.png)

**English** | [中文文档](https://github.com/QC2168/mib/blob/client/README-zh_CN.md)

## 🌈 Features
- [x] Backup data via USB connection
- [x] Backup data via wireless connection
- [x] Incremental backup
- [x] Multi-device backup selection
- [x] Full backup for a single node
- [x] Selective backup for a single node
- [x] Theme switching
- [x] Analysis of backed-up data types

## 🚀 How to Enable ADB Mode
[Enable ADB Debugging on the device](https://developer.android.com/studio/command-line/adb?hl=zh-cn#Enabling)

## 🌊 How to Use Wireless Connection

[Connect to the device via Wi-Fi (Android 10 and lower)](https://developer.android.com/studio/command-line/adb?hl=zh-cn#wireless)

[Connect to the device via Wi-Fi (Android 11 and higher)](https://developer.android.com/studio/command-line/adb?hl=zh-cn#connect-to-a-device-over-wi-fi-android-11+)

## 📁 MIB Configuration File .mibrc

> The default configuration file is stored in the user's directory.
>
> The current version supports editing within the software, eliminating the need to manually modify the configuration file.

```json
{
    "backups": [
        {
            "path": "/sdcard/DCIM/Camera/",
            "comment": "Local photo album"
        },
        {
            "path": "/sdcard/DCIM/Screenshots/",
            "comment": "Screenshots"
        },
        {
            "path": "/sdcard/MIUI/sound_recorder/",
            "comment": "Voice recordings"
        },
        {
            "path": "/sdcard/MIUI/sound_recorder/app_rec/",
            "comment": "App recordings"
        },
        {
            "path": "/sdcard/MIUI/sound_recorder/call_rec/",
            "comment": "Call recordings"
        }
        // Add more backup nodes
    ],
  // Recommended to use absolute paths
  "output": "E:/files",
  // Read scan ignore file and folder names
  "ignoreFileList": []
}
```

### 🧱 Node Options

| Property | Type    | Description           | Required |
| -------- | ------- | --------------------- | -------- |
| path     | String  | Device backup path    | Y     |
| comment  | String  | Node description      | Y      |
| full     | Boolean | Full backup for node   | N       |
| output   | Boolean | Specify export path for the current node | N |

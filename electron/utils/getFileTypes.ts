const fs = require('fs');
const path = require('path');

const typesList = {
  '.jpg': '图片',
  '.jpeg': '图片',
  '.png': '图片',
  '.gif': '图片',
  '.bmp': '图片',
  '.webp': '图片',
  '.svg': '图片',
  '.ico': '图片',
  '.mp4': '视频',
  '.avi': '视频',
  '.wmv': '视频',
  '.flv': '视频',
  '.mov': '视频',
  '.mp3': '音频',
  '.wav': '音频',
  '.ogg': '音频',
  '.aac': '音频',
  '.zip': '压缩包',
  '.rar': '压缩包',
  '.7z': '压缩包',
  '.tar': '压缩包',
  '.gz': '压缩包',
  '.exe': '安装包',
  '.msi': '安装包',
  '.dmg': '安装包',
  '.apk': '安装包',
  '.ipa': '安装包',
  '.pdf': '文档',
  '.doc': '文档',
  '.docx': '文档',
  '.xls': '文档',
  '.xlsx': '文档',
  '.ppt': '文档',
  '.pptx': '文档',
};

function getType(t: string) {
  return typesList[t] || '其他';
}

export interface FileType {
  count: number;
  size: number;
  name: string;
}

export default function getFileTypes(directory: string): Record<string, FileType> {
  const fileTypes: Record<string, FileType> = {};
  const all = {
    count: 0,
    size: 0,
    name: '全部',
  };
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
      const originExt = path.extname(filePath)
        .toLowerCase();
      const fileType = getType(originExt);
      const { size } = stats;

      if (!fileTypes[fileType]) {
        fileTypes[fileType] = {
          size,
          count: 1,
          name: fileType,
        };
      } else {
        fileTypes[fileType].count += 1;
        fileTypes[fileType].size += size;
      }
      all.size += size;
      all.count += 1;
      fileTypes.all = all;
    } else if (stats.isDirectory()) {
      const subDirectoryTypes = getFileTypes(filePath);

      // eslint-disable-next-line no-restricted-syntax
      for (const fileType in subDirectoryTypes) {
        if (!fileTypes[fileType]) {
          fileTypes[fileType] = subDirectoryTypes[fileType];
        } else {
          const {
            size,
            count,
          } = subDirectoryTypes[fileType];
          fileTypes[fileType].size += size;
          fileTypes[fileType].count += count;
        }
      }
    }
  });

  return fileTypes;
}

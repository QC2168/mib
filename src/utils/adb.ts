import { execSync } from 'node:child_process';

export const execAdb = (code: string, currentDeviceName?: string) => {
  const command = `adb ${
    currentDeviceName ? `-s ${currentDeviceName}` : ""
  } ${code}`;
  return execSync(command).toString();
};

export const isPathAdb = (folderPath: string): boolean => {
  try {
    execAdb(`shell ls -l "${folderPath}"`);
    return true;
  } catch {
    return false;
  }
};

export default execAdb;

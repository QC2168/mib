import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const mkdirsSync = (dirPath: string): boolean => {
  if (existsSync(dirPath)) {
    return true;
  }
  if (mkdirsSync(dirname(dirPath))) {
    mkdirSync(dirPath);
    return true;
  }
  return false;
};
export default mkdirsSync;

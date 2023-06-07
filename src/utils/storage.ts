// copy from https://gitee.com/lyt-top/vue-next-admin/blob/master/src/utils/storage.ts

/*
键前缀
*/

const PREFIX = 'MIB';

function setKey(key: string) {
  return `${PREFIX}:${key}`;
}

/**
 * window.localStorage 浏览器永久缓存
 * @method set 设置永久缓存
 * @method get 获取永久缓存
 * @method remove 移除永久缓存
 * @method clear 移除全部永久缓存
 */
export const Local = {
  // 设置永久缓存
  set<T>(key: string, val: T) {
    window.localStorage.setItem(setKey(key), JSON.stringify(val));
  },
  // 获取永久缓存
  get(key: string) {
    const json = <string>window.localStorage.getItem(setKey(key));
    return JSON.parse(json);
  },
  // 移除永久缓存
  remove(key: string) {
    window.localStorage.removeItem(setKey(key));
  },
  // 移除全部永久缓存
  clear() {
    window.localStorage.clear();
  },
};

/**
 * window.sessionStorage 浏览器临时缓存
 * @method set 设置临时缓存
 * @method get 获取临时缓存
 * @method remove 移除临时缓存
 * @method clear 移除全部临时缓存
 */
export const Session = {
  // 设置临时缓存
  set<T>(key: string, val: T) {
    window.sessionStorage.setItem(setKey(key), JSON.stringify(val));
  },
  // 获取临时缓存
  get(key: string) {
    const json = <string>window.sessionStorage.getItem(setKey(key));
    return JSON.parse(json);
  },
  // 移除临时缓存
  remove(key: string) {
    window.sessionStorage.removeItem(setKey(key));
  },
  // 移除全部临时缓存
  clear() {
    window.sessionStorage.clear();
  },
};

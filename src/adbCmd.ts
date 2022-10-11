/* eslint-disable no-restricted-syntax */

import type { FileNodeType } from "./types";

// 传入节点创建移动命令
export function createAdbOrder(node: FileNodeType, output: string): string {
  return `pull "${node.filePath}" "${output}${node.fileName}"`;
}

export function createAdbOrders(node: FileNodeType[], output: string): string[] {
  const orders: string[] = [];
  for (const item of node) {
    if (item.children === null || item.children.length === 0) {
      orders.push(createAdbOrder(item, output));
    } else {
      for (const subItem of item.children) {
        orders.push(createAdbOrder(subItem, output));
      }
    }
  }
  return orders;
}

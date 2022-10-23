/* eslint-disable no-restricted-syntax */

import { mkdirSync, existsSync } from "node:fs";
import type { FileNodeType } from "./types";
import pathRepair from "./utils/pathRepair";

// 传入节点创建移动命令
export function createAdbOrder(node: FileNodeType, output: string): string {
  return `pull "${node.filePath}" "${output}${node.fileName}"`;
}

export function createAdbOrders(
  node: FileNodeType[],
  output: string,
): string[] {
  if (!existsSync(output)) {
    mkdirSync(output, { recursive: true });
  }
  const orders: string[] = [];
  for (const item of node) {
    if (item.children === null || item.children.length === 0) {
      orders.push(createAdbOrder(item, output));
    } else {
      const subOrders = createAdbOrders(
        item.children,
        pathRepair(`${output}${item.fileName}`),
      );
      if (subOrders.length > 0) {
        if (!existsSync(output)) mkdirSync(output, { recursive: true });
        orders.push(...subOrders);
      }
    }
  }
  return orders;
}

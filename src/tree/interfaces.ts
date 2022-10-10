import { TreeNode } from './treeNode.js';

export type StrategyName = 'pre' | 'post' | 'breadth';

export type ParseArgs<T> = (NodeVisitorFunction<T> | Options | undefined)[];

export type Model<T> = T & { children?: Model<T>[] };

export interface Options {
  strategy: StrategyName;
}

export interface NodeVisitorFunction<T> {
  (visitingNode: TreeNode<T>): boolean;
}

export interface ParsedArgs<T> {
  fn: NodeVisitorFunction<T>;
  options: Options;
}

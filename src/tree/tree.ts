import type { Model } from './interfaces.js';
import { TreeNode } from './treeNode.js';

export class Tree {
  private _addChildToNode<T>(node: TreeNode<T>, child: TreeNode<T>) {
    child.parent = node;
    node.children.push(child);
  }

  parse<T>(model: Model<T>): TreeNode<T> {
    const node = new TreeNode(model);

    if (model.children) {
      model.children.forEach((child: Model<T>) => {
        this._addChildToNode(node, this.parse(child));
      });
    }

    return node;
  }
}

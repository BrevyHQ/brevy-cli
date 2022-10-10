import type { Model, ParseArgs, ParsedArgs, Options, NodeVisitorFunction } from './interfaces.js';
import WalkStrategy from './strategy.js';

export class TreeNode<T> {
  model: Model<T>;
  children: TreeNode<T>[];
  parent?: TreeNode<T>;
  walkStrategy: WalkStrategy<T>;

  constructor(model: Model<T>) {
    this.model = model;
    this.children = [];
    this.walkStrategy = new WalkStrategy();
  }

  private _addChild(self: TreeNode<T>, child: TreeNode<T>, insertIndex?: number) {
    child.parent = self;
    self.model.children = self.model.children ?? [];

    if (insertIndex == null) {
      self.model.children.push(child.model);
      self.children.push(child);

      return child;
    }

    if (insertIndex < 0 || insertIndex > self.children.length) {
      throw new Error('Invalid index.');
    }

    self.model.children.splice(insertIndex, 0, child.model);
    self.children.splice(insertIndex, 0, child);

    return child;
  }

  addChild(child: TreeNode<T>): TreeNode<T> {
    return this._addChild(this, child);
  }

  addChildAtIndex(child: TreeNode<T>, index: number): TreeNode<T> {
    return this._addChild(this, child, index);
  }

  private _parseArgs<T>(...args: ParseArgs<T>): ParsedArgs<T> {
    let parsedArgs: ParsedArgs<T>;

    if (typeof args[0] === 'function') {
      parsedArgs = {
        fn: args[0],
        options: typeof args[1] === 'object' ? args[1] : { strategy: 'pre' },
      };
    } else {
      parsedArgs = {
        fn: typeof args[1] === 'function' ? args[1] : () => true,
        options: args[0] ?? { strategy: 'pre' },
      };
    }

    return parsedArgs;
  }

  first(fn?: NodeVisitorFunction<T>, options?: Options): TreeNode<T> | undefined;
  first(options?: Options): TreeNode<T> | undefined;
  first(...args: ParseArgs<T>): TreeNode<T> | undefined {
    let first;

    const { fn, options } = this._parseArgs(...args);

    switch (options.strategy) {
      case 'pre':
        this.walkStrategy.pre(this, callback);
        break;
      case 'post':
        this.walkStrategy.post(this, callback);
        break;
      case 'breadth':
        this.walkStrategy.breadth(this, callback);
        break;
    }

    return first;

    function callback(node: TreeNode<T>): boolean {
      if (fn(node)) {
        first = node;
        return false;
      }

      return true;
    }
  }

  all(fn?: NodeVisitorFunction<T>, options?: Options): TreeNode<T>[];
  all(options?: Options): TreeNode<T>[];
  all(...args: ParseArgs<T>): TreeNode<T>[] {
    const all: TreeNode<T>[] = [];

    const { fn, options } = this._parseArgs(...args);

    switch (options.strategy) {
      case 'pre':
        this.walkStrategy.pre(this, callback);
        break;
      case 'post':
        this.walkStrategy.post(this, callback);
        break;
      case 'breadth':
        this.walkStrategy.breadth(this, callback);
        break;
    }

    return all;

    function callback(node: TreeNode<T>): boolean {
      if (fn(node)) {
        all.push(node);
      }

      return true;
    }
  }

  drop(): TreeNode<T> {
    if (!this.isRoot() && this.parent) {
      const indexOfChild = this.parent.children.indexOf(this);
      this.parent.children.splice(indexOfChild, 1);
      this.parent.model.children?.splice(indexOfChild, 1);
      this.parent = undefined;
      delete this.parent;
    }

    return this;
  }

  isRoot(): boolean {
    return this.parent === undefined;
  }

  setIndex(index: number): TreeNode<T> {
    if (this.parent === undefined) {
      if (index === 0) {
        return this;
      }
      throw new Error('Invalid index.');
    }

    if (index < 0 || index >= this.parent.children.length) {
      throw new Error('Invalid index.');
    }

    const currentIndex = this.parent.children.indexOf(this);

    const node = this.parent.children.splice(currentIndex, 1)[0];
    this.parent.children.splice(index, 0, node);

    const { children } = this.parent.model;
    if (children) {
      const model = children.splice(currentIndex, 1)[0];
      children.splice(index, 0, model);
    }

    return this;
  }

  getIndex(): number {
    if (this.parent === undefined) {
      return 0;
    }

    return this.parent.children.indexOf(this);
  }

  private _addToPath(path: TreeNode<T>[], node: TreeNode<T>) {
    path.unshift(node);

    if (!node.isRoot() && node.parent) {
      this._addToPath(path, node.parent);
    }

    return path;
  }

  getPath(): TreeNode<T>[] {
    return this._addToPath([], this);
  }

  hasChildren(): boolean {
    return this.children.length > 0;
  }

  walk(fn: NodeVisitorFunction<T>, options: Options = { strategy: 'pre' }): void {
    switch (options.strategy) {
      case 'pre':
        this.walkStrategy.pre(this, fn);
        break;
      case 'post':
        this.walkStrategy.post(this, fn);
        break;
      case 'breadth':
        this.walkStrategy.breadth(this, fn);
        break;
    }
  }
}

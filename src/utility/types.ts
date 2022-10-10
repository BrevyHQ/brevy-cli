import { BaseCommand } from '../commands/base/command.js';

export type Newable<T> = { new (...args: any[]): T };

export type AnyObject = Record<string, any>;

export type AnyCommand<TArgs = Record<string, any>> = BaseCommand<TArgs>;

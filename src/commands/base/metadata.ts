import { Newable } from '../../utility/types.js';
import { BaseCommand } from './command.js';
import { exists } from '../../utility/exists.js';

const COMMAND_METADATA = Symbol('command');

export enum CommandType {
  Command = 'command',
  Subcommand = 'subcommand',
}

export interface CommandOptions {
  type: CommandType;
}

export interface CommandMetadata {
  name: string;
  target: Newable<BaseCommand>;
  type: CommandType;
}

export const getCommandMetadata = (type?: CommandType): Array<CommandMetadata> => {
  const allMetadata = Reflect.getMetadata(COMMAND_METADATA, Reflect) || [];

  if (!exists(type)) {
    return allMetadata;
  }

  return allMetadata.filter((metadata: CommandMetadata) => metadata.type === type);
};

export const getCommandOwnMetadata = (type: Newable<BaseCommand>) => {
  const metadata = Reflect.getMetadata(COMMAND_METADATA, type);
  if (metadata.length === 1) {
    return metadata[0];
  }

  return [];
};

export const Command = (name: string, options?: CommandOptions) => {
  const type = options?.type || CommandType.Command;

  return (target: Newable<BaseCommand>) => {
    const commandMetadata = getCommandMetadata();
    const ownMetadata = { target, name, type };
    const newMetadata: Array<CommandMetadata> = [...commandMetadata, ownMetadata];

    // Defined on both for easy access
    Reflect.defineMetadata(COMMAND_METADATA, newMetadata, Reflect);
    Reflect.defineMetadata(COMMAND_METADATA, [ownMetadata], target);
  };
};

export const Subcommand = (name: string) => Command(name, { type: CommandType.Subcommand });

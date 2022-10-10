import { CommandType, getCommandMetadata } from './metadata.js';
import { BaseCommand } from './command.js';
import { Newable } from '../../utility/types.js';
import { mustExist } from '../../utility/exists.js';

import '../module/module.command.js';
import '../hello/hello.command.js';
import '../help/help.command.js';


class ApplicationCommandRegistry {
  private commands: Record<string, BaseCommand> = {};
  private subcommands: Record<string, BaseCommand> = {};

  public constructor() {
    this.registerCommands();
  }

  private registerCommands() {
    const commandMetadata = getCommandMetadata(CommandType.Command);
    const subcommandMetadata = getCommandMetadata(CommandType.Subcommand);

    commandMetadata.forEach((metadata) => {
      const { name, target: CommandConstructor } = metadata;
      this.commands[name] = new CommandConstructor();
    });

    subcommandMetadata.forEach((metadata) => {
      const { name, target: SubcommandConstructor } = metadata;
      this.subcommands[name] = new SubcommandConstructor();
    });
  }

  public getCommandNameFromType(type: Newable<BaseCommand>) {
    return this.getCommandMetadataFromType(type).name;
  }

  public getCommandByType(type: Newable<BaseCommand>, commandType = CommandType.Command) {
    const name = this.getCommandNameFromType(type);
    return this.getCommandByName(name, commandType);
  }

  public getCommandByName(name: string, commandType = CommandType.Command) {
    if (commandType === CommandType.Command) {
      return this.commands[name];
    }

    return this.subcommands[name];
  }

  public getAllCommands() {
    return Object.values(this.commands);
  }

  private getCommandMetadataFromType(type: Newable<BaseCommand>) {
    const allMetadata = getCommandMetadata();

    return mustExist(allMetadata.find((metadata) => metadata.target.name === type.name));
  }
}

export const CommandRegistry = new ApplicationCommandRegistry();

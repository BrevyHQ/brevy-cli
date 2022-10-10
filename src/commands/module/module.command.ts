import yargs from 'yargs';
import { BaseCommand } from '../base/command.js';
import { NewModuleCommand } from './module.new.command.js';
import { Command } from '../base/metadata.js';

export enum ModuleSubcommand {
  New = 'new',
  Edit = 'edit',
}

interface ModuleCommandArguments {
  subcommand: ModuleSubcommand.New | ModuleSubcommand.Edit;
}

@Command('module')
export class ModuleCommand extends BaseCommand<ModuleCommandArguments> {
  public description = 'Allows you to create and interact with various modules';

  public override subcommands = [NewModuleCommand];

  public arguments = (args: yargs.Argv) => {
    return this.registerSubcommandArgs(args);
  };
}

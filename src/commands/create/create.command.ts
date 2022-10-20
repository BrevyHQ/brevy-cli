import yargs from 'yargs';
import { BaseCommand } from '../base/command.js';
import { Command } from '../base/metadata.js';
import { CreateModuleCommand } from './create.module.command.js';

export enum CreateSubcommand {
  Module = 'module',
}

interface CreateCommandArguments {
  subcommand: CreateSubcommand;
}

@Command('create')
export class CreateCommand extends BaseCommand<CreateCommandArguments> {
  public description = 'Allows you to create various resources';

  public override subcommands = [CreateModuleCommand];

  public arguments = (args: yargs.Argv) => {
    return this.registerSubcommandArgs(args);
  };
}

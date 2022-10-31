import yargs from 'yargs';
import { BaseCommand } from '../base/command.js';
import { Command } from '../base/metadata.js';
import { CreateModuleCommand } from './create.module.command.js';
import { CreateEntityCommand } from './create.entity.command.js';

export enum CreateSubcommand {
  Module = 'module',
}

interface CreateCommandArguments {
  subcommand: CreateSubcommand;
}

@Command('create')
export class CreateCommand extends BaseCommand<CreateCommandArguments> {
  public description = 'Allows you to create various resources';

  public override subcommands = [CreateModuleCommand, CreateEntityCommand];

  public arguments = (args: yargs.Argv) => {
    return this.registerSubcommandArgs(args);
  };
}

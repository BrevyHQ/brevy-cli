import yargs, { ArgumentsCamelCase } from 'yargs';
import { Output } from '../../output/output.js';
import { AnyObject, Newable } from '../../utility/types.js';
import { CommandRegistry } from './command.registry.js';
import { mustExist } from '../../utility/exists.js';
import { CommandType, getCommandOwnMetadata } from './metadata.js';

export type CommandArguments<TArgs = AnyObject> = ArgumentsCamelCase<TArgs>;

export abstract class BaseCommand<TArgs = AnyObject> {
  public cmdArgs: Array<string> = [];
  public abstract description: string;

  public get cmd() {
    const metadata = getCommandOwnMetadata(this.constructor as Newable<BaseCommand>);
    return metadata.name;
  }

  public get commandString() {
    return `${this.cmd} ${this.cmdArgs.join(' ')}`.trim();
  }

  public subcommands: Array<Newable<BaseCommand>> = [];

  public abstract arguments: (args: yargs.Argv) => yargs.Argv | undefined;

  public handle(args: CommandArguments<TArgs>): void | Promise<void> {}

  public help() {
    Output.writeLine(this.description);
  }

  protected registerSubcommandArgs(appArgs: yargs.Argv) {
    for (const subcommand of this.subcommands) {
      const subcommandInstance = mustExist(
        CommandRegistry.getCommandByType(subcommand, CommandType.Subcommand),
      );

      appArgs.command(
        subcommandInstance.commandString,
        subcommandInstance.description,
        (args) => subcommandInstance.arguments(args),
        (args) => subcommandInstance.handle(args),
      );
    }

    return appArgs;
  }
}

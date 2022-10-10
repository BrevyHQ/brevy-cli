import yargs from 'yargs';
import { BaseCommand, CommandArguments } from '../base/command.js';
import { CommandRegistry } from '../base/command.registry.js';
import { Command } from '../base/metadata.js';

interface HelpCommandArguments {
  target: string;
}

@Command('help')
export class HelpCommand extends BaseCommand<HelpCommandArguments> {
  public override cmdArgs = ['[target]'];
  public description = 'Displays the help message for a command';

  public arguments = (args: yargs.Argv) => {
    return args.positional('target', {
      describe: 'The target to greet',
      default: 'world',
    });
  };

  public handle(args: CommandArguments<HelpCommandArguments>) {
    const targetCommand = CommandRegistry.getCommandByName(args.target);
    targetCommand.help();
  }
}

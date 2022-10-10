import yargs from 'yargs';
import { BaseCommand, CommandArguments } from '../base/command.js';
import { Output } from '../../output/output.js';
import { Command } from '../base/metadata.js';

interface HelloCommandArguments {
  target: string;
}

@Command('hello')
export class HelloCommand extends BaseCommand<HelloCommandArguments> {
  public override cmdArgs = ['[target]'];
  public description = 'Prints a hello message';

  public arguments = (args: yargs.Argv) => {
    return args.positional('target', {
      describe: 'The target to greet',
      default: 'world',
    });
  };

  public handle(args: CommandArguments<HelloCommandArguments>) {
    Output.writeLine(`Hey there, ${args.target}!`);
  }
}

import yargs from 'yargs';
import { AnyCommand } from './types.js';

export const createCommand = (commandArgs: yargs.Argv, command: AnyCommand) => {
  const { argv } = commandArgs.command(
    command.commandString,
    command.description,
    (args) => command.arguments(args),
    (args) => command.handle(args),
  );
};

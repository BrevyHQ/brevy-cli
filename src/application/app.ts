import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import inquirer, { QuestionCollection } from 'inquirer';
import { Output } from '../output/output.js';
import { CommandRegistry } from '../commands/base/command.registry.js';
import { CliConfigKey, Config } from '../filesystem/config.js';
import { Filesystem } from '../filesystem/filesystem.js';
import { History } from '../filesystem/history.js';

export class Application {
  public async run() {
    await Application.initialize();
    this.handleRuntime(process.argv);
  }

  private handleRuntime(runtimeArgs: Array<string>) {
    const appArgs = yargs(hideBin(runtimeArgs));
    for (const command of CommandRegistry.getAllCommands()) {
      appArgs.command(
        command.commandString,
        command.description,
        (args) => command.arguments(args),
        (args) => command.handle(args),
      );
    }

    appArgs.parse();
  }

  private static async initialize() {
    await Config.initialize();
    await History.initialize();
    const firstLaunch = Config.get(CliConfigKey.FirstLaunch);
    if (firstLaunch) {
      await Application.runSetup();
    }

    await Filesystem.initialize();
  }

  private static async runSetup() {
    Output.writeLine('Welcome to Brevy CLI! Hope you enjoy your time using it!');
    Output.writeLine('First though, we need to set up a few things.');

    const questions: QuestionCollection = [
      {
        name: [CliConfigKey.MonorepoPath],
        message: 'What is the absolute path to the root of Brevy monorepo on your machine?:',
      },
    ];

    const answers = await inquirer.prompt(questions);
    await Config.set(CliConfigKey.MonorepoPath, answers[CliConfigKey.MonorepoPath]);
    await Config.set(CliConfigKey.FirstLaunch, false);
  }
}

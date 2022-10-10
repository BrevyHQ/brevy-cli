import yargs from 'yargs';
import { BaseCommand, CommandArguments } from '../base/command.js';
import { Output } from '../../output/output.js';
import { Subcommand } from '../base/metadata.js';
import { Filesystem } from '../../filesystem/filesystem.js';
import { Generator } from '../../generator/generator.js';

interface NewModuleCommandArguments {
  module: string;
  project: string;
}

@Subcommand('new')
export class NewModuleCommand extends BaseCommand<NewModuleCommandArguments> {
  public override cmdArgs = ['[module]'];
  public description = 'Allows you to create a new module.';

  public arguments = (args: yargs.Argv) => {
    return args
      .positional('module', {
        describe: 'The name of the module to create',
        demandOption: true,
      })
      .option('project', {
        alias: 'p',
        type: 'string',
        demandOption: true,
        choices: [...Filesystem.clientProjectNames, ...Filesystem.serverProjectNames],
        describe: 'The name of the project to create the module in',
      });
  };

  public async handle(args: CommandArguments<NewModuleCommandArguments>) {
    const targetProject = Filesystem.getProjectByName(args.project);
    Output.writeLine(`Hey there, ${args.module!}, ${args.project}!`);
    const module = 'commands';
    const commandName = 'someTest';

    await Generator.run(Filesystem.getProjectCategoryCwd(targetProject), module, {
      project: args.project,
      module: 'test',
      commandName,
    });
  }
}

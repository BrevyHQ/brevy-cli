import yargs from 'yargs';
import { Subcommand } from '../base/metadata.js';
import { BaseCommand, CommandArguments } from '../base/command.js';
import { Filesystem, ProjectRoot } from '../../filesystem/filesystem.js';
import { CodeGenerator } from '../../generator/code.generator.js';

interface CreateEntityCommandArguments {
  generators: string;
  project: string;
}

@Subcommand('entity')
export class CreateEntityCommand extends BaseCommand<CreateEntityCommandArguments> {
  public override cmdArgs = ['[name]'];
  public description = 'Allows you to create a new entity';

  public arguments = (args: yargs.Argv) => {
    return args
      .positional('name', {
        describe: 'The name of the entity to create',
        demandOption: true,
      })
      .option('module', {
        alias: 'm',
        type: 'string',
        demandOption: true,
        choices: [
          ...Filesystem.getProjectModulesByProjectName(ProjectRoot.Client),
          ...Filesystem.getProjectModulesByProjectName(ProjectRoot.Server),
        ],
        describe: 'The name of the module to create the entity in',
      })
      .option('project', {
        alias: 'p',
        type: 'string',
        demandOption: true,
        choices: [
          ...Filesystem.getProjectNames(ProjectRoot.Client),
          ...Filesystem.getProjectNames(ProjectRoot.Server),
        ],
        describe: 'The name of the project to create the entity in',
      });
  };

  public handle(args: CommandArguments<CreateEntityCommandArguments>) {
    const targetProject = Filesystem.getProjectByName(args.project);

    const modules = ['core', 'domain'];
    return CodeGenerator.run(Filesystem.getProjectCategoryCwd(targetProject), {
      project: args.project,
      module: args.module,
      name: args.name,
      modules,
    });
  }
}

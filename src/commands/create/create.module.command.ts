import yargs from 'yargs';
import { Subcommand } from '../base/metadata.js';
import { BaseCommand, CommandArguments } from '../base/command.js';
import { Filesystem, ProjectRoot } from '../../filesystem/filesystem.js';
import { CodeGenerator } from '../../generator/code.generator.js';

interface CreateModuleCommandArguments {
  generators: string;
  project: string;
}

enum GeneratorModule {
  Read = 'read',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

@Subcommand('module')
export class CreateModuleCommand extends BaseCommand<CreateModuleCommandArguments> {
  public override cmdArgs = ['[name]', '[generators]'];
  public description = 'Allows you to create a new module';

  public arguments = (args: yargs.Argv) => {
    return args
      .positional('name', {
        describe: 'The name of the module to create',
        demandOption: true,
      })
      .positional('generators', {
        describe: 'Comma-separated names of generators to run',
        demandOption: true,
      })
      .option('project', {
        alias: 'p',
        type: 'string',
        demandOption: true,
        choices: [
          ...Filesystem.getProjectNames(ProjectRoot.Client),
          ...Filesystem.getProjectNames(ProjectRoot.Server),
        ],
        describe: 'The name of the project to create the module in',
      });
  };

  public handle(args: CommandArguments<CreateModuleCommandArguments>) {
    const targetProject = Filesystem.getProjectByName(args.project);
    const argModules = args.generators.split(',');

    const modules = [];
    if (argModules.includes('all')) {
      modules.push(...Object.values(GeneratorModule));
    } else {
      modules.push(...argModules.filter((module) => module !== 'all'));
      for (const module of modules) {
        if (!Object.values(GeneratorModule).includes(module as GeneratorModule)) {
          throw new Error(`Invalid module: ${module}`);
        }
      }
    }

    modules.unshift('core');

    return CodeGenerator.run(Filesystem.getProjectCategoryCwd(targetProject), {
      project: args.project,
      module: args.name,
      name: args.name,
      modules,
    });
  }
}

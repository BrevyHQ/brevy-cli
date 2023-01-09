import yargs from 'yargs';
import { BaseCommand, CommandArguments } from '../base/command.js';
import { Command } from '../base/metadata.js';
import { Filesystem, ProjectRoot } from '../../filesystem/filesystem.js';
import { Output } from '../../output/output.js';
import { ApiGenerator } from '../../generator/api.generator.js';
import { exists } from '../../utility/exists.js';
import * as process from "process";

interface ApigenCommandArguments {
  projects: string;
}

@Command('apigen')
export class ApigenCommand extends BaseCommand<ApigenCommandArguments> {
  public override cmdArgs = ['[projects]'];
  public description = 'Allows you to create various resources';

  public arguments = (args: yargs.Argv) => {
    return args.positional('projects', {
      describe: 'The name(s) of the project(s) to generate API for',
      demandOption: true,
    });
  };

  public async handle(args: CommandArguments<ApigenCommandArguments>) {
    if (!exists(args.projects)) {
      Output.writeLine('No projects specified. At least one is required!');
      process.exit(0);
    }

    const allServerProjects = Filesystem.getProjectNames(ProjectRoot.Server);
    const argProjects = Array.from(new Set(args.projects.split(',')));

    if (argProjects.includes('all')) {
      await ApiGenerator.run(allServerProjects);
      return;
    }

    if (argProjects.some((projectName) => !allServerProjects.includes(projectName))) {
      const projectNames = [...allServerProjects, 'all'].join(', ');
      Output.writeLine(`Invalid project name(s). Valid project names are: ${projectNames}`);
      process.exit(1);
    }

    await ApiGenerator.run(argProjects);
  }
}

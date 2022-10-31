import { execa } from 'execa';
import { AnyObject } from '../utility/types.js';
import { Filesystem } from '../filesystem/filesystem.js';
import { Output } from '../output/output.js';

class Generator {
  public async run(projects: Array<string>) {
    const generations = projects.map((project) => Generator.prepareFiles(project));
    await Promise.all(generations);
  }

  private static async prepareFiles(project: string) {
    await Generator.removeExistingContent(project);
    await Generator.spawnGenerator(project);
  }

  private static async spawnGenerator(project: string) {
    const command = 'generate';
    const npxArguments = [
      'openapi-generator-cli',
      command,
      ...Generator.getGeneratorArguments(project),
    ];
    await execa('npx', npxArguments);

    Output.writeLine(`Generated API for project ${project}`);
  }

  private static getGeneratorArguments(project: string) {
    const args: AnyObject = {
      '-i': Filesystem.getApigenSchemaFilepath(project),
      '-o': Filesystem.getApigenOutputDirectory(project),
      '-t': Filesystem.apigenTemplatesDirectory,
      '-g': 'typescript-fetch',
    };

    return Object.entries(args).flatMap((argument) => [argument[0], argument[1]]);
  }

  private static async removeExistingContent(project: string) {
    const outputDirectory = Filesystem.getApigenOutputDirectory(project);
    await Filesystem.removeDirectory(outputDirectory);
  }
}

export const ApiGenerator = new Generator();

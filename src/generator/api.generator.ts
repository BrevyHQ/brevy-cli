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
    await Generator.runBuild(project);
  }

  private static async spawnGenerator(project: string) {
    const npxArguments = [
      'openapi-generator-cli',
      'generate',
      ...Generator.getGeneratorArguments(project),
    ];
    await execa('npx', npxArguments, {
      cwd: Filesystem.filesystemRootDir,
    });

    Output.writeLine(`Successfully generated API for project ${project}`);
  }

  private static getGeneratorArguments(project: string) {
    const args: AnyObject = {
      '--generator-key': project,
    };

    return Object.entries(args).flatMap((argument) => [argument[0], argument[1]]);
  }

  private static async removeExistingContent(project: string) {
    const outputDirectory = Filesystem.getApigenOutputDirectory(project);
    await Filesystem.removeDirectory(outputDirectory);
  }

  private static async runBuild(project: string) {
    await execa('yarn', ['run', 'build'], {
      cwd: Filesystem.getApigenOutputDirectory(project),
    });

    Output.writeLine(`Successfully compiled API Client for ${project}`);
  }
}

export const ApiGenerator = new Generator();

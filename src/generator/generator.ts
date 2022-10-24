import { runner, Logger } from 'hygen';
import execa from 'execa';
import enquirer from 'enquirer';
import { AnyObject } from '../utility/types.js';

interface GeneratorData extends AnyObject {
  modules: Array<string>;
}

class CodeGenerator {
  public async run(cwd: string, data: GeneratorData) {
    for (const module of data.modules) {
      // eslint-disable-next-line
      await CodeGenerator.executeRunner(cwd, module, data);
    }
  }

  private static executeRunner(cwd: string, module: string, data: AnyObject) {
    const runnerArgs = ['module', module, ...CodeGenerator.getGeneratorArguments(data)];
    return runner(runnerArgs, {
      cwd,
      templates: '',
      createPrompter: () => enquirer as any,
      // eslint-disable-next-line
      logger: new Logger(console.log.bind(console)),
      exec: (action, body) => {
        const options = body && body.length > 0 ? { input: body } : {};
        return execa.command(action, { ...options, shell: true });
      },
    });
  }

  private static getGeneratorArguments(data: Record<string, string>) {
    const args: Array<string> = [];

    // eslint-disable-next-line
    for (const key in data) {
      args.push(`--${key}`, data[key]);
    }

    return args;
  }
}

export const Generator = new CodeGenerator();

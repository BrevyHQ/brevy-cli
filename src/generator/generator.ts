import { runner, Logger } from 'hygen';
import execa from 'execa';
import enquirer from 'enquirer';
import { GeneratorPlugin } from './plugins/plugin.js';
import { AnyObject } from '../utility/types.js';

class CodeGenerator {
  private plugins: Array<GeneratorPlugin> = [];

  public async run(cwd: string, module: string, data: AnyObject) {
    const runnerArgs = ['module', module, ...CodeGenerator.getGeneratorArguments(data)];
    const result = await runner(runnerArgs, {
      cwd,
      templates: '',
      createPrompter: () => enquirer as any,
      logger: new Logger(console.log.bind(console)),
      exec: (action, body) => {
        const options = body && body.length > 0 ? { input: body } : {};
        return execa.command(action, { ...options, shell: true });
      },
    });

    console.log(result.actions);
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

import envPaths from 'env-paths';
import { dirname } from 'path';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { Output, OutputColor } from '../output/output.js';
import { CliConfig } from './config.js';
import { AnyObject } from '../utility/types.js';

export abstract class Persistent {
  protected entries: AnyObject = {};

  protected abstract get fileName(): string;

  protected static get envPath() {
    return envPaths('brevy-cli');
  }

  protected async tryReadFromPersistence(): Promise<CliConfig | null> {
    try {
      const data = await readFile(this.fileName);
      const parsedConfig = JSON.parse(data.toString());
      this.entries = parsedConfig;
      return parsedConfig;
    } catch {
      return Promise.resolve(null);
    }
  }

  // eslint-disable-next-line consistent-return
  protected async tryCreatePersistence(initial: AnyObject, errorMessage: string) {
    try {
      await mkdir(dirname(this.fileName), { recursive: true });
      await writeFile(this.fileName, JSON.stringify(initial));
      this.entries = initial;
      return initial;
    } catch (error) {
      Output.writeLine(`${errorMessage}. Panic!: ${error}`, OutputColor.Red);
      process.exit(1);
    }
  }

  protected async tryWritePersistence(errorMessage: string) {
    try {
      await writeFile(this.fileName, JSON.stringify(this.entries));
    } catch (error) {
      Output.writeLine(`${errorMessage}. Panic!: ${error}`, OutputColor.Red);
      process.exit(1);
    }
  }
}

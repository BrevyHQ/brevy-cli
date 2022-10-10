import path from 'path';
import { exists, mustExist } from '../utility/exists.js';
import { Persistent } from './persistent.js';

export enum CliConfigKey {
  FirstLaunch = 'firstLaunch',
  MonorepoPath = 'monorepoPath',
}

export interface CliConfig {
  [CliConfigKey.FirstLaunch]: boolean;
  [CliConfigKey.MonorepoPath]: string;
}

const initialConfig: CliConfig = {
  firstLaunch: true,
  monorepoPath: '',
};

class ApplicationConfig extends Persistent {
  protected entries: CliConfig = initialConfig;

  protected get fileName() {
    return path.resolve(path.resolve(ApplicationConfig.envPath.config), 'config.json');
  }

  public get<TKey extends CliConfigKey = CliConfigKey>(key: TKey): CliConfig[TKey] {
    return mustExist(this.entries[key]);
  }

  public async set<TKey extends CliConfigKey = CliConfigKey>(key: TKey, value: CliConfig[TKey]) {
    if (!exists(value)) {
      throw new Error(`Config values cannot be nil! Key: ${key}`);
    }

    this.entries[key] = value;
    await this.tryWritePersistence('Failed to write config');
  }

  public async initialize() {
    const config = await this.tryReadFromPersistence();
    if (!exists(config)) {
      await this.tryCreatePersistence(initialConfig, 'Failed to create config');
    }
  }
}

export const Config = new ApplicationConfig();

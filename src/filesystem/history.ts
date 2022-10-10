import path from 'path';
import { AnyObject } from '../utility/types.js';
import { Persistent } from './persistent.js';
import { exists } from '../utility/exists.js';

interface ChangeRecord {
  timestamp: number;
  changes: Array<AnyObject>;
}

interface IHistory {
  records: Array<ChangeRecord>;
}

const initialHistory: IHistory = {
  records: [],
};

class ApplicationHistory extends Persistent {
  protected readonly entries: IHistory = initialHistory;

  protected get fileName() {
    return path.resolve(path.resolve(ApplicationHistory.envPath.config), 'config.json');
  }

  public get changeRecords() {
    return this.entries.records;
  }

  public async addRecord(changes: Array<AnyObject>) {
    const timestamp = Date.now();
    this.entries.records.push({ timestamp, changes });
    await this.tryWritePersistence('Failed to write history');
  }

  public async removeLastRecords(count = 1) {
    this.entries.records = this.changeRecords.slice(0, this.changeRecords.length - count);
    await this.tryWritePersistence('Failed to write history');
  }

  public async initialize() {
    const history = await this.tryReadFromPersistence();
    if (!exists(history)) {
      await this.tryCreatePersistence(initialHistory, 'Failed to create history');
    }
  }
}

export const History = new ApplicationHistory();

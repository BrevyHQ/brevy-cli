import clear from 'clear';
import chalk from 'chalk';

export enum OutputColor {
  White = 'white',
  Red = 'red',
}

export abstract class Output {
  public static clear() {
    clear();
  }

  public static writeLine(message: any, color: OutputColor = OutputColor.White) {
    // eslint-disable-next-line no-console
    console.log(chalk[color](message));
  }

  public static clearAndWriteLine(message: any, color: OutputColor = OutputColor.White) {
    Output.clear();
    Output.writeLine(message, color);
  }
}

import {ensureDirSync, appendFileSync } from 'fs-extra';
import { path } from "app-root-path";
import { format } from 'date-fns';
import {DATE_FORMAT, LOG_PATH} from "./logger.constants";
export class LoggerService {
  private readonly name: string;
  private readonly filePath: string;

  constructor(name: string) {
    this.name = name;
    this.filePath = path + LOG_PATH;
  }

  public info(text: string): void {
    const date = format(new Date(), DATE_FORMAT)
    const textToFile = `INFO: ${date} \n ${text} \n\n`;
    console.warn(text);
    ensureDirSync(this.filePath);
    appendFileSync(`${this.filePath}/info-log.txt`, textToFile);
  }

  public error(text: string) {
    const date = format(new Date(), DATE_FORMAT)
    const textToFile = `ERROR: ${date} \n ${text} \n\n`;
    console.warn(text);
    ensureDirSync(this.filePath);
    appendFileSync(`${this.filePath}/error-log.txt`, textToFile)
  }

  public warning(text: string) {
    const date = format(new Date(), DATE_FORMAT)
    const textToFile = `WARNING: ${date} \n ${text} \n\n`;
    console.warn(text);
    ensureDirSync(this.filePath);
    appendFileSync(`${this.filePath}/warning-log.txt`, textToFile)
  }
}

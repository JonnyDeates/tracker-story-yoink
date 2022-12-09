import * as fs from 'fs';
import { existsSync, appendFile } from 'fs';
import { when } from 'jest-when';
import writeOutputToFile from '../writeOutputToFile';
import chalk from "chalk";

jest.mock('fs');
describe('writeOutputToFile tests', () => {
  it('shouldn\'t write if file DOES exist', async () => {
    const logSpy = jest.spyOn(console, 'log')

    //call bad path
    when(existsSync).calledWith('./stories/doesExist.md').mockReturnValueOnce(true);

    await writeOutputToFile('new ChangeLog', 'doesExist');

     expect(logSpy).toHaveBeenCalledWith(chalk.hex('#dd9c58')("Skipping doesExist, it already exists, "));
  });
  it('should insert markdown to a new file', async () => {
    when(existsSync).calledWith('./stories/markdownFile.md').mockReturnValueOnce(false);

    await writeOutputToFile('new ChangeLog', 'markdownFile');
    expect(appendFile).toHaveBeenCalledWith(
        './stories/markdownFile.md',
        'new ChangeLog',
        expect.any(Function)
    );
  });
});

import { appendFile, existsSync } from 'fs';
import chalk from "chalk";

export default async function writeOutputToFile(
  markdown: string,
  fileName: string,
) {
  const modifiedFileName = fileName.replace("/", " ");
  const readmePath = `./stories/${modifiedFileName}.md`;

  if(existsSync(readmePath)) {
    console.log(chalk.hex('#dd9c58')(`Skipping ${modifiedFileName}, it already exists, `))
  } else {
    appendFile(readmePath, markdown, (err) => {
      if (err) {
        console.log(chalk.hex('#ff0000')(err));
      }
    });
  }
}

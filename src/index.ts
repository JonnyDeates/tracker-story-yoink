import chalk from 'chalk';
import main from './main';
export default async function app(): Promise<void> {
  return main();
}

function writeOutput(success: boolean, output: any) {
  const status = success
    ? 'changelog generated successfully'
    : 'changelog generation failed';
  const textColor = chalk.hex(success ? '#00FF00' : '#FF0000');

  console.log(textColor(status));
  console.log('===============\r\n');
  console.log(output);
}

app()
  .then(() => {
    console.log(chalk.hex('#00FF00')("Success!"));
  })
  .catch((e) => {
    writeOutput(false, e);
  });

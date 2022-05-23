const fs = require('fs');
const path = require('path');
const process = require('process');
const { stdin: input, stdout: output } = require('process');
const readline = require('readline');

const cp = require('child_process');

const lineListener = (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    process.exit();
  } else {
    streamWrite.write(input + '\r\n');
  }
};
const exitListener = () => {
  output.write('Put your text in text.txt.');
  rl.close();
};

const rl = readline.createInterface({ input, output });

const fullName = path.join(__dirname, 'text.txt');
const streamWrite = fs.createWriteStream(fullName, 'utf-8');

cp.exec('git --version', (err, stdout) => {
  if (err) {
    output.write(err);
  }
  if (stdout.trim().toLowerCase().slice(0, 16) === 'git version 2.35')
    output.write(
      'Your ' +
        stdout +
        'If you are using Git Bash, update your version, please) Or you can use another terminal' +
        '\r\n'
    );

  output.write('Put your text to write to file:');

  rl.on('line', lineListener);

  process.on('exit', exitListener);
  process.on('SIGINT', exitListener);
});
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const chalk = require('chalk').default;

let server = null;

function startServer() {
  if (server) {
    server.kill();
  }

  console.log(chalk.blue('\n File changed. Restarting server...\n'));

  server = spawn('node', ['server.js'], {
    stdio: 'inherit',
    cwd: __dirname
  });

  server.on('error', (error) => {
    console.error(chalk.red('Error starting server:'), error);
  });
}

const watchDirs = ['server.js', 'data', 'templates', 'modules'];

watchDirs.forEach((dir) => {
  const fullPath = path.join(__dirname, dir);

  fs.watch(fullPath, { recursive: true }, (eventType, filename) => {
    if (filename && (filename.includes('node_modules') || filename.includes('.git'))) {
      return;
    }

    startServer();
  });
});

console.log(chalk.green('Development watcher started'));
console.log(chalk.yellow('Watching for changes in: server.js, data/, templates/, modules/\n'));

startServer();

process.on('SIGINT', () => {
  console.log(chalk.red('\n\n Stopping development server...\n'));
  if (server) {
    server.kill();
  }
  process.exit(0);
});


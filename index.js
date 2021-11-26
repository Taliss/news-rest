const config = require('config');
const app = require('./api/app');

const port = config.get('server.port');
const { establishDBConnection } = require('./db');

app.listen(port, async () => {
  console.log(`Up and running on port: ${port}`);
  try {
    await establishDBConnection();
  } catch (err) {
    // some retry logic here maybe
    console.error(`Error establishing connection to the DB: ${err}`);
    process.kill(process.pid);
  }
});

// no sigterm under windows !
process.on('SIGTERM', () => {
  // some clean up can be done here, before we exit the process
  console.log('Shutting down');
  process.exit(1);
});

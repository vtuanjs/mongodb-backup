const app = require('./http');
const backupDB = require('./backup');
const CronJob = require('cron').CronJob;
const config = require('./config');
const {
  sendErrorToTelegram,
  sendSuccessMessageToTelegram,
} = require('./system_notify');

app.listen(config.httpPort, () => {
  console.info(`App listening at port: ${config.httpPort}`);
});

// Backup data immediately when start server, Default: 0
if (config.isForceBackup == 1) {
  backupDB();
}

// Default cron time: 0:00AM everyday, GMT +7
if (config.isAutoBackup == 1) {
  const job = new CronJob(
    config.cronJobTime,
    () => {
      backupDB();
    },
    null,
    true,
    'Asia/Vientiane'
  );

  job.start();
  sendSuccessMessageToTelegram('Auto backup MongoDB starting...');
  console.info('Auto backup MongoDB starting...');
}

process.on('beforeExit', async (code) => {
  await sendErrorToTelegram('🟥 Process beforeExit event', { code });
  console.error('Process beforeExit event with code: ', code);
  process.exit(1);
});

process.on('SIGTERM', async (signal) => {
  await sendErrorToTelegram(
    `🟥 Process ${process.pid} received a SIGTERM signal`,
    ''
  );
  console.error(`Process ${process.pid} received a SIGTERM signal`);
  process.exit(0);
});

process.on('SIGINT', async (signal) => {
  await sendErrorToTelegram(
    `🟥 Process ${process.pid} has been interrupted`,
    ''
  );
  console.error(`Process ${process.pid} has been interrupted`);
  process.exit(0);
});

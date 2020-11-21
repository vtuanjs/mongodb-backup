const backupDB = require('./backup');
const CronJob = require('cron').CronJob;
const config = require('./config');

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
  console.log('Auto backup MongoDB starting...');
}

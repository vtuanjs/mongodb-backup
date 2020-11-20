const backupDB = require('./backup');
const CronJob = require('cron').CronJob;
const config = require('./config')

if (config.forceBackup == 1) {
  backupDB();
}

const job = new CronJob(
  config.cronJobTime,
  () => {
    backupDB();
  },
  null,
  true,
  "Asia/Vientiane"
);
job.start();

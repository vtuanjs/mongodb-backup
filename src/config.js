const path = require('path');
require('dotenv').config();

module.exports = {
  user: process.env.MONGO_ROOT_USER || '',
  pass: process.env.MONGO_ROOT_PASSWORD || '',
  host: process.env.MONGO_HOST || 'localhost',
  port: process.env.MONGO_PORT || 27017,
  autoBackup: process.env.AUTO_BACKUP || 1,
  removeOldBackup: process.env.REMOVE_OLD_BACKUP || 1,
  keepLastDaysBackup: process.env.KEEP_LAST_DAYS_BACKUP || 7,
  forceBackup: process.env.FORCE_BACKUP || 1,
  autoBackupPath: path.join(__dirname, 'backup'),
  cronJobTime: process.env.CRON_JOB_TIME || "00 00 * * *",

  googleClientMail: process.env.GOOGLE_CLIENT_MAIL || '',
  googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY || '',
  googleScopes: ['https://www.googleapis.com/auth/drive'],
  googleFolderId: process.env.GOOGLE_FOLDER_ID || ''
};

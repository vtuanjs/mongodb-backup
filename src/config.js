const path = require('path');
require('dotenv').config();

module.exports = {
  user: process.env.MONGO_ROOT_USER || process.env.MONGO_BACKUP_USER || '',
  pass: process.env.MONGO_ROOT_PASSWORD || process.env.MONGO_BACKUP_PASSWORD || '',
  host: process.env.MONGO_HOST || 'localhost',
  port: process.env.MONGO_PORT || 27017,
  uri: process.env.MONGO_URI,

  isAutoBackup: process.env.IS_AUTO_BACKUP || 1,
  cronJobTime: process.env.CRON_JOB_TIME || '00 00 * * *',
  cronJobTimes: process.env.CRON_JOB_TIMES,
  autoBackupPath: path.join(__dirname, 'backup'),
  isForceBackup: process.env.IS_FORCE_BACKUP || 0,

  isRemoveOldLocalBackup: process.env.IS_REMOVE_OLD_LOCAL_BACKUP || 1,
  keepLastDaysOfLocalBackup: process.env.KEEP_LAST_DAYS_OF_LOCAL_BACKUP || 2,

  isRemoveOldDriveBackup: process.env.IS_REMOVE_OLD_DRIVE_BACKUP || 1,
  keepLastDaysOfDriveBackup: process.env.KEEP_LAST_DAYS_OF_DRIVE_BACKUP || 7,

  googleClientMail: process.env.GOOGLE_CLIENT_MAIL || '',
  googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY || '',
  googleScopes: [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.metadata',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/drive.photos.readonly',
    'https://www.googleapis.com/auth/drive.readonly',
  ],
  googleFolderId: process.env.GOOGLE_FOLDER_ID || '', // Do not forget share your folder to client email

  isAllowSendTelegramMessage: process.env.IS_ALLOW_SEND_TELEGRAM_MESSAGE || 1,
  telegramChanelId: process.env.TELEGRAM_CHANEL_ID || '',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  telegramMessageLevels: process.env.TELEGRAM_MESSAGE_LEVELS || 'info error',
  telegramPrefix: process.env.TELEGRAM_PREFIX || 'MongoDB Backup',

  httpPort: process.env.HTTP_PORT || 5050,
  token: process.env.HTTP_FORCE_BACKUP_TOKEN || ""
};

const fs = require('fs');
const _ = require('lodash');
const exec = require('child_process').exec;
const zipFolder = require('zip-folder');
const config = require('./config');
const { authorize, uploadFile } = require('./google-drive');

// Backup script
async function backup() {
  console.log(`[${getVNDate()}] Backup database starting...`);
  try {
    await createFolderIfNotExists(config.autoBackupPath);
    // check for auto backup is enabled or disabled
    if (config.isAutoBackup != 1) return;

    let oldBackupPath;
    let currentDate = getVNDate();

    let newBackupPath =
      config.autoBackupPath + '/' + formatYYYYMMDD(currentDate);

    // check for remove old backup after keeping # of days given in configuration
    if (config.isRemoveOldBackup == 1) {
      let beforeDate = _.clone(currentDate);
      beforeDate.setDate(beforeDate.getDate() - config.keepLastDaysBackup); // Substract number of days to keep backup and remove old backup

      oldBackupPath = config.autoBackupPath + '/' + formatYYYYMMDD(beforeDate); // old backup(after keeping # of days)
    }

    // create backup file
    const cmd = getMongodumpCMD(newBackupPath);
    await runCommand(cmd);

    // create zip file and remove old file
    const zipPath = await zipFolderPromise(newBackupPath);
    await runCommand(`rm -rf ${newBackupPath}`);

    if (config.isRemoveOldBackup == true) {
      if (fs.existsSync(oldBackupPath)) {
        await runCommand(`rm -rf ${oldBackupPath}.zip`);
      }
    }

    // handle google drive
    const auth = await authorize();
    const filedId = await uploadFile(auth, zipPath);
    console.log(
      `[${getVNDate()}] Backup database to GG Drive with file ID: ${filedId} successfully!`
    );
    return;
  } catch (error) {
    console.log(error);
  }
}

/**
 * 
 * @param {string} output output folder
 */
function getMongodumpCMD(output) {
  let cmd = `mongodump --host ${config.host} --port ${config.port}`;
  if (config.user) cmd += ` --username ${config.user}`;
  if (config.pass) cmd += ` --password ${config.pass}`;
  cmd += ` --out ${output}`;

  return cmd;
}

/**
 * 
 * @param {Date} date
 */
function formatYYYYMMDD(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function getVNDate() {
  return new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
  );
}

/**
 * 
 * @param {string} _path 
 */
function createFolderIfNotExists(_path) {
  return new Promise((resolve, reject) =>
    fs.mkdir(_path, { recursive: true }, (err) => {
      if (err) {
        return reject(err);
      }

      resolve(true);
    })
  );
}

/**
 * Run shell script
 * @param {string} cmd 
 */
function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    return exec(cmd, (error) => {
      if (error) return reject(error);

      resolve()
    });
  });
}

/**
 * Zip file
 * @param {string} _path 
 */
function zipFolderPromise(_path) {
  return new Promise((resolve, reject) => {
    const out = `${_path}.zip`;
    return zipFolder(_path, out, (error) => {
      if (error) return reject(error);

      resolve(out);
    });
  });
}

module.exports = backup;

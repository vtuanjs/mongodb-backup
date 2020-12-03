const { google } = require('googleapis');
const fs = require('fs');
const config = require('./config');
const _ = require('lodash');

/**
 * 
 * @param {*} auth 
 * @param {string} id 
 */
async function deleteFile(auth, id) {
  const drive = google.drive({ version: 'v3', auth });
  const result = await drive.files.delete({
    fileId: id,
  });

  return result.data;
}

/**
 * 
 * @param {*} auth 
 */
async function listFile(auth) {
  const drive = google.drive({ version: 'v3', auth });
  const files = await drive.files.list({
    q: "'" + config.googleFolderId + "' in parents"
  });

  return files.data.files;
}

async function authorize() {
  const jwt = new google.auth.JWT(
    config.googleClientMail,
    null,
    _.replace(config.googlePrivateKey, new RegExp("\\\\n", "\g"), "\n"),
    config.googleScopes
  );

  await jwt.authorize();
  return jwt;
}

/**
 * @param {object} params
 * @param {string} params.auth
 * @param {string} params.filePath
 * @param {string} params.fileName
 */
async function uploadFile({auth, filePath, fileName}) {
  const drive = google.drive({ version: 'v3', auth });
  const fileMetadata = {
    name: fileName,
    parents: [config.googleFolderId],
  };
  const media = {
    mimeType: 'application/zip',
    body: fs.createReadStream(filePath),
  };

  const file = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'name',
  });

  if (file && file.data) return file.data;
  throw new Error('Upload file error');
}

module.exports = {
  authorize,
  uploadFile,
  listFile,
  deleteFile,
};

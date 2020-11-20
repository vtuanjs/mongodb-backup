const { google } = require('googleapis');
const fs = require('fs');
const config = require('./config');

async function authorize() {
  const jwt = new google.auth.JWT(
    config.googleClientMail,
    null,
    config.googlePrivateKey,
    config.googleScopes
  );

  await jwt.authorize();
  return jwt;
}

async function uploadFile(auth, filePath) {
  const drive = google.drive({ version: 'v3', auth });
  const [fileName] = filePath.split('/').slice(-1);
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
    fields: 'id',
  });

  if (file && file.data) return file.data.id;
  throw new Error('Upload file error');
}

module.exports = {
  authorize,
  uploadFile,
};

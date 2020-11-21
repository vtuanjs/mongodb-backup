const axios = require('axios');
const config = require('./config');

/**
 *
 * @param {Error} error
 */
function changeErrorObjectToMessage(error) {
  let text = '';

  if (typeof error === 'string' && error.trim()) {
    text += `\n - Message: ${error}`;
  }

  if (typeof error.code === 'string' || typeof error.code === 'number') {
    text += `\n - Code: ${error.code}`;
  }

  if (typeof error.message === 'string') {
    text += `\n - Message: ${error.message}`;
  }

  if (typeof error.details === 'object') {
    if (typeof error.details.code === 'string') {
      text += `\n - Code Detail: ${error.details.code}`;
    }

    if (typeof error.details.message === 'string') {
      text += `\n - Message Detail: ${error.details.message}`;
    }

    if (typeof error.details.localMessage === 'string') {
      text += `\n - Local Message Detail: ${error.details.localMessage}`;
    }
  }

  return text;
}

/**
 *
 * @param {string} message
 */
async function sendMessageToTelegram(message) {
  if (!config.telegramBotToken || !config.telegramChanelId) {
    return;
  }
  
  let isSend =
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'staging' ||
    process.env.NODE_ENV === 'production';
  if (!isSend) return;

  const splitDate = new Date()
    .toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
    .split('/');
  const formatDate = `${splitDate[1]}/${splitDate[0]}/${splitDate[2]}, VietNam`;

  try {
    await axios({
      url: `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`,
      method: 'POST',
      data: {
        chat_id: config.telegramChanelId,
        text: `${formatDate}\n\n${message}`,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return;
  } catch (error) {
    console.log('Send telegram message error', error);
    return;
  }
}

/**
 * @param {string} title
 * @param {object} error
 */
async function sendErrorToTelegram(title, error) {
  return sendMessageToTelegram(
    `❌ ${config.telegramPrefix}\n\n${title} \n${changeErrorObjectToMessage(
      error
    )}`
  );
}

/**
 *
 * @param {string} title
 */
async function sendSuccessMessageToTelegram(title) {
  return sendMessageToTelegram(`✅ ${config.telegramPrefix}\n\n${title}`);
}

/**
 * @typedef {Object} Error
 * @property {String} code
 * @property {String} message
 * @property {ErrorDetails} details
 */

/**
 * @typedef {Object} ErrorDetails
 * @property {String} code
 * @property {String} message
 * @property {String} localMessage
 */

module.exports = { sendErrorToTelegram, sendSuccessMessageToTelegram };

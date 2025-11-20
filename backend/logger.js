const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, 'app.log');

const levels = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
};

function log(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...meta
  };
  
  const logString = JSON.stringify(logEntry) + '\n';
  
  console.log(`[${timestamp}] ${level}: ${message}`, meta);
  
  fs.appendFile(logFile, logString, (err) => {
    if (err) console.error('Failed to write to log file:', err);
  });
}

module.exports = {
  info: (message, meta) => log(levels.INFO, message, meta),
  warn: (message, meta) => log(levels.WARN, message, meta),
  error: (message, meta) => log(levels.ERROR, message, meta)
};

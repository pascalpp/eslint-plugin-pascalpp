const debug = require('debug');

module.exports = function createDebug(path) {
  const filenameWithExtension = path.split('/').pop();
  const filename = filenameWithExtension.split('.').shift()
  return debug(filename);
}

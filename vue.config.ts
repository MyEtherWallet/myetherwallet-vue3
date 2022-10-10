const offlineConfig = require('./builds/offlineConfig.ts');
const liveConfig = require('./builds/liveConfig.ts');

let exportObj = {};
console.log(process.env.BUILD);
if (process.env.BUILD === 'offline') {
  exportObj = offlineConfig;
} else {
  exportObj = liveConfig;
}

module.exports = exportObj;

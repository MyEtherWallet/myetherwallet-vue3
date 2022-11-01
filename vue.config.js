import offlineConfig from './builds/offlineConfig.js';
import liveConfig from './builds/liveConfig.js';

let exportObj = {};
if (process.env.BUILD === 'offline') {
  exportObj = offlineConfig;
} else {
  exportObj = liveConfig;
}

export default exportObj;

const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const projectRoot = __dirname;
const sharedRoot = path.resolve(projectRoot, '../shared');

const config = getDefaultConfig(projectRoot);

// The shared package lives beside the app. Libraries it imports fall back to
// this app's node_modules (in cloud builds only this folder is installed).
config.watchFolders = [sharedRoot];
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')];
config.resolver.extraNodeModules = { '@selit/shared': sharedRoot };

module.exports = withNativeWind(config, { input: './src/global.css' });

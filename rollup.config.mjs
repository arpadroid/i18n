import copy from './node_modules/@arpadroid/arpadroid/node_modules/rollup-plugin-copy/dist/index.commonjs.js';
import { getBuild } from '@arpadroid/arpadroid/src/rollup/builds/rollup-builds.mjs';

const { build, plugins, appBuild } = getBuild('i18n', 'uiComponent');
appBuild.plugins = [...plugins, copy({ targets: [{ src: 'src/lang', dest: 'dist' }] })];
export default build;

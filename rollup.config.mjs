import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import { getBuild } from '@arpadroid/arpadroid/src/rollup/builds/rollup-builds.mjs';
const { build, plugins, appBuild } = getBuild('i18n', 'uiComponent');
appBuild.plugins = [json(), ...plugins, copy({ targets: [{ src: 'src/lang', dest: 'dist' }] })];
export default build;

// @ts-ignore
import { getBuild, rollupCopy } from '@arpadroid/module';
const { build = {}, plugins, appBuild } = getBuild('i18n', 'uiComponent');
appBuild.plugins = [
    ...(Array.isArray(plugins) ? plugins : []),
    rollupCopy({ targets: [{ src: 'src/lang', dest: 'dist' }] })
];
export default build;

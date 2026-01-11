import { getBuild } from '@arpadroid/module';
const { build = {}, plugins, appBuild = {}, Plugins } = getBuild('i18n');
appBuild.plugins = [
    ...(Array.isArray(plugins) ? plugins : []),
    Plugins?.copy({ targets: [{ src: 'src/lang', dest: 'dist' }] })
];
export default build;

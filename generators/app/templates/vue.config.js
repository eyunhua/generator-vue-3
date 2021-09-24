/**
 * @file 运行配置
 * @author BIFE
 */
/* eslint-disable */

const path = require('path');
const fs = require('fs');

const sourceFile = __dirname + '/build/auth.js.example';
const targetFile = __dirname + '/build/auth.js';
if (!fs.existsSync(targetFile)) {
    fs.copyFileSync(sourceFile, targetFile);
}
const {username, password} = require('./build/auth');

if ((!username || !password) && process.env.NODE_ENV === 'development') {
    console.log('请补充build/auth.js文件中的username和password');
    process.exit(1);
}

function resolve(dir) {
    return path.join(__dirname, dir);
}
const Uuaper = require('uuaper');

const uuap = new Uuaper({
    target: '',
    debug: true,
    cache: './cache',
    mock: false,
    auth: {
        username,
        password,
        server: 'xxx',
        retry: function (res, data) {
            return +res.statusCode === 403 || +res.statusCode === 302;
        }
    }
});

module.exports = {
    devServer: {
        before(app) {
            app.use('/api', uuap); // 此处第一个参数为请求API的path
        }
    },
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    },
    transpileDependencies: ['resize-detector'],
    chainWebpack: config => {
        if (process.env.NODE_ENV === 'development') {
            // 为开发环境修改配置...
            console.log('development');
        }
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            console.log('production');
        }
        if (process.env.NODE_ENV === 'test') {
            // 为测试环境修改配置...
            console.log('test');
        }

        // 国际化
        // npm i vue-i18n@next -D
        // 定义vue-i18n所需全局变量（默认值）
        // https://vue-i18n.intlify.dev/guide/advanced/optimization.html#reduce-bundle-size-with-feature-build-flags
        config
            .plugin('define')
            .tap(args => {
                args[0]['__VUE_I18N_FULL_INSTALL__'] = JSON.stringify(true);
                args[0]['__VUE_I18N_LEGACY_API__'] = JSON.stringify(true);
                args[0]['__INTLIFY_PROD_DEVTOOLS__'] = JSON.stringify(false);
                return args;
            });

        // svg转vue组件
        // npm i vue-svg-loader@beta -D
        // /assets/svgs 外的 svg 使用默认处理
        const svgAsFile = config.module.rule('svg');
        svgAsFile.exclude.store.add(resolve('src/assets/svgs'));

        // /assets/svgs 内的 svg 使用 vue-svg-loader
        const svgAsVue = config.module.rule('svg2vue')
            .test(svgAsFile.store.get('test'))
            .use('vue-loader-v16')
            .loader('vue-loader-v16')
            .end()
            .use('vue-svg-loader')
            .loader('vue-svg-loader')
            .options({
                svgo: {
                    plugins: [
                        // 移除宽高
                        {removeDimensions: true},
                        // 保留viewBox
                        {removeViewBox: false}
                    ]
                }
            })
            .end();
        svgAsVue.include.store.add(resolve('src/assets/svgs'));

        config.resolve.alias
            .set('@', resolve('src'))
            .set('api', resolve('src/api'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('config', resolve('src/config'))
            .set('hooks', resolve('src/hooks'))
            .set('router', resolve('src/router'))
            .set('store', resolve('src/store'))
            .set('types', resolve('src/types'))
            .set('utils', resolve('src/utils'))
            .set('views', resolve('src/views'))
            .end();

        // 异步组件禁用预加载
        config.plugins.delete('prefetch');
    },

    // 打包配置
    publicPath: '',
    // 放置打包后生成的静态资源（js、css、img、fonts）的目录，该目录相对于outputDir
    assetsDir: 'static',
    // 指定生成的index.html的输出路径，相对于outputDir。也可以是一个绝对路径。
    indexPath: 'index.html'
};

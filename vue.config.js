const path = require('path');
const os = require('os');

function resolve(dir) {
    return path.join(__dirname, dir)
}
function getNetworkIp() {
    let needHost = ''; // 打开的host
    try {
        // 获得网络接口列表
        let network = os.networkInterfaces();
        for (let dev in network) {
            let iface = network[dev];
            for (let i = 0; i < iface.length; i++) {
                let alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    needHost = alias.address;
                }
            }
        }
    } catch (e) {
        needHost = 'localhost';
    }
    return needHost;
}

let devPublicPath = `//${getNetworkIp()}:${process.env.VUE_APP_MicroPort}`
let proPublicPath = `/${process.env.VUE_APP_MICRONAME}/`
module.exports = {
    pages: {
        index: 'src/main.js',
        sub: 'src/sub-main.js',
    },
    publicPath: process.env.NODE_ENV === "production" ? proPublicPath : devPublicPath,
    outputDir: `${process.env.VUE_APP_MICRONAME}`,
    assetsDir: 'static',
    filenameHashing: true,
    lintOnSave: false,
    devServer: {
        hot: true,
        disableHostCheck: true,
        port: process.env.VUE_APP_MicroPort,
        overlay: {
            warnings: false,
            errors: true
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers':'*'
        }
    },
    // 自定义webpack配置
    configureWebpack: {
        // name: name,
        resolve: {
            alias: {
                '@': resolve('src')
            }
        },
        output: {
            //把子应用打包成 umd 库格式
            library: '[name]',
            filename: '[name].js',
            libraryTarget: 'umd',
            globalObject: 'window',
        }
    }
};

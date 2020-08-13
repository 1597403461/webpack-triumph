# webpack-triumph

webpack 的学习总结记录

## 摘要

webpack 是一个现代 JavaScript 应用程序的静态模块打包器

webpack 的默认配置文件是 webpack.config.js

可通过 webpack --config 指定配置文件

开发环境一般设置为 webpack.config.dev.js

生产环境一般设置为 webpack.config.pro.js

## 零配置的的默认 webpack 的配置文件

```js
module.export = {
    entry: './src/index.js',
    output: './dist/main.js'
};
```

## 环境搭建 Node.js 和 NPM（自行安装，可百度）

### 初始化 webpack

`npm init -y`即可初始化 webpack 生成 package.json

`-y`会默认初始化配置为 yes

### 安装 webpack 以及 webpack-cli

`npm i webpack webpack-cli --save-dev`

### 检查是否安装

`./node_modules/.bin/webpack -v`

### 简单例子展示 webpack 的使用

```js
// webpack 脚本(webpack.config.js)
const path = require('path');
module.export = {
    mode: 'production',
    entry:'./src/index.js',
    output:{
        path: path.resolve(__dirname,'dist'),
        filename:'bundle.js'
    }
}
// src 文件夹下创建 index.js 文件并随意输出(入口文件)
document.write('hello world');

// 运行打包在终端执行
./node_modules/.bin/webpack

// 构建结果(自动生成dist/bundle.js文件)

// 手动创建html文件并引入 bundle.js 文件即可打开 html 文件
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script src="dist/bundle.js"></script>
</body>
</html>
```

通过例子发现打包命令`./node_modules/.bin/webpack`很复杂，

我们安装依赖后，如果依赖存在命令的话，会在`./node_modules/.bin`目录下创建软链接

`package.json`文件可默认读取到`./node_modules/.bin`目录下的命令

所以在`package.json`文件下配置 script 即可指定任意软链接

```js
// package.json
{
  "scripts": {
    "build": "webpack"
  }
}
```

删除已经打包好的 dist 目录`rm -rf dist`重新执行`npm run build`即可再次完成运行打包

### 自动清理打包目录（不用手动`rm -rf dist`）

`npm i clean-webpack-plugin -D`

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    plugins: [
        new CleanWebpackPlugin() // 打包前清空dist目录
    ]
};
```

## webpack 核心概念的基础用法

### entry 入口文件配置

```js
// 单入口文件
module.export = {
    entry: './src/index.js'
};
// 多入口文件
module.export = {
    entry: {
        app: './src/app.js',
        adminApp: './src/adminApp.js'
    }
};
```

### outPut 出口文件

outPut 是告诉 webpack 如何将编译后的文件输出到磁盘

```js
module.export = {
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    }
};
```

### loader

![Alt](./public/loader.png)

使用方法

```js
// test 指代匹配规则 use 指定使用 loader 名称
module.export = {
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', { loader: 'css-loader' }]
            }
        ]
    }
};
```

### plugins

主要是增强 webpack 的功能

![Alt](./public/plugins.png)

使用方法

```js
module.exports = {
    plugins: [
        new CleanWebpackPlugin() // 打包前清空dist目录
    ]
};
```

## mode

mode 用来指定当前的构造环境:production、development、none

设置 mode 可以使用 webpack 内置的函数，默认为 production

mode 的内置函数功能

![Alt](./public/mode.png)

## 123

### 解析 ES6

使用`babel-loader`

`npm i @babel/core @babel/preset-env babel-loader --save-dev`

babel 的配置文件是.babelrc

```js
{
    "presets": [
        "@babel/preset-env", // 解析 ES6
    ]
}
```

### babel

1. 核心库@babel/core
   Babel 的核心功能包含在 @babel/core。没有它，在 babel 的世界里注定寸步难行。不安装 @babel/core，无法使用 babel 进行编译。

2. cli命令执行工具@babel/cli
    安装依赖`npm i @babel/cli -D`可用babel命令进行编译打包

3. @babel/preset-env
   主要作用是对我们所使用的并且目标浏览器中缺失的功能进行代码转换和加载 polyfill，在不进行任何配置的情况下，@babel/preset-env 所包含的插件将支持所有最新的 JS 特性(ES2015,ES2016 等，不包含 stage 阶段)，将其转换成 ES5 代码
   使用`babel-loader`
   `npm i @babel/core @babel/preset-env babel-loader --save-dev`
   babel 的配置文件是.babelrc

    ```js
    {
        "presets": [
            "@babel/preset-env", // 解析 ES6
        ]
    }
    ```

4. polyfill
   @babel/preset-env 语法转换只是将高版本的语法转换成低版本的,但是新的内置函数、实例方法无法转换.这时，就需要使用 polyfill 上传了，顾名思义，polyfill 的中文意思是垫片，所谓垫片就是垫平不同浏览器或者不同环境下的差异，让新的内置函数、实例方法等在低版本浏览器中也可以使用。
   首先，安装 @babel/polyfill 依赖:`npm install --save @babel/polyfill`

    ```js
    import '@babel/polyfill';

    const isHas = [1,2,3].includes(2);

    const p = new Promise((resolve, reject) => {
        resolve(100);
    });

    ```

    @babel/polyfill 需要在其它代码之前引入，我们也可以在 webpack 中进行配置。

    ```js
        entry: [
            require.resolve('./polyfills'),
            path.resolve('./index')
        ]
    ```

    问题: 此时的 polyfill 是完整全部导入导致文件太大，而且此方式打包污染全局变量，需要实现按需加载所需 polyfill 内容，避免引入无用代码并且防止污染全局
    解决方法1: @babel/preset-env 提供了一个 useBuiltIns 参数，设置值为 usage 时，就只会包含代码需要的 polyfill，但是配置此参数的值为 usage ，必须要同时设置 corejs， 安装依赖`npm install --save core-js@3`

    ```js
    //.babelrc
    const presets = [
        [
            "@babel/env",
            {
                "useBuiltIns": "usage",
                "corejs": 3
            }
        ]
    ]
    ```

    此时依然要配合 @babel/polyfill 使用， Babel 会检查所有代码，以便查找在目标环境中缺失的功能，然后仅仅把需要的 polyfill 包含进来。

    解决方法2: 安装依赖库`npm install --save-dev @babel/plugin-transform-runtime`和`npm install --save @babel/runtime-corejs3`

    ```js
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": 3
            }
        ]
    ]
    ```

    方法2更合适，因为方法2还能处理帮助函数（将帮助函数变成引用的形式）。

    验证方法
        1. 通过更改.babelrc的配置文件
        2. 可执行`npm run compiler`打包，将src目录下的test文件打包到lib文件夹下，查看打包后的结果进行验证

### 解析 jsx

安装 react 以及 react 的 babel

`npm i react react-dom @babel/preset-react -D`

修改配置文件.babelrc

```js
{
    "presets": [
        "@babel/preset-react" //增加 react 的 babel preset 配置
    ]
}
```

配置 webpack 的 loader

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                use: 'babel-loader'
            }
        ]
    }
};
```

### 解析 css

css-loader 用于加载.css 文件，并且转换为 commonjs 对象

style-loader 将样式通过`<style>`标签插入到 head 中

`npm i style-loader css-loader -D`

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', { loader: 'css-loader' }]
            }
        ]
    }
};
```

### 解析 less

less-loader 用于将 less 转换为 css

`npm i less less-loader -D`

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', { loader: 'css-loader' }]
            },
            {
                test: /\.less$/,
                use: ['style-loader', { loader: 'css-loader' }, { loader: 'less-loader' }]
            }
        ]
    }
};
```

### 解析图片和字体

file-loader 用于处理文件

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.(ico|png|jpg|jpeg|mp4|mp3|gif|mov)$/,
                use: 'file-loader'
            }
        ]
    }
};
```

url-loader 也可以处理图片和字体，可以设置更小的资源自动 base64

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.(ico|png|jpg|jpeg|mp4|mp3|gif|mov)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192 // 限制字节（如果图片或者字体的字节数小于此数值，自动转换为base64）
                        }
                    }
                ]
            }
        ]
    }
};
```

### 文件监听(浏览器不会自动刷新)（两种方式）(不常用)

在 package.json 文件中的 script 中添加：`"watch": "webpack --watch"`

在配置 webpack.config.js 文件中设置`watch: true`

### webpack 热更新 webpack-dev-server

WDS（webpack-dev-server）不刷新浏览器，不输出文件，而是放在内存中

```js
// 前提安装webpack以及webpack-cli `npm i webpack webpack-cli --save-dev`
const webpack = require('webpack');
module.exports = {
    plugins: [new webpack.HotModuleReplacementPlugin()],
    devServer: {
        contentBase: './dist',
        hot: true
    }
};
```

### 文件指纹（版本管理，更新迭代）

js 文件使用 chunkhash css 文件使用 contenthash

hash: 如果都使用 hash 的话，因为这是工程级别的，即每次修改任何一个文件，所有文件名的 hash 至都将改变。所以一旦修改了任何一个文件，整个项目的文件缓存都将失效。

chunkhash: chunkhash 根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值。在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用 chunkhash 的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响。

contenthash: contenthash 是针对文件内容级别的，只有你自己模块的内容变了，那么 hash 值才改变。

注意：chunkhash 和热更新存在冲突。所以一般生产环境不使用热更新。chunkhash 用于生产环境

```js
//设置MiniCssExtractPlugin的filename使用[contenthash]
//MiniCssExtractPlugin和style-loader不能共用，需要替换`style-loader`=`MiniCssExtractPlugin.loader`
module.exports = {
    entry: { index: './src/index.js', app: './src/app.js' },
    // js文件指纹设置
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]_[chunkhash:8].js'
    },
    // css文件指纹设置
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        })
    ]
};
```

```js
// 图片文件指纹
module.exports = {
    module: {
        rules: [
            {
                test: /\.(ico|png|jpg|jpeg|mp4|mp3|gif|mov)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192, // 限制字节（如果图片或者字体的字节数小于此数值，自动转换为base64）
                            name: '[name]_[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    }
};
```

### 代码压缩（html 压缩、css 压缩、js 压缩）

js 文件压缩默认内置了 uglifyjs-webpack-plugin

css 压缩：optimize-css-assets-webpack-plugin 需要安装预处理器 cssanano

html 压缩： html-webpack-plugin,设置压缩参数

```js
// css压缩
const optimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
    plugins: [
        new optimizeCssAssetsWebpackPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        })
    ]
};
//html压缩
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            // favicon: './favicon.ico',
            template: 'index.html',
            filename: 'index.html',
            inject: true,
            hash: false,
            chunks: ['index'],
            minify: {
                // 压缩HTML文件
                html5: true,
                collapseWhitespace: true, //删除空白符
                preserveLineBreaks: false,
                minifyCSS: true, // 压缩内联css
                minifyJS: true,
                removeComments: false //移除注释
            }
        })
    ]
};
```

## 456

### 资源内联

资源内联的意义：页面框架的初始化脚本、上报相关打点、css 内联避免样式闪烁、减少 http 网络请求次数

使用 raw-loader `npm i raw-loader@0.5.1 -D`

直接在 html 文件中引入：

```js
<head>
    ${require('raw-loader!./meta.html')}
    <title>Document</title>
</head>
```

css 内联方案一： 借助 style-loader

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', { loader: 'css-loader' }]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            insertAt: 'top', // 样式插入到<head>
                            singleon: true // 将所有style标签合为1个
                        }
                    },
                    { loader: 'css-loader' },
                    { loader: 'less-loader' }
                ]
            }
        ]
    }
};
```

css 内联方案二： html-inline-css-webpack-plugin

此方式需结合 css 文件指纹共同使用生效

```js
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;
module.exports = {
    plugins: [new HTMLInlineCSSWebpackPlugin()]
};
```

### 多页面打包

思路：动态获取 entry 和设置 html-webpack-plugin 数量

利用 glob 插件取得所有的入口文件`glob.sync(path.join(__dirname, "./src/*/index.js"))`

`cnpm i glob -D`

```js
// 多页面打包封装入口函数setMPA.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const path = require('path');
const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugins = [];
    const entryFiles = glob.sync(path.join(__dirname, '../src/*/index.jsx'));
    console.log(entryFiles);
    Object.keys(entryFiles).map(index => {
        const entryFile = entryFiles[index];
        // '/Users/cpselvis/my-project/src/index/index.js'

        const match = entryFile.match(/src\/(.*)\/index\.js/);
        const pageName = match && match[1];

        entry[pageName] = entryFile;
        htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                template: path.join(__dirname, `../src/${pageName}/index.html`),
                filename: `${pageName}.html`,
                chunks: [pageName],
                inject: true,
                minify: {
                    html5: true,
                    collapseWhitespace: true,
                    preserveLineBreaks: false,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: false
                }
            })
        );
    });

    return {
        entry,
        htmlWebpackPlugins
    };
};

module.exports = setMPA;

// 在webpack.base.js中引入setMPA函数
const setMPA = require('./utils/setMPA');
const { entry, htmlWebpackPlugins } = setMPA();
module.exports = {
    entry,
    plugins: [new CleanWebpackPlugin()].concat(htmlWebpackPlugins)
};
```

### source-map 的使用

作用：通过 source-map 定位源代码（开发环境开启，线上环境关闭）

`devtool: 'source-map'`

### 提取页面公共资源

方法一：基础库的分离
思路：将 react、react-dom 基础包通过 cdn 引入，不打入 bundle 中，使用 `html-webpack-externals-plugin`

```js
const HtmlWebpackExternalsPlugins = [
    new HtmlWebpackExternalsPlugin({
        externals: [
            {
                module: 'react',
                entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
                global: 'React'
            },
            {
                module: 'react-dom',
                entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
                global: 'ReactDOM'
            }
        ]
    })
];
module.exports = {
    plugins: [
        new CleanWebpackPlugin() // 打包前清空dist目录
    ]
        .concat(htmlWebpackPlugins)
        .concat(HtmlWebpackExternalsPlugins)
};
// HtmlWebpackExternalsPlugins插件必须在htmlWebpackPlugins插件后面，不然还得在模板html文件中引入cdn文件(即是HtmlWebpackExternalsPlugins中的entry文件)
```

方法二：利用 SplitChunksPlugin 进行公共脚本分离

```js
module.exports = {
    optimization: {
        // 代码分割，提取公共代码
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /(react|react-dom)/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    }
};
```

方法 3：预编译资源模块

```js
// 思路：将react、react-dom、redux等基础包和业务打包成一个文件
// 方法：使用DLLPlugin进行分包，DllReferencePlugin对manifest.json引用
// 创建webpack.dll.js文件
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        library: [
            'react',
            'react-dom'
        ]
    },
    output: {
        filename: '[name]_[hash].dll.js', // 不能使用chunkhash/contenthash
        path: path.join(__dirname, 'build/library'),
        library: '[name]_[hash]' // 暴露出库的名称
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]_[hash]',
            path: path.join(__dirname, 'build/library/[name].json')
        })
    ]
}
// 在package.json中设置
{
  "scripts": {
    "dll": "webpack --config webpack.dll.js"
  },
}
// 运行npm run dll 打包生成build文件夹及其文件

// 配置webpack.prod.js文件,通过add-asset-html-webpack-plugin插件为html自动添加文件
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
module.exports = {
    plugins: [
        new webpack.DllReferencePlugin({
            manifest: require('./build/library/library.json')
        }),
        new AddAssetHtmlPlugin({
            filepath: path.resolve(__dirname, 'build/library/*.dll.js'),
        }),
    ]
};
// 最后npm run build 打包
// 三个方法比较：方法三更加推荐，主要分离基础包react、react-dom等；方法二必须还得为每个库指定CDN；
```

### 提升二次构建速度

webpack5 中会内置 hard-source-webpack-plugin

此方式是 webpack DllPlugin 配置的替代方案

`cnpm i hard-source-webpack-plugin -D`

```js
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
module.exports = {
    plugins: [new HardSourceWebpackPlugin()]
};
```

### tree shaking 摇树优化

摇树优化指代代码中没有用到的内容在生产环境自动删除

webpack 默认支持，webpack 的 mode 参数可配置 tree shaking

```js
// 此代码永远不会执行，在生产环境会自动清除
if (false) {
    console.log(123);
}
```

### 代码分割

对于一个大型应用，把所有的代码放到一个文件显然不够有效，故 webpack 存在一个功能将代码库分割成 hunks（语块）,代码运行到需要它们的时候才去加载

适用场景：

1. 抽离想用代码到一个共享块
2. 脚本懒加载，使得初始下载的代码更小

懒加载 js 脚本的方式：

1. CommonJS:require.ensure
2. ES6:动态 import（目前没有原生支持，需要 babel 转换`cnpm install --save-dev @babel/plugin-syntax-dynamic-import`）

```js
// .babelrc文件中添加
{
    "plugins":["@babel/plugin-syntax-dynamic-import"],
}

// 举例
// Text.jsx
import React from 'react';
export default () => <div>动态importjs</div>;
// index.jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import lake from './lake.jpg';

function App() {
    const [Component,setComponent] = useState(null);
    const onClick = () => {
        import('./Text.jsx').then((res) => {
            setComponent(res.default)
        })
    }
    return <div>
        {Component ? Component : null}
        <img src={lake} alt="" onClick={onClick}/>
    </div>
}

ReactDOM.render(<App/>,document.getElementById('root'))
```

### webpack 打包库和组件

### 优化命令行的构建日志

使用 friendly-errors-webpack-plugin: success、warning、error
`cnpm i friendly-errors-webpack-plugin -D`

```js
module.exports = {
    plugins: [new webpack.HotModuleReplacementPlugin(), new friendlyErrorsWebpackPlugin()],
    devServer: {
        contentBase: './dist',
        hot: true,
        stats: 'errors-only' // 开发环境
    },
    stats: 'errors-only' // 生产环境
};
```

### 构建异常和中断处理

### 多线程/多进程构建提升打包速度

thread-loader 和 happypack 对于小型项目来说打包速度几乎没有影响，甚至可能会增加开销，所以建议尽量在大项目中采用。

```js
// npm i thread-loader -D
module.exports = {
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                use: [
                    {
                        loader: 'thread-loader',
                        options: {
                            workers: 3
                        } // 必须在最前面
                    },
                    'babel-loader',
                    'eslint-loader'
                ]
            }
        ]
    }
};
```

### 多进程并行压缩代码提升打包速度

webpack 生产环境默认开启`terser-webpack-plugin`

### 分析 webpack 的构建体积

安装`npm i webpack-bundle-analyzer -D`

```js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
module.exports = {
    plugins: [new BundleAnalyzerPlugin()]
};
```

配置完成执行打包命令自动打开页面显示各文件的构建体积

## 如何优化 webpack 的构建速度

1. 使用高版本的 webpack 和 node.js
2. 多进程/多实例打包： happyPack（暂停维护）、thread-loader
3. 代码压缩:
   webpack-paralle-uglify-plugin
   uglifyjs-webpack-plugin 开启 parallel 参数 (不支持 ES6)
   terser-webpack-plugin（webpack 生产环境默认开启）
4. 图片压缩
   使用基于 Node 库的 imagemin (很多定制选项、可以处理多种图片格式)
   配置 image-webpack-loader
5. 缩小打包作用域:
   exclude/include (确定 loader 规则范围)
   resolve.modules 指明第三方模块的绝对路径 (减少不必要的查找)
   合理使用 alias
6. 提取公共资源
   使用 html-webpack-externals-plugin，将基础包通过 CDN 引入，不打入 bundle 中
   使用 SplitChunksPlugin 进行(公共脚本、基础包、页面公共文件)分离(Webpack4 内置) ，替代了 CommonsChunkPlugin 插件
   预编译资源模块
7. 预编译资源模块,基础包的分离
   使用 DllPlugin 进行分包，使用 DllReferencePlugin(索引链接) 对 manifest.json 引用，让一些基本不会改动的代码先打包成静态资源，避免反复编译浪费时间。
   HashedModuleIdsPlugin 可以解决模块数字 id 问题
8. 充分利用缓存提升二次构建速度
   babel-loader 开启缓存
   terser-webpack-plugin 开启缓存
   使用 hard-source-webpack-plugin（此方式是 webpack DllPlugin 配置的替代方案，webpack5 中会内置 hard-source-webpack-plugin）
9. 动态 Polyfill
   建议采用 polyfill-service 只给用户返回需要的 polyfill，社区维护。(部分国内奇葩浏览器 UA 可能无法识别，但可以降级返回所需全部 polyfill)
10. tree shaking 摇树优化
    摇树优化指代代码中没有用到的内容在生产环境自动删除
    webpack 默认支持，webpack 的 mode 参数可配置 tree shaking

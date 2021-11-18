// Generated using webpack-cli https://github.com/webpack/webpack-cli
const PackageJSON = require('../package.json');
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const FileManagerPlugin = require('filemanager-webpack-plugin');


const root = path.resolve(__dirname, '../')

const glob = require('glob');
const { exit } = require('process');

const isProduction = process.env.NODE_ENV == "production";
const centralPackage = `${PackageJSON.primo.institution}-${PackageJSON.primo.vidId}`

const stylesHandler = MiniCssExtractPlugin.loader;
const distDir = path.resolve(root, `dist`);

let files = glob.sync(`${path.resolve(root, `./resources/*`)}`);
files = files.map(f => f.match(/([^\/]*)\/*$/)[1]);
const viewdirs = files
    .map(f => f.match(/([^\/]*)\/*$/)[1])
    .filter(f => !["CENTRAL_PACKAGE", `${PackageJSON.primo.institution}-${PackageJSON.primo.vidId}`].includes(f));

var plugins = [];
var copy_plugin_patterns = [];
var entries = {};

/*
console.log ("-------------------->>>>>>>>>>")
console.log ( "VIEW: " + process.env.VIEW )
console.log ( "CENTRAL: " + process.env.CENTRAL)
console.log ( "ALL: " + process.env.ALL)
console.log ("-------------------->>>>>>>>>>")
*/
// console.log ( viewdirs );

const config = {
    mode: "development",
    devtool: 'source-map',
    entry: entries,
    output: {
        path: path.resolve(root, `${distDir}`),
        filename: 'js/custom.js',
        clean: false
    },
    plugins: [],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        "plugins": [
                            "import-directory",
                            "@babel/plugin-transform-runtime"
                        ],
                        "presets": [
                            [
                                "@babel/preset-env",
                                {
                                    "targets": "defaults"
                                }
                            ]
                        ]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, "css-loader"]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: "asset",
            },
            {
                test: /\.(html)$/i,
                loader: "html-loader",
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
};

configCentral = () => {
    // console.log("\nCENTRAL\n\n")
    copy_plugin_patterns = copy_plugin_patterns.concat([
        { from: path.resolve(root, `resources/${centralPackage}/html`), to: `${distDir}/${centralPackage}/html` },
        { from: path.resolve(root, `resources/${centralPackage}/img`), to: `${distDir}/${centralPackage}/img` }
    ]).flat()

    entries['central'] = { import: path.resolve(root, "./src/index.js"), filename: `${centralPackage}/js/custom.js` }

    plugins.push(new FileManagerPlugin({
        events: {
            onStart: {
                delete: [path.resolve(root, `./src/css`)],
                copy: [
                    { source: path.resolve(root, `resources/${centralPackage}/css`), destination: path.resolve(root, `./src/css`) }
                ],
            },
            onEnd: {
                delete: [path.resolve(root, `./src/css`), path.resolve(root, `./src/index.css`)]
            }
        }
    }))

}

configiew = () => {
    console.log("\View: "+ process.env.VIEW +"\n\n")
    var viewdir = process.env.VIEW.replace(":", "-");
    if (!viewdirs.includes(viewdir)) {
        console.log(`\nView directory ./resources/${viewdir} does not exists\nUse One of these option:\n`)
        views = viewdirs.map( (v) => v.replace("-", ":") );
        console.log(views)
        exit()
    }

    const ViewConfigJSON = require(path.resolve(root, `resources/${viewdir}/config.json`));

    copy_plugin_patterns = copy_plugin_patterns.concat([
        { from: path.resolve(root, `resources/${viewdir}/html`), to: `${distDir}/${viewdir}/html` },
        { from: path.resolve(root, `resources/${viewdir}/img`), to: `${distDir}/${viewdir}/img` },
    ]).flat()

    /* TODO : check if view uses CENTRAL PACKAGE and rebuild CENTRAL PACKAGE is necessary */
    entries[process.env.VIEW] = { import: path.resolve(root, `./resources/${viewdir}/js/custom.js`), filename: `${viewdir}/js/custom.js` }
    
}

configAll = () => {
    config.output.clean = true;
    configCentral();
    viewdirs.forEach( viewdir => { 
        process.env.VIEW = viewdir.replace("-", ":");
        configiew();
    })
}

module.exports = () => {

    if (isProduction) {
        config.mode = "production";
    }

    if ( process.env.ALL !== "undefined"  ) {
        console.log ("Process All")
        // console.log ( process.env.ALL  )
        configAll()
    }else{
        if (process.env.CENTRAL !== "undefined"  ) {
            console.log ("Process Central")
            // console.log ( process.env.CENTRAL  )
            configCentral()
        }
        if ( process.env.VIEW !== "undefined" ) {
            console.log ("Process View")
            // console.log ( process.env.VIEW  )
            configiew()
        }
    }

/*
    console.log(entries)
    console.log(plugins)
    console.log(copy_plugin_patterns)
*/

    plugins.push(new CopyPlugin({ patterns: copy_plugin_patterns }))
    plugins.push(new MiniCssExtractPlugin({
        filename: ({ chunk }) => `${chunk.filenameTemplate.replace("js/", "css/").replace(/.js$/, "1")}.css`,
    }))

    config.entry = entries;
    config.plugins = plugins

    return config;
};




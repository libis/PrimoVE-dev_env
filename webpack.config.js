// Generated using webpack-cli https://github.com/webpack/webpack-cli
const PackageJSON = require('./package.json');
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const FileManagerPlugin = require('filemanager-webpack-plugin');
const glob = require('glob');

const isProduction = process.env.NODE_ENV == "production";

const centralPackage = `${PackageJSON.primo.institution}-${PackageJSON.primo.vidId}`

const stylesHandler = MiniCssExtractPlugin.loader;
const distDir = path.resolve(__dirname, `dist/${centralPackage}`);

console.log ("------ centralPackage ----------"  )
console.log (centralPackage  )
console.log ("--------------------------------"  )

let files = glob.sync(`${ path.resolve(__dirname, `./resources/*`) }`);
files = files.map ( f => f.match(/([^\/]*)\/*$/)[1] );
const views = files
    .map( f => f.match(/([^\/]*)\/*$/)[1] )
    .filter( f => !["CENTRAL_PACKAGE","32KUL_LIBIS_NETWORK-CENTRAL_PACKAGE"].includes(f) );
   
console.log ( views );
/*
const views = [
    "32KUL_KHK-TMOREK",
    "32KUL_KUL-KULeuven",
    "32KUL_KUL-Lirias",
    "32KUL_VLP-VLP",
]
*/

var central_entry = { 'central': { import:  "./src/index.js", filename: 'js/custom.js' }  }

var entries =  views.reduce( (map, view) => {
    map[view] = { import: `./resources/${view}/js/custom.js`, filename: `../${view}/js/custom.js` } ;
    return map;
 }, central_entry );

var copy_plugin_central_patterns = [
    { from: `resources/${centralPackage}/html`, to: `${distDir}/html` },
    { from: `resources/${centralPackage}/img`, to: `${distDir}/img` }
]

const copy_plugin_patterns = copy_plugin_central_patterns.concat( 
    views.map( view => [
        { from: `resources/${view}/html`, to: `${distDir}/../${view}/html` },
        { from: `resources/${view}/img`, to: `${distDir}/../${view}/img` } 
    ]).flat()
);

const config = {
    devtool: 'source-map',
    entry: entries,
    /* 
    {
        central: { import:  "./src/index.js", filename: 'js/custom.js' },
        kuleuven: { import: `./resources/32KUL_KUL-KULeuven/js/custom.js`, filename: `../32KUL_KUL-KULeuven/js/custom.js` }
    },
    */
    output: {
        path: path.resolve(__dirname, `${distDir}`),
        filename: 'js/custom.js',
        clean: true
    },
    plugins: [
        new CopyPlugin({
            patterns: copy_plugin_patterns
            /*
            [
                { from: "resources/32KUL_LIBIS_NETWORK-CENTRAL_PACKAGE/html", to: `${distDir}/html` },
                { from: "resources/32KUL_LIBIS_NETWORK-CENTRAL_PACKAGE/img", to: `${distDir}/img` },
                { from: `resources/${PackageJSON.primo.institution}-${PackageJSON.primo.vidId}/html`, to: `${distDir}/html` },
                { from: `resources/${PackageJSON.primo.institution}-${PackageJSON.primo.vidId}/img`, to: `${distDir}/img` },
            ]
            */
        }),
        new MiniCssExtractPlugin({
            filename: ({chunk}) => `${chunk.filenameTemplate.replace("js/", "css/").replace(/.js$/, "")}.css`,
        }),
        new FileManagerPlugin({
            events: {
                onStart: {
                    delete: [path.resolve(__dirname, `./src/css`)],
                    copy: [
                        { source: `resources/${centralPackage}/css`, destination: path.resolve(__dirname, `./src/css`) }
                        /*,
                        { source:  `resources/${PackageJSON.primo.institution}-${PackageJSON.primo.vidId}/css/index.css`, destination: path.resolve(__dirname, `./src/index.css`) },
                        { source:  `resources/${PackageJSON.primo.institution}-${PackageJSON.primo.vidId}/css/*.css`, destination: path.resolve(__dirname, `./src/css/`) },
                        */
                      ],
                },
                onEnd: {
                    delete: [path.resolve(__dirname, `./src/css`), path.resolve(__dirname, `./src/index.css`)]
                }
            }
        })

        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
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

module.exports = (env) => {
    
    if (isProduction) {
        config.mode = "production";
    } else {
        config.mode = "development";
    }
    
    return config;
};


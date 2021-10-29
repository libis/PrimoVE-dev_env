const PackageJSON = require('../package.json');
const path = require("path");
const root = path.resolve(__dirname, '../')

const glob = require('glob');
const { exit } = require('process');
const { exec } = require('child_process');

const centralPackage = `${PackageJSON.primo.institution}-${PackageJSON.primo.vidId}`

// const centralPackage = `${PackageJSON.primo.institution}-${PackageJSON.primo.vidId}`

let files = glob.sync(`${path.resolve(root, `./resources/*`)}`);
files = files.map(f => f.match(/([^\/]*)\/*$/)[1]);
const viewdirs = files
    .map(f => f.match(/([^\/]*)\/*$/)[1])
    .filter(f => !["CENTRAL_PACKAGE", `${centralPackage}`].includes(f));

var argv = require('minimist')(process.argv.slice(2));

if (
    Object.keys(argv).includes('view') ||
    Object.keys(argv).includes('central') ||
    Object.keys(argv).includes('all')
) {

    process.env.VIEW = argv.view;
    process.env.CENTRAL = argv.central;
    process.env.ALL = argv.all;

    yarn = `yarn run rebuild`
    if (Object.keys(argv).includes('mode') && argv.mode == "development") {
        yarn = `yarn run rebuild --mode=development`
    }

    console.log ( "==> env is set" )
    console.log ( "==> "+ yarn )
    exec(yarn, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
} else {
    // console.log(`Usage: primoServe --port=8003 --vid=NUI --proxy=https://your.primo.url --dir=/directory/to/vids --ve`);
    console.log(`Usage:  yarn build [--view 32KUL_...:....] [--central] [--all] `);
}


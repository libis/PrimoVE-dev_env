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

if ( Object.keys(argv).includes('view') ) {
    argv.viewdir = argv.view.replace(":", "-");
    if (!viewdirs.includes(argv.viewdir)) {
        console.log(`\nView directory ./resources/${argv.viewdir} does not exists\nUse One of these option:\n`)
        console.log(viewdirs)
        exit()
    }
    const ViewConfigJSON = require(path.resolve(root, `resources/${argv.viewdir}/config.json`));
    let primoVE = Object.keys(argv).includes('ve') ? true : false;
    if (/:/.test(argv.view)) {
      primoVE = true;
    }
    console.log(`yarn run serve --vid ${argv.view} --proxy ${ ViewConfigJSON.primo.url } --ve`)
    exec(`yarn run serve --vid ${argv.view} --proxy ${ ViewConfigJSON.primo.url } --ve`)
} else {
  // console.log(`Usage: primoServe --port=8003 --vid=NUI --proxy=https://your.primo.url --dir=/directory/to/vids --ve`);
  console.log("specify the view that must be started");
  console.log("Usage:  yarn start --view 32KUL_...:....");
}
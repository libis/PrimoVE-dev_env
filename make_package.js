const AdmZip = require('adm-zip');
const FS = require('fs-extra');
const glob = require('glob');

const Package = require('./package.json');

function removePackage(resource) {
    let packageDir = Package.primo.build.package;
    let packagePath = `${packageDir}/${resource}.zip`;

    try {
        FS.removeSync(packagePath);
        console.log(`\tPreviously created package removed. (${packagePath})`);
    } catch (error) {
        console.log(error);
        console.log("\tPreviously created package not found.");
    }
}

function createTmpDir(resource) {
    let tmp = Package.primo.build.tmp;
    let tmpPackageDir = `./${tmp}/${resource}`;
    try {
        FS.removeSync(tmpPackageDir);
        console.log("\tPrevious Tmp package dir removed");
    } catch (err) {
        console.log("\tPrevious Tmp package not found");
    }

    try {
        FS.ensureDirSync(`${tmpPackageDir}`);
        console.log("\tTmp package dir created");
    } catch (err) {
        console.log("\tUnable to create Tmp package dir ");
    }
}

function copyResources(resource) {
    let resourceDir = Package.primo.build.resources;
    let distDir = Package.primo.build.dist;
    try {
        console.log("\tCopying resources html");
        ['general', resource].forEach(dir => {

            let files = glob.sync(`${resourceDir}/${dir}/html`);
                files.forEach(file => {                    
                    FS.copySync(file, `tmpPackage/${resource}/html`, { overwrite: true })
                })            
        });
        console.log("\tCopying resources img");
        ['general', resource].forEach(dir => {

            let files = glob.sync(`${resourceDir}/${dir}/img`);
                files.forEach(file => {                    
                    FS.copySync(file, `tmpPackage/${resource}/img`, { overwrite: true })
                })            
        });

        console.log("\tCopying "+distDir+" html");
        var files = glob.sync(`${distDir}/${resource}/html`);
            files.forEach(file => {                    
                FS.copySync(file, `tmpPackage/${resource}/html/`, { overwrite: true })
            });                
        console.log("\tCopying "+distDir+" img");
        var files = glob.sync(`${distDir}/${resource}/img`);
            files.forEach(file => {                    
                FS.copySync(file, `tmpPackage/${resource}/img/`, { overwrite: true })
            });   
        console.log("\tCopying "+distDir+"/css/custom1.css");
        var files = glob.sync(`${distDir}/${resource}/css/custom1.css`);
            files.forEach(file => {                    
                FS.copySync(file, `tmpPackage/${resource}/css/custom1.css`, { overwrite: true })
            });   
        console.log("\tCopying "+distDir+"/js/custom.js");
        var files = glob.sync(`${distDir}/${resource}/js/custom.js`);
            files.forEach(file => {                    
                FS.copySync(file, `tmpPackage/${resource}/js/custom.js`, { overwrite: true })
            });   

    } catch (err) {
        console.error(err);
    }
}

function createArchive(resource) {
    let zip = new AdmZip();
    let tmp = Package.primo.build.tmp;
    console.log("\tCreating archive");
    zip.addLocalFolder(`${tmp}/${resource}`, resource); 
       
    zip.writeZip(`package/${resource}.zip`);
}

function removeTmpDir(resource) {
    let tmp = Package.primo.build.tmp;
    FS.removeSync(tmp);    
}

function setup(resource) {
    console.log(`Packaging ${resource}`)
    removePackage(resource);
    createTmpDir(resource);
    copyResources(resource);  
    createArchive(resource);  
    removeTmpDir(resource);
}

const institution = Package.primo.institution;
for (const view of Package.primo.build.views) {
    let resource = `${institution}-${view}`;
    setup(resource);
}
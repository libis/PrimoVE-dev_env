# Primo VE Development environment
This is a development environment for Primo VE packages in a ALMA network

## Getting started:
### Dependencies
node version ">= 14.13.1" !  
npm install -g yarn
### Setting up the environment
- Clone the repository
- Install dependencies
```
yarn install
```
- Check if ```primoServe``` was installed if not install it manually
```
yarn add primo-server --dev
```
### start, build, watch, package
- Start up a proxy for testing. Copy the URL into a private or incognito window to break the browser cache.
```
yarn start --view <view>
```
- Build the source. 
```
yarn build [--central][--view <view> ][--all]
yarn watch
```
- Create a package that you can upload to the back office 
```
yarn package (the folder 'package' must exist)
```
OR
```
make_package.sh
```
## Directory structure
```
dist                           Directory with compiled sources  
package                        Directory with the packaged compiled sources  
resources                      Directory for each view adn the central-package
├── <central view>      
│   ├── css                    css-chunks / enabled chunkes are listed in index.css with @import "./<...>.css"
│   ├── html              
│   │   ├── homepage           email-templates and home_en_US, hmome_nl_BE, ...
│   │   └── templates          view specific templates if not included in the js-component.
│   ├── img                    favicon.ico, library-logo.png, icon_<...>.png, ...
│   └── js                     
├── <view>                      
│   ├── css                    css-chunks / enabled chunkes are listed in index.css with @import "./<...>.css"
│   ├── html             
│   │   ├── homepage           email-templates and home_en_US, hmome_nl_BE, ...
│   │   └── templates          view specific templates if not included in the js-component.
│   ├── img                    favicon.ico, library-logo.png, icon_<...>.png, ...
│   └── js                     custom.js with import "../css/index.css";
├── <view>                     
│    ....
src                            Source code  
├── components                 Directory with all the components  
│   └── libInfo                Component  
│       ├── index.js           Business logic of component (with import off index.css central-package) 
│       ├── libInfo.html       Visuals of component  
│       └── libInfo.json       Extra data  
├── modules                    Angular modules
│   └── pubSubInterceptor.js  
├── index.js                   ViewCustom/CentralCustom definition  
├── loader.js                  Component loader  
├── primo                      Bridge into Primo services like user, records, facets ...  
└── templates                  Template files used to overwrite existing primo templates  
```
## CENTRAL PACKAGE
The javascript of ./scr will be placed in the central package 
The name of the central package is configured in package.json => ${PackageJSON.primo.institution}-${PackageJSON.primo.vidId}  


## VIEW PACKAGE
In ```resources/${view}/config.json``` you can find the proxy parameters. 
```json
  "primo": {
    "url": "https://<primo-inst>.primo.exlibrisgroup.com",
    "institution": "<primo-inst>",
    "vidId": "<vid>"
  },
```
If you update them then next time you run ```yarn start --view <view>``` it will point to a new configured Primo. 

## (de)Activating components
The /index.js in the ./src/componets direcory always contains  
```
export let <name> Component = {
  name: 'custom-<name>',  
  enabled: false,
  appendTo: '<after-component>',
  enableInView: '.*',
  config: {  
    bindings: {
      parentCtrl: '<'
    },
    controller: <name>Controller,
    template: <name>HTML
  }
}
```
## Institutional or View specific variables are defined with ui.customization in Alma
=> Alma => Discovery => Display Configuration => Labels => View Labels
example (browzine)

## yarn scripts
### yarn build --central
===> webpack --config ./scripts/webpack.config.js

Central Package ID is configured in ./package.json  
${PackageJSON.primo.institution}-${PackageJSON.primo.vidId}   

#### creates dist/${centralPackage}
- dist/${centralPackage}/css  => created based on ${centralPackage}/css through import index.css in .src/index.js  
- dist/${centralPackage}/html => copy of resources/${centralPackage}/html  
- dist/${centralPackage}/img  => copy of resources/${centralPackage}/img  
- dist/${centralPackage}/js   => created based on ./src/index.js  

### yarn build --view ${view}
===> webpack --config ./scripts/webpack.config.js --env view=32KUL_KUL:KULeuven  
   scripts/webpack.config.js wordt gebruikt

#### creates dist/${view}
- dist/${view}/css  => created based on resources/${view}/css through import is index.css in ${view}/js/custom.js  
- dist/${view}/html => copy of resources/${view}/html  
- dist/${view}/img  => copy of resources/${view}/img  
- dist/${view}/js   => created based on ./resources/${view}/js/custom.js  

### yarn build --all
===> webpack --config ./scripts/webpack.config.js 

#### creates dist/${centralPackage} 
- dist/${centralPackage}/css  => created based on ${centralPackage}/css through import index.css in .src/index.js  
- dist/${centralPackage}/html => copy of resources/${centralPackage}/html  
- dist/${centralPackage}/img  => copy of resources/${centralPackage}/img  
- dist/${centralPackage}/js   => created based on ./src/index.js  

#### creates all dist/view-folders based on the tree-structure in ./resources
- dist/${view}/css  => created based on resources/${view}/css through import is index.css in ${view}/js/custom.js  
- dist/${view}/html => copy of resources/${view}/html  
- dist/${view}/img  => copy of resources/${view}/img  
- dist/${view}/js   => created based on ./resources/${view}/js/custom.js  
  ### yarn start --view ${view}
===> primoServe --vid ${view} --proxy ${view_proxy} --dir ./dist   

#### resources/${view}/config.json
parameters to start PrimoServe are configured in  resources/${view}/config.json  

**example**
```
{
  "name": "32KUL_KHK",
  "version": "1.0.0",
  "author": "",
  "license": "MIT",
  "primo": {
    "url": "https://libis-khk.primo.exlibrisgroup.com/",
    "institution": "32KUL_KHK",
    "vidId": "TMOREK",
    "views": [
      "TMOREK"
    ]
  }
}
```
### yarn package
Creates a package per folder in ./dist

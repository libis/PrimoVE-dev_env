# The Primo New UI Customization Workflow Development Environment


## html
The html-folder will be copied to dist/<INST-vidId>/html

## img
The img-folder will be copied to dist/<INST-vidId>/img

## css
The css-folder must contain a index.css 
Diring the build process 
- index.css will be copied to src/css
- all css-files from css-folder will be copied to src/css
- a custom1.css file is created in dist/css based on the imported css-files in index.css

./scr/index.js contains a reference to ./src/css/index.css
All css-files that are referenced in the index.css will be included in custom1.js

Example of index.css 
@import "./db-item-detail.css";
@import "./app-colors.css";

const fs = require('fs');
const path = require('path');
const svgDir = path.resolve(__dirname, '../src/assets/svgs');
const iconsFile = path.resolve(__dirname, '../src/icons.ts');
const fileLength = fs.readdirSync(svgDir).length;
const iconsFileContent = (() => {
    if (!fileLength) {
        return '';
    }
    const head = 'import {Plugin} from \'vue\';\n\n';
    const importList = [];
    const componentList = [];
    fs.readdirSync(svgDir).forEach(function (file, index) {
        if (/\.svg$/.test(file)) {
            const moduleName = 'Icon' + file.replace(/(\.\/|\.svg)/g, '').split('_')
                .map(item => item.charAt(0).toUpperCase() + item.slice(1)).join('');
            importList.push(`import ${moduleName} from 'assets/svgs/${file}';\n`);
            componentList.push(`    app.component('${moduleName}', ${moduleName});\n`);
        }
    });
    const installFun = `const iconsInstall: Plugin = (app) => {\n${componentList.join('')}};\nexport default iconsInstall;\n`;
    return `${head}${importList.join('')}${installFun}`;
})();

fs.writeFileSync(iconsFile, iconsFileContent);
console.log(fileLength + 'icon modules generated.');

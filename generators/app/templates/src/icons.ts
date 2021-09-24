import {Plugin} from 'vue';

import IconDelete from 'assets/svgs/delete.svg';
const iconsInstall: Plugin = (app) => {
    app.component('IconDelete', IconDelete);
};
export default iconsInstall;

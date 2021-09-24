/**
 * @file 数据请求api统一入口文件
 * @author BIFE
 */

import axios from 'axios';
import type {CancelTokenStatic} from 'axios';
import apiList from './url';
import apiFactory from './factory';

type ApiList = typeof apiList;
type ApiFunList = {
    [key in keyof ApiList]: Record<keyof ApiList[key], ReturnType<typeof apiFactory>>;
}

const Api: ApiFunList = {};
for (const module in apiList) {
    Api[module] = {};
    for (const key in apiList[module]) {
        Api[module][key] = apiFactory(apiList[module][key]);
    }
}

(Api as ApiFunList&{CancelToken: CancelTokenStatic}).CancelToken = axios.CancelToken;
export * from './constant';
export default Api;

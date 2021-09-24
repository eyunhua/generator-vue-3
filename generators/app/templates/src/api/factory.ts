/**
 * @file global api urls
 */
import http, {AxiosRequestConfig} from 'axios';

const config = {
    domain: '',
    withCredentials: false,
    timeout: 15 * 1000
};

export default (api: NetTypes.Api) => {
    const method = api.method === 'post' ? 'post' : 'get';
    const pathExp = /(?:\$\{)([a-zA-Z0-9]+)(?:\})/gi;
    const matches = api.url.match(pathExp);
    api.variables = matches ? matches.map(item => item.substring(2, item.length - 1)) : [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <T = unknown, Y extends Record<string, any>|undefined = undefined>(
        params?: Y,
        options: {
            path?: string;
            payload?: AxiosRequestConfig;
        } = {}
    ) => {
        if (api.url.indexOf('${') > -1) {
            // 对${xxx}的替换
            // eslint-disable-next-line
            let fn = new Function('params', 'with(params) {return `' + api.url + '`}');
            api.reUrl = fn(params);
        }

        // 删除params中被${xxx}替换掉的变量
        if (api.variables && params) {
            api.variables.forEach(item => {
                if (params) {
                    delete params[item];
                }
            });
        }

        const {path, payload} = options;
        const localUrl = api.reUrl || api.url;
        let url = path ? localUrl + path : localUrl;
        url = config.domain + url;
        return http.request<NetTypes.Res<T>>({
            withCredentials: config.withCredentials,
            timeout: config.timeout,
            url,
            method,
            ...payload,
            [method === 'get' ? 'params' : 'data']: params,
            headers: {
                'originalUrl': window.location.href
            }
        }).then(({data}) => {
            // 0 是 OK
            // 1 是 用户错误
            // -1 是服务端错误
            if (data.errNo === 0) {
                return data;
            } else if (data.errNo === 40001 && data.redirectUrl) {
                window.location.href = data.redirectUrl;
            } else {
                return Promise.reject(data);
            }
        }).catch(res => {
            if (http.isCancel(res)) {
                // eslint-disable-next-line no-console
                console.log('Request canceled', res.message);
            } else {
                if (res && res.errNo !== 0) {
                    // eslint-disable-next-line no-console
                    console.error(`errNo:${res.errNo}, message:${res.message}`);
                }
                return Promise.reject(res);
            }
        });
    };
};

/**
 * @file 请求基础类型
 */
namespace NetTypes {
    export interface Api {
        url: string;
        reUrl?: string;
        method?: 'post'|'get';
        variables?: string[];
    }
    export interface Res<T=unknown> {
        errNo: number;
        message: string;
        data: T;
        redirectUrl?: string;
    }
}

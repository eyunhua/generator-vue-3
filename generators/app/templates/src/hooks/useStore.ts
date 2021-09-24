/**
 * @file 解构 Store 的 hook
 * @author BIFE
 */

import {Store, CommitOptions, DispatchOptions, useStore} from 'vuex';
import {computed} from 'vue';
import {camelCase, get, replace} from 'lodash';
import {State, key} from 'store';

interface ReturnFun<T> {
    (namespace: string, list: string[]): Record<string, T>;
    (list: string[]): Record<string, T>;
}
const useFun = <T>(transform: (key: string, store: Store<State>) => T): ReturnFun<T> => {
    return (namespace: string | string[], list?: string[]) => {
        if (!list) {
            list = namespace as string[];
            namespace = '';
        }
        
        const store = useStore(key);
        if (!store) {
            return {};
        }
        return list.reduce((res: Record<string, T>, key) => {
            res[camelCase(key)] = transform(namespace ? namespace + '/' + key : key, store);
            return res;
        }, {});
    };
};


/**
 * 用于在 setup hook 中解构 Stor e的 state
 * @param {string} namespace list 中元素的统一前缀 （可选）
 * @param {string[]} list ['module1/name1']
 * @return {{[key: camelCase]: ComputedRef<unknown>}} 组成 list 的字符串的 camelCase 作为 key ，计算属性作为 value
 */
export const useState = useFun((key, store) => computed(() => get(store.state, replace(key, '/', '.'))));

/**
 * 用于在 setup hook中解构 Store 的 getter
 * @param {string} namespace list 中元素的统一前缀 （可选）
 * @param {string[]} list ['module1/name1']
 * @return {{[key: camelCase]: ComputedRef<unknown>}} 组成 list 的字符串的 camelCase 作为 key，计算属性作为 value
 */
export const useGetters = useFun((key, store) => computed(() => store.getters[key]));

/**
 * 用于在 setup hook中解构 Store 的 mutation
 * @param {string} namespace list 中元素的统一前缀 （可选）
 * @param {string[]} list ['module1/name1']
 * @return {{[key: camelCase]: (payLoad?: unknown, options?: DispatchOptions) => unknown}}
 * 组成 list 的字符串的 camelCase 作为 key ，函数作为 value
 */
export const useMutations = useFun((key, store) =>
    (payLoad?: unknown, options?: CommitOptions) =>
        store.commit(key, payLoad, options));

/**
 * 用于在 setup hook 中解构 Store  的 action
 * @param {string} namespace list 中元素的统一前缀 （可选）
 * @param {string[]} list ['module1/name1']
 * @return {{[key: camelCase]: (payLoad?: unknown, options?: DispatchOptions) => Promise<unknown>}}
 * 组成 list 的字符串的 camelCase 作为 key ，Promise 函数作为 value
 */
export const useActions = useFun((key, store) =>
    (payLoad?: unknown, options?: DispatchOptions) =>
        store.dispatch(key, payLoad, options));

/**
 * @file 获取全局属性的 hook
 * @author BIFE
 */
import {getCurrentInstance, AppConfig} from 'vue';
/**
 * useGlobalProperties
 *
 * @param {string[]} list ['$message'] 目标属性名
 * @return {{Record<string, unknown>} 包含目标k全局属性的对象
 */
export const useGlobalProperties = (list: string[]): AppConfig['globalProperties'] => {
    const res: AppConfig['globalProperties'][string] = {};
    const instance = getCurrentInstance();
    if (!instance) {
        return res;
    }
    const {globalProperties} = instance.appContext.config;
    for (const key of list) {
        res[key] = globalProperties[key];
    }
    return res;
};

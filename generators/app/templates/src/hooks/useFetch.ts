/**
 * @file 经过异常处理并暴露 loading 状态的 hook
 * @author BIFE
 */
import {computed, ref} from 'vue';
import factory from 'api/factory';

/**
 * useFetch
 *
 * @param {Promise<Res<unknown>>} fetch 经factory包装的ajax请求
 * @param {boolean} errorToast 是否开启报错的toast
 * @return {{
 *     loading: ComputedRef<boolean>;
 *     run: (params: unknown) => Promise<{err, data}>;
 *   }}
 */

export const useFetch = <T = unknown, Y = unknown>(
    fetch: ReturnType<typeof factory>,
    errorToast = true
) => {
    const loading = ref(false);
    const getLoading = computed(() => loading.value);
    const run = async (params?: Y) => {
        let data: T|null = null;
        let err: Error|null = null;
        loading.value = true;
        let res: NetTypes.Res<T>|null = null;
        try {
            res = await fetch<T, Y>(params) || null;
        }
        catch (e) {
            err = e;
        }
        if (res && res.errNo === 0) {
            data = res.data;
        }
        else if (res) {
            err = new Error(res.message);
        }
        loading.value = false;
        if (err && errorToast) {
            // 调用UI库全局消息
        //    message.error(err.message, 1);
        }
        return {data, err};
    };
    return {loading: getLoading, run};
};

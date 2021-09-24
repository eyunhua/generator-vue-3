<template>
    <div class="home">
        <p>
            <span>svg图标：</span>
            <icon-delete
                width="20"
                height="20"/>
            <router-view/>
        </p>
        <p>
            <span>vuex user/age: </span>
            {{age1}}
            <button @click="addAge1">age++</button>
        </p>
        <p>
            <span>hook useStore user/age: </span>
            {{age2}}
            <!-- antd组件 -->
            <a-button
                type="primary"
                @click="addAge2">age++</a-button>
        </p>
        <p>{{$t('message.hello')}}</p>
        <p>{{t('message.hello')}}</p>
    </div>
</template>

<script lang="ts">
import {defineComponent, computed} from 'vue';
import {useStore} from 'vuex';
import {useI18n} from 'vue-i18n';
import Api from 'api';
import {
    useFetch,
    useGetters,
    useActions
} from 'hooks';
import {key} from 'store';
import {getUser} from 'types/api';

export default defineComponent({
    name: 'Home',
    setup() {
        // 直接调用 api 函数
        // api 函数的两个类型参数分别用于断言响应、约束请求
        Api.user.getUser<getUser.Res, getUser.Req>({name: 'xxx'}).then(data => {
            // eslint-disable-next-line no-console
            console.log(data && data.data.isDisguise);
        }).catch(err => {
            // eslint-disable-next-line no-console
            console.log(err);
        });
        // 调用经过异常处理的 hook
        const {run} = useFetch<getUser.Res, getUser.Req>(Api.user.getUser, false);
        (
            async () => {
                const {data, err} = await run({name: 'xxx'});
                if (data) {
                // eslint-disable-next-line no-console
                    console.log(data);
                }
                else {
                // eslint-disable-next-line no-console
                    console.log(err);
                }
            }
        )();

        const store = useStore(key);
        // 直接使用 vuex 的 useStore
        const age1 = computed(() => store.getters['user/age']);
        const addAge1 = () => store.dispatch('user/addAge', 1);
        // 使用解构 useStore 的 hook
        const {age: age2} = useGetters('user', ['age']);
        const {userAddAge} = useActions(['user/addAge']);
        return {
            age1,
            age2,
            addAge1,
            addAge2: userAddAge.bind(null, 1),
            addAge: () => store.dispatch('user/addAge', 1),
            t: useI18n().t
        };
    }
});
</script>

import {Mutation} from 'vuex';
import * as types from '../mutation-types';
import {State} from './state';

export default {
    [types.SET_USER_AGE](state, age: State['age']) {
        state.age = age;
    }
} as Record<string, Mutation<State>>;
// 按Mutation定义传入State

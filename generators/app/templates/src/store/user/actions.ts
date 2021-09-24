import {Action} from 'vuex';
import * as types from '../mutation-types';
import {State} from './state';
import {State as RootState} from '../index';

export default {
    addAge({commit, state}, value: number) {
        commit(types.SET_USER_AGE, state.age + value);
    }
} as Record<string, Action<State, RootState>>;
// 按Action定义传入State, RootState

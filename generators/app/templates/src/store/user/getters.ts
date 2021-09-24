import {Getter} from 'vuex';
import {State} from './state';
import {State as RootState} from '../index';

export default {
    age: state => state.age
} as Record<string, Getter<State, RootState>>;
// 按Getter定义传入State, RootState

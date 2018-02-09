import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const state = {
    menuName : '首页'
};

const mutations = {
    replace(state,name){
        state.menuName = name;
    }
};

export default new Vuex.Store({
    state,
    mutations
});
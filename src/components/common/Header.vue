<template>
  <div class="header">
      <p class="title">{{this.$store.state.menuName}}</p>
  </div>
</template>

<script>
import store from '@/vuex/store';
export default {
    store
};
</script>

<style scoped>
    .header{
        float:left;
        width:85%;
        height:50px;
        position:relative;
        background-color: #545C64;
    }
    .title{
        position: absolute;
        top: 50%;
        font-size: 14px;
        margin-left:20px;
        color:#fff;
        transform: translate(-50%,0);
        -webkit-transform: translateY(-50%);
    }
</style>
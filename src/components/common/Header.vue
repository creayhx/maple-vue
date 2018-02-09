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
        height:10%;
        position:relative;
        background-color: #F5F5F5;
        border-bottom: 1px solid #EEEEEE;
    }
    .title{
        position: absolute;
        top: 50%;
        font-size: 14px;
        margin-left:40px;
        color:#666;
        transform: translate(-50%,0);
        -webkit-transform: translate(-50%,0);
    }
</style>
<template>
  <div id="app">
    <leftNav></leftNav>
    <headers></headers>
    <div class="main">
        <router-view></router-view>
    </div>
  </div>
</template>

<script>
import headers from '@/components/common/Header';
import leftNav from '@/components/common/LeftNav';
export default {
  name: 'App',
  components:{
    headers,
    leftNav
  }
}
</script>

<style>
  @import "./assets/static/css/main.css";
  @import "./assets/static/css/font-awesome.min.css";
  #app{
      width:100%;
      height:100%;
  }
  .main{
    float:left;
    width:85%;
    height:90%;
    overflow:scroll;
  }
</style>

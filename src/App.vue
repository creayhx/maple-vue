<template>
  <div id="app">
    <leftNav></leftNav>
    <main>
      
    </main>
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
  @import "./components/static/css/main.css";
  @import "./components/static/css/font-awesome.min.css";
  #app{
      width:100%;
      height:100%;
  }
</style>

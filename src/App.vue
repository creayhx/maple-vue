<template>
  <div id="app">
    <headers></headers>
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
</style>

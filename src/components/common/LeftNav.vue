<template>
  <div class="nav">
      <el-menu :default-active="$route.path" class="left-nav"  background-color="#434A50" text-color="#fff" active-text-color="#ffd04b" route>
        <el-menu-item index="/">
          <i class="el-icon-location"></i>
          <span slot="title" @click="show($route)">首页</span>
        </el-menu-item>
      </el-menu>
  </div>
</template>

<script>
  export default {
    methods:{
      show(route){
        console.log(route);
      }
    }
  };
</script>

<style scoped>
    .nav{
      width:15%;
      height:100%;
      float:left;
    }
    .left-nav{
        width:100%;
        height:100%;
    }
    .el-menu-item.is-active{
      background-color: #434A50;
    }
</style>
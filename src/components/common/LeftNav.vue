<template>
  <div class="nav">
    <div class="user">
        <img src="">
    </div>
     <ul>
       <li class="title" v-for="(n,i) in menuList" :style="{backgroundColor:n.bgc}" @click="toggleMenu(n,$event)">
          <template v-if="(n.children && n.children.length)">
              <i v-if="n.icon" :class="n.icon"></i> {{n.name}}
              <div class="child" v-if="n.children && n.children.length" :style="{height : n.height}">
                  <ol>
                    <li v-for="(val,key) in n.children" >
                      <router-link :to="val.path">{{val.name}}</router-link>
                    </li>
                  </ol>
              </div>
          </template>
          <template v-else>
            <router-link :to="n.path">
              <i v-if="n.icon" :class="n.icon"></i>
              {{n.name}}
            </router-link>
          </template>
       </li>
     </ul>
  </div>
</template>

<script>
  export default {
    data(){
      return{
          menuList : [
            {
              id : 1,
              name : '首页',
              path : '/',
              icon : 'fa fa-home',
              active : 'active'
            },
            {
              id : 2,
              name : '管理',
              icon : 'fa fa-user-o',
              children : [
                {
                  id : 1,
                  name : '账号管理',
                  path : '/accounts'
                }
              ],
              open:false,
              height:0,
              bgc:''
            }
          ]
      }
    },
    methods:{
      toggleMenu(n,e){
        if(e.target.className.indexOf('title') > -1 && n.children){
          let index = 0;
          let status = false;
          for(let i = 0; i < this.menuList.length; i++ ){
            if(n.id == this.menuList[i].id){
              index = i;
              status = this.menuList[i].open;
              break;
            };
          };
          this.$set(this.menuList[index],'height', status ? 0 :  n.children.length * 40 + 'px');
          this.$set(this.menuList[index],'bgc', status ? 'none' : '#434A50');
          this.$set(this.menuList[index],'open', !this.menuList[index].open);
        };
      }
    }
  };
</script>

<style scoped>
.nav .user {
  width: 50px;
  height: 50px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}
.nav .user img {
  width: 100%;
  height: 100%;
}
.nav {
  width: 15%;
  height: 100%;
  background-color: #545c64;
}
.nav ul li {
  line-height: 40px;
  color: #ccc;
  cursor: pointer;
  padding-left: 20px;
  overflow: hidden;
  
}
.nav ul li:hover {
  background-color: #434a50;
}
.nav .title {
  font-size: 14px;
}
.nav .title i {
  display: inline-block;
  margin-right: 5px;
}
.nav ul li a {
  display: inline-block;
  width: 100%;
  height: 100%;
  color: #ccc;
}
.nav .child {
  -webkit-transition: height 0.3s linear;
  transition: height 0.3s ;
}
</style>
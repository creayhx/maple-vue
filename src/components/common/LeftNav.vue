<template>
  <div class="nav">
    <div class="user">
        <img src="">
    </div>
     <ul>
       <li class="title" v-for="(n,i) in menuList" :class="n.active && 'active'" @click="toggleMenu(n,i)">
          <template v-if="(n.children && n.children.length)">
              <i v-if="n.icon" :class="n.icon"></i> {{n.name}}
              <div class="child" v-if="n.children && n.children.length" :style="{height : n.height}">
                  <ol>
                    <li v-for="(val,key) in n.children" :class="val.active && 'active'" @click="toggleChild(i,key,val)">
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
  import store from '@/vuex/store';
  export default {
    data(){
      return{
          now : 0,
          menuList : [
            {
              name : '首页',
              path : '/',
              icon : 'fa fa-home',
              active : true
            },
            {
              name : '人物管理',
              icon : 'fa fa-user-o',
              children : [
                {
                  name : '账号管理',
                  path : '/accounts',
                  active : false
                },
                {
                  name : '角色管理',
                  path : '/role',
                  active : false
                },
                {
                  name : '装备管理',
                  path : '/equip',
                  active : false
                },
                {
                  name : '背包管理',
                  path : '/iventory',
                  active : false
                },
                {
                  name : '家族管理',
                  path : '/guild',
                  active : false
                }
              ],
              active:false,
              height:0
            },
            {
              name : '管理',
              icon : 'fa fa-gamepad',
              children : [
                {
                  name : '商城Code',
                  path : '/mall',
                  active : false
                },
                {
                  name : '商店管理',
                  path : '/shop',
                  active : false
                },
                {
                  name : '怪物管理',
                  path : '/mob',
                  active : false
                },
                {
                  name : '技能管理',
                  path : '/skill',
                  active : false
                }
              ],
              active:false,
              height:0
            },
            {
              name : '资料库',
              icon : 'fa fa-book',
              path : '/library',
              active:false
            }
          ]
      }
    },
    methods:{
        toggleMenu(n,i){
            let status = this.menuList[i].active; // 当前菜单状态
            let now = this.menuList[this.now];
            if(this.now != i){ //判断是否点击了自身
                now.active = false;
                now.height && (now.height = '0px');
                if(now.children){
                    now.children.forEach( (n) => n.active = false);
                };
                this.now = i;
                this.$set(this.menuList[i],'active',true);
                n.children && this.$set(this.menuList[i],'height', n.children.length * 40 + 'px');
                this.$store.commit('replace',n.name);
            };
        },
        toggleChild(pIndex, cIndex, n){
            let parent = this.menuList[pIndex].children;
            parent.forEach( (n)=>{
              n.active = false;
            });
            this.$set(parent[cIndex],'active',true);
            this.$store.commit('replace', n.name);
        }
    },
    store
  };
</script>

<style scoped>

.nav {
  float:left;
  width: 15%;
  height: 100%;
  background-color: #545c64;
}
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
.nav ul li {
  line-height: 40px;
  color: #ccc;
  cursor: pointer;
  padding-left: 20px;
  overflow: hidden;
  
}
.nav ul li.active {
  background-color: #434a50;
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
.nav ol li a {
  font-size:12px;
}
.nav ol li.active a {
  color:#FFD04B;
}
.nav .child {
  -webkit-transition: height 0.3s linear;
  transition: height 0.3s ;
}
</style>
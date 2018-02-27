<template>
    <div>
        <div class="search">
            <label class="control-label">
                <span>帐号状态:</span>
                <select class="form-control" name="loggedin" v-model="search.loggedin">
                    <option value="">全部</option>
                    <option value="1">在线</option>
                    <option value="0">下线</option>
                </select>
            </label>
            <label class="control-label">
                <span>帐号状态:</span>
                <select class="form-control" name="banned" v-model="search.banned">
                    <option value="">全部</option>
                    <option value="0">正常</option>
                    <option value="1">封号</option>
                </select>
            </label>
            <input class="form-control" type="text" name="name" placeholder="请输入帐号名称" v-model="search.name">
            <span class="btn btn-primary search-btn" @click="scanf(1)"><i class="fa fa-search"></i>搜索</span>
            <span class="btn btn-primary add-btn"><i class="fa fa-address-card-o"></i>新增</span>
            <span class="btn btn-primary batch-deletion"><i class="fa fa-trash-o"></i>批量删除</span>
        </div>
        <div class="fl-panel fl">
            <div class="fl-title">帐号列表</div>
            <div class="fl-content">
                <table class="table-list">
                    <thead>
                        <tr>
                            <th>
                                <i class="fa fa-square-o"></i>
                            </th>
                            <th>帐号</th>
                            <th>是否登陆</th>
                            <th>状态</th>
                            <th>封号理由</th>
                            <th>点券</th>
                            <th>抵用券</th>
                            <th>元宝</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody class="data-content">
                        <tr v-for="(item,index) in userList">
                            <td>
                                <i class="fa fa-square-o"></i>
                            </td>
                            <td>{{item.name}}</td>
                            <td :class="{'text-success': item.loggedin}">{{item.loggedin ? '在线' : '下线'}}</td>
                            <td :class="item.banned ? 'text-disabled':'text-success'">{{item.banned ? '封号' : '正常'}}</td>
                            <td>{{item.banreason}}</td>
                            <td>{{item.paypalNX}}</td>
                            <td>{{item.mPoints}}</td>
                            <td>{{item.money}}</td>
                            <td>
                                <span class="btn btn-primary modify-btn" @click="modifyUser(item.id)">修改</span></span>
                                <span class="btn btn-primary modify-btn" @click="ban(item.id)">封号</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <m-pagiantion :cur="search.curPage" :total="pageSize" :goto="scanf"></m-pagiantion>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Pagination from '../common/Pagination.vue';
    import FormBox from '../common/formBox/FormBox.vue';
    export default {
        data(){
            return {
                userList : [],
                search : {
                    loggedin : '',
                    banned : '',
                    name : '',
                    curPage : 1
                },
                pageSize : 0
            }
        },
        mounted(){
            this.scanf();
        },
        components : {
            'm-pagiantion': Pagination
        },
        methods:{
            scanf(cur){
                if(cur){
                    this.search.curPage = cur;
                };
                axios.post('/user/search', this.search).then((resp)=>{
                    this.userList = resp.data.data.list;
                    this.pageSize = resp.data.data.pageSize;
                }).catch((err)=>{
                    // this.$message({
                    //     tip : 0,
                    //     msg : '获取数据失败!'
                    // });
                });
            },

            modifyUser(id){
                axios.get('/user/detail/' + id).then((resp)=>{
                    this.$formBox({
                        form : [
                            {
                             name : "账号",
                             type : 'name',
                            },
                            {
                             name : "生日",
                             type : 'birthday'
                            },
                            {
                             name : "GM等级",
                             type : 'gm'
                            },
                            {
                             name : "QQ",
                             type : 'QQ'
                            },
                            {
                             name : "邮箱",
                             type : 'email'
                            },
                            {
                             name : "点券",
                             type : 'paypalNX'
                            },
                            {
                             name : "抵用券",
                             type : 'mPoints'
                            },
                            {
                             name : "元宝",
                             type : 'money'
                            }
                        ],
                        data : resp.data.data,
                        save(){
                            axios.post('/user/modify',this.data).then( resp =>{
                                if(resp.data.ret){
                                    this.close();
                                    this.$message(1,'修改成功')
                                }else{
                                    this.$message(0,'修改失败')
                                }
                            }).catch( err =>{
                                this.$message(0,'修改失败')
                            })
                        }
                    })
                }).catch((err)=>{
                    // this.$message({
                    //     tip : 0,
                    //     msg : '获取数据失败!'
                    // });
                });
            },
            ban(id){
                console.log(id);
            }
        }
    };
</script>
<style scoped>
    .search {
        float: left;
        width: 100%;
        padding: 10px;
    }
    .table-list{
        font-size:14px;
        text-align:center;
    }
    .table-list tbody tr td:first-child{
        text-align:left;
    }
</style>
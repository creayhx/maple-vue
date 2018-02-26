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
            <span class="btn btn-primary search-btn"><i class="fa fa-search"></i>搜索</span>
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
                                <span class="btn btn-primary modify-btn" @click="modifyUser(item)">修改</span></span>
                                <span class="btn btn-primary modify-btn" @click="ban(item)">封号</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        data(){
            return {
                userList : [],
                search : {
                    loggedin : '',
                    banned : '',
                    name : '',
                    curPage : 1
                }
            }
        },
        mounted(){
            this.scanf();
        },
        methods:{
            scanf(){
                axios.post('/user/search', this.search).then((resp)=>{
                    this.userList = resp.data.data.list;
                }).catch((err)=>{
                    console.log(err);
                });
            },
            modifyUser(){
                
            },
            ban(){

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
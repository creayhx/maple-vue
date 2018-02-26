<template>
	<div class="pagination">
		<span @click="prev()">&lt;</span>
		<span @click="curPage=item; goto(item);" :class="{cur : curPage == item}" v-for="(item) in pages">{{item}}</span>
		<span @click="next()">&gt;</span>
		<span> 总共{{total >= 1 ? total : 1}}页</span>
		<span ><input type="text" class="page-go" v-model.number="nowPage"></span>
		<span class="go" @click="jump()">GO</span>
	</div>
</template>
<script>
  export default {
    name: 'pagination',
    props: ['cur','min','total','goto'],
    data(){
    	return{
    		curPage : this.cur > 1 ? this.cur : 1 ,
    		fix : this.min ? this.min : 4, // 固定边界页数
    		onePage : this.min ? this.min * 2 : 8, //每页条数
    		nowPage : 1, //用户跳转的页数
    	}
    },
    methods : {
    	prev(){
            if(this.curPage >1){
            	this.goto(--this.curPage);
            };
    	},
    	next(){
        	if(this.curPage < this.total){
        		this.goto(++this.curPage);
        	};
    	},
    	jump(){
    		if(this.nowPage >= 1 && this.nowPage <= this.total){
    			this.curPage = this.nowPage;
    			this.goto(this.curPage);
    		};
    	}
    },
    computed : {
    	pages(){
    		let pages = [];
    		let start = 1;
    		let end = this.total >= 1 ? this.total + 1 : 2;
    		if(this.total > 10){
    			if(this.curPage + this.fix < this.total && this.curPage - this.fix > 1){
    				start = this.curPage - this.fix;
    				end = this.curPage + this.fix + 1;
    			}else{
    				if(this.curPage + this.onePage < this.total){
    					start = 1;
    					end =start + this.onePage;
    				}else{
    					start = this.total - this.onePage < 1 ? 1 : this.total - this.onePage;
    					end = this.total + 1;
    				};
    			};
    		};
    		for(let i = start; i < end; i++){
    			pages.push(i);
    		};
    		return pages
    	}
    }
  }
</script>

<style scoped>
  
</style>

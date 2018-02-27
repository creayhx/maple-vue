<template>
	<div class="pagination">
		<span @click="prev()">&lt;</span>
		<span @click="curPage = item; goto(item);" :class="{cur : currentPage == item}" v-for="(item) in pages">{{item}}</span>
		<span @click="next()">&gt;</span>
		<span> 总共{{total >= 1 ? total : 1}}页</span>
		<span ><input type="text" class="page-go" v-model.number="nowPage"></span>
		<span class="go" @click="jump()">GO</span>
	</div>
</template>
<script>
  export default {
    name: 'pagination',
    props: ['cur','total','goto'],
    data(){
    	return{
    		curPage : this.cur > 1 ? this.cur : 1,
    		nowPage : 1, 
            onePage  : 7
    	}
    },
    methods : {
    	prev(){
            if(this.curPage > 1){
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
        currentPage(){ //重新计算当前页
            this.curPage = this.cur;
            return this.cur
        },
    	pages(){
    		let pages = [];
            let start = 1;
            let end = this.total + 1;
            let middle = Math.floor(this.onePage / 2);
    		if(this.total > this.onePage){
                if(this.curPage > middle){
                    end = this.curPage + 2 >= this.total ? end : (this.curPage + middle) >= this.total ? end : (this.curPage + middle);
                    start = end - this.onePage + 1;
                }else{
                    end = this.onePage;
                }
            }else{
                end = this.total + 1;
            };
            for(let i = start ; i < end; i++){
                pages.push(i);
            }
    		return pages
    	}
    }
  }
</script>

<style scoped>
  
</style>

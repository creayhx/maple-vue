<template>
	<transition name="fade" mode="out-in">
		<div class="message" :class="tipClass" v-if="show">
			<i class="fa fa-info-circle"></i>
			<p>{{msg}}</p>
		</div>
	</transition>
</template>

<script>
	export default {
		name : 'messageBox',
		data(){
			return {
				tip : 9,
				show : false,
				msg : '',
				time : 2000
			}
		},
		computed : {
			tipClass(){
				let cls = '';
				switch(this.tip){
					case 0 :
						cls = 'danger' 
					break;
					case 1 :
						cls = 'success' 
					break;
					case 2 :
						cls = 'warning' 
					break;
				}
				return cls
			}
		},
		methods:{
			close(){
				setTimeout(()=>{
					this.show = false;
				},this.time)
			}
		},
		mounted(){
			this.show = true;
			this.close();
		}
	};
</script>
<style scoped>
	.message{
		min-width: 300px;
		box-sizing: border-box;
		border-radius: 4px;
		border: 1px solid #ebeef5;
		position: fixed;
		left: 50%;
		top: 20px;
		transform: translateX(-50%);
		background-color: #edf2fc;
		transition: opacity .3s,transform .4s;
		overflow: hidden;
		padding: 15px 15px 15px 20px;
		font-size:14px;
		display: flex;
		align-items: center;
	}
	.message>i{
		font-size:20px;
	}
	.message>p{
		display:inline-block;
		margin-left:10px;
		text-align:center;
	}
	.message.success{
		background-color: #f0f9eb;
	    color: #67c23a;
	}
	.message.warning{
		background-color: #f0f9eb;
	    color: #e6a23c;
	}
	.message.danger{
		background-color: #fef0f0;
		color: #f56c6c;
	}
	.fade-enter {
	  opacity:0;
	  transform: translate(-50%,-30%);
	}
	.fade-leave{
	  opacity:1;
	  transform: translate(-50%,0%);
	}
	.fade-enter-active{
	  transition:all .5s;
	}
	.fade-leave-active{
	  transform: translate(-50%,-30%);
	  opacity:0;
	  transition:all .5s;
	}
</style>
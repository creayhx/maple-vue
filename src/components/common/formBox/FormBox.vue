<template>
		<transition name="fade" mode="out-in">
			<div class="form-mask" v-if="show">
				<div class="form-box" :style="{width : width, height : height}">
					<div class="header">
						<div class="header-title">{{title}}</div>
					</div>
					<div class="form-body clearfix">
						<div class="role-item"  v-for="(val,key) in form">
							<label class="control-label">
					            <span>{{val.name}}:</span>
					            <input class="form-control" type="text"  :disabled="val.type == 'name'" v-model="data[val.type]">
					        </label>
						</div>
						<label class="control-label line btn-group">
							<span class="btn btn-primary" @click="save()">保存</span>
							<span class="btn btn-primary" @click="close()">取消</span>
						</label>
					</div>
				</div>
			</div>
		</transition>
</template>

<script>
	export default {
		name : 'formBox',
		data(){
			return {
				show : false,
				width:'600px',
				height:'auto',
				title : '默认标题',
				data : {},
				form : []
			}
		},
		methods:{
			close(){
				this.show = false;					
			}
		},
		mounted(){
			this.show = true;
		}
	};
</script>
<style scoped>
	.form-mask{
		position:absolute;
		top:0;
		left:0;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,.3);
		border-radius: 3px;
		overflow:hidden;
	}
	.form-box{
		position:absolute;
		top:20%;
		left:50%;
		transform: translateX(-50%);
	    box-shadow: 1px 1px 50px rgba(0,0,0,.3);
	}
	.form-body{
		padding:10px;
		background-color: #fff;
	    overflow-y:scroll;
	}
	.form-body::-webkit-scrollBar{
		width:0;
	}
	.header{
		padding: 0 80px 0 20px;
		height: 42px;
		line-height: 42px;
		border-bottom: 1px solid #eee;
		font-size: 14px;
		color: #333;
		overflow: hidden;
		background-color: #F8F8F8;
		border-radius: 2px 2px 0 0;
	}
	.role-item{
		float:left;
		width: 50%;
		margin-bottom:10px;
	}
	.btn-group{
		text-align:center;
	}
	.fade-enter {
	  opacity:0;
	}
	.fade-leave{
	  opacity:1;
	}
	.fade-enter-active{
	  transition:all .5s;
	}
	.fade-leave-active{
	  opacity:0;
	  transition:all .5s;
	}
</style>
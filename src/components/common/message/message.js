import Vue from 'vue';
import Message from './message.vue';
Message.installMessage = (opt)=>{
	if(opt){
		if(typeof opt === 'string' || typeof opt === 'number'){
			opt = {
				message : opt
			};
		};
	}else{
		opt = {
			message : ''
		};
	};
	let message = Vue.extend(Message);
	let component = new message({
		data : opt
	}).$mount();
	document.body.appendChild(component.$el);
};
const install = (Vue)=>{
    Vue.prototype.$message = Message.installMessage;
};

export default install;
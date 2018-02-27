import Vue from 'vue';
import Message from './message.vue';
Message.installMessage = (tip, opt)=>{
	let option = {};
	if(opt){
		if(typeof opt === 'string' || typeof opt === 'number'){
			option = {
				tip : tip ? tip : '',
				msg : opt
			};
		}else{
			tip && (opt.tip = tip);
			option = tip;
		};
	}else{
		option = {
			tip : tip ? tip : '',
			message : ''
		};
	};
	let message = Vue.extend(Message);
	let component = new message({
		data : option
	}).$mount();
	document.body.appendChild(component.$el);
};
const install = (Vue)=>{
    Vue.prototype.$message = Message.installMessage;
};

export default install;
import Vue from 'vue';
import FormBox from './FormBox.vue';

FormBox.installFormBox = (opt)=>{
	if(opt){
		let formBox = Vue.extend(FormBox);
		let component = new formBox({
			data : opt
		}).$mount();
		document.body.appendChild(component.$el);
	};
};

const install = (Vue)=>{
	Vue.prototype.$formBox = FormBox.installFormBox;
};
export default install;
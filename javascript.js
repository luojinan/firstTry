/*
 *功能：
 *		1、输入框按下回车在下面区域添加ul列表
 *		2、添加ul列表和删除按钮
 *		3、给删除按钮添加事件
 *		4、全选框勾上会触发各自的选择勾上，各自的选择只要一个没勾，全选框自动识别，勾或不勾
 *		5、勾上的内容动态加上删除线样式
 *		6、双击li文字部分，原文字变成输入框，进入修改模式
 *		7、利用hash实现单页面选项卡功能
 *步骤：
 *		1、输入框回车触发事件
 *			1、获取当前输入框的数据（使用v-model='val'）
 *			2、数组添加参数 unshift 赋值给this.arr空数组里
 *			3、把输入框的数据清空 前面已经获取到了，this.val=''
 *		2、删除点击事件
 *			1、绑定事件的时候，传入参数这个参数可以是当前li遍历到的那一个数组参数的值和序列
 *			2、利用filter(item,index){} 进行删除数组数据
 *			3、判断条件为 点击的序列（一个值）==循环整个数组的序列 ，即可找出当前数组数据
*/


//初始化实例
let vm = new Vue({
	el: '#app' ,
	//钩子函数，生命周期，异步处理
	created(){
		//当浏览器内有存着的数据就用浏览器的数据，反之用json的
		if(localStorage.getItem('data')){
			//alert('浏览器有数据');
			this.arr = JSON.parse(localStorage.getItem('data'));
		}else{
			//axios一部请求数据
			axios.get('./list.json').then(
				res=>{
					//请求到的json数据res 里的data是字符串类型
					//不具备数组和对象的使用
					//利用eval方法把字符串转换为对象数组
					//this.arr = eval('(' + res.data + ')');
					this.arr = res.data;

				},err=>{
					console.log(err);
				});			
		};
		//监控当前的hash值，把hash值赋值给一个变量，获取到，这个变量用于后面的判断
		//监控是操作浏览器的，所以用到 window.  使用箭头函数，可以使用到this是vm
		//浏览器内置方法  addEventListener('hashchange',函数,false)
		window.addEventListener('hashchange',()=>{
			this.hash=window.location.hash.slice(2);
		},false);
		//只能监控到hash变化的时候，当页面刷新时 我们赋值的hash值 还没有进行赋值，而网址有hash（不随刷新清除）
		//我们还需要页面刷新时也得到hash值
		this.hash = window.location.hash.slice(2) || 'all';
		//以上步骤使我们可以获取到任何情况下的hash值并存到data数据中
		//我们就可以根据这个data数据进行操作选项卡的功能
	},
	methods:{
		fn(){
			alert('测试一下');
		},
		//添加事件
		add(){
			//数组的push方法添加进一个对象
			this.arr.push({
				isSelected:false,
				do:this.doWhat
			});
			this.doWhat="";
		},
		//删除事件
		remove(index){
			//判断当前选中的数组序列，删除item
			this.arr = this.arr.filter(function(item,index2){
				return index!=index2;
			});
		},
		//全选删除
		removeAll(){
			this.arr=[];
		},
		//双击编辑事件
		write(item){
			this.remenber = item;
		},
		//编辑完成，回车确定修改
		cancel(){
			this.remenber='';
		}
	},
	//自定义指令
	//自定义 v- 用于操作DOM 如v-show、v-model
	directives:{
		//当双击的时候那个输入框获取到页面的焦点，离开就会取消
		//属性是el：DOM节点，bindings:DOM节点=""
		//需要 @blur方法支持？？？
		focus(el,bindings){
			if(bindings.value){
				el.focus();
			};
		},
	},

	//计算属性
	computed:{
		checkAll:{
			//根据其他选择框判断全选框是否勾选
			get(){
				//循环数组里的对象的是否选择  若出现一个false则return false，若全true 则return true
				//全选框是v-model="这个计算属性的return"
				return this.arr.every(function(item){
							return item.isSelected;
				});
 			},
 			//全选按钮控制其他选择框
			set(val){
				//forEach循环把全选框的值循环遍历给其他选择框
				this.arr.forEach(function(item){
					item.isSelected = val ;
				})
			}
		},
		howMany(){
			return num = this.arr.filter(function(item){return !item.isSelected;}).length;
		},
		//根据hash获取到新的数组，让选项卡功能实现，根据hash不同展示不同数据
		realArr(){
			if(this.hash==='finish'){
				return this.arr.filter(function(item){return item.isSelected;});
			};
			//为什么这里是unfinsh 我明明拼对了是unfinish 浏览器缓存？？
			if(this.hash==='unfinsh'){
				return this.arr.filter(function(item){return !item.isSelected;});
			};
			if(this.hash==='all'){
				return this.arr;
			};
			//如果有人在浏览器网址上瞎鸡巴写hash值，会显示为空内容，设置成all
			//但是  就相当于这个乱写的hash会跳到all中去
			return this.arr;
		},
	},
	//没绑定事件的数据，会被数据改变而直接触发
	//计算属性就不会因为数据变了就直接触发，而是相关数据变了才触发

	//监控数据
	//只要数据已发生变化就执行(用于存储数据到本地浏览器)
	//当页面刷新时，在created钩子函数中操作
	watch:{
		//监控什么数据就写什么
		//监控arr对象数组
		arr:{
			handler(){
				//数据一变化就存进浏览器本地中  用 localStorage.setItem('存入的数据命名'，要存入的数据-字符串类型)
				//在浏览器的Application中查看
				localStorage.setItem('data',JSON.stringify(this.arr));
			},deep:true
		}
	},

	data:{
		msg:'测试一下',
		val:'',
		arr:[],
		doWhat:'',
		remenber:'',
		isShowWhat:'',
		hash:'',

	},
})

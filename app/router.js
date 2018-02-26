var C = require('./controllers');
module.exports = function(app){
	app.use(function(req,res,next){
		app.locals.user = req.session.user;
		next();
	});
	app.get('/', C.Ver.verLogin,C.Pages.index); //打开首页
	app.get('/accounts', C.Ver.verLogin, C.Pages.accounts); //帐号管理
	app.get('/role', C.Ver.verLogin,C.Pages.role); //角色管理
	app.get('/equip', C.Ver.verLogin,C.Pages.equip); //装备管理
	app.get('/inventory', C.Ver.verLogin,C.Pages.inventory); //背包管理
	app.get('/mall', C.Ver.verLogin,C.Pages.mall); //商城
	app.get('/guild', C.Ver.verLogin,C.Pages.guild); //家族
	app.get('/shop', C.Ver.verLogin,C.Pages.shop); //商店
	app.get('/mob', C.Ver.verLogin,C.Pages.mob); //怪物
	app.get('/skill', C.Ver.verLogin,C.Pages.skill); //技能管理
	app.get('/library', C.Ver.verLogin,C.Pages.library); //资料库
	app.get('/setting', C.Ver.verLogin,C.Pages.setting); //设置
	app.get('/login', C.Ver.hasLogin , C.Pages.login); //登录
	app.get('/file', C.Ver.hasLogin , C.Pages.file); //注册

	//test
	app.get('/test/test',C.Test.test);
	//user
	app.get('/user/logout',  C.User.logout); //退出
	app.post('/user/signin',  C.User.signin); //登录
	app.post('/user/signup',  C.User.signup); //注册

	//accounts
	app.post('/user/search', C.Ver.canUseAjax, C.User.search); //搜索帐号
	app.post('/user/remove', C.Ver.canUseAjax, C.User.remove); //批量删除
	app.post('/user/ban', C.Ver.canUseAjax, C.User.ban); //封号
	app.post('/user/add', C.Ver.canUseAjax, C.User.add); //添加
	app.get('/user/detail/:accId', C.Ver.canUseAjax, C.User.detail); //详情
	app.post('/user/modify', C.Ver.canUseAjax, C.User.modify); //详情

	app.post('/role/search', C.Ver.canUseAjax, C.Role.search); //搜索角色
	app.post('/role/remove', C.Ver.canUseAjax, C.Role.remove); //批量删除
	app.get('/role/detail/:roleId', C.Ver.canUseAjax, C.Role.detail); //角色详情
	app.post('/role/modify', C.Ver.canUseAjax, C.Role.modify); //角色详情

	app.post('/equip/search', C.Ver.canUseAjax, C.Equip.search);//装备列表
	app.get('/equip/detail/:id', C.Ver.canUseAjax, C.Equip.detail);//装备箱详情
	app.post('/equip/modify', C.Ver.canUseAjax, C.Equip.modify);//装备修改
	app.post('/equip/remove', C.Ver.canUseAjax, C.Equip.remove);//装备删除

	app.post('/inventory/search', C.Ver.canUseAjax, C.Inventory.search);//装备列表
	app.get('/inventory/detail/:id', C.Ver.canUseAjax, C.Inventory.detail);//除了装备以外物品的详情
	app.post('/inventory/modify', C.Ver.canUseAjax, C.Inventory.modify);//装备修改

	app.post('/mall/search', C.Ver.canUseAjax, C.Mall.search);//商城列表
	app.get('/mall/used/:code', C.Ver.canUseAjax, C.Mall.used);//商城商品
	app.post('/mall/remove', C.Ver.canUseAjax, C.Mall.remove);//商城删除
	app.post('/mall/create', C.Ver.canUseAjax, C.Mall.create);//商城新增

	app.post('/guild/search', C.Ver.canUseAjax, C.Guild.search);//家族搜索
	app.get('/guild/detail/:id', C.Ver.canUseAjax, C.Guild.detail);//家族详情
	app.post('/guild/modify', C.Ver.canUseAjax, C.Guild.modify);//家族修改
	app.post('/guild/remove', C.Ver.canUseAjax, C.Guild.remove);//家族删除

	app.get('/shop/npclist', C.Ver.canUseAjax, C.Shop.npcList);//商店npc列表
	app.post('/shop/removeNpc', C.Ver.canUseAjax, C.Shop.removeNpc);//删除npc
	app.post('/shop/removeShop', C.Ver.canUseAjax, C.Shop.removeShop);//删除商品
	app.get('/shop/list/:shopid', C.Ver.canUseAjax, C.Shop.list);//商品列表
	app.get('/shop/detail/:id', C.Ver.canUseAjax, C.Shop.detail);//商品详情
	app.post('/shop/modify', C.Ver.canUseAjax, C.Shop.modify);//商品修改

	app.get('/mob/moblist', C.Ver.canUseAjax, C.Mob.mobList);//怪物列表
	app.get('/mob/list/:mobid', C.Ver.canUseAjax, C.Mob.list);//怪物物品列表
	app.post('/mob/removeMob', C.Ver.canUseAjax, C.Mob.removeMob);//删除mob
	app.post('/mob/removeShop', C.Ver.canUseAjax, C.Mob.removeShop);//删除商品
	app.get('/mob/detail/:id', C.Ver.canUseAjax, C.Mob.detail);//商品详情
	app.post('/mob/modify', C.Ver.canUseAjax, C.Mob.modify);//商品修改
	
	app.get('/skill/rolelist', C.Ver.canUseAjax, C.Skill.rolelist);
	app.post('/skill/skills/:curPage',C.Ver.canUseAjax, C.Skill.skills);

	app.get('/library/mobs/:curPage',C.Ver.canUseAjax,C.Library.mobs)
	
	app.post('/file/upload',C.File.upload);//文件上传
};
var 
    fs = require('fs'),
    formidable = require('formidable'),
    crypto = require('crypto'),
    mysql = require('mysql'),
    co = require('./common').co,
    thunkify = require('./common').thunkify,
    sqlConfig = require('./sqlConfig').sqlConfig,
    conn = null, sql = null;

// 连接mysql
function handleError (err) {
    if (err) {
        // 如果是连接断开，自动重新连接
        if (err || err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('连接断开 - ', err)
            setTimeout(loadMysql,1000);
        } else {
            throw err;
        }
    }
}
// 连接数据库
function loadMysql () {
  conn = mysql.createConnection(sqlConfig);
  conn.connect(handleError);
  conn.on('error', handleError);
  sql = thunkify(conn.query, conn);
};

function getSalt(length) { //获取随机字符串
    var len = length ? length : 32;
	var res =[];
	var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	for (var i = 0; i < len; i++) {
		var id = Math.floor( Math.random() * (chars.length - 1) );
		res.push(chars[id]);
	}
	return res.join('');
};
function getTime(time) { // 根据时间戳获取时间
	var now = time ? new Date(time) : new Date();
	return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
};
function splitPageSize(ret){ // 处理分页数据
    var opt = {};
    if(ret && ret.length){
        opt.pageSize = Math.ceil(ret[0].pageSize / 10);
        ret.forEach(function(n){
            delete n.pageSize
        });
        opt.list = ret;
    }else{
        opt = {list:[],pageSize:1};
    };
    return opt;
};
function result(res,data,message,result){ // 输出数据
	res.json({
		data : data,
		msg : message,
		ret : result
	});
};
var Common = {
    addUser:function(res,newUser,verCode){ // 用户创建
        if( newUser.verCode == verCode ){
            co(function*(){
                var hasUser = yield sql('SELECT name FROM accounts WHERE name = ? limit 1' , [newUser.name]);
                if(hasUser.length == 0 ){
                    var salt = getSalt();
                    var time = getTime();
                    var password = crypto.createHash('sha512').update(newUser.password + salt).digest('hex');
                    var insertStat = yield sql( 'INSERT INTO accounts(name,password,salt,createdat,birthday,banned,gm,forumaccid,lastpwemail,tempban,present,cmsloggedin,lastvote,monthvotes,totalvotes,admin,gender,pin,jfmoney,money,boss) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [newUser.name, password, salt, time, time, 0, 0, 0, time, time, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0] );
                    if( insertStat ){
                        result(res, null, '用户创建成功', true);
                    }else{
                        result(res, null, '用户注册失败', false);
                    };
                }else{
                    result(res, null, '用户已存在,请重新注册', false);
                };
            });
        }else{
            result(res, null, '邀请码错误', false);
        };
    }
};
var Pages = { // 查看网页
    index : function(req, res) { //首页
        res.render('index',{
            title : 'index',
            user : req.session.user,
        });
    },
    accounts : function(req, res) { //帐号
        res.render('index', {
            title: 'Accounts',
        })
    },
    role : function(req,res){ //角色
        res.render('index',{
            title : 'Role',
        })
    },
    login : function(req, res) { // 登录
        res.render('index', {
            title: 'login'
        });
    },
    reg : function(req, res) { // 注册
        res.render('index', {
            title: 'register'
        });
    },
    equip : function(req,res){
        res.render('index', {
            title: 'equipment'
        });
    },
    inventory : function(req,res){
        res.render('index', {
            title: 'inventory'
        });
    },
    mall : function(req,res){
        res.render('index', {
            title: 'mall'
        });
    },
    guild : function(req,res){
        res.render('guild', {
            title: 'guild'
        });
    },
    shop : function(req,res){
        res.render('index', {
            title: 'shop'
        });
    },
    mob : function(req,res){
        res.render('index', {
            title: 'mob'
        });
    },
    skill : function(req,res){
        res.render('index', {
            title: 'skill'
        });
    },
    library : function(req,res){
        res.render('index', {
            title: 'library'
        });
    },
    setting : function(req,res){
        res.render('index', {
            title: 'setting'
        });
    },
    file : function(req,res){
        res.render('index', {
            title: 'upload'
        });
    }
};

var User = {
    signin : function(req, res) { // 登录
        var user = req.body; //获取表单中的user对象信息
        co(function*(){
            var ret = yield sql('SELECT * FROM accounts WHERE name = ?',[user.name]);
            if (ret && ret.length) {
                if ( ret[0].salt ) {
                    if ( crypto.createHash('sha512').update(user.password + ret[0].salt).digest('hex') == ret[0].password ) {
                        req.session.user = ret[0];
                        result(res, null , null , true);
                    } else {
                        result(res, null , '帐号或密码错误' , false);
                    };
                } else {
                    var password = crypto.createHash('sha1').update(user.password).digest('hex');
                    if (password = ret[0].password) {
                        req.session.user = ret[0];
                        result(res, null , '帐号未登录过游戏,可以正常登录' , true);
                    } else {
                        result(res, null, '密码错误', false);
                    };
                };
            } else {
                result(res, null, '帐号不存在', false);
            };
        });
    },
    signup : function(req, res) { //注册
        Common.addUser(res,req.body,'apple');
    },
    search: function(req,res){
        var sch = req.body;
        var startPage = sch.curPage > 0 ? (sch.curPage - 1) * 10  : 0;
        var loggedin = sch.loggedin == '' ? 'loggedin' : Number(sch.loggedin);
        var banned = sch.banned == '' ? 'banned' : Number(sch.banned);
        co(function*(){
            var ret = yield sql(`SELECT id,name,loggedin,banned,banreason,paypalNX,mPoints,money,( SELECT COUNT(*) FROM accounts WHERE loggedin = ${loggedin} AND banned = ${banned} AND  name like "%${sch.name}%" ) as pageSize FROM accounts WHERE loggedin= ${loggedin}  AND banned = ${banned} AND name like "%${sch.name}%" ORDER BY id LIMIT ? , 10`, [startPage]);
            result(res, splitPageSize(ret),null,true);
        });
    },
    remove: function(req,res){
        var ids = req.body.ids;
         co(function*(){
            var ret = yield sql( 'DELETE FROM accounts WHERE id in ( ? )',[ids] );
            if(ret.fieldCount){
                result(res,null,ret.message,false);
            }else{
                result(res,null,null,true);
            };
        });
    },
    ban : function(req,res){
        var id =req.body.id;
        co(function*(){
            yield sql('DELETE FROM ipbans');
            var ret = yield sql('UPDATE accounts SET banned = IF(banned = 0 ,1 ,0), banreason=IF(banned = 0, "" ,"管理员封号" ) WHERE id = ?',[id]);
            if(ret.fieldCount){
                result(res,null,ret.message,false);
            }else{
                result(res,null,null,true);
            }
        });
    },
    add : function(req,res){
        req.body.verCode = '';
        Common.addUser(res,req.body,'');
    },
    detail : function(req,res){
        var id = Number( req.params.accId );
        co(function*(){
            var ret = yield sql('SELECT name,birthday,gm,QQ,email,paypalNX,mPoints,money FROM accounts WHERE id = ?',[id]);
            if(ret.length){
                result(res,ret[0],null,true);
            }else{
                result(res,null,ret.message,false);
            }
        });
    },
    modify: function(req,res){
        var detail = req.body;
        co(function*(){
            var ret = yield sql('UPDATE accounts SET birthday = ? ,gm = ? , QQ = ? ,email =  ? ,paypalNX = ? ,mPoints = ? ,money = ? WHERE name = ?',[detail.birthday, detail.gm, detail.QQ, detail.email, detail.paypalNX, detail.mPoints, detail.money,detail.name]);
            if(ret.affectedRows){
                result(res,null,null,true);
            }else{
                result(res,null,'更新失败',true);
            }
        });
    },
    logout : function(req,res){ // 4退出
        if(req.session.user){
            delete req.session.user;
        };
        res.redirect('/login');
    },
};
var Role = {
    search : function(req,res){
        var sch = req.body;
        var startPage = sch.curPage > 0 ? (sch.curPage - 1) * 10  : 0;
        co(function*(){
            var ret = yield sql(`SELECT t2.id,t2.name,t2.gm,t2.vip,t2.level,t2.exp,t2.str,t2.dex,t2.int,t2.luk,t2.maxhp,t2.maxmp,t2.meso,t2.job,t2.ap,t2.sp,t2.map,t2.equipSlots,t2.useSlots,t2.setupSlots,t2.etcSlots,t2.cashSlots,t2.fame , (SELECT COUNT(*) FROM accounts AS t1 INNER JOIN characters AS t2 ON (t1.name LIKE "%${sch.name}%" or t2.name LIKE "%${sch.name}%") AND t1.id = t2.accountid) AS pageSize FROM accounts AS t1 INNER JOIN characters AS t2 ON (t1.name LIKE "%${sch.name}%" or t2.name LIKE "%${sch.name}%") AND t1.id = t2.accountid ORDER BY t2.id LIMIT ? , 10`, [startPage]);
            result(res, splitPageSize(ret) ,null,true);
        });
    },
    remove : function(req,res){
        var ids = req.body.ids;
         co(function*(){
            var ret = yield sql( 'DELETE FROM characters WHERE id in ( ? )',[ids] );
            if(ret.fieldCount){
                result(res,null,ret.message,false);
            }else{
                result(res,null,'删除成功',true);
            };
        });
    },
    detail : function(req,res){
        var id = Number( req.params.roleId );
        co(function *(){
            var ret = yield sql('SELECT id, name, gm, vip, level, exp, str, dex, `int`, luk, maxhp, maxmp, meso, job, ap, sp, map, equipSlots, useSlots, setupSlots, etcSlots, cashSlots, fame FROM characters WHERE id = ?',[id]);
            if(ret.length){
                result(res,ret[0],null,true);
            }else{
                result(res,null,ret.message,false);
            }
        });
    },
    modify : function(req,res){
        var data = req.body;
        var sqlKey = [],sqlVal = [];
        for(var k in data){
            if(k != 'id'){
                sqlKey.push(k =='int' ? '`int` = ?' : k + '= ?' );
                sqlVal.push( data[k] );
            };
        };
        sqlVal.push(data.id);
        co(function*(){
            var ret = yield sql('UPDATE characters SET '+ sqlKey.join(',') +' WHERE id = ? ',sqlVal);
            if( ret.fieldCount){
                result(res,null,ret.message,false)
            }else{
                result(res,null,'修改成功',true);
            }
        });
    }
};
var Equip = {
    search:function(req,res){
        var name = req.body.name;
        var curPage = req.body.curPage
        var startPage = curPage > 0 ? (curPage - 1) * 10  : 0;
        co(function*(){
            var ret = yield sql('SELECT t1.name,t2.inventoryitemid, t2.position, t2.itemid, t3.item_name, ( SELECT COUNT(*) FROM characters as t1, inventoryitems as t2 WHERE t1.name like "%'+name+'%" and t1.id = t2.characterid and t2.inventorytype = -1) as pageSize FROM characters AS t1 INNER JOIN inventoryitems as t2 on t1.name like "%'+name+'%" and t1.id=t2.characterid and t2.inventorytype = -1 LEFT JOIN item_list as t3 on t2.itemid = t3.item_id LIMIT ?,10 ',[startPage]);
            if(ret){
                result(res,splitPageSize(ret),null,true);
            };
        });
    },
    detail : function(req,res){
        var id = Number(req.params.id);
        co(function*(){
            var ret = yield sql('SELECT inventoryitemid,str,dex,`int`,luk,hp,mp,acc,jump,matk,mdef,watk,wdef,speed FROM inventoryequipment WHERE inventoryitemid = ?',[id]);
            if(ret.length){
                result(res,ret[0],null,true);
            }else{
                result(res,null,'未找到',false);
            }
        });
    },
    modify : function(req,res){
        var data =req.body;
        var sqlKey = [],sqlVal = [];
        for(var k in data){
            if(k != 'inventoryitemid'){
                sqlKey.push(k =='int' ? '`int` = ?' : k + '= ?' );
                sqlVal.push( data[k] );
            };
        };
        sqlVal.push(data.inventoryitemid);
        co(function*(){
            var ret = yield sql('UPDATE inventoryequipment SET '+ sqlKey.join(',') +' WHERE inventoryitemid = ? ',sqlVal);
            if( ret.fieldCount){
                result(res,null,ret.message,false)
            }else{
                result(res,null,'修改成功',true);
            }
        });
    },
    remove : function(req,res){
        var ids = req.body.ids;
         co(function*(){
            var ret = yield sql( 'DELETE item.*,equip.* FROM inventoryitems item, inventoryequipment equip WHERE item.inventoryitemid = equip.inventoryitemid and item.inventoryitemid in ( ? ) ',[ids] );
            if(ret.fieldCount){
                result(res,null,ret.message,false);
            }else{
                result(res,null,'删除成功',true);
            };
        });
    },
};
var Inventory = {
    search:function(req,res){
        var name = req.body.name;
        var type = req.body.type;
        var curPage = req.body.curPage
        var startPage = curPage > 0 ? (curPage - 1) * 10  : 0;
        co(function*(){
            var ret = yield sql('SELECT t1.name,t2.inventoryitemid, t2.position, t2.itemid, t2.quantity, t3.item_name, ( SELECT COUNT(*) FROM characters as t1, inventoryitems as t2 WHERE t1.name like "%'+name+'%" and t1.id = t2.characterid and t2.inventorytype = ? ) as pageSize FROM characters AS t1 INNER JOIN inventoryitems as t2 on t1.name like "%'+name+'%" and t1.id=t2.characterid and t2.inventorytype = ? LEFT JOIN item_list as t3 on t2.itemid = t3.item_id LIMIT ?,10 ',[type,type,startPage]);
            if(ret){
                result(res,splitPageSize(ret),null,true);
            };
        });
    },
    detail:function(req,res){
        var id = req.params.id;
        co(function*(){
            var ret = yield sql('SELECT inventoryitemid,quantity FROM inventoryitems WHERE inventoryitemid = ?',[id]);
            if(ret.length){
                result(res,ret[0],null,true);
            }else{
                result(res,null,'获取失败',true);
            }
        });
    },
    modify: function(req,res){
        var data = req.body;
        co(function*(){
            var ret = yield sql('UPDATE inventoryitems SET quantity = ? WHERE inventoryitemid = ?',[data.quantity,data.inventoryitemid]);
            if( ret.fieldCount){
                result(res,null,ret.message,false)
            }else{
                result(res,null,'修改成功',true);
            }
        })
    }
};
var Mall = {
    search: function(req,res){
        var used =req.body.used == '' ? 'valid' : req.body.used;
        var name = req.body.name;
        var startPage = req.body.curPage > 0 ? (req.body.curPage - 1 ) * 10 : 0;
        var item = req.body.item ? Number(req.body.item) : 'item';
        co(function*(){
            var ret = yield sql(`SELECT *, ( SELECT COUNT(*) FROM nxcode WHERE valid = ${used} AND (code like "%${name}%" OR user like "%${name}%") AND item = ${item} ) as pageSize FROM nxcode WHERE valid = ${used} AND (code like "%${name}%" OR user like "%${name}%") AND item = ${item} ORDER BY valid DESC LIMIT ?,10 `,[startPage]);
            if(ret){
                result(res,splitPageSize(ret),null,true)
            };
        });
    },
    used:function(req,res){
        var code = req.params.code;
        co(function*(){
            var ret = yield sql('UPDATE nxcode SET valid = IF(valid = 0 ,1 ,0), user=IF(valid = 0, "管理员" ,"" ) WHERE code = ?',[code]);
            if(ret.fieldCount){
                result(res,null,ret.message,false);
            }else{
                result(res,null,'',true);
            };
        });
    },
    remove:function(req,res){
        var codes = req.body.codes;
        co(function*(){
            var ret = yield sql('DELETE FROM nxcode WHERE code in (?)',[codes]);
            if(ret.fieldCount){
                result(res,null,ret.message,false);
            }else{
                result(res,null,null,true);
            };
        });
    },
    create : function(req,res){
        var data = req.body;
        var err = 0;
        co(function*(){
            for(var i = 0; i < data.quantity;i++){
                var code = getSalt(30);
                var ret = yield sql('INSERT INTO nxcode(code,valid,user,type,item) VALUES(?,?,?,?,?)',[getSalt(30), 1, null, data.type,data.item]);
                ret.fieldCount && err++;
            };
            if(err){
                result(res,null,err +'失败',false);
            }else{
                result(res,null,null,true);
            }
        });
    }
};
var Guild = {
    search : function(req,res){
        var name =req.body.name;
        var startPage = req.body.curPage > 0 ? (req.body.curPage - 1) * 10 : 0;
        co(function*(){
            var ret = yield sql( `SELECT t2.guildid, t1.name AS user, t2.name,t2.GP,t2.capacity,t2.notice,(SELECT COUNT(*) FROM characters AS t1 INNER JOIN guilds AS t2 on t2.name like "%${name}%" OR (t1.name like "%${name}%" AND t1.id = t2.leader )) AS pageSize FROM characters AS t1 INNER JOIN guilds AS t2 on t2.name like "%${name}%" OR (t1.name like "%${name}%" AND t1.id = t2.leader ) LIMIT 0,10;`,[startPage] );
            result(res,splitPageSize(ret),null,true);
        });
    },
    detail : function(req,res){
        var id = req.params.id;
        co(function*(){
            var ret = yield sql('SELECT guildid,name,GP,capacity,notice FROM guilds WHERE guildid = ?',[id]);
            if(ret.length){
                result(res,ret[0],null,true);
            }else{
                result(res,null,'未找到该家族',false);
            }
        });
    },

    modify : function(req,res){
        var guild = req.body;
        var sqlKey=[],sqlVal=[];
        for(var k in guild){
            if( k != 'guildid'){
                sqlKey.push( k + '= ?' );
                sqlVal.push(guild[k]);
            }
        };
        sqlVal.push(guild.guildid);
        co(function*(){
            var ret = yield sql('UPDATE guilds SET '+sqlKey.join(',')+' WHERE guildid = ?',sqlVal);
            if(ret.fieldCount){
                result(res,null,ret.message,false);
            }else{
                result(res,null,null,true);
            }
        });
    },
    remove : function(req,res){
        var ids = req.body.guilds;
        if(ids.length){
            co(function*(){
                var ret = yield sql('DELETE FROM guilds WHERE guildid in (?)',ids);
                if(ret.fieldCount){
                    result(res,null,ret.fieldCount + '条未删除',false);
                }else{
                    result(res,null,null,true);
                };
            });
        };
    }
};
var Shop = {
    npcList : function(req,res){
        co(function*(){
            var ret = yield sql('SELECT t1.shopid,t1.npcid,t2.npcname FROM shops AS t1 LEFT JOIN npc_list AS t2 on t1.npcid=t2.npcid');
            result(res,ret,null,true);
        });
    },
    removeNpc: function(req,res){
        var ids = req.body.ids;
        co(function*(){
            var ret = yield sql('DELETE FROM shops WHERE shopid in (?)',ids);
            if(ret.fieldCount){
                result(res,null,ret.fieldCount + '条未删除',false);
            }else{
                result(res,null,null,true);
            };
        });
    },
    removeShop:function(req,res){
        var ids = req.body.shops;
        co(function*(){
            var ret = yield sql('DELETE FROM shopitems WHERE shopitemid in ('+ ids.join(',') +')');
            if(ret.fieldCount){
                result(res,null,ret.fieldCount + '条未删除',false);
            }else{
                result(res,null,null,true);
            };
        });
    },
    list:function(req,res){
        var id =req.params.shopid;
        co(function*(){
            var ret = yield sql('SELECT t1.shopitemid,t1.itemid, t1.price,t1.position,t2.item_name, t2.item_desc FROM shopitems AS t1 JOIN item_list AS t2 ON t1.shopid = ? and t1.itemid = t2.item_id ORDER BY position ASC',id);
            result(res,ret,null,true);
        });
    },
    detail:function(req,res){
        var id = req.params.id;
        co(function*(){
            var ret = yield sql('SELECT shopitemid,itemid,price,position FROM shopitems WHERE shopitemid = ?',[id]);
            if(ret.length){
                result(res,ret[0],null,true);
            }else{
                result(res,null,'未找到',false);
            }
        });
    },
    modify:function(req,res){
        var data = req.body
        co(function*(){
            var ret = yield sql('UPDATE shopitems SET itemid = ?, price = ?, position = ? WHERE shopitemid = ?',[data.itemid,data.price,data.position,data.shopitemid]);
            if(ret.fieldCount){
                result(res,null,'修改失败',false);
            }else{
                result(res,null,null,true);
            };
        });
    }
};
var Mob = {
    mobList : function(req,res){
        co(function*(){
            var ret = yield sql('SELECT t1.monsterid AS id,t2.mob_name AS name FROM monsterdrops AS t1 LEFT JOIN mob_list AS t2 on t1.monsterid = t2.mob_id GROUP BY monsterid');
            result(res,ret,null,true);
        });
    },
    list:function(req,res){
        var id =req.params.mobid;
        co(function*(){
            var ret = yield sql('SELECT t1.monsterdropid AS id,t1.itemid,t1.chance, t2.item_name,t2.item_desc FROM monsterdrops AS t1 JOIN item_list AS t2 ON t1.monsterid = ? and t1.itemid = t2.item_id ORDER BY chance ASC',id);
            result(res,ret,null,true);
        });
    },
    removeMob: function(req,res){
        var ids = req.body.ids;
        co(function*(){
            var ret = yield sql('DELETE FROM monsterdrops WHERE monsterid in (?)',ids);
            if(ret.fieldCount){
                result(res,null,ret.fieldCount + '条未删除',false);
            }else{
                result(res,null,null,true);
            };
        });
    },
    removeShop:function(req,res){
        var ids = req.body.shops;
        co(function*(){
            var ret = yield sql('DELETE FROM monsterdrops WHERE monsterdropid in ('+ ids.join(',') +')');
            if(ret.fieldCount){
                result(res,null,ret.fieldCount + '条未删除',false);
            }else{
                result(res,null,null,true);
            };
        });
    },
    detail:function(req,res){
        var id = req.params.id;
        co(function*(){
            var ret = yield sql('SELECT monsterdropid AS id,itemid,chance FROM monsterdrops WHERE monsterdropid = ?',[id]);
            if(ret.length){
                result(res,ret[0],null,true);
            }else{
                result(res,null,'未找到',false);
            };
        });
    },
    modify:function(req,res){
        var data = req.body
        co(function*(){
            var ret = yield sql('UPDATE monsterdrops SET itemid = ?, chance = ? WHERE monsterdropid = ?',[data.itemid,data.chance,data.id]);
            if(ret.fieldCount){
                result(res,null,'修改失败',false);
            }else{
                result(res,null,null,true);
            };
        });
    }
};
var Skill = {
    rolelist : function(req, res){
        co(function*(){
            var ret = yield sql('SELECT id,name FROM characters');
            result(res,ret,null,true);
        });
    },
    skills : function(req,res){
        var data = req.body;
        var curPage = req.params.curPage ? (Number(req.params.curPage) -1) * 10 : 0;
        var type = null;
        var name = '%' + data.name + '%';
        switch(data.type){
            case 'id':
                type = 't1.skillid';
            break;
            case 'name':
                type = 't2.name';
            break;
            case 'job':
                type = 't2.jobname';
            break;
        };
        if(data.id){
            co(function*(){
                var ret = yield sql('SELECT t1.id,t1.skillid, t1.skilllevel as slevel,t1.masterlevel as mlevel,t2.name,t2.jobname, (SELECT count(*) FROM skills as t1 INNER JOIN skill_list as t2 on t1.characterid = ? and ?? like ? and t1.skillid = t2.skillid) AS pageSize FROM skills as t1 INNER JOIN skill_list as t2 on t1.characterid = ? and ?? like ? and t1.skillid = t2.skillid ORDER BY t1.skillid LIMIT ? ,10',[Number(data.id),type , name ,Number(data.id),type,name, curPage]);
                result(res,splitPageSize(ret),null,true);
            });
        }else{
            result(res,null,null,false);
        };
    }
}
var Library = {
    mobs : function(req,res){
        var curPage = req.params.curPage ? (Number(req.params.curPage) - 1) * 10 : 0;
        co(function*(){
            var ret = yield sql('SELECT mob_id as id, mob_name as name, (SELECT count(*) from mob_list) as pageSize from mob_list limit ? , 16', [curPage]);
            result(res,splitPageSize(ret),null,true);
        });
    }
};
var Test = {
    test : function(req,res){
        
    }
};
var File = {
    upload : function(req,res){
        console.log('start upload files');
        var form = new formidable.IncomingForm(); //初始化一个表单
        form.encoding = 'utf-8'; // 设置编码
        form.uploadDir = "./uploads"; // 设置上传路径
        form.keepExtensions = true;
        form.parse(req, function(err, fields, files) {
            console.log(files);
          res.json({err : err,fields : fields, files : files})
        });
    }
}
var Verification = {
    hasLogin : function(req,res,next){ //登录跳转首页
        // if(req.session.user){
        //     res.redirect('/');
        // }else{
        //     next();
        // };
        next();
    },
    verLogin : function(req,res,next){ // 未登录跳转登录页面
        // if(req.session.user){
        //     next();
        // }else{
        //     res.redirect('/login');
        // };
        next();
    },
    canUseAjax : function(req,res,next){// 判断是否允许使用ajax接口 ( 未登录不可以调用 )
        // if (req.session.user){
        //     next();
        // }else{
        //     result(res,null,'请先登录',false);
        // };
        next();
    }
};
loadMysql(); // 连接数据库

module.exports = {
    User:User,
    Role:Role,
    Equip:Equip,
    Inventory:Inventory,
    Mall:Mall,
    Guild:Guild,
    Shop:Shop,
    Mob:Mob,
    Skill:Skill,
    Library:Library,
    Pages:Pages,
    Ver:Verification,
    Test : Test,
    File : File
}

const express=require('express')
//引入上级目录下的mysql连接池对象
const pool=require('../pool.js')
const mysql=require('mysql')
//创建空路由器
var router=express.Router();
//添加路由
//1.用户注册
router.post('/register',(req,res)=>{
	//获取post请求的数据
	var obj=req.body
	//判断用户名是否为空
	var $uname=obj.uname
	var $upwd=obj.upwd
	var $email=obj.email
	var $phone=obj.phone
	if(!$uname){
		res.send({code:401,msg:'uname required'})
		//阻止执行
		return;
	}else if(!$upwd){
		res.send({code:402,msg:'upwd required'})
		return;
	}else if (!$email){
		res.send({code:403,msg:'email required'})
		return;
	}else if(!$phone){
		res.send({code:404,msg:'phone required'})
		return;
	}
		//数据库写入
		//执行sql语句，将注册的数据插入xz_user数据表中
	pool.query('insert into xz_user values(?,?,?,?,?,?,?,?)',[null,$uname,$upwd,$email,$phone,null,null,null],(err,result)=>{
		if(err)throw err
		//console.log(result)
		if(result.affectedRows > 0){
		res.send({code:200,msg:'register suc'})
		}
	})
})

	//console.log(obj)
	
//2.用户登录路由 获取请求的数据，验证数据为空
//401 'uname required’
//402 'upwd reuired'
router.post('/login',(req,res)=>{
	var obj=req.body
	//console.log(obj)
	var $uname=obj.uname
	var $upwd=obj.upwd
	if(!$uname){
		res.send({code:401,msg:'uname required'})
		return
	}else if(!$upwd){
		res.send({code:402,msg:'upwd require'})
		return
	}
	pool.query('select * from xz_user where uname=? AND upwd=?',[$uname,$upwd],(err,result)=>{
		if(err) throw err
		//console.log(result)
		if(result.length>0){
			res.send({code:200,msg:'login suc'})
		}else{
			res.send({code:301,msg:'login err'})
		}
	})
})


//3.用户检索
router.get('/detail',(req,res)=>{
	var obj=req.query
	var $uid=obj.uid
	//console.log(obj)
	if(!$uid){
		res.send({code:401,msg:'uid required'})
		return
	}
	pool.query('select * from xz_user where uid=?',[$uid],(err,result)=>{
		if(err)throw err
		if(result.length>0){
			res.send(result)
		}else{
			res.send({code:301,msg:'detail err'})
		}
	})
})

//4.更改用户
//获取数据，验证是否为空
router.post('/update',(req,res)=>{
	var obj=req.body
	var $uid=obj.uid
	var $email=obj.email
	var $phone=obj.phone
	var $gender=obj.gender
	var $user_name=obj.user_uname
	if(!$uid){
		res.send({code:401,msg:'uid required'})
		return
	}
	if(!$email){
		res.send({code:402,msg:'email required'})
		return
	}
	if(!$phone){
		res.send({code:403,msg:'phone required'})
		return
	}
	if(!$gender){
		res.send({code:404,msg:'gender required'})
		return
	}
	if(!$user_name){
		res.send({code:405,msg:'uname required'})
		return
	}
	pool.query('update xz_user set email=?,phone=?,gender=?,user_name=? where uid=?',[$email,$phone,$gender,$user_name,$uid],(err,result)=>{
	if(err)throw err
	if(result.affectedRows>0){
		res.send({code:200,msg:'update suc'})
	}else{
		res.send({code:301,msg:'update err'})
			}
	})
})
	
//5.用户列表
//get /list
router.get('/list',(req,res)=>{
	var obj=req.query;
	//如果页码和每页数量为空，设置默认值
	//将数据转为数组型
	var $pno=parseInt(obj.pno);
	var $count=parseInt(obj.count);
	if(!$pno){
		//如果页码为空 默认第一页
		$pno=1;
	}
	if(!$count){
		//如果每页数量为空，默认显示三条记录
		$count=3;
	}
	//计算开始查询start的值
	var start=($pno-1)*$count;
	//执行sql语句,返回商品列表数据
	pool.query('select * from xz_user limit ?,?',[start,$count],(err,result)=>{
		if(err)throw err;
		res.send(result);
	})
})

//6.删除列表
router.get('/delete',(req,res)=>{
	var obj=req.query
	$uid=obj.uid
	if(!$uid){
		res.send({code:401,msg:'delete suc'})
		return
	}
	pool.query('delete from xz_user where uid=?',[$uid],(err,result)=>{
		if(err)throw err
		console.log(result)
		if(result.affectedRows>0){
			res.send({code:200,msg:'delete suc'})
		}else{
			res.send({code:301,msg:'delete err'})
			}
	})
})

//导出路由器
module.exports=router
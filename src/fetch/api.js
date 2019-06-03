import axios from 'axios'
import {message} from "ant-design-vue"
var md5 = require('js-md5');
//axios 的默认配置修改
axios.defaults.timeout = 50000000000000;
axios.defaults.baseURL = 'http://119.28.57.96:8000';
// axios.defaults.headers.common['Referer'] = '';
axios.interceptors.request.use(function (config) {
    return config;
},function (error) {
   return Promise.reject(error);
})
//返回状态的拦截
axios.interceptors.response.use(function (response) {
  return response;
},function (error) {
  return Promise.reject(error);
})
//封装get
export function gAJAX(url,params,type) {
  return new Promise((resolve,reject)=>{
    axios.get(url,params,type)
       .then(response=>{
          if(response.data.result == 'true'){
            resolve(response.data);
          }else{
            message.error(response.data.errmsg);
            reject(response);
          }
       },err=>{
        reject();
        message.error('服务器异常！');
       })
       .catch(error=>{
        reject();
        console.log(error);
       })
  })
}
//封装post
export function pAJAX(url,params,config) {
  return new Promise((resolve,reject)=>{
    let data ;
    //序列化数据
    if(!config){
      data = new FormData();
      if(typeof params === 'object'){
        for( let key in params){
          if(params.hasOwnProperty(key) && params[key] !== undefined){
            data.append(key,params[key]);
            config = {
              headers:{'Content-Type':'multipart/form-data'}
            };
          }
        }
      }
    }else{
      data = params;
    }
    axios.post(url,data,config)
      .then(response=>{
        if(response.data.result == 'true'){
          resolve(response.data);
        }else{
          message.error(response.data.errmsg);
          reject(response);
        }
      },err=>{
        reject();
        console.log('当前无网络服务!');
      })
      .catch(error=>{
        reject();
        console.log(error);
      })
  })
}
export  default{
  // 注册账号
  register({user_name,password}){
    return gAJAX(`/api/addaccount?user_name=${user_name}&password=${md5(password)}`)
  },
  // 登陆账号
  login({user_name,password}){
    return gAJAX(`/api/login?user_name=${user_name}&password=${md5(password)}`)
  },
  // 修改密码
  modifypwd({user_name,password,new_password}){
    return gAJAX(`/api/modifypwd?user_name=${user_name}&password=${md5(password)}&new_password=${md5(password)}`)
  },
  // 删除用户
  deleUser({user_name,password}){
    return gAJAX(`/api/deleteuser?user_name=${user_name}&password=${md5(password)}`)
  },
  // 增加客户号
  addAcc({sysaccount,exchange,account_id,access_key,serect_key,basiccoin,reserved1,account}){
    return gAJAX(`/api/addapikey?sysaccount=${sysaccount}&exchange=${exchange}&account_id=${account_id}&access_key=${access_key}&serect_key=${serect_key}&basiccoin=${basiccoin}${reserved1 ? '&reserved1='+reserved1 : ''}&account=${account}`)
  },
  testapikey({sysaccount,exchange,account_id,access_key,serect_key,basiccoin,reserved1}){
    return gAJAX(`/api/testapikey?sysaccount=${sysaccount}&exchange=${exchange}&account_id=${account_id}&access_key=${access_key}&serect_key=${serect_key}&basiccoin=${basiccoin}&reserved1=${reserved1}`)
  },
  // 修改客户号
  modifyAcc({sysaccount,exchange,account_id,access_key,serect_key,basiccoin,reserved1,account}){
    return gAJAX(`/api/modifyapikey?sysaccount=${sysaccount}&exchange=${exchange}&account_id=${account_id}&access_key=${access_key}&serect_key=${serect_key}&basiccoin=${basiccoin}${reserved1 ? '&reserved1='+reserved1 : ''}&account=${account}`)
  },
  // 删除客户号
  deleAcc({sysaccount,exchange,account_id}){
    return gAJAX(`/api/deleteapikey?sysaccount=${sysaccount}&exchange=${exchange}&account_id=${account_id}`)
  },
  // 获取客户号
  gainAcc({sysaccount,exchange,account_id}){
    return gAJAX(`/api/getapikeys?sysaccount=${sysaccount}${exchange ? '&exchange='+exchange : ''}${account_id ? '&account_id='+account_id : ''}`)
  },
//  获取登录信息
  getOrderInfo (params){
    return gAJAX(`/api/getorder?orderid=${params.orderId}&exchange=${params.exchange}`);
  },
  // 新增时间加权委托
  newstone({exchange,accountid,symbol,price,price_range,rate,total_amount,side,min_time_interval}){
    return gAJAX(`/api/newstone?exchange=${exchange}&accountid=${accountid}&symbol=${symbol}&price=${price}&price_range=${price_range}&rate=${rate}&total_amount=${total_amount}&side=${side}&min_time_interval=${min_time_interval}`)
  },
  // 新增持续委托
  newsttwo({exchange,accountid,symbol,price,additional,total_amount,side,min_time_interval,every_amount}){
    return gAJAX(`/api/newsttwo?exchange=${exchange}&accountid=${accountid}&symbol=${symbol}&price=${price}&total_amount=${total_amount}&side=${side}&every_amount=${every_amount}&min_time_interval=${min_time_interval}${additional ?  '&additional='+additional : ''}`)
  },
  // 删除时间加权委托
  deltone({Accountid,Id,Exchange}){
    return gAJAX(`/api/deletestone?id=${Id}&exchange=${Exchange}&accountid=${Accountid}`);
  },
  // 删除持续委托
  deltow({Accountid,Id,Exchange}){
    return gAJAX(`/api/deletesttwo?id=${Id}&exchange=${Exchange}&accountid=${Accountid}`);
  },
  // 编辑时间加权委托
  updatestone({price,price_range,total_amount,rate,min_time_interval,id,exchange,accountid}){
    return gAJAX(`/api/updatestone?exchange=${exchange}&accountid=${accountid}&id=${id}&price=${price}&price_range=${price_range}&rate=${rate}&total_amount=${total_amount}&min_time_interval=${min_time_interval}`)
  },
  // 编辑持续委托
  updatesttwo({price,additional,total_amount,min_time_interval,every_amount,id,exchange,accountid}){
    return gAJAX(`/api/updatesttwo?exchange=${exchange}&accountid=${accountid}&id=${id}&price=${price}&total_amount=${total_amount}&every_amount=${every_amount}&min_time_interval=${min_time_interval}${additional ?  '&additional='+additional : ''}`)
  },
  // 查询所有时间加权委托
  querystone({sysaccount}){
    return gAJAX(`/api/querystone?sysaccount=${sysaccount}`);
  },
  // 查询所有持续委托
  querysttwo({sysaccount}){
    return gAJAX(`/api/querysttwo?sysaccount=${sysaccount}`);
  },
  getOrders({accountid,symbol,exchange, start = '1552015958636', end = String(Date.parse(new Date()))}){
    return gAJAX(`/api/getorders?accountid=${accountid}&exchange=${exchange}&start=${start}&end=${end}`)
  },
  // 获取交易市场 交易对
  getSymbols(exchange){
    return gAJAX(`/api/getsymbols?exchange=${exchange}`);
  }
}

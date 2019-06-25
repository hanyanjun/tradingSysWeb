
import Stomp from "stompjs";
import api from "../fetch/api";
import * as staticData from "../staticData/staticData";
let date = require("format-datetime");
export default {
    loginWS({state,dispatch},payload){ 
        return new Promise((resolve)=>{
            var ws = new WebSocket("ws://119.28.57.96:15674/ws");
            // var ws = new WebSocket("ws://101.81.113.223:15672/ws");
            var client = Stomp.over(ws);
            function on_connect (frame) {
                state.initInfo.client = client;
                resolve();
            };
            var on_error = function(info) {
                state.initStatus.msg = info.body ? info.body : info;
                state.initStatus.isOver  = false;
                // state.initStatus.isOver  = true;
                client.disconnect(); //连接出错断开连接
                console.log('断开')
                state.initInfo.client = '';
                state.marketInfo.subscribe = '';
            };
            //参数依次为：用户名，密码，连接后，出错，虚拟主机名
            client.connect("test", "test", on_connect, on_error, "/");
        })
    },
    // 订阅行情信息
    subscribeMarket({state,dispatch},payload){
        return new Promise((resolve,reject)=>{ 
         setTimeout(()=>{
            state.table1 = Object.assign([],[])
            state.table2 = Object.assign([],[])
            // 更换详情取消上次的订阅  并且重置买入卖出价格
            if(state.marketInfo.subscribe){
                // 得清除掉全局的订阅队列里的订阅
                let a = state.allSub.filter((v)=>{
                    return v.id != state.marketInfo.subscribe.id;
                })
                state.allSub = Object.assign([],a);
                state.marketInfo.subscribe.unsubscribe();
                state.marketInfo.subscribe = '';
                state.marketInfo.firstLoad = 0;
            }
            // 当只是取消行情订阅的时候  不进行下次行情订阅
            if(payload && payload.onlyCancle) {
                return
            }
            // 生成一次新的订阅
            let {exchangeName,market,currency} = state.marketInfo;
            let now =  Number(String(Date.parse(new Date())).substr(0,10));
            let end  = now + 2*60*60;
            // 下面交易所需要先发送订阅的通知
            if(market == 'bitfinex' || market == 'okex' || market == 'bitmesh' || market == 'kucoin' || market == 'gateio'){
                state.initInfo.client.send(`/exchange/MarketDepthSub/MarketDepthSub.${market}`,{},JSON.stringify({
                    Exchange : market , //	string `json:"exchange"`  //交易所
                    Symbol  : currency , //  string `json:"symbol"`     // 交易对, btcusdt, bccbtc......
                    Depth  : 30, //   int32  `json:"depth"`		//订阅深度
                    Begin	: now , //	int64 `json:"begin"` //订阅开始时间戳
                    End	: end //	int64 `json:"end"`   //订阅结束时间戳
                }));
            }
            // 下面交易所 交易对是BTCETH 形式
            if(market == 'bian' || market == 'huobi'){
                currency = currency.replace('-','');
            }
            state.marketInfo.subscribe =  state.initInfo.client.subscribe(`/exchange/${exchangeName}/${exchangeName}.${market}.${currency}`, onmessage, {});
            state.allSub.push(state.marketInfo.subscribe);
            state.allSub = Object.assign([],state.allSub);
            function onmessage (message) {
                state.marketInfo.table = JSON.parse(message.body);
                if(state.marketInfo.firstLoad == 1){
                    state.marketInfo.firstLoad = 2;
                }
                if(state.marketInfo.firstLoad == 0){
                    state.marketInfo.firstLoad = 1;
                }
                let a1 = [];
                let a2 = [];
                let {BidsPrice,BidsVolume,AsksPrice,AsksVolume} =JSON.parse(message.body);

                if(message.body){
                    let last = state.lastMarketTime;
                    let now = new Date().getTime();
                    if( last  == 0 || now - last > 2000){
                        state.lastMarketTime = now;
                        a1 = BidsPrice.map((v,i)=>{
                            return {index : i , price : v , sum : BidsVolume[i], key : i}
                        })
                        state.table1 = Object.assign([],a1);
                        a2 = AsksPrice.map((v,i)=>{
                            return {index : i , price : v , sum : AsksVolume[i], key : i}
                        })
                        state.table2 = Object.assign([],a2);
                    }
                }
            };
         },300)
        resolve()
        })
    },
    // 订阅用户的个人信息
    accInfo({state,dispatch},payload){
        if(state.accInfo.subscribe){
            // 得清除掉全局的订阅队列里的订阅
            let a = state.allSub.filter((v)=>{
                return v.id != state.accInfo.subscribe.id;
            })
            state.allSub = Object.assign([],a);
            state.accInfo.subscribe.unsubscribe();
            state.accInfo.subscribe = '';
        }
        const {exchangeName,market} = state.accInfo;
        state.accInfo.subscribe =  state.initInfo.client.subscribe(`/exchange/${exchangeName}/${exchangeName}.${market}.${payload}`, onmessage, {});
        state.allSub.push(state.accInfo.subscribe);
        state.allSub = Object.assign([],state.allSub);
         dispatch('orderreturn',payload);    
        function onmessage (message) {
            state.accInfo.id = payload;
            let info = JSON.parse(message.body);
            console.log('接收到账户信息为：',message.body);
            if(info.Data){
                let obj = {};
                info.Data.forEach((v,i)=>{
                    obj[v.Symbol.toUpperCase()] = info.Data[i];
                })
                info.info = obj;
                state.accInfo.info = JSON.parse(JSON.stringify(info));
                state.accInfo = Object.assign({},state.accInfo);
            }
        };
    },
    // 订阅买单卖单的消息
    orderreturn({state,dispatch},payload){
        if(!state.initInfo.client || state.orderMsgInfo.subscribe){
            return;
        }
        const {exchangeName} = state.orderMsgInfo;
        const {market} = state.marketInfo;
        // 清除掉 订单回报的订阅
        if(state.orderMsgInfo.subscribe){
            // 得清除掉全局的订阅队列里的订阅
            let a = state.allSub.filter((v)=>{
                return v.id != state.orderMsgInfo.subscribe.id;
            })
            state.allSub = Object.assign([],a);
            state.orderMsgInfo.subscribe.unsubscribe();
            state.orderMsgInfo.subscribe = '';
            state.orderMsgInfo.arr = [];
        }
        state.orderMsgInfo.subscribe = state.initInfo.client.subscribe(`/exchange/${exchangeName}/${exchangeName}.${market}.${payload}`, 
        function(message){
            console.log('收到买单卖单信息为： ');
            let info = JSON.parse(message.body).Data;
            info = JSON.parse(JSON.stringify(info));
            console.log(info);
            if(info.hasOwnProperty('Status')){
                let arr = JSON.parse(JSON.stringify(state.orderMsgInfo.arr));
                info.index = info.Orderid;
                info.key = info.Orderid;
                if(String(info.Ts).length < 13){
                    info.Ts = Number(info.Ts + '000');
                }
                let arr1 = [];
                arr1 = arr.filter((v)=>{
                    return v.Status != 2 && v.Orderid != info.Orderid;
                })
                arr1.unshift(info);
                state.orderMsgInfo.arr = arr1;
            }
            state.orderMsgInfo = Object.assign({},state.orderMsgInfo);
        }, {})
        state.allSub.push(state.orderMsgInfo.subscribe);
        state.allSub = Object.assign([],state.allSub);
    },
    // 发起买单操作
    orderreq({state,dispatch},payload){
        return new Promise((resolve,reject)=>{
            let {client} = state.initInfo;
            if(!client){
                reject();
                return;
            }
            let {market,currency} = state.marketInfo;
            let obj = Object.assign({},payload);
            // 为发送消息体增加字段
            // 交易市场  货币对  ws  时间戳 用户操作还是委托 
            obj.Source = `${market}-${currency.replace('-','.')}-ws-${Date.parse(new Date())}-user`;
            obj.symbol = currency;
            if(market == 'bian' || market == 'huobi'){
                currency = currency.replace('-','');
            }
            let options = state.selectData.marketOrderType;
            let obj1 = options[market][obj.type1];
            let info = {...obj,...obj1};
            console.log(info);
            client.send(`/exchange/orderreq/orderreq.${market}.${currency}`,{},JSON.stringify({
                MsgType : 1,
                Data : info
            }));
        });
    },
    // 发起撤单操作
    orderCancle({state,dispatch},payload){
        return new Promise((resolve,reject)=>{
            let {client} = state.initInfo;
            if(!client){
                reject();
                return;
            }
            let {market,currency} = state.marketInfo;
            let obj = Object.assign({},payload);
            // 为发送消息体增加字段
            // 交易市场  货币对  ws  时间戳 用户操作还是委托 
            obj.Source = `${market}-${currency.replace('-','.')}-ws-${Date.parse(new Date())}-user`;
            obj.symbol = currency;
            if(market == 'bian' || market == 'huobi'){
                currency = currency.replace('-','');
            }
            client.send(`/exchange/orderreq/orderreq.${market}.${currency}`,{},JSON.stringify({
                MsgType : 2,
                Data : obj
            }));
        });
    },
    init({state,dispatch},payload){
        return new Promise((resolve)=>{
            state.initStatus.msg = '连接中...';
            if(state.initInfo.client){
                state.initInfo.client.disconnect();
            }
            resolve();
            // dispatch('loginWS');
        })
        // dispatch('gainAllAcc');
        // state.initStatus.isOver  = true;
    },
    clearSub({state},payload){
        return new Promise((resolve)=>{
            let a = state.allSub;
            if(a.length > 0){
                a.forEach((v)=>{
                    v.unsubscribe();
                })
                state.allSub = Object.assign([],[]);
                console.log('%c 清除订阅........','color:white;background:#FF6666');
            }
            state.marketInfo.subscribe = '';  //清空行情订阅
            state.accInfo.subscribe  = ''; //清空个人信息订阅
            state.orderMsgInfo.subscribe = ''; //清空订单回报订阅
            resolve();
        })
    },
    // 获取所有账户 并存储
    gainAllAccount({state},payload){
        return new Promise((resolve)=>{
            api.gainAcc({sysaccount : window.sessionStorage['user_name']}).then(obj=>{
                if(obj.data){
                    let info  = {};
                    let arr = [];
                    let arr1 = [];
                    let index = {};
                    let filter = obj.data.filter((v)=>{
                        return v.isavailable  == 1;
                    })
                    filter.forEach((v)=>{
                        if(!info[v.exchange]){
                            info[v.exchange] = [];
                        }
                        info[v.exchange].push({label : v.account , value : v.account_id});
                        index[v.exchange+v.account_id] = v.account;
                        index[v.exchange+v.account] = v.account_id;
                        
                    })
                    filter.forEach((v,i)=>{
                        arr.push({...v,key : i , str : v.exchange + '_' + v.account_id});
                        arr1.push(v.exchange+'_'+v.account_id);
                    })
                    state.initInfo.allAcc = Object.assign([],arr);
                    state.initInfo.allAccOptions = Object.assign([],arr1);
                    state.initInfo.info = Object.assign({},info);
                    state.initInfo.index = Object.assign({},index);
                    state.initInfo = Object.assign({},state.initInfo);
                    console.log(state.initInfo)
                }else{
                    state.initInfo.allAcc = Object.assign([],[]);
                    state.initInfo.allAccOptions = Object.assign([],[]);
                    state.initInfo.info = Object.assign({},{});
                    state.initInfo.index = Object.assign({},{});
                    state.initInfo = Object.assign({},state.initInfo);
                }
                resolve();
            })

        })
    },
    // 获取所有交易所下对应的货币对
    gainAllSymbol({state,dispatch}){
        let arr = staticData.d1;
        arr.forEach((v)=>{
            dispatch('gainOneSymbol',v.value);
        })
    },
    gainOneSymbol({state,dispatch},payload){
        api.getSymbols(payload).then(obj=>{
            // console.log(obj);
            let str = obj.data;
            str = str.replace(/({|})/g,'');
            let arr = str.split(',');
            let arr1 = arr.map((v)=>{
                return v.toUpperCase();
            })
            state.allSymbol[payload] = arr1;
            state.allSymbol = Object.assign({},state.allSymbol);
        })
    },
    gainAllAcc({state,dispatch},payload){
        return new Promise((resolve,reject)=>{
            console.log(state.initInfo.allAcc)
            state.initInfo.allAcc.forEach((v,i)=>{
                let subscribe =  state.initInfo.client.subscribe(`/exchange/balance/balance.${v.exchange}.${v.account_id}`, onmessage, {});                  
                state.allSub.push(subscribe);
                state.allSub = Object.assign([],state.allSub);
                function onmessage (message) {
                    let info = JSON.parse(message.body);
                    console.log(message)
                    console.log('接收到账户信息为：',message.body);
                    // let info ={ Data :[
                    //     {Symbol : 'BTC' , Available : '1' , OnOrders : '2', BtcValue : 1},
                    //     {Symbol : 'BTC1' , Available : '1' , OnOrders : '2', BtcValue : 0.001},
                    //     {Symbol : 'BTC2' , Available : '1' , OnOrders : '2', BtcValue : 0.001},
                    //     {Symbol : 'BTC3' , Available : '1' , OnOrders : '2', BtcValue : 3},
                    //     {Symbol : 'BTC3' , Available : '1' , OnOrders : '2', BtcValue : 9.888888},
                    //     {Symbol : 'BTC3' , Available : '1' , OnOrders : '2', BtcValue : 10.444444},
                    //     {Symbol : 'BTC3' , Available : '1' , OnOrders : '2', BtcValue : 6.77777183789},
                    //     {Symbol : 'BTC3' , Available : '1' , OnOrders : '2', BtcValue : 6.7777183789},
                    //     {Symbol : 'BTC3' , Available : '1' , OnOrders : '2', BtcValue : 6.7777713789},
                    //     {Symbol : 'BTC3' , Available : '1' , OnOrders : '2', BtcValue : 6.7777183789},
                    //     {Symbol : 'BTC3' , Available : '1' , OnOrders : '2', BtcValue : 6.7777718379},
                    //     {Symbol : 'BTC3' , Available : '1' , OnOrders : '2', BtcValue : 6.7777718789},
                    //     {Symbol : 'BTC3' , Available : '1' , OnOrders : '2', BtcValue : 7.38742897},
                    //     {Symbol : 'BTC3' , Available : '1' , OnOrders : '2', BtcValue : 7.2849284},
                    //     {Symbol : 'BTC3' , Available : '1' , OnOrders : '2', BtcValue : 8.9824923084},
                    //     {Symbol : 'BTC4' , Available : '1' , OnOrders : '2', BtcValue : 4}]};
                    if(info.Data){
                        let a1 = info.Data.filter((v)=>{
                            return v.BtcValue >= 0.001;
                        })
                        let a = JSON.parse(JSON.stringify(a1));
                        let len = a.length;
                        // 按照btcvalue进行排序
                        for(let i = 0 ; i < len -1 ; i++){
                            for(let j = i +1; j < len ; j++){
                                console.log(111);
                            if(Number(a[j].BtcValue) > Number(a[i].BtcValue)){
                                let tmp = a[j];  
                                a[j] = a[i];
                                a[i] = tmp;
                                a[j].key = j;
                                a[i].key = i;
                            }
                            }
                        };
                        let o = {
                            len : a.length,
                            Data : a,
                            BtcTotal : info.BtcTotal
                        };
                        console.log('排序后的数据为........');
                        console.log(a);
                        state.allAccInfo[v.exchange+'_'+v.account_id] = o;
                        state.allAccInfo = Object.assign({},state.allAccInfo);
                    }else{
                        state.allAccInfo[v.exchange+'_'+v.account_id] = {len : 0 , Data : [] , BtcTotal : 0};
                        state.allAccInfo = Object.assign({},state.allAccInfo);
                    }
                };
            })
        })
    }
}




// {"BtcTotal":0.41558326262000006,"Data":[{"Symbol":"btc","Available":"0.021742","OnOrders":"0.000880","BtcValue":"0.022622"},{"Symbol":"eth","Available":"11.425280","OnOrders":"","BtcValue":"0.392961"}],"Accountid":"5426748","Time":1553738742916859000}
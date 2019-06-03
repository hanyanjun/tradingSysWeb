import Vue from 'vue'
import Vuex from 'vuex'
import getters from "./rootGetters"
import mutations from "./rootMutations"
import actions from "./rootActions"
import selectData from "./modules/selectData"

Vue.use(Vuex)

const state = {
  initStatus: {
    isOver: false,
    msg: 'loading'
  },  //用来做信息初始化判断
  allSub : [],  //所有的订阅数组
  accName : '',  //用户的账户名
  allSymbol : {},  //所有交易市场对应的货币对的信息
  initInfo: {
    client: '',
    allAcc : [],
    info : {},
    allAccOptions : []
  },  //一些基础的信息 包含账户信息  socket链接 
  allAccInfo :{ 
    // "bian_28792967": { "BtcTotal": 0.00018365169375, "Data": [ { "Symbol": "GAS", "Available": "0.380231", "OnOrders": "0.000000", "BtcValue": "0.000184" }, { "Symbol": "USDT", "Available": "0.022164", "OnOrders": "0.000000", "BtcValue": "0.000000" } ], "Accountid": "28792967", "Time": 1556503764141022700 }, 
    // "bian_36541710": { "BtcTotal": 0, "Data": null, "Accountid": "36541710", "Time": 1556503764312907800 } 
  },  //每个账户对应的资产明细的数组
  marketInfo: {
    exchangeName: 'quote',
    market: 'bian',
    //  currency : 'ethbtc',
    currency: 'ETH-BTC',
    firstLoad: false, table: '',
    subscribe: '', //只允许一次订阅
  },
  table1 : [],  //现货交易中买单的列表
  lastMarketTime : 0, //每次行情推送记录时间  用来做推送间隔时间判断
  table2 : [],  //现货交易中卖单的列表
  // 根据客户号查询 持仓数的订阅
  accInfo: {
    subscribe: '',
    info: '',
    // info1 : '{"BtcTotal":0.43939327535999995,"Data":[{"Symbol":"btc","Available":"0.023738","OnOrders":"0.000600","BtcValue":"0.024338"},{"Symbol":"eth","Available":"12.075380","OnOrders":"","BtcValue":"0.415055"}],"Accountid":"5426748","Time":1553071118189651200}',
    exchangeName: 'balance',
    market: '',
    id: ''
  },
  // 历史委托订单
  historyTask: [
    // { "taskId": 4, "market": "huobi", "currency": "ETH-BTC", "num": "5426748", "type": "buy", "onePrice": "1", "oneSum": "10", "allSum": "100", "percent": "", "status": 3, "otherSum": "100", "index": "4", "key": "4", date : '2018-11-26' } ,
    // { "taskId": 2, "market": "huobi", "currency": "ETH-BTC", "num": "5426748", "type": "buy", "onePrice": "1", "oneSum": "10", "allSum": "100", "percent": "", "status": 1, "otherSum": "0", "index": "2", "key": "2" , date : '2019-02-26'},
    // { "taskId": 0, "market": "huobi", "currency": "ETH-BTC", "num": "5426748", "type": "buy", "onePrice": "1", "oneSum": "10", "allSum": "100", "percent": "", "status": 0, "otherSum": "100", "index": "0", "key": "0" , date : '2019-03-26' }, 
    // { "taskId": 1, "market": "huobi", "currency": "ETH-BTC", "num": "5426748", "type": "buy", "onePrice": "1", "oneSum": "10", "allSum": "100", "percent": "", "status": 1, "otherSum": "100", "index": "1", "key": "1" , date : '2019-01-26'}, 
    // { "taskId": 3, "market": "huobi", "currency": "ETH-BTC", "num": "5426748", "type": "buy", "onePrice": "1", "oneSum": "10", "allSum": "100", "percent": "", "status": 1, "otherSum": "100", "index": "3", "key": "3", date : '2018-03-26' }, 
  ],
  orderMsgInfo: {
    subscribe: '',
    info: '',
    arr: [],
    exchangeName: 'orderrsp'
  }
}
export default new Vuex.Store({
  state, mutations, getters, actions,
  modules: {
    selectData,
  }
})






// {"taskId":1,"huobi.ETHBTC":{"allTask":{"0":{"taskId":0,"time":1553657594000,"date":"2019-03-27","market":"huobi","currency":"ETH-BTC","num":"5426748","type":"buy","onePrice":"0.035","oneSum":"0.0001","allSum":"0.001","percent":"","status":2,"otherSum":0}},"allOrder":[{"Id":0,"Account":"","Accountid":"5426748","Orderid":0,"Exchange":"huobi","Amount":"0.0001","Price":"0.034297","Symbol":"ethbtc","Source":"huobi-ETH.BTC-ws-1553657594000-auto","Type":"buy-market","Ts":1553657594,"Cancelflag":0,"Reserved1":"","Reserved2":"","Reserved3":"","Reserved4":"","Dealamount":0,"Dealcash":0,"Dealfee":0,"Feesymbol":"","Dealfee2":0,"Fees2ymbol":"","Status":2,"ErrorMsg":"","index":"huobi-ETH.BTC-ws-1553657594000-auto","key":"huobi-ETH.BTC-ws-1553657594000-auto"},{"Id":0,"Account":"","Accountid":"5426748","Orderid":0,"Exchange":"huobi","Amount":"0.0001","Price":"0.034298","Symbol":"ethbtc","Source":"huobi-ETH.BTC-ws-1553657595000-auto","Type":"buy-market","Ts":1553657595,"Cancelflag":0,"Reserved1":"","Reserved2":"","Reserved3":"","Reserved4":"","Dealamount":0,"Dealcash":0,"Dealfee":0,"Feesymbol":"","Dealfee2":0,"Fees2ymbol":"","Status":2,"ErrorMsg":"","index":"huobi-ETH.BTC-ws-1553657595000-auto","key":"huobi-ETH.BTC-ws-1553657595000-auto"},{"Id":0,"Account":"","Accountid":"5426748","Orderid":0,"Exchange":"huobi","Amount":"0.0001","Price":"0.034298","Symbol":"ethbtc","Source":"huobi-ETH.BTC-ws-1553657597000-auto","Type":"buy-market","Ts":1553657596,"Cancelflag":0,"Reserved1":"","Reserved2":"","Reserved3":"","Reserved4":"","Dealamount":0,"Dealcash":0,"Dealfee":0,"Feesymbol":"","Dealfee2":0,"Fees2ymbol":"","Status":2,"ErrorMsg":"","index":"huobi-ETH.BTC-ws-1553657597000-auto","key":"huobi-ETH.BTC-ws-1553657597000-auto"},{"Id":0,"Account":"","Accountid":"5426748","Orderid":0,"Exchange":"huobi","Amount":"0.0001","Price":"0.034298","Symbol":"ethbtc","Source":"huobi-ETH.BTC-ws-1553657598000-auto","Type":"buy-market","Ts":1553657597,"Cancelflag":0,"Reserved1":"","Reserved2":"","Reserved3":"","Reserved4":"","Dealamount":0,"Dealcash":0,"Dealfee":0,"Feesymbol":"","Dealfee2":0,"Fees2ymbol":"","Status":2,"ErrorMsg":"","index":"huobi-ETH.BTC-ws-1553657598000-auto","key":"huobi-ETH.BTC-ws-1553657598000-auto"},{"Id":0,"Account":"","Accountid":"5426748","Orderid":0,"Exchange":"huobi","Amount":"0.0001","Price":"0.034298","Symbol":"ethbtc","Source":"huobi-ETH.BTC-ws-1553657599000-auto","Type":"buy-market","Ts":1553657598,"Cancelflag":0,"Reserved1":"","Reserved2":"","Reserved3":"","Reserved4":"","Dealamount":0,"Dealcash":0,"Dealfee":0,"Feesymbol":"","Dealfee2":0,"Fees2ymbol":"","Status":2,"ErrorMsg":"","index":"huobi-ETH.BTC-ws-1553657599000-auto","key":"huobi-ETH.BTC-ws-1553657599000-auto"},{"Id":0,"Account":"","Accountid":"5426748","Orderid":0,"Exchange":"huobi","Amount":"0.0001","Price":"0.034298","Symbol":"ethbtc","Source":"huobi-ETH.BTC-ws-1553657600000-auto","Type":"buy-market","Ts":1553657599,"Cancelflag":0,"Reserved1":"","Reserved2":"","Reserved3":"","Reserved4":"","Dealamount":0,"Dealcash":0,"Dealfee":0,"Feesymbol":"","Dealfee2":0,"Fees2ymbol":"","Status":2,"ErrorMsg":"","index":"huobi-ETH.BTC-ws-1553657600000-auto","key":"huobi-ETH.BTC-ws-1553657600000-auto"},{"Id":0,"Account":"","Accountid":"5426748","Orderid":0,"Exchange":"huobi","Amount":"0.0001","Price":"0.034298","Symbol":"ethbtc","Source":"huobi-ETH.BTC-ws-1553657601000-auto","Type":"buy-market","Ts":1553657600,"Cancelflag":0,"Reserved1":"","Reserved2":"","Reserved3":"","Reserved4":"","Dealamount":0,"Dealcash":0,"Dealfee":0,"Feesymbol":"","Dealfee2":0,"Fees2ymbol":"","Status":2,"ErrorMsg":"","index":"huobi-ETH.BTC-ws-1553657601000-auto","key":"huobi-ETH.BTC-ws-1553657601000-auto"},{"Id":0,"Account":"","Accountid":"5426748","Orderid":0,"Exchange":"huobi","Amount":"0.0001","Price":"0.034298","Symbol":"ethbtc","Source":"huobi-ETH.BTC-ws-1553657602000-auto","Type":"buy-market","Ts":1553657601,"Cancelflag":0,"Reserved1":"","Reserved2":"","Reserved3":"","Reserved4":"","Dealamount":0,"Dealcash":0,"Dealfee":0,"Feesymbol":"","Dealfee2":0,"Fees2ymbol":"","Status":2,"ErrorMsg":"","index":"huobi-ETH.BTC-ws-1553657602000-auto","key":"huobi-ETH.BTC-ws-1553657602000-auto"},{"Id":0,"Account":"","Accountid":"5426748","Orderid":0,"Exchange":"huobi","Amount":"0.0001","Price":"0.034298","Symbol":"ethbtc","Source":"huobi-ETH.BTC-ws-1553657602000-auto","Type":"buy-market","Ts":1553657602,"Cancelflag":0,"Reserved1":"","Reserved2":"","Reserved3":"","Reserved4":"","Dealamount":0,"Dealcash":0,"Dealfee":0,"Feesymbol":"","Dealfee2":0,"Fees2ymbol":"","Status":2,"ErrorMsg":"","index":"huobi-ETH.BTC-ws-1553657602000-auto","key":"huobi-ETH.BTC-ws-1553657602000-auto"},{"Id":0,"Account":"","Accountid":"5426748","Orderid":0,"Exchange":"huobi","Amount":"0.0001","Price":"0.034298","Symbol":"ethbtc","Source":"huobi-ETH.BTC-ws-1553657603000-auto","Type":"buy-market","Ts":1553657602,"Cancelflag":0,"Reserved1":"","Reserved2":"","Reserved3":"","Reserved4":"","Dealamount":0,"Dealcash":0,"Dealfee":0,"Feesymbol":"","Dealfee2":0,"Fees2ymbol":"","Status":2,"ErrorMsg":"","index":"huobi-ETH.BTC-ws-1553657603000-auto","key":"huobi-ETH.BTC-ws-1553657603000-auto"}],"orderSub":{"id":"sub-0"},"info":{"Symbol":"ETHBTC","Ts":1553657602014,"Exchange":"huobi","TableName":"ETHBTC","BidsPrice":[0.034296,0.034288,0.034287,0.034286,0.034285,0.034283,0.034277,0.034275,0.03427,0.034268,0.034267,0.034266,0.034265,0.034264,0.034263,0.034262,0.034261,0.034259,0.034257,0.034255,0.034254,0.034253,0.03425,0.034249,0.034248,0.034247,0.034246,0.034245,0.034244,0.034242],"BidsVolume":[152.6495,1.6019,2.6479,5.0014,4.3308,9,4.3746,4.0011,8.7751,15.3625,1.9339,1.52,2.48,2.48,3.9442,0.0011,4.3744,12.7172,24.7421,0.0012,16.2705,23.3355,3.6705,25.175,3.22,7.0725,0.0012,1.32,3.1015,0.0012],"AsksPrice":[0.034298,0.034299,0.034301,0.034303,0.034304,0.034305,0.034306,0.034307,0.034308,0.034309,0.03431,0.034311,0.034312,0.034313,0.034314,0.034315,0.034316,0.034319,0.03432,0.034321,0.034322,0.034323,0.034327,0.034328,0.034332,0.034333,0.034335,0.034336,0.034338,0.034341],"AsksVolume":[6.0471,2.9163,10.3748,7.6227,6.632,5.8321,4.6137,2.8975,8.7216,4.2665,1.321,35.6546,5.4582,20.4182,23.3355,29.4184,17.867,4,0.0012,39.3815,9.299,0.0011,0.001,15,1.0048,0.0011,10.2309,75.4949,1.0822,8.8463]},"subscribe":{"id":"sub-1"},"market":"huobi","currency":"ETHBTC","exchangeName":"quote"}}



import api from "../../fetch/api";
import d from "../../pages/charts/2";
import * as utils from "../../utils/utils";
const fund = {
  state: {
    allFund: {
      fundOptions: [],
      accOptions: {},
      allInfo: {}
    },
  },
  actions: {
    gainFundChartData({
      state,
      rootState,
      dispatch
    }, payload) {
      let {
        exchange,
        account_id,
        beginday,
        endday
      } = payload;
      return new Promise((resolve,reject)=>{
        api.gainTotalBalance(payload).then(obj => {
          if(obj.data){
          let arr = Object.assign([], obj.data);
          // let arr = JSON.parse(JSON.stringify(d.data2));
          arr = arr.map((v, i) => {
            if (v.endbalance && v.endbalance != '{}') {
              arr[i].endbalance = JSON.parse(arr[i].endbalance);
            }else{
                arr[i].endbalance = "";
            }
            if (v.beginbalance && v.beginbalance != '{}') { 
              arr[i].beginbalance = JSON.parse(arr[i].beginbalance);
            }else{
                arr[i].beginbalance = "";
            }
            return arr[i];
          })
          if (payload.exchange == 'fundaccount') {
            dispatch('detail2', arr).then(obj=>{
                resolve(obj);
            })
          } else {
            dispatch('detail1', arr).then(obj=>{
                resolve(obj)
            })
          }
          }else{
              resolve({});
          }
        })

      })
    },
    gainAllFund({
      state,
      dispatch,
      rootState
    }, payload) {
      let accName = rootState.accName;
      let allIndex = rootState.initInfo.index;
      let result = {
        fundOptions: [],
        accOptions: {},
        allInfo: {}
      }
      // allFund  : fundOptions accOptions allInfo
      api.gainFundAcc(accName).then(obj => {
        // console.log(obj.data);
        if (obj.data && obj.data.length > 0) {
          let data = Object.assign([], obj.data);
          data = data.filter((v) => {
            return v.isavailable
          })
          let fundOptions = [];
          let accOptions = {};
          let allInfo = {};
          data.forEach((v, i) => {
            fundOptions.push({
              label: v.name,
              value: v.accountid,
              exchange: v.exchange
            });
            if (!accOptions[v.accountid]) {
              accOptions[v.accountid] = [];
            }
            allInfo[v.accountid] = v;
            data[i].allExchange = [];
            data[i].allAcc = {};
            data[i].key = i;
            let arr = v.include_account.replace(/({|})/g, '').split(',');
            arr.forEach((v1) => {
              let a1 = v1.split(":");
              if (data[i].allExchange.indexOf(a1[0]) == -1) {
                data[i].allExchange.push(a1[0]);
              }
              if (!data[i].allAcc.hasOwnProperty(a1[0])) {
                data[i].allAcc[a1[0]] = [];
              }
              data[i].allAcc[a1[0]].push(a1[1]);
              accOptions[v.accountid].push({
                value: a1[1],
                exchange: a1[0],
                label: allIndex[a1[0] + a1[1]]
              });
            })

          })
          result = Object.assign({}, {
            fundOptions,
            accOptions,
            allInfo
          });
          state.allFund = Object.assign({}, result);
          // console.log(result);
        }
      })
    },

    detail1({
      state
    }, payload) {
        return new Promise((resolve)=>{
            
      let arr = payload;
      // 单个账户的货币对的股权配比
      let obj = {};
      let date = [];
      arr.forEach((v, i) => {
        let arr = [];
        let btc0 = 0;
        let usdt0 = 0;
        let all0 = 0;
        let d1 = String(v.Day + " 08");
        let d2 = String(v.Day + " 20");
        if (i == 0) {
          btc0 = Number(v.beginbasicvalue) || 0;
          usdt0 = Number(v.beginbasicvalue2) || 0;
          all0 = Number(v.beginprice) || 0;
        }
        date.push(d1, d2);
        if (!obj[d1] && v.beginbalance && v.beginbalance != '{}') {
          obj[d1] = {
            total: 0,
            name: [],
            part: {},
            btcValue: v.beginbasicvalue,
            usdtValue: v.beginbasicvalue2,
            allPrice: v.beginprice
          };
        }
        if (!obj[d2] && v.endbalance && v.endbalance != '{}') {
          obj[d2] = {
            total: 0,
            name: [],
            part: {},
            btcValue: v.endbasicvalue,
            usdtValue: v.endbasicvalue2,
            allPrice: v.endprice
          };
        }
        // obj[d1].btcValue = v.beginbasicvalue ?  this.$utils.div(v.beginbasicvalue,btc0)  : 0;
        // obj[d1].usdtValue = v.beginbasicvalue2 ? this.$utils.div(v.beginbasicvalue2,usdt0) : 0;
        // obj[d1].allPrice =  v.beginprice ? this.$utils.div(v.beginprice,all0) :  0;
        // obj[d2].btcValue = v.endbasicvalue ? this.$utils.div(v.endbasicvalue,btc0)  : 0;
        // obj[d2].usdtValue =  v.endbasicvalue2 ? this.$utils.div(v.endbasicvalue2,usdt0) : 0;
        // obj[d2].allPrice = v.endprice ? this.$utils.div(v.endprice,all0) : 0;
          console.log(v);
        if (v.beginbalance && v.beginbalance != '{}') {
          v.beginbalance.forEach((v1, i1) => {
            let total = utils.add(
              Number(v1.Available || 0),
              Number(v1.OnOrders || 0)
            );
            if (obj[d1].name.indexOf(v1.Symbol) == -1) {
              obj[d1].name.push(v1.Symbol);
            }
            if (!obj[d1].part[v1.Symbol]) {
              obj[d1].part[v1.Symbol] = {
                total,
                part: [v1],
                btcTotal :  Number(v1.BtcValue || 0),
                usdtTotal : Number(v1.UsdtValue || 0)
              };
            } else {
              let t = obj[d1].part[v1.Symbol].total;
              let total2 = utils.add(total, t);
              let total3 = utils.add(obj[d1].part[v1.Symbol].btcTotal,Number(v1.BtcValue || 0))
              let total4 = utils.add(obj[d1].part[v1.Symbol].UsdtValue,Number(v1.UsdtValue || 0))
              obj[d1].part[v1.Symbol] = {
                total: total2,
                part: [...obj[d1].part[v1.Symbol].part, v1],
                btcTotal : total3,
                usdtTotal : total4
              };
            }
            obj[d1].total += total;
          });
        }
        if (v.endbalance &&  v.endbalance != '{}') {
          v.endbalance.forEach((v1, i1) => {
            let total = utils.add(
              Number(v1.Available || 0),
              Number(v1.OnOrders || 0)
            );
            if (obj[d2].name.indexOf(v1.Symbol) == -1) {
              obj[d2].name.push(v1.Symbol);
            }
            if (!obj[d2].part[v1.Symbol]) {
              obj[d2].part[v1.Symbol] = {
                total,
                part: [v1],
                btcTotal :  Number(v1.BtcValue || 0),
                usdtTotal : Number(v1.UsdtValue || 0)
              };
            } else {
              let t = obj[d1].part[v1.Symbol].total;
              let total2 = utils.add(total, t);
              let total3 = utils.add(obj[d1].part[v1.Symbol].btcTotal,Number(v1.BtcValue || 0))
              let total4 = utils.add(obj[d1].part[v1.Symbol].UsdtValue,Number(v1.UsdtValue || 0))
              obj[d2].part[v1.Symbol] = {
                total: total2,
                part: [...obj[d2].part[v1.Symbol].part, v1],
                btcTotal : total3,
                usdtTotal : total4
              };
            }
            obj[d2].total += total;
          });
        }
      });
      resolve(obj)

        })
    },
    detail2({
      state
    }, payload) {
        return new Promise((resolve)=>{
            let arr = payload;
            // 单个账户的货币对的股权配比
            let obj = {};
            let date = [];
            arr.forEach((v, i) => {
              let arr = [];
              let btc0 = 0;
              let usdt0 = 0;
              let all0 = 0;
              let d1 = String(v.Day + " 08");
              let d2 = String(v.Day + " 20");
              date.push(d1, d2);
              if (i == 0) {
                btc0 = Number(v.beginbasicvalue) || 0;
                usdt0 = Number(v.beginbasicvalue2) || 0;
                all0 = Number(v.beginprice) || 0;
              }
              if (!obj[d1] && v.beginbalance && v.beginbalance != '{}') {
                obj[d1] = {
                  total: 0,
                  name: [],
                  part: {},
                  btcValue: v.beginbasicvalue,
                  usdtValue: v.beginbasicvalue2,
                  allPrice: v.beginprice
                };
              }
              if (!obj[d2] && v.endbalance  && v.endbalance != '{}') {
                obj[d2] = {
                  total: 0,
                  name: [],
                  part: {},
                  btcValue: v.endbasicvalue,
                  usdtValue: v.endbasicvalue2,
                  allPrice: v.endprice
                };
              }
              if (v.beginbalance && v.beginbalance != '{}') {
                let keys = Object.keys(v.beginbalance);
                // 先把所有的货币对 循环出来
                let obj1 = {};
                keys.forEach((v1, i1) => {
                  let a = v1.split("_");
                  v.beginbalance[v1].forEach((v2, i2) => {
                    let total = utils.add(
                      Number(v2.Available || 0),
                      Number(v2.OnOrders || 0)
                    );
                    if (!obj1[v2.Symbol]) {
                      obj1[v2.Symbol] = {
                        total,
                        btcTotal :  Number(v2.BtcValue || 0),
                        usdtTotal : Number(v2.UsdtValue || 0),
                        part: [{
                          exchange: a[0],
                          account: a[1],
                          ...v2
                        }]
                      };
                    } else {
                      let t = obj1[v2.Symbol].total;
                      let total2 = utils.add(total, t);
                      let total3 = utils.add(obj1[v2.Symbol].btcTotal,Number(v2.BtcValue || 0));
                      let total4 = utils.add(obj1[v2.Symbol].usdtTotal,Number(v2.UsdtValue || 0));
                      obj1[v2.Symbol] = {
                        total: total2,
                        btcTotal : total3,
                        usdtTotal : total4,
                        part: [
                          ...obj1[v2.Symbol].part,
                          {
                            exchange: a[0],
                            account: a[1],
                            ...v2
                          }
                        ]
                      };
                    }
                    obj[d1].total += total;
                  });
                });
                obj[d1].name = Object.assign([], Object.keys(obj1));
                obj[d1].part = Object.assign({}, obj1);
              }
      
              if (v.endbalance && v.endbalance != '{}') {
                let keys = Object.keys(v.endbalance);
                // 先把所有的货币对 循环出来
                let obj1 = {};
                keys.forEach((v1, i1) => {
                  let a = v1.split("_");
                  v.endbalance[v1].forEach((v2, i2) => {
                    let total = utils.add(
                      Number(v2.Available || 0),
                      Number(v2.OnOrders || 0)
                    );
                    if (!obj1[v2.Symbol]) {
                      obj1[v2.Symbol] = {
                        total,
                        btcTotal :  Number(v2.BtcValue || 0),
                        usdtTotal : Number(v2.UsdtValue || 0),
                        part: [{
                          exchange: a[0],
                          account: a[1],
                          ...v2
                        }]
                      };
                    } else {
                      let t = obj1[v2.Symbol].total;
                      let total2 = utils.add(total, t);
                      let total3 = utils.add(obj1[v2.Symbol].btcTotal,Number(v2.BtcValue || 0));
                      let total4 = utils.add(obj1[v2.Symbol].usdtTotal,Number(v2.UsdtValue || 0));
                      obj1[v2.Symbol] = {
                        total: total2,
                        btcTotal : total3,
                        usdtTotal : total4,
                        part: [
                          ...obj1[v2.Symbol].part,
                          {
                            exchange: a[0],
                            account: a[1],
                            ...v2
                          }
                        ]
                      };
                    }
                    obj[d2].total += total;
                  });
                });
                obj[d2].name = Object.assign([], Object.keys(obj1));
                obj[d2].part = Object.assign({}, obj1);
              }
            });
            resolve(obj);



        })

    }
  }
}
export default fund;

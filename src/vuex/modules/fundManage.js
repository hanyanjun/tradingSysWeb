
import api from "../../fetch/api";
const fund = {
    state : {
        allFund : {
            fundOptions : [],
            accOptions : {},
            allInfo : {}
        }
    },
    actions : {
        gainAllFund({state,dispatch,rootState},payload){
            let accName = rootState.accName;
            let allIndex = rootState.initInfo.index;
            let result = {
                fundOptions : [],
                accOptions : {},
                allInfo : {}
            }
            // allFund  : fundOptions accOptions allInfo
            api.gainFundAcc(accName).then(obj=>{
                // console.log(obj.data);
                if(obj.data && obj.data.length > 0){
                    let data = Object.assign([],obj.data);
                    data = data.filter((v)=>{
                     return v.isavailable
                    })
                    let fundOptions = [];
                    let accOptions = {};
                    let allInfo ={};
                    data.forEach((v,i)=>{
                        fundOptions.push({label : v.name , value : v.accountid , exchange : v.exchange});
                        if(!accOptions[v.accountid]){
                            accOptions[v.accountid] = [];
                        }
                        allInfo[v.accountid] = v;
                    data[i].allExchange= [];
                    data[i].allAcc = {};
                    data[i].key = i;
                    let arr= v.include_account.replace(/({|})/g,'').split(',');
                        arr.forEach((v1)=>{
                            let a1 = v1.split(":");
                            if(data[i].allExchange.indexOf(a1[0])  == -1){ 
                            data[i].allExchange.push(a1[0]);
                            }
                            if(!data[i].allAcc.hasOwnProperty(a1[0])){
                            data[i].allAcc[a1[0]] = [];
                            }
                            data[i].allAcc[a1[0]].push(a1[1]);
                            accOptions[v.accountid].push({value : a1[1] , exchange : a1[0] , label :  allIndex[a1[0]+a1[1]] });
                        })

                    })
                    result = Object.assign({}, {fundOptions , accOptions , allInfo});
                    state.allFund = Object.assign({},result);
                    // console.log(result);
                }
            })
        }
    }
}
export default fund;
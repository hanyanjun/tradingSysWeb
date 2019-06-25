const selectData = {
    state : {
        sumOptions : {
            arr : [     
                {value : 0.2 , label : '1/5'},
                {value : 0.25 , label : '1/4'},
                {value : 0.33333 , label : '1/3'},
                {value : 0.5 , label : '1/2'},
                {value : 1 , label : '全部'},
            ]
        },
        clientAcc : {
            arr : [
                {value : '36541710' , label : '36541710'},
                {value : '5426748' , label : '5426748'},
                {value : '28792967' , label : '28792967'},
            ]
        },
        trustTable : [
            // {title : '序号', dataIndex : 'key' , key : '1', width : 30 ,fixed: 'left'},
            {title : '市场', dataIndex : 'Exchange' , key : '2' ,  width : 120 ,fixed: 'left',scopedSlots : {customRender : 'Exchange'}},
            {title : '时间', dataIndex : 'time' , key : '16' ,width : 100 ,scopedSlots : {customRender : 'Ts'}},
            {title : '货币对', dataIndex : 'Symbol' ,  width : 90 ,key : '3' },
            {title : '策略类型', dataIndex : 'dataType' , key : '15' ,  width : 90 ,scopedSlots : {customRender : 'dataType'}},
            {title : '交易类型', dataIndex : 'Side' , key : '4' , width : 60 , scopedSlots : {customRender : 'Side'}},
            {title : '价格上限', dataIndex : 'Price' ,  width : 60 ,key : '5'},
            {title : '已发送系统数量', dataIndex : 'OrderPlaced' , key : '14' ,   width : 80 ,scopedSlots : {customRender : 'OrderPlaced'}},
            {title : '档位范围', dataIndex : 'PriceRange' , key : '6' , width : 60 ,scopedSlots : {customRender : 'PriceRange'}},
            {title : '委托比例', dataIndex : 'Rate' , key : '7', width : 60 ,scopedSlots : {customRender : 'Rate'}},
            {title : '总委托数量', dataIndex : 'TotalAmount' , key : '8', width : 60 ,scopedSlots : {customRender : 'TotalAmount'}},
            {title : '时间间隔基数', dataIndex : 'MinTimeInterval' ,  width : 60 ,key : '9'},
            {title : '单笔委托基数', dataIndex : 'EveryAmount' , key : '10', width : 60 ,scopedSlots : {customRender : 'EveryAmount'}},
            {title : '附加条件', dataIndex : 'condition' , key : '17', width : 280 ,scopedSlots : {customRender : 'condition'}},
            {title : '状态', dataIndex : 'Finished' , key : '12', width : 100 ,scopedSlots : {customRender : 'Finished'}},
            {title : '操作', dataIndex : 'action' , key : '13', width : 100 , fixed: 'right',scopedSlots : {customRender : 'action'}},
        ],
        hisTaskTable :[
            { title: '订单编号', dataIndex: 'Orderid', key: '1' , width : 140 },
            { title: '交易市场', dataIndex: 'Exchange', key: '2' , width : 140 },
            { title: '货币对', dataIndex: 'Symbol', key: '3' , width : 140 },
            { title: '类型', dataIndex: 'Type', key: '4' , width : 140, scopedSlots : {customRender : 'Type'} },
            { title: '下单数量', dataIndex: 'Amount', key: '5' , width : 140 },
            { title: '下单价格', dataIndex: 'Price', key: '6' , width : 140 },
            { title: '下单时间', dataIndex: 'Ts', key: '7' , width : 140 , scopedSlots : {customRender : 'Ts'} },
            { title: '来源', dataIndex: 'Source', key: '8' , width : 140  , scopedSlots : {customRender : 'Source'} },
            { title: '状态', dataIndex: 'Status', key: '9' , width : 140, scopedSlots : {customRender : 'Status'}  },
            // { title: '操作', dataIndex: 'action', key: '10' , width : 100, scopedSlots : {customRender : 'action'}  },
        ],
        marketOrderType : {
            // huobi : {
            //     type : 'type1'
            // },
            // okex : {type : 'type1'},
            // poloniex : {type : "default"},
            // gateio : {type : "default"},
            // kucoin : {type : "default"},
            // bitfinex : {type : "default"},
            // bian : {type : "type2"},
            // bitmesh : {type : "default"},
            // type1 : {
            //     buy1 : 'buy-market',
            //     buy : 'buy-limit',
            //     sell1 : 'sell-market',
            //     sell : 'sell-limit'
            // },
            // type2 :{
            //     buy : 'MARKET',
            //     buy1 :'LIMIT',
            //     sell : 'MARKEY',
            //     sell1 : 'LIMIT',
            //     extra : {
            //         reserved1 : ''
            //     },
            //     buy_extra : 'BUY',
            //     sell_extra : 'SELL'
            // },
            // default : {
            //     buy : 'buy',
            //     sell : 'sell'
            // }
            bian : {
                buy : {
                    type : 'LIMIT',
                    reserved1 : 'BUY'
                },
                sell : {
                    type : 'LIMIT',
                    reserved1 : 'SELL'
                }
            },
            huobi : {
                buy1 :{ type : 'buy-market'} ,
                sell1 : {type : 'sell-market'},
                buy : {type : 'buy-limit'},
                sell : {type : 'sell-limit'},
            },
            poloniex : {
                buy : {type : 'buy', reserved1 : 1},
                sell : {type : 'sell'},
            },
            gateio : {
                buy : {type : 'buy'},
                sell : {type : 'sell'}
            },
            kucoin : {
                buy1 : {type : 'buy' ,reserved1 : 'market'},
                buy : {type : 'buy' ,reserved1 : 'limit'},
                sell1 : {type : 'sell',reserved1 : 'market'},
                sell : {type : 'sell',reserved1 : 'limit'},
            },
            bitfinex : {
                buy1 : {type : 'exchange market' ,reserved1 : 'buy'},
                buy : {type : 'exchange limit' ,reserved1 : 'buy'},
                sell1 : {type : 'exchange market',reserved1 : 'sell'},
                sell : {type : 'exchange limit',reserved1 : 'sell'},
            },
            okex : {
                buy1 :{ type : 'buy-market'} ,
                sell1 : {type : 'sell-market'},
                buy : {type : 'buy-limit'},
                sell : {type : 'sell-limit'},
            },
            bitmesh : {
                buy1 :{ type : '1-2'} ,
                sell1 : {type : '2-2'},
                buy : {type : '1-1'},
                sell : {type : '2-1'},
            }
        }
    },
    actions : {

    }
}
export default selectData;
<template>
    <div class="delegate">
        <a-card title="进行中的委托" :bodyStyle="{padding:0}">
            <a-row type="flex" justify="space-around" align="middle" style="padding: 20px;">
                <a-col :span="20">
                    交易类型：<a-checkbox-group  :options="d1" v-model="card1.type" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <!-- 委托方式：<a-checkbox-group :options="d2" v-model="card1.method" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
                    委托状态：<a-checkbox-group :options="d3" v-model="card1.status" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </a-col>
                <a-col :span="4">
                    <a-row type="flex" justify="end">
                        <a-button type="primary" @click="addTask">新建委托</a-button>
                    </a-row>
                </a-col>
            </a-row>
            <a-row style="height:400px;">
              <a-table :columns="columns" :dataSource="taskArr" :scroll="{ y: 350 }" key="1" :pagination="false">
                   <span class="type" slot="type" slot-scope="text" :style="{color : text == 'buy' ? '#009966' : '#FF6666', 'font-size' : '13px'}">{{text == 'buy' ? '买入' : '卖出'}}</span>
                   <span class="oneMoney" slot="oneMoney" slot-scope="text">{{text || '---'}}</span>
                   <span class="sumPrice" slot="sumPrice" slot-scope="text" >{{text || '---'}}</span>
                   <span class="otherPrice" slot="otherPrice" slot-scope="text" >{{text || '---'}}</span>
                   <span class="status" slot="status" slot-scope="text">
                        <!-- // 委托状态 0 运行中 1 暂停  2 停止 3 取消 -->
                       <template v-if="text == 0">
                           <span class="green">运行中</span>
                       </template>
                       <template v-else-if="text == 1">
                           <span class="red">已暂停</span>
                       </template>
                       <template v-else-if="text == 2">
                           <span class="blue">已完成</span>
                       </template>
                       <template v-else-if="text == 3">
                           <span class="gray">已删除</span>
                       </template>
                   </span>
                    <span class="action" slot="action" slot-scope="text , record">
                        <!-- // 委托状态 0 运行中 1 暂停  2 停止 3 取消 -->
                       <template v-if="record.status == 0">
                           <a-popconfirm title="确定暂停该任务？" @confirm="handleTask('1',record)"  okText="Yes" cancelText="No">
                                <a-button size="small">暂停</a-button>
                            </a-popconfirm>
                           <a-popconfirm title="确定删除该任务？" @confirm="handleTask('3',record)"  okText="Yes" cancelText="No">
                                <a-button size="small" >删除</a-button>
                            </a-popconfirm>
                       </template>
                       <template v-else-if="record.status == 1">
                           <a-popconfirm title="确定启动该任务？" @confirm="handleTask('0',record)"  okText="Yes" cancelText="No">
                                <a-button size="small" >启动</a-button>
                            </a-popconfirm>
                           <a-popconfirm title="确定删除该任务？" @confirm="handleTask('3',record)"  okText="Yes" cancelText="No">
                                <a-button size="small" >删除</a-button>
                            </a-popconfirm>
                       </template>
                       <template v-else-if="record.status == 2">
                           ---
                       </template>
                       <template v-else-if="record.status == 3">
                           ---
                           <!-- <a-popconfirm title="确定启动该任务？" @confirm="handleTask('0',record)"  okText="Yes" cancelText="No">
                                <a-button size="small" >启动</a-button>
                            </a-popconfirm> -->
                       </template>
                   </span>
              </a-table>
            </a-row>
        </a-card>
        <a-card title="委托历史" style="margin-top:30px;" :bodyStyle="{padding:0}">
            <a-row type="flex" justify="space-around" align="middle" style="padding: 20px;">
                <a-col :span="20">
                    交易类型：<a-checkbox-group :options="d1" v-model="card2.type" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <!-- 委托方式：<a-checkbox-group :options="d2" v-model="card2.method" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
                    委托状态：<a-checkbox-group :options="d4" v-model="card2.status" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </a-col>
                <a-col :span="4">
                    <a-row type="flex" justify="end">
                        <a-range-picker v-model="card2.time" format="YYYY-MM-DD" />
                    </a-row>
                </a-col>
            </a-row>
            <a-row style="height:400px;">
              <a-table :columns="column1" :dataSource="hisArr" :scroll="{ y: 350}" :pagination="false">
               <span  slot="Ts" slot-scope="text" >{{$time(new Date(text),'yyyy-MM-dd')}}</span>
               <span slot="Type" slot-scope="text">   
                  <template v-if="/buy/.test(text.toLowerCase())">
                    <span style="color:#009966;font-size:13px">买入</span>
                  </template>
                  <template v-else>
                    <span style="color:#FF6666;font-size:13px;">卖出</span>
                  </template>
               </span>
               <span slot="Source" slot-scope="text">智能委托
                   <span v-if="false">{{text}}</span>
               </span>
               <span slot="Status" slot-scope="text">
                 <template v-if="text == '1'">
                    <span class="blue">完全成交</span>
                 </template>
                 <template v-else-if="text == '2'">
                    <span >订单错误</span>
                 </template>
                 <template v-else-if="text == '3'">
                    <span class="gray">部分成交</span>
                 </template>
               </span>
               <!-- <span slot="action" slot-scope="text , record">
                 <template v-if="record.Status == '0' || record.Status == '3'">
                   <a-popconfirm title="确定撤销该订单？" @confirm="cancleOrder(record)"  okText="Yes" cancelText="No">
                      <a-button size="small" >撤单</a-button>
                    </a-popconfirm>
                 </template>
                 <template v-else>
                   ---
                 </template>
               </span> -->
              </a-table>
            </a-row>
        </a-card>
         <a-drawer
            title="新建委托"
            :width="600"
            @onValuesChange="formValueChange"
            @close="handleCancel"
            :visible="dialogShow"
            :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
            >
            <a-form :form="form" @submit="submit" style="text-align:left;padding-bottom:40px">
                <a-form-item label="市场" :label-col="{ span: 6}" :wrapper-col="{ span: 14 }">
                        <a-select
                            v-decorator="[
                            'exchange',
                            {rules: [{ required: true, message: '请选择交易市场' }]}
                            ]"
                            placeholder="请选择交易市场"
                        >
                        <a-select-option :key="item.value" :value="item.value" v-for="item in marketTypes">{{item.value}}</a-select-option>
                        </a-select>
                </a-form-item>
                <a-form-item label="策略" :label-col="{ span: 6}" :wrapper-col="{ span: 14 }">
                        <a-select
                            v-decorator="[
                            'celue',
                            {rules: [{ required: true, message: '请选择策略' }]}
                            ]"
                            placeholder="请选择策略"
                        >
                        <a-select-option  :key="item.value"  :value="item.value" v-for="item in celueTypes">{{item.label}}</a-select-option>
                        </a-select>
                </a-form-item>
                <a-form-item label="货币" :label-col="{ span: 6}" :wrapper-col="{ span: 14 }" >
                    <a-input 
                            placeholder="示例：ETH-BTC"
                             v-decorator="['symbol', {rules: [{ required: true, message: '请输入货币对'  } , {pattern : new RegExp(/[A-Z]+-[A-Z]+/) , message : '请输入正确格式'}]}]">
                        </a-input>
                </a-form-item>
                <a-form-item label="交易所客户号"
                            :label-col="{ span: 6 }"
                            :wrapper-col="{ span: 14 }">
                    <a-select
                        placeholder="请选择交易所客户号"
                        v-decorator="[
                        'accountid',
                        {rules: [{ required: true, message: '请选择交易所客户号' }]}
                        ]"
                    >
                        <a-select-option :value="item.value" v-for="item in clientAcc" :key="item.value">
                        {{item.label}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                        label="交易类型"  :label-col="{ span: 6}" :wrapper-col="{ span: 14 }"
                        >
                        <a-radio-group v-decorator="[
                            'side',
                            {rules: [{ required: true, message: '请选择交易类型' }]}
                            ]">
                            <a-radio value="1">
                             买入
                            </a-radio>
                            <a-radio value="2">
                                卖出
                            </a-radio>
                        </a-radio-group>
                </a-form-item>
                <a-form-item label="委托总量"
                            :label-col="{ span: 6 }"
                            :wrapper-col="{ span: 14 }">
                    <a-input   placeholder="请输入数量" v-decorator="[
                        'total_amount',
                        {rules: [{ required: true, message: '请输入数量' },{validator : isNumVaditor, trigger : 'change'}]}
                    ]" />
                </a-form-item>  
                <a-form-item label="价格上限"
                            :label-col="{ span: 6 }"
                            :wrapper-col="{ span: 14 }">
                    <a-input   placeholder="请输入价格" v-decorator="[
                        'price',
                        {rules: [{ required: true, message: '请输入价格' },{validator : isNumVaditor, trigger : 'change'}]}
                    ]" />
                </a-form-item>
                <a-form-item label="档位范围"
                             v-show="celueIndex == 1"
                            :label-col="{ span: 6 }"
                            :wrapper-col="{ span: 14 }">
                    <a-input   placeholder="档位范围（不能超过10）" v-decorator="[
                        'price_range',
                        {rules: [{ required: celueIndex == 1, message: '请输入档位范围' },{validator : isNumVaditor, trigger : 'change'}]}
                    ]" />
                </a-form-item>
                <a-form-item label="委托比例"
                             v-show="celueIndex == 1"
                            :label-col="{ span: 6 }"
                            :wrapper-col="{ span: 14 }">
                    <a-input   placeholder="委托比例（不能超过100%）" v-decorator="[
                        'rate',
                        {rules: [{ required: celueIndex == 1, message: '请输入委托范围' },{validator : isNumVaditor, trigger : 'change'}]}
                    ]" > <span slot="addonAfter">%</span></a-input>
                </a-form-item>
                <a-form-item label="单笔委托基数"
                             v-show="celueIndex == 2"
                            :label-col="{ span: 6 }"
                            :wrapper-col="{ span: 14 }">
                    <a-input   placeholder="单笔委托基数（不能超过100%）" v-decorator="[
                        'every_amount',
                        {rules: [{ required: celueIndex == 2, message: '请输入单笔委托基数' },{validator : isNumVaditor, trigger : 'change'}]}
                    ]" ><span slot="addonAfter">%</span></a-input>
                </a-form-item>
                <a-form-item label="时间间隔基数"
                            :label-col="{ span: 6 }"
                            :wrapper-col="{ span: 14 }">
                    <a-input   placeholder="时间间隔基数（最小时间为2s）" v-decorator="[
                        'min_time_interval',
                        {rules: [{ required: true, message: '请输入时间间隔基数' },{validator : isNumVaditor, trigger : 'change'}]}
                    ]" ><span slot="addonAfter">s</span></a-input>
                </a-form-item>
                 <!-- <a-form-item
                    label="附加条件"
                    v-show="celueIndex == 2"
                    :label-col="{ span: 6 }"
                    :wrapper-col="{ span: 14 }"
                    >
                    <a-input
                        placeholder="不能超过100%"
                        v-decorator="[
                        'other'
                        ]"
                    >
                        <a-select
                        slot="addonBefore"
                        v-decorator="[
                            'prefix'
                        ]"
                        style="width: 110px"
                        >
                        <a-select-option value="1">
                            +触发幅度
                        </a-select-option>
                        <a-select-option value="2">
                            +委托比例
                        </a-select-option>
                        </a-select>
                        <span slot="addonAfter">%</span>
                    </a-input>
                    </a-form-item> -->
                    <div v-for="(k, index) in form.getFieldValue('keys')" :key="index"  v-show="celueIndex == 2">
                      <a-form-item
                        :key="k"
                        :label="'附加条件'+(index+1)"
                        :required="false"
                        :label-col="{ span: 6 }"
                        :wrapper-col="{ span: 14 }"
                        >
                        <a-input
                            v-decorator="[
                            `conditionRange[${k}]`,
                            {
                                rules: [{ required: false, message: '请输入触发幅度' },{validator : isNumVaditor, trigger : 'change'}],
                            }
                            ]"
                            placeholder="触发幅度(不超过100%)"
                            style="width: 92%; margin-right: 8px"
                        ><span slot="addonAfter">%</span></a-input>
                        </a-form-item>
                      <a-form-item
                        :required="false"
                        :wrapper-col="{ span: 14 , offset : 6}"
                        >
                        <a-input
                            v-decorator="[
                            `conditionRate[${k}]`,
                            {
                                rules: [{ required: false, message: '请输入触发比例' },{validator : isNumVaditor, trigger : 'change'}],
                            }
                            ]"
                            placeholder="触发比例(不超过100%)"
                            style="width: 92%;margin-right: 8px"
                        ><span slot="addonAfter">%</span></a-input>
                        <a-icon
                            v-if="form.getFieldValue('keys').length > 1"
                            class="dynamic-delete-button"
                            type="minus-circle-o"
                            :disabled="form.getFieldValue('keys').length === 1"
                            @click="() => remove(k)"
                        />
                        </a-form-item>
                    </div>
                        <!-- <a-form-item :wrapperCol=" { span : 23 , offset : 6}" v-show="celueIndex == 2"> -->

                    <a-row style="marign:20px auto">
                        <a-col :span="14" :offset="6">
                        <a-button
                            type="dashed"
                            :wrapperCol=" { span : 23 , offset : 6}"
                            @click="add"
                            style="width:100%"
                             v-show="celueIndex == 2"
                        >
                            <a-icon type="plus" /> 增加附加条件
                        </a-button>

                        </a-col>
                    </a-row>       
            </a-form>
            <div
            :style="{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            }"
        >
            <a-button
            :style="{marginRight: '8px'}"
            @click="handleCancel"
            >
            Cancel
            </a-button>
            <a-button @click="handleOk" type="primary">Submit</a-button>
        </div>
        </a-drawer>
        <!-- <a-modal title="新建委托" cancelText="取消" okText="建立委托" :visible="dialogShow" @ok="handleOk" :confirmLoading="confirmLoading" @cancel="handleCancel">
            
        </a-modal> -->
    </div>
</template>

<script>
import isNum from "isnumber-js";
const isNumVaditor = function(rule,value,callback){
    if(value){
        if(isNum(value)){
        if(rule.field == 'min_time_interval' && value < 2){
             callback(new Error('最小时间为2s'));
        }
        if(/conditionRange/g.test(rule.field) && value > 100){
             callback(new Error('触发幅度在0%-100%之间'));
        }
        if(/conditionRate/g.test(rule.field) && value > 100){
             callback(new Error('触发比例在0%-100%之间'));
        }

        if(rule.field == 'every_amount' && (value > 100 || value <= 0)){
             callback(new Error('单笔委托基数在0%-100%之间'));
        }
        if(rule.field == 'rate' && (value > 100 || value <= 0)){
             callback(new Error('委托比例在0%-100%之间'));
        }
        if(rule.field == 'price_range' && (value > 10 || value <= 0)){
             callback(new Error('档位范围在1-10之间'));
        }
        callback();
    }else{
        callback(new Error('请输入正确的数字'));
    }
    }else{
        callback();
    }
}
let id = 0;
// 委托状态 0 运行中 1 暂停  2 停止 3 取消
export default {
    name : 'delegate',
    data(){return{
        card1 : {
            type : ['buy','sell'],
            status : ['1','0']
        },
        card2 : {
            type : ['buy','sell'],
            time : [],
            status : ['1','2','3']
        },
        isNumVaditor : isNumVaditor,
        form: this.$form.createForm(this,{
            onValuesChange : this.formValueChange
        }),
        dialogShow : false,
        confirmLoading : false,
        celueIndex : '1',
        celueTypes : [],
        clientAcc : [],
        d1 : [], d2 : [], d3 :[] , d4 : []
    }},
    created(){
        this.d1 = this.$staticData.d2;
        this.d2 = this.$staticData.d3;
        this.d3 = this.$staticData.d4;
        this.d4 = this.$staticData.d5;
        this.celueTypes = this.$staticData.celue;
        let arr = [];
        this.$api.querystone().then(obj=>{
            arr = obj.data;
            arr = arr.map(v=>{
                return {...v,dataType : '1'}
            })
            this.$api.querysttwo().then(obj=>{
                let arr1 = obj.data.map((v)=>{
                    return {...v,dataType : '2'};
                })
                arr = arr.concat(arr1);
            })
        })
    },
    mounted(){  
        this.form.getFieldDecorator('keys', { initialValue: [], preserve: true });
    },  
    computed:{
        columns(){
            return this.$store.state.selectData.trustTable;
        },
        column1(){
            return this.$store.state.selectData.hisTaskTable;
        },
        trustTask(){
            return this.$store.state.trustTask;
        },
        historyTask(){
            return this.$store.state.historyTask;
        },
        marketTypes(){
            let info = this.$store.state.initInfo.info;
            return Object.keys(info).map((v)=>{
                return {label : v , value : v};
            })
        },
        // hisArr(){
        //     let arr = JSON.parse(JSON.stringify(this.historyTask));
        //     if(arr.length == 0 || (this.card2.status.length == 0 && this.card2.time.length == 0 && this.card2.status.length == 0)){
        //         return [];
        //     }
        //     let arr1 = [];
        //     let arr2 = [];
        //     let s1 = this.card2.type.join(',')
        //     let s2 = this.card2.status.join(',');
        //     s1 = s1 || 'buy,sell';
        //     s2 = s2 || '1,2';
        //     arr1 = arr.filter((v)=>{
        //         let s = '';
        //         if(v.status == 3){
        //             s= '3';
        //         }else{
        //             if(v.otherSum == 0){
        //                 s = '1';
        //             }else{
        //                 s = '2';
        //             }
        //         }
        //         return (new RegExp(v.type)).test(s1) && (new RegExp(s)).test(s2);
        //     })
        //     if(this.card2.time.length == 0){
        //         return arr1;
        //     }
        //     arr2 = arr1.filter((v)=>{
        //         return v.date < this.$time(this.card2.time[1]._d,'yyyy-MM-dd') && v.date > this.$time(this.card2.time[0]._d,'yyyy-MM-dd');
        //     })
        //     return arr2;
        // },
        hisArr(){
            let keys = Object.keys(this.trustTask);
            if(keys.length == 0 ||  (this.card2.status.length == 0 && this.card2.time.length == 0 && this.card2.type.length == 0)){
                return [];
            }
            let task = keys.filter((v,i)=>{
                return /\./.test(v);
            })
            let arr = [];
            // 得到所有订单回报的数组
            task.forEach((v,i)=>{
                let orderList = JSON.parse(JSON.stringify(this.trustTask[v].allOrder));
                orderList.forEach((v1)=>{
                    // 筛选出智能委托的订单回报
                    if(/auto/.test(v1.Source)){
                         arr.push(v1);
                    }
                })
            }); 
            let s1 = this.card2.type.join(',');
            let s2 = this.card2.status.join(',');
            s1 = s1 || 'buy,sell';
            s2 = s2 || '1,3';
            let arr1 = [];
            arr1 = arr.filter((v)=>{
                let str = /buy/.test(v.Type.toLowerCase()) ? 'buy' : 'sell';
                return (new RegExp(str)).test(s1) && (new RegExp(v.Status)).test(s2);
            })
            if(this.card2.time.length == 0){
                return arr1;
            }
            arr2 = arr1.filter((v)=>{
                return v.Ts < Date.parse(this.card2.time[1]._d) && v.Ts > Date.parse(this.card2.time[0]._d);
            })
            return arr2;
        },
        taskArr(){
            let keys = Object.keys(this.trustTask);
            if(keys.length == 1 || (this.card1.status.length == 0 && this.card1.length == 0)){
                return [];
            }
            let task = keys.filter((v,i)=>{
                return /\./.test(v);
            })
            let arr = [];
            task.forEach((v,i)=>{
                let obj = JSON.parse(JSON.stringify(this.trustTask[v].allTask));
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        let e = JSON.parse(JSON.stringify(obj[key]));
                        e.index = key;
                        e.key = key;
                            let str = this.card1.type.join(',');
                            let n1 =  new RegExp(e.type);
                            let str1 = this.card1.status.join(',');
                            let n2 = new RegExp(e.status);
                            if(str == ""){
                                if(n2.test(str1)){
                                    arr.push(e);
                                }
                            }else if(str1 == ''){
                                if(n1.test(str)){
                                    arr.push(e);
                                }
                            }else{
                                if(n1.test(str) && n2.test(str1)){
                                    arr.push(e);
                                }
                            }
                    }
                } 
            })
            return JSON.parse(JSON.stringify(arr));
        }
    },
    methods:{
        handleOk(){
            this.form.validateFields((err,values)=>{
                if(!err){     
                    if(this.celueIndex == 1){
                        values.rate = values.rate/100;
                        this.$api.newstone(values).then(obj=>{
                            console.log(obj);
                        })
                    }else{
                        let info = JSON.parse(JSON.stringify(values));
                        let arr = [];
                        info.every_amount = info.every_amount/100;
                        if(info.conditionRange.length > 0 ){
                            info.conditionRange.forEach((v,i)=>{
                                if(v &&  info.conditionRate[i]){
                                    arr.push( v/100 + ':' + info.conditionRate[i]/100)
                                }
                            })
                        }
                        info.additional =  '{' + arr.join(',') + "}";
                        this.$api.newsttwo(info).then(obj=>{
                            console.log(obj);
                        })
                    }
                    // if(!this.isRequire){
                    //     values.percent = '';
                    // }
                    // let obj = Object.assign({},values);
                    // values.status = 0;
                    // values.otherSum = values.allSum;
                    // this.$store.dispatch('trustTask',values);
                    // this.dialogShow = false;
                }
            })
        },
        handleCancel(){
            this.dialogShow = false;
        },
         remove  (k) {
            const { form } = this;
            // can use data-binding to get
            const keys = form.getFieldValue('keys');
            // We need at least one passenger
            if (keys.length === 1) {
                return;
            }

            // can use data-binding to set
            form.setFieldsValue({
                keys: keys.filter(key => key !== k),
            });
            },

            add  () {
            const { form } = this;
            // can use data-binding to get
            const keys = form.getFieldValue('keys');
            const nextKeys = keys.concat(++id);
            // can use data-binding to set
            // important! notify form to detect changes
            form.setFieldsValue({
                keys: nextKeys,
            });
            },
        formValueChange(item,values){
            let {celue,exchange} = values;
            if(celue){
                this.celueIndex = celue;
                this.form.resetFields(['exchange','accountid','symbol','price','price_range','rate','total_amount','side','min_time_interval','every_amount'])
            }
            if(exchange){
                let arr  = this.$store.state.initInfo.info[exchange].map((v)=>{
                    return {label : v , value : v}
                })
                this.clientAcc = Object.assign([],arr);
            }
        },
        addTask(){
            this.dialogShow = true;
            const {form} = this;
            this.$nextTick(()=>{
                this.form.resetFields();
                this.form.setFieldsValue({
                    celue : '1'
                })  
            })
        },
        handleTask(type,item){
            let obj = Object.assign({},item);
            obj.status = type;
            this.$store.state.trustTask[obj.market+'.'+obj.currency.replace('-','')].allTask[obj.taskId] = Object.assign({},obj);
            this.$store.state.trustTable = Object.assign({},this.$store.state.trustTask);
            if(type == 3){
                let o1 = JSON.parse(JSON.stringify(obj));
                let len = this.$store.state.historyTask.length;
                o1.index = len;
                o1.key = len;
                this.$store.state.historyTask.push(o1);
                this.$store.state.historyTask= Object.assign([],this.$store.state.historyTask);
            }
        },
        submit(){

        }
    }
}
</script>

<style lang="scss">
.green{
  color:   #009966;   
}
.red{
    color: #FF6666;
}
.gray{
    color: #CCCCCC;
}
.blue{
    color: #1890ff;
}
</style>

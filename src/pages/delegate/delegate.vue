<template>
  <div class="delegate">
    <a-card title="进行中的委托"
            :bordered="false"
            :bodyStyle="{padding:0}">
      <a-row type="flex"
             justify="space-around"
             align="middle"
             style="padding: 20px;">
        <a-col :span="20">
          交易类型：
          <a-checkbox-group :options="d1" 
                            v-model="card1.type" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          委托方式：<a-checkbox-group :options="d2" v-model="card1.method" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          委托状态：<a-checkbox-group :options="d3" v-model="card1.status" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </a-col>
        <a-col :span="4">
          <a-row type="flex"
                 justify="end">
            <a-button type="primary"
                      @click="addTask">新建委托</a-button>
          </a-row>
        </a-col>
      </a-row>
      <a-row style="height:100%;">
        <a-table :columns="columns"
                 :dataSource="taskArr"
                 :scroll="{ y: 520 }"
                 key="1"
                 :pagination="{
                   size : 'small'
                 }">
          <span class="Side"
                slot="Side"
                slot-scope="text"
                :style="{color : text == '1' ? '#009966' : '#FF6666', 'font-size' : '13px'}">{{text == '1' ? '买入' : '卖出'}}</span>
          <span class="dataType"
                slot="dataType"
                slot-scope="text">{{text  == 1 ? '以时间加权委托' : '持续委托'}}</span>
          <span class="PriceRange"
                slot="PriceRange"
                slot-scope="text">{{text || '---'}}</span>
          <span class="Rate"
                slot="Rate"
                slot-scope="text">{{text || '---'}}</span>
          <span class="OrderPlaced"
                slot="OrderPlaced"
                slot-scope="text">{{text || '---'}}</span>
          <span class="EveryAmount"
                slot="EveryAmount"
                slot-scope="text">{{text || '---'}}</span>
          <span class="Finished"
                slot="Finished"
                slot-scope="text">
            <!-- // 委托状态 0 运行中 1 暂停  2 停止 3 取消 -->
            <template v-if="text">
                <span class="red">已停止</span>
            </template>
            <template v-else>
                <span class="green">运行中</span>
            </template>
              <!-- <template v-if="text">
                <span class="red">已停止</span>
                <span class="green">运行中</span>
              </template>
              <template v-if="text == 1">
                <span class="gray">已修改</span>
              </template>
              <template v-if="text == 2">
                <span class="red">已停止</span>
              </template> -->
          </span>
          <span class="action"
                slot="action"
                slot-scope="text , record">
                <template v-if="record.FinishReason == 0">       
                    <a-button @click="handleTask('1',record)" size="small">修改</a-button>
                    <a-popconfirm title="确定删除该任务？"
                                    @confirm="handleTask('2',record)"
                                    okText="Yes"
                                    cancelText="No">
                        <a-button size="small">删除</a-button>
                    </a-popconfirm>
                </template>
                <template v-else>
                    ---
                </template>
          </span>
        </a-table>
      </a-row>
    </a-card>
    <a-drawer :title="formType == 'add' ? '新建委托' : '修改委托'"
              :width="600"
              @onValuesChange="formValueChange"
              @close="handleCancel"
              :visible="dialogShow"
              :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}">
      <a-form :form="form"
              @submit="submit"
              style="text-align:left;padding-bottom:40px">
        <a-form-item label="策略"
                     :label-col="{ span: 6}"
                     :wrapper-col="{ span: 14 }">
          <a-select v-decorator="[
                            'celue',
                            {rules: [{ required: true, message: '请选择策略' }]}
                            ]"
                     :disabled="formType == 'edit'"
                    placeholder="请选择策略">
            <a-select-option :key="item.value"
                             :value="item.value"
                             v-for="item in celueTypes">{{item.label}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="市场"
                     :label-col="{ span: 6}"
                     :wrapper-col="{ span: 14 }">
          <a-select v-decorator="[
                            'exchange',
                            {rules: [{ required: true, message: '请选择交易市场' }]}
                            ]" 
                     :disabled="formType == 'edit'"
                    placeholder="请选择交易市场">
            <a-select-option :key="item.value"
                             :value="item.value"
                             v-for="item in marketTypes">{{item.value}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="交易对"
                     :label-col="{ span: 6}"
                     :wrapper-col="{ span: 14 }">

                     
            <a-dropdown :trigger="['click']">
                <a-input placeholder="示例：ETH-BTC"  
                          autocomplete="off"
                          :disabled="formType == 'edit'"
                        v-decorator="['symbol', {rules: [{ required: true, message: '请输入交易对'  } , {pattern : formType == 'add' ? new RegExp(/[A-Z]+-[A-Z]+/) : null, message : '请输入正确格式'}]}]">
                </a-input>
               <div slot="overlay" :style="filterSymbol.length > 0 ? 'max-height:200px;overflow-y:scroll;background:white' : 'overflow:hidden;background:white'">
                 <a-list
                    bordered
                    size="small"
                    :locale="{
                      emptyText : '暂无匹配结果'
                    }"
                    :dataSource="filterSymbol"
                  >
                    <a-list-item slot="renderItem" slot-scope="item, index">{{item}}</a-list-item>
                    <div slot="header">共有{{filterSymbol.length}}条相关</div>
                </a-list>
               </div>
          </a-dropdown>
          
                    <a-tooltip placement="topLeft" >
                      <template slot="title">
                        <span>相关联想词只是提示作用，填写交易对之前请先选择交易市场，交易对格式必须为：<strong>ETH-BTC</strong></span>
                      </template>
                        <a-icon class="suff_icon" type="question-circle" />
                    </a-tooltip>
        </a-form-item>
        <a-form-item label="交易所客户号"
                     :label-col="{ span: 6 }"
                     :wrapper-col="{ span: 14 }">
          <a-select placeholder="请选择交易所客户号"
                     :disabled="formType == 'edit'"
                    v-decorator="[
                        'accountid',
                        {rules: [{ required: true, message: '请选择交易所客户号' }]}
                        ]">
            <a-select-option :value="item.value"
                             v-for="item in clientAcc"
                             :key="item.label">
              {{item.label}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="交易类型"
                     :label-col="{ span: 6}"
                     :wrapper-col="{ span: 14 }">
          <a-radio-group 
                     :disabled="formType == 'edit'" v-decorator="[
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
          <a-input placeholder="请输入数量"
                   v-decorator="[
                        'total_amount',
                        {rules: [{ required: true, message: '请输入数量' },{validator : isNumVaditor, trigger : 'change'}]}
                    ]" />
        </a-form-item>
        <a-form-item label="价格"
                     :label-col="{ span: 6 }"
                     :wrapper-col="{ span: 14 }">
          <a-input placeholder="请输入价格"
                   v-decorator="[
                        'price',
                        {rules: [{ required: true, message: '请输入价格' },{validator : isNumVaditor, trigger : 'change'}]}
                    ]" />
        </a-form-item>
        <a-form-item label="档位范围"
                     v-show="celueIndex == 1"
                     :label-col="{ span: 6 }"
                     :wrapper-col="{ span: 14 }">
          <a-input placeholder="档位范围（不能超过10）"
                   v-decorator="[
                        'price_range',
                        {rules: [{ required: celueIndex == 1, message: '请输入档位范围' },{validator : isNumVaditor, trigger : 'change'}]}
                    ]" />
                    <a-tooltip placement="topLeft" >
                      <template slot="title">
                        <span>策略去监控市场的档位，最大设置档位不能超过10</span>
                      </template>
                        <a-icon class="suff_icon" type="question-circle" />
                    </a-tooltip>
        </a-form-item>
        <a-form-item label="委托比例"
                     v-show="celueIndex == 1"
                     :label-col="{ span: 6 }"
                     :wrapper-col="{ span: 14 }">
          <a-input placeholder="委托比例（不能超过100%）"
                   v-decorator="[
                        'rate',
                        {rules: [{ required: celueIndex == 1, message: '请输入委托范围' },{validator : isNumVaditor, trigger : 'change'}]}
                    ]"> <span slot="addonAfter">%</span></a-input>
                    <a-tooltip placement="topLeft" >
                      <template slot="title">
                        <span>实际委托量 = 符合价位限制的档数的委托量和 X 委托比例</span>
                      </template>
                        <a-icon class="suff_icon" type="question-circle" />
                    </a-tooltip>
        </a-form-item>
        <a-form-item label="单笔委托基数"
                     v-show="celueIndex == 2"
                     :label-col="{ span: 6 }"
                     :wrapper-col="{ span: 14 }">
          <a-input placeholder="单笔委托基数"
                   v-decorator="[
                        'every_amount',
                        {rules: [{ required: celueIndex == 2, message: '请输入单笔委托基数' },{validator : isNumVaditor, trigger : 'change'}]}
                    ]"></a-input>
                    <a-tooltip placement="topLeft" >
                      <template slot="title">
                        <span>最大单笔委托，生成一个小于基数的随机值</span>
                      </template>
                        <a-icon class="suff_icon" type="question-circle" />
                    </a-tooltip>
        </a-form-item>
        <a-form-item label="时间间隔基数"
                     :label-col="{ span: 6 }"
                     :wrapper-col="{ span: 14 }">
          <a-input placeholder="时间间隔基数（最小时间为2s）"
                   v-decorator="[
                        'min_time_interval',
                        {rules: [{ required: true, message: '请输入时间间隔基数' },{validator : isNumVaditor, trigger : 'change'}]}
                    ]"><span slot="addonAfter">s</span></a-input>
                    <a-tooltip placement="topLeft" >
                      <template slot="title">
                        <span>最小时间间隔，生成一个大于基数的随机值</span>
                      </template>
                        <a-icon class="suff_icon" type="question-circle" />
                    </a-tooltip>
        </a-form-item>
        <div v-for="(k, index) in form.getFieldValue('keys')"
             :key="index"
             v-show="celueIndex == 2">
          <a-form-item 
                       :label="'附加条件'+(index+1)"
                       :required="false"
                       :label-col="{ span: 6 }"
                       :wrapper-col="{ span: 14 }">
            <a-input v-decorator="[
                            `conditionRange[${k}]`,
                            {
                                rules: [{ required: false, message: '请输入触发幅度' },{validator : isNumVaditor, trigger : 'change'}],
                            }
                            ]"
                     placeholder="触发幅度(不超过100%)"
                     style="width: 92%; margin-right: 8px"><span slot="addonAfter">%</span></a-input>
          </a-form-item>
          <a-form-item :required="false"
                       :wrapper-col="{ span: 14 , offset : 6}">
            <a-input v-decorator="[
                            `conditionRate[${k}]`,
                            {
                                rules: [{ required: false, message: '请输入委托比例' },{validator : isNumVaditor, trigger : 'change'}],
                            }
                            ]"
                     placeholder="委托比例(不超过100%)"
                     style="width: 92%;margin-right: 8px"><span slot="addonAfter">%</span></a-input>
            <a-icon v-if="form.getFieldValue('keys').length > 1"
                    class="dynamic-delete-button"
                    type="minus-circle-o"
                    :disabled="form.getFieldValue('keys').length === 1"
                    @click="() => remove(k)" />
          </a-form-item>
        </div>
        <a-row style="marign:20px auto">
          <a-col :span="14"
                 :offset="6">
            <a-button type="dashed"
                      :wrapperCol=" { span : 23 , offset : 6}"
                      @click="add"
                      style="width:100%"
                      v-show="celueIndex == 2">
              <a-icon type="plus" /> 增加附加条件
            </a-button>

          </a-col>
        </a-row>
      </a-form>
      <div :style="{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            }">
        <a-button :style="{marginRight: '8px'}"
                  @click="handleCancel">
          Cancel
        </a-button>
        <a-button @click="handleOk"
                  type="primary">Submit</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import isNum from "isnumber-js";
const isNumVaditor = function(rule, value, callback) {
  if (value) {
    if (isNum(value)) {
      if (rule.field == "min_time_interval" && value < 2) {
        callback(new Error("最小时间为2s"));
      }
      if (/conditionRange/g.test(rule.field) && value > 100) {
        callback(new Error("触发幅度在0%-100%之间"));
      }
      if (/conditionRate/g.test(rule.field) && value > 100) {
        callback(new Error("委托比例在0%-100%之间"));
      }
      // if (rule.field == "every_amount" && (value > 100 || value <= 0)) {
      //   callback(new Error("单笔委托基数在0%-100%之间"));
      // }
      if (rule.field == "rate" && (value > 100 || value <= 0)) {
        callback(new Error("委托比例在0%-100%之间"));
      }
      if (rule.field == "price_range" && (value > 10 || value <= 0)) {
        callback(new Error("档位范围在1-10之间"));
      }
      callback();
    } else {
      callback(new Error("请输入正确的数字"));
    }
  } else {
    callback();
  }
};
let id = 0;
// 委托状态 0 运行中 1 暂停  2 停止 3 取消
export default {
  name: "delegate",
  data() {
    return {
      card1: {
        type: ["1", "2"],
        method: ["1", "2"],
        status : ['0','1']
      },
      isNumVaditor: isNumVaditor,
      form: this.$form.createForm(this, {
        onValuesChange: this.formValueChange
      }),
      formType : 'add',
      editId : '',
      dialogShow: false,
      confirmLoading: false,
      oneSymbol : [],
      filterSymbol : [],
      celueIndex: "1",
      celueTypes: [],
      clientAcc: [],
      table1: [],
      d1: [],
      d2: [],
      d3: [],
      d4: []
    };
  },
  created() {
    this.d1 = this.$staticData.d2;
    this.d2 = this.$staticData.d3;
    this.d3 = this.$staticData.d4;
    this.d4 = this.$staticData.d5;
    this.celueTypes = this.$staticData.celue;
    this.init();
  },
  mounted() {
    this.form.getFieldDecorator("keys", { initialValue: [], preserve: true });
  },
  computed: {
    columns() {
      return this.$store.state.selectData.trustTable;
    },
    allSymbol(){
      return this.$store.state.allSymbol;
    },
    column1() {
      return this.$store.state.selectData.hisTaskTable;
    },
    trustTask() {
      return this.$store.state.trustTask;
    },
    historyTask() {
      return this.$store.state.historyTask;
    },
    marketTypes() {
      let info = this.$store.state.initInfo.info;
      return Object.keys(info).map(v => {
        return { label: v, value: v };
      });
    },
    hisArr() {
      return [];
    },
    taskArr() {
      let arr = [];
      if(this.card1.status.length > 0){   
        this.card1.status.forEach((v)=>{
          if(v == '0'){
            arr.push('false');
          }else{
            arr.push('true');
          }
        })
      }
        return this.table1.filter((v)=>{
            return this.card1.type.indexOf(String(v.Side)) > -1 && this.card1.method.indexOf(v.dataType) > -1 && arr.indexOf(String(v.Finished)) > -1;
        })
    }
  },
  methods: {
    handleOk() {
      this.form.validateFields((err, values) => {
          console.log(err);
        if (!err) {
          if (this.celueIndex == 1) {
            values.rate = values.rate / 100;
            switch(this.formType){
                case "add":
                  if(this.filterSymbol.length == 0){
                    this.$message.error(`${values.exchange}中未找到交易对：${values.symbol}`);
                    return ;
                  }
                    this.$api.newstone(values).then(obj => {
                        this.$message.success('新增委托成功!');
                        this.init();
                    });
                break;
                case "edit":
                    this.$api.updatestone({...values,id : this.editId}).then(obj => {
                        this.$message.success('修改委托成功!');
                        this.init();
                    });
                break;
            }
          } else {
            let info = JSON.parse(JSON.stringify(values));
            let arr = [];
            if (info.keys.length  > 0 && info.conditionRange.length > 0) {
              info.conditionRange.forEach((v, i) => {
                if (v && info.conditionRate[i]) {
                  arr.push(v / 100 + ":" + info.conditionRate[i] / 100);
                }
              });
            }
            info.additional = "{" + arr.join(",") + "}";
            switch(this.formType){
                case "add":
                    this.$api.newsttwo(info).then(obj => {
                        this.$message.success('新增委托成功!');
                        this.init();
                    });
                break;
                case "edit":
                    this.$api.updatesttwo({...info,id : this.editId}).then(obj => {
                        this.$message.success('修改委托成功!');
                        this.init();
                    });
                break;
            }
          }
          this.dialogShow = false;
        }
      });
    },
    init(){
        let arr = [];
        this.$api.querystone({sysaccount : window.sessionStorage['user_name']}).then(obj => {
        if(obj.data){
        arr = obj.data.map(v => {
            return { ...v, dataType: "1"};
        });
        }
        this.$api.querysttwo({sysaccount : window.sessionStorage['user_name']}).then(obj => {
            let arr1 = [];
            if(obj.data){
              arr1 = obj.data.map(v => {
              return { ...v, dataType: "2" };
              });
              arr = arr.concat(arr1);
            }
            let a = [];
            arr.forEach((v,i)=>{
                // if(v.FinishReason == 0){
                    a.push({...v,key : i})
                // }
            })
            this.table1 = a;
        });
        });
    },
    handleCancel() {
      this.dialogShow = false;
    },
    remove(k) {
      const { form } = this;
      // can use data-binding to get
      const keys = form.getFieldValue("keys");
      // We need at least one passenger
      if (keys.length === 1) {
        return;
      }
      form.setFieldsValue({
        keys: keys.filter(key => key !== k)
      });
    },
    add() {
      const { form } = this;
      const keys = form.getFieldValue("keys");
      const nextKeys = keys.concat(++id);
      form.setFieldsValue({
        keys: nextKeys
      });
    },
    gainFilterSymbol(symbol){
      let str = symbol.replace('-','').toUpperCase();
          if(this.oneSymbol){
            let arr = this.oneSymbol.filter((v)=>{
              let reg = new RegExp("^" + str,"gim");
              let v1 = v.replace("-",'');
              return reg.test(v1);
            })
            this.filterSymbol = Object.assign([],arr);
          }
    },
    formValueChange(item, values) {
      let { celue, exchange , symbol } = values;
      if(exchange){
        this.oneSymbol = Object.assign([],this.allSymbol[exchange]);
        // 获取输入的symbol 并进行过滤
        this.gainFilterSymbol(this.form.getFieldValue('symbol') || '');
      }
      if(symbol == '' || symbol){
         this.gainFilterSymbol(symbol);
      }
      if (celue) {
        this.celueIndex = celue; 
        if(this.formType == 'add'){
            this.form.resetFields([
            "exchange",
            "accountid",
            "symbol",
            "price",
            "price_range",
            "rate",
            "total_amount",
            "side",
            "min_time_interval",
            "every_amount"
            ]);
        }
      }
      if (exchange) {
        let arr = this.$store.state.initInfo.info[exchange].map(v => {
          return { label: v.label || v.value, value: v.value};
        });

        this.clientAcc = Object.assign([], arr);
      }
    },
    addTask() {
      this.dialogShow = true;
      const { form } = this;
      this.formType = 'add';
      this.editId = '';
      this.$nextTick(() => {
        this.form.resetFields();
        this.form.setFieldsValue({
          celue: "1"
        });
      });
    },
    handleTask(type, item) {
        switch(type){
            // 1 修改 2删除
            case "1": 
                this.dialogShow = true;
                const { form } = this;
                this.formType = 'edit';
                this.$nextTick(() => {
                    this.form.resetFields();
                    let obj = JSON.parse(JSON.stringify(item));
                    this.editId = item.Id;
                    console.log(obj);
                    switch(item.dataType){
                        case "1":
                            this.form.setFieldsValue({
                                celue: "1",
                                exchange : item.Exchange,
                                accountid : item.Accountid,
                                price : item.Price,
                                price_range : item.PriceRange,
                                rate : item.Rate*100,
                                side : String(item.Side),
                                symbol : item.Symbol,
                                total_amount : item.TotalAmount,
                                min_time_interval  : item.MinTimeInterval
                            });

                        break;
                        case "2":
                            let str = item.Additional.replace(/({|})/g,'');
                            let a = str.split(',');
                            let a1= [null];
                            let a3 = [null];
                            let keys = a.map((v,i)=>{
                                let a2 =  v.split(":");
                                a1.push(a2[0]*100);
                                a3.push(a2[1]*100);
                                return i+1;
                            })
                            this.form.setFieldsValue({
                                celue: "2",
                                exchange : item.Exchange,
                                accountid : item.Accountid,
                                price : item.Price,
                                every_amount : item.EveryAmount,
                                side : String(item.Side),
                                symbol : item.Symbol,
                                keys : keys,
                                total_amount : item.TotalAmount,
                                min_time_interval  : item.MinTimeInterval
                            });
                            setTimeout(()=>{
                                this.form.setFieldsValue({
                                    conditionRange: a1,
                                    conditionRate: a3
                                })
                            },0)
                        break;
                    }
                });
            break;
            case "2":
              switch(item.dataType){
                  case "1":
                  this.$api.deltone(item).then(obj=>{
                      this.$message.success('删除成功!');
                      this.init();
                  })
                  break;
                  case "2":
                  this.$api.deltow(item).then(obj=>{
                      this.$message.success('删除成功!');
                      this.init();
                  })
                  break;
              }
            break;
        }
    },
    submit() {}
  }
};
</script>

<style lang="scss" scoped>
.delegate{
}
.green {
  color: #009966;
}
.red {
  color: #ff6666;
}
.gray {
  color: #cccccc;
}
.blue {
  color: #1890ff;
}
.suff_icon{
  position: absolute;
  right: -30px;
  top: 3px;
}
.suff_icon:hover{
  cursor: help;
}
</style>

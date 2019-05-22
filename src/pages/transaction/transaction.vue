<template>
  <div style="background: #F0F2F5;"> 
    <a-card title="交易市场"
            :bordered="false"
            style="text-aligin:left">
      <a-radio-group @change="gainValue"
                     v-model="marketInfo.market"
                     buttonStyle="solid">
        <span v-for="item in arr"
              class="radio"
              :key="item.value">
          <a-radio-button :value="item.value">{{item.label}}</a-radio-button>
        </span>
      </a-radio-group>
    </a-card>
    <a-card title="交易对检索"
            :bordered="false"
            style="text-aligin:left;margin-top:20px;">
      <a-form :form="form"
              style="width:100%"
              layout="inline">
        <a-form-item label="交易对"
                     :label-col="{ span: 6 }"
                     :wrapper-col="{ span: 18 }">
          <a-input placeholder="示例：ETH-BTC"
                   v-decorator="['money', {rules: [{ required: true, message: '请输入交易对'  } , {pattern : new RegExp(/[A-Z]+-[A-Z]+/) , message : '请输入正确格式'}]}]"></a-input>
        </a-form-item>
        <a-button shape="circle"
                  icon="search"
                  @click="search"
                  style="margin-top:4px;" />
      </a-form>
    </a-card>
    <a-card title="现货交易"
            :bordered="false"
            style="text-aligin:left;margin-top:20px;">
      <a-row type="flex"
             justify="space-between">
        <a-col :xs='24' :sm="24" :md="11" :lg="11" :xl="11">
          <a-table :columns="columns" :dataSource="t1" :scroll="{ y: 400 }"  :locale="{emptyText : '暂无数据'}" size="small" :pagination="false">
                <span slot="price" slot-scope="text">
                  <span class="green pointer" @click.stop="setPrice('form2',text)">{{text}}</span>
                </span>
                <template slot="title" slot-scope="currentPageData">
                  <span><a-icon type="fall" style="margin-right:8px"/>买单(实时刷新)</span>
                </template>
          </a-table>
        </a-col>
        <a-col :xs='24' :sm="24" :md="11" :lg="11" :xl="11">
          <a-table :columns="columns" :dataSource="t2" :scroll="{ y: 400 }"  :locale="{emptyText : '暂无数据'}" size="small" :pagination="false">
                <span slot="price" slot-scope="text">
                  <span class="red pointer"  @click.stop="setPrice('form1',text)">{{text}}</span>
                </span>
                <template slot="title" slot-scope="currentPageData">
                 <span><a-icon type="rise"  style="margin-right:8px" />卖单(实时刷新)</span>  
                </template>
              </a-table>
        </a-col>
      </a-row>
      <a-row type="flex"
             style="margin-top:25px;"
             justify="space-between">
        <a-col :xs='24' :sm="24" :md="11" :lg="11" :xl="11">
          <a-card style="text-aligin:left"  class="card_head_small" :bodyStyle="{padding : '10px'}">
            <a-row slot="title" type="flex" justify="space-between">
              <span style="color: #009966; font-size: 14px">买入</span>
              <span style="color:#666;font-size:13px"><a-icon type="wallet" />&nbsp;&nbsp;&nbsp;{{available[1]}} {{currency[1]}}</span>
            </a-row>
            <a-form :form="form1">
              <a-form-item label="交易所客户号"
                           :label-col="{ span: 6 }"
                           :wrapper-col="{ span: 12 }">
                  <a-select
                    placeholder="请选择交易所客户号"
                    v-decorator="[
                      'num',
                      {rules: [{ required: true, message: '请选择交易所客户号' }]}
                    ]"
                    @change="gainAccInfo1"
                  >
                    <a-select-option :value="item.value" v-for="item in clientAcc" :key="item.value">
                      {{item.label}}
                    </a-select-option>
                  </a-select>
              </a-form-item>
              <a-form-item label="价格"
                           :label-col="{ span: 6 }"
                           style="white-space:nowrap;"
                           :wrapper-col="{ span: 12 }">
                <a-input   placeholder="请输入价格"  @blur="detailPrices('form1')"  v-decorator="[
                    'price',
                    {rules: [{ required: true, message: '请输入价格' },{pattern :  new RegExp(/((^\d+$)|(^\d+[\.]+\d+$))/g) , message : '请输入正确的数字' }]}
                  ]" /> 
                  <!-- <span style="color:#009966;margin-left:8px">≈25.53(CNY)</span> -->
              </a-form-item>
              <a-form-item label="数量"
                           :label-col="{ span: 6 }"
                           :wrapper-col="{ span: 12 }">
                <a-input   placeholder="请输入数量" @blur="detailPrices('form1')"  v-decorator="[
                    'sum',
                    {rules: [{ required: true, message: '请输入数量' },{pattern :  new RegExp(/((^\d+$)|(^\d+[\.]+\d+$))/g) , message : '请输入正确的数字' }]}
                  ]" />
                  
              <a-radio-group @change="PurchaseSumSelect('change')"  v-model="sum1"  size="small" buttonStyle="solid">
                  <a-radio-button 
                      :key="item.value"
                      :value="item.value"
                      @click="PurchaseSumSelect"
                      v-for="item in options.arr"
                      >{{item.label}}</a-radio-button>
              </a-radio-group>
              </a-form-item> 
              <template   v-if="accInfo.info" >
              <span>
                  <a-form-item :label="currency[0] + '可用'"
                            :label-col="{ span: 6 }"
                            style="white-space:nowrap;"
                            :wrapper-col="{ span: 12 }">
                  <span>{{available[0]}}</span>          
                  </a-form-item>
              </span>
              <span>
                  <a-form-item :label="currency[1] + '可用'"
                            :label-col="{ span: 6 }"
                            style="white-space:nowrap;"
                            :wrapper-col="{ span: 12 }">
                  <span>{{available[1]}}</span>          
                  </a-form-item>
              </span>
              </template>                          
              <a-form-item label="金额"
                           :label-col="{ span: 6 }"
                           style="white-space:nowrap;"
                           :wrapper-col="{ span: 12 }">
                <a-input disabled placeholder="自动计算" v-decorator="['prices']" /><span style="margin-left:8px">({{currency[1]}})</span> 
              </a-form-item>
              <!-- <a-form-item label="折合"
                           :label-col="{ span: 6 }"
                           style="white-space:nowrap;"
                           :wrapper-col="{ span: 12 }">
                <a-input disabled placeholder="自动计算" v-model="form1.prices" /><span style="margin-left:8px">(CNY)</span> 
              </a-form-item> -->
            </a-form>
            <a-row type="flex" justify="end">
                <a-button type="primary"
                          style="background: #009966;border:1px solid #009966"
                          @click="Purchase">
                  买入
                </a-button>
            </a-row>
          </a-card>
        </a-col>
        <a-col :xs='24' :sm="24" :md="11" :lg="11" :xl="11">
          <a-card style="text-aligin:left" class="card_head_small" :bodyStyle="{padding : '10px'}">
            <a-row slot="title" type="flex" justify="space-between">
              <span style="color: #FF6666; font-size: 14px">卖出</span>
              <span style="color:#666;font-size:13px"><a-icon type="wallet" />&nbsp;&nbsp;&nbsp;{{available[0]}} {{currency[0]}}</span>
            </a-row>
            <a-form :form="form2">
              <a-form-item label="交易所客户号"
                           :label-col="{ span: 6 }"
                           :wrapper-col="{ span: 12 }">
                <a-select
                    placeholder="请选择交易所客户号"
                    v-decorator="[
                      'num',
                      {rules: [{ required: true, message: '请选择交易所客户号' }]}
                    ]"
                    @change="gainAccInfo2"
                  >
                    <a-select-option :value="item.value" v-for="item in clientAcc" :key="item.value">
                      {{item.label}}
                    </a-select-option>
                  </a-select>
              </a-form-item>
              <a-form-item label="价格"
                           :label-col="{ span: 6 }"
                           style="white-space:nowrap;"
                           :wrapper-col="{ span: 12 }">
                <a-input   placeholder="请输入价格"  @blur="detailPrices('form2')" v-decorator="[
                    'price',
                    {rules: [{ required: true, message: '请输入价格' },{pattern :  new RegExp(/((^\d+$)|(^\d+[\.]+\d+$))/g) , message : '请输入正确的数字' }]}
                  ]" />
                  <!-- <span style="color:#FF6666;margin-left:8px">≈25.53(CNY)</span> -->
              </a-form-item>
              <a-form-item label="数量"
                           :label-col="{ span: 6 }"
                           :wrapper-col="{ span: 12 }">
                           
                <a-input   placeholder="请输入数量" @blur="detailPrices('form2')" v-decorator="[
                    'sum',  
                    {rules: [{ required: true, message: '请输入数量' },{pattern :  new RegExp(/((^\d+$)|(^\d+[\.]+\d+$))/g) , message : '请输入正确的数字' }]}
                  ]" />     
                <a-radio-group @change="sellOutSelect('change')" v-model="sum2"   size="small" buttonStyle="solid">
                    <a-radio-button 
                        :key="item.value"
                        :value="item.value"
                        v-for="item in options.arr"
                        @click="sellOutSelect" 
                        >{{item.label}}</a-radio-button>
                </a-radio-group>
              </a-form-item>
              <template   v-if="accInfo.info" >   
                <span>
                    <a-form-item :label="currency[0] + '可用'"
                              :label-col="{ span: 6 }"
                              style="white-space:nowrap;"
                              :wrapper-col="{ span: 12 }">
                    <span>{{available[0]}}</span>          
                    </a-form-item>
                </span>
                <span>
                    <a-form-item :label="currency[1] + '可用'"
                              :label-col="{ span: 6 }"
                              style="white-space:nowrap;"
                              :wrapper-col="{ span: 12 }">
                    <span>{{available[1]}}</span>          
                    </a-form-item>
                </span>
              </template>
              <a-form-item label="金额"
                           :label-col="{ span: 6 }"
                           style="white-space:nowrap;"
                           :wrapper-col="{ span: 12 }">
                <a-input disabled placeholder="自动计算"  v-decorator="['prices']" /><span style="margin-left:8px">({{currency[1]}})</span> 
              </a-form-item>
            </a-form>
            <a-row type="flex" justify="end">
                <a-button type="primary"
                          style="background: #FF6666;border:1px solid #FF6666"
                          @click="sellOut">
                  卖出
                </a-button>
            </a-row>
          </a-card>
        </a-col>
      </a-row>

    </a-card>
    <a-card 
            :bordered="false"
            :bodyStyle="{padding : '0'}"
            style="text-aligin:left;margin-top:20px">
            <a-row slot="title" type="flex" justify="space-between">
              <span>
                历史订单
              </span>
                  <a-radio-group @change="selectHisTime"
                                v-model="hisForm.time"
                                buttonStyle="solid">
                      <a-radio-button :value="1">近一天</a-radio-button>
                      <a-radio-button :value="3">近三天</a-radio-button>
                      <a-radio-button :value="5">近五天</a-radio-button>
                  </a-radio-group>

            </a-row>
            <!-- <a-table :columns="columes1" :dataSource="hisArr" :loading="table3Load" :scroll="{ y: 600 }" :pagination="{pageSize : 10 }"> -->
            <a-table :columns="columes1" :dataSource="hisArr"  :scroll="{ y: 600 }" :locale="{emptyText : '暂无数据'}" :pagination="{pageSize : 10 }">
               <span  slot="Ts" slot-scope="text" >{{$time(new Date(text),'yyyy-MM-dd')}}</span>
               <span slot="Type" slot-scope="text">   
                  <template v-if="/buy/.test(text.toLowerCase())">
                    <span style="color:#009966;font-size:13px">买入</span>
                  </template>
                  <template v-else>
                    <span style="color:#FF6666;font-size:13px;">卖出</span>
                  </template>
               </span>
               <span slot="Source" slot-scope="text">
                 <template v-if="text == 'api'">
                   接口
                 </template>
                 <template v-else-if="/user/.test(text)">
                   用户操作
                 </template>
                 <template v-else-if="/auto/.test(text)">
                   智能委托
                 </template>
               </span>
               <span slot="Status" slot-scope="text">
                 <template v-if="text == '0'">
                   订单初始化
                 </template>
                 <template v-else-if="text == '1'">
                   全部成交
                 </template>
                 <template v-else-if="text == '2'">
                   订单错误
                 </template>
                 <template v-else-if="text == '3'">
                   部分成交
                 </template>
                 <template v-else-if="text == '4'">
                   部分成交部分撤单
                 </template>
                 <template v-else-if="text == '5'">
                   撤单成功
                 </template>
               </span>
               <span slot="action" slot-scope="text , record">
                 <template v-if="record.Status == '0' || record.Status == '3'">
                   <a-popconfirm title="确定撤销该订单？" @confirm="cancleOrder(record)"  okText="Yes" cancelText="No">
                      <a-button size="small" >撤单</a-button>
                    </a-popconfirm>
                 </template>
                 <template v-else>
                    ---
                 </template>
               </span>
            </a-table>
    </a-card>
  </div>
</template> 
<script>
export default {
  name: "transaction",
  data() {
    return {
      arr: [],
      radioValue: "",
      table3Load : false,
      form: this.$form.createForm(this),
      form1: this.$form.createForm(this),
      form2: this.$form.createForm(this),
      autoFreshTime : '',
      sum1 : '',
      sum2 : '',
      hisForm : {time : '',accountid : ''},
      // hisArr : [
        // {index : 0 , key : 0 , "Id":44153,"Account":"","Accountid":"28792967","Orderid":43221047,"Exchange":"bian","Amount":"489.0000000000","Price":"0.0000907100","Symbol":"engbtc","Source":"api","Type":"LIMIT","Ts":1552015958636,"Cancelflag":0,"Reserved1":"BUY","Reserved2":"0","Reserved3":"0","Reserved4":"","Dealamount":0,"Dealcash":0,"Dealfee":0,"Feesymbol":"bnb","Dealfee2":0,"Fees2ymbol":"","Status":0,"ErrorMsg":""},
        // {index :1 ,key :1,"Id":44154,"Account":"","Accountid":"28792967","Orderid":43221158,"Exchange":"bian","Amount":"296.0000000000","Price":"0.0000907100","Symbol":"engbtc","Source":"api","Type":"LIMIT","Ts":1552016168671,"Cancelflag":0,"Reserved1":"BUY","Reserved2":"0","Reserved3":"0","Reserved4":"","Dealamount":0,"Dealcash":0,"Dealfee":0,"Feesymbol":"bnb","Dealfee2":0,"Fees2ymbol":"","Status":0,"ErrorMsg":""},
        // {index :2 ,key :2,"Id":44155,"Account":"","Accountid":"28792967","Orderid":43221279,"Exchange":"bian","Amount":"119.0000000000","Price":"0.0000907300","Symbol":"engbtc","Source":"api","Type":"LIMIT","Ts":1552016443737,"Cancelflag":0,"Reserved1":"BUY","Reserved2":"0","Reserved3":"0","Reserved4":"","Dealamount":119,"Dealcash":0.01079687,"Dealfee":0,"Feesymbol":"bnb","Dealfee2":0.0952,"Fees2ymbol":"","Status":1,"ErrorMsg":""},
        // {index : 3,key :3 ,"Id":44156,"Account":"","Accountid":"28792967","Orderid":43221344,"Exchange":"bian","Amount":"296.0000000000","Price":"0.0000907300","Symbol":"engbtc","Source":"api","Type":"LIMIT","Ts":1552016657750,"Cancelflag":0,"Reserved1":"BUY","Reserved2":"0","Reserved3":"0","Reserved4":"","Dealamount":296,"Dealcash":0.02685608,"Dealfee":0,"Feesymbol":"bnb","Dealfee2":0.2368,"Fees2ymbol":"","Status":1,"ErrorMsg":""},
        // {index : 4 , key :4 ,"Id":44157,"Account":"","Accountid":"28792967","Orderid":43221453,"Exchange":"bian","Amount":"308.0000000000","Price":"0.0000907800","Symbol":"engbtc","Source":"api","Type":"LIMIT","Ts":1552016915785,"Cancelflag":0,"Reserved1":"BUY","Reserved2":"0","Reserved3":"0","Reserved4":"","Dealamount":308,"Dealcash":0.02796024,"Dealfee":0,"Feesymbol":"bnb","Dealfee2":0.2464,"Fees2ymbol":"","Status":1,"ErrorMsg":""}
        // ],
      columes1 :[],
      columns:[
        { title: '序号', dataIndex: 'index', key: '1' , width : 100 , align : 'center' },
        { title: '价格', dataIndex: 'price', key: '2', width : 150 , scopedSlots : {customRender : 'price'} , align : 'center' },
        { title: '数量', dataIndex: 'sum', key: '3' , align : 'center' },
      ]
    };
  },
  computed:{
    marketInfo(){
      return this.$store.state.marketInfo;
    },
    clientAcc(){
      let obj = this.$store.state.initInfo.info[this.marketInfo.market];
      if(obj){
        return obj.map(v => {
            return { label: v.label || v.value, value: v.value };
          });
      }
      return [];
    },
    initInfo(){
      return this.$store.state.initInfo;
    },
    options(){
      return this.$store.state.selectData.sumOptions;
    },
    accInfo(){
      return this.$store.state.accInfo;
    },
    currency(){
      return this.marketInfo.currency.split('-');
    },
    available(){
      var arr = this.currency;
      var a = [];
      if(!this.accInfo.info || !this.accInfo.info.info[arr[0]]){
        a[0] = 0;
      }else{
        a[0] = this.accInfo.info.info[arr[0]].Available;
      }
      if(!this.accInfo.info || !this.accInfo.info.info[arr[1]]){
        a[1] = 0;
      }else{
        a[1] = this.accInfo.info.info[arr[1]].Available;
      }
      return [a[0],a[1]];
    },
    hisArr(){  
      return this.$store.state.orderMsgInfo.arr;
    },
    table(){
      if(!this.marketInfo.table){
        return {table1 : [] , table2 : []}
      }
      var a1 = Object.assign([],this.marketInfo.table.BidsPrice);
      var a2 = Object.assign([],this.marketInfo.table.BidsVolume);
      var a3 = Object.assign([],this.marketInfo.table.AsksPrice);
      var a4 = Object.assign([],this.marketInfo.table.AsksVolume);
      // 首次查到详情设置价格
      if(this.marketInfo.firstLoad == 1){
        this.form1.setFieldsValue({
          price : a3[0]
        })
        this.form2.setFieldsValue({
          price : a1[0]
        })
      }
      var a11 = [], a22 = [];
      a1.forEach((v,i) => {
          a11.push(
            {index : i , price : v , sum : a2[i], key : i}
          )
      });
      a3.forEach((v,i) => {
          a22.push(
            {index : i , price : v , sum : a2[i], key : i}
          )
      });
      return {table1 : Object.assign([],a11) , table2 : Object.assign([],a22) };  
    },
    t1(){
      // return [
      //   {index : 0 , price : '1', sum : '2'},
      //   {index : 0 , price : '1', sum : '2'},
      //   {index : 0 , price : '1', sum : '2'},
      //   {index : 0 , price : '1', sum : '2'},
      //   {index : 0 , price : '1', sum : '2'},
      //   {index : 0 , price : '1', sum : '2'},
      //   {index : 0 , price : '1', sum : '2'},
      //   {index : 0 , price : '1', sum : '2'},
      //   {index : 0 , price : '1', sum : '2'},
      //   {index : 0 , price : '1', sum : '2'},
      //   {index : 0 , price : '1', sum : '2'},
      //   {index : 0 , price : '1', sum : '2'},
      //   {index : 0 , price : '1', sum : '2'},
      //   {index : 0 , price : '1', sum : '2'},
      //   {index : 0 , price : '1', sum : '2'},
      //   {index : 0 , price : '1', sum : '2'},
      //   {index : 0 , price : '1', sum : '2'},
      //   {index : 0 , price : '1', sum : '2'},
      //   {index : 0 , price : '1', sum : '2'},
      //   {index : 0 , price : '1', sum : '2'},
      // ]
      return this.$store.state.table1;
    },
    t2(){
      // return [
      //   {index : 1 , price : '1', sum : '2'},
      //   {index : 2 , price : '1', sum : '2'},
      //   {index : 3 , price : '1', sum : '2'},
      //   {index : 4 , price : '1', sum : '2'},
      //   {index : 5 , price : '1', sum : '2'},
      //   {index : 6 , price : '1', sum : '2'},
      //   {index : 7 , price : '1', sum : '2'},
      //   {index : 8 , price : '1', sum : '2'},
      //   {index : 9 , price : '1', sum : '2'},
      //   {index : 10 , price : '1', sum : '2'},
      //   {index : 11 , price : '1', sum : '2'},
      //   {index : 12, price : '1', sum : '2'},
      //   {index : 13, price : '1', sum : '2'},
      //   {index : 14, price : '1', sum : '2'},
      //   {index : 15, price : '1', sum : '2'},
      //   {index : 16, price : '1', sum : '2'},
      //   {index : 17, price : '1', sum : '2'},
      //   {index : 18, price : '1', sum : '2'},
      //   {index : 19, price : '1', sum : '2'},
      //   {index : 20, price : '1', sum : '2'},
      // ]
      return this.$store.state.table2;
    },
  },
  created() {
    this.arr = this.$staticData.d1;
    let arr = JSON.parse(JSON.stringify(this.$store.state.selectData.hisTaskTable));
    arr.push( { title: '操作', dataIndex: 'action', key: '10' , width : 100, scopedSlots : {customRender : 'action'}});
    this.columes1 = Object.assign([],arr);
    this.$store.dispatch('subscribeMarket');
  },
  beforeDestroy(){
    clearTimeout(this.autoFreshTime);
  },
  mounted(){
    this.form.setFieldsValue({
      money : this.marketInfo.currency
    });
  },
  methods: {
    gainValue() {
      this.search();
    },
    search() {
       this.form.validateFields((err, values) => {
        if (!err) {
          // 需要去重新检查当前交易所所拥有的客户号 TODO
          this.$store.state.marketInfo.currency = values.money;
          clearTimeout(this.autoFreshTime);
          this.autoFreshTime = '';
          this.$store.dispatch('subscribeMarket').then(_=>{
            // 重置客户号
            this.form1.setFieldsValue({
              num : '',
              sum : ''
            })
            this.form2.setFieldsValue({
              num : '',
              sum : ''
            })
          }).catch(()=>{
            this.$message.warning('查看行情信息失败!');
          })
        }
      });
    },
    PurchaseSumSelect(type){
      let values = this.form1.getFieldsValue();
      if(!values.num){
        // this.$message.warning('请先输入客户号!');
        this.form1.validateFields(['num']);
        this.sum1 = '';
        return;
      }
      if(!values.price){
        this.form1.validateFields(['price']);
        this.sum1 = '';
        return;
      }
      var arr = this.marketInfo.currency.split('-');
      if(!this.accInfo.info || !this.accInfo.info.info[arr[1]]){
        if(type != 'change'){
          this.$message.warning('未查询到用户持仓数,请手动输入数量!');
        }
        this.sum1 = '';
        return;
      }
      this.form1.setFieldsValue({
        // sum :   Number(this.accInfo.info.info[arr[1]].Available) / Number(values.price)  * Number(this.sum1)
        sum :  this.$utils.mul(this.$utils.div(this.accInfo.info.info[arr[1]].Available,values.price),this.sum1) 
      })
      // 同时去计算金额
      this.detailPrices('form1');
    },
    sellOutSelect(type){
      let values = this.form2.getFieldsValue();
      if(!values.num){
        // this.$message.warning('请先输入客户号!');
        this.form2.validateFields(['num']);
        this.sum2 = '';
        return;
      }
      if(!values.price){
        this.form2.validateFields(['price']);
        this.sum2 = '';
        return;
      }
      var arr = this.marketInfo.currency.split('-');
      if(!this.accInfo.info){
        if(type != 'change' || !this.accInfo.info.info[arr[1]]){
          this.$message.warning('未查询到用户持仓数,请手动输入数量!');
        }
        this.sum2 = '';
        return;
      }
      this.form2.setFieldsValue({
        sum :  this.$utils.mul(this.$utils.div(this.accInfo.info.info[arr[1]].Available,values.price),this.sum2)
      })
      // 同时去计算金额
      this.detailPrices('form2');
    },
    setPrice(type,text){
      this[type].setFieldsValue({
        price :  text
      })
      // 同时去计算金额
      this.detailPrices(type);
    },
    Purchase() {
       this.form1.validateFields((err, values) => {
        if (!err) {
          if(this.table3Load){
            this.$message.warning('请等待历史订单加载完毕!');
            return;
          }
          // 发送 订单只传递基础数据
          this.$store.dispatch('orderreq',{
            'account-id' : String(values.num),
            'amount' : String(values.sum),
            'price' : String(values.price),
            type1 : 'buy'
          })
          this.autoFresh();
        }
      });
    },
    gainAccInfo1(value){
      this.form1.setFieldsValue({
        num: value,
      });
      if(this.accInfo.id == value){
        return;
      }
      this.$store.state.accInfo.market = this.marketInfo.market;
      this.$store.dispatch('accInfo',value);
      this.hisForm.time = 1;
      this.hisForm.accountid = value;
      this.selectHisTime();
    },
    // 撤销订单
    cancleOrder(item){
      this.$store.dispatch('orderCancle',{
        accountid : item.Accountid,
        orderid : item.Orderid
      })
      // item.Status = '5';
    },
    autoFresh(){
        this.autoFreshTime = setTimeout(()=>{
          this.selectHisTime();
        },2000)
    },
    selectHisTime(e){
      if(!this.hisForm.accountid){
        this.$message.warning('请先选择客户号！');
        this.hisForm.time = '';
        return;
      }
      this.table3Load = true;
      let t = Number(String(Date.parse(new Date())).substr(0,10));
      let t1 = 0;
      let one = 24*60*60;
      t1 = t - one*Number(this.hisForm.time);
      this.$api.getOrders({accountid : this.hisForm.accountid , start : t1 , end : t , symbol : this.marketInfo.currency.replace('-','') , exchange : this.marketInfo.market}).then(obj=>{
          let arr1 = [];
          if(obj.data){
            obj.data.forEach((v,i)=>{
              let o = Object.assign({key : v.Orderid , index : v.Orderid},v);
              if(String(o.Ts).length < 13){
                  o.Ts = Number(o.Ts + '000');
              }
              if(o.Status != 2){
                arr1.push(o);
              }
            })
          }
          if(this.autoFreshTime){
            clearTimeout(this.autoFreshTime);
            this.autoFreshTime = '';
            this.autoFresh();
          }
          this.table3Load = false;
          this.$store.state.orderMsgInfo.arr = JSON.parse(JSON.stringify(arr1));
          this.$store.state.orderMsgInfo = Object.assign({},this.$store.state.orderMsgInfo);
          // this.hisArr = Object.assign([],this.hisArr);
      })
    },
    gainAccInfo2(value){
      this.form2.setFieldsValue({
        num: value,
      });
      if(this.accInfo.id == value){
        return;
      }
      this.$store.state.accInfo.market = this.marketInfo.market;
      this.$store.dispatch('accInfo',value);
      this.hisForm.time = 1;
      this.hisForm.accountid = value;
      this.selectHisTime();
    },
    sellOut(){
       this.form2.validateFields((err, values) => {
        if (!err) {
          if(this.table3Load){
            this.$message.warning('请等待历史订单加载完毕!');
            return;
          }
          let values = this.form2.getFieldsValue();
          // 发送 订单只传递基础数据
          this.$store.dispatch('orderreq',{
            'account-id' : String(values.num),
            'amount' : String(values.sum),
            'price' : String(values.price),
            type1 : 'sell'
          })
          this.autoFresh();
        }
      });
    },
    detailPrices(type){
      let values = this[type].getFieldsValue();
      if(values.price && values.sum && /((\d+$)|(\d+[\.]+\d+$))/g.test(values.price) && /((\d+$)|(\d+[\.]+\d+$))/g.test(values.sum)){
        this[type].setFieldsValue({
          // prices :  Number(values.price) * Number(values.sum)
          prices :  this.$utils.mul(values.price,values.sum)
        })
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.radio {
  display: inline-block;
  margin: 0 15px 15px 0;
}
.green{
  color: #009966;
}
.pointer{
  &:hover{
    cursor: pointer;
  }
}
.red{
  color: #FF6666; 
}
</style>

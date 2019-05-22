<template>
<div class="allAssets">
    <a-table  :columns="columns" :dataSource="arr" bordered  
                 :scroll="{ y: 550 }" :pagination="{
      size : 'small'
    }">
        <div slot="exchange" slot-scope="text , record">
          <logo  :type="text" style="margin-right:8px"/>{{text}}
        </div>
        <div slot="acc" slot-scope="text , record">
          <a-checkbox-group :options="[{value : record.str, label : text || record.account_id}]"  v-model="checkedList" @change="onChange">&nbsp;&nbsp;&nbsp;</a-checkbox-group></div>
         <span slot="all" slot-scope="text , record">
           <template v-if="allInfo[record.str]">
             <a-icon type="wallet"></a-icon>   {{allInfo[record.str].BtcTotal}}
           </template>
           <template v-else>
             ---
           </template>
         </span>  
         <span slot="Data" slot-scope="text , record">
           <template v-if="allInfo[record.str]">
             资产明细（共{{allInfo[record.str].len}}条） 
             <a-tooltip placement="top" >
                <template slot="title">
                  <span>查看明细</span>
                </template>
                <a-icon type="eye" class="pointer" @click.stop="viewAcc(record)"/>
            </a-tooltip>
               <!-- <a-collapse  :bordered="false" style="border:none">
                  <a-collapse-panel :header="`资产明细（共${allInfo[record.str].len}条）`" key="1" style="border:none">
                     <a-table :columns="columns1" :dataSource="allInfo[record.str].Data" bordered size="small" :pagination="false">
              
                    </a-table> 
                    <div v-for="(item,index) in allInfo[record.str].Data" :key="index">
                      币种：{{item.Symbol}}；
                      可用：{{item.Available}}；
                      冻结：{{item.OnOrders}}；
                      BTC计价：{{item.BtcValue}}；
                    </div>
                  </a-collapse-panel>
                </a-collapse> -->
           </template>
           <template v-else>
             ---
           </template>
           <!-- <a-collapse  :bordered="false" style="border:none">
                  <a-collapse-panel :header="`资产明细（共${s.length}条）`" key="1" style="border:none">
                     <a-table :columns="columns1" :dataSource="s" bordered size="small" defaultSortOrder="BtcValue" :pagination="false">
              
                    </a-table>
                    <div v-for="(item,index) in s" :key="index">
                      <a-divider dashed></a-divider>
                      币种：{{item.Symbol}}；
                      可用：{{item.Available}}；
                      冻结：{{item.OnOrders}}；
                      BTC计价：{{item.BtcValue}}；
                    </div>
                  </a-collapse-panel>
          </a-collapse> -->
         </span>   
         <!-- <span slot="available" slot-scope="text , record">
            {{
              allInfo[record.str]  && allInfo[record.str].Data && allInfo[record.str].Data[0]   ?  
              `${ ( (allInfo[record.str].Data[0].Available || 0 )  +  (allInfo[record.str].Data[1] && allInfo[record.str].Data[1].Available ? allInfo[record.str].Data[1].Available : 0))}(${allInfo[record.str].Data[0].Symbol})`
              : '---'}}
         </span>   
         <span slot="OnOrders" slot-scope="text , record">
            {{allInfo[record.str]  && allInfo[record.str].Data && allInfo[record.str].Data[0]   ?  
              `${ ( (allInfo[record.str].Data[0].OnOrders || 0 )  +  (allInfo[record.str].Data[1] && allInfo[record.str].Data[1].OnOrders ? allInfo[record.str].Data[1].OnOrders : 0))}(${allInfo[record.str].Data[0].Symbol})`
              : '---'}}
         </span>
         <span slot="BtcValue" slot-scope="text , record">
            {{allInfo[record.str]  && allInfo[record.str].Data  && allInfo[record.str].Data[1] ?  
            `${ ( (allInfo[record.str].Data[0].BtcValue || 0 )  +  (allInfo[record.str].Data[1] && allInfo[record.str].Data[1].BtcValue ? allInfo[record.str].Data[1].BtcValue : 0))}(${allInfo[record.str].Data[0].Symbol})`
            : '---'}}
         </span>      -->
          <span class="action"
                slot="action"
                slot-scope="text , record">
                <a-button @click="handleAcc('1',record)" size="small">修改</a-button>
                <a-popconfirm title="确定删除该账号？"
                                    @confirm="handleAcc('2',record)"
                                    okText="Yes"
                                    cancelText="No">
                    <a-button size="small">删除</a-button>
                </a-popconfirm>
          </span>
         <span slot="frozen">
           ---
         </span>   
    </a-table>
    <div style="margin-top:30px"></div>
    <a-row type="flex" justify="center" align="middle" v-if="arr.length > 0">
      <a-checkbox
        :indeterminate="indeterminate"
        @change="onCheckAllChange"
        :checked="checkAll"
      >
        全选
      </a-checkbox>
        <!-- <a-checkbox-group :options="plainOptions" v-model="checkedList" @change="onChange" >全选</a-checkbox-group> -->
        <a-button type="primary"  :disabled="checkedList.length == 0" @click="all">汇总</a-button>
        <span style="margin-left:30px">总资产：{{BtcTotal  || 0}} (BTC)</span>
    </a-row>
     <a-drawer
      placement="right"
      width="40%"
      wrapClassName="nopaddingdraw"
      :closable="false"
      :wrapStyle="{padding : '0'}"
      @close="visible = false"
      :visible="visible"
    >
      <a-row slot="title" type="flex" justify="space-between">
       <logo  :type="viewAccInfo.exchange"></logo>  {{viewAccInfo.exchange}}
       <span style="color:#666"><a-icon type="credit-card" style="margin-right:8px" /> {{viewAccInfo.account ||   viewAccInfo.account_id}}</span>
      </a-row>
      <template v-if="viewAccInfo.str">
        <a-table class="noborderTable" :columns="columns1" :dataSource="allInfo[viewAccInfo.str].Data"  size="small" :pagination="false">
                
        </a-table>
      </template>
    </a-drawer>
</div>
</template>

<script>
import logo from "@/components/logo.vue";
const market = {};
const columns1 = [
  {
    title : '币种', 
    align : 'center',
    dataIndex : 'Symbol',
  },
  {
    title : '可用',
     align : 'center',
    dataIndex : 'Available',
  },
  {
    title : 'BTC计价',
     align : 'center',
    dataIndex : 'BtcValue'
    // defaultSortOrder
  },
  
]
const columns = [{
  title: '交易所',
  dataIndex: 'exchange',
  width : 220,
  scopedSlots : {customRender : 'exchange'}
}, {
  title: '账户',
  dataIndex: 'account',
  width : 220,
  scopedSlots : {customRender : 'acc'}
},{
  title: '总资产',
  dataIndex: 'all',
  width : 220,
  scopedSlots : {customRender : 'all'}
},  {
  title: '明细',
  dataIndex: 'Data',
  scopedSlots : {customRender : 'Data'}
}
];
export default {
  data() {
    return {
      columns,
      columns1,
      market : [],
      indeterminate: false,
      viewAccInfo : {},
      checkAll: false,
      visible : false,
      BtcTotal : '',
      s : [
        {Symbol : 'BTC' , Available : '1' , OnOrders : '2', BtcValue : '1'},
        {Symbol : 'BTC1' , Available : '1' , OnOrders : '2', BtcValue : '0.001'},
        {Symbol : 'BTC2' , Available : '1' , OnOrders : '2', BtcValue : '0.001'},
        {Symbol : 'BTC3' , Available : '1' , OnOrders : '2', BtcValue : '3'},
        {Symbol : 'BTC4' , Available : '1' , OnOrders : '2', BtcValue : '4'},
      ],
      formType : 'add',
      checkedList : []
    }
  },
  components:{logo},
  computed:{
      arr(){
         console.log(this.$store.state.initInfo.allAcc)
          return this.$store.state.initInfo.allAcc;
      },
      plainOptions(){
        return this.$store.state.initInfo.allAccOptions;
      },
      allInfo(){
        console.log('进行数据更新......');
        console.log(this.$store.state.allAccInfo);
        return this.$store.state.allAccInfo;
      },
      s1(){
        return this.s1.sort(this.compare('BtcValue'));
      }
  },
  mounted(){
    this.$store.dispatch('gainAllAcc');
  },
  methods: {
    handleCancel(){
      this.dialogShow = false;
    },
    viewAcc(item){
      this.viewAccInfo = Object.assign({},item);
      if(this.allInfo[item.str].Data.length > 0 ){
        this.visible = true;
      }else{
        this.$message.info('当前无资产明细');
      }
    },
    onChange (checkedList) {
      let {plainOptions} = this;
      this.indeterminate = !!checkedList.length && (checkedList.length < plainOptions.length)
      this.checkAll = checkedList.length === plainOptions.length
    },
    onCheckAllChange (e) {
      let {plainOptions} = this;
      Object.assign(this, {
        checkedList: e.target.checked ? plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked,
      })
    },
    all(){
      let allNum = 0;
      this.checkedList.forEach((v)=>{
        allNum = allNum + (this.allInfo[v] ? this.allInfo[v].BtcTotal : 0);
      })
      this.BtcTotal = allNum;
    }
  },
}
</script>

<style scoped>
.allAssets{
    /* height: calc(100vh -  155px);
    pa */
    padding-bottom: 15px;
    background: white;
}
</style>

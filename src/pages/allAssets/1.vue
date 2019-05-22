<template>
<div class="allAssets">
  <a-row type="flex" justify="end" style="padding-bottom:18px;background:#f0f2f5">
    <a-button type="primary" @click="addAcc">新增账户</a-button>
  </a-row>
    <a-table  :columns="columns" :dataSource="arr" bordered :pagination="false">
        <div slot="acc" slot-scope="text , record">
          <a-checkbox-group :options="[{value : record.str, label : text}]"  v-model="checkedList" @change="onChange">&nbsp;&nbsp;&nbsp;</a-checkbox-group></div>
         <span slot="all" slot-scope="text , record">
            {{allInfo[record.str] ? allInfo[record.str].BtcTotal : '---'}}
         </span>   
         <span slot="available1" slot-scope="text , record">
            {{allInfo[record.str]  && allInfo[record.str].BtcTotal ?  `${allInfo[record.str].Data[0].Available}(${allInfo[record.str].Data[0].Symbol})`: '---'}}
         </span>   
         <span slot="available2" slot-scope="text , record">
            {{allInfo[record.str]  && allInfo[record.str].BtcTotal ?  `${allInfo[record.str].Data[1].Available}(${allInfo[record.str].Data[1].Symbol})`: '---'}}
         </span>   
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
    <a-drawer :title="formType == 'add' ? '新增账号' : '更新账号信息'"
              :width="600"
              @onValuesChange="formValueChange"
              @close="handleCancel"
              :visible="dialogShow"
              :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}">
      <a-form :form="form"
              style="text-align:left;padding-bottom:40px">
        <a-form-item label="交易所"
                     :label-col="{ span: 6 }"
                     :wrapper-col="{ span: 14 }">
          <a-input placeholder="请输入交易所"
                     :disabled="formType == 'edit'"
                   v-decorator="[
                        'exchange',
                        {rules: [{ required: true, message: '请输入交易所' }]}
                    ]" />
        </a-form-item>
        <a-form-item label="客户号"
                     :label-col="{ span: 6 }"
                     :wrapper-col="{ span: 14 }">
          <a-input placeholder="请输入客户号"
                     :disabled="formType == 'edit'"
                   v-decorator="[
                        'account_id',
                        {rules: [{ required: true, message: '请输入客户号' },{validator : isNumVaditor, trigger : 'change'}]}
                    ]" />
        </a-form-item>
        <a-form-item label="Api Key"
                     :label-col="{ span: 6 }"
                     :wrapper-col="{ span: 14 }">
          <a-textarea placeholder="请输入api key" :autosize="{ minRows: 4, maxRows: 6 }"
                   v-decorator="[
                        'access_key',
                        {rules: [{ required: true, message: '请输入api key' }]}
                    ]" />
        </a-form-item>
        <a-form-item label="serect key"
                     :label-col="{ span: 6 }"
                     :wrapper-col="{ span: 14 }">
          <a-textarea placeholder="请输入serect key" :autosize="{ minRows: 4, maxRows: 6 }"
                   v-decorator="[
                        'serect_key',
                        {rules: [{ required: true, message: '请输入serect key' }]}
                    ]" />
        </a-form-item>
        <a-form-item label="basic coin"
                     :label-col="{ span: 6 }"
                     :wrapper-col="{ span: 14 }">
          <a-input placeholder="请输入basic coin"
                   v-decorator="[
                        'basiccoin'
                    ]" />
        </a-form-item>
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
      callback();
    } else {
      callback(new Error("请输入正确的数字"));
    }
  } else {
    callback();
  }
};
const market = {};
const columns = [{
  title: '交易所',
  dataIndex: 'exchange',
  customRender: (value, row, index) => {
        const obj = {
          children: value,
          attrs: {},
        };
        // console.log(value);
        // if(market[value]){
        //     if(market[value].indexOf(index) == -1){
        //       obj.attrs.rowSpan = 0;
        //       market[value].push(index);
        //     }else{
        //       obj.attrs.rowSpan = 1;
        //       market[value].push(index);
        //     }
        // }else{
        //     console.log(index);
        //     market[value] = [];
        //     market[value].push(index);
        //     obj.attrs.rowSpan = 2;
        // }
        return obj;
      },
}, {
  title: '账户',
  dataIndex: 'account_id',
  scopedSlots : {customRender : 'acc'}
}, {
  title: '总资产',
  dataIndex: 'all',
  scopedSlots : {customRender : 'all'}
}, {
  title: '可用资产',
  dataIndex: 'available1',
  scopedSlots : {customRender : 'available1'}
},{
  title: '可用资产',
  dataIndex: 'available2',
  scopedSlots : {customRender : 'available2'}
},{
  title: '冻结资产',
  dataIndex: 'frozen',
  scopedSlots : {customRender : 'frozen'}
},{title : '操作', dataIndex : 'action' , key : '13',scopedSlots : {customRender : 'action'}},];
export default {
  data() {
    return {
      columns,
      market : [],
      indeterminate: false,
      checkAll: false,
      dialogShow : false,
      BtcTotal : '',
      formType : 'add',
      checkedList : [],
      isNumVaditor: isNumVaditor,
      form: this.$form.createForm(this, {
        onValuesChange: this.formValueChange
      }),
    }
  },
  computed:{
      arr(){
          return this.$store.state.initInfo.allAcc;
      },
      plainOptions(){
        return this.$store.state.initInfo.allAccOptions;
      },
      allInfo(){
        console.log(this.$store.state.allAccInfo);
        return this.$store.state.allAccInfo;
      },
      // plainOptions(){
      //   return this.arr.map((v)=>{
      //     return v.str;
      //   })
      // }
  },
  methods: {
    handleCancel(){
      this.dialogShow = false;
    },
    formValueChange(){

    },
    handleOk(){
      this.form.validateFields((err, values) => {
        if (!err) {
          let obj = {...values,sysaccount : window.sessionStorage['user_name']};
          obj.basiccoin = obj.basiccoin || 'BTC';
          if(this.formType == 'add'){
            this.$api.addAcc(obj).then(obj=>{
              this.$message.success('新增账号成功！');
              this.dialogShow = false;
              this.$store.dispatch('gainAllAcc');
            })
          }else{
            this.$api.modifyAcc(obj).then(obj=>{
              this.$message.success('修改账号成功！');
              this.dialogShow = false;
              this.$store.dispatch('gainAllAcc');
            })
          }
        }
      })
    },
    handleAcc(type,item){
      switch(type){
        case '1':
        // 修改客户号
        this.formType = 'edit';
        this.dialogShow = true;
        this.$nextTick(()=>{
          this.form.setFieldsValue({
              exchange : item.exchange,
              account_id : item.account_id,
              access_key : item.access_key,
              serect_key : item.serect_key,
              basiccoin : item.basiccoin
          });
        })
        break;
        case '2':
        // 删除客户号
        this.$api.deleAcc({...item,sysaccount : window.sessionStorage['user_name']}).then(obj=>{
              this.$message.success('删除账号成功');
              this.$store.dispatch('gainAllAcc');
        })
        break;
      }
    },
    addAcc(){
      this.dialogShow = true;
      const { form } = this;
      this.formType = 'add';
      this.editId = '';
      this.$nextTick(() => {
        this.form.resetFields();
        this.form.setFieldsValue({
              basiccoin : 'BTC'
        });
      });
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
        allNum = allNum + this.allInfo[v] ? this.allInfo[v].BtcTotal : 0;
      })
      this.BtcTotal = allNum;
    }
  },
}
</script>

<style scoped>
.allAssets{
    height: calc(100vh - 136px);
    background: white;
}
</style>

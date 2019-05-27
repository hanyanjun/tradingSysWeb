<template>
<div class="allAssets">
  <a-row type="flex" justify="end" style="padding-bottom:18px;background:#f0f2f5">
    <a-button type="primary" @click="addAcc">新增API</a-button>
  </a-row>
    <a-table  :columns="columns" :dataSource="arr" :locale="{emptyText : '暂无数据'}" bordered  :pagination="{
      size : 'small',
      pageSize : 9
    }">>
        <div slot="exchange" slot-scope="text , record">
          <logo  :type="text" style="margin-right:8px"/>{{text}}
        </div>
        <div slot="acc" slot-scope="text , record">
            {{text || record.account_id}}
         </div>
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
    <a-drawer :title="formType == 'add' ? '新增API' : '更新API'"
              :width="600"
              @onValuesChange="formValueChange"
              @close="handleCancel"
              :visible="dialogShow"
              :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}">
      <a-form :form="form"
              style="text-align:left;padding-bottom:40px">
        <a-form-item label="交易所"
                     :label-col="{ span: 6}"
                     :wrapper-col="{ span: 14 }">
          <a-select v-decorator="[
                            'exchange',
                            {rules: [{ required: true, message: '请选择交易所' }]}
                            ]" 
                     :disabled="formType == 'edit'"
                    placeholder="请选择交易所">
            <a-select-option :key="item.value"
                             :value="item.value"
                             v-for="item in marketTypes">{{item.value}}</a-select-option>
          </a-select>
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
        <a-form-item label="客户名"
                     :label-col="{ span: 6 }"
                     :wrapper-col="{ span: 14 }">
          <a-input placeholder="请输入客户名"
                     :disabled="formType == 'edit'"
                   v-decorator="[
                        'account',
                        {rules: [{ required:  formType == 'add', message: '请输入客户名' }]}
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
        <a-form-item label="passphrase"
                     v-if="isShow"
                     :label-col="{ span: 6 }"
                     :wrapper-col="{ span: 14 }">
          <a-input placeholder="请输入passphrase"
                   v-decorator="[
                        'reserved1',
                        {rules: [{ required: true, message: '请输入passphrase' }]}
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
                  @click="jianceapi" v-if="formType == 'edit'">
          检测
        </a-button>
        <a-button :style="{marginRight: '8px'}"
                  @click="handleCancel">
          取消
        </a-button>
        <a-button @click="handleOk"
                  type="primary">确定</a-button>
      </div>
    </a-drawer>
</div>
</template>

<script>
import isNum from "isnumber-js";
import logo from "@/components/logo.vue";
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
  scopedSlots : {customRender : 'exchange'}
}, {
  title: '账户',
  dataIndex: 'account',
  scopedSlots : {customRender : 'acc'}
}, 
// {
//   title: 'access_key',
//   dataIndex: 'access_key',
//   scopedSlots : {customRender : 'access_key'}
// }, {
//   title: 'serect_key',
//   dataIndex: 'serect_key',
//   scopedSlots : {customRender : 'serect_key'}
// },
{title : '操作', dataIndex : 'action' , key : '13', 
  align : 'center',scopedSlots : {customRender : 'action'}},];
export default {
  data() {
    return {
      columns,
      market : [],
      marketTypes : [],
      dialogShow : false,
      isShow : false,
      BtcTotal : '',
      formType : 'add',
      curItem : {},
      isNumVaditor: isNumVaditor,
      form: this.$form.createForm(this, {
        onValuesChange: this.formValueChange
      }),
    }
  },
  mounted(){
    this.marketTypes =this.$staticData.d1;
  },
  components:{logo},
  computed:{
      arr(){
          return this.$store.state.initInfo.allAcc;
      }
  },
  methods: {
    handleCancel(){
      this.dialogShow = false;
    },
    jianceapi(){
      let values = this.form.getFieldsValue();
      console.log(this.curItem)
      let obj = {...values, reserved1 : values.reserved1 || "" , sysaccount : window.sessionStorage['user_name']};
      this.$api.testapikey(obj).then(obj1=>{
        this.$message.info('api 有效');
      })
    },
    formValueChange(item,values){
      let { exchange } = values;
      if(exchange){
        if(exchange == 'okex' || exchange == 'kucoin'){
          this.isShow = true;
          if(this.formType == 'edit'){
            setTimeout(()=>{
              this.form.setFieldsValue({
                  reserved1 : this.curItem.reserved1
              });
            },0)
          }
        }else{
          this.isShow = false;
        }
      }

    },
    handleOk(){
      this.form.validateFields((err, values) => {
        if (!err) {
          let obj = {...values,sysaccount : window.sessionStorage['user_name']};
          console.log(values)
          obj.basiccoin = obj.basiccoin || 'BTC';
          if(this.formType == 'add'){
            this.$api.addAcc(obj).then(obj=>{
              this.$message.success('新增API成功！');
              this.dialogShow = false;
              this.$store.dispatch('gainAllAccount');
            })
          }else{
            this.$api.modifyAcc(obj).then(obj=>{
              this.$message.success('修改API成功！');
              this.dialogShow = false;
              this.$store.dispatch('gainAllAccount');
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
        this.curItem = item;
        this.$nextTick(()=>{
          if(item.account){
            this.form.setFieldsValue({
                exchange : item.exchange,
                account : item.account,
                account_id : item.account_id,
                access_key : item.access_key,
                serect_key : item.serect_key,
                basiccoin : item.basiccoin,
                reserved1 : item.reserved1
            });
          }else{   
            this.form.setFieldsValue({
                exchange : item.exchange,
                account_id : item.account_id,
                access_key : item.access_key,
                serect_key : item.serect_key,
                basiccoin : item.basiccoin,
                reserved1 : item.reserved1
            });
          }
        })
        break;
        case '2':
        // 删除客户号
        this.$api.deleAcc({...item,sysaccount : window.sessionStorage['user_name']}).then(obj=>{
              this.$message.success('删除API成功');
              this.$store.dispatch('gainAllAccount');
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
    }
  },
}
</script>

<style lang="scss" scoped>
.allAssets{
}
</style>

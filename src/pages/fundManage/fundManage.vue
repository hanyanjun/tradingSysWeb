<template>
  <div class="funManage">
    <a-row type="flex"
           justify="end"
           style="padding-bottom:18px;background:#f0f2f5">
      <a-button type="primary"
                @click="addFund">新增基金</a-button>
    </a-row>
    <a-table :columns="columns"
             :dataSource="arr"
             :locale="{emptyText : '暂无数据'}"
             bordered
             :pagination="{
      size : 'small',
      pageSize : 9
    }">
      <span slot="allAcc" slot-scope="text ,record">
         <li v-for="(key) in Object.keys(text)" :key="key" style="marginBottom : 5px" class="flex" >
          <!-- <a-tag color="#108ee9">{{key}}:</a-tag> -->
          <logo  :type="key"></logo>&nbsp;&nbsp;{{key}}:&nbsp;&nbsp;
           <span v-for="item1 in text[key]" :key="item1">
             {{allIndex[key+item1]}} ;&nbsp;&nbsp;
           </span>
         </li>
      </span>
      <span class="action"
            slot="action"
            slot-scope="text , record">
        <a-button @click="handleAcc('1',record)"
                  size="small">修改</a-button>
        <a-popconfirm title="确定删除该基金？"
                      @confirm="handleAcc('2',record)"
                      okText="Yes"
                      cancelText="No">
          <a-button size="small">删除</a-button>
        </a-popconfirm>
      </span>
    </a-table>
    <a-drawer :title="formType == 'add' ? '新增基金' : '更新基金'"
              :width="600"
              @onValuesChange="formValueChange"
              @close="handleCancel"
              :visible="dialogShow"
              :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}">
      <a-form :form="form"
              style="text-align:left;padding-bottom:40px">
        <a-form-item label="基金名称"
                     :label-col="{ span: 6 }"
                     :wrapper-col="{ span: 14 }">
          <a-input placeholder="请输入基金名称"
                   v-decorator="[
                        'name',
                        {rules: [{ required: true, message: '请输入基金名称' }]}
                    ]" />
        </a-form-item>
        <a-form-item label="交易所选择"
                     :label-col="{ span: 6}"
                     :wrapper-col="{ span: 14 }">
          <a-checkbox-group v-decorator="['exchange']"
                            style="width: 100%;">
            <a-row type="flex"
                   align="middle">
              <a-col>
                <a-checkbox :value="item.value"
                            v-for="(item,i) in marketTypes"
                            :key="i"
                            style="margin-left:0;">
                  {{item.label}}
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item :label="item.label"
                     :label-col="{ span: 6}"
                     :wrapper-col="{ span: 14 }"
                     v-for="(item,i) in marketTypes"
                     v-show="form.getFieldValue('exchange') && form.getFieldValue('exchange').indexOf(item.value) >= 0"
                     :key="i">
          <a-checkbox-group v-decorator="[item.value]"
                            style="width: 100%;">
            <a-row type="flex"
                   align="middle">
              <a-col>
                <a-checkbox :value="item1.value"
                            v-for="item1 in allInfo[item.value]"
                            :disabled="new RegExp(item.value + ':' + item1.value).test(currentSelectStr)"
                            :key="item1.value"
                            style="margin-left:0;">
                  {{item1.label}} (客户号：{{item1.value}})
                  <template v-if="new RegExp(item.value + ':' + item1.value).test(currentSelectStr)">
                    （当前账号已归属其他基金）
                  </template>
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
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
          取消
        </a-button>
        <a-button @click="handleOk"
                  type="primary">确认</a-button>
      </div>
    </a-drawer>

  </div>
</template>

<script>
import logo from "@/components/logo.vue";
export default {
  name: "fundManage",
  components:{logo},
  data() {
    return {
      arr: [],
      formType: "add",
      form: this.$form.createForm(this, {
        onValuesChange: this.formValueChange
      }),
      editItemId : {},
      currentSelectStr : '',
      dialogShow: false,
      columns: [
        {
          title: "名称",
          key : '0',
          dataIndex: "name",
          scopedSlots: { customRender: "name" }
        },
        {
          title: "关联账户",
          key : '1',
          dataIndex: "allAcc",
          scopedSlots: { customRender: "allAcc" }
        },
        {
          title: "操作",
          key : '2',
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" }
        }
      ]
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    accName() {
      return this.$store.state.accName;
    },
    allInfo() {
      return this.$store.state.initInfo.info;
    },
    allIndex(){
      return this.$store.state.initInfo.index;
    },
    marketTypes() {
      return Object.keys(this.allInfo).map(v => {
        return { label: v, value: v };
      });
    },
    str(){
      if(this.arr.length == 0){
        return '';
      }
      let arr = this.arr.map(v=>{
        return v.include_account;
      })
      return arr.join('');
      // return this.arr.reduce((str,v)=>{
      //   return str.include_account + v.include_account;
      // })
    }
  },
  methods: {
    init() {
      this.$api.gainFundAcc(this.accName).then(obj => {
          if(obj.data && obj.data.length > 0){
            let data = Object.assign([],obj.data);
            data = data.filter((v)=>{
              return v.isavailable
            })
            data.forEach((v,i)=>{
              data[i].allExchange= [];
              data[i].allAcc = {};
              data[i].key = i;
              let arr= v.include_account.replace(/({|})/g,'').split(',');
              arr.forEach((v)=>{
                let a1 = v.split(":");
                if(data[i].allExchange.indexOf(a1[0])  == -1){ 
                  data[i].allExchange.push(a1[0]);
                }
                if(!data[i].allAcc.hasOwnProperty(a1[0])){
                  data[i].allAcc[a1[0]] = [];
                }
                data[i].allAcc[a1[0]].push(a1[1]);
              })
              this.arr = Object.assign([], data);
              // console.log(this.arr);
            })
          }else{
            this.arr = Object.assign([],[]);
          }
      });
    },
    handleAcc(type, item) {
      switch (type) {
        case "1":
          this.formType = "edit";
          this.dialogShow = true;
          this.editItemId = item;
          let {name,allExchange : exchange, include_account ,allAcc : obj} = item;
          let s = include_account.replace(/({|})/g,'');
          let s1 = this.str;
          s.split(',').forEach((v)=>{
            s1 = s1.replace(new RegExp(v,'g') , '');
          })
          this.currentSelectStr = s1;
          this.$nextTick(() => {
            setTimeout(()=>{
              this.form.setFieldsValue({name,exchange,...obj});
            },300)
          });
          break;
        case "2":
          this.$api.deleFundAcc(item.id).then(obj => {
            this.$message.success("删除" + item.name + "基金成功!");
            this.init();
          });
          break;
      }
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        // console.log(err);
        if (!err) {
          console.log(Object.keys(values).length);
          console.log(values);
          if (Object.keys(values).length <= 1) {
            return this.$message.info("请选择交易所!");
          }

          let { exchange } = values;
          let str = "{";
          exchange.forEach(v => {
            if (values[v]) {
              values[v].forEach(v1 => {
                str = str + v + ":" + v1 + ",";
              });
            }
          });
          if (str == "{") {
            return this.$message.info("请选择账户!");
          }
          str = str.substring(0, str.length - 1);
          str = str + "}";
          switch (this.formType) {
            case "add":
              this.$api
                .newFundAcc({
                  sysaccount: this.accName,
                  include_account: str,
                  name: values.name
                })
                .then(obj => {
                  this.$message.success("新增基金成功!");
                  this.dialogShow = false;
                  this.init();
                });
              break;
            case "edit":
              this.$api
                .updateFundAcc({
                  id: this.editItemId.id,
                  include_account: str,
                  name: values.name
                })
                .then(obj => {
                  this.$message.success("更新基金成功!");
                  this.dialogShow = false;
                  this.init();
                });
            break;  
          }
        }
      });
    },
    handleCancel() {
      this.dialogShow = false;
    },
    formValueChange(item, values) {
      console.log(values);
    },
    addFund() {
      this.formType = 'add';
      this.currentSelectStr = this.str;
      this.form.setFieldsValue({
        name : '',
        exchange : []
      });
      this.dialogShow = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.flex{
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>

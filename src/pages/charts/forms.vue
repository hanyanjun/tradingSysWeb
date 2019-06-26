<template>
    <a-form layout="inline"
            style="padding-left:30px;"
            :form="form"
            @submit="handleSubmit">
      <a-form-item label="账户来源"
                   :label-col="{ span: 8 }"
                   :wrapper-col="{ span: 12 }">
        <a-select v-decorator="[
          'exchange',
          {rules: [{ required: true, message: '请选择类型!' }]}
        ]"
                  style="width : 200px"
                  placeholder="请选择类型">
          <a-select-option :value="item.value" v-for="item in exchanges" :key="item.value">
            {{item.label}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="账号"
                   :label-col="{ span: 5 }"
                   :wrapper-col="{ span: 12 }">
        <a-select v-decorator="[
          'account_id',
          {rules: [{ required: true, message: '请选择账号!' }]}
        ]"
                  style="width : 200px"
                  placeholder="请选择账号">
          <a-select-option v-for="item in accOptions"
                           :key="item.value">
            {{item.label}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="日期"
                   :label-col="{ span: 5 }"
                   :wrapper-col="{ span: 12 }">
        <a-range-picker :placeholder="['开始日期','结束日期']"
                       style="width:300px"
                       :disabledDate="disabledDate"
                       v-decorator="['date',
          {rules: [{ required: true, message: '请选择日期!' }]}]"  />     
      </a-form-item>
      <a-form-item>
        <a-button type="primary"
                  style="margin-left:20px"
                  html-type="submit">
          更新
        </a-button>
      </a-form-item>
    </a-form>
</template>

<script>
import moment from "moment";
export default {
    name : 'forms',
    data(){return{
      form: this.$form.createForm(this, {
        onValuesChange: this.formValueChange
      }),
      accOptions : []
    }}, 
    computed: {
        fundInfo() {
             return this.$store.state.fund.allFund;
        },
        exchanges(){
            let keys = Object.keys(this.info.info);
            let arr = keys.map(v=>{
                return {label : v , value : v}
            });
            arr.push({label : '基金账户' , value : 'fundaccount'});
            console.log(arr);
            return arr;
        },
        info(){
            console.log(this.$store.state.initInfo);
            return this.$store.state.initInfo;
        }
    },
    methods:{  
    formValueChange(item,values) {
        let {exchange} = values;
        if(exchange){
            this.form.resetFields(['account_id']);
            if(exchange != 'fundaccount'){
                this.accOptions = Object.assign([],this.info.info[exchange]);
            }else{
                this.accOptions = Object.assign([],this.fundInfo.fundOptions);
            }
        }
    },
    disabledDate(current){
        return current && moment(current).format('YYYY-MM-DD') > moment(new Date()).format('YYYY-MM-DD');
    },
    handleSubmit(e) {
        e.preventDefault();   
      this.form.validateFields((err, values) => {
        if (!err) {
            let beginday = moment(values.date[0]).format('YYYY-MM-DD').replace(/-/g,'');
            let endday = moment(values.date[1]).format('YYYY-MM-DD').replace(/-/g,'');
            let now = moment(new Date()).format('YYYY-MM-DD').replace(/-/g,'');
            let now1 = moment(new Date()).format('YYYY-MM-DD HH').replace(/-/g,'');
            if(beginday == endday  &&  now == endday && now1 < now + ' 20'){
              beginday = moment(new Date().getTime() - 24*60*60*1000).format('YYYY-MM-DD').replace(/-/g,'');
            }
            let {exchange,account_id} = values;
            this.$emit('gain',{exchange,account_id,beginday,endday});
        }
      });
    },
    }
}
</script>

<style>

</style>

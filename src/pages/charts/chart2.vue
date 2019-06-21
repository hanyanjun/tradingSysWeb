<template>
  <div>
    <a-form layout="inline"
            style="padding-left:30px;"
            :form="form"
            @submit="handleSubmit">
      <a-form-item label="类型"
                   :label-col="{ span: 5 }"
                   :wrapper-col="{ span: 12 }">
        <a-select v-decorator="[
          'type',
          {rules: [{ required: true, message: '请选择类型!' }]}
        ]"
                  style="width : 200px"
                  placeholder="请选择类型">
          <a-select-option value="1">
            账号
          </a-select-option>
          <a-select-option value="2">
            基金
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="账号"
                   :label-col="{ span: 5 }"
                   :wrapper-col="{ span: 12 }">
        <a-select v-decorator="[
          'acc',
          {rules: [{ required: true, message: '请选择账号!' }]}
        ]"
                  mode="multiple"
                  style="width : 200px"
                  placeholder="请选择账号">
          <a-select-option v-for="item in fundInfo.fundOptions"
                           :key="item.value">
            {{item.label}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="日期"
                   :label-col="{ span: 5 }"
                   :wrapper-col="{ span: 12 }">
        <a-date-picker placeholder="请选择日期"
                       style="width:200px"
                       v-decorator="['date',
          {rules: [{ required: true, message: '请选择日期!' }]}]" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary"
                  html-type="submit">
          更新
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import test from "./2";
export default {
  name: "chart2",
  data() {
    return {
      type : '2',
      form: this.$form.createForm(this, {
        onValuesChange: this.formValueChange
      })
    };
  },
  computed: {
    fundInfo() {
      return this.$store.state.fund.allFund;
    },
    data1(){
      return test.data1;
    },
    data2(){
      return test.data2;
    }
  },
  created() {
    this.$store.dispatch("gainAllFund");
    this.init();
  },
  methods: {
    formValueChange() {
      console.log(11);
    },
    init(){
      if(this.type == '1'){
        this.detail1(this.firstDetail(this.data1));
      }else{
        console.log(this.data2);
        this.detail2(this.firstDetail(this.data2));
      }
    },
    firstDetail(arr){
      return  arr.map((v,i)=>{
        if(v.endbalance){
          arr[i].endbalance = JSON.parse(arr[i].endbalance);
        }
        if(v.beginbalance){
          arr[i].beginbalance = JSON.parse(arr[i].beginbalance);
        }
        return arr[i];
      })
    },
    //  股权配比 需要计算每个币种当前的占比数值
    detail1(arr){
      // 单个账户的货币对的股权配比
      let obj = {};
      let date = [];
      arr.forEach((v,i)=>{
        let arr = [];
        let d1 = String(v.Day + ' 8');
        let d2 = String(v.Day + ' 20');
        date.push(d1,d2);
        if(!obj[d1]){
          obj[d1] = {total : 0 , name : [] , part : {} };
        }
        if(!obj[d2]){
          obj[d2] = {total : 0 , name : [] ,part : {}};
        }
        if(v.beginbalance){
          v.beginbalance.forEach((v1,i1)=>{
            if(obj[d1].name.indexOf(v1.Symbol) == -1){
              obj[d1].name.push(v1.Symbol);
            }
            if(!obj[d1].part[v1.Symbol]){
              obj[d1].part[v1.Symbol]  = {
                total : Number(v1.Available || 0) + Number(v1.OnOrders || 0),
                part : [v1]
              }
            }else{
              obj[d1].part[v1.Symbol]  = {
                total : Number(v1.Available || 0) + Number(v1.OnOrders || 0)  + obj[d1].part[v1.Symbol],
                part : [...obj[d1].part[v1.Symbol].part,v1]
              }
            }
            obj[d1].total +=  obj[d1].part[v1.Symbol].total
          })
        }
        if(v.endbalance){
          v.endbalance.forEach((v1,i1)=>{
            if(obj[d2].name.indexOf(v1.Symbol) == -1){
              obj[d2].name.push(v1.Symbol);
            }
            if(!obj[d2].part[v1.Symbol]){
              obj[d2].part[v1.Symbol]  = {
                total : Number(v1.Available || 0) + Number(v1.OnOrders || 0) ,
                part : [v1]
              }
            }else{
              obj[d2].part[v1.Symbol]  = { 
                total : Number(v1.Available || 0) + Number(v1.OnOrders || 0) + obj[d2].part[v1.Symbol],
                part : [...obj[d2].part[v1.Symbol].part,v1]
              }
            }
            obj[d2].total +=  obj[d2].part[v1.Symbol].total
          })
        }
      })
      console.log(obj);      
    },
    detail2(arr){
      // 单个账户的货币对的股权配比
      let obj = {};
      let date = [];
      arr.forEach((v,i)=>{
        let arr = [];
        let d1 = String(v.Day + ' 8');
        let d2 = String(v.Day + ' 20');
        date.push(d1,d2);
        if(!obj[d1]){
          obj[d1] = {total : 0 , name : [] , part : {} };
        }
        if(!obj[d2]){
          obj[d2] = {total : 0 , name : [] ,part : {}};
        }
        if(v.beginbalance){
            let keys = Object.keys(v.beginbalance);
            // 先把所有的货币对 循环出来
            let obj1 = {};
            keys.forEach((v1,i1)=>{
                let a = v1.split('_');
                v.beginbalance[v1].forEach((v2,i2)=>{
                  if(!obj1[v2.Symbol]){
                     obj1[v2.Symbol] = {
                       total  : Number(v2.Available || 0) + Number(v2.OnOrders || 0),
                       part : [{...v2,exchange : a[0] , account : a[1]}]
                     }
                  }else{
                    obj1[v2.Symbol] = {
                       total  : Number(v2.Available || 0) + Number(v2.OnOrders || 0) + obj1[v2.Symbol].total,
                       part : [...obj1[v2.Symbol].part, {...v2,exchange : a[0] , account :  a[1]}]
                    }
                  }
                  obj[d1].total += (Number(v2.Available || 0) + Number(v2.OnOrders || 0) );
                })
            })
            obj[d1].part = Object.assign({},obj1);
        }
        
        if(v.endbalance){
            let keys = Object.keys(v.endbalance);
            // 先把所有的货币对 循环出来
            let obj1 = {};
            keys.forEach((v1,i1)=>{
                let a = v1.split('_');
                v.endbalance[v1].forEach((v2,i2)=>{
                  if(!obj1[v2.Symbol]){
                     obj1[v2.Symbol] = {
                       total  : Number(v2.Available || 0) + Number(v2.OnOrders || 0),
                       part : [{...v2,exchange : a[0] , account : a[1]}]
                     }
                  }else{
                    obj1[v2.Symbol] = {
                       total  : Number(v2.Available || 0) + Number(v2.OnOrders || 0) + obj1[v2.Symbol].total,
                       part : [...obj1[v2.Symbol].part, {...v2,exchange : a[0] , account :  a[1]}]
                    }
                  }
                  obj[d2].total += (Number(v2.Available || 0) + Number(v2.OnOrders || 0) );
                })
            })
            obj[d2].part = Object.assign({},obj1);
        }
        
      })
      console.log(obj)
    },
    handleSubmit() {}
  }
};
</script>

<style>
</style>

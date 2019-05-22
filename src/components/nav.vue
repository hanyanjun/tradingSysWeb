<template>
    <a-menu
    theme="dark"
    :style="{lineHeight : '64px'}"
    :defaultSelectedKeys="current"
    mode="horizontal"
    
  >
    <a-menu-item key="transaction" @click="skip('/home/transaction')">
        <a-icon type="money-collect" />现货交易
    </a-menu-item>
    <a-menu-item key="delegate" @click="skip('/home/delegate')" >
      <a-icon type="book" />智能委托
    </a-menu-item>
    <a-menu-item key="allAssets" @click="skip('/home/allAssets')" >
      <a-icon type="property-safety" />资产统计
    </a-menu-item>
    <a-menu-item key="allAcc" @click="skip('/home/allAcc')" >
      <a-icon type="gold" />API管理
    </a-menu-item>
  </a-menu>
</template>
<script>
export default {
  props: {
    current : {
      type : Array,
      default : function(){
        return ['transaction']
      }
    }
  },
  methods:{
    skip(item){
      this.$router.push(item);
    }
  }
}
</script>

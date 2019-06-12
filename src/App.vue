<template>
  <div id="app">
    <template v-if="isInit || (!isInit && initStatus.isOver)">
      <router-view/>
    </template>
    <template v-else>
       <div class="appLoadingWrap">
         <a-spin :tip="initStatus.msg" />
       </div>
    </template>
  </div>
</template>
<script>
export default {
  name: 'App',
  data(){return{
    isInit : false
  }},
  computed:{
    initStatus(){
      return this.$store.state.initStatus;
    }
  },
  watch : {
    '$route' : 'routeChange'
  },
  methods:{
    routeChange(item){
      if(window.sessionStorage['user_name']){
        this.$store.state.accName = window.sessionStorage['user_name'];
      }
      let isInit = item.meta.isInit == 'false';
      if(!isInit){
        this.$store.state.initStatus.isOver = true;
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  background: #F0F2F5;
  height: 100%;
}
.appLoadingWrap{
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.pointer{
  cursor: pointer;
}
.card_head_small {
    .ant-card-head{
      padding: 0 5px!important;
       min-height: 0!important;
    }
    .ant-card-head-title{
      padding: 8px!important;
    }
}
.noborderTable{
    border: none!important;
  tr,td,th,.ant-table{
    border: none!important;
  }
  th{
    text-align: center!important;
  }
  tr:nth-of-type(2n+1){
    background: rgba(153,204,255,0.3);
  }
  .ant-table-body{
    margin: 0!important;
  }
}
.ant-table-tbody > tr > td {

word-wrap: break-word;
word-break: break-all;
}
.nopaddingdraw{
  .ant-drawer-body{
    padding :15px 0 !important;
  }
}
</style>

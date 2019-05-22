<template>
<a-layout id="components-layout-demo-fixed">
    <a-layout-header :style="{ position: 'fixed', zIndex: 2, width: '100%'}">
      <div class="logo" />
      <TopNav :current="current"></TopNav>
      <span class="right">  
        <a-popover placement="bottomRight">
          <template slot="content">
          <li>用户名：{{name}}</li>
          <li class="out" @click.stop="logout">退出</li>
        </template>
        <a-icon type="user"></a-icon>

        </a-popover>
      </span>
    </a-layout-header>
    <a-layout-content  :style="{ padding: '20px',marginTop: '64px' }">
       <div class="view_content">
         <router-view></router-view>
       </div>
    </a-layout-content>
    <!-- <a-layout-footer :style="{ textAlign: 'center' }">
      order_web ©2019 Created by x-order
    </a-layout-footer> -->
  </a-layout>
</template>
<script>
import TopNav from "../../components/nav";
export default {
  name: "home",
  components: { TopNav },
  data() {
    return {
      current : []
    };
  },
  created() {
    this.current = [this.$router.history.current.name];
  },
  computed:{
    name(){
      return this.$store.state.accName;
    }
  },
  methods:{
    logout(){
      window.sessionStorage.removeItem('user_name');
      this.$router.push('/login');
    }
  }
};
</script>
<style scoped lang="scss" scoped>
  #components-layout-demo-fixed  {
    .logo{
      width: 90px;
      height: 30px;
      background: url("../../assets/logo.png");
      background-size: 100% 100%;
      margin: 16px 30px 16px 0;
      float: left;
    }
    .right{
      position: absolute;
      top: 0;
      right: 40px;
      color: rgba(255, 255, 255, 0.65);
      &:hover{
        cursor: pointer;
      }
    }
}
.view_content{
  min-height:  calc(100vh - 120px);
  background: white;
}
      .out:hover{
        cursor: pointer;
        color: #1890ff;
      }

</style>
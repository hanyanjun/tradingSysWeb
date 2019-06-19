import Vue from 'vue'
import Router from 'vue-router'
import store from "../vuex/store.js";
Vue.use(Router)
const rout =  new Router({
  routes: [
    {
      path: '/',
      redirect : '/home'
    },
    {    
      path : '/login',
      name : 'login',
      meta : {isInit : 'false'},
      component:  resolve => require(['../pages/login/login'], resolve),
    },
    {    
      path : '/modifypwd',
      name : 'modifypwd',
      meta : {isInit : 'false'},
      component:  resolve => require(['../pages/modifypwd/modifypwd'], resolve),
    },
    {    
      path : '/register',
      name : 'register',
      meta : {isInit : 'false'},
      component:  resolve => require(['../pages/register/register'], resolve),
    },
    {
      path : '/home',
      name : 'home',
      component:  resolve => require(['../pages/home/home'], resolve),
      redirect : '/home/transaction',
      children : [
        {    
          path : '/home/transaction',
          name : 'transaction',
          component:  resolve => require(['../pages/transaction/transaction'], resolve),
        },
        {    
          path : '/home/delegate',
          name : 'delegate',
          component:  resolve => require(['../pages/delegate/delegate'], resolve),
        },
        {    
          path : '/home/allAssets',
          name : 'allAssets',
          component:  resolve => require(['../pages/allAssets/allAssets'], resolve),
        },
        {    
          path : '/home/allAcc',
          name : 'allAcc',
          component:  resolve => require(['../pages/allAcc/allAcc'], resolve),
        },
        {    
          path : '/home/charts',
          name : 'charts',
          component:  resolve => require(['../pages/charts/charts'], resolve),
        },
        {    
          path : '/home/fundManage',
          name : 'fundManage',
          component:  resolve => require(['../pages/fundManage/fundManage'], resolve),
        },
        {    
          path : '/home/test',
          name : 'test',
          component:  resolve => require(['../pages/test/test'], resolve),
        },
      ]
    }
  ]
})

rout.beforeEach((to,from,next)=>{
  // 登陆注册页面不需要进行init的初始化
  if(to.meta.isInit != 'false'){
    // 如果未进行登陆 进行强制跳转
    if(window.sessionStorage['user_name']){
      if(store.state.initStatus.isOver == false){
        // 进行信息的初始化 登陆websocket 保证进入页面的时候websocket已经进行链接
        store.dispatch("init").then(_=>{
          store.dispatch('loginWS').then(_=>{
            // 获取所有的账户
            store.dispatch('gainAllAccount').then(obj=>{
              store.dispatch('gainAllSymbol');
              next();
            })
          })
        })
      }else{
        store.dispatch('clearSub').then(_=>{
          next()
        })
      }
    }else{
      store.state.initStatus.isOver = true;
      next('/login');
    }
  }else{
    store.state.initStatus.isOver = true;
    next();
  }
})
export default rout;
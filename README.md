# order_web

> xorder 交易系统web端

# 版本修改记录  0.1
> 说明 √：已完成  √× 半完成  ×未完成 

###### 需求&实现

> 已完成待确认

需求 | 是否实现 | 是否测试 | 必要说明 | 状态 | 图片
:-: | :-: | :-: | :-: | :-: | :-:
1.基金账户增加 | √ | × | 无 | 待确认 | 无
2.基金账户修改 | √ | × | 无 | 待确认 | 无
3.基金账户删除 | √ | × | 无 | 待确认 | 无
4.净值图 | √ | × | 无 | 待确认 | ![avatar](https://github.com/xorder-project/tradingSystemWeb/tree/master/readmeImgs/净值图1.png)
5.股权配置图 | √ | × | 当前按照币种显示有几个币种就有几条折线图，另外增加总币数量的变化的线 | 待确认 | ![avatar](https://github.com/xorder-project/tradingSystemWeb/tree/master/readmeImgs/股权配置图1.png)
6.仓位变化表 | √ | × | 当前按照币种显示每天的各个币种增加或者减少数量的变化 | 待确认 | ![avatar](https://github.com/xorder-project/tradingSystemWeb/tree/master/readmeImgs/仓位变化图.png)
7.历史订单时间戳具体到分秒 | √ | × | 无 | √ | 无
8.委托增加委托量和持仓对比 | √ | × | 目前当委托量小于持仓量会有二次确认是否增加委托 | 待确认 | ![avatar](https://github.com/xorder-project/tradingSystemWeb/tree/master/readmeImgs/委托量判断.png)
9.现货交易买入增加委托量和持仓对比 | √ | × | 目前当下单量小于持仓量会有二次确认是否执行下单 | 待确认 | ![avatar](https://github.com/xorder-project/tradingSystemWeb/tree/master/readmeImgs/下单量判断.png)
10.现货交易卖出增加委托量和持仓对比 | √ | × | 目前当下单量小于持仓量会有二次确认是否执行下单 | 待确认 | ![avatar](https://github.com/xorder-project/tradingSystemWeb/tree/master/readmeImgs/下单量判断.png)


# 版本修改记录  0.1.1
> 说明 √：已完成  √× 半完成  ×未完成 
需求 | 是否实现 | 是否测试 | 必要说明 | 状态 | 图片
:-: | :-: | :-: | :-: | :-: | :-:
1.股权配置折线图改为按比例显示 | 否 | 是 | 无 | 待确认 | 无

>未完成

需求 | 进度
:-: | :-:
1.历史订单增加三种查询方式：按账号查询；按基金号查询；查询全部 | 需要后端支持api




## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).





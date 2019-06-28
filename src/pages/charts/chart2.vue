<template>
  <!-- <div>
    <forms></forms>
    <div>
      <a-row :gutter="16">
        <a-col :span="8"
              v-for="(item,key) in result"
              :key="key">
          <a-card :title="key"
                  :bordered=false>
            <ul>
              <li v-for="(item1,index) in item"
                  :key="index">{{item1.symbol}} {{item1.d}}</li>
            </ul>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <div id="container"
         style="width:100%;height : 600px"></div>
  </div> -->
  
  <div>
    <forms @gain="updateCharts"></forms>
    <a-row style="padding:30px;position:relation">
    <div id="container1"
         style="height:600px;"></div>
    <div class="switch" v-show="!isShow">
      <span :class="type == '1' ? 'active' : ''" @click.stop="changeType('1')">btc计价</span>
      <span :class="type == '2' ? 'active' : ''" @click.stop="changeType('2')">usdt计价</span>
    </div>
    <div class="empty" v-if="isShow">暂无数据</div>

    </a-row>
  </div>
</template>

<script>
import test from "./2";
import forms from "./forms";
import moment from "moment";
export default {
  name: "chart2",
  components:{forms},
  data() {
    return {
      type: "1",
      isShow : true,
      myChart: {},
      obj : {}
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      var dom = document.getElementById("container1");
      var myChart = this.$echarts.init(dom);
      this.myChart = myChart;
    },
    updateCharts(values){
      this.isShow = false;
      this.myChart.showLoading();
      this.type == '1';
      this.$store.dispatch("gainFundChartData", values).then(obj=>{
          this.setChart(obj);
          this.obj = Object.assign({},obj);
      })
    },
    changeType(type){
      this.type = type;
      // this.myChart.showLoading();
      this.setChart(this.obj);
    },
    setChart(obj) {
      console.log(obj);
      this.myChart.hideLoading();
      let date = Object.keys(obj);
      let now = moment(new Date())
        .format("YYYY/MM/DD HH")
        .replace(/\//g, "");
      date = date.filter(v => {
        return v < now;
      });
      let names = [];
      let total = date.map(v => {
        names = names.concat(obj[v].name);
        return obj[v].total;
      });
      names = [...new Set(names)];
      let arr = names.map(v => {
        return [v];
      });
      let arr1 = [];
      date.forEach((v, i) => {
        let all = 0;
            if(!arr1[i]){
              arr1[i]= [];
            }
        names.forEach((v1, i1) => {    
          if(obj[v].part[v1]){
           all  = this.$utils.add(all,obj[v].part[v1][this.type == '1' ? 'btcTotal' : 'usdtTotal']);
          }
        });
        names.forEach((v1,i1)=>{
          if(obj[v].part[v1]){
            let value = obj[v].part[v1][this.type == '1' ? 'btcTotal' : 'usdtTotal'];
            value  = value < 0.0000001 ? 0 : value;
            let percent = (value/all).toFixed(4)
            if(value){
              arr1[i].push({name : v1 , value : value})
            }
            arr[i1].push(Number((Number(percent)*100).toFixed(2)));
          }else{
            arr[i1].push(0);
          }
        })
      });
      // 对arr1 进行排序
      arr1.forEach((vv,ii)=>{
        let len  = vv.length;
                  for(let i = 0 ; i < len -1 ; i++){
                            for(let j = i +1; j < len ; j++){
                            if(Number(vv[j].value) < Number(vv[i].value)){
                                let tmp = arr1[ii][j];  
                                arr1[ii][j] = arr1[ii][i];
                                arr1[ii][i] = tmp;
                            }
                            }
                  };

      })
      let valueMaxObj = {

      };
      // 对arr进行排序
      // TODO 获取每个币种最大值
      let len = arr.length;
                  for(let i = 0 ; i < len -1 ; i++){
                          console.log(arr[i]);
                          let a = Object.assign([],JSON.parse(JSON.stringify(arr[i])));
                          let s = a[0];
                          a.shift();
                          console.log(s);
                          valueMaxObj[s] = Math.max(...a);
                            for(let j = i +1; j < len ; j++){
                            if(Number(arr[j][1]) < Number(arr[i][1])){
                                let tmp = arr[j];  
                                arr[j] = arr[i];
                                arr[i] = tmp;
                            }
                            }
                  };

      console.log(valueMaxObj);
      // 对arr  按照首项进行排序   对arr1
      date.unshift("product");
      let serie = names.map((v,i) => {
        return { type: "line", stack : "precent",  smooth: true, seriesLayoutBy: "row" ,  
                            itemStyle : {
                              normal : {
                                areaStyle : {},
                                label : {
                                  show : true,
                                  offset : [20,40],
                                  color : '#fff',
                                  fontWeight : 'bold',
                                  formatter : function(item){
                                    console.log(item.data[item.componentIndex + 1])
                                    if(valueMaxObj[item.seriesName] >= 1  &&  Number(item.data[item.componentIndex + 1]) == valueMaxObj[item.seriesName] ){
                                      return item.seriesName
                                    }else{
                                      return '';
                                    }
                                  }
                                }
                              // label: {
                              //   show: true,
                              //   position: "top",
                              //   formatter: function(item){
                              //     console.log(item);
                              //     // console.log(Number(item.data[item.dataIndex]).toFixed(2) )
                              //     return  Number(item.data[item.componentIndex + 1]).toFixed(2) + '%';
                              //   }
                              // },
                              },
                            } };
      });
      var option = {
        legend: {},
        title : {
          text : '股权配置图'
        },
        tooltip: {
          trigger: "axis",
          showContent: false
        },
        dataset: {
          source: [date, ...arr]
        }, 
        xAxis: { type: "category" , boundaryGap : false },
        // yAxis : {gridIndex : 0},
        yAxis: { gridIndex: 0  , type : 'value', 
                            axisLabel: {  
                              show: true,  
                              interval: 'auto',  
                              formatter: '{value} %'
                            },
                            
                        show: true, max : 100  },
        grid: { top: "55%" },
        series: [
          ...serie,
          {
            type: "pie",
            id: "pie",
            radius: "30%",
            center: ["50%", "25%"],
            label: {
              formatter: "{b}:   {@[" + 1 + "]} ({d}%)"
            },
            data : arr1[0]
          }
        ]
      };
      let _this = this;
      this.myChart.on("updateAxisPointer", function(event) {
        var xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
          var dimension = xAxisInfo.value + 1;
          _this.myChart.setOption({
            series: {
              id: "pie",
              label: {
                // formatter: "{b}: {@[" + dimension + "]} ({d}%)"
                formatter: "{b}:   {@[" + dimension + "]} ({d}%)"
              },
              data :  arr1[dimension - 1] 
            }
          });
        }
      });
      this.myChart.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
.empty{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%)
}
.switch{
  position: absolute;
  left: 30px;
  top: 70px;
  span{
    display: inline-block;
    padding: 5px;
  }
  .active{
  color: #1890ff;
  }
  &:hover{
    cursor: pointer;
  }
}
</style>
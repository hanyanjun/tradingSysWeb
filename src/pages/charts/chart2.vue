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
      isShow : false,
      myChart: {},
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
      this.setChart({});
    },
    updateCharts(values){
      this.isShow = false;
      this.myChart.showLoading();
      this.$store.dispatch("gainFundChartData", values).then(obj=>{
          this.setChart(obj);
      })
    },
    setChart(obj) {
      console.log(obj);
      this.myChart.hideLoading();
      if(!obj || Object.keys(obj).length == 0){
              this.isShow = true;
              this.myChart.setOption({
                title : {
                  text : '股权配置图'
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [],
                    type: 'line'
                }]
              })
              return;
      }
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
      date.forEach((v, i) => {
        names.forEach((v1, i1) => {
          arr[i1].push(obj[v].part[v1] ? obj[v].part[v1].total : 0);
        });
      });
      date.unshift("product");
      let serie = names.map(_ => {
        return { type: "line", smooth: true, seriesLayoutBy: "row" };
      });
      var option = {
        legend: {},
        title : {
          text : '股权配置图'
        },
        tooltip: {
          trigger: "axis",
          showContent: true
        },
        dataset: {
          source: [date, ...arr]
        },
        xAxis: { type: "category" },
        yAxis: { gridIndex: 0 },
        grid: { top: "55%" },
        series: [
          ...serie,
          {
            type: "line",
            smooth: true,
            data: total,
            itemStyle: { color: "black" }
          },
          {
            type: "pie",
            id: "pie",
            radius: "30%",
            center: ["50%", "25%"],
            label: {
              formatter: "{b}: {@[" + 1 + "]} ({d}%)"
            },
            encode: {
              itemName: "product",
              value: date[1],
              tooltip: date[1]
            }
          }
        ]
      };
      let _this = this;
      this.myChart.on("updateAxisPointer", function(event) {
        var xAxisInfo = event.axesInfo[0];
        console.log(event);
        if (xAxisInfo) {
          var dimension = xAxisInfo.value + 1;
          _this.myChart.setOption({
            series: {
              id: "pie",
              label: {
                formatter: "{b}: {@[" + dimension + "]} ({d}%)"
              },
              encode: {
                value: dimension,
                tooltip: dimension
              }
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
</style>
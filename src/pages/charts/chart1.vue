<template>
  <div>
    <forms @gain="updateCharts"></forms>
    <a-row style="padding:30px;position:relation">
      <div id="container"
           style="height:600px;"></div>
      <div class="empty"
           v-if="isShow">暂无数据</div>

    </a-row>
  </div>
</template>

<script>
import moment from "moment";
import forms from "./forms";
export default {
  name: "chart1",
  components: { forms },
  data() {
    return {
      type: "1",
      myChart: {},
      isShow: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      var dom = document.getElementById("container");
      var myChart = this.$echarts.init(dom);
      this.myChart = myChart;
      this.setChart1({});
    },
    updateCharts(values) {
      this.isShow = false;
      this.myChart.showLoading();
      this.$store.dispatch("gainFundChartData", values).then(obj => {
        this.setChart1(obj);
      });
    },
    setChart1(obj) {
      if (!obj || Object.keys(obj).length == 0) {
        this.isShow = true;
      }
      this.myChart.hideLoading();
      let date = Object.keys(obj);
      let now = moment(new Date())
        .format("YYYY/MM/DD HH")
        .replace(/\//g, "");
      date = date.filter(v => {
        return v < now;
      });
      let a1 = [],
        a2 = [],
        a3 = [], d1 = '' , d2 = '' , d3 = '';
      date.forEach(v => {
        if(obj[v].btcValue && !d1){
          console.log(1);
          d1 = obj[v].btcValue
        }
        if(obj[v].usdtValue && !d2){
          d2 = obj[v].usdtValue
        }
        if(obj[v].allPrice  && !d3){
          d3 = obj[v].allPrice
        }
        a1.push(obj[v].btcValue);
        a2.push(obj[v].usdtValue);
        a3.push(obj[v].allPrice);
      });
      a1 = a1.map(v=>{
        return v ?  this.$utils.div(v,d1) : 0;
      })
      a2 = a2.map(v=>{
        return v ? this.$utils.div(v,d2) : 0;
      })
      a3 = a3.map(v=>{
        return v ? this.$utils.div(v,d3) : 0;
      })
      var option = {
        title: {
          text: "净值图"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["btc市值", "usdt市值", "总市值"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: date
        },
        yAxis: {
          type: "value"
        },
        // dataZoom: [
        //   {
        //     type: "inside",
        //     start: 0,
        //     end: 100
        //   },
        //   {
        //     start: 0,
        //     end: 100,
        //     handleIcon:
        //       "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
        //     handleSize: "80%",
        //     handleStyle: {
        //       color: "#fff",
        //       shadowBlur: 3,
        //       shadowColor: "rgba(0, 0, 0, 0.6)",
        //       shadowOffsetX: 2,
        //       shadowOffsetY: 2
        //     }
        //   }
        // ],
        series: [
          {
            name: "btc市值",
            type: "line",
            data: a1
          },
          {
            name: "usdt市值",
            type: "line",
            data: a2
          },
          {
            name: "总市值",
            type: "line",
            data: a3
          }
        ]
      };
      this.myChart.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
.empty {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>

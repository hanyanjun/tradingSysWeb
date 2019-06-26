<template>
<div>
    <forms @gain="updateCharts"></forms>
    <div style="margin-top:40px;padding:20px;box-sizing:border-box">
        <span :span="7"
              v-for="(item,key) in result"
              :key="key">
          <a-card  
                :bodyStyle="{padding : '0'}"
                :headStyle="{padding : '0'}"
              class="card">
            <span slot="title">
                <a-icon type="clock-circle" style="color:#339933;margin-left:10px"   />
                {{detail(key)}}
            </span>
            <a-row v-for="(item1,index) in item" :key="index" type="flex" justify="space-between" style="padding:10px;"  :class=" index%2 == 0 ?  'active' : ''" >
                <span>{{item1.symbol}}</span>
                <span>{{item1.d}}</span>
            </a-row>    
          </a-card>
    </span>
    </div>
    <div class="empty" v-if="isShow">暂无数据</div>

</div>    
</template>

<script>
import moment from "moment";
import forms from "./forms";
export default {
    name :  'chart3',
  components: { forms },
    data(){return{
        result : {},
        isShow : false,
        result : {}
    }},
    mounted(){
        // this.updateCharts();
        this.setChart({});
    },
    methods:{
    updateCharts(values) {  
      this.isShow = false;
      this.$store.dispatch("gainFundChartData", values).then(obj=>{
          this.setChart(obj);
      })
    },

    detail(key){
        let a = key.split(' ');
        return a[0].substr(0,4) + '-' +  a[0].substr(4,2) + '-' + a[0].substr(6,2) +' '+a[1] + '点';
    },
    setChart(obj) {
      if(!obj || Object.keys(obj).length == 0){
              this.isShow = true;
      }
      let date = Object.keys(obj);
      let now = moment(new Date())
        .format("YYYY/MM/DD HH")
        .replace(/\//g, "");
      date = date.filter(v => {
        return v < now;
      });
      date = date.reverse();
      let result = {};
      for (var i = 1; i < date.length; i++) {
        let o2 = obj[date[i]];
        let o1 = obj[date[i - 1]];
        let names = [...new Set([...o1.name, ...o2.name])];
        names.forEach(v1 => {
          let d = this.$utils.sub(
            o2.part[v1] ? o2.part[v1].total : 0,
            o1.part[v1] ? o1.part[v1].total : 0
          );
          if (d != 0) {
            let o = {
              symbol: v1,
              d: d > 0 ?  '+'+d : d,
              part1: o1.part[v1],
              part2: o2.part[v1],
              time: date[i]
            };
            if (!result[date[i]]) {
              result[date[i]] = [];
            }
            result[date[i]].push(o);
          }
        });
      }
      this.result = Object.assign({}, result);
    },
    }
}
</script>

<style lang="scss" scoped>
.empty{
    margin-top: 20%;
    text-align: center;
}
.active{
    
    background: #99CCCC;
    color: white;
    // box-shadow: 5.7px 8.2px 45px 5px rgba(0,0,0,.1);
}
.card{
    display: inline-block;
    width: 400px;
    vertical-align: top;
    margin: 0 0 20px 20px;
}
</style>
<template>
  <div class="charts">
    <a-tabs defaultActiveKey="2"
            @change="callback">
      <a-tab-pane key="1">
        <span slot="tab">
          <a-icon type="line-chart" />
          净值图
        </span>
        <chart1></chart1>
      </a-tab-pane>
      <a-tab-pane key="2">
        <span slot="tab">
          <a-icon type="pie-chart" />
          股权配置
        </span>
        <chart2></chart2>
        </a-tab-pane>
      <a-tab-pane key="3">
        <span slot="tab">
            <a-icon type="ordered-list" />
          详细仓位
        </span>
        <chart3></chart3>
        </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import chart1 from "./chart1";
import chart2 from "./chart2";
import chart3 from "./chart3";
export default {
  name: "charts",
  components : {chart1,chart3,chart2},
  methods: {
    callback(item) {
      console.log(item);
    }
  }
};
</script>

<style>
</style>

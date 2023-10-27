<template>
  <div id="addchll"></div>
</template>

<script>
export default {
  name: "addchll",
  data() {
    return {
      datalist: [],
    };
  },
  props: {
    chartreport: Array,
  },

  mounted() {
    // this.chartList()
  },
  watch: {
    chartreport(val) {
      this.datalist = val;
      this.chartList(this.datalist);
    },
  },
  methods: {
    chartList(data) {
      this.linePlot2 = new G2Plot.Line("addchll", {
        data: data,
        height: 290,
        xField: "date",
        yField: "count",
        seriesField: "name",
        yAxis: {
          label: {
            formatter: (datum) => {
              return `${datum}`;
            },
          },
        },
        legend: {
          position: "top-right",
        },
        smooth: true,
        // @TODO 后续会换一种动画方式
        animation: {
          appear: {
            animation: "path-in",
            duration: 5000,
          },
        },
        color: ["#F5BB4A", "#1CD0BD", "#A6AAB8"],
      });

      this.linePlot2.render();
    },
  },
};
</script>

<style scoped>
</style>

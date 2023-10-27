
<template>
  <div id="addsll"></div>
</template>

<script>
export default {
  name: "addsll",
  data() {
    return {
      datalist: [],
    };
  },
  props: {
    chart: Array,
  },

  mounted() {
    // this.chartList()
  },
  watch: {
    chart(val) {
      this.datalist = val;
      this.chartList(this.datalist);
    },
  },
  methods: {
    chartList(data) {
      this.linePlot3 = new G2Plot.Line("addsll", {
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

      this.linePlot3.render();
    },
  },
};
</script>

<style scoped>
</style>

<template>
  <div>
    <BoDialog :diaLogShow="diaLogShow"
              diaLogTitle="设备排期"
              diaLogWidth="50%"  @close="e_close">
      <template slot="bologbody">
        <el-form
            @submit.prevent.native
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            class="searchform"
            label-width="110px"
            :rules="rules"
        >
          <el-row>
            <el-col :span="4">
              <el-form-item label="月份" prop="month">
                <el-select size="small" @change="changeMonth" v-model="queryParams.month">
                  <el-option v-for="item in monthList"
                             :label="item.label"
                             :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table
            :data="tableData"
            border
            :span-method="arraySpanMethod"
            :cell-class-name="renderCellStyle"
            :row-class-name="tableRowClassName"
            style="width: 100%">
          <el-table-column type="index" label="序号" width="55px" align="center"/>
          <el-table-column show-overflow-tooltip prop="equipmentNumber" label="设备编号" align="center" />
          <el-table-column show-overflow-tooltip prop="equipmentName" label="设备名称" align="center" />
          <el-table-column show-overflow-tooltip prop="userName" label="使用人" align="center" />
          <el-table-column show-overflow-tooltip prop="itemName" label="测试项" align="center" />
          <el-table-column width="45" v-for="item in renderColumn" show-overflow-tooltip :label="item.label" align="center">
            <template v-slot="scope">
              {{filterData(scope)}}
            </template>
          </el-table-column>
        </el-table>
      </template>
    </BoDialog>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "ganttChart",
  data() {
    return {
      rules: {},
      queryParams: {
        month: '',
      },
      diaLogShow: false,
      tableData: [],
      renderColumn: [],//渲染列
      monthList: [
        {label: '1月', value: '1'},
        {label: '2月', value: '2'},
        {label: '3月', value: '3'},
        {label: '4月', value: '4'},
        {label: '5月', value: '5'},
        {label: '6月', value: '6'},
        {label: '7月', value: '7'},
        {label: '8月', value: '8'},
        {label: '9月', value: '9'},
        {label: '10月', value: '10'},
        {label: '11月', value: '11'},
        {label: '12月', value: '12'}
      ]
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {

      return 'controlRow';
    },
    init({id}) {
      this.diaLogShow = true
      this.queryParams.equipmentId = id
      this.queryParams.month = moment().format('M');
      this.remderColumns()
      this.initData()
    },
    // 初始化数据
    initData() {
      this.$net('/customize/selectEquipmentSchedule','get',this.queryParams).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.tableData = res.data
        }
      })
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      const start = moment(row.startTime);
      const end = moment(row.endTime);
      let dayOfMonth = start.date(); //开始时间的 日
      let endDay = end.date(); //结束时间的 日
      if (column.label == dayOfMonth) {
        return {
          colspan: end.diff(start, 'days') + 1, // 合并的行数为开始日期和结束日期之间相差的天数加1
          rowspan: 1,
          label: row.startTime + '-' + row.endTime
        }
      }else if ( !isNaN(column.label)&& column.label > endDay ) {
        return {
          rowspan: 0,
          colspan: 0,
          label: ''
        }
      }else {
        return {
          rowspan: 1,
          colspan: 1,
          label: ''
        }
      }
    },
    filterData(scope) {
      const start = moment(scope.row.startTime);
      let dayOfMonth = start.date(); //开始时间的 日
      if (scope.column.label == dayOfMonth) {
         return scope.row.startTime + '-' + scope.row.endTime
      }
    },
    // 渲染月份天数
    remderColumns() {
      this.renderColumn = []
      const year = moment().year(); // 获取当前年份
      const daysInMonth = moment(`${year}-${this.queryParams.month}`, 'YYYY-M').daysInMonth();
      for (let i = 1; i <= daysInMonth; i++) {
        this.renderColumn.push({
          label: `${i}`,
          value: i
        });
      }
    },
    // 单元格样式
    renderCellStyle(scope) {
      const start = moment(scope.row.startTime);
      let dayOfMonth = start.date(); //开始时间的 日
      if (scope.column.label == dayOfMonth) {
        return 'warning-row'
      }
    },
    changeMonth(e) {
      this.queryParams.month = e
      this.remderColumns(e)
      this.initData()
    },
    e_close() {
      this.diaLogShow = false
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>

 /* 首先去除默认的hover效果 */
 /deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
   background-color: rgba(0, 0, 0, 0) !important;
 }
 /deep/.el-table .el-table__row:hover {
   /* Set the background color to your preferred color or 'none' to remove it completely */
   background-color: transparent!important; /* Or any color you prefer */
 }
 .controlRow:hover {
   background-color: darkgreen;
 }


  /deep/.el-table__body tr.current-row>td:not(.warning-row){
    background: none !important;
  }
  /deep/ .warning-row {
    background-color: #409EFF !important;

  }
 /deep/ .warning-row {
   background-color: rgba(64, 158, 255, 0.5) !important;
 }
  // /deep/.el-table__body tr.current-row>.controlRow{
  //   background-color: #409EFF !important;
  // }
</style>

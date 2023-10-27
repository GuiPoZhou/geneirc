<template>
  <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
    <el-form-item label="数据源名称" prop="name">
      <el-input
        v-model="queryParams.name"
        placeholder="请输入摘要"
        clearable
        size="small"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'queryPanel',
    props: {
      showSearch: {
        type: Boolean,
        default: true
      },
    },
    created() {
    },
    data() {
      return {
        years:[],
        months:[],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1);
              const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24);
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 5);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1);
              const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24);
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1);
              const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24);
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 89);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一年',
            onClick(picker) {
              const end = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1);
              const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24);
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 364);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        // 查询参数
        queryParams: {
          name: undefined,
        },
      }
    },
    methods:{
      getQueryParam(){
        return this.queryParams;
      },
      /** 搜索按钮操作 */
      handleQuery(isReset) {
        this.$emit('getList', isReset);
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery(true);
      },
    }
  }
</script>

<style scoped>

</style>

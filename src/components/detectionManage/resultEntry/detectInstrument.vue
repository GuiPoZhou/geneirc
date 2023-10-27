<template>
  <div class="resultHis">
    <el-dialog
      title="查看检测仪器"
      :visible.sync="detectInstrumentShow"
      append-to-body
      width="1250px"
      @open="open"
      center
      :before-close="handleClose"
    >
      <el-table :data="searchList">
        <el-table-column type="index" width="55" align="center" />
        <el-table-column prop="equipmentClassStr" label="仪器分类">
        </el-table-column>
        <el-table-column prop="equipmentNumber" label="仪器编号">
        </el-table-column>
        <el-table-column prop="equipmentName" label="仪器名称">
        </el-table-column>
        <el-table-column prop="equipmentModel" label="仪器类型">
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="$emit('cancel')">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getInstrumentList } from "@/api/detectionManage/resultEntry/noRecord";
export default {
  name: "detectInstrument",
  components: {},
  data() {
    return {
      loading: false,
      searchList: [], //列表数据
      params: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  props: {
    detectInstrumentShow: {
      type: Boolean,
      default: false,
    },
    resultId: null,
  },
  methods: {
    //关闭按钮设置函数
    handleClose(done) {
      this.$emit("cancel");
    },
    open() {
      this.resultHisList();
    },
    //列表
    resultHisList() {
      getInstrumentList(this.params).then((res) => {
        console.log("仪器列表请求的数据=>", res);
        this.searchList = res.data.list;
        this.searchList.forEach((item) => {
          if (this.resultId === item.id) {
            this.selectedList.push(item);
          }else{
            this.searchList = []
          }
        });
      });
    },
  },
  computed: {},
  created() {},
  mounted() {},
  updated() {},
};
</script>
<style lang="less" scoped>
</style>

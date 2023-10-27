<template>
  <el-dialog
    title="添加子项目"
    :visible.sync="subitemshow"
    append-to-body
    width="60%"
    center
    :show-close="true"
    @close="close"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-table
      :data="tableData"
      ref="subTable"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="subItemName" label="项目名称"> </el-table-column>
      <el-table-column prop="detectLimit" label="检出限值"> </el-table-column>
      <el-table-column prop="detectUnitName" label="限值单位">
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="e_submit">确定</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      subitemshow: false,
      tableData: [],
      itemId: "",
      selTable: [],
    };
  },
  props: {
    selData: {
      typeof: Array,
      default: () => {},
    },
  },
  methods: {
    /*
     *@author: 焦政
     *@date: 2022-04-11 09:23:55
     *@description:保存选择的子项目
     */
    e_submit() {
      if (this.selTable.length == 0) {
        this.$message.info("请选择项目");
        return;
      }
      this.$emit("confirm", this.selTable);
    },
    handleSelectionChange(e) {
      this.selTable = e;
    },
    init(itemId) {
      this.itemId = itemId;
      this.subitemshow = true;
      this.e_getItemList();
    },
    /*
     *@author: 焦政
     *@date: 2022-04-19 13:28:48
     *@description:默认勾选
     */
    selDefault() {
      console.log(this.selData);
      let ids = this.selData.map((item) => {
        return item.id;
      });
      this.$nextTick(() => {
        this.tableData.map((item) => {
          if (ids.includes(item.id)) {
            this.$refs.subTable.toggleRowSelection(item);
          }
        });
      });
    },
    /*
     *@author: 焦政
     *@date: 2022-04-11 09:29:01
     *@description:结果录入-获取子项目列表
     */
    e_getItemList() {
      this.$net(
        `/detectmanage/detectSampleItemSubs/${this.itemId}/getAllSubItems`,
        "get"
      ).then((re) => {
        this.tableData = re.data;
        //默认勾选
        this.selDefault();
      });
    },
    close() {
      this.$emit("cancel");
    },
  },
};
</script>

<style>
</style>
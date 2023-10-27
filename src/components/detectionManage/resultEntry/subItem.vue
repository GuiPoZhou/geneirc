<template>
  <div>
    <el-dialog
      title="子项目详情"
      :visible.sync="subitemshow"
      append-to-body
      width="60%"
      center
      :show-close="true"
      @close="close"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-button style="margin: 10px 0" type="primary" @click="e_add"
        >添加
      </el-button>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="subItemName" label="项目名称"> </el-table-column>
        <el-table-column prop="detectLimit" label="检出限值"> </el-table-column>
        <el-table-column prop="detectUnitName" label="限值单位">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="e_delete(scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 添加子项目 -->
    <AddSubItem
      ref="AddSubItem"
      v-if="showAddSubItem"
      :selData="tableData"
      @cancel="showAddSubItem = false"
      @confirm="e_confirmSelItem"
    />
  </div>
</template>

<script>
import AddSubItem from "./addSubItem.vue";
export default {
  data() {
    return {
      subitemshow: false,
      tableData: [],
      paramsRow: {},
      showAddSubItem: false,
    };
  },
  components: {
    AddSubItem,
  },
  methods: {
    /*
     *@author: 焦政
     *@date: 2022-04-11 13:45:03
     *@description:确定选择的子项目
     */
    e_confirmSelItem(list) {
      this.showAddSubItem = false;
      this.tableData = list;
      this.e_submit();
    },
    /*
     *@author: 焦政
     *@date: 2022-04-11 11:50:23
     *@description:删除
     */
    e_delete(index) {
      this.$confirm("确定删除该条?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.tableData.splice(index, 1);
        this.e_submit();
      });
    },
    /*
     *@author: 焦政
     *@date: 2022-04-11 09:23:55
     *@description:保存添加的子项目
     */
    e_submit() {
      this.$net(
        `/detectmanage/detectSampleItemSubs/${this.paramsRow.id}/saveSubItems`,
        "post",
        this.tableData
      ).then((re) => {
        if (re.code == 200) {
          this.e_getItemList();
          this.$message.success("操作成功");
        } else {
          this.$message.error(re.msg);
        }
      });
    },
    /*
     *@author: 焦政
     *@date: 2022-04-11 09:24:05
     *@description:添加子项目
     */
    e_add() {
      this.showAddSubItem = true;
      this.$nextTick(() => {
        this.$refs.AddSubItem.init(this.paramsRow.itemId);
      });
    },
    init(row) {
      this.paramsRow = row;
      console.log(row);
      this.subitemshow = true;
      this.e_getItemList();
    },
    /*
     *@author: 焦政
     *@date: 2022-04-11 09:29:01
     *@description:结果录入-获取子项目列表
     */
    e_getItemList() {
      this.$net(
        `/detectmanage/detectSampleItemSubs/${this.paramsRow.id}/getSampleSubItems`,
        "get"
      ).then((re) => {
        this.tableData = re.data;
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
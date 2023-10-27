<template>
  <el-dialog title="维护上岗证范围" :visible.sync="showDialog" append-to-body width="800px"
             center :close-on-press-escape="false" :close-on-click-modal="false" @close="close">
    <el-form ref="queryForm" :model="queryParams" @submit.native.prevent :inline="true">
      <!-- 搜索栏 -->
      <el-form-item label="检测类别名称" prop="categoryName">
        <el-input @keyup.enter.native="handleQuery" v-model="queryParams.categoryName" clearable size="small"
                  placeholder="请输入检测类别名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>

    </el-form>
    <!-- 表格 -->
    <div>
      <el-table height="500" :data="itemList" ref="multipleTable" row-key @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="detectName" label="检测类别名称" align="center"/>
        <el-table-column prop="itemName" label="检测项目名称" align="center"/>
        <el-table-column prop="methodCode" label="检测方法编号" align="center"/>
        <el-table-column prop="methodName" label="检测方法名称" align="center"/>
      </el-table>
      <!-- 分页 -->
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                  @pagination="getList"/>

    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="commit">确认</el-button>
      <el-button @click="close">取消</el-button>
    </div>

  </el-dialog>
</template>

<script>

  import {
    getDetectItemList
  } from "@/api/personnel/personnel";


  export default {
    name: 'selectDetectCategory',
    data() {
      return {
        showDialog: false,
        // 查询参数
        queryParams: {
          pageSize: 10,
          pageNum: 1,
          categoryName: undefined,
        },
        //类型列表
        itemList: [],
        total: 0,
        detectionTableData: [],
        selectData: '',
        nowSelectData: []
      }
    },
    components: {},
    methods: {
      /** input框搜索操作 */
      handleQuery() {
        this.getList();
      },
      init(tableData = []) {
        this.showDialog = true
        this.detectionTableData = tableData
        this.getList()
      },
      //获取用户列表
      getList() {
        getDetectItemList(this.queryParams).then(response => {
            this.itemList = response.data.list;
            this.total = response.data.total;
            console.log('response.data.list', response.data.list)
            this.$nextTick(() => {
              if (this.detectionTableData) {
                this.detectionTableData.forEach(row => {
                  this.itemList.forEach((item) => {
                    if (row.itemId == item.itemId) {
                      this.$refs.multipleTable.toggleRowSelection(item, true)
                    }
                  })
                })
              }
            })
          }
        );
      },
      //取消按钮操作
      close() {
        this.queryParams.pageNum = 1
        this.showDialog = false
        this.$emit("close");
      },
      //选择按钮操作
      handleSelectionChange(select) {
        setTimeout(() => {
          this.detectionTableData = this.removeRepeat([...select, ...this.detectionTableData])
          if (this.detectionTableData) {
            this.detectionTableData.forEach(row => {
              this.itemList.forEach((item) => {
                if (row.itemId == item.itemId) {
                  this.nowSelectData.push(item)
                }
              })
            })
          }
          this.nowSelectData = this.removeRepeat(this.nowSelectData)
          let id1 = select.map((item) => {
            return item.itemId
          })
          let id2 = this.nowSelectData.map((item) => {
            return item.itemId
          })
          let id3 = id2.filter((id) => {
            return !id1.includes(id)
          })
          if (id3.length > 1) {
            id3.forEach((id) => {
              this.detectionTableData.forEach((item, index) => {
                if (id == item.itemId) {
                  this.detectionTableData.splice(index, 1)
                }
              })
            })
          } else if (id3.length == 1) {
            this.detectionTableData.forEach((item, index) => {
              if (id3 == item.itemId) {
                this.detectionTableData.splice(index, 1)
              }
            })
          }
          this.nowSelectData = []
        }, 20)
      },
      removeRepeat(row) {
        for (var i = 0; i < row.length - 1; i++) {
          for (var j = 1; j < row.length; j++) {
            if (i != j) {
              if (row[i].itemId == row[j].itemId) {
                row.splice(j, 1)
              }
            }
          }
        }
        return row
      },
      //选择按钮操作
      commit() {
        if (this.detectionTableData.length == 0) {
          this.$message.success("请选择一条信息");
          return;
        }
        this.$parent.$parent.backFillItem(this.detectionTableData);
        this.close()
        this.$nextTick(() => {
          this.detectionTableData = []
        })
      },
      //清空所有选中
      clearAll() {
        this.$refs.multipleTable.clearSelection()
      },
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      }
    },

    computed: {},
    created() {
    },
  }
</script>

<style scoped>

</style>

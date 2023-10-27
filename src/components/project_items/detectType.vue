<template>
  <el-dialog
    title="检测类别选择"
    :visible.sync="visible"
    append-to-body
    width="800px"
    center
    :close-on-press-escape="false"
    :before-close="close"
  >
    <el-form
      ref="queryForm"
      :model="queryParams"
      label-width="100px"
      :inline="true"
    >
      <!-- 搜索栏 -->
      <el-form-item label="类别名称">
        <el-input
          @keyup.enter.native="handleQuery"
          v-model="queryParams.detectName"
          clearable
          placeholder="请输入选择类别名称"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索
        </el-button
        >
      </el-form-item>

      <!-- 表格 -->
      <el-table :data="tableData">
        <el-table-column type="index" prop="id" align="center" label="序号" width="50"/>
        <el-table-column prop="detectName" align="center" label="类别名称" width="180"/>
        <el-table-column prop="parentName" align="center" label="上级类别名称"/>
        <el-table-column fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              @click="handleClick(scope.row)"
              type="primary"
              round
              size="mini"
              :disabled="scope.row.disabled"
            >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="block">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getTablelist"
        />
      </div>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close()">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getCategoryList} from "@/api/envCheckScheme/config";

  export default {
    data() {
      return {
        total: 0,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          detectName: null,
        },
        // 参数表格数据
        tableData: [],
        //选择的类别名称
        selectDetectName: "",
      };
    },
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      ids: {
        type: Array,
        default: () => []
      }
    },
    mounted() {
      this.getTablelist();
    },
    methods: {
      /** input框搜索操作 */
      handleQuery() {
        // console.log('根据类别名称进行查询')
        this.queryParams.pageNum = 1;
        this.getTablelist();
      },
      //获取检测类别列表
      getTablelist() {
        getCategoryList(this.queryParams).then((response) => {
          console.log('response.data.list', response.data.list)
          console.log(this.ids)
          if (this.ids) {
            for (var i in response.data.list) {
              if (this.ids.indexOf(response.data.list[i].id) != -1) {
                response.data.list[i].disabled = true
              } else {
                response.data.list[i].disabled = false
              }
            }
          }
          this.tableData = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      //取消按钮操作
      close() {
        console.log(111);
        this.$emit("update:visible", false);
      },
      //选择按钮操作
      handleClick(row) {
        this.$emit("handleClick", row);
        this.close()
      },
    },
    computed: {},
  };
</script>

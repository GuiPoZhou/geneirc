<template>
  <el-dialog title="选择人员" :visible.sync="visible" append-to-body width="800px"
    center :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form ref="queryForm" :model="queryParams" label-width="80px">
      <!-- 搜索栏 -->
      <el-form-item label="部门名称" prop="deptId">
        <treeselect v-model="queryParams.deptId" :options="deptOptions" :show-count="true" placeholder="请选择归属部门" @input="handleQuery"/>
      </el-form-item>
      <el-form-item label="人员名称">
        <el-input
        @keyup.enter.native="handleQuery"
        v-model="queryParams.userName"
        clearable
        placeholder="请输入客户名称">
        </el-input>
      </el-form-item>
      <!-- 表格 -->
      <el-table v-loading="loading" :data="dynamicList" >
        <el-table-column prop="nickName" label="人员姓名" width="180" />
        <el-table-column prop="dept.deptName" label="所属部门" width="180" />
        <el-table-column label="操作" align="center" class-name="right">
          <template slot-scope="scope">
            <el-button @click="selectPeopleAndDeptHandleClick(scope.row)" type="primary" round size="mini">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  getPeopleList
} from "@/api/dynamicCommon/config";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: { Treeselect },
  data() {
    return {
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptId: null,
        userName: null,
      },
      // 参数表格数据
      tableData: [],
      //选择的类别名称
      selectDetectName:"",
      // 部门树选项
      deptOptions: undefined,
      dynamicList: [],
      loading: false,
      total: 0

    }
  },
  props:{
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods:{
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      getPeopleList(this.queryParams).then(response => {
        this.dynamicList = response.rows;
        this.total = response.total;
        this.loading = false;
      })
    },
    //取消按钮操作
    close() {
      this.$emit("update:visible", false);
    },
    //选择按钮操作
    selectPeopleAndDeptHandleClick(row) {
      this.$emit("selectPeopleAndDeptHandleClick", row);
      this.close();
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
  },
  computed:{
  },
  created() {
    this.getList();
    this.getTreeselect();
  },
}
</script>

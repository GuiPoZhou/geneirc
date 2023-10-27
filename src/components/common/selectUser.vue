<template>
  <el-dialog
    title="选择人员"
    :visible.sync="visible"
    append-to-body
    width="800px"
    center
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-form
      ref="queryForm"
      :model="queryParams"
      @submit.native.prevent
      :inline="true"
    >
      <!-- 搜索栏 -->
      <el-form-item label="所属部门" prop="deptName">
        <el-input
          @keyup.enter.native="handleQuery"
          v-model="deptName"
          size="small"
          placeholder="请输入所属部门"
          @focus="deptShow = true"
          suffix-icon="el-icon-search"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="人员姓名" prop="nickName">
        <el-input
          @keyup.enter.native="handleQuery"
          v-model="queryParams.nickName"
          clearable
          size="small"
          placeholder="请输入人员姓名"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>

      <el-form-item prop="deptId" v-show="false">
        <el-input v-model="queryParams.deptId"></el-input>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div>
      <el-table height="500" :data="userList" ref="multipleTable">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="userName" label="人员名称" align="center" />
        <el-table-column prop="dept.deptName" label="所属部门" align="center" />
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="commit">确认</el-button>
      <el-button @click="close">取消</el-button>
    </div>

    <selectDept :visible.sync="deptShow" @backfill="backfillDept" />
  </el-dialog>
</template>
<script>
import { listUser } from "@/api/system/user";
import selectDept from "@/components/common/selectDept";

export default {
  data() {
    return {
      // 查询参数
      queryParams: {
        nickName: undefined,
        deptId: undefined,
      },
      deptName: undefined,

      //类型列表
      userList: [],

      deptShow: false,
    };
  },
  components: {
    selectDept,
  },
  props: {
    /*
     *@author: 焦政
     *@date: 2022-03-30 14:20:27
     *@description:是否设置当前登录用户所在的部门信息为默认值
     */
    showDefault: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {},
  methods: {
    getDefault() {
      if (!this.queryParams.deptId && this.showDefault) {
        // this.deptName = this.$store.state.BeiYuan.currentUserInfo.dept.deptName
        // this.queryParams.deptId = this.$store.state.BeiYuan.currentUserInfo.dept.deptId
        this.getlist();
      }
    },
    /** input框搜索操作 */
    handleQuery() {
      this.getlist();
    },
    //获取用户列表
    getlist() {
        listUser(this.queryParams).then((response) => {
        this.userList = response.rows;
        //原公用插件人员名称展示值为用户账号
        //现根据BUG:1441 沟通产品 统一改为用户昵称
        this.userList.forEach((item) => {
          item.userName = item.nickName;
        });
      });
    },
    //取消按钮操作
    close() {
      this.$emit("update:visible", false);
    },
    //选择按钮操作
    commit() {
      console.info(this.$refs.multipleTable.selection);

      let selectedUser = this.$refs.multipleTable.selection;

      this.$emit("backfill", selectedUser);
      this.close();
    },
    //清空所有选中
    clearAll() {
      this.$refs.multipleTable.clearSelection();
    },
    //填充检测单位
    backfillDept(dept) {
      this.queryParams.deptId = dept.deptId;
      this.deptName = dept.deptName;
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.deptName = undefined;
      this.handleQuery();
    },
  },

  computed: {},
  created() {
    this.handleQuery();
  },
};
</script>

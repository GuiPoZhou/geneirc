<template>
  <el-dialog title="选择检测岗位" :visible.sync="visible" append-to-body width="600px"
             center :close-on-press-escape="false" :close-on-click-modal="false" @close="close">
    <el-form ref="queryForm" :model="queryParams" @submit.native.prevent :inline="true">
      <!-- 搜索栏 -->
      <el-form-item label="岗位名称">
        <el-input
          @keyup.enter.native="handleQuery"
          v-model="queryParams.postName"
          clearable
          size="small"
          placeholder="请输入选择岗位名称">
        </el-input>

      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>

    </el-form>
    <!-- 表格 -->
    <div>
      <el-table height="500" :data="postList">
        <el-table-column type="index" prop="id" label="序号" align="center" width="55px"/>
        <el-table-column prop="postName" label="岗位名称" align="center"/>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="primary" round size="mini">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {listPost} from "@/api/system/post"

  export default {
    data() {
      return {
        // 查询参数
        queryParams: {
          postName: null
        },
        //单位列表
        postList: [],
      }
    },
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      /** input框搜索操作 */
      handleQuery() {
        this.getlist();
      },
      //获取岗位列表
      getlist() {
        listPost(this.queryParams).then(response => {
            if (response.code == 200) {
              this.postList = response.rows;
            } else {
              console.info(response.msg)
            }

          }
        );
      },
      //取消按钮操作
      close() {
        this.$emit("update:visible", false);
      },
      //选择按钮操作
      handleClick(row) {
        this.$emit('backfill', row)
        this.close()
      },

    },
    computed: {},
    created() {
      this.handleQuery();
    },
  }
</script>

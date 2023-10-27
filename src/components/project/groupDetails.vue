<template>
<div class="groupAdd">
  <el-dialog title="项目分组详情" :visible.sync="detailsShow" center
  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form :model="detailsParams" :inline="true" label-width="88px">
        <el-form-item label="分组名称" prop="groupName">
          <el-input v-model="detailsParams.groupName" disabled clearable size="small"/>
        </el-form-item>
        <el-form-item label="类别名称" prop="detectCategoryName">
          <a-input-search v-model="detailsParams.detectCategoryName" disabled style="width: 200px" placeholder="选择类别名称"/>
        </el-form-item>
        <el-form-item label="项目名称" prop="itemNameCn">
          <a-input-search v-model="detailsParams.itemNameCn" disabled style="width: 200px" placeholder="选择项目" />
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <p>包含项目</p>
      <el-table v-loading="loading" :data="detailsParams.detailList"  align="center">
        <el-table-column prop="id" type="index" label="序号" width="55px"/>
        <el-table-column prop="itemNameCn" label="项目名称" :show-overflow-tooltip="true" />
        <el-table-column prop="isScene" label="现场检测">
          <template slot-scope="scope">
            <el-switch
                active-color="#5B7BFA"
                inactive-color="#dadde5"
                v-model="scope.row.isScene"
				:active-value="true"
				:inactive-value="false"
                disabled
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="stroma"  label="基质"/>
        <el-table-column prop="methodCode"  label="方法编号"/>
        <el-table-column prop="childMethodName"  label="子法名称"/>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
      </div>
  </el-dialog>
</div>
</template>
<script>
import "@/views/core/components_use";
import 'ant-design-vue/dist/antd.css';
export default {
  data() {
    return {
      loading: false,
    }
  },
  props:{
    detailsShow: {
      type: Boolean,
      default: false,
    },
    detailsParams:{
      type: Object,
    }

  },
  methods:{
    //取消按钮操作1
    close() {
      this.$emit("update:detailsShow", false);
    },
  },
  computed:{

  },
  created() {
  },
  mounted () {

  }
}
</script>
<style lang="less">
.groupAdd {
  ul,li {
    list-style: none;
    padding:0;
  }
}
.searchParentName {
  display:flex;
}
</style>

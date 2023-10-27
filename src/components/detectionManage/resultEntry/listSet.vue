<template>
  <div class="listSet">
    <el-dialog
      title="列表设置"
      :visible.sync="listSetShow"
      append-to-body
      width="30%"
      center
    >
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        fixed="center"
        max-height="680px"
      >
        <el-table-column prop="date" label="字段名称"> </el-table-column>
        <el-table-column label="是否显示">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.name"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="显示顺序" width="150px">
          <template slot-scope="scope">
            <el-button size="mini" @click="upMove(scope)">上移</el-button>
            <el-button size="mini">下移</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="默认列宽(px)">
          <template slot-scope="scope">
            <el-input v-model="scope.row.address" 
            />
          </template>
        </el-table-column>
      </el-table>
      <!--底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelBtn">取 消</el-button>
        <el-button type="primary" @click="saveBtn">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    listSetShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tableData: [
        {
          date: "批次编码",
          name: true,
          address: 40,
        },
        {
          date: "检测类别",
          name: true,
          address: 40,
        },
        {
          date: "样品编码",
          name: true,
          address: 40,
        },
        {
          date: "检测项目名称",
          name: true,
          address: 40,
        },
        {
          date: "检测结果",
          name: true,
          address: 40,
        },
        {
          date: "修改记录",
          name: true,
          address: 40,
        },
        {
          date: "检测仪器",
          name: true,
          address: 40,
        },
        {
          date: "检测记录",
          name: true,
          address: 40,
        },
        {
          date: "检测结果",
          name: true,
          address: 40,
        },
        {
          date: "结果单位",
          name: true,
          address: 40,
        },
        {
          date: "方法编号",
          name: true,
          address: 40,
        },
        {
          date: "子法名称",
          name: true,
          address: 40,
        },
        {
          date: "方法检出限",
          name: true,
          address: 40,
        },
        {
          date: "检出限单位",
          name: true,
          address: 40,
        },
        {
          date: "定量限制",
          name: true,
          address: 40,
        },
        {
          date: "执行标准",
          name: true,
          address: 40,
        },
        {
          date: "基质",
          name: true,
          address: 40,
        },
      ],
    };
  },
  methods: {
    //   取消按钮
    cancelBtn() {
      this.$emit("cancel1");
    },
    saveBtn() {
      this.$emit("cancel");
    },
    upMove(i){
        
    }
  },
};
</script>

<style>
</style>
<template>
  <el-dialog
    title="选择仪器"
    :visible.sync="equipmentCollectShow"
    append-to-body
    width="800px"
    @open="open"
    center
    :show-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="close"
    @close="close"
  >
    <el-form
      ref="queryForm"
      :model="queryParams"
      @submit.native.prevent
      :inline="true"
    >
      <!-- 搜索栏 -->
      <el-form-item label="仪器名称">
        <el-input
          @keyup.enter.native="handleQuery"
          v-model="queryParams.equipmentNumber"
          clearable
          size="small"
          placeholder="请输入仪器名称"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div>
      <el-table v-loading="loading" :data="tableData" ref="multipleTable">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="62px" />
        <el-table-column
          prop="equipmentNumber"
          label="设备编号"
          align="center"
        />
        <el-table-column prop="equipmentName" label="仪器名称" align="center" />
        <el-table-column
          prop="equipmentModel"
          label="仪器型号"
          align="center"
        />
        <el-table-column
          prop="equipmentClassName"
          label="仪器分类"
          align="center"
        />
      </el-table>
      <!-- <pagination
				v-show="total > 0"
				:total="total"
				:page.sync="queryParams.pageNum"
				:limit.sync="queryParams.pageSize"
				@pagination="getReceivelist"
			/> -->
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="commit">确认</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  receiveEquipmentList,
  receiveEquipmentListSave,
  returnEquipmentList,
  returnEquipmentListSave,
} from "@/api/equipment/equipment";
import { getDicts } from "@/api/system/dict/data";

export default {
  data() {
    return {
      equipmentCollectShow: false,
      // 查询参数
      queryParams: {
        equipmentNumber: null,
        equipmentClass: "",
      },
      loading: false,
      tableData: [],
      total: 0,
      //设备类型
      equipmentTypeOption: [],
    };
  },
  components: {},
  props: {
    showCollect: {
      type: Boolean,
      default: false,
    },
    selData: {
      type: Array,
      default: () => {},
    },
  },
  methods: {
    init() {
      this.equipmentCollectShow = true;
    },
    open() {
      this.initDict();
      this.getReceivelist();
    },
    //初始化设备分类的字典值
    initDict() {
      getDicts("equipment_type").then((response) => {
        if (response.code == 200 && response.data) {
          this.equipmentTypeOption = response.data;
        }
      });
    },
    /** input框搜索操作 */
    handleQuery() {
      this.getReceivelist();
    },
    /*
     *@author: 焦政
     *@date: 2022-04-19 14:53:57
     *@description:勾选默认值
     */
    selDataTable() {
      if (this.selData.length != 0) {
        let ids = this.selData.map((item) => {
          return item.equipmentId;
        });
        this.$nextTick(() => {
          this.tableData.map((item) => {
            if (ids.includes(item.id)) {
              this.$refs.multipleTable.toggleRowSelection(item);
            }
          });
        });
      }
    },
    //获取可领用设备列表
    getReceivelist() {
      this.loading = true;
      console.log("获取可领用设备列表=>", this.queryParams);
      receiveEquipmentList(this.queryParams).then((response) => {
        this.tableData = response.data.list;
        this.total = response.data.total;
        this.loading = false;
		this.selDataTable()
      });
    },
    //取消按钮操作
    close() {
      this.$emit("close");
    },
    //确认按钮操作
    commit() {
      console.log(
        "this.$refs.multipleTable.selection",
        this.$refs.multipleTable.selection
      );
      let equipmentId = this.$refs.multipleTable.selection.map(
        (item) => item.id
      );
      let equipmentName = this.$refs.multipleTable.selection.map(
        (item) => item.equipmentName
      );

      let equipmentClassName = this.$refs.multipleTable.selection.map(
        (item) => item.equipmentClassName
      );

      let equipmentNumber = this.$refs.multipleTable.selection.map(
        (item) => item.equipmentNumber
      );

      if (equipmentId.length == 0) {
        this.$message.error("请至少选择一台设备");
        return false;
      }
      this.$emit(
        "confrimInstrument",
        this.$refs.multipleTable.selection,
        equipmentName.join(",")
      );
      this.$emit(
        "confirm",
        equipmentId.join(","),
        equipmentName.join(","),
        equipmentClassName.join(","),
        equipmentNumber.join(",")
      );
    },
  },

  watch: {
    "queryParams.equipmentClass"(val) {
      this.handleQuery();
    },
  },

  computed: {},
  created() {},
};
</script>

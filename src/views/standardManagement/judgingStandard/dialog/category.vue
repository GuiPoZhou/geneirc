<template>
  <ml-dialog ref="mlDialog" :dia-log-show="visible" dia-log-title="样品类别" dia-log-width="800px"
             @close="close"
             @open="open">
    <template slot="bologbody">
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
            type="cyan"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
        >搜索</el-button
        >
      </el-form-item>

      <!-- 表格 -->
      <el-table :data="tableData" :row-key="(row) => { return row.id}" ref="tables" @selection-change="handleSelectionChange" border
					stripe>
        <el-table-column type="selection" width="55" align="center" :reserve-selection="true" />
        <el-table-column
            type="index"
            prop="id"
            label="序号"
            width="50"
        />
        <el-table-column
            prop="detectName"
            label="类别名称"
            width="180"
        />
        <el-table-column prop="parentName" label="上级类别名称" />
<!--        <el-table-column fixed="right" label="操作">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button-->
<!--                @click="handleClick(scope.row)"-->
<!--                type="primary"-->
<!--                round-->
<!--                size="mini"-->
<!--            >选择</el-button-->
<!--            >-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>

      <!-- 分页 -->
      <div class="block">
        <pagination
            v-show="tableCurrentPagination.total > 0"
            :total="tableCurrentPagination.total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getTablelist"
        />
      </div>
    </el-form>
    </template>

    <template slot="bologfooter">
      <el-button type="primary" @click="handleOk" size="small">确定</el-button>
      <el-button @click="close" size="small">取消</el-button>
    </template>
  </ml-dialog>
</template>

<script>
  import { getCategoryList } from "@/api/envCheckScheme/config";

  export default {
    data() {
      return {
        tableCurrentPagination: {
          hidden: false,
          pageNum: 1,
          pageSizes: [10, 20, 30, 40, 50],
          pageSize: 10,
          total: 0
        },
        rows: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          detectName: null
        },
        // 参数表格数据
        tableData: [],
        //选择的类别名称
        selectDetectName: "",
        checkdata: [],
        newArr: []
      };
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      categorylist: String,
      rowList: Array
    },
    watch: {
      categorylist (val) {
        if (val !== null) {
          this.checkdata = val.split(',').map(Number) || []
        } else {
          this.checkdata = ''
        }
      }
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
        getCategoryList(this.queryParams).then(response => {
          this.tableData = response.data.list;
          this.tableCurrentPagination.total = response.data.total;
          this.loading = false;
          const checkedrow = []
          this.tableData.map(item => {
            this.checkdata.map(val => {
              if (val === item.id) {
                checkedrow.push(item)
              }
            })
          })
          this.$nextTick(() => {
            checkedrow.forEach(row => {
              this.$refs.tables.toggleRowSelection(row, true) // 回显
            })
          })
          // this.rows = checkedrow.concat(this.rows)
        });
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.rows = selection.map(item => item)
      },
      //取消按钮操作
      close() {
        this.$emit("update:visible", false);
      },
      // 确定选择
      handleOk () {
        console.log('选择', this.rows)
        this.unique(this.rows)
        this.$emit("handleClick", this.rows);
        this.close();
      },
      unique(arr) {
        const res = new Map();
        return this.rows = arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
      },
      open () {
        this.getTablelist();
        // this.tableCurrentPagination = this.pagination || {
        //   pageSize: this.tableCurrentPagination.total,
        //   pageNum: 1
        // };
      }
    },
    computed: {},
    created() {
    },
    mounted() {
    }
  };
</script>

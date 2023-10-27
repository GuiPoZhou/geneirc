<template>
  <div class="app-container">
      <div class="a-c-top">
        <queryPanel :show-search="showSearch" :financialType="financialType" ref="queryPanel" @getList="getList" />
      </div>
      <div class="a-c-bottom">

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange" >
      <el-table-column type="selection" width="55" align="center" :selectable="selectable"/>
      <el-table-column label="序号" align="center" type="index"
                       width="50" />
      <el-table-column
        label="数据源名称"
        align="center"
        prop="name"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="数据源备注"
        align="center"
        prop="remark"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row, true)"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="showDataSourceConfig(scope.row.id)"
          >配置</el-button>
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
      </div>
    <saveForm :sourceForm="form" :showDetail="showDetail" :title="title" :open="open" @closeForm="closeForm" @getList="getList"  ref="saveForm"/>
    <dataSourceConfig :mainId="dataSourceConfigId" :title="title" :open="openDataSource" @closeDataSourceConfig="closeDataSourceConfig" ref="dataSourceConfig"/>
  </div>
</template>

<script>
  import {
    list,
    saveOrUpdate,
    remove,
    get,
  } from '@/api/dataSource/config'
  import queryPanel from './queryPanel'
  import saveForm from './saveForm'
  import dataSourceConfig from './dataSourceConfig'

  export default {
    name: "spendingPlan",
    components: {
      queryPanel,
      saveForm,
      dataSourceConfig
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        names: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 公告表格数据
        list: [],
        // 弹出层标题
        title: "数据源配置",
        // 是否显示弹出层
        open: false,
        openDataSource: false,
        showDetail: false,
        financialType:[],
        queryParams : {
          pageNum: 1,
          pageSize: 10,
        },
        form:{

        },
        dataSourceConfigId: null,
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询公告列表 */
      getList(isReset) {
        this.loading = true;
        if(isReset && typeof isReset === 'boolean'){
          this.queryParams.pageNum = 1;
        }
        let query = JSON.parse(JSON.stringify(this.queryParams));
        if(this.$refs.queryPanel){
          query = Object.assign(this.queryParams, this.$refs.queryPanel.getQueryParam());
        }
        list(query).then(response => {
          console.log(response);
          this.list = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.approveRecordId)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 修改按钮操作 */
      handleUpdate(row, show) {
        this.$refs.saveForm.reset();
        this.form = {};
        this.showDetail = false;
        const id = row.id || this.ids
        get(id).then(response => {
          this.form = response.data;
          this.open = true;
          if(show){
            this.showDetail = true;
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids
        const names = row.name || this.names
        this.$confirm('是否确认删除事故类型名称为"' + names + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return del(ids);
        }).then(() => {
          this.getList();
          this.$message.success("删除成功!");
        })
      },
      closeForm(){
        this.open = false;
        this.showDetail = false;
      },



      handleAdd() {
        this.$refs.saveForm.reset();
        this.form = {
          name: null,
          remark: null,
        };
        this.open = true;
        this.showDetail = false;
      },
      selectable(row, index){
        if (row.status != 1)
          return 0;//不可勾选，或者是return false/true
        else
          return 1;//可勾选
      },
      showDataSourceConfig(id){
        this.dataSourceConfigId = id;
        this.openDataSource = true;
      },
      closeDataSourceConfig(){
        this.openDataSource = false;
      }
    }
  };
</script>

<template>
  <div class="app-container">
    <!-- 统一样式 - 查询区域 -->
    <div class="a-c-top" v-show="showSearch">
      <!-- 表单 -->
      <el-form
          :inline="true"
          :model="queryParams"
          ref="queryParams"
          class="demo-form-inline"
          v-show="showSearch"
          label-width="100px"
      >
        <el-form-item label="培训内容" prop="trainContent">
          <el-input
              v-model="queryParams.trainContent"
              placeholder="请输入内容"
			  clearable
			  @clear="handleQuery"
              class="input-with-select"
              style="width: 240px"
			  size="small"
          />
        </el-form-item>
        <el-form-item label="培训目的" prop="trainAim">
          <el-input
              v-model="queryParams.trainAim"
              placeholder="请输入内容"
			  clearable
			  @clear="handleQuery"
              class="input-with-select"
			  style="width: 240px"
			  size="small"
          />
        </el-form-item>
        <el-form-item label="培训日期">
          <el-date-picker
              v-model="dateRange"
			  style="width: 260px"
			  size="small"
              value-format="yyyy-MM-dd"
              @change="ondateChange"
              type="daterange"
              range-separator="-"
              start-placeholder="选择开始日期"
              end-placeholder="选择结束日期"
          ></el-date-picker>
        </el-form-item>
        <!-- 统一样式 - 查询区域 按钮 -->
        <div class="a-c-t-btnarea">
          <el-form-item>
            <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="handleQuery"
            >搜索
            </el-button
            >
            <el-button
                icon="el-icon-refresh"
                size="mini"
                @click="resetQuery"
            >重置
            </el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 主列表区域 -->
    <div class="a-c-bottom" :class="fullscreen == true ? 'showFullScreen' : ''">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button size="mini" type="primary" @click="handleAdd">添加</el-button>
          <el-button size="mini" type="primary">打印</el-button>
          <el-button size="mini" type="warning" @click="handleExport">导出</el-button>
        </el-col>
        <el-col :span="1.5"></el-col>
        <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="resetQuery"
            @fullScreen="e_fullScreen"
            @changeBox="e_changeBox"
            :boxData="colData"
        ></right-toolbar>
      </el-row>
      <!-- 列表区域 -->
      <el-table
          ref="multipleTable"
          :data="tableData"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" fixed/>
        <el-table-column label="序号" align="center" type="index" width="50"/>
        <!-- <el-table-column prop="checkNo" label="编号" align="center" sortable show-overflow-tooltip v-if="colData[0].istrue"/> -->
        <el-table-column prop="trainContent" label="培训内容" align="center" sortable show-overflow-tooltip v-if="colData[1].istrue"/>
        <el-table-column prop="checkWay" label="考核方式" align="center" sortable show-overflow-tooltip v-if="colData[5].istrue">
          <template slot-scope="scope">
            <span>{{scope.row.checkWay === 1 ? '口头提问' : scope.row.checkWay === 2 ? '笔试' : scope.row.checkWay === 3 ? '技能演示' : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="trainAim" label="培训目的" align="center" width="200" sortable show-overflow-tooltip v-if="colData[2].istrue"/>
        <!-- <el-table-column prop="trainDate" label="培训日期" align="center" sortable show-overflow-tooltip v-if="colData[3].istrue"/> -->
        <el-table-column prop="trainWay" label="培训方式" align="center" sortable show-overflow-tooltip v-if="colData[4].istrue">
          <template slot-scope="scope">
            <span>{{scope.row.trainWay === 1 ? '外培' : scope.row.trainWay === 2 ? '内培' : scope.row.trainWay === 3 ? '网络' : ''}}</span>
          </template>
        </el-table-column>
      
        <el-table-column prop="opinion" label="培训情况评价" align="center" sortable show-overflow-tooltip v-if="colData[6].istrue">
          <template slot-scope="scope">
            <span>{{scope.row.opinion === 1 ? '达到预定目标' : scope.row.opinion === 2 ? '未达到预定目标' : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="e_look(scope.row.id)" style="color: #409EFF">查看</el-button>
            <el-button size="mini" type="text" @click="e_edit(scope.row.id)" style="color: #409EFF">修改</el-button>
            <el-button size="mini" type="text"  style="color: #409EFF" @click="e_del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
      />
    </div>
    <!--新增修改-->
    <createRecord v-if="showRecord" ref="record" @close="showRecord = false"></createRecord>
  </div>
</template>

<script>
  import createRecord from './dialog/createRecord'
  import {
    getTrainCheckList,
    getCheckDetail,
    deleteTrainCheck,
    exportTrainCheck
  } from '@/api/personnelManagement/index'
  export default {
    name: "index",
    components: {createRecord},
    data () {
      return {
        showSearch: true,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          trainContent: '',
          trainAim: '',
          dateStart: '',
          dateEnd: '',
        },
        fullscreen: false,
        showRecord: false,
        colData: [
          { title: "编号", istrue: true },
          { title: "培训内容", istrue: true },
          { title: "培训目的", istrue: true },
          { title: "培训日期", istrue: true },
          { title: "培训方式", istrue: true },
          { title: "考核方式", istrue: true },
          { title: "综合评价", istrue: true },
        ],
        ids: [],
        tableData: [],
        total: 0,
        dateRange: [],
        dateValue: [],
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      /** 重置按钮操作 */
      resetQuery() {
        this.dateRange = [];
        this.queryParams.dateStart = undefined;
        this.queryParams.dateEnd = undefined;
        this.resetForm("queryParams");
        this.handleQuery();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        if (this.dateValue === null) {
          this.queryParams.dateStart = undefined;
          this.queryParams.dateEnd = undefined;
        }
        this.queryParams.pageNum = 1;
        this.getList();
      },
      ondateChange(v) {
        this.dateValue = v;
        if (this.dateRange) {
			this.queryParams.dateStart = v[0];
			this.queryParams.dateEnd = v[1];
        } else {
          this.queryParams.dateStart = ''
          this.queryParams.dateEnd = ''
        }
      },
      e_fullScreen() {
        this.fullscreen = !this.fullscreen;
      },
      e_changeBox(list) {
        let arrList = this.colData.filter(i => !list.includes(i.title));
        let titleList = arrList.map(item => {
          return item.title;
        });
        this.colData.filter(i => {
          if (titleList.indexOf(i.title) != -1) {
            i.istrue = false;
          } else {
            i.istrue = true;
          }
        });
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id);
      },
      // 列表
      getList () {
        getTrainCheckList(this.queryParams).then(res => {
          this.tableData = res.data.list
          this.total = res.data.total
        })
      },
      // 新增
      handleAdd () {
        this.showRecord = true
        this.$nextTick(() => {
          this.$refs.record.init('add')
        })
      },
      // 查看
      e_look (id) {
        this.showRecord = true
        this.getdetail(id,'show')
      },
      // 修改
      e_edit (id) {
        this.showRecord = true
        this.getdetail(id,'update')
      },
      // 删除
      e_del (id) {
        this.$confirm("确定删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteTrainCheck(id).then(res => {
            if (res.code == 200) {
              this.$message.success("删除成功");
              this.getList();
            } else {
              this.$message.info(res.msg);
            }
          });
        });
      },
      // 获取详情
      getdetail (id, type) {
        getCheckDetail(id).then(res => {
          this.$nextTick(() => {
            this.$refs.record.init(type, res.data)
          })
        })
      },
      //导出
      handleExport() {
        this.queryParams.idStr = this.ids.join(',')
        exportTrainCheck(this.queryParams).then(res => {
          if (res.code === 200) {
              this.downLoadFile(res.msg)
          }
        })
      },
    }
  }
</script>

<style scoped>

</style>

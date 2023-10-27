<template>
  <ml-dialog ref="mlDialog" :dia-log-show="dialogShow" dia-log-title="选择试验参数" dia-log-width="60%"
             @close="cancelbtn"
             @open="open">
    <template slot="bologbody">
      <el-row :gutter="20">
        <el-col :span="5" :xs="24">
          <div class="a-c-top">
            <div style="width: 90%;margin: 0 auto 10px">
              <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
              </el-input>
            </div>
            <el-tree
              ref="tree"
              :props="defaultProps"
              @node-click="handleNodeClick"
              :filter-node-method="filterNode"
              :data="treedata"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
            >
            </el-tree>
          </div>
        </el-col>
        <el-col :span="18" :xs="24" class="a-m-c-right">
          <!-- 查询区域 -->
          <div class="a-c-top" v-show="showSearch">
            <el-form
                @submit.native.prevent
              :model="queryParams"
              ref="queryForm"
              :inline="true"
              label-width="100px"
            >
              <!--            <el-form-item label="检测类别" prop="detectCategoryName" style="width: auto">-->
              <!--              <el-input-->
              <!--                  v-model="queryParams.detectCategoryName"-->
              <!--                  placeholder="请输入检测类别"-->
              <!--                  clearable-->
              <!--                  class="input-with-select"-->
              <!--                  style="width: 240px"-->
              <!--              />-->
              <!--            </el-form-item>-->
              <el-form-item
                label="试验参数名称"
                prop="itemName"
                style="width: auto"
              >
                <el-input
                  v-model="queryParams.itemName"
                  placeholder="请输入试验参数名称"
                  clearable
                  class="input-with-select"
                  style="width: 240px"
                />
              </el-form-item>
              <div class="a-c-t-btnarea">
                <el-form-item>
                  <el-button
                    type="cyan"
                    icon="el-icon-search"
                    size="mini"
                    @click="getList"
                  >搜索
                  </el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <!-- 列表区域 -->
          <div class="a-c-bottom">
            <el-table
              v-loading="loading"
              :data="listData"
              :row-key="getRowKeys"
              ref="selectTable"
              @selection-change="handleSelectionChange"
              :tree-props="{children: 'voListZ'}"
              border
              stripe
            >
              <!--  -->
              <el-table-column
                type="selection"
                width="55"
                align="center"
                :reserve-selection="true"
                :selectable="setSelect"
              />
                <el-table-column width="70" label="序号" align="center" prop="parentIndex">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isIndex">{{scope.row.parentIndex}}</span>
                    </template>
                </el-table-column>
              <el-table-column
                label="检测类别"
                align="center"
                prop="detectCategoryName"
              />
              <el-table-column
                label="试验参数名称"
                align="center"
                prop="itemName"
              />
              <el-table-column
                label="子项名称"
                align="center"
                prop="subItemName"
              />
            </el-table>
            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getList"
            />
          </div>
        </el-col>
      </el-row>
    </template>
    <template slot="bologfooter">
      <el-button type="primary" @click="handleAdd('1')" size="small">继续添加</el-button>
      <el-button type="primary" @click="handleAdd('0')" size="small">添加关闭</el-button>
      <el-button @click="cancelbtn">取消</el-button>
    </template>
  </ml-dialog>
</template>

<script>
  import {
    getCategoryTree,
    getCategoryItem,
    addStandardItem,
  } from "@/api/standardManagement/standardManagement.js";

  export default {
    name: "addParameters",
    data() {
      return {
        dialogShow: false,
        isFullScreen: true,
        showSearch: true,
        filterText: '',
        screenName: "fullScreen",
        queryParams: {
          detectCategoryName: "",
          itemName: "",
          pageNum: 1,
          pageSize: 10,
        },
        defaultProps: {
          children: "childList",
          label: "detectName",
        },
        treedata: [],
        loading: false,
        listData: [],
        total: 0,
        objdata: {},
        standardItemList: [],
        items: [],
        id: 0,
      };
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
    },
    methods: {
        setSelect(row, index) {
            if (row.itemParentId == 0) {
                return true
            } else {
                return false
            }
        },
      filterNode(value, data) {
        if (!value) return true;
        return data.detectName.indexOf(value) !== -1;
      },
      getRowKeys(row) {
        return row.itemId;
      },
      e_changeBox(type) {
        this.isFullScreen = type;
      },
      open() {
        this.getClasstype();
      },
      init(data) {
        this.id = data;
        this.dialogShow = true;
      },
      // handleQuery() {
      //
      // },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.standardItemList = selection.map((item) => item);
      },
      // 获取检测类别列表
      getClasstype() {
        getCategoryTree().then((res) => {
          if (res.code === 200) {
            this.treedata = res.data;
          }
        });
      },
      // 获取列表
      getList() {
        const params = {
          detectCategoryId: this.objdata.id,
          ...this.queryParams,
        };
        getCategoryItem(params).then((res) => {
          this.listData = res.data.list;
          this.total = res.data.total;
            this.listData.forEach((item, index) => {
                item.voListZ.map(items => {
                    if (items.voListZ == null) {
                        items.voListZ = []
                    }
                })
                item.isIndex = true;
                item.parentIndex = index + 1;
            });
        });
      },
      handleNodeClick(data, node, v) {
        console.log(data);
        this.objdata = data;
        this.getList();
      },
        flatten(array) {
            if (array == null) {
                array = []
            }
            return [].concat(...array.map(item => [].concat(item, ...this.flatten(item.voListZ))))
        },
      handleAdd(type) {
        if (this.standardItemList.length === 0) {
          this.$message.error("请选择需要添加的试验参数");
          return;
        }
        var list = this.flatten(this.standardItemList)
        const params = {
          decideStandardId: this.id,
          detectCategoryId: this.objdata.id,
          standardItemList: list,
        };
        console.log(params);
        addStandardItem(params).then((res) => {
          if (res.code === 200) {
            this.$message.success("添加成功");
            this.standardItemList = [];
            this.getList();
            this.$parent.getdecision();
            if (type === "0") {
              this.$emit("close");
            }
          }
        });
      },
      cancelbtn() {
        this.$emit("close");
      },
    },
  };
</script>

<style scoped>
</style>

<template>
  <div class="app-container">
    <div class="a-c-top" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
        <dynamicQuery :queryCriteria="queryCriteria" :queryParams="queryParams" :dynamicDataSource="dynamicDataSource"/>
      </el-form>
    </div>

    <div class="a-c-bottom">
  <!--    按钮-->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >新增</el-button>
        </el-col>

		  <el-col :span="1.5">
			  <el-button type="info" icon="icon iconfont iconbsl-icon-daoru" size="mini" @click="handleImport">导入</el-button>
		  </el-col>
		  <el-col :span="1.5">
			  <el-button type="warning" icon="icon iconfont iconbsl-icon-daochu" size="mini" @click="handleExport">导出</el-button>
		  </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="handleQuery" style="margin-right: 10px;"></right-toolbar>
      </el-row>
  <!--    列表-->
      <el-table v-loading="loading" :data="dynamicList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column align="center" v-for="item in listColumns" :label="item.label" :prop="item.key" :formatter="dynamicFormatter" :show-overflow-tooltip="true"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            >编辑
            </el-button>

              <el-button
                slot="reference"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除
              </el-button>
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
    <a-modal
      :title="modalTitle"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleGetData"
      @cancel="handleCancel"
      okText="保存"
      cancelText="关闭"
      style="top:20px;"
      :destroyOnClose="true"
      :width="`${previewWidth}px`"
	  :maskClosable="false"
    >
      <k-form-build :value="jsonData" @submit="handleSubmit" ref="KFormBuild" :getDynamicData="getDynamicData" :dynamicData="dynamicData"/>
      <jsonModel ref="jsonModel" />
    </a-modal>
    <selectPeopleAndDept :visible.sync="dynamicData.selectPeopleAndDeptVisible" @selectPeopleAndDeptHandleClick="selectPeopleAndDeptHandleClick"/>
	  <upload :visible.sync="upload.open" :upload="upload" ref="upload" @importTemplate="importTemplate" @afterImport="getList" :showTips="false"/>
  </div>
</template>
<style>
  .queryLogicSelect {
    width: 120px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>

<script>
  import {
    getPageConfig,
    getDynamicData,
    getExecutionList,
    getExecutionEditDetail,
    saveDynamicForm,
    removeRow,
    submitProcess,
  } from "@/api/runDynamicPage/config";
  import {
	  exportData,
	  downLoadTemplate,
  } from "@/api/equipment/equipment";
  import jsonModel from "@/views/KFormDesign/module/jsonModal";
  import "@/views/core/components_use";
  import KFormBuild from "@/views/KFormBuild/index";
  import 'ant-design-vue/dist/antd.css';
  import selectPeopleAndDept from "@/components/dynamicCommon/selectPeopleAndDept";
  import dynamicQuery from '@/components/dynamicQuery/dynamicQuery';
  import upload from '@/components/common/upload';
  export default {
    name: "ExecutionTemplate",
    components: {
      jsonModel,
      KFormBuild,
      selectPeopleAndDept,
      dynamicQuery,
		upload
    },
    data() {
      return {
        //表单
        jsonData:{},
        previewWidth: 850,
        visible: false,
        confirmLoading: false,
        modalTitle: "添加",
        asd:"",


        //列表
        loading: true,
        showSearch: true,
        total: 0,
        dynamicList: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        queryCriteria: [

        ],
        listColumns: [

        ],
        mateColumns: {},
        dynamicDataSource: {},
        cacheDynamicDataSource: {},

        //
        executionTemplateId: 0,
        executionId: 0,
        processKey: "",
        dynamicData:{
          selectPeopleAndDeptVisible: false,
          selectPeopleAndDeptFormModel: null,
          selectPeopleAndDeptShow: (val1, val2) => {
            this.dynamicData.selectPeopleAndDeptFormModel = val2;
            this.dynamicData.selectPeopleAndDeptVisible = true;
          }
        },
		  // 导入参数配置
		  upload: {
			  // 是否显示弹出层
			  open: false,
			  // 弹出层标题
			  title: "",
			  // 是否禁用上传
			  isUploading: false,
			  // 是否更新已经存在的数据
			  updateSupport: 0,
			  // 上传数据的地址
			  url: window.globalEnv.VUE_APP_BASE_API + "/v1/dynamicExcel/equipment/importExcel",
		  },
      };
    },
    created() {
      this.executionTemplateId = this.$route.params && this.$route.params.executionTemplateId;
      this.getPageConfig();
    },
    methods: {
      handleCancel(){
        this.visible = false;
      },
      handleSubmit(p){
        p.then(res => {
          console.log(res, "获取数据成功");
          this.$refs.jsonModel.jsonData = res;
          this.$refs.jsonModel.visible = true;
        }).catch(err => {
          console.log(err, "获取数据失败");
        });
      },


      //
      getPageConfig() {
        this.loading = true;
        getPageConfig(this.executionTemplateId).then(response => {
          this.loading = false;
          this.processKey = response.data.processKey;
          let queryCriteria = JSON.parse(response.data.listPageJson);
          this.jsonData = JSON.parse(response.data.metaJson);
          queryCriteria.forEach((item,key) => {
            this.$set(this.mateColumns, item.key, item);
            if(item.showOnList){
              this.listColumns.push(item);
            }
            if(item.showOnQuery){
              this.$set(this.queryParams, item.key, '');
              this.$set(this.queryParams, 'queryLogic_' + item.key, '');
              this.queryCriteria.push(item);
              this.queryParams['queryLogic_' + item.key] = "2";
            }
            //加载数据源
            this.loadDataSource(item);
          });
          this.getList();
        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      getList() {
        this.loading = true;
        getExecutionList(this.executionTemplateId, this.queryParams).then(response => {
          this.dynamicList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
      },
      loadDataSource(item) {
        //加载数据源
        if(item.options && item.options.dynamic){
          //远程
          if(this.cacheDynamicDataSource[item.dynamicGetUrl]){
            //缓存
            this.$set(this.dynamicDataSource, item.key, this.cacheDynamicDataSource[item.dynamicGetUrl]);
          }else{
            //远程拉取
            getDynamicData(item.dynamicGetUrl).then(response => {
              let dataSource = [];
              response.data.forEach((row, key) => {
                dataSource.push({
                  key : row[item.dynamicGetKey],
                  value : row[item.dynamicGetValue]
                })
              });
              this.$set(this.dynamicDataSource, item.key, dataSource);
              this.$set(this.cacheDynamicDataSource, item.dynamicGetUrl, dataSource);
            });
          }
        }else if(item.options && item.options.options){
          //本地
          let dataSource = [];
          item.options.options.forEach((row, key) => {
            dataSource.push({
              key : row.value,
              value : row.label
            });
          });
          this.$set(this.dynamicDataSource, item.key, dataSource);
        }
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      dynamicFormatter(row, column, cellValue, index) {
        if(!this.mateColumns[column.property]){
          return cellValue;
        }
        let returnVal = "";
        let dataSource = this.dynamicDataSource[column.property];
        switch (this.mateColumns[column.property].type) {
          case 'select':
            if(this.mateColumns[column.property].options.multiple){
              let valueList = [];
              if(cellValue){
                valueList = JSON.parse(cellValue);
              }
              valueList.forEach((forSubRow, subIndex) => {
                dataSource.forEach((forRow, index) => {
                  if (forRow.key == forSubRow) {
                    returnVal += forRow.value + ",";
                  }
                });
              });
              return returnVal.substr(0, returnVal.length - 1);
            }else{
            	if(dataSource){
					dataSource.forEach((row, index) => {
						if (cellValue == row.key) {
							returnVal = row.value;
						}
					});
				}
            }
            return returnVal;
            break;
          case 'radio':
            dataSource.forEach((row, index) => {
              if (cellValue == row.key) {
                returnVal = row.value;
              }
            });
            return returnVal;
            break;
          case 'checkbox':
            let valueList = [];
            valueList = JSON.parse(cellValue);
            valueList.forEach((forSubRow, subIndex) => {
              dataSource.forEach((forRow, index) => {
                if (forRow.key == forSubRow) {
                  returnVal += forRow.value + ",";
                }
              });
            });
            return returnVal.substr(0, returnVal.length - 1);
            break;
          default:
            returnVal = cellValue;
            break;
        }
        return returnVal;
      },
      getDynamicData(root, config) {
        // 加载表单远程数据源
        config.forEach(f => {
          if(f.type == 'grid'){
            f.columns.forEach(c => {
              root.getDynamicData(root, c.list);
            })
          }
          if(f.type == 'card'){
            root.getDynamicData(root, f.list);
          }
          if(f.type == 'table'){
            f.trs.forEach(tr => {
              tr.tds.forEach(td => {
                root.getDynamicData(root, td.list);
              })
            })
          }
          if(f.options && f.options.dynamicGetUrl){
            f.options.dynamicKey = f.key + "_dk";
            let valueField = f.options.dynamicGetKey;
            let labelField = f.options.dynamicGetValue;

            getDynamicData(f.options.dynamicGetUrl).then(response => {
              let dataSource = [];
              response.data.forEach((row, key) => {
                dataSource.push({
                  value : row[valueField],
                  label : row[labelField]
                })
              });
              root.$set(root.dynamicData, f.options.dynamicKey, dataSource);
            });
          }
        });
      },

      //表单操作
      handleAdd(){
        this.visible = true;
        this.executionId = 0;
        this.modalTitle = "添加";
      },
      handleEdit(row){
        this.visible = true;
        this.modalTitle = "编辑";
        this.confirmLoading = true;
        this.executionId = row.id;
        this.$nextTick(() => {
          getExecutionEditDetail(this.executionTemplateId, this.executionId).then(response => {
              this.$refs.KFormBuild.form.setFieldsValue(response.data);
            this.confirmLoading = false;
          })
        });
      },
      handleGetData(){
        this.confirmLoading = true;
        this.$refs.KFormBuild.getData()
          .then(res => {
            saveDynamicForm(this.executionTemplateId, this.executionId, res).then(response => {
              this.$message.success(response.msg);
              this.visible = false;
              this.confirmLoading = false;
              this.getList();
            }, (err) => {
              this.$message.error(err);
              this.confirmLoading = false;
            });
          })
          .catch(err => {
            this.$message.error(err);
            console.log(err, "获取数据失败");
            this.confirmLoading = false;
          });
      },
      handleDelete(row){
        this.$confirm('确定要删除本行数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(row, "删除");
        this.loading = true;
        removeRow(this.executionTemplateId, row.id).then(response => {
          this.$message.success(response.msg);
          this.getList();
        }).catch(err => {
            // this.msgError(err);
            console.log(err, "获取数据失败");
            this.loading = false;
        });
        })



      },
      //提交流程
      submitProcess(row) {
        this.loading = true;
        submitProcess(this.executionTemplateId, row.id, this.processKey).then(response => {
          this.$message.success(response.msg);
          this.getList();
        }).catch(err => {
          // this.msgError(err);
          console.log(err, "获取数据失败");
          this.loading = false;
        });
      },

      showProcessImgDialog(row) {
        this.processImg = true
        this.instanceId = row.instanceId
      },
      /** 审批历史列表 */
      historyList(row) {
        this.dialogTableVisible = true
        this.instanceId = row.instanceId
      },
      selectPeopleAndDeptHandleClick(val1, val2, val3){
        let temp = {};
        temp['' + this.dynamicData.selectPeopleAndDeptFormModel] = val1.nickName;
        this.$refs.KFormBuild.form.setFieldsValue(temp);
      },






		//导出
		handleExport() {
      exportData(this.executionTemplateId, this.queryParams).then(
				(response) => {
					if (response.code === 200) {
						this.download(response.msg)
					}
				});
		},

		//导入
		handleImport() {
			this.upload.title = "设备信息导入";
			this.upload.open = true;
		},
		//下载模板
		importTemplate() {
			downLoadTemplate()
		},
    }
  };
</script>

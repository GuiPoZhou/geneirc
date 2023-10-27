<template>
  <el-dialog :title="title" :visible.sync="showDialog" center :show-close="true"
             :close-on-press-escape="false" :close-on-click-modal="false" @close="close">
    <el-form :model="certificateParam" ref="certificateForm" :inline="true" label-width="100px">
      <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true">

        <div class="input-size">
          <el-form-item label="上岗证类型" prop="workLicenseType">
            <el-select v-model="certificateParam.workLicenseType" style="width: 100%">
              <el-option label="采样证" :value="0"></el-option>
              <el-option label="检测证" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-tab-pane label="采样证" name="first">
          <el-row>
            <el-col>
              <el-button type="primary"
                         icon="el-icon-circle-plus"
                         size="mini"
                         style="margin-left:10px;margin-bottom:10px"
                         @click="handleMaintainSample">
                维护范围
              </el-button>
            </el-col>
          </el-row>

          <el-table v-loading="loading" :data="sampleTableData" align="center">
            <el-table-column prop="id" type="index" label="序号" width="55px"/>
            <el-table-column prop="detectName" label="检测类别名称" align="center"/>
            <el-table-column prop="parentName" label="上级类别名称" align="center"/>
            <el-table-column fixed="right" label="操作" width="80px"
                             header-align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelSample(scope.row, scope)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>
        <el-tab-pane label="检测证" name="second">
          <el-row>
            <el-col>
              <el-button type="primary"
                         icon="el-icon-circle-plus"
                         size="mini"
                         style="margin-left:10px;margin-bottom:10px"
                         @click="handleMaintainDetection">
                维护范围
              </el-button>
            </el-col>
          </el-row>

          <el-table v-loading="loading" :data="detectionTableData" align="center">
            <el-table-column prop="id" type="index" label="序号" width="55px"/>
            <el-table-column prop="detectName" label="检测类别名称" align="center"/>
            <el-table-column prop="itemName" label="检测项目名称" align="center"/>
            <el-table-column prop="methodCode" label="检测方法编号" align="center"/>
            <el-table-column prop="methodName" label="检测方法名称" align="center"/>
            <el-table-column fixed="right" label="操作" width="80px"
                             header-align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelDetection(scope.row, scope)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" center>
        保存
      </el-button>
      <el-button @click="close">取消</el-button>
    </div>

    <selectDetectCategory v-if="categoryShow" @close="categoryShow = false" ref="categoryHandle"/>
    <selectDetectItem v-if="itemShow" @close="itemShow = false" ref="itemHandle"/>
  </el-dialog>

</template>

<script>
  import {
    addWorkLicenseBatch, getWorkLicenseBatchList
  } from "@/api/personnel/personnel";
  import selectDetectCategory from "./selectDetectCategory";
  import selectDetectItem from "./selectDetectItem";

  export default {
    name: 'workLicenseBatch',
    components: {
      selectDetectCategory,
      selectDetectItem
    },
    data() {
      return {
        activeName: "first",
        activeNameSon: "first",
        loading: false,
        showDialog: false,
        categoryShow: false,
        itemShow: false,
        // 采样证表格数据
        sampleTableData: [],
        // 检测证表格数据
        detectionTableData: [],
        certificateParam: {
          personnelIds: null,
          workLicenseType: null,
          workLicenseTypeSample: null,
          workLicenseTypeDetection: null,
          samplingList: null,
          detectionList: null,
        }
      };
    },
    props: {
      title: {
        type: String,
        default: '',
      }
    },
    methods: {
      init(id) {
        this.showDialog = true
        this.activeName = "first";
        this.certificateParam.workLicenseType = 0;
        this.certificateParam.personnelIds = id
        getWorkLicenseBatchList(this.certificateParam).then(response => {
          this.sampleTableData = response.data.sampleList;
          this.detectionTableData = response.data.detectionList
        });


      },
      handleClick(tab, event) {
        if (this.activeName === "first") {
          this.certificateParam.workLicenseType = 0;
        } else if (this.activeName === "second") {
          this.certificateParam.workLicenseType = 1;
        }
        console.log(tab, event);
      },
      //保存按钮
      submitForm() {
        if (this.sampleTableData.length > 0) {
          this.certificateParam.workLicenseTypeSample = 0
          this.certificateParam.samplingList = this.sampleTableData
        }
        if (this.detectionTableData.length > 0) {
          this.certificateParam.workLicenseTypeDetection = 1
          this.certificateParam.detectionList = this.detectionTableData
        }
        if (this.certificateParam.personnelIds != null) {
          addWorkLicenseBatch(this.certificateParam).then(response => {
            //触发父组件传递过来的函数getTableList()
            this.$emit("func", null);
            this.$message.success("保存成功");
            this.close();
          });
        }
      },
      //取消按钮操作
      close() {
        this.showDialog = false
        this.$emit('close')
      },

      //采样证选择检测类别
      backFillCategory(resultCategory) {
        for (let i = 0; i < resultCategory.length; i++) {
          let num = 0;
          if (this.sampleTableData.length > 0) {
            this.sampleTableData.forEach(item => {
              if (item.detectCategoryId == resultCategory[i].id) {
                num = 1;
              }
            })
          }
          if (num == 0) {
            this.sampleTableData.push({
              detectCategoryId: resultCategory[i].id,
              detectName: resultCategory[i].detectName,
              parentName: resultCategory[i].parentName
            });
          }
        }
      },
      //检测证选择坚持项目
      backFillItem(resultItem) {
        for (let i = 0; i < resultItem.length; i++) {
          let num = 0;
          if (this.detectionTableData.length > 0) {
            this.detectionTableData.forEach(item => {
              if (item.itemMethodId == resultItem[i].itemId) {
                num = 1;
              }
            })
          }
          if (num == 0) {
            this.detectionTableData.push({
              itemMethodId: resultItem[i].itemId,
              detectCategoryId: resultItem[i].detectId,
              detectName: resultItem[i].detectName,
              itemName: resultItem[i].itemName,
              methodName: resultItem[i].methodName,
              methodCode: resultItem[i].methodCode
            });
          }
        }
      },
      //采样证维护范围
      handleMaintainSample() {
        this.categoryShow = true;
        this.$nextTick(() => {
          this.$refs.categoryHandle.init()
        })
      },
      //采样证删除
      handleDelSample(row, scope) {
        console.log('要删除的行数据==>', row)
        console.log('scope==>', scope)
        const index = scope.$index
        console.log('index==>', index)
        this.$confirm('确定要删除', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.sampleTableData.splice(index, 1)
            this.getItemList()
            this.$message.success('删除成功')
          })
          .catch(function () {
          })
      },
      //检测证维护范围
      handleMaintainDetection() {
        this.itemShow = true;
        this.$nextTick(() => {
          this.$refs.itemHandle.init()
        })
      },
      //检测证删除
      handleDelDetection(row, scope) {
        const index = scope.$index
        this.$confirm('确定要删除', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.detectionTableData.splice(index, 1)
            this.getItemList()
            this.$message.success('删除成功')
          })
          .catch(function () {
          })
      }
    },
  }
</script>

<style scoped>

</style>

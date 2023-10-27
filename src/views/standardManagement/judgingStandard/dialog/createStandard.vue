<template>
  <div>
    <ml-dialog ref="mlDialog" :dia-log-show="dialogShow" :dia-log-title="logTilte" dia-log-width="60%"
               @close="cancelbtn"
               @open="openEvent"
               v-loading="loading">
      <template slot="bologbody">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          :prop="queryParams"
          style="margin: 15px 0 0 50px"
          :rules="rules"
          label-position="top"
          label-width="80px"
      >
        <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
          <el-tab-pane label="标准基本信息" name="first">
            <el-row>
              <el-col :span="12">
                <el-form-item label="标准分类" prop="standardType " style="width: 100%">
                  <el-select
                          v-model="queryParams.standardType "
                          clearable
                  >
                    <el-option v-for="item in statusList" :label="item.dictLabel" :value="item.dictValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="标准号" prop="standardCode" style="width: 100%">
                  <el-input placeholder="请输入标准号" v-model="queryParams.standardCode" :disabled="isdisable"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="中文标准名称" prop="standardNameCn" style="width: 100%">
                  <el-input placeholder="请输入中文标准名称" v-model="queryParams.standardNameCn" :disabled="isdisable"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="英文标准名称" prop="standardNameEn" style="width: 100%">
                  <el-input placeholder="请输入英文标准名称" v-model="queryParams.standardNameEn" :disabled="isdisable"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="标准状态" prop="status" style="width: 100%">
                  <el-select
                      v-model="queryParams.status"
                      clearable
                  >
                    <el-option label="现行" value="0"></el-option>
                    <el-option label="将实施" value="1"></el-option>
                    <el-option label="作废" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="自定义标准分类" prop="decideStandardTreeId" style="width: 100%">
                  <treeselect
                      :default-expand-level="5"
                      v-model="queryParams.decideStandardTreeId"
                      :options="treeOptions"
                      :normalizer="normalizer"
                      :show-count="true"
                      placeholder="请选择自定义标准分类"
                      @select="departTreeSelected"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发布日期" prop="publishDate" style="width: 100%">
                  <el-date-picker v-model="queryParams.publishDate" value-format="yyyy-MM-dd" type="date"
                                  placeholder="选择日期" style="width:100%" :disabled="isdisable">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实施日期" prop="startDate" style="width: 100%">
                  <el-date-picker v-model="queryParams.startDate" value-format="yyyy-MM-dd" type="date"
                                  placeholder="选择日期" style="width:100%" :disabled="isdisable">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="作废日期" prop="endDate" style="width: 100%">
                  <el-date-picker v-model="queryParams.endDate" value-format="yyyy-MM-dd" type="date"
                                  placeholder="选择日期" style="width:100%" :disabled="isdisable">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="执行标准说明" prop="remark" style="width: 100%">
                  <el-input
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder="请输入内容"
                      v-model="queryParams.remark">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="关联检测类别" prop="detectcategoryName" style="width: 100%;margin-bottom: 30px">
                  <el-input placeholder="请选择检测类别" v-model="queryParams.detectcategoryName" readonly @focus="handleCate">
                    <el-button slot="append" icon="el-icon-search" @focus="handleCate"></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      </template>
      <template slot="bologfooter">
        <el-button type="primary" @click="handleSubmit" :loading="isloading" size="small">确定</el-button>
        <el-button @click="cancelbtn" size="small">取消</el-button>
      </template>
    </ml-dialog>
    <category :visible="visible" ref="registration" @update:visible="visible = false" @handleClick="parentEvent" :rowList="rowList" :categorylist="categorylist"></category>
  </div>
</template>

<script>
  import category from './category'
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import { addStandard, editStandard } from '@/api/standardManagement/standardManagement.js'
  export default {
    name: "createStandard",
    components: { category, Treeselect },
    data() {
      return {
        dialogShow: false,
        loading: false,
        isFullScreen: true,
        screenName: "fullScreen",
        logTilte: '新增',
        activeName: 'first',
        queryParams: {
          decideStandardTreeId: 0,
          decideStandardTreeName: '',
          detectcategoryStr: '',
          detectcategoryName: '',
          standardType : '',
        },
        rules: {
          standardCode: [{required: true, message: "请输入标准号", trigger: "blur"}],
          standardNameCn: [{required: true, message: "请输入中文标准名称", trigger: "blur"}],
          status: [{required: true, message: "请选择标准状态", trigger: "change"}],
          standardType : [{required: true, message: "请选择标准分类", trigger: "change"}],
          // detectcategoryName: [{required: true, message: "请选择检测类别", trigger: "change"}],
        },
        isdisable: false,
        visible: false,
        treeOptions: [],
        isloading: false,
        showType: 'add',
        categorylist: '',
        rowList: [],
        statusList: [],
      }
    },
    computed: {
      getLeftWidth() {
        return this.$store.state.app.leftWidth;
      }
    },
    watch: {
      getLeftWidth() {
        let width = this.$store.state.app.leftWidth;
        if (width < 200) {
          this.screenName = "bigFullScreen";
        } else {
          this.screenName = "fullScreen";
        }
      },
      showType(val) {
        if (val == "add") {
          this.logTilte = "新增";
        } else if (val == "update") {
          this.logTilte = "修改";
        }
      },
    },
    methods: {
      normalizer(node) {
        if (node.childList && !node.childList.length) {
          delete node.childList;
        }
        return {
          id: node.id,
          label: node.name,
          children: node.childList,
          parentId: node.parentId
        };
      },
      openEvent() {
      },
      init(params, show) {
        this.dialogShow = true;
        this.getDicts("STANDARD_TYPE").then(response => {
          this.statusList = response.data
        })
        if (show) {
          this.showType = show;
          if (this.showType === 'add') {
            this.queryParams.decideStandardTreeId = params.id
            this.queryParams.decideStandardTreeName = params.name
          } else {
            this.queryParams = {
              ...params,
            };
            this.queryParams.decideStandardTreeId = params.decideStandardTreeId
            this.queryParams.detectcategoryName = params.detectcategoryNameStr
            this.queryParams.decideStandardTreeName = params.decideStandardTreeName
            this.categorylist = params.detectcategoryStr
          }
        }
      },
      // 标准树
      treedata (data) {
        this.treeOptions = data
        this.deptOptions = this.handleTree(this.treeOptions, "deptId");
      },
      departTreeSelected (node) {
        this.queryParams.decideStandardTreeName = node.name
      },
      handleClick() {},
      cancelbtn() {
        this.$emit('close')
      },
      // 检测类别
      handleCate () {
        this.visible = true
      },
      parentEvent (row) {
        this.rowList = row
        console.log(this.rowList)
        const name = row.map(item => {
          return item.detectName
        })
        const id = row.map(item => {
          return item.id
        })
        this.queryParams.detectcategoryStr = id.join(',')
        this.queryParams.detectcategoryName = name.join('，')
        this.categorylist = this.queryParams.detectcategoryStr
      },
      // 提交
      handleSubmit () {
        this.$refs.queryForm.validate((valid) => {
          if (valid) {
            this.isloading = true
            if (this.showType === 'add') {
              addStandard(this.queryParams).then(res => {
                if (res.code === 200) {
                  this.isloading = false
                  this.$message.success('新增成功')
                  this.$parent.getList()
                  this.cancelbtn()
                } else {
                  this.isloading = false
                }
              }).catch(err => {
                this.isloading = false
              })
            } else {
              editStandard(this.queryParams).then(res => {
                if (res.code === 200) {
                  this.isloading = false
                  this.$message.success('修改成功')
                  this.$parent.getList()
                  this.cancelbtn()
                } else {
                  this.isloading = false
                }
              }).catch(err => {
                this.isloading = false
              })
            }
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
</style>

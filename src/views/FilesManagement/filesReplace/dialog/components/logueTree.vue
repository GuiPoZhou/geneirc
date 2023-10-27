<template>
    <div class="a-c-top" style="padding-top: 0">
      <p class="title">文件目录</p>
      <el-tree
          ref="tree"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :data="treedata"
          node-key="id"
          default-expand-all
          :filter-node-method="filterNode"
          :expand-on-click-node="false">
      </el-tree>
     
      <!--增加修改弹窗-->
      <el-dialog
          :title="diaTit"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose">
        <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            :prop="queryParams"
            :rules="rules"
            label-width="120px">
          <el-form-item label="上级目录名称" v-if="treedata.length !== 0">
            <treeselect
                :default-expand-level="5"
                v-model="queryParams.ids"
                :options="treedata"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="请选择标准分类"
                @select="handleNodeClickvis"
                @input="inputChange"
                style="width: 200px;"/>
          </el-form-item>
          <el-form-item label="本级目录名称" prop="name">
            <el-input placeholder="请输入本级目录名称" v-model="queryParams.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleOk" :loading="isloading">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
    import {addFiletree, deleteFileree, editFiletreeList} from '@/api/filesManagement/filesManagement.js'
    import Treeselect from "@riophae/vue-treeselect";
    import "@riophae/vue-treeselect/dist/vue-treeselect.css";
    export default {
      name: "productClassification",
      props: {
        type: String,
        treeList: Array
      },
      components: {Treeselect},
      data() {
        return {
          treedata: [],
          defaultProps: {
            children: 'childList',
            label: 'nodeName'
          },
          choiceData: {},
          isdisable: true,
          adddisable: false,
          filterText: '',
          titles: '执行标准分类',
          diaTit: '',
          dialogVisible: false,
          queryParams: {
            valueTitle: '',
            parentId: 0,
            name: '',
            id: 0,
            ids: 0,
          },
          rules: {
            name: [{ required: true, message: '请输入分类名称'}],
          },
          parentlist: [],
          isloading: false,
          selectName: ''
        }
      },
      watch: {
        filterText(val) {
          this.$refs.tree.filter(val);
        },
        treeList(val) {
          this.treedata = this.handleTree(val, "deptId");
          if (this.treedata.length === 0) {
            this.adddisable = false
          } else {
            this.adddisable = true
          }
        }
      },
      mounted() {
        if (this.type === '0') {
          this.titles = '执行标准分类'
        } else {
          this.titles = '标准中的产品分类'
        }
      },
      methods: {
        handleNodeClick(data,node,v) {
          if (node.data.parentId == 0) {
            this.parentlist = node.parent.data[0]
          } else {
            this.parentlist = node.parent.data
          }
          this.$emit('handleData', data)
          this.choiceData = data
          this.isdisable = false
          this.adddisable = false
        },
    
        handleOk() {
          this.$refs.queryForm.validate((valid) => {
            if (valid) {
              this.isloading = true
              if (this.diaTit === '新增') {
                const params = {
                  nodeName: this.queryParams.name,
                  parentId: this.queryParams.ids,
                }
                addFiletree(params).then(res => {
                  if (res.code === 200) {
                    this.isloading = false
                    this.$message.success('新增成功')
                    this.$emit('updata')
                    this.handleClose()
                  }
                }).catch(err => {
                  this.isloading = false
                })
              } else {
                if (this.selectName !== '') {
                  if (this.queryParams.name === this.selectName) {
                    this.$message.error('请重新选择上级分类')
                    this.isloading = false
                    return
                  }
                }
                const params = {
                  nodeName: this.queryParams.name,
                  parentId: this.queryParams.parentId,
                  id: this.queryParams.id,
                }
                editFiletreeList(params).then(res => {
                  if (res.code === 200) {
                    this.isloading = false
                    this.$message.success('修改成功')
                    this.$emit('updata')
                    this.handleClose()
                  }
                }).catch(err => {
                  this.isloading = false
                })
              }
            }
          })
        },
    
       
        // 初始化值
        initHandle(data,types){
          if (types == 1) {
            if (data.parentId === 0) {
              this.queryParams.ids = data.id
            } else {
              this.queryParams.ids = this.parentlist.id     // 初始化显示
            }
            this.queryParams.id = data.id
            this.queryParams.parentId = data.parentId
          } else {
            this.queryParams.ids = data.id     // 初始化显示
            this.queryParams.id = data.id
          }
        },
        handleNodeClickvis (node,data) {
          console.log(node)
          this.queryParams.ids = node.id
          this.queryParams.parentId = node.id
          this.selectName = node.nodeName
          // this.queryParams.id = node.id
        },
        inputChange (v) {
          if (v === undefined) {
            this.queryParams.parentId = 0
            this.selectName = ''
          }
        },
        filterNode(value, data) {
          if (!value) return true;
          // return data.label.indexOf(value) !== -1;
        },
        handleClose() {
          this.choiceData = {}
          this.isdisable = true
          this.adddisable = true
          this.dialogVisible = false
        },
        normalizer(node) {
          if (node.childList && !node.childList.length) {
            delete node.childList;
          }
          return {
            id: node.id,
            label: node.nodeName,
            children: node.childList,
            parentId: node.parentId
          };
        },
      }
    }
  </script>
  
  <style scoped lang="less">
    .headerbox {
      padding: 0;
      width: 25%;
    }
  
    .title {
      font-size: 14px;
      font-weight: 600;
      border-bottom: 1px solid #f5f5f5;
      padding: 10px;
    }
  
    .btnbox {
      margin-top: 20px;
      display: flex;
      flex-flow: column;
      padding: 10px;
      align-items: center;
  
      .el-button--medium {
        margin-bottom: 10px;
        width: 90%;
        margin-left: 0;
      }
    }
  
    /deep/ .el-dialog {
      height: 300px;
    }
    .el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
      height: auto;
      max-height: 274px;
      padding: 0;
      overflow: hidden;
      overflow-y: auto;
    }
    .el-select-dropdown__item.selected{
      font-weight: normal;
    }
    ul li.el-tree .el-tree-node__content{
      height:auto;
      padding: 0 20px;
    }
    .el-tree-node__label{
      font-weight: normal;
    }
    .el-tree .is-current .el-tree-node__label{
      color: #409EFF;
      font-weight: 700;
    }
    .el-tree .is-current .el-tree-node__children .el-tree-node__label{
      color:#606266;
      font-weight: normal;
    }
  </style>
  
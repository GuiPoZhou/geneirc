<template>
	<el-dialog :title="titles"
			   :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false"
			   :close-on-click-modal="false" width="70%" @close="cancelbtn" @open="open">
    <el-form
        :model="queryParams"
        ref="queryForm"
        :prop="queryParams"
        :rules="rules"
        label-width="120px"
    >

      <el-row>
        <el-col :span="12">
          <el-form-item label="设备编号" prop="fileNumbequipmentNumberer">
            <el-input placeholder="请输入设备编号" v-model="queryParams.equipmentNumber" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="equipmentName">
            <el-input placeholder="请输入设备名称" v-model="queryParams.equipmentName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="当前状态" prop="beforeStatus">
            <el-select v-model="queryParams.beforeStatus" placeholder="请选择" disabled>
              <el-option label="正常" :value="1"></el-option>
              <el-option label="停用" :value="2"></el-option>
              <el-option label="维修" :value="3"></el-option>
              <el-option label="保养" :value="4"></el-option>
              <el-option label="报废" :value="5"></el-option>
              <el-option label="封存" :value="6"></el-option>
              <el-option label="核查" :value="7"></el-option>
              <el-option label="故障" :value="8"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="修改状态" prop="afterStatus">
            <el-select v-model="queryParams.afterStatus" placeholder="请选择" :disabled="isdisable">
              <el-option label="正常" :value="1"></el-option>
              <el-option label="停用" :value="2"></el-option>
              <el-option label="维修" :value="3"></el-option>
              <el-option label="保养" :value="4"></el-option>
              <el-option label="报废" :value="5"></el-option>
              <el-option label="封存" :value="6"></el-option>
              <el-option label="核查" :value="7"></el-option>
              <el-option label="故障" :value="8"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="修改说明" prop="description">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.description"
                      :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleOk" v-if="showType !== 'show'">确定</el-button>
      <el-button @click="cancelbtn">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { editEquipmentStatus } from '@/api/resources/deviceManagement/index.js'
  export default {
    name: "editStatus",
    data() {
      return {
        dialogShow: false,
        isFullScreen: true,
        screenName: "fullScreen",
        titles: '新增',
        showType: 'add',
        activeName: 'first',
        queryParams: {},
        rules: {
          afterStatus: [{required: true, message: "请选择修改后的状态", trigger: "change"},
            {
              validator: (rule, value, callback) => {
                if (value === this.queryParams.beforeStatus) {
                  callback(new Error('修改后的状态不能同修改前的状态一样'))
                } else {
                  callback()
                }
              },
              trigger: 'change'
            }]
        },
        isdisable: false,
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
          this.titles = "新增";
        } else if (val == "update") {
          this.titles = "修改仪器状态";
        } else if (val == 'show') {
          this.titles = "查看";
          this.isdisable = true
        }
      },
    },
    methods: {
      e_changeBox(type) {
        this.isFullScreen = type;
      },
      open() {
      },
      init(show, data) {
        this.queryParams = {
          ...data
        }
        this.queryParams.beforeStatus = data.status
        this.showType = show
        this.dialogShow = true
      },
      handleOk() {
        this.$refs.queryForm.validate((valid) => {
          if (valid) {
            const params = {
              afterStatus: this.queryParams.afterStatus,
              beforeStatus: this.queryParams.beforeStatus,
              equipmentId: this.queryParams.id,
              description: this.queryParams.description,
            }
            editEquipmentStatus(params).then(res => {
              if (res.code === 200) {
                this.$message.success('修改成功')
                this.$parent.getList()
                this.cancelbtn()
              }
            })
          }
        })
      },
      cancelbtn() {
        this.$emit('close')
      }
    }
  }
</script>

<style scoped lang="less">
  /deep/ .el-dialog__body .el-col {
    margin-bottom: 0;
  }

  .prices {
    /deep/ .el-select .el-input {
      width: 100px;
    }

    /deep/ .input-with-select .el-input-group__append {
      background-color: #fff;
    }
  }

  .overMd {
    /deep/ .el-form-item__content {
      width: calc(100% - 130px) !important;
    }
  }
</style>

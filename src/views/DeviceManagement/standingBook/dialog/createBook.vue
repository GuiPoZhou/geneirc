<template>
  <el-dialog :title="titles" :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false"
    :close-on-click-modal="false" width="70%" @close="cancelbtn" @open="open">
    <el-form :model="queryParams" ref="queryForm" :prop="queryParams" :rules="rules" label-width="120px">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="设备基本信息" name="first">
          <el-row>
            <el-col :span="8">
              <el-form-item label="设备编号" prop="equipmentNumber">
                <el-input placeholder="请输入设备编号" v-model="queryParams.equipmentNumber" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备名称" prop="equipmentName">
                <el-input placeholder="请输入设备名称" v-model="queryParams.equipmentName" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="规格型号" prop="equipmentModel">
                <el-input placeholder="请输入规格型号" v-model="queryParams.equipmentModel" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="计量单位" prop="unit">
                <el-input placeholder="请输入计量单位" v-model="queryParams.unit" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="请选择" :disabled="isdisable">
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
            <el-col :span="8">
              <el-form-item label="生产厂商" prop="manufacturer">
                <el-input placeholder="请输入生产厂商" v-model="queryParams.manufacturer" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="出厂编号" prop="factoryNumber">
                <el-input placeholder="请输入出厂编号" v-model="queryParams.factoryNumber" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="购置日期" prop="purchaseDate">
                <el-date-picker v-model="queryParams.purchaseDate" value-format="yyyy-MM-dd" type="date"
                  placeholder="选择日期" style="width:100%" :disabled="isdisable"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="购买价格" prop="purchasePrice" class="prices">
                <el-input placeholder="请输入内容" v-model="queryParams.purchasePrice" :disabled="isdisable"
                  class="input-with-select">
                  <el-select v-model="queryParams.currency" slot="append" placeholder="请选择" :disabled="isdisable">
                    <el-option label="人民币" value="1"></el-option>
                    <el-option label="美元" value="2"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="出厂日期" prop="productionDate">
                <el-date-picker v-model="queryParams.productionDate" value-format="yyyy-MM-dd" type="date"
                  placeholder="选择日期" style="width:100%" :disabled="isdisable"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="验收日期" prop="acceptanceDate">
                <el-date-picker v-model="queryParams.acceptanceDate" value-format="yyyy-MM-dd" type="date"
                  placeholder="选择日期" style="width:100%" :disabled="isdisable"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="验收人" prop="acceptor">
                <el-input placeholder="请输入验收人" v-model="queryParams.acceptor" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="安装日期" prop="assemblyDate">
                <el-date-picker v-model="queryParams.assemblyDate" value-format="yyyy-MM-dd" type="date"
                  placeholder="选择日期" style="width:100%" :disabled="isdisable"></el-date-picker>
              </el-form-item>
            </el-col>


            <el-col :span="8">
              <el-form-item label="投用日期" prop="commissioningDate">
                <el-date-picker v-model="queryParams.commissioningDate" value-format="yyyy-MM-dd" type="date"
                  placeholder="选择日期" style="width:100%" :disabled="isdisable"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="使用部门" prop="userDepartment">
                <treeselect :disabled="isdisable" v-model="queryParams.userDepartment" :options="deptOptions"
                  :show-count="true" @select="departmentSelected" placeholder="请选择所属部门" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="存放地点" prop="position">
                <el-input placeholder="请输入存放地点" v-model="queryParams.position" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="保管人" prop="administrator">
                <el-input placeholder="请输入保管人" v-model="queryParams.administrator" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="量程" prop="range">
                <el-input placeholder="请输入量程" v-model="queryParams.range" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="精度等级" prop="accuracyClass">
                <el-input placeholder="请输入精度等级" v-model="queryParams.accuracyClass" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="计划朔源方式" prop="calibrationMode">
                <el-select v-model="queryParams.calibrationMode" placeholder="请选择" :disabled="isdisable">
                  <el-option label="检定" value="1"></el-option>
                  <el-option label="校准" value="2"></el-option>
                  <el-option label="期间核查" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计量参数" prop="calibrationCycle">
                <el-input placeholder="请输入计量参数" v-model="queryParams.measurementParam" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="overMd">
              <el-form-item label="检定校准周期" prop="calibrationCycle" label-width="125px">
                <el-input placeholder="请输入定校准周期" v-model="queryParams.calibrationCycle" :disabled="isdisable">
                  <el-button slot="append">个月</el-button>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8" class="overMd">
              <el-form-item label="上次检定校准日期" prop="lastCalibrationDate" label-width="125px">
                <el-date-picker v-model="queryParams.lastCalibrationDate" value-format="yyyy-MM-dd" type="date"
                  placeholder="选择日期" style="width:100%" :disabled="isdisable"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="overMd">
              <el-form-item label="检定校准失效日期" prop="loseCalibrationDate" label-width="125px">
                <el-date-picker v-model="queryParams.loseCalibrationDate" value-format="yyyy-MM-dd" type="date"
                  placeholder="选择日期" style="width:100%" :disabled="isdisable"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备分类" prop="fileName">
                <treeselect :disabled="isdisable" :default-expand-level="5" v-model="queryParams.treeId"
                  :options="treeOptions" :normalizer="normalizer" :show-count="true" placeholder="请选择分类"
                  @select="departTreeSelected" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否关键设备" prop="coreEquipment">
                <el-select v-model="queryParams.coreEquipment" style="width:100%" :disabled="isdisable">
                  <el-option label="是" value="Y"></el-option>
                  <el-option label="否" value="N"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remarks">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.remarks"
                  :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="录入人" prop="createBy">
                <el-input placeholder="请输入录入人" v-model="queryParams.createBy" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最新修改日期" prop="updateTime">
                <el-input placeholder="请输入录入人" v-model="queryParams.updateTime" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleOk" :loading="saveLoading" :disabled="saveLoading"
        v-if="showType !== 'show'">确定</el-button>
      <el-button @click="cancelbtn">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { treeselect } from "@/api/system/dept";
import { mapState } from "vuex";
import moment from "moment";
import {
  addEquipmentInstrument,
  editEquipment
} from '@/api/resources/deviceManagement/index.js'
export default {
  name: "createBook",
  components: { Treeselect },
  data() {
    return {
      saveLoading: false,
      dialogShow: false,
      isFullScreen: true,
      screenName: "fullScreen",
      titles: '新增',
      showType: 'add',
      activeName: 'first',
      queryParams: {
        currency: '1',
        coreEquipment: 'N',
      },
      rules: {
        equipmentNumber: [{ required: true, message: "请输入设备编号", trigger: "blur" }],
        equipmentName: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
        status: [{ required: true, message: "请选择设备状态", trigger: "change" }],
      },
      isdisable: false,
      // 部门树选项
      deptOptions: [],
      treeOptions: [],
    }
  },
  computed: {
    ...mapState({
      user: state => state.user.userInfo
    })
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
        this.titles = "修改";
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
      this.getTreeselect()
      this.queryParams.createBy = this.user.nickName
      this.queryParams.updateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    },
    init(show, data) {
      this.showType = show
      this.dialogShow = true
      if (data) {
        this.queryParams = {
          ...data
        }
        if (!this.queryParams.coreEquipment) {
          this.queryParams.coreEquipment = "N"
        }
      }
    },
    handleOk() {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          console.log(this.queryParams)
          this.saveLoading = true
          if (this.queryParams.id) {
            editEquipment(this.queryParams).then(res => {
              this.saveLoading = false
              if (res.code === 200) {
                this.$message.success('修改成功')
                this.$parent.getList()
                this.cancelbtn()
              }
            }).catch(error => {
              this.saveLoading = false
            })
          } else {
            addEquipmentInstrument(this.queryParams).then(res => {
              this.saveLoading = false
              if (res.code === 200) {
                this.$message.success('添加成功')
                this.$parent.getList()
                this.cancelbtn()
              }
            }).catch(error => {
              this.saveLoading = false
            })
          }
          setTimeout(() => {
            this.saveLoading = false
          }, 2500)
        }
      })
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
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    departmentSelected(val) {
      this.queryParams.userDepartment = val.id
    },
    // 设备分类
    treedata(data, id) {
      this.treeOptions = data
      if (this.showType === 'add') {
        this.queryParams.treeId = id
      }
    },
    departTreeSelected(node) {
      this.queryParams.treeId = node.id
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

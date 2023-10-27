<template>
  <el-dialog :title="titles"
             :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false"
             :close-on-click-modal="false" width="70%" @close="cancelbtn">
    <el-form :model="form" :rules="rules" ref="formData" label-width="100px">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="耗材名称" prop="materialName">
            <el-input v-model="form.materialName" :disabled="showType == 'look'"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="耗材编号" prop="materialNumber">
            <el-input v-model="form.materialNumber" :disabled="showType == 'look'"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规格型号" prop="materialModel">
            <el-input v-model="form.materialModel" :disabled="showType == 'look'"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计量单位" prop="unit">
            <el-input v-model="form.unit" :disabled="showType == 'look'" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品牌" prop="brand">
            <el-input v-model="form.brand" :disabled="showType == 'look'" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生产厂商" prop="manufacturer">
            <el-input v-model="form.manufacturer" :disabled="showType == 'look'"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="CAS号" prop="casNo">
            <el-input v-model="form.casNo" :disabled="showType == 'look'" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标准值/浓度" prop="standardValue">
            <el-input v-model="form.standardValue" :disabled="showType == 'look'"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="不确定度" prop="uncertainty">
            <el-input v-model="form.uncertainty" :disabled="showType == 'look'"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="介质" prop="media">
            <el-input v-model="form.media" :disabled="showType == 'look'" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="试剂级别" prop="grade">
            <el-select v-model="form.grade" :disabled="showType == 'look'" placeholder="请选择">
              <el-option v-for="(item,index) in gradeOptions" :key="index" :value="item.dictLabel"
                         :label="item.dictLabel"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="储存条件" prop="storeCondition">
            <el-select v-model="form.storeCondition" :disabled="showType == 'look'" placeholder="请选择">
              <el-option v-for="(item,index) in storeConditionOptions" :key="index"
                         :value="item.dictLabel" :label="item.dictLabel"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="耗材形态" prop="materialStatus">
            <el-select v-model="form.materialStatus" :disabled="showType == 'look'" placeholder="请选择">
              <el-option v-for="(item,index) in statusOptions" :key="index" :value="item.dictLabel"
                         :label="item.dictLabel"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="危化品">
            <el-radio label="1" :disabled="showType == 'look'" v-model="form.dangerFlag" name="dangerFlag">
              是
            </el-radio>
            <el-radio label="0" :disabled="showType == 'look'" v-model="form.dangerFlag" name="dangerFlag">
              否
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安全库存" prop="safeStore">
            <el-input v-model="form.safeStore" :disabled="showType == 'look'"
                      placeholder="请输入内容"></el-input>
            <span class="units">{{form.unit}}</span>
            <!--              <el-col :span="8">-->
            <!--                <el-select v-model="form.safeStoreUnitId" :disabled="showType == 'look'" placeholder="请选择">-->
            <!--                  <el-option v-for="(item,index) in unitsList" :key="index" :value="item.id"-->
            <!--                             :label="item.unitName"></el-option>-->
            <!--                </el-select>-->
            <!--              </el-col>-->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预设库存位置" prop="locations">
            <!--            <el-input v-model="form.locations" :disabled="showType == 'look'" placeholder="请输入内容"></el-input>-->
            <el-select v-model="form.locations" @change="setLocations" :disabled="showType == 'look'" placeholder="请选择">
              <el-option v-for="(item,index) in StoreSiteOptions" :key="index" :value="item.id"
                         :label="item.storeName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="可用状态" prop="status">
            <el-select v-model="form.status" :disabled="showType == 'look'" placeholder="请选择">
              <el-option v-for="(item,index) in statuOptions" :key="index" :value="item.value"
                         :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="form.remark" :disabled="showType == 'look'"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="showType != 'add'">
          <el-form-item label="录入人员">
            <el-input v-model="form.createByStr" disabled placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="showType != 'add'">
          <el-form-item label="最新修改日期">
            <el-input v-model="form.updateTimeStr" disabled placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleOk" :loading="isloading" v-if="showType !== 'look'">确定</el-button>
      <el-button @click="cancelbtn" :loading="isloading">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>


  import {
    getDataList,
    getStoreSiteList,
    getMaterialDetail,
    addMaterial,
    editMaterial
  } from '@/api/chemical/essentialInformation.js'

  export default {
    name: "addMatetial",
    data() {
      return {
        dialogShow: true,
        isFullScreen: true,
        isloading: false,
        screenName: "fullScreen",
        titles: '',
        activeName: 'first',
        form: {
          locations: "",
          dangerFlag: "0",
          status: "0",
          safeStoreUnitId: null
        },
        gradeOptions: "",
        unitsList: [],
        storeConditionOptions: "",
        statusOptions: "",
        StoreSiteOptions: [],
        statuOptions: [{
          label: "可用",
          value: "0"
        }, {
          label: "停用",
          value: "1"
        }],
        locations: "",
        rules: {
          materialName: [
            {required: true, message: "请输入耗材名称", trigger: "blur"}
          ],
          materialNumber: [
            {required: true, message: "请输入耗材编号", trigger: "blur"}
          ],
          materialModel: [
            {required: true, message: "请输入规格型号", trigger: "blur"}
          ],/*
				unit: [
					{required: true, message: "请输入计量单位", trigger: "blur"}
				],
				brand: [
					{required: true, message: "请输入品牌", trigger: "blur"}
				],
				manufacturer: [
					{required: true, message: "请输入生产厂商", trigger: "blur"}
				],
				casNo: [
					{required: true, message: "请输入CAS号", trigger: "blur"}
				],
				standardValue: [
					{required: true, message: "请输入标准值/浓度", trigger: "blur"}
				],
				uncertainty: [
					{required: true, message: "请输入不确定度", trigger: "blur"}
				],
				media: [
					{required: true, message: "请输入介质", trigger: "blur"}
				],
				grade: [
					{required: true, message: "请选择试剂级别", trigger: "change"}
				],
				storeCondition: [
					{required: true, message: "请选择储存条件", trigger: "change"}
				],
				materialStatus: [
					{required: true, message: "请选择耗材形态", trigger: "change"}
				],
				locations: [
					{required: true, message: "请选择预设库存位置", trigger: "change"}
				],
				safeStore: [
					{required: true, message: "请输入安全库存", trigger: "blur"}
				],
				status: [
					{required: true, message: "请选择可用状态", trigger: "change"}
				],*/
          /*remark: [
            {required: true, message: "请输入备注", trigger: "blur"}
          ],*/
        }
      }
    },
    computed: {
      getLeftWidth() {
        return this.$store.state.app.leftWidth;
      }
    },
    props: {
      materialId: '',
      detailId: 0,
      showType: ""
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
      }
    },
    mounted() {
      if (this.showType == "add") {
        this.titles = "新增";
      } else if (this.showType == "update") {
        this.titles = "修改";
      } else if (this.showType == 'look') {
        this.titles = "查看";
        this.isdisable = true
      }
      this.getDataLists();
      this.getUnits();
      this.form.materialTreeId = Number(this.materialId);
    },
    methods: {
      async getUnits() {
        let params = {
          isPage: false,
          status: false
        }
        let getData = await this.$net('/standard/v1/measuringUnits', 'get', params)
        if (getData.code == 200) {
          this.unitsList = getData.data.list
        }
      },
      setLocations(val) {
        for (var i in this.StoreSiteOptions) {
          if (this.StoreSiteOptions[i].id == val) {
            this.form.storeSite = this.StoreSiteOptions[i].id;
            this.form.storeSiteName = this.StoreSiteOptions[i].storeName;
          }
        }
      },
      handleOk() {
        this.$refs["formData"].validate((valid) => {
          if (valid) {
            this.isloading = true
            delete this.form.locations;
            if (this.detailId != 0) {
              this.form.id = this.detailId;
              editMaterial(this.form).then(res => {
                this.$message.success(res.msg);
                this.$emit('handleOk')
                this.isloading = false
              }).catch((e) => {
                this.isloading = false
              })
            } else {
              delete this.form.id;
              addMaterial(this.form).then(res => {
                this.$message.success(res.msg);
                this.$emit('handleOk')
                this.isloading = false
              }).catch((e) => {
                this.isloading = false
              })
            }
          } else {
            this.isloading = false
            return false;
          }
        })
      },
      getDataLists() {
        getDataList('material_grade').then(res1 => {
          this.gradeOptions = res1.data;
          getDataList('material_store_condition').then(res2 => {
            this.storeConditionOptions = res2.data;
            getDataList('material_status').then(res3 => {
              this.statusOptions = res3.data;
              getStoreSiteList({status: 1}).then(res => {
                this.StoreSiteOptions = res.data;
                if (this.detailId != 0) {
                  this.getDetail();
                }
              })
            })
          })
        })
      },
      cancelbtn() {
        this.$emit("close")
      },
      getDetail() {
        var id = this.detailId
        if (id != 0) {
          this.form.id = id
          getMaterialDetail(id).then(res => {
            this.form = res.data
            if (res.data.storeSiteName) {
              this.form.locations = Number(res.data.storeSite)
            }
          })
        } else {
          this.form = {}
        }
      },
      e_changeBox(type) {
        this.isFullScreen = type
      },

    }
  }
</script>

<style scoped>
  /deep/ .el-dialog__body .el-col {
    margin-bottom: 0;
  }

  .el-tabs__content {

  }

  /deep/ .el-tabs .el-tabs__content {
    overflow: initial !important;
  }

  /deep/ .el-dialog__body .el-table {
    background-color: #fff;
  }

  .units {
    position: absolute;
    top: 0;
    right: 10px;
  }

  .el-form-item-select {
    display: flex;
  }

  /deep/ [class*="el-col-"] {
    padding: 0 0 10px;
  }
</style>

<template>
  <el-dialog :title="titles"
             :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false"
             :close-on-click-modal="false" width="70%" @close="cancelbtn">
    <el-form :model="queryParams" ref="checkForm" :prop="queryParams" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="转移日期" prop="changeDate">
            <el-date-picker v-model="queryParams.changeDate" value-format="yyyy-MM-dd" type="date"
                            placeholder="选择日期" style="width:100%" :disabled="isdisable">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="耗材编号" prop="materialNumber">
            <el-input placeholder="请选择耗材编号" v-model="queryParams.materialNumber" :disabled="isdisable"
                      @focus="showMaterial" :readonly="true"></el-input>
            <materialSelect ref="materialSelect"
                            v-if="isShowMaterial" :dataList="materialList"
                            @close="isShowMaterial = false"
                            @confims="materialChange"></materialSelect>
            <!--						<el-select v-model="queryParams.materialNumber" placeholder="请选择耗材编号" @change="materialChange"
                                               :disabled="isdisable" style="width: 100%;">
                                        <el-option :value="item.materialNumber" :label="item.materialNumber"
                                                   v-for="(item,index) in materialList"></el-option>
                                    </el-select>-->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="耗材名称">
            <el-input v-model="detail.materialName" :disabled="true" placeholder="耗材名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="规格型号">
            <el-input v-model="detail.materialModel" :disabled="true" placeholder="规格型号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计量单位">
            <el-input v-model="detail.unit" :disabled="true" placeholder="计量单位"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="品牌">
            <el-input v-model="detail.brand" :disabled="true" placeholder="品牌"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="生产厂商">
            <el-input v-model="detail.manufacturer" :disabled="true" placeholder="生产厂商"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="转出库位" prop="fromStoreSiteName">
            <el-row style="display: flex;height: 30px;">
              <el-col :span="showType == 'show'?24:17"
                      :style="showType == 'show'?'':'margin-right: 10px'">
                <el-input placeholder="转出库位" v-model="queryParams.fromStoreSiteName" ref="fromStoreSiteNameInput"
                          :disabled="isdisable" @focus="showStore" @blur="hideStore"
                          :readonly="true"></el-input>
              </el-col>
              <el-col :span="6" v-if="showType != 'show'">
                <el-input placeholder="库存" v-model="detail.storeMaterialCount" :readonly="true"
                          :disabled="isdisable"></el-input>
              </el-col>
            </el-row>
            <stockSelect v-if="isShowStore" :dataList="storeList" @close="isShowStore = false"
                         @confims="storeSiteChange2" :disabled="isdisable"></stockSelect>

            <!--					<el-select v-model="detail.fromStoreSiteName" placeholder="请选择转出库位" @change="storeSiteChange"
                                               :disabled="isdisable" style="width: 100%;">
                                        <el-option :value="item.storeSiteName" :label="item.storeSiteName"
                                                   v-for="(item,index) in storeList"></el-option>
                                    </el-select>-->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出库数量" prop="materialCount">
            <!--                        <el-input-number v-model="queryParams.materialCount" :disabled="isdisable" :min="1"-->
            <!--                                         :max="detail.materialCount" placeholder="出库数量"></el-input-number>-->
            <el-input v-model="queryParams.materialCount" :disabled="isdisable" placeholder="出库数量"
                      oninput="value = value.replace(/[^\d]/g,'')" @blur="setMaterialCount()"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="转入库位" prop="toStoreSiteName">
            <el-select v-model="queryParams.toStoreSiteName" placeholder="请选择转入库位"
                       @change="storeSiteAllChange" :disabled="isdisable" style="width: 100%;">
              <el-option :value="item.id" :label="item.storeName"
                         v-for="(item,index) in storeAllList"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="批号">
            <el-input v-model="detail.batchNumber" :disabled="true" placeholder="批号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证书编号">
            <el-input v-model="detail.certificateNo" :disabled="true" placeholder="证书编号"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="生产日期">
            <el-input v-model="detail.productionDate" :disabled="true" placeholder="生产日期"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="有效期">
            <el-input v-model="detail.safeDate" :disabled="true" placeholder="有效期"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="有效到期日">
            <el-input v-model="detail.invalidDate" :disabled="true" placeholder="有效到期日"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input type="textarea" :disabled="isdisable" v-model="queryParams.remark"
                      placeholder="备注"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="保管员" prop="administratorAName">
            <el-select v-model="queryParams.administratorAName" placeholder="请选择保管员" @change="userChange"
                       :disabled="isdisable" style="width: 100%;">
              <el-option :value="item.userName" :label="item.nickName"
                         v-for="(item,index) in userList"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="经办人" prop="changePersonAName">
            <el-select v-model="queryParams.changePersonAName" placeholder="请选择经办人" @change="userChange2"
                       :disabled="true" style="width: 100%;">
              <el-option :value="item.userName" :label="item.nickName"
                         v-for="(item,index) in userList"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!--
            <el-col :span="8">
                <el-form-item style="height: 36px"></el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="保管员2">
                    <el-input v-model="queryParams.administratorBName" placeholder="保管员2"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="经办人2">
                    <el-input v-model="queryParams.changePersonBName" placeholder="经办人2"></el-input>
                </el-form-item>
            </el-col>
        -->
        <el-col :span="8">
          <el-form-item style="height: 36px"></el-form-item>
        </el-col>
        <el-col :span="8" v-if="showType != 'add'">
          <el-form-item label="录入人员">
            <el-input v-model="detail.createByStr" :disabled="true" placeholder="录入人员"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="showType != 'add'">
          <el-form-item label="最新修改日期">
            <el-input v-model="detail.updateTimeStr" :disabled="true" placeholder="最新修改日期"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" v-if="showType != 'show'" :loading="isloading" @click="handleOk()">确定</el-button>
      <el-button @click="cancelbtn">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getMaterialStoreCount} from '@/api/chemical/essentialInformation'
  import {queryStoreListByMaterialId} from '@/api/chemical/collectingIssue'
  import {queryStoreSiteList, queryStoreChangeDetail, allUseList, addStoreChange} from '@/api/chemical/stock'
  import stockSelect from '../../common/stockSelect.vue'
  import {getNowTime} from '../../common/common.js'
  import materialSelect from '../../common/materialSelect'

  export default {
    name: 'addStockMove',
    components: {stockSelect, materialSelect},
    data() {
      return {
        isShowMaterial: false,
        isloading: false,
        isFullScreen: true,
        dialogShow: true,
        isShowStore: false,
        isShowStore2: false,
        rules: {
          changeDate: [{required: true, message: '请选择转移日期', trigger: 'change'}],
          materialNumber: [{required: true, message: '请选择耗材编号', trigger: 'change'}],
          materialCount: [{required: true, message: '请输入出库数量', trigger: 'blur'}],
          fromStoreSiteName: [{required: true, message: '请选择转出库位', trigger: 'blur'}],
          toStoreSiteName: [{required: true, message: '请选择转入库位', trigger: 'change'}],
          administratorAName: [{required: true, message: '请选择保管员', trigger: 'change'}],
          changePersonAName: [{required: true, message: '请选择经办人', trigger: 'change'}]
        },
        queryParams: {
          administratorA: '',
          administratorAName: '',
          changePersonA: '',
          changePersonAName: '',
          changeDate: '',
          materialStoreId: '',
          materialCount: 1,
          toStoreSiteName: '',
          toStoreSite: '',
          remark: '',
          materialNumber: '',
          fromStoreSiteName: ''
        },
        materialList: [],
        isdisable: false,
        detail: {
          materialModel: '',
          unit: '',
          brand: '',
          manufacturer: '',
          batchNumber: '',
          certificateNo: '',
          productionDate: '',
          materialName: '',
          createByStr: '',
          updateTimeStr: '',
          materialCount: 1
        },
        storeList: [],
        titles: '新增',
        storeAllList: [],
        userList: []
      }
    },
    props: {
      showType: {
        type: String,
        default: 'add'
      },
      id: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.queryParams.changePersonAName = this.$store.getters.name
      this.userChange2(this.queryParams.changePersonAName)
      getMaterialStoreCount().then(res => {
        this.materialList = res.data
      })
      queryStoreSiteList({status: 1}).then(res => {
        this.storeAllList = res.data
      })
      allUseList().then(res => {
        this.userList = res.data
      })
      if (this.showType == 'add') {
        this.titles = '新增'
        this.queryParams.changeDate = getNowTime()
      } else {
        this.titles = '查看'
        this.getInfo()
        this.isdisable = true
      }
    },
    methods: {
      getInfo() {
        queryStoreChangeDetail(this.id).then(res => {
          console.log(res.data)
          this.queryParams.changeDate = res.data.changeDate
          this.queryParams.materialCount = res.data.materialCount
          this.queryParams.toStoreSiteName = res.data.toStoreSiteName
          this.queryParams.remark = res.data.remark
          this.queryParams.administratorAName = res.data.administratorAName
          this.queryParams.changePersonAName = res.data.changePersonAName

          this.queryParams.materialNumber = res.data.materialNumber
          this.detail.materialName = res.data.materialName
          this.detail.materialModel = res.data.materialModel
          this.detail.unit = res.data.unit
          this.detail.brand = res.data.brand
          this.detail.manufacturer = res.data.manufacturer
          this.queryParams.fromStoreSite = res.data.fromStoreSite
          this.queryParams.fromStoreSiteName = res.data.fromStoreSiteName
          this.detail.batchNumber = res.data.batchNumber
          this.detail.certificateNo = res.data.certificateNo
          this.detail.productionDate = res.data.productionDate
          this.detail.safeDate = res.data.safeDate
          this.detail.invalidDate = res.data.invalidDate
          this.detail.createByStr = res.data.createByStr
          this.detail.updateTimeStr = res.data.updateTimeStr
        })
      },
      showMaterial() {
        this.isShowMaterial = true
        this.$nextTick(() => {
          this.$refs.materialSelect.init()
        })
      },
      // hideMaterial() {
      // 	setTimeout(() => {
      // 		this.isShowMaterial = false
      // 	}, 500)
      // },
      // 限制出库数量
      setMaterialCount(data) {
        if (this.queryParams.materialCount * 1 > this.detail.materialCount * 1) {
          this.queryParams.materialCount = this.detail.materialCount * 1
        }
        console.log(this.queryParams.materialCount)
      },
      userChange(val) {
        for (var i in this.userList) {
          if (val == this.userList[i].userName) {
            this.queryParams.administratorAName = this.userList[i].userName
            this.queryParams.administratorA = this.userList[i].userId
          }
        }
      },
      userChange2(val) {
        for (var i in this.userList) {
          if (val == this.userList[i].userName) {
            this.queryParams.changePersonAName = this.userList[i].userName
            this.queryParams.changePersonA = this.userList[i].userId
          }
        }
      },
      materialChange(data) {
        this.isShowMaterial = false
        // for (var i in this.materialList) {
        // 	if (val == this.materialList[i].materialNumber) {
        this.queryParams.materialNumber = data.materialNumber
        this.detail.materialName = data.materialName
        this.detail.materialModel = data.materialModel
        this.detail.unit = data.unit
        this.detail.brand = data.brand
        this.detail.manufacturer = data.manufacturer
        this.getStoreListByMaterialId(data.id)
        // this.hideMaterial();
        // }
        // }
      },
      getStoreListByMaterialId(id) {
        queryStoreListByMaterialId(id).then(res => {
          this.storeList = res.data
          this.storeSiteChange(this.detail.storeSiteName)
        })
      },
      storeSiteChange(val) {
        for (var i in this.storeList) {
          if (val == this.storeList[i].storeSiteName) {
            this.queryParams.materialStoreId = this.storeList[i].id
            this.detail.batchNumber = this.storeList[i].batchNumber
            this.detail.certificateNo = this.storeList[i].certificateNo
            this.detail.productionDate = this.storeList[i].productionDate
            this.detail.safeDate = this.storeList[i].safeDate
            this.detail.invalidDate = this.storeList[i].invalidDate
            this.detail.materialCount = Number(this.storeList[i].materialCount)
            this.queryParams.materialCount = 1
          }
        }
      },
      storeSiteChange2(val) {
        this.queryParams.materialStoreId = val.id
        this.detail.batchNumber = val.batchNumber
        this.detail.certificateNo = val.certificateNo
        this.detail.productionDate = val.productionDate
        this.detail.safeDate = val.safeDate
        this.detail.invalidDate = val.invalidDate
        this.detail.materialCount = Number(val.materialCount)
        this.detail.storeMaterialCount = val.materialCount
        this.queryParams.materialCount = 1
        this.queryParams.fromStoreSite = val.fromStoreSite
        this.queryParams.fromStoreSiteName = val.storeSiteName
        this.$nextTick(() => {
          this.$refs.fromStoreSiteNameInput.focus()
          setTimeout(() => {
            this.$refs.fromStoreSiteNameInput.blur()
          }, 0)
        })
      },
      showStore() {
        this.isShowStore = true
      },
      hideStore() {
        setTimeout(() => {
          this.isShowStore = false
        }, 500)
      },
      storeSiteAllChange(val) {
        for (var i in this.storeAllList) {
          if (val == this.storeAllList[i].id) {
            this.queryParams.toStoreSite = this.storeAllList[i].id
            this.queryParams.toStoreSiteName = this.storeAllList[i].storeName
          }
        }
      },
      e_changeBox(type) {
        this.isFullScreen = type
      },
      cancelbtn() {
        this.$emit('close')
      },
      handleOk() {
        this.$refs['checkForm'].validate(valid => {
          if (valid) {
            this.isloading = true
            addStoreChange(this.queryParams).then(res => {
              if (res.code == 200) {
                this.isloading = false
                this.$emit('handleOk')
              }
            }).catch((e) => {
              this.isloading = false
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  /deep/ [class*="el-col-"] {
    padding: 0 0 10px;
  }
</style>

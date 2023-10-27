<template>
    <div>
        <BoDialog :diaLogShow="showLog" :diaLogTitle="titles + '计量单位'"
                  diaLogWidth="40%" @close="close">
            <template slot="bologbody">
                <el-form :model="unitParams" ref="unitForm" :rules="rules" :inline="true" label-width="120px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="单位A" prop="unitNameA">
                                <el-input v-model="unitParams.unitNameA" readonly @focus="handleUnit('unitNameA')"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="转换系数" prop="conversionCoefficient">
                                <el-input v-model="unitParams.conversionCoefficient" onkeyup="value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').replace(/[^\d.]/g,'')"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单位B" prop="unitNameB">
                                <el-input v-model="unitParams.unitNameB" readonly @focus="handleUnit('unitNameB')"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="备注说明" prop="remark">
                                <el-input v-model="unitParams.remark" type="textarea"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="编制人员" prop="updateBy">
                                <el-input v-model="unitParams.updateBy" clearable disabled/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="编制时间" prop="createTime">
                                <el-input v-model="unitParams.createTime" clearable disabled/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </template>
            <template slot="bologfooter">
                <el-button type="primary" @click="saveForm" center size="small" :loading="isLoading">保存</el-button>
                <el-button @click="close" size="small">取消</el-button>
            </template>
        </BoDialog>
        <!--  选择单位    -->
        <selectUnit v-if="showUnit" ref="unitRef" @close="showUnit = false" @selectUnit="selectUnit"></selectUnit>
    </div>
</template>

<script>
import selectUnit from './selectUnit.vue'
import moment from "moment/moment";
export default {
    components: {selectUnit},
    data() {
        return {
            showLog: false,
            titles: '新增',
            unitParams: {
                unitNameA: '',
                conversionCoefficient: '',
                unitNameB: '',
                remark: '',
                updateBy: this.$mainStore.state.user.userInfo.nickName,
                createTime: moment().format("YYYY-MM-DD HH:mm:ss")
            },
            rules: {
                unitNameA: [
                    {required: true, message: "请选择单位A", trigger: "change"},
                ],
                conversionCoefficient: [
                    {required: true, message: "请输入转换系数", trigger: "blur"},
                ],
                unitNameB: [
                    {required: true, message: "请选择单位B", trigger: "change"},
                ]
            },
            unitType: '',
            showUnit: false,
            isLoading: false
        }
    },
    methods: {
        init(type, data) {
            this.showLog = true
            if (type == 'edit') {
                this.titles = '编辑'
                this.unitParams = {
                    ...data
                }
            }
        },
        // 选择单位
        handleUnit (type) {
          this.showUnit = true
            this.unitType = type
            let name = ''
            if (type == 'unitNameA') {
                name = this.unitParams.unitNameB
            } else {
                name = this.unitParams.unitNameA
            }
          this.$nextTick(() => {
              this.$refs.unitRef.init(name)
          })
        },
        selectUnit (data) {
            if (this.unitType == 'unitNameA') {
                this.unitParams.unitNameA = data.unitName
            } else {
                this.unitParams.unitNameB = data.unitName
            }
        },
        saveForm() {
            this.$refs['unitForm'].validate((valid) => {
                if (valid) {
                    this.isLoading = true
                    let methods = this.unitParams.id ? 'put' : 'post'
                    this.$net('/standard/v1/measuringUnitsConvert', methods, this.unitParams).then(res => {
                        this.$message.success(res.msg)
                        this.$parent.getTablelist()
                        this.close()
                    }).finally(() => {
                        this.isLoading = false
                    })
                }
            })
        },
        close() {
            this.$emit('close')
        }
    }
}
</script>

<style scoped>
/deep/.el-notification {
    z-index: 2004 !important;
}
</style>
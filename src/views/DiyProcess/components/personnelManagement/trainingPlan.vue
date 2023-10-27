<template>
    <div style="margin-top: 20px">
        <el-form :model="queryParams"
                 ref="queryForm"
                 :inline="true"
                 class="searchform"
                 label-width="110px"
                 :rules="rules"
        >
            <el-row>
                <el-col :span="12">
                    <el-form-item label="计划编号" prop="planNo">
                        <el-input placeholder="请输入计划编号" v-model="queryParams.planNo" :disabled="isdisabled" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="计划年度" prop="planYear">
                        <el-date-picker
                            :disabled="isdisabled"
                            v-model="queryParams.planYear"
                            type="year"
                            value-format="yyyy"
                            format="yyyy"
                            placeholder="请选择计划年度">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="编制人员" prop="formulatePerson">
                        <el-input placeholder="请输入编制人员" v-model="queryParams.formulatePerson" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="编制时间" prop="formulateDate">
                        <el-input placeholder="请输入编制时间" v-model="queryParams.formulateDate" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="计划描述" prop="planDesc">
                        <el-input placeholder="请输入计划描述" type="textarea" v-model="queryParams.planDesc" :disabled="isdisabled" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div>
            <el-button size="mini" type="primary" @click="handleAdd" v-if="showType !== 'detail'">添加</el-button>
            <el-table
                :data="listData"
                stripe
                border
                style="margin-top: 20px"
            >
                <el-table-column label="序号" type="index" align="center" width="50"/>
                <el-table-column label="培训内容">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.trainContent" :disabled="isdisabled"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="主办部门/人">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.sponsor" :disabled="isdisabled"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="计划培训时间">
                    <template slot-scope="scope">
                        <el-date-picker
                            :disabled="isdisabled"
                            v-model="scope.row.trainDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            placeholder="选择计划培训时间">
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column label="培训方式">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.trainWay" :disabled="isdisabled"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="参加人员">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.joinPerson" :disabled="isdisabled"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="备注">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" type="textarea" :disabled="isdisabled"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="e_del(scope.$index)" style="color: #ff4949" :disabled="isdisabled">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import moment from "moment";
export default {
    name: "trainingPlan",
    data () {
        return {
            diaLogShow: false,
            isloading: false,
            titles: '新增培训计划',
            queryParams: {
                planNo: '',
                planYear: '',
                planDesc: '',
                formulatePerson: this.$mainStore.state.user.userInfo.nickName,
                formulateDate: moment().format("YYYY-MM-DD")
            },
            rules: {
                planNo: [
                    {required: true, message: '请输入计划编号', trigger: 'blur'},
                ],
                planYear: [
                    {required: true, message: '请选择计划年度', trigger: 'change'},
                ],
            },
            isdisabled: false,
            showType: '',
            listData: []
        }
    },
    methods: {
        init (type, data) {
            this.showType = type
            if (type === 'edit') {
                this.titles = '修改培训计划'
            } else if (type === 'detail') {
                this.titles = '查看培训计划'
                this.isdisabled = true
            }
            if (data) {
                this.queryParams = {
                    ...data
                }
                this.listData = data.trainPlanDetailList
            }
        },
        // 添加
        handleAdd () {
            let obj = {}
            obj.trainContent = ''
            obj.sponsor = ''
            obj.joinPerson = ''
            obj.trainDate = ''
            obj.trainWay = ''
            obj.remark = ''
            this.listData.push(obj)
        },
        e_del (index) {
            this.listData.splice(index,1)
        },
        // 保存
        handleSave(status) {
            this.$refs.queryForm.validate((valid) => {
                if (valid) {
                    this.isloading = true
                    this.queryParams.status = status
                    if (this.listData.length === 0) {
                        this.isloading = false
                        this.$message.error('请至少填写一条培训计划，完善表格数据')
                        return;
                    }
                    let isEmpty = false
                    this.listData.map(item => {
                        if (item.trainContent === '' || item.sponsor === '' || item.joinPerson === '' || item.trainDate === '' || item.trainWay === '') {
                            isEmpty = true
                        }
                    })
                    if (isEmpty) {
                        this.isloading = false
                        this.$message.warning('请完善表格数据')
                        return;
                    }
                    const params = {
                        ...this.queryParams,
                        trainPlanDetailList: this.listData
                    }
                    if (this.queryParams.id) {
                        this.$net('/v1/trainPlanPhinx/updateTrainPlan', 'put', params).then(res => {
                            this.isloading = false
                            this.$message.success(res.msg)
                            this.$parent.getList()
                            this.e_close()
                        }).catch((err) => {
                            this.$message.success(err)
                            this.isloading = false
                        })
                    }else {
                        this.$net('/v1/trainPlanPhinx/addTrainPlan', 'post', params).then(res => {
                            this.isloading = false
                            this.$message.success(res.msg)
                            this.$parent.getList()
                            this.e_close()
                        }).catch((err) => {
                            this.$message.success(err)
                            this.isloading = false
                        })
                    }
                }
            })
        },
        e_close () {
            this.$emit('close')
        }
    }
}
</script>

<style scoped>

</style>
<script setup>
</script>
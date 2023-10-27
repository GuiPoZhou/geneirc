<template>
    <div class="approvalOpinion">
        <el-dialog
            title="审批意见"
            :visible.sync="auditOpinionShow"
            center
            width="600px"
            :show-close="true"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :append-to-body="true"
            @close="close"
        >
            <el-form
                :model="queryParams"
                :rules="rules"
                ref="approvalForm"
                :inline="true"
                label-width="200px"

            >
                <div class="input-size">
                    <el-form-item label="审批结果">
                        <el-radio-group
                            v-model="queryParams.radio"
                            disabled
                        >
                            <el-radio :label="1">通过</el-radio>
                            <el-radio :label="2">退回</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
                <div class="input-size" v-if="!isLast">
                    <el-form-item label="审批意见" prop="opinion">
                        <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="queryParams.opinion"
                        >
                        </el-input>
                    </el-form-item>
                    <el-input v-model="queryParams.ids" :hidden="true"/>
                </div>
                <div class="input-size" v-if="isLast">
                    <el-form-item label="意见/解释" prop="opinion">
                        <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="queryParams.opinion"
                        >
                        </el-input>
                    </el-form-item>
                </div>
                <div class="input-size" v-if="isLast">
                    <el-form-item label="备注" prop="remark">
                        <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="queryParams.remark"
                        >
                        </el-input>
                    </el-form-item>
                </div>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmAdd()" center>
                    确认
                </el-button>
                <el-button @click="close">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {
        passAudit,
        returnAudit
    } from '@/api/detectionManage/resultsAudit/resultsAudit'
    export default {
        name: 'approvalOpinion',
        components: {},
        data() {
            return {
                queryParams: {
                    opinion: null,
                    remark: null

                },
                checkData: [], //被选择的数据
                isLast: false,
                rules: {
                    opinion: [
                        {
                            required: true,
                            message: '请输入审批意见',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        props: {
            auditOpinionShow: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            init(data, checkData) {
                this.checkData = checkData
                this.checkData.map((item) => {
                    if (item.maxNode == 1) {
                        this.isLast = true
                    }
                })
                this.queryParams = { ...data }
            },
            //取消按钮操作
            close() {
                this.$emit('update:auditOpinionShow', false)
            },
            confirmAdd() {
                const num = this.queryParams.radio
                console.log(this.queryParams.opinion)
                if (this.queryParams.opinion === undefined) {
                    this.$message({
                        message: '请输入审批意见!',
                        type: 'warning'
                    })
                    return
                }
                const saveDate = {
                    detectSampleItemIdsStr: this.queryParams.ids,
                    auditOpinion: this.queryParams.opinion,
                    remark: this.queryParams.remark
                }
                if (num == 1) {
                    passAudit(saveDate)
                        .then((res) => {
                            if (res.code == '200') {
                                this.$message.success('保存成功')
                                this.$emit('savereload')
                            }
                        })
                        .catch(function() {
                        })
                } else if (num == 2) {
                    returnAudit(saveDate)
                        .then((res) => {
                            if (res.code == '200') {
                                this.$message.success('保存成功')
                                this.$emit('savereload')
                            }
                        })
                        .catch(function() {
                        })
                }

            }
        }
    }
</script>

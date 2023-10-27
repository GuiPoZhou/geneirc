<!--
 * @Autor: 焦政
 * @Date: 2021-02-05 10:11:06
 * @Description:
-->
<template>
    <div class="withdrawalApproval">
        <el-dialog
            title="撤回审批结果"
            :visible.sync="withdrawalShow"
            center
            width="600px"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :append-to-body="true"
            @close="close"
        >
            <el-form
                :model="withdrawalParams"
                ref="approvalForm"
            >
                    <el-form-item label="撤回原因" prop="opinion">
                        <el-input
                            style="margin-top: 10px"
                            type="textarea"
                            :rows="4"
                            placeholder="请输入内容"
                            v-model="withdrawalParams.opinion"
                        >
                        </el-input>
                    </el-form-item>
                <el-input v-model="withdrawalParams.ids" :hidden="true"/>
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
    import { recallAudit } from '@/api/detectionManage/resultsAudit/resultsAudit'

    export default {
        name: 'withdrawalApproval',
        components: {},
        data() {
            return {
                loading: false
            }
        },
        props: {
            withdrawalShow: {
                type: Boolean,
                default: false
            },
            withdrawalParams: {
                type: Object
            }
        },
        methods: {
            confirmAdd() {
                const saveDate = {
                    detectSampleItemIdsStr: this.withdrawalParams.ids,
                    auditOpinion: this.withdrawalParams.opinion
                }
                recallAudit(saveDate)
                    .then(() => {
                        //触发父组件传递过来的函数getTablelist()
                        this.$emit('func', null)
                        this.$message.success('保存成功')
                        this.close()
                    })
                    .catch(function() {
                    })
            },
            //取消按钮操作
            close() {
                this.$emit('update:withdrawalShow', false)
            }
        }
    }
</script>

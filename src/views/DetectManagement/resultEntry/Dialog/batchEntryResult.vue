<template>
    <div class="infoAdd">
        <el-dialog title="批量录入结果" :visible.sync="showDialog" center :show-close="true" width="400px"
                   :close-on-press-escape="false" :close-on-click-modal="false" @close="close">
            <el-form :model="queryParams" ref="queryForm" :inline="true">
                <el-form-item label="检测结果" prop="detectResult"
                              :rules="[{
                    required: true,
                    message: '请输入',
                    trigger: 'blur',
                }]">
                    <el-input v-model="queryParams.detectResult"/>
                </el-form-item>
                <el-form-item label="判定结论" prop="conclusion"
                              :rules="[{
                    required: true,
                    message: '请输入',
                    trigger: 'blur',
                }]">
                    <el-input v-model="queryParams.conclusion"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm()">
                    确定
                </el-button>
                <el-button @click="close">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Lang from './Lang'

    export default {
        data() {
            return {
                Lang,
                showDialog: false,
                queryParams: {
                    detectResult: null,
                    conclusion: null
                }
            }
        },
        methods: {
            init() {
                this.showDialog = true
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url
            },
            //取消按钮操作
            close() {
                this.showDialog = false
                this.$emit('close')
            },
            submitForm() {
                this.$refs.queryForm.validate((valid) => {
                    if (valid) {
                        this.$emit('hanldeResult', this.queryParams)
                        this.showDialog = false
                    }
                })
            }
        }
    }
</script>
<style lang="less">
</style>

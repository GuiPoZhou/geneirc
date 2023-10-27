<template>
    <div>
        <el-dialog title="导入" :visible.sync="diaLogShow" width="400px" append-to-body>
            <el-upload
                ref="upload"
                :limit="1"
                :headers="upload.headers"
                :action="upload.url + '?updateSupport=' + upload.updateSupport +'&treeId=' + id"
                :disabled="upload.isUploading"
                :on-progress="handleFileUploadProgress"
                :on-success="handleFileSuccess"
                :auto-upload="false"
                drag
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip text-center" slot="tip">
                              <div class="el-upload__tip" slot="tip">
                                <el-checkbox v-model="upload.updateSupport"/>
                                是否更新已经存在的设备数据
                              </div>
                    <span>仅允许导入xls、xlsx格式文件。</span>
                    <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                             @click="downloadTemplate">下载模板
                    </el-link>
                </div>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="submitFileForm">确 定</el-button>
                <el-button size="small" @click="e_close">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { getToken } from '@/utils/auth'

    export default {
        data() {
            return {
                showType: 'add',
                diaLogShow: false,
                isdisabled: false,
                MiningAreaList: [],
                id: null,
                // 用户导入参数
                upload: {
                    // 是否显示弹出层（用户导入）
                    open: false,
                    // 弹出层标题（用户导入）
                    title: '',
                    // 是否禁用上传
                    isUploading: false,
                    // 是否更新已经存在的用户数据
                    updateSupport: false,
                    // 设置上传的请求头部
                    headers: { Authorization: 'Bearer ' + getToken(),MenuId:localStorage.getItem('menuId') },
                    // 上传的地址
                    url: window.globalEnv.VUE_APP_BASE_API + '/busiAreaDrill/importData'
                }
            }
        },

        watch: {},
        mounted() {
        },
        methods: {
            init(url,id) {
                this.diaLogShow = true
                this.upload.url = url
                this.id = id
            },
            // 文件上传中处理
            handleFileUploadProgress(event, file, fileList) {
                this.upload.isUploading = true
            },
            // 文件上传成功处理
            handleFileSuccess(response, file, fileList) {
                this.diaLogShow = false
                this.upload.isUploading = false
                this.$refs.upload.clearFiles()
                this.$alert('<div style=\'overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;\'>' + response.msg + '</div>', '导入结果', { dangerouslyUseHTMLString: true })
                this.$emit('reload')
            },
            // 提交上传文件
            submitFileForm() {
                this.$refs.upload.submit()
            },
            downloadTemplate() {
                this.$emit('downloadTemplate')
            },
            e_close() {
                this.diaLogShow = false
                this.$emit('close')
            }
        }
    }
</script>

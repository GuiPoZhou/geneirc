<!--报价、委托、合同、方案相关附件上传组件-->
<template>
    <el-dialog
        class="elDialog"
        center
        width="60%"
        :title="title"
        :visible.sync="showlog"
        :modal-append-to-body="false"
        :show-close="false"
        @close="cancel"
    >
        <el-upload
            class="upload-demo"
            :action="uploadFileUrl"
            :on-preview="handlePreview"
            :on-success="uploadFileSuccess"
            multiple
            :limit="10"
            :on-exceed="handleExceed"
            :show-file-list="false"
        >
            <el-button
                size="small"
                type="primary"
            >点击上传
            </el-button
            >
        </el-upload>
        <el-table
            :data="tableData"
            style="width: 100%"
        >
            <el-table-column
                type="index"
                label="序号"
                width="50"
            >
            </el-table-column>
            <el-table-column
                prop="createBy"
                label="上传人员"
                width="180"
            >
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="上传时间"
                width="180"
            >
            </el-table-column>
            <el-table-column
                prop="fileName"
                label="文件名称"
            >
            </el-table-column>
            <el-table-column
                label="操作"
            >
                <template slot-scope="scope">
                    <el-button type="text" @click="downloadFile(scope.row)">下载</el-button>
                    <el-button type="text" style="color:red" @click="e_deleteFile(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">返回</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { downloadNew } from '@/utils/ruoyi'

export default {
    data() {
        return {
            showlog: false,
            uploadFileUrl: window.globalEnv.VUE_APP_BASE_API + '/common/upload',
            tableData: [],
            mainId: '',
            searchUrl: '',
            fileList: []
        }
    },
    props: {
        title: {
            typeof: String,
            default: '附件上传'
        },
        type: {
            typeof: String,
            default: ''
        }
    },
    methods: {
        //删除附件
        e_deleteFile(id) {
            this.$confirm('确定删除该文件吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$emit('fileDelete', id)
            })
        },
        //执行查询
        async doSearch() {
            let getRes = await this.$net(this.searchUrl, 'get')
            this.tableData = getRes.rows || getRes.data
        },
        //报价上传
        async doUplaodForPrice(fileParams) {
            let params = {
                id: this.mainId,
                addParam: {
                    fileList: [fileParams]
                }
            }
            let uploadRes = await this.$net('/v2/mark/uploadFile', 'post', params)
            this.doSearch()
            this.$emit('mainReload')
        },
        //合同上传
        async doUplaodForContract(fileParams) {
            let params = {
                id: this.mainId,
                fileList: [fileParams]
            }
            let uploadRes = await this.$net('/v3/contract/uploadFile', 'post', params)
            this.doSearch()
            this.$emit('mainReload')
        },
        //方案上传
        async doUploadForProject(fileParams) {
            let params = {
                id: this.mainId,
                fileList: [fileParams]
            }
            let uploadRes = await this.$net('/v1/detectSchemes/uploadFile', 'post', params)
            this.doSearch()
            this.$emit('mainReload')
        },
        cancel() {
            this.$emit('cancel')
        },
        init(id, url) {
            this.searchUrl = url
            this.showlog = true
            this.mainId = id
            this.doSearch()
        },
        handlePreview(file) {
            console.log('file', file)
            this.download(file.name)
        },
        //下载文件
        downloadFile(file) {
            downloadNew(file.filePath)
        },
        //文件上传成功
        uploadFileSuccess(response, file, fileList) {
            let fileParams = {
                businessId: this.mainId,
                businessType: '报价',
                fileName: file.response.fileName,
                filePath: file.response.url
            }
            if (this.type == 'price') {
                this.doUplaodForPrice(fileParams)
            } else if (this.type == 'contract') {
                this.doUplaodForContract(fileParams)
            } else if (this.type == 'project') {
                this.doUploadForProject(fileParams)
            }

        },
        handleExceed(files, fileList) {
            this.$message.warning(
                `当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
                    files.length + fileList.length
                } 个文件`
            )
        }
    }
}
</script>

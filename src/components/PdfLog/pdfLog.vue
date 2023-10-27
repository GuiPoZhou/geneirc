<template>
    <el-dialog
        title="采样原始数据"
        :visible.sync="showlog"
        class="elDialog"
        width="100%"
        append-to-body
        :destroy-on-close="false"
        :close-on-click-modal="false"
        :before-close="cancel"
        @close="cancel"
    >
        <iframe
            :style="showpdf2 == true?'width: 50%; height: 100vh':'width: 100%; height:100vh'"
            :src="pdfURL"
            frameborder="0"
        ></iframe>
        <iframe
            style="width: 50%; height: 100vh"
            :src="pdfURL2"
            v-if="showpdf2"
            frameborder="0"
        ></iframe>
        <div slot="footer" class="dialog-footer">
            <!--            <el-button type="primary" v-if="showType == 'Archived'" @click="originalRecords()">原始记录</el-button>-->
            <el-button @click="cancel">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        data() {
            return {
                showlog: false,
                showpdf2: false,
                pdfURL: '',
                showType: '',
                openType: '',
                pdfURL2: ''
            }
        },
        methods: {
            init(row, showType) {
                console.log(row)
                this.showType = showType
                this.rowData = row
                this.showlog = true
                let type = 1
                // status 20 待审批  30 已审批  61 已归档 50 待归档
                // type 1是未审批 3是已签章 4是已审批
                row.status == 20 ? (type = 1) : row.status == 61 ? (type = 3) : row.status == 50 ? (type = 3) : (type = 4)
                let url = `/report/v2/manager/audit/download/${row.id}/${type}`
                this.pdfURL =
                    '/pdfjs/web/viewer.html?file=' +
                    window.globalEnv.VUE_APP_BASE_API +
                    encodeURI(url)
            },
            // 原始记录
            originalRecords() {
                if (this.rowData.originalPdfToOne) {
                    this.showpdf2 = !this.showpdf2
                } else {
                    this.$message.info('无原始记录')
                    return
                }
                this.pdfURL2 = '/pdfjs/web/viewer.html?file=' +
                    window.globalEnv.VUE_APP_BASE_API + '/' + this.rowData.originalPdfToOne
            },
            // 直接返回的文件地址 使用的入口方法
            openInit(path) {
                this.showlog = true
                this.pdfURL = '/pdfjs/web/viewer.html?file=' +
                    window.globalEnv.VUE_APP_BASE_API + '/' + path
            },
            cancel() {
                this.showlog = false
                this.$emit('cancel')
            }
        }
    }
</script>

<style>
</style>

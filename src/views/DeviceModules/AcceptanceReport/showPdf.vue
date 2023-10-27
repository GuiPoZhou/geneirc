<template>
    <el-dialog title="PDF信息" :visible.sync="showFormDetail" append-to-body center :show-close="true" @close="closePdf" class="changePosition" :close-on-press-escape="false"
        :close-on-click-modal="false">
        <iframe style="width: 100%; height: 100vh" :src="pdfURL" frameborder="0" v-if="showFormDetail"></iframe>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closePdf">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            showFormDetail: false,
            pdfURL: '',
        }
    },
    methods: {
        init(url) {
            this.pdfURL =
                '/pdfjs/web/viewer.html?file=' +
                window.globalEnv.VUE_APP_BASE_API +'/'+
                url
            console.log('查看验收报告',this.pdfURL)
            this.showFormDetail = true
        },
        closePdf() {
            this.$emit('close')
        }
    }
}
</script>

<style></style>
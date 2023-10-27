<template>
    <BoDialog
        diaLogTitle='ELN'
        :diaLogShow="showlog"
        diaLogWidth="80%"
        append-to-body
        :destroy-on-close="false"
        :close-on-click-modal="false"
        :before-close="cancel"
        @close="cancel"
    >
        <template slot="bologbody">
            <iframe
                style="width: 100%; height: 80vh"
                :src="pdfURL"
                frameborder="0"
            ></iframe>
        </template>

    </BoDialog>
</template>

<script>
    export default {
        data() {
            return {
                showlog: false,
                pdfURL: ''
            }
        },
        methods: {
            init(url) {
                console.log(111)
                this.showlog = true
                this.pdfURL = url
            },
            cancel() {
                this.$emit('cancel')
            },
            handleMessage(e) {
                console.log('获取监听11', e)
            }
        },
        mounted() {
            this.$nextTick(() => {
                window.addEventListener('message', this.handleMessage)
            })
        }
    }
</script>

<style>
    .elnIFrame .el-dialog {
        height: 100vh !important;
        max-height: 95% !important;
        padding-bottom: 0px !important;
    }

    .elnIFrame .el-dialog:not(.is-fullscreen) {
        margin-top: 5px !important;
    }

    .elnIFrame .el-dialog .el-dialog__body {
        height: 100% !important;
    }

    .elnIFrame .el-dialog .el-dialog__body ::-webkit-scrollbar {
        width: 0;
    }
</style>

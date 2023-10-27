<template>
    <div>
        <BoDialog :diaLogShow="dialogShow"
                  :diaLogTitle="titel"
                  diaLogWidth="60%" @close="cancelbtn">
            <template slot="bologbody">
                <div class="contbox">
                    <p class="notice-p">{{queryParams.noticeTitle}}</p>
                    <p class="notice-time">日期：{{queryParams.time}}</p>
                    <div class="noticeCont">
                        <span v-html="queryParams.noticeContent"></span>
                    </div>
                </div>
            </template>
            <template slot="bologfooter">
                <el-button @click="cancelbtn">返回</el-button>

            </template>
        </BoDialog>
    </div>
</template>

<script>
    import Editor from '@/components/Editor'

    export default {
        name: 'notices',
        components: {
            Editor
        },
        data() {
            return {
                isFullScreen: true,
                screenName: 'fullScreen',
                dialogShow: false,
                queryParams: {},
                radio: '1',
                titel: '查看公告',
                noticeContent: ''
            }
        },
        computed: {
            getLeftWidth() {
                return this.$store.state.app.leftWidth
            }
        },
        mounted() {
            let width = this.$store.state.app.leftWidth
            if (width < 200) {
                this.screenName = 'bigFullScreen'
            } else {
                this.screenName = 'fullScreen'
            }
        },
        watch: {
            getLeftWidth() {
                let width = this.$store.state.app.leftWidth
                if (width < 200) {
                    this.screenName = 'bigFullScreen'
                } else {
                    this.screenName = 'fullScreen'
                }
            }
        },
        methods: {
            init(params) {
                if (params) {
                    this.queryParams = {
                        ...params
                    }
                }
                this.dialogShow = true
            },
            cancelbtn() {
                this.$emit('close')
            }
        }
    }
</script>

<style scoped>
    p {
        margin-bottom: 0;
    }

    .contbox {
        padding: 10px 30px;
    }

    .notice-p {
        font-weight: bold;
        font-size: 25px;
        color: #000;
        text-align: center;
    }

    .notice-time {
        text-align: center;
        font-size: 14px;
        color: #666666;
        margin-top: 5px;
        border-bottom: 1px solid #f5f5f5;
        padding-bottom: 10px;
    }

    .noticeCont {
        font-size: 16px;
        padding-top: 15px;
        text-indent: 2em;
    }

    /deep/ .el-dialog.is-fullscreen {
        height: 100% !important;
    }
</style>

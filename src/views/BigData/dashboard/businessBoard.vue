<template>
    <el-row :gutter="10" class="panel-group">
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
            <div class="business-list">
                <div class="bl-top">
                    <div class="blt-left">
                        <img class="bltl-icon" src="./images/dataEnter.png" alt="">
                        <span class="bltl-title">数据录入</span>
                    </div>
                    <span class="blt-desc">任务数量明细</span>
                </div>
                <div class="bl-bottom">
                    <a class="blb-list" @click="routerJump('resultEntry','1')">
                        <count-to :start-val="0" :end-val="digitalData.detectDataInput.stayHandle" :duration="2200"
                                  class="card-panel-num"/>
                        <span class="blbl-title">待处理</span>
                    </a>
                    <a class="blb-list" @click="routerJump('resultEntry','3')">
                        <count-to :start-val="0" :end-val="digitalData.detectDataInput.hasHandle" :duration="2200"
                                  class="card-panel-num"/>
                        <span class="blbl-title">已处理</span>
                    </a>
                    <a class="blb-list" @click="routerJump('resultEntry','2')">
                        <count-to :start-val="0" :end-val="digitalData.detectDataInput.hasWithdrawal" :duration="2200"
                                  class="card-panel-num"/>
                        <span class="blbl-title">被退回</span>
                    </a>

                </div>
            </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
            <div class="business-list">
                <div class="bl-top">
                    <div class="blt-left">
                        <img class="bltl-icon" src="./images/dataAudit.png" alt="">
                        <span class="bltl-title">数据审核</span>
                    </div>
                    <span class="blt-desc">任务数量明细</span>
                </div>
                <div class="bl-bottom">
                    <a class="blb-list" @click="routerJump('resultReview',1,null)">
                        <count-to :start-val="0" :end-val="digitalData.detectDataAudit.stayHandle" :duration="2200"
                                  class="card-panel-num"/>
                        <span class="blbl-title">待处理</span>
                    </a>
                    <a class="blb-list" @click="routerJump('resultReview',2,null)">
                        <count-to :start-val="0" :end-val="digitalData.detectDataAudit.hasHandle" :duration="2200"
                                  class="card-panel-num"/>
                        <span class="blbl-title">已处理</span>
                    </a>
                    <a class="blb-list" @click="routerJump('resultReview',2,2)">
                        <count-to :start-val="0" :end-val="digitalData.detectDataAudit.hasWithdrawal" :duration="2200"
                                  class="card-panel-num"/>
                        <span class="blbl-title">已退回</span>
                    </a>

                </div>
            </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
            <div class="business-list">
                <div class="bl-top">
                    <div class="blt-left">
                        <img class="bltl-icon" src="./images/reportEdit.png" alt="">
                        <span class="bltl-title">报告编制</span>
                    </div>
                    <span class="blt-desc">任务数量明细</span>
                </div>
                <div class="bl-bottom">
                    <a class="blb-list" @click="routerJump('reportCompile',1)">
                        <count-to :start-val="0" :end-val="digitalData.reportCompile.stayHandle" :duration="2200"
                                  class="card-panel-num"/>
                        <span class="blbl-title">待处理</span>
                    </a>
                    <a class="blb-list" @click="routerJump('reportCompile',3)">
                        <count-to :start-val="0" :end-val="digitalData.reportCompile.hasHandle" :duration="2200"
                                  class="card-panel-num"/>
                        <span class="blbl-title">已处理</span>
                    </a>
                    <a class="blb-list" @click="routerJump('reportCompile',2)">
                        <count-to :start-val="0" :end-val="digitalData.reportCompile.hasWithdrawal" :duration="2200"
                                  class="card-panel-num"/>
                        <span class="blbl-title">被退回</span>
                    </a>

                </div>
            </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
            <div class="business-list">
                <div class="bl-top">
                    <div class="blt-left">
                        <img class="bltl-icon" src="./images/reportAudit.png" alt="">
                        <span class="bltl-title">报告审核</span>
                    </div>
                    <span class="blt-desc">任务数量明细</span>
                </div>
                <div class="bl-bottom">
                    <a class="blb-list" @click="routerJump('reportAudit',0)">
                        <count-to :start-val="0" :end-val="digitalData.reportAudit.stayHandle" :duration="2200"
                                  class="card-panel-num"/>
                        <span class="blbl-title">待处理</span>
                    </a>
                    <a class="blb-list" @click="routerJump('reportAudit',1)">
                        <count-to :start-val="0" :end-val="digitalData.reportAudit.hasHandle" :duration="2200"
                                  class="card-panel-num"/>
                        <span class="blbl-title">已处理</span>
                    </a>
                    <a class="blb-list" @click="routerJump('reportAudit',1,0)">
                        <count-to :start-val="0" :end-val="digitalData.reportAudit.hasWithdrawal" :duration="2200"
                                  class="card-panel-num"/>
                        <span class="blbl-title">已退回</span>
                    </a>

                </div>
            </div>
        </el-col>

    </el-row>
</template>
<script>
    import CountTo from 'vue-count-to'

    export default {
        components: {
            CountTo
        },
        data() {
            return {
                digitalData: {
                    // 报告审核
                    reportAudit: {
                        hasHandle: 0,
                        hasWithdrawal: 0,
                        stayHandle: 0
                    },
                    // 报告编制
                    reportCompile: {
                        hasHandle: 0,
                        hasWithdrawal: 0,
                        stayHandle: 0
                    },
                    // 数据审核
                    detectDataAudit: {
                        hasHandle: 0,
                        hasWithdrawal: 0,
                        stayHandle: 0
                    },
                    // 数据录入
                    detectDataInput: {
                        hasHandle: 10,
                        hasWithdrawal: 0,
                        stayHandle: 14
                    }
                }
            }
        },
        props: {
            allData: {
                type: Object,
                default: {}
            }
        },
        watch: {
            allData(val) {
                this.digitalData = val
            }
        },
        methods: {
            // 路由跳转
            routerJump(type, activeName, status) {
                 return
                // 结果录入
                if (type == 'resultEntry') {
                    this.$router.push({
                        path: '/DetectManagement/resultEntry',
                        query: {
                            activeName: activeName
                        }
                    })
                }
                // 结果审核
                if (type == 'resultReview') {
                    this.$router.push({
                        path: '/DetectManagement/resultAudit',
                        query: {
                            activeName: activeName,
                            status: status
                        }
                    })
                }
                // 报告编制
                if (type == 'reportCompile') {
                    this.$router.push({
                        path: '/report/compile',
                        query: {
                            activeName: activeName
                        }
                    })
                }
                // 报告审核
                if (type == 'reportAudit') {
                    this.$router.push({
                        path: '/report/audit',
                        query: {
                            activeName: activeName,
                            status: status
                        }
                    })
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .panel-group {
        margin-top: 8px;
        margin-bottom: 8px;

        .business-list {
            width: 100%;
            background: #fff;
            border-radius: 6px;
            box-shadow: 0 0 3px #D5D5D5;
            display: flex;
            flex-direction: column;
            align-items: center;

            .bl-top {
                width: 95%;
                height: 2.5rem;
                border-bottom: 1px solid rgba(102, 102, 102, 0.1020);
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;

                .blt-left {
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    .bltl-icon {
                        width: 1rem;
                        height: 1rem;
                        margin-right: 4px;
                        margin-top: 2px;
                    }

                    .bltl-title {
                        font-size: 0.9rem;
                        font-weight: 600;
                    }
                }

                .blt-desc {
                    font-size: 0.7rem;
                    color: #999999;
                }
            }

            .bl-bottom {
                width: 95%;
                height: 6.5rem;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-around;

                .blb-list {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;

                    .card-panel-num {
                        font-size: 1.5rem;
                        font-weight: 400;
                    }

                    .blbl-title {
                        font-size: 1rem;
                        color: #999;
                    }
                }
            }
        }
    }
</style>

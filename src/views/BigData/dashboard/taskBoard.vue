<template>
    <el-row :gutter="10" class="panel-group">
        <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
            <div class="taskboard-list">
                <div class="tl-top">
                    <span class="tlt-title">EC临时任务</span>
                    <span class="tlt-des">单位：件</span>
                </div>
                <div class="tl-content">
                    <div class="tlc-left">
                        <span>今日任务总数</span>
                        <count-to :start-val="0" :end-val="digitalData.taskSAP.todayTotal" :duration="2200"
                                  class="card-panel-num"/>
                    </div>
                    <div class="tlc-right">
                        <div class="tlcr-ul">
                            <a class="tkcru-li" @click="routerJump('SAPTask')">
                                <div class="waitIcon"></div>
                                <span class="tkcrul-title">待处理：</span>
                                <count-to :start-val="0" :end-val="digitalData.taskSAP.stayHandle" :duration="2200"
                                          class="card-panel-num-val"/>
                            </a>
                            <a class="tkcru-li" @click="routerJump('SAPTask')">
                                <div class="overIcon"></div>
                                <span class="tkcrul-title">已处理：</span>
                                <count-to :start-val="0" :end-val="digitalData.taskSAP.hasHandle" :duration="2200"
                                          class="card-panel-num-val"/>
                            </a>
                            <a class="tkcru-li" @click="routerJump('SAPTask')">
                                <div class="cancelIcon"></div>
                                <span class="tkcrul-title">已撤销：</span>
                                <count-to :start-val="0" :end-val="digitalData.taskSAP.hasWithdrawal" :duration="2200"
                                          class="card-panel-num-val"/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="10" class="card-panel-col">
            <div class="taskboard-list">
                <div class="tl-top">
                    <span class="tlt-title">EC定时任务</span>
                    <span class="tlt-des">单位：件</span>
                </div>
                <div class="tl-content">
                    <div class="tlc-left">
                        <span>今日计划任务</span>
                        <count-to :start-val="0" :end-val="digitalData.taskScheduled.todayTotal" :duration="2200"
                                  class="card-panel-num"/>
                    </div>
                    <div class="tlc-right">
                        <div class="tlcr-ul">
                            <a class="tkcru-li" @click="routerJump('timingTask',0)">
                                <div class="waitIcon"></div>
                                <span class="tkcrul-title">待处理：</span>
                                <count-to :start-val="0" :end-val="digitalData.taskScheduled.stayHandle"
                                          :duration="2200" class="card-panel-num-val"/>
                            </a>
                            <a class="tkcru-li" @click="routerJump('timingTask',4)">
                                <div class="cancelIcon"></div>
                                <span class="tkcrul-title">已处理：</span>
                                <count-to :start-val="0" :end-val="digitalData.taskSAP.hasHandle" :duration="2200"
                                          class="card-panel-num-val"/>
                            </a>
                            <a class="tkcru-li" @click="routerJump('SAPTask')">
                                <div class="cancelIcon"></div>
                                <span class="tkcrul-title">已撤销：</span>
                                <count-to :start-val="0" :end-val="digitalData.taskSAP.hasWithdrawal" :duration="2200"
                                          class="card-panel-num-val"/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
            <div class="taskboard-list">
                <div class="tl-top">
                    <span class="tlt-title">三方检测任务</span>
                    <span class="tlt-des">单位：件</span>
                </div>
                <div class="tl-content">
                    <div class="tlc-left">
                        <span>今日任务总数</span>
                        <count-to :start-val="0" :end-val="digitalData.taskManual.todayTotal" :duration="2200"
                                  class="card-panel-num"/>
                    </div>
                    <div class="tlc-right">
                        <div class="tlcr-ul">
                            <a class="tkcru-li" @click="routerJump('manualTask',0)">
                                <div class="waitIcon"></div>
                                <span class="tkcrul-title">待处理：</span>
                                <count-to :start-val="0" :end-val="digitalData.taskManual.stayHandle" :duration="2200"
                                          class="card-panel-num-val"/>
                            </a>
                            <a class="tkcru-li" @click="routerJump('manualTask',4)">
                                <div class="overIcon"></div>
                                <span class="tkcrul-title">已处理：</span>
                                <count-to :start-val="0" :end-val="digitalData.taskManual.hasHandle" :duration="2200"
                                          class="card-panel-num-val"/>
                            </a>
                            <a class="tkcru-li" @click="routerJump('manualTask',2)">
                                <div class="cancelIcon"></div>
                                <span class="tkcrul-title">已撤销：</span>
                                <count-to :start-val="0" :end-val="digitalData.taskManual.hasWithdrawal"
                                          :duration="2200" class="card-panel-num-val"/>
                            </a>

                        </div>
                    </div>
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
                    taskSAP: {
                        todayTotal: 0,
                        hasHandle: 0,
                        hasWithdrawal: 0,
                        stayHandle: 0
                    },
                    // 定时任务
                    taskScheduled: {
                        // 今日计划任务
                        todayTotal: 0,
                        // 已处理数
                        hasHandle: 0,
                        // 定时计划数
                        PlanCount: 0,
                        // 撤销计划数
                        planHasWithdrawal: 0,
                        // 已撤销数（被退回）
                        hasWithdrawal: 0,
                        // 待处理
                        stayHandle: 0
                    },
                    taskManual: {
                        todayTotal: 0,
                        hasHandle: 0,
                        hasWithdrawal: 0,
                        stayHandle: 0
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
            routerJump(type,status) {
                return
                // SAP任务
                if (type == 'SAPTask') {
                    return
                    this.$router.push({
                        path: '/EntrustInspection/entrustInspection',
                        query: {
                            activeName: 1,
                            status:status
                        }
                    })
                }
                // 定时任务
                if (type == 'timingTask') {
                    this.$router.push({
                        path: '/EntrustInspection/entrustInspection',
                        query: {
                            activeName: 2,
                            status:status
                        }
                    })
                }
                // 定时计划
                if (type == 'timingPlan') {
                    this.$router.push({
                        path: '/EntrustInspection/scheduledPlan',
                        query: {
                            status:status
                        }
                    })
                }

                // 手动任务
                if (type == 'manualTask') {
                    this.$router.push({
                        path: '/EntrustInspection/entrustInspection',
                        query: {
                            activeName: 3,
                            status:status
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
    }

    .taskboard-list {
        width: 100%;
        background-color: #fff;
        border-radius: 6px;
        box-shadow: 0 0 3px #D5D5D5;
        display: flex;
        flex-direction: column;
        align-items: center;

        .tl-top {
            width: 95%;
            height: 2.5rem;
            border-bottom: 1px solid rgba(102, 102, 102, 0.1020);
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            .tlt-title {
                font-size: 0.8rem;
                color: #666;
            }

            .tlt-des {
                font-size: 0.5rem;
                color: #999;
            }
        }

        .tl-content {
            width: 95%;
            height: 7.5rem;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            .tlc-left {
                width: 30%;
                display: flex;
                flex-direction: column;
                align-items: center;

                .card-panel-num {
                    font-size: 1.8rem;
                }
            }

            .tlc-right {
                flex: 1;
                margin-left: 1.5rem;
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                justify-content: flex-end;

                .tlcr-ul {
                    margin-right: 20px;

                    .tkcru-li {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        margin-bottom: 10px;

                        .waitIcon {
                            width: 0.7rem;
                            height: 0.7rem;
                            background-color: #1492FF;
                            border-radius: 50%;
                            margin-right: 8px;
                        }

                        .chexiaotaskicon {
                            width: 0.7rem;
                            height: 0.7rem;
                            background-color: #878787;
                            border-radius: 50%;
                            margin-right: 8px;
                        }

                        .chexiaoicon {
                            width: 0.7rem;
                            height: 0.7rem;
                            background-color: #B7696B;
                            border-radius: 50%;
                            margin-right: 8px;
                        }

                        .overIcon {
                            width: 0.7rem;
                            height: 0.7rem;
                            background-color: #54B76D;
                            border-radius: 50%;
                            margin-right: 8px;
                        }

                        .cancelIcon {
                            width: 0.7rem;
                            height: 0.7rem;
                            background-color: #D4AA4B;
                            border-radius: 50%;
                            margin-right: 8px;
                        }

                        .tkcrul-title {
                            font-size: 0.6rem;
                            color: #666;
                        }

                        .card-panel-num-val {
                            font-size: 0.8rem;
                            color: #666;
                            font-weight: 600;
                        }
                    }

                }
            }
        }
    }
</style>

<template>
    <div class="dashboard-editor-container">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="0">个人看板</el-menu-item>
            <el-menu-item index="1">全局看板</el-menu-item>
        </el-menu>
        <div class="noticebox">
            <div class="noticIcon">
                <img src="./bg_blue.png" alt="">
                <div class="notin-p">
                    <p>通知公告</p>
                    <p>NOTIFICATION NOTICE</p>
                </div>
            </div>
            <div class="notincscroll">
                <div class="noticCont" ref='contlist' @mouseover="stopScroll" @mouseout="startScroll">
                    <ul class="item">
<!--                        <li v-for="item in noticList" @click="noticeDetail(item.createTime,item.noticeId)">-->
<!--                            <span class="date" v-text="item.createTime"></span><span style="margin-left: 6px" class="date">{{item.noticeType}}</span>：<span class="date" v-html="item.noticeTitle"></span>-->
<!--                        </li>-->
                    </ul>
                </div>
            </div>
        </div>
        <!--      任务数据看板-->
        <TaskBoard ref="TaskBoard" :allData="allData"/>
        <BusinessBoard ref="BusinessBoard" :allData="allData"/>
        <div class="bottomContentHeight">
            <el-row :gutter="12">
                <el-col :xs="24" :sm="24" :lg="12">
                    <div class="chart-wrapper">
                        <BlockTitle title="检测任务数据统计" @updateCurrentTabId="updateCurrentTabId" :statIndex="0"/>
                        <WeiTOrderLine :detectData="detectData" :currentTabId="currentTabId[0]"
                                       :height="bottomContentHeight"/>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="12">
                    <div class="chart-wrapper">
                        <BlockTitle title="接样数据分析" @updateCurrentTabId="updateCurrentTabId" :statIndex="1"/>
                        <SendSampleData :sampleData="sampleData" :currentTabId="currentTabId[1]"
                                        :height="bottomContentHeight"/>
                    </div>
                </el-col>
            </el-row>
        </div>
        <notices
            v-if="shownotices"
            ref="noticesdetail"
            @close="shownotices = false"
        ></notices>
    </div>
</template>

<script>
    import PanelGroup from './dashboard/PanelGroup'
    import LineChart from './dashboard/LineChart'
    import RaddarChart from './dashboard/RaddarChart'
    import PieChart from './dashboard/PieChart'
    import BarChart from './dashboard/BarChart'
    import TaskBoard from './dashboard/taskBoard'
    import BusinessBoard from './dashboard/businessBoard'
    import BlockTitle from './dashboard/blockTitle'
    import WeiTOrderLine from './dashboard/ant/WeiTOrderLine'
    import SendSampleData from './dashboard/ant/sendSampleData'
    import notices from '@/components/index/notices.vue'

    const lineChartData = {
        newVisitis: {
            expectedData: [100, 120, 161, 134, 105, 160, 165],
            actualData: [120, 82, 91, 154, 162, 140, 145]
        },
        messages: {
            expectedData: [200, 192, 120, 144, 160, 130, 140],
            actualData: [180, 160, 151, 106, 145, 150, 130]
        },
        purchases: {
            expectedData: [80, 100, 121, 104, 105, 90, 100],
            actualData: [120, 90, 100, 138, 142, 130, 130]
        },
        shoppings: {
            expectedData: [130, 140, 141, 142, 145, 150, 160],
            actualData: [120, 82, 91, 154, 162, 140, 130]
        }

    }

    export default {
        name: 'Index',
        components: {
            PanelGroup,
            LineChart,
            RaddarChart,
            PieChart,
            BarChart,
            TaskBoard,
            BusinessBoard,
            BlockTitle,
            WeiTOrderLine,
            SendSampleData,
            notices
        },
        data() {
            return {
                lineChartData: lineChartData.newVisitis,
                bottomContentHeight: 0,
                currentTabList: ['week', 'month', 'year'],
                currentTabId: [0, 0],
                allData: {},
                detectData: [],
                noticList: [],
                sampleData: [],
                activeIndex: '0',
                scrollTime:null,
                shownotices: false,
            }
        },
        mounted() {
            this.getData()
            let TaskBoardHeight = this.$refs.TaskBoard.$el.clientHeight
            let dataBoardHeight = this.$refs.BusinessBoard.$el.clientHeight
            this.$nextTick(() => {
                this.bottomContentHeight = this.$store.state.boshland.boContainerHeight - TaskBoardHeight - dataBoardHeight - 130 - 43 - 60
            })
            this.activeIndex = '0'
        },
        methods: {
            // 获取看板数据
            async getData(type) {
                let params = {
                    isAll: this.activeIndex
                }
                let getData = await this.$net('/homePage/getHomePageData', 'get', params)
                if (getData.code == 200) {
                    this.allData = getData.data
                    this.noticList = getData.data.noticeList
                    if (type != 0) {
                        // 这是采样数据分析的数据
                        this.sampleData = this.allData.handoverSampleCount[this.currentTabList[this.currentTabId[1]]]
                    }
                    if (type != 1) {
                        // 这是检测任务数据统计的数据
                        this.detectData = this.allData.detectTaskCount[this.currentTabList[this.currentTabId[0]]]
                    }
                }
            },
            handleSelect(e) {
                this.activeIndex = e
                this.getData()
            },
            handleSetLineChartData(type) {
                this.lineChartData = lineChartData[type]
            },
            updateCurrentTabId(type, val) {
                this.$set(this.currentTabId, type, val)
                // type==> 0 || 1  0代表检测任务数据统计  1代表采样数据分析
                this.getData(type)
            },
            //鼠标悬停，停止滚动
            stopScroll() {
                var target = this.$refs.contlist;
                clearInterval(this.scrollTime)
            },
            //鼠标移开 ，接着滚动
            startScroll() {
                var target = this.$refs.contlist;
                this.scrollW = target.offsetLeft; // 移开时记录向左移动的距离
                this.scroll()
            },
            //循环滚动
            scroll() {
                var that = this; //因为定时器里要使用vue对象时不能用this, 在定时器中的 this 代表
                var target = this.$refs.contlist;
                var initLeft = 0;
                if (this.scrollW < 0) {
                    initLeft = this.scrollW * (-1)
                }
                //定时器
                this.scrollTime = setInterval(function () {
                    initLeft++;
                    if (initLeft >= target.offsetWidth / 1) {
                        initLeft = 0;
                    }
                    target.style.left = '-' + initLeft + 'px';//获取不到translateX的值改用 left

                    //target.style = 'transform: translateX(-'+ initLeft +'px)';
                }, 40)
            },
            // 查看公告详情
            noticeDetail(time, id) {
                this.shownotices = true
                this.$net(`/homePage/notice//${id}`,'get').then(res => {
                    if (res.code === 200) {
                        const objdata = {
                            noticeTitle: res.data.noticeTitle,
                            noticeContent: res.data.noticeContent,
                            time: time
                        }
                        this.$nextTick(() => {
                            this.$refs.noticesdetail.init(objdata, "show");
                        });
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .bottomContentHeight {
        width: 100%;
    }

    .dashboard-editor-container {
        padding: 12px;
        background-color: rgb(240, 242, 245);
        position: relative;

        .chart-wrapper {
            background: #fff;
            //padding: 16px 16px 0;
            padding: 0 16px;
            padding-top: 10px;
            //margin-bottom: 32px;
        }
    }

    @media (max-width: 1024px) {
        .chart-wrapper {
            padding: 8px;
        }
    }
    .noticebox {
        display: flex;
        width: 100%;
        background: #ffffff;
        height: 68px;
        overflow: hidden;
        margin-top: 8px;
        border: 1px solid #EEEEEE;

        .noticIcon {
            position: relative;

            .notin-p {
                color: #ffffff;
                position: absolute;
                top: 50%;
                left: 40px;
                transform: translateY(-50%);

                p:nth-child(1) {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 0;
                }

                p:nth-child(2) {
                    font-size: 12px;
                    margin-bottom: 16px;
                }
            }
        }
        .notincscroll {
            flex: 2;
            overflow: hidden;
            position: relative;
        }

        .noticCont {
            /*height: 68px;*/
            /*overflow: hidden;*/
            position: absolute;
            white-space: nowrap;
            display: flex;
            flex-direction: row;

            ul {
                /*overflow: hidden;*/
                padding-inline-start: 0;
                display: flex;
                flex-direction: row;

                li {
                    list-style: none;
                    font-size: 14px;
                    color: #365670;
                    line-height: 68px;
                    cursor: pointer;
                    margin-left: 30px;
                    /*float: left;*/
                    display: flex;
                    flex-direction: row;
                }

                /*li:last-child{
                  margin-bottom: -11px;
                }*/
            }
        }
    }
</style>

<template>
    <el-dialog
        title="打印标签"
        :visible.sync="printTagShow"
        append-to-body
        width="600px"
        center
        :show-close="true"
        @close="close"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
    >
        <el-form
            :model="addParam"
            ref="addForm"
            :label-position="labelPosition"
            label-width="90px"
        >
            <el-row>
                <el-form-item label="打印机">
                    <el-select v-model="printer">
                        <el-option
                            :label="printer"
                            v-for="(printer, index) in printerList"
                            :value="index"
                            :key="printer"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="close" center>返回</el-button>
<!--            <el-button @click="submitPrint" type="primary">打印</el-button>-->
        </div>

        <!--    标签样式-->
        <!--    style="display: none"-->
        <div v-show="showInfo">
            <div v-for="(task, index) in selectedTasks" :key="task.id" ref="unInspect" style="position: relative">
                <table style="border-collapse:separate; border-spacing:10px; width: 100mm; height: 40mm;font-size: 8px">
                    <tr>
                        <td rowspan="4" valign="center" width="30px">
                            <div class="qrcode-pic" ref="codeItem"></div>
                        </td>
                    </tr>
                    <tr style="line-height: 1mm;">
                        <td>
                            <span>样品编号：{{ task.sampleCode }}</span>
                        </td>
                    </tr>
                    <tr style="line-height: 1mm;">
                        <td>
                            <span>任务编号：{{ task.taskCode }}</span>
                        </td>
                    </tr>
                    <tr style="line-height: 2mm;">
                        <td>
                            <span>采样时间：{{ task.samplingTime }}</span>
                        </td>
                    </tr>
                    <tr style="line-height: 1mm;">
                        <td colspan="3">
                            <div>
                                <span>检测项目组：</span>
                                <span v-for="(item,index) in task.itemList" :key="index">
<!--                                    <span style="display:inline;vertical-align: middle; margin-top: 0; margin-right: 5px" v-if="item.status == true">√</span>-->
                                    <span
                                        style="display:inline;vertical-align: middle; margin-top: 0; margin-right: 5px"> {{item.itemName}}</span>
                                    <!--                                    <input type="checkbox" v-model="item.status" v-if="item.status == false"-->
                                    <!--                                           style="display:inline;vertical-align: middle; margin-top: 0; margin-right: 5px"/>-->
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr style="line-height: 1mm;">
                        <td style="font-size: 10px;" colspan="3">
                            <div>
                                <span>样品状态：</span>
                                <input type="checkbox" style="vertical-align: middle; margin-top: 0"/>待检
                                <input type="checkbox" style="vertical-align: middle; margin-top: 0; margin-left: 5px"/>在检
                                <input type="checkbox" style="vertical-align: middle; margin-top: 0; margin-left: 5px"/>留样
                            </div>
                        </td>
                    </tr>
                </table>
            </div>

        </div>
    </el-dialog>
</template>

<script>
    // import { getLodop } from '@/utils/lodop/LodopFuncs'
    import QRCode from 'qrcodejs2'

    export default {
        name: 'printTag',
        props: {},
        computed: {},
        data() {
            return {
                status: true,
                showInfo: true,
                printTagShow: false,
                height: '10mm',
                labelTypeList: [],
                printer: undefined,
                labelPosition: 'right',
                addParam: {},
                printerList: [],
                num: 1,
                selectedTasks: [],
                a: []
            }
        },
        mounted() {

        },
        methods: {
            // 关闭
            close() {
                this.printTagShow = false
                this.$emit('cancel', false)
            },
            // autoinitPrintPage(data) {
            //     this.showType = 'auto'
            //     this.printTagShow = true
            //     data.map((item) => {
            //         item.itemList = []
            //         let arr = item.detectItem.split(',')
            //         arr.map((item2) => {
            //             let obj = {
            //                 itemName: item2
            //             }
            //             item.itemList.push(obj)
            //         })
            //     })
            //     console.log(data)
            //     let selectedTasks = data
            //     this.selectedTasks = selectedTasks
            //     this.$nextTick(() => {
            //         this.selectedTasks.map((item, index) => {
            //             this.$refs.codeItem[index].innerHTML = ''
            //             new QRCode(this.$refs.codeItem[index], {
            //                 text: item.sampleCode, //二维码内容
            //                 width: 60,
            //                 height: 60
            //                 // colorDark: "#333333", //二维码颜色
            //                 // colorLight: "#ffffff", //二维码背景色
            //             })
            //         })
            //     })
            //     setTimeout(() => {
            //         this.submitPrint()
            //     }, 500)
            // },
            initPrintPage(data) {
                data.map((item) => {
                    item.itemList = []
                    let arr = item.detectItem.split(',')
                    arr.map((item2) => {
                        let obj = {
                            itemName: item2
                        }
                        item.itemList.push(obj)
                    })
                })
                console.log(data)
                let selectedTasks = data
                this.printTagShow = true
                this.selectedTasks = selectedTasks
                this.$nextTick(() => {
                    this.selectedTasks.map((item, index) => {
                        this.$refs.codeItem[index].innerHTML = ''
                        new QRCode(this.$refs.codeItem[index], {
                            text: item.sampleCode, //二维码内容
                            width: 60,
                            height: 60
                            // colorDark: "#333333", //二维码颜色
                            // colorLight: "#ffffff", //二维码背景色
                        })
                    })
                })
                this.initPrinterList()
            },

            //初始化打印机列表
            initPrinterList() {
                // this.printerList = []
                // //调用getLodop获取LODOP对象
                // let LODOP = getLodop()
                // let printerCount = LODOP.GET_PRINTER_COUNT()
                //
                // for (let i = 0; i < printerCount; i++) {
                //     let printer = LODOP.GET_PRINTER_NAME(i)
                //     this.printerList.push(printer)
                // }
                // console.log('this.printerList', this.printerList)
            },

            // 打印
        }
    }
</script>

<style scoped>
</style>

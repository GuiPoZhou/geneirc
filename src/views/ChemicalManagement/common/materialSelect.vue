<template>
    <BoDialog :diaLogShow="dialogShow" diaLogTitle="选择耗材"
              diaLogWidth="60%" @close="cancelbtn">
        <template slot="bologbody">
            <el-table
                ref="singleTable"
                :height="DialogHeight"
                highlight-current-row
                @current-change="handleCurrentChange"
                :data="dataList"
                stripe
                border>
                <el-table-column label="序号" align="center" type="index" width="50"/>
                <el-table-column prop="materialNumber" label="耗材编号" width="200"/>
                <el-table-column prop="materialName" label="耗材名称"/>
                <el-table-column prop="materialModel" label="规格型号"/>
                <el-table-column prop="unit" label="计量单位"/>
                <el-table-column prop="brand" label="品牌"/>
                <el-table-column prop="manufacturer" label="生产厂商"/>
                <el-table-column prop="grade" label="试剂级别"/>
                <el-table-column prop="currentStoreCount" label="库存数量"/>
            </el-table>
        </template>
        <template slot="bologfooter">
            <el-button type="primary" @click="handleOk()">确定</el-button>
            <el-button @click="cancelbtn">取消</el-button>
        </template>
    </BoDialog>
</template>

<script>
    import { getMaterialStoreCount } from '@/api/chemical/essentialInformation'
    import boContainerMixin from '@/mixins/boContainer'

    export default {
        name: 'materialSelect',
        mixins: [boContainerMixin],
        data() {
            return {
                dialogShow: false,
                dataList: [],
                currentRow: ''
            }
        },
        props: {
            id: 0,
            isEditDetail: 0,
            isOrder: false
        },
        created() {
            getMaterialStoreCount().then(res2 => {
                this.dataList = res2.data
            })
        },
        methods: {
            init() {
                this.dialogShow = true
            },
            handleCurrentChange(val) {
                this.currentRow = val
            },
            handleOk() {
                if (this.currentRow) {
                    this.$emit('confims', this.currentRow)
                }
            },
            cancelbtn() {
                this.$emit('close')
            }
        }
    }
</script>

<style scoped lang="less">
    /*.treeDiv {*/
    /*	position: absolute;*/
    /*	top: 40px;*/
    /*	left: -1px;*/
    /*	z-index: 1000;*/
    /*	width: 100%;*/
    /*	overflow: auto;*/
    /*	//height: 100px;*/
    /*}*/
</style>

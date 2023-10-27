<template>
    <ml-dialog ref="mlDialog" :dia-log-show="showlog" :dia-log-title="'查看项目详情（共' + nums + '个）'" :showEditDrag="true" @close="e_close">
        <template slot="bologbody">
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%;margin-top: 20px">
                <el-table-column prop="id" type="index" label="序号" width="55px"/>
                <el-table-column prop="itemName" label="项目名称" align="center"></el-table-column>
                <el-table-column prop="itemCode" label="方法编码" align="center"></el-table-column>
                <el-table-column prop="subname" label="子法名称" align="center"></el-table-column>
                <el-table-column prop="stroma" label="基质" align="center"></el-table-column>
                <el-table-column prop="" label="是否分包" align="center"></el-table-column>
                <el-table-column prop="" label="指定方法" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.customerAppoint == 0 ? '否' : scope.row.customerAppoint == 1 ? '是' : ''}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <template slot="bologfooter">
            <el-button size="small" @click="e_close">返回</el-button>
        </template>
    </ml-dialog>
</template>

<script>
    export default {
        name: "projectDetails",
        data () {
            return {
                showlog: false,
                nums: 23,
                tableData: [],
            }
        },
        methods: {
            init (type, list) {
                this.showlog = true
                this.tableData = list
                this.nums = list.length
            },
            e_close () {
                this.showlog = false
            }
        }
    }
</script>

<style scoped>

</style>

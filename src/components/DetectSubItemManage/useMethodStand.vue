<template>
    <div class="useDetect">
        <el-row>
            <el-col :span="8">
                <el-form ref="form" :model="form" label-width="80px" @submit.native.prevent>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="方法名称" prop="methodName">
                                <el-input style="width: 150px" v-model="form.methodName" clearable
                                          @clear="e_getMehodsStand" @keyup.enter.native="e_getMehodsStand"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="方法编号" prop="methodCode">
                                <el-input style="width: 150px" v-model="form.methodCode" clearable
                                          @clear="e_getMehodsStand" @keyup.enter.native="e_getMehodsStand"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-table
                    :data="detectList"
                    height="360"
                    :row-class-name="tableRowClassName"
                    style="width: 100%">
                    <el-table-column
                        type="index"
                        label="序号">
                    </el-table-column>
                    <el-table-column
                        prop="methodNameCn"
                        align="center"
                        label="方法名称">
                    </el-table-column>
                    <el-table-column
                        prop="methodCode"
                        align="center"
                        label="方法编号">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="e_useType(scope.row,scope.$index)">选择</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="16" style="padding: 10px">
                <methodStandItem ref="methodStandItem" @parseSelectedItems="parseSelectedItems"
                                 :selectedItems="selectedItems"/>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import methodStandItem from "./methodStandItem.vue";

export default {
    components: {
        methodStandItem
    },
    props: {
        selectedItems: Array
    },
    data() {
        return {
            form: {
                detectName: undefined,
                pageNum: 1,
                pageSize: 10,
            },
            detectList: [],
            total: 0,
            currentRowIndex: -1
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            if (rowIndex === this.currentRowIndex) {
                return 'warning-row';
            }
            return '';
        },
        /**
         * @author Coder
         * @date 2023/3/30
         * @des 选择检测项目
         */
        parseSelectedItems(params) {
            this.$emit("parseSelectedItems", params)
        },
        /**
         * @author Coder
         * @date 2023/3/30
         * @des 选择type
         */
        e_useType(row, index) {
            this.currentRowIndex = index
            this.$refs.methodStandItem.initItemList(row.id)
        },
        /**
         * @author Coder
         * @date 2023/3/30
         * @des 获取检测类别
         */
        e_getMehodsStand() {
            this.$net("/standard/v1/itemMethods/getMethodList", 'get', this.form).then(re => {
                this.detectList = re.data
            })
        },
        /**
         * @author Coder
         * @date 2023/3/30
         * @des 重置
         */
        e_repeat() {
            this.form.detectName = undefined
            this.form.pageNum = 1
            this.form.pageSize = 10
            this.e_getMehodsStand()
        },
    },
    mounted() {
        this.e_getMehodsStand()
    }
}
</script>
<style lang="scss">
.useDetect {
    .el-table .warning-row {
        background: #66b1ff;

        .el-button--text {
            color: #fff;
        }
    }

}
</style>

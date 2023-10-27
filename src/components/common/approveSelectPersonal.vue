<template>
    <div>
        <BoDialog :dia-log-show="showlog" dia-log-title="选择责任人" dia-log-width="50%" @close="cancel">
            <template slot="bologbody">
                <el-form
                        :model="queryParams"
                        ref="queryForm"
                        :inline="true"
                        label-width="100px"
                        :prop="queryParams"
                >
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="人员姓名">
                                <el-input
                                        v-model="queryParams.nickName"
                                        placeholder="人员姓名"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item class="buttons">
                                <el-button
                                        type="primary"
                                        icon="el-icon-search"
                                        size="mini"
                                        @click="e_getList">搜索
                                </el-button>
                                <el-button
                                        icon="el-icon-refresh"
                                        size="mini"
                                        @click="reset">重置
                                </el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-table :data="list" border>
                    <el-table-column label="" width="55">
                        <template slot-scope="scope">
                            <el-radio
                                    v-model="currentRow"
                                    @change="e_seleRow(scope.row)"
                                    :label="scope.row"
                            ><i></i
                            ></el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column label="序号" align="center" type="index" width="50"/>
                    <el-table-column prop="nickName" align="center" label="人员姓名"></el-table-column>
                    <el-table-column prop="deptName" align="center" label="所属部门"></el-table-column>
                </el-table>
            </template>
            <template slot="bologfooter">
                <el-button type="primary" @click="submit" size="small">确定</el-button>
                <el-button @click="cancel" size="small">取 消</el-button>
            </template>
        </BoDialog>
        <selectDept v-if="deptShow" :visible.sync="deptShow" @backfill="backfillDept"/>
    </div>

</template>

<script>
    import selectDept from '@/components/common/selectDepts'

    export default {
        components: {selectDept},
        data() {
            return {
                showlog:false,
                deptShow: false,
                list: [],
                userInfo: {},
                queryParams: {
                    nickName: '',
                    roleCode: 'SimulationEngineer'
                },
                currentRow: {},
            };
        },
        props: {
        },
        mounted() {
        },
        methods: {
            init(){
                this.showlog = true
                this.e_getList();
                // this.$net("/system/user/profile", "get").then(res => {
                //     this.userInfo = {
                //         deptName: res.data.dept.deptName,
                //         deptId: res.data.deptId
                //     }
                //     this.reset();
                // })
            },
            reset() {
                this.queryParams = {
                    nickName: '',
                        roleCode: 'SimulationEngineer'
                },
                this.e_getList();
            },
            backfillDept(dept) {
                this.queryParams.deptId = dept.id
                this.queryParams.deptName = dept.label
                this.e_getList();
            },
            e_seleRow(row) {
                this.currentRow = row;
            },
            e_getList() {
                this.$net('/v1/phinxSysUser/listWithRole', 'get',this.queryParams).then((re) => {
                    console.log("责任人", re);
                    this.list = re.data;
                });
            },
            submit() {
                if (typeof this.currentRow.userId == "undefined") {
                    this.$message.info("请选择一名责任人");
                    return;
                }
                console.log('this.currentRow', this.currentRow)
                this.$emit('confirm', this.currentRow)
                this.cancel()
            },
            cancel() {
                this.$emit("cancel");
            },
        },
    };
</script>

<style scoped lang="less">
    .buttons /deep/ .el-form-item__content {
        width: 100% !important;
    }
</style>

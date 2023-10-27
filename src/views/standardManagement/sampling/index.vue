<template>
    <div class="app-container">
        <!-- 统一样式 - 查询区域 -->
        <div class="a-c-top" v-show="showSearch">
            <!-- 表单 -->
            <el-form
                :inline="true"
                :model="samplingParams"
                ref="samplingParams"
                class="demo-form-inline"
                v-show="showSearch"
                label-width="100px"
            >
                <el-form-item label="检测类别">
                    <el-input v-model="samplingParams.testCategory" clearable @focus="cateShow = true"
                              @clear="resetTestCategory" size="small" style="width: 240px;">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="cateShow = true"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="分组名称">
                    <el-input v-model="samplingParams.groupName" size="small" style="width: 240px;"
                              @keyup.enter.native="onSubmit" @clear="onSubmit" clearable/>
                </el-form-item>
                <el-form-item label="分组状态">
                    <el-select v-model="samplingParams.status" @change="onSubmit" clearable size="small"
                               style="width: 240px;">
                        <el-option label="启用" :value="1"></el-option>
                        <el-option label="停用" :value="2"></el-option>
                    </el-select>
                </el-form-item>

                <!-- 统一样式 - 查询区域 按钮 -->
                <div class="a-c-t-btnarea">
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="onSubmit">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>

        <!-- 统一样式 - 主列表区域 -->
        <div class="a-c-bottom">
            <!-- 按钮 -->
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button
                        type="primary"
                        size="mini"
                        @click="e_addShow"
                        icon="el-icon-plus"
                    >新增
                    </el-button
                    >
                </el-col>
                <right-toolbar
                    :showSearch.sync="showSearch"
                    @queryTable="onSubmit"
                ></right-toolbar>
            </el-row>
            <!-- 表格 -->
            <el-table v-loading="loading" :data="tableData" align="center">
                <el-table-column prop="id" type="index" label="序号" width="55px"/>
                <el-table-column prop="groupName" label="分组名称"/>
                <el-table-column prop="detectCategoryName" label="检测类别"/>
                <el-table-column prop="itemCount" label="分组项目数量"/>
                <el-table-column prop="status" label="分组状态" width="100px">
                    <template slot-scope="scope">
                        <el-switch
                            active-color="#5B7BFA"
                            inactive-color="#dadde5"
                            v-model="scope.row.status"
                            :active-value="0"
                            :inactive-value="1"
                            @change="changeStatus($event, scope.row.id, scope.row)"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="createBy" label="编制人员" width="100px"/>
                <el-table-column
                    prop="createTime"
                    label="编制时间"
                    :show-overflow-tooltip="true"
                />
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            slot="reference"
                            size="mini"
                            type="text"
                            icon="el-icon-info"
                            @click="handleDetails(scope.row)"
                        >详情
                        </el-button>
                        <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.row)"
                            v-if="scope.row.status == false"
                        >编辑
                        </el-button>
                        <el-button
                            slot="reference"
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.row)"
                            v-if="scope.row.status == true"
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <pagination
                v-show="total > 0"
                :total="total"
                :page.sync="projectParams.pageNum"
                :limit.sync="projectParams.pageSize"
                @pagination="getTablelist"
            />
        </div>

        <samplingAdd
            v-if="addShow"
            :addShow.sync="addShow"
            v-on:func="getTablelist"
            ref="samplingAdd"
            @close="addShow = false"
        />
        <samplingDetails
            :detailsShow.sync="detailsShow"
            :editParams="detailsParams"
        />
        <samplingEdit
            :editShow.sync="editShow"
            :editParams="editParams"
            :editIds="edit_id"
            v-on:func="getTablelist"
        />
        <selectDetectName
            :visible.sync="cateShow"
            @handleParentName="changeDetectName"
            :onlyShowLeaf="true"
        />
    </div>
</template>
<script>
// import "../../core/components_use";
// import 'ant-design-vue/dist/antd.css';
import samplingAdd from "@/components/project/samplingAdd";
import samplingDetails from "@/components/project/samplingDetails";
import samplingEdit from "@/components/project/samplingEdit";
import selectDetectName from "@/components/project/selectDetectName";
import {
    getSamplingList,
    getSamplingListStatus,
    datailsSamplingProjectGroupList,
    deleteSamplingProjectGroupList,
} from "@/api/standardManagement/config";

export default {
    name: "samplingItemGrouping",
    components: {
        samplingAdd,
        samplingDetails,
        samplingEdit,
        selectDetectName,
    },
    data() {
        return {
            addShow: false,
            editShow: false,
            detailsShow: false,
            cateShow: false,
            centerDialogVisible: false,
            loading: true,
            //是否显示搜索
            showSearch: true,
            //表单参数
            samplingParams: {
                testCategory: "",
                groupName: "",
                status: null,
            },
            //查询参数
            projectParams: {
                detectCategory: null, //这是一个id
                groupName: null,
                status: null,
                pageSize: 10,
                pageNum: 1,
            },
            total: 0,
            // 参数表格数据
            tableData: [],
            //分页查询参数
            queryParams: {
                startPage: 1,
                pageSize: 100,
            },
            //详情数据
            detailsParams: {},
            //编辑数据
            editParams: {},
            //编辑的id
            edit_id: null,
        };
    },
    watch: {
        samplingParams: {
            handler(val) {
                if (!val.testCategory) {
                    this.projectParams.detectCategory = "";
                }
            },
            deep: true,
        },
    },
    methods: {
        temp() {
            this.show = true;
        },
        //表格中的状态1
        changeStatus($event, id, row) {
            console.log("row", row);
            const status = {status: $event};
            console.log("status", status);
            getSamplingListStatus(id, status).then((response) => {
            });
        },
        //查询按钮操作1
        onSubmit() {
            //将表单参数中的分组名称赋值给查询参数
            this.projectParams.groupName = this.samplingParams.groupName;
            this.projectParams.status = this.samplingParams.status;
            console.log(this.projectParams);
            // getSamplingList(this.projectParams).then(response => {
            //     this.tableData = response.data.list;
            //     this.total = response.data.total;
            //     this.loading = false;
            //   }
            // );
            this.projectParams.pageNum = 1;
            this.getTablelist();
        },
        resetTestCategory() {
            this.samplingParams.testCategory = "";
            this.projectParams.detectCategory = "";
            this.onSubmit();
        },
        //重置按钮操作1
        resetQuery() {
            this.samplingParams.testCategory = "";
            this.samplingParams.groupName = "";
            this.projectParams.detectCategory = "";
            this.samplingParams.status = "";
            this.resetForm("samplingParams");
            this.onSubmit();
        },
        //详情按钮操作1
        handleDetails(row) {
            console.log("详情按钮行数据的id==>", row.id);
            const DetailsId = row.id;
            datailsSamplingProjectGroupList(DetailsId).then((response) => {
                console.log("详情数据===>", response.data);
                this.editParams = response.data;
                this.$store.commit(
                    "set_detectCategory",
                    this.editParams.detectCategory
                );
                this.addShow = true;
                this.$nextTick(() => {
                    this.$refs.samplingAdd.infoShow(this.editParams);
                });
            });
        },
        /*
         *@author: 焦政
         *@date: 2021-08-31 13:22:54
         *@description:新增
         */
        e_addShow() {
            this.addShow = true;
            this.$nextTick(() => {
                this.$refs.samplingAdd.e_addShow();
            });
        },
        //编辑按钮操作
        handleEdit(row) {
            console.log("编辑按钮行数据的id==>", row.id);
            this.edit_id = row.id;
            console.log("编辑的id", this.edit_id);
            const EditId = row.id;
            datailsSamplingProjectGroupList(EditId).then((response) => {
                console.log("编辑数据111===>", response.data);
                this.editParams = response.data;
                this.$store.commit(
                    "set_detectCategory",
                    this.editParams.detectCategory
                );
                this.addShow = true;
                this.$nextTick(() => {
                    this.$refs.samplingAdd.editShow(this.editParams);
                });
            });
        },

        //删除按钮操作
        handleDelete(row) {
            console.log("采样项目分组删除按钮行数据==>", row);
            const groupName = row.groupName;
            const id = row.id;
            this.$confirm('确定要删除"' + groupName + '"分组？', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return deleteSamplingProjectGroupList(id);
                })
                .then(() => {
                    this.getTablelist();
                    this.$message.success("删除成功");
                })
                .catch(function () {
                });
        },
        //新增
        handleAdd() {
            this.visible = true;
        },
        //val是子组件传递过来的数据1
        changeDetectName(val) {
            console.log("子组件传递过来的数据==>", val);
            this.samplingParams.testCategory = val.selectDetectName;
            this.projectParams.detectCategory = val.id;
            this.onSubmit()
        },
        //获取采样项目分组列表1
        getTablelist() {
            getSamplingList(this.projectParams).then((response) => {
                console.log("采样项目分组列表的数据", response.data);
                this.tableData = response.data.list;
                this.total = response.data.total;
                this.loading = false;
            });
        },
    },
    created() {
        this.$store.commit("set_projecttype", "take");
        this.getTablelist();
    },
};
</script>
<style lang="less">
.samplingItemGrouping {
    margin-top: 20px;
    margin-left: 30px;
}

.searchDetectName {
    display: flex;
}
</style>

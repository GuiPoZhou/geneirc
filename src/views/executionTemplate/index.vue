<template>
    <div class="app-container">
        <div class="a-c-top" v-show="showSearch">
            <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
                <el-form-item label="业务编码" prop="businessCode">
                    <el-input
                        v-model="queryParams.businessCode"
                        placeholder="请输入业务编码"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                        @change="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="业务名称" prop="businessName">
                    <el-input
                        v-model="queryParams.businessName"
                        placeholder="请输入业务名称"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                        @change="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="子业务编码" prop="subBusinessCode">
                    <el-input
                        v-model="queryParams.subBusinessCode"
                        placeholder="请输入子业务编码"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                        @change="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="子业务名称" prop="subBusinessName">
                    <el-input
                        v-model="queryParams.subBusinessName"
                        placeholder="请输入子业务名称"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                        @change="handleQuery"
                    />
                </el-form-item>
                <div class="a-c-t-btnarea">
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索
                        </el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="a-c-bottom">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button
                        type="primary"
                        icon="el-icon-plus"
                        size="mini"
                        @click="handleAdd"
                    >新增
                    </el-button>
                </el-col>
            </el-row>

            <el-table v-loading="loading" :data="executionTemplateList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"/>
                <el-table-column label="业务编码" align="center" prop="businessCode"/>
                <el-table-column label="业务名称" align="center" prop="businessName"/>
                <el-table-column label="子业务编码" align="center" prop="subBusinessCode"/>
                <el-table-column label="子业务名称" align="center" prop="subBusinessName"/>
                <el-table-column label="子业务落库表名" align="center" prop="tableName"/>
                <el-table-column label="运行状态" align="center" prop="status" width="80px">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2"
                                   @change="handleStatusChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="创建人" align="center" prop="createUser" width="80px"/>
                <el-table-column label="修改人" align="center" prop="updateUser" width="80px"/>
                <el-table-column label="修改时间" align="center" prop="updateTime"/>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            @click="handleUpdate(scope.row)"
                        >修改
                        </el-button>
                        <!--            <el-button-->
                        <!--              size="mini"-->
                        <!--              type="text"-->
                        <!--              icon="el-icon-edit"-->
                        <!--              @click="loadPage(scope.row)"-->
                        <!--            >加载页面</el-button>-->
                        <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.row)"
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination
                v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList"
            />
        </div>


        <!-- 添加或修改业务单运行实例对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="业务编码" prop="businessCode" v-show="!isEdit">
                    <el-select v-model="form.defaultTemplateId" placeholder="请选择" style="width:100%">
                        <el-option
                            v-for="item in businessCodeList"
                            :key="item.id"
                            :label="item.businessName"
                            :value="item.id">
                            <span style="float: left">{{ item.businessName }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.businessCode }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="子业务编码" prop="subBusinessCode">
                    <el-input v-model="form.subBusinessCode" placeholder="请输入子业务编码"/>
                </el-form-item>
                <el-form-item label="子业务名称" prop="subBusinessName">
                    <el-input v-model="form.subBusinessName"
                              :disabled="form.id && form.subBusinessName.indexOf('EXT') !=-1"
                              placeholder="请输入子业务名称"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确定</el-button>
                <el-button @click="cancel">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listExecutionTemplate,
    delExecutionTemplate,
    addExecutionTemplate,
    editExecutionTemplate,
    updateExecutionTemplate,
    getBusinessCodeList,
    updateStatus,
} from "@/api/system/executionTemplate";

export default {
    name: "ExecutionTemplate",
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 业务单运行实例表格数据
            executionTemplateList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                defaultTemplateId: null,
                businessCode: null,
                businessName: null,
                subBusinessCode: null,
                subBusinessName: null,
                tableName: null,
                status: null,
                createUser: null,
                updateUser: null,
                businessCodes: 'DETECT_SCHEME,ENTRUSTMENT_AGREEMENT,SUBCONTRACT_AGREEMENT,envEquipmentInstrument,envCustomer,QUOTATION,CONTRACT,ENTRUST_TASK,ENTRUST_INFO_GIVE,SAMPLE_CODING_DETAIL_GIVE,ENTRUSTMENT_AGREEMENT_PRE,SAMPLE_DYNAMIC_COL,DETECT_DYNAMIC_COL,REPORT_DYNAMIC_COL,CUSTOMER_INFO,PENDING_AGREEMENT',
            },
            // 表单参数
            form: {},
            isEdit: false,
            // 表单校验
            rules: {},
            businessCodeList: []
        };
    },
    created() {
        this.getList();
        getBusinessCodeList().then(response => {
            this.businessCodeList = response.data;
        })
    },
    methods: {
        /** 查询业务单运行实例列表 */
        getList() {
            this.loading = true;
            listExecutionTemplate(this.queryParams).then(response => {
                this.executionTemplateList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                defaultTemplateId: null,
                businessCode: null,
                businessName: null,
                subBusinessCode: null,
                subBusinessName: null,
                tableName: null,
                status: 0,
                metaJson: null,
                fieldJson: null,
                configJson: null,
                listPageJson: null,
                tableColumnsJson: null,
                createTime: null,
                createUser: null,
                updateTime: null,
                updateUser: null
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.isEdit = false;
            this.title = "添加业务单运行实例";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            // console.log('handleUpdate');
            // this.$router.push({
            //   path: '/design/formDesign/' + row.id
            // });

            this.open = true
            this.title = '修改记录单'
            this.isEdit = true;
            editExecutionTemplate(row.id).then(response => {
                this.$set(this.form, 'subBusinessCode', response.data.subBusinessCode)
                this.$set(this.form, 'subBusinessName', response.data.subBusinessName)
                this.$set(this.form, 'id', response.data.id)
                this.$set(this.form, 'defaultTemplateId', response.data.defaultTemplateId)
                this.$set(this.form, 'businessCode', response.data.businessCode)
            })
        },
        /** 加载页面 */
        loadPage(row) {
            console.log('loadPage');
            this.$router.push({
                path: '/template/dynamic/list/' + row.id
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateExecutionTemplate(this.form).then(response => {
                            if (response.code === 200) {
                                this.$message.success("修改成功");
                                this.open = false;
                                this.getList();
                                this.parentRouter.push({
                                    path: '/micFoundation/formDesign?executionTemplateId=' + this.form.id + '&businessCode=SHARED_FORM'
                                });
                            }
                        });
                    } else {
                        addExecutionTemplate(this.form).then(response => {
                            if (response.code === 200) {
                                this.$message.success("新增成功");
                                this.open = false;
                                this.getList();
                            }
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            // if (row.subBusinessName.indexOf('EXT') != -1) {
            //     this.$message.error('请联系开发人员进行删除')
            //     return
            // }
            const ids = row.id || this.ids;
            this.$confirm('是否确认删除业务单运行实例编号为"' + ids + '"的数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return delExecutionTemplate(ids);
            }).then(() => {
                this.getList();
                this.$message.success("删除成功");
            }).catch(function () {
            });
        },
        handleStatusChange(row) {
            updateStatus(row.id, row.status).then(response => {
                this.$message.success(response.msg);
            })
        }
    }
};
</script>

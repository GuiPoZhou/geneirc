<template>
    <div class="app-container">
        <div class="a-c-top" v-show="showSearch">
            <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
                <el-form-item label="KEY" prop="key">
                    <el-input
                        v-model="queryParams.key"
                        placeholder="请输入KEY"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input
                        v-model="queryParams.name"
                        placeholder="请输入名称"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <div class="a-c-t-btnarea">
                    <el-form-item>
                        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
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

            <el-table v-loading="loading" :data="Modeler" border
                      stripe>
                <el-table-column label="ID" align="center" prop="id"/>
                <el-table-column label="KEY" align="center" prop="key"/>
                <el-table-column label="名称" align="center" prop="name"/>
                <el-table-column label="版本" align="center" prop="version"/>
                <el-table-column label="创建时间" align="center" prop="createTime" :show-overflow-tooltip="true"/>
                <el-table-column label="最后更新时间" align="center" prop="lastUpdateTime"
                                 :show-overflow-tooltip="true"/>
                <el-table-column label="元数据" align="center" prop="metaInfo" :show-overflow-tooltip="true"/>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            @click="handleUpdate(scope.row)"
                        >编辑
                        </el-button>
                        <el-button
                            size="mini"
                            type="text"
                            icon="icon iconfont iconbsl-icon-bushu"
                            @click="deployModel(scope.row)"
                        >部署
                        </el-button>
                        <el-button
                            size="mini"
                            type="text"
                            icon="icon iconfont iconbsl-icon-daochu"
                            @click="export2Bpmn(scope.row)"
                        >导出
                        </el-button>
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

        <!-- 添加modeler对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入名称"/>
                </el-form-item>
                <el-form-item label="KEY" prop="key">
                    <el-input v-model="form.key" placeholder="请输入KEY"/>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="form.description" placeholder="请输入描述"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确定</el-button>
                <el-button @click="cancel">取消</el-button>
            </div>
        </el-dialog>
        <!-- 添加modeler对话框 -->
        <el-dialog :title="title" :visible.sync="open2" width="1680px" append-to-body>
            <iframe :src="src" frameborder="no" style="width: 100%;height:700px"/>
            <!--      <iframe class="RuoYi_iframe" name="iframe' + '44' + '" width="100%" height="700px" src="/modeler/modeler.html?modelId=5001" frameborder="0" data-id="' + dataUrl + '"  seamless></iframe>-->
        </el-dialog>
    </div>
</template>

<script>
import {addModeler, delModeler, deployModeler, exportModeler, listModeler} from '@/api/activiti/modeler'

export default {
    name: "ActIdGroup",
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
            // VIEW表格数据
            Modeler: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 是否显示弹出层
            open2: false,
            src: "",
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                id: null,
                rev: null,
                name: null,
                type: null,
                authCode: this.$store.state.user.authCode ? this.$store.state.user.authCode : "MASTER",
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {

                name: [
                    {required: true, message: "名称不能为空", trigger: "blur"}
                ],
                key: [
                    {required: true, message: "Key不能为空", trigger: "blur"}
                ]
            }
        };
    },
    created() {
        console.log('一进入')
        this.getList();
    },
    methods: {
        /** 查询VIEW列表 */
        getList() {
            this.loading = true;
            listModeler(this.queryParams).then(response => {
                this.Modeler = response.rows;
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
                key: null,
                name: null,
                description: null,
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
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加modeler";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            const id = row.id
            this.open2 = true;
            this.title = "流程设计模型";
            localStorage.setItem("VUE_APP_BASE_API", window.globalEnv.VUE_APP_BASE_API)
            // let host = process.env.NODE_ENV === "production"?'/micGenric/':`//localhost:${process.env.VUE_APP_MicroPort}/`
            // this.src = `${host}modeler/modeler.html?modelId=${id}`;
            let authCode = this.$mainStore.state.user.authCode ? this.$mainStore.state.user.authCode : "MASTER";
            this.src=`${window.location.protocol}//${window.location.host}/modeler/modeler.html?modelId=${id}&authCode=${authCode}`
        },
        deployModel(row) {
            deployModeler(row.id).then(response => {
                if (response.code === 200) {
                    this.$message.success(response.msg);
                } else {
                    this.$message.info(response.msg);
                }
            });
        },

        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    addModeler(this.form).then(response => {
                        if (response.code === 200) {
                            this.$message.success("新增成功");
                            this.open = false;
                            this.getList();
                        }
                    });
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
            this.$confirm('是否确认删除编号为"' + ids + '"的数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return delModeler(ids);
            }).then(() => {
                this.getList();
                this.$message.success("删除成功");
            }).catch(function () {
            });
        },

        /** 导出按钮操作 */
        export2Bpmn(row) {
            exportModeler(row.id).then(response => {
                this.download(response.msg);
            }).catch(function () {
            });
        }
    }
};
</script>

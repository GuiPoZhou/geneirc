<!-- 业务类型管理 -->
<template>
    <div class="businessConfig app-mall-container">
        <!-- 左侧模板分类 -->
        <el-menu :default-active="category[0] ? String(category[0].dictCode) : ''"
            style="width: 256px;max-height:800px;overflow:scroll" @select="selectMenu">
            <el-input v-model="filterCode" size="small" clearable @clear="clearfilterCode"
                @keyup.enter.native="filterCodeList" placeholder="回车查询"></el-input>
            <el-menu-item v-for="item in category" :key="item.dictCode" :index="String(item.dictCode)"
                style="text-align:center">
                {{ item.dictLabel }}
            </el-menu-item>
        </el-menu>

        <!-- 查询 -->
        <section class="container a-m-c-right">
            <div class="a-m-c-l-top" v-show="showSearch">
                <el-form :model="queryParams" ref="queryForm" :inline="true" class="formInline" v-show="showSearch">
                    <div>
                        <el-form-item label="类型名称" prop="configName">
                            <el-input v-model="queryParams.configName" placeholder="请输入类型名称" size="small"
                                style="width: 240px;" @keyup.enter.native="handleQuery" @clear="handleQuery" clearable />
                        </el-form-item>
                        <el-form-item label="类型状态" prop="status">
                            <el-select v-model="queryParams.status" placeholder="类型状态" size="small" style="width: 240px;"
                                @change="handleQuery" clearable>
                                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <div class="a-c-t-btnarea">
                            <el-form-item>
                                <el-button @click="handleQuery" type="primary" icon="el-icon-search"
                                    size="mini">搜索</el-button>
                                <el-button @click="resetQuery" icon="el-icon-refresh" size="mini">重置</el-button>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>
            </div>
            <div class="a-m-c-l-bottom">
                <el-row :gutter="10" class="el-row-toolbar">
                    <el-col :span="1.5">
                        <el-button class="addRule" type="primary" icon="el-icon-plus" size="mini"
                            @click="handleAdd">新增</el-button>
                    </el-col>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="handleQuery"
                        style="margin-right: 10px;"></right-toolbar>
                </el-row>

                <!-- 列表数据 -->
                <el-table v-loading="loading" :data="dataList" row-key="id" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="" label="序号" :show-overflow-tooltip="true" width="60">
                        <template slot-scope="scope">
                            <span v-text="scope.$index + 1"> </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="id" label="业务类型ID" :show-overflow-tooltip="true"
                        align="center"></el-table-column>
                    <el-table-column prop="configName" label="类型名称" align="center"
                        :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="status" label="类型状态" align="center">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.status" :active-value="false" :inactive-value="true"
                                @change="handleStatusChange(scope.row)"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column prop="updateBy" label="编制人员" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="updateTime" label="编制时间" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改
                            </el-button>
                            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除
                            </el-button>
                            <!-- <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                v-hasPermi="['micGenric:businessConfig:copyFormJson']"
                                @click="e_copy(scope.row)"
                            >表单布局数据复制
                            </el-button> -->
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页 -->
                <div class="block">
                    <pagination v-show="dataTotal > 0" :total="dataTotal" :page.sync="queryParams.pageNum"
                        :limit.sync="queryParams.pageSize" @pagination="getDataList" />
                </div>
            </div>
        </section>

        <el-dialog title="业务类型" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false"
            width="70%" append-to-body center>
            <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="120px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="类型名称" prop="configName">
                            <el-input v-model="dataForm.configName" :disabled="isUpdate" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="showVisible.otherVisible">
                        <el-form-item label="编码方式" prop="bindCoding">
                            <el-select v-model="dataForm.bindCoding" size="small" clearable>
                                <el-option v-for="item in bindCodingOptions" :key="item.id" :label="item.ruleName"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="showVisible.otherVisible">
                        <el-form-item label="表单样式" prop="bindForm">
                            <el-select v-model="dataForm.bindForm" size="small" clearable>
                                <el-option v-for="item in executionTemplateOptions" :key="item.id"
                                    :label="item.subBusinessName" :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8" v-if="showVisible.otherVisible">
                        <el-form-item label="编制流程" prop="bindProcess">
                            <el-select v-model="dataForm.bindProcess" size="small">
                                <el-option v-for="item in processOptions" :key="item.key" :label="item.name"
                                    :value="item.key" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="showVisible.sampleSourceVisible">
                        <el-form-item label="样品来源" prop="sampleSource">
                            <el-select v-model="dataForm.sampleSource" size="small" :disabled="isUpdate">
                                <el-option v-for="item in sampleOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="打印模板" prop="bindPrintTemplate">
                            <el-select v-model="dataForm.bindPrintTemplate" size="small" clearable
                                @clear="dataForm.bindPrintTemplate = null">
                                <el-option v-for="item in templateOptions" :key="item.id" :label="item.templateName"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="检测项目" prop="itemBindType">
                            <el-select v-model="dataForm.itemBindType" size="small">
                                <el-option v-for="item in itemTypeList" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="样品表单样式" prop="bindEntrustInfoForm">
                            <el-select v-model="dataForm.bindEntrustInfoForm" size="small">
                                <el-option v-for="item in sampleTemplateOptions" :key="item.id"
                                    :label="item.subBusinessName" :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="子样品表单样式" prop="bindSampleCodingForm">
                            <el-select v-model="dataForm.bindSampleCodingForm" size="small">
                                <el-option v-for="item in subSampleTemplateOptions" :key="item.id"
                                    :label="item.subBusinessName" :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                        <el-form-item label="绑定低码Key(禁止随意改动)" prop="remark">
                            <el-input v-model="dataForm.remark" type="textarea" rows="4"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="queryParams.businessCategory == 'ENTRUST_AGREEMENT_REMOTE'">
                        <el-form-item label="绑定委托类型" prop="bindEntrustAgreement">
                            <el-select v-model="dataForm.bindEntrustAgreement" placeholder="请选择">
                                <el-option v-for="item in entrustOptionsList" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                </el-row>

                <!-- 样品编码 -->
                <el-row v-if="showVisible.entrustmentVisible">
                    <el-tabs type="border-card" style="margin-bottom: 6px;width: 100%">
                        <el-tab-pane label="样品编码">
                            <el-row>
                                <el-col :span="8">
                                    <el-form-item label="样品编码" prop="bindSampleCoding">
                                        <el-select v-model="dataForm.bindSampleCoding" size="small">
                                            <el-option v-for="item in bindSampleCodingOption" :key="item.id"
                                                :label="item.ruleName" :value="item.id" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="打印模板" prop="bindSampleTemplate">
                                        <el-select v-model="dataForm.bindSampleTemplate
                                            " size="small" clearable>
                                            <el-option v-for="item in bindSampleTemplateOption" :key="item.id"
                                                :label="item.templateName" :value="item.id" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="标签模板" prop="bindLabelTemplate">
                                        <el-select v-model="dataForm.bindLabelTemplate" size="small" clearable>
                                            <el-option v-for="item in bindLabelTemplateOption" :key="item.id"
                                                :label="item.templateName" :value="item.id" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!--							<el-row>-->
                            <!--								<el-form-item-->
                            <!--									label="编码生成方式"-->
                            <!--									prop="sampleCodingType"-->
                            <!--								>-->
                            <!--									<el-radio-group-->
                            <!--										v-model="dataForm.sampleCodingType"-->
                            <!--									>-->
                            <!--										<el-radio :label="1" >系统自动</el-radio>-->
                            <!--										<el-radio :label="2">手工生成</el-radio>-->
                            <!--									</el-radio-group>-->
                            <!--								</el-form-item>-->
                            <!--							</el-row>-->
                        </el-tab-pane>
                    </el-tabs>
                </el-row>

                <!-- 检测报告 -->
                <el-row v-if="showVisible.entrustmentVisible">
                    <el-tabs type="border-card" style="margin-bottom: 6px;width: 100%">
                        <el-tab-pane label="检测报告">
                            <el-row>
                                <el-col :span="8">
                                    <el-form-item label="报告编码" prop="bindReportCoding">
                                        <el-select v-model="dataForm.bindReportCoding" size="small">
                                            <el-option v-for="item in bindReportCodingOption" :key="item.id"
                                                :label="item.ruleName" :value="item.id" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="修订报告编码" prop="bindReviseReportCoding">
                                        <el-select v-model="dataForm.bindReviseReportCoding
                                            " size="small">
                                            <el-option v-for="item in bindReportCodingOption" :key="item.id"
                                                :label="item.ruleName" :value="item.id" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="报告模板" prop="bindReportTemplate">
                                        <el-select v-model="dataForm.bindReportTemplate
                                            " size="small" clearable>
                                            <el-option v-for="item in bindReportTemplateOption" :key="item.id"
                                                :label="item.templateName" :value="item.id" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <!--								<el-col :span="8">-->
                                <!--									<el-form-item-->
                                <!--										label="编制流程"-->
                                <!--										prop="bindProcessReport"-->
                                <!--									>-->
                                <!--										<el-select-->
                                <!--											v-model="dataForm.bindProcessReport"-->
                                <!--											size="small"-->
                                <!--											clearable-->
                                <!--										>-->
                                <!--											<el-option-->
                                <!--												v-for="item in bindProcessReportOption"-->
                                <!--												:key="item.key"-->
                                <!--												:label="item.name"-->
                                <!--												:value="item.key"-->
                                <!--											/>-->
                                <!--										</el-select>-->
                                <!--									</el-form-item>-->
                                <!--								</el-col>-->
                            </el-row>
                        </el-tab-pane>
                    </el-tabs>
                </el-row>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <div align="center">
                    <el-button type="primary" @click="submit">确定</el-button>
                    <el-button @click="cancel">取消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listData,
    updateDataStatus,
    delData,
    getData,
    addData,
    updateData,
    encodingOptionsData,
    processOptionsData,
    executionTemplateOptionsData,
    templateOptionsData
} from "@/api/manageCenter/base/businessConfig/business";
import { getBusinessCategoryBusinessList } from "@/api/manageCenter/baseConfig";

export default {
    name: "businessConfig",
    components: {},
    data() {
        return {
            entrustOptionsList: [],
            currentSelRow: [],//选择的当前行
            filterCode: '',
            // 显示搜索条件
            showSearch: true,
            category: [],
            filterCategory: [],
            // 遮罩层
            loading: true,
            // 表格数据
            dataList: [],
            // 表格数据总条数
            dataTotal: 0,
            itemTypeList: [
                {
                    label: '仅委托',
                    value: 1
                }, {
                    label: '委托样品',
                    value: 2
                }, {
                    label: '编码样品',
                    value: 3
                },
            ],
            // 模板状态选项
            statusOptions: [
                {
                    value: null,
                    label: "所有类型"
                },
                {
                    value: false,
                    label: "启用"
                },
                {
                    value: true,
                    label: "停用"
                }
            ],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                businessCategory: "",
                configName: "",
                status: ""
            },
            // 弹窗显示
            visible: false,
            // 是否更新操作
            isUpdate: false,
            // 各组件显示
            showVisible: {
                // 委托协议内容是否显示（样品编码，检测报告）
                entrustmentVisible: false,
                // 样品来源是否显示
                sampleSourceVisible: true,
                // 编码方式，表单样式，编制流程是否显示
                otherVisible: true
            },
            // 弹窗表单内容
            dataForm: {
                sampleCodingType: 1,
                itemBindType: 2
            },
            // 弹窗表单校验规则
            rules: {
                configName: [
                    {
                        required: true,
                        message: "类型名称不能为空",
                        trigger: "blur"
                    },
                    {
                        max: 50,
                        message: "类型名称不能超过50个字",
                        trigger: "blur"
                    }
                ],
                sampleSource: [
                    {
                        required: true,
                        message: "样品来源不能为空",
                        trigger: "blur"
                    }
                ],
                remark: [
                    {
                        max: 200,
                        message: "类型说明不能超过200个字",
                        trigger: "blur"
                    }
                ]
            },
            // 编码方式下拉选项
            bindCodingOptions: [],
            // 表单样式下拉选项
            executionTemplateOptions: [],
            // 样品表单样式
            sampleTemplateOptions: [],
            //子样表单样式
            subSampleTemplateOptions: [],
            // 编码流程下拉选项
            processOptions: [],
            // 样品来源下拉选项
            sampleOptions: [
                {
                    value: 2,
                    label: "送样"
                },
                {
                    value: 1,
                    label: "采样"
                }
            ],
            // 打印模式下拉选项
            templateOptions: [],
            // 样品编码下拉选项
            bindSampleCodingOption: [],
            // 样品打印下拉选项
            bindSampleTemplateOption: [],
            // 样品标签下拉选项
            bindLabelTemplateOption: [],
            // 检测报告编码
            bindReportCodingOption: [],
            // 检测报告模板
            bindReportTemplateOption: [],
            // 检测报告流程
            bindProcessReportOption: []
        };
    },
    // 创建方法，初始自动执行
    created() {
        this.getMenuList();
        this.e_getEntustOptionsList()
    },
    methods: {
        e_getEntustOptionsList() {
            this.$net('base/v1/businessConfigs?pageNum=1&pageSize=1000&businessCategory=ENTRUSTMENT_AGREEMENT', 'get').then(re => {
                this.entrustOptionsList = []
                re.data.list.forEach(item => {
                    let obj = {
                        label: item.configName,
                        value: item.id
                    }
                    this.entrustOptionsList.push(obj)
                })
            })
        },
        // 业务配置类型
        filterCodeList() {
            this.category = this.category.filter(item => {
                return item.dictLabel.includes(this.filterCode)
            })
            if (this.category.length > 0) {
                this.queryParams.businessCategory = this.category[0].dictCode
                this.getDataList()
            }
        },
        clearfilterCode() {
            this.category = this.filterCategory
            this.queryParams.businessCategory = this.category[0].dictCode
            this.getDataList()
        },
        /**
        * @author Coder
        * @date 2023/3/13
        * @des 复制选择的行
        */
        async e_copy(row) {
            if (this.currentSelRow.length == 0) {
                this.$message.error('请选择要复制的业务类型')
                return
            }
            if (this.currentSelRow.length != 1) {
                this.$message.error('请选择1条要复制的业务类型')
                return
            }
            if (row.sampleSource != this.currentSelRow[0].sampleSource) {
                this.$message.error('请选择相同样品来源的业务类型进行复制')
                return;
            }
            let targetFormJSon = await this.$net(`/formLayout/getFormLayoutConfig?id=${this.currentSelRow[0].id}`, 'get')
            if (targetFormJSon.data.formLayoutConfig) {
                let params = {
                    id: row.id,
                    formLayoutConfig: {}
                }
                for (let key in targetFormJSon.data.formLayoutConfig) {
                    params.formLayoutConfig[key] = targetFormJSon.data.formLayoutConfig[key]
                }
                this.$net('/formLayout/saveFormLayoutConfig', 'post', params).then(re => {
                    if (re.code == 200) {
                        this.$message.success('复制成功')
                    }
                })
            } else {
                this.$message.error('选择的业务类型未配置表单json')
            }

        },
        /**
        * @author Coder
        * @date 2023/3/13
        * @des 选择当前行
        */
        handleSelectionChange(row) {
            this.currentSelRow = row
            console.log('this.currentSelRow', this.currentSelRow)
        },
        // 左顺业务类型加载
        getMenuList() {
            getBusinessCategoryBusinessList().then(res => {
                this.category = res.data;
                this.queryParams.businessCategory = res.data[0].dictCode;
                this.getDataList();
                this.filterCategory = this.category
            });
        },
        // 左侧业务类型选择
        selectMenu(key) {
            this.queryParams.businessCategory = key;
            this.getDataList();
        },

        // 搜索按钮操作
        handleQuery() {
            this.getDataList();
        },
        // 重置按钮操作
        resetQuery() {
            this.resetForm("queryForm");
            this.getDataList();
        },

        // 加载主表单下拉选项
        loadMainFormOption(otherLoad) {
            // 编码方式
            encodingOptionsData(this.queryParams.businessCategory).then(
                response => {
                    if (response.code === 200) {
                        this.bindCodingOptions = response.data;
                    }
                }
            );
            // 表单样式
            executionTemplateOptionsData(
                this.queryParams.businessCategory
            ).then(response => {
                if (response.code === 200) {
                    this.executionTemplateOptions = response.data;
                }
            });
            // 编制流程
            processOptionsData().then(response => {
                if (response.code === 200) {
                    this.processOptions = response.data;
                }
            });
            // 打印模板
            templateOptionsData(this.queryParams.businessCategory, "PF").then(
                response => {
                    if (response.code === 200) {
                        this.templateOptions = response.data;
                    }
                }
            );
            //     获取委托样品表单样式
            this.$net('/template/execution/listAll?businessCategory=ENTRUST_INFO_GIVE', 'get').then(re => {
                this.sampleTemplateOptions = re.data
            })
            //     获取编码编码样品表单样式
            this.$net('/template/execution/listAll?businessCategory=SAMPLE_CODING_DETAIL_GIVE', 'get').then(re => {
                this.subSampleTemplateOptions = re.data
            })
        },
        // 加载委托协议特殊表单
        loadEntrustmentOption() {
            // 样品编码下拉选项
            encodingOptionsData("SAMPLE_CODE").then(response => {
                if (response.code === 200) {
                    this.bindSampleCodingOption = response.data;
                }
            });
            // 样品打印模板下拉选项
            templateOptionsData("SAMPLE_CODE", "PF").then(response => {
                if (response.code === 200) {
                    this.bindSampleTemplateOption = response.data;
                }
            });
            // 样品标签模板下拉选项
            templateOptionsData("SAMPLE_CODE", "LABEL").then(response => {
                if (response.code === 200) {
                    this.bindLabelTemplateOption = response.data;
                }
            });

            // 检测报告编码
            encodingOptionsData("REPORT").then(response => {
                if (response.code === 200) {
                    this.bindReportCodingOption = response.data;
                }
            });
            // 检测报告模板
            templateOptionsData("REPORT", "PF").then(response => {
                if (response.code === 200) {
                    this.bindReportTemplateOption = response.data;
                }
            });
            // // 检测报告流程
            // processOptionsData().then(response => {
            // 	if (response.code === 200) {
            // 		this.bindProcessReportOption = response.data;
            // 	}
            // });
        },

        // 新建按钮操作
        handleAdd() {
            this.dataForm = {
                sampleCodingType: 1,
                itemBindType: 2
            };
            this.dataForm.businessCategory = this.queryParams.businessCategory;
            switch (this.queryParams.businessCategory) {
                case "DETECT_SCHEME":
                    // 检测方案
                    this.showVisible = {
                        entrustmentVisible: false,
                        sampleSourceVisible: true,
                        otherVisible: true
                    };
                    break;
                case "ENTRUSTMENT_AGREEMENT":
                    // 委托协议
                    this.showVisible = {
                        entrustmentVisible: true,
                        sampleSourceVisible: true,
                        otherVisible: true
                    };
                    this.loadEntrustmentOption();
                    // this.dataForm.sampleCodingType = 1;
                    break;
                case "SUBCONTRACT_AGREEMENT":
                    // 分包协议
                    this.showVisible = {
                        entrustmentVisible: false,
                        sampleSourceVisible: false,
                        otherVisible: true
                    };
                    break;
                case "QUOTATION":
                    // 报价单
                    this.showVisible = {
                        entrustmentVisible: false,
                        sampleSourceVisible: true,
                        otherVisible: true
                    };
                    break;
                case "SAMPLE_HANDOVER":
                    // 样品交接
                    this.showVisible = {
                        entrustmentVisible: false,
                        sampleSourceVisible: false,
                        otherVisible: false
                    };
                    break;
                case "SAMPLE_COLLECT":
                    // 样品领用
                    this.showVisible = {
                        entrustmentVisible: false,
                        sampleSourceVisible: false,
                        otherVisible: false
                    };
                    break;
                case "SAMPLING_RECORD":
                    // 采样记录
                    console.info("TODO 等产品设计");
                    break;
                case "ORIGINAL_RECORD":
                    // 原始记录
                    console.info("TODO 等产品设计");
                    break;
                case "QUALITY_CONTROL":
                    // 质控管理
                    this.showVisible = {
                        entrustmentVisible: false,
                        sampleSourceVisible: false,
                        otherVisible: false
                    };
                    break;
            }
            this.loadMainFormOption(this.showVisible.otherVisible);
            this.show();
            this.isUpdate = false;
        },
        // 修改按钮操作
        handleUpdate(row) {
            getData(row.id).then(response => {
                if (response.code === 200) {
                    this.handleAdd();
                    this.dataForm = response.data;
                    this.show();
                    this.isUpdate = true;
                }
            });
        },
        // 删除按钮操作
        handleDelete(row) {
            this.$confirm(
                "是否确认删除配置【" + row.configName + "】?",
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(function () {
                    return delData(row.id);
                })
                .then(() => {
                    this.getDataList();
                    this.$message.success("删除成功");
                })
                .catch(function () { });
        },
        // 状态修改
        handleStatusChange(row) {
            let text = row.status ? "停用" : "启用";
            this.$confirm(
                "确认要 " + text + " 【" + row.configName + "】吗?",
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(function () {
                    return updateDataStatus(row.id, row.status);
                })
                .then(() => {
                    this.$message.success(text + "成功")
                })
                .catch(function () {
                    row.status = row.status ? false : true;
                });
        },

        // 确定按钮操作
        submit() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    if (this.dataForm.id) {
                        updateData(this.dataForm.id, this.dataForm).then(
                            response => {
                                if (response.code === 200) {
                                    this.$message.success("修改成功");
                                    this.cancel();
                                    this.getDataList();
                                }
                            }
                        );
                    } else {
                        addData(this.dataForm).then(response => {
                            if (response.code === 200) {
                                this.$message.success("新增成功");
                                this.cancel();
                                this.getDataList();
                            }
                        });
                    }
                }
            });
        },
        // 显示弹窗
        show() {
            this.visible = true;
        },
        // 取消弹窗
        cancel() {
            this.visible = false;
        },

        /** 查询菜单列表 */
        getDataList() {
            this.loading = true;
            listData(this.queryParams).then(response => {
                this.dataList = response.data.list;
                this.dataTotal = response.data.total;
                this.loading = false;
            });
        }
    }
};
</script>

<style lang="less" scoped>
.businessConfig {
    display: flex;

    .menu {
        width: 200px;
    }

    .container {
        flex: 1;

        .formInline {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 80px;
            padding: 0 30px;

            .el-form-item {
                margin-bottom: 0;
                margin-right: 20px;
            }
        }

        .addRule {
            margin-left: 5px;
        }
    }

    .el-row-toolbar {
        margin: 5px;
    }
}

/deep/ .rulesType {
    display: flex;
    align-items: center;

    p {
        width: 100px;
        margin-bottom: 0;
    }
}
</style>

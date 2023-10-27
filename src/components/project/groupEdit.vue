<template>
    <div class="groupEdit">
        <el-dialog
            title="修改项目分组"
            :visible.sync="editShow"
            center
            :close-on-click-modal="false"
            @open="open"
        >
            <el-form
                :model="editParams"
                :rules="rules"
                ref="checkForm"
                :inline="true"
                label-width="88px"
            >
                <el-form-item label="分组名称" prop="groupName">
                    <el-input
                        v-model="editParams.groupName"
                        clearable
                        size="small"
                    />
                </el-form-item>
                <el-form-item label="检测类别" prop="detectCategoryName">
                    <a-input-search
                        v-model="editParams.detectCategoryName"
                        style="width: 200px"
                        placeholder="选择类别名称"
                        disabled
                        @search="cateShow = true"
                    />
                </el-form-item>
                <el-form-item label="项目名称" prop="itemNameCn">
                    <a-input-search
                        v-model="editParams.itemNameCn"
                        style="width: 200px"
                        @search="e_showProject"
                        placeholder="选择项目"
                    />
                </el-form-item>
                <el-form-item label="共享模式" prop="departmentShare">
                    <el-select v-model="editParams.departmentShare" placeholder="默认部门共享"
                    >
                        <el-option
                            label="共享"
                            :value="0"
                        >
                        </el-option>
                        <el-option
                            label="私有"
                            :value="1"
                        >
                        </el-option>
                        <el-option
                            label="部门共享"
                            :value="3"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <!-- 表格 -->
            <p>包含项目</p>
            <el-table height="400" v-loading="loading" :data="tableData" stripe
                      border align="center">
                <el-table-column
                    prop="id"
                    type="index"
                    label="序号"
                    width="62px"
                />
                <el-table-column prop="itemNameCn" label="项目名称" :show-overflow-tooltip="true"/>
                <!--                <el-table-column prop="isScene" label="现场检测">-->
                <!--                    <template slot-scope="scope">-->
                <!--                        <el-switch-->
                <!--                            active-color="#5B7BFA"-->
                <!--                            inactive-color="#dadde5"-->
                <!--                            v-model="scope.row.isScene"-->
                <!--                            :active-value="true"-->
                <!--                            :inactive-value="false"-->
                <!--                            disabled-->
                <!--                        >-->
                <!--                        </el-switch>-->
                <!--                    </template>-->
                <!--                </el-table-column>-->
                <el-table-column prop="stroma" label="基质"/>
                <el-table-column prop="methodCode" label="方法编号"/>
                <!--                <el-table-column prop="childMethodName" label="子法名称"/>-->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            slot="reference"
                            size="mini"
                            icon="el-icon-delete"
                            type="text"
                            @click="handleDelete(scope.row, scope)"
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('checkForm')" center
                >保存
                </el-button
                >
                <el-button @click="close">取消</el-button>
            </div>
        </el-dialog>
        <selectProject
            ref="selectProject"
            :visible.sync="projectShow"
            @handleItemName="getTableData"
        />
    </div>
</template>
<script>
    // import "@/views/core/components_use";
    // import 'ant-design-vue/dist/antd.css';
    import { editProjectGroupList } from '@/api/standardManagement/config'
    import selectProject from './selectProject'

    export default {
        components: {
            selectProject
        },
        data() {
            return {
                // 项目分组表单数据
                groupParams: {
                    groupName: null,
                    detectCategoryName: null,
                    detectCategory: null, //这是id
                    detailList: [],
                    preservativeList: [],
                    storageList: []
                },
                rules: {
                    groupName: [
                        {
                            required: true,
                            message: '请输入分组名称',
                            trigger: 'blur'
                        }
                    ],
                    detectCategoryName: [
                        {
                            required: true,
                            message: '请输入检测类别',
                            trigger: 'blur'
                        }
                    ]
                },
                cateShow: false,
                projectShow: false,
                //表格数据
                tableData: [],
                //去重之后的表格数据
                newTableData: [],
                //这里需要回头看
                loading: false
            }
        },
        props: {
            editShow: {
                type: Boolean,
                default: false
            },
            //从上一页带过来的所有数据
            editParams: {
                type: Object
            },
            editIds: {
                type: Number
            }
        },
        methods: {
            /*
             *@author: 焦政
             *@date: 2021-02-05 14:43:04
             *@description: 选择检测项目
             */
            e_showProject() {
                this.$store.commit('set_isadd', false)
                this.$store.commit('set_groupId', this.editIds)
                this.projectShow = true
                this.$nextTick(() => {
                    this.$refs.selectProject.init(this.tableData)
                })
            },
            //取消按钮操作1
            close() {
                this.$emit('update:editShow', false)
                //在关闭之前将项目分组列表的数据清空
                this.tableData = []
                this.groupParams = {
                    groupName: null,
                    detectCategoryName: null,
                    detectCategory: null, //这是id
                    detailList: []
                }
            },
            open() {
                //将回显的表格数据放在tabledata里面
                this.tableData = this.tableData.concat(this.editParams.detailList)
                console.log('现在是回显的表格数据tableData', this.tableData)
            },
            //保存接口操作
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.groupParams.groupName = this.editParams.groupName
                        this.groupParams.detectCategoryName = this.editParams.detectCategoryName
                        this.groupParams.detectCategory = this.editParams.detectCategory
                        this.groupParams.departmentShare = this.editParams.departmentShare
                        this.tableData.map(item => {
                            this.groupParams.detailList.push({
                                itemMethod: item.id
                            })
                        })
                        editProjectGroupList(this.groupParams, this.editIds)
                            .then(() => {
                                //触发父组件传递过来的函数getTablelist()
                                this.$emit('func', null)
                                this.$message.success('保存成功')
                                this.close()
                            })
                            .catch(function() {
                            })
                    }

                })

            },
            //val是子组件选择项目传递过来的数据1
            getTableData(val) {
                this.tableData = val.checkData
                // console.log('子组件选择项目传递过来的数据==>', val)
                // this.tableData.forEach(item => {
                //     val.checkData.forEach((ele, i) => {
                //         // 比较this.tableData和val.checkData，如果this.tableData里面的数据val.checkData中已经存在了，就删除
                //         if (item.id == ele.id) {
                //             console.log(ele)
                //             val.checkData.splice(i, 1)
                //         }
                //     })
                // })
                // this.tableData = this.tableData.concat(val.checkData)
                // console.log('去重后的数据=>', this.tableData)
            },
            //删除按钮操作1
            handleDelete(row, scope) {
                console.log('要删除的行数据==>', row)
                console.log(scope.$index)
                const index = scope.$index
                const itemNameCn = row.itemNameCn
                const groupId = row.id
                this.$confirm('确定要删除"' + itemNameCn + '"项目？', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        console.log(this.tableData)
                        this.tableData.splice(index, 1)
                        this.groupParams.detailList.splice(index, 1)
                        this.$message.success('删除成功')
                    })
                    .catch(function() {
                    })
            }
        },
        computed: {},
        created() {
        },
        mounted() {
        }
    }
</script>
<style lang="less">
    .groupAdd {
        ul,
        li {
            list-style: none;
            padding: 0;
        }
    }

    .searchParentName {
        display: flex;
    }
</style>

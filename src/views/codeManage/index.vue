<template>
    <div>
        <BoContainer ref="BoContainer" pageTitle="样本" :total="pagination.total">
            <template slot="boMain">
                <BoMain>
                    <template slot="bosearch">
                        <el-form
                            :inline="true"
                            :model="form"
                            ref="form"
                            class="formInline"
                            v-show="showSearch"
                        >
                            <el-form-item label="规则名称" prop="ruleName">
                                <el-input v-model="form.ruleName" @keyup.enter.native="onSubmit" size="small"
                                          style="width: 240px;"
                                          @clear="onSubmit" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="规则状态" prop="ruleWay">
                                <el-select v-model="form.ruleWay" @change="onSubmit" clearable size="small"
                                           style="width: 240px;">
                                    <el-option
                                        v-for="item in options"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value"
                                    />
                                </el-select>
                            </el-form-item>
                            <div class="a-c-t-btnarea">
                                <el-form-item>
                                    <el-button
                                        type="primary"
                                        icon="el-icon-search"
                                        size="mini"
                                        @click="onSubmit"
                                    >搜索
                                    </el-button
                                    >
                                    <el-button
                                        icon="el-icon-refresh"
                                        size="mini"
                                        @click="reset"
                                    >重置
                                    </el-button
                                    >
                                </el-form-item>
                            </div>
                        </el-form>
                    </template>
                    <template slot="tableArea">
                        <el-row gutter="10">
                            <el-col :span="3" >
                              <el-input v-model="menuName" placeholder="回车搜索编码" size="small"
                                        clearable @clear="searchName"
                                        @keyup.enter.native="searchName"
                              />
                              <div :style="'height:'+ (mainTableHeight + 20) +'px;overflow-y: scroll'">
                                <el-menu
                                    :default-active="category[0] ? String(category[0].dictCode) : ''"
                                    @select="selectMenu"
                                >
                                  <el-menu-item
                                      v-for="item in category"
                                      :key="item.index"
                                      :index="String(item.dictCode)"
                                      style="text-align:center"
                                  >
                                    {{ item.dictLabel }}
                                  </el-menu-item>
                                </el-menu>
                              </div>

                            </el-col>
                            <el-col :span="21">
                                <el-row :gutter="10" class="el-row-toolbar">
                                    <el-col :span="1.5">
                                        <el-button
                                            class="addRule"
                                            type="primary"
                                            icon="el-icon-plus"
                                            size="mini"
                                            @click="addRule"
                                        >新增
                                        </el-button
                                        >
                                    </el-col>
                                    <right-toolbar
                                        :showSearch.sync="showSearch"
                                        @queryTable="onSubmit"
                                        style="margin-right: 10px;"
                                    ></right-toolbar>
                                </el-row>
                                <el-table
                                    :data="tableData"
                                    stripe
                                    style="width: 100%;margin-top: 8px"
                                    border
                                    :height="mainTableHeight"
                                    :loading="loading"
                                >
                                    <el-table-column type="selection" align="center">
                                    </el-table-column>
                                    <el-table-column type="index" label="地址" align="center">
                                    </el-table-column>
                                    <el-table-column prop="ruleName" label="规则名称" align="center">
                                    </el-table-column>
                                    <el-table-column prop="ruleWay" label="规则方式" align="center">
                                    </el-table-column>
                                    <el-table-column prop="ruleExplain" label="说明" align="center">
                                    </el-table-column>
                                    <el-table-column prop="ruleExample" label="示例" align="center">
                                    </el-table-column>
                                    <el-table-column prop="status" label="启停状态" align="center">
                                    </el-table-column>
                                    <el-table-column prop="status" label="启停状态" align="center">
                                        <template scope="scope">
                                            <el-button
                                                type="text"
                                                icon="el-icon-edit"
                                                @click="edit(scope.row, scope.$index)"
                                            >修改
                                            </el-button
                                            >
                                            <el-button
                                                type="text"
                                                icon="el-icon-delete"
                                                @click="deleteRules(scope.row, scope.$index)"
                                            >删除
                                            </el-button
                                            >
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-col>
                        </el-row>
                    </template>
                </BoMain>
            </template>
        </BoContainer>
        <el-dialog
            title="选择方式"
            :visible.sync="innerVisible"
            append-to-body
            width="500px"
            center
            :close-on-press-escape="false"
            :close-on-click-modal="false"
        >
            <div class="rulesType">
                <p>规则方式:</p>
                <el-select v-model="ruleWay" style="width:100%">
                    <el-option
                        v-for="item in options.filter(item => item.show)"
                        :label="item.label"
                        :value="item.value"
                        :key="item.value"
                    >
                    </el-option>
                </el-select>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="makeSure">确认</el-button>
                <el-button @click="innerVisible = false">取消</el-button>
            </div>
        </el-dialog>

        <addRules
            :visible.sync="rulesShow"
            :ruleWay="ruleWay"
            :editRules="editRules"
            :editId="editId"
            @getRules="getRules"
            :ruleType="query.ruleType"
        />
    </div>
</template>
<script>
    import boContainer from '@/mixins/boContainer'
    import {
        getenCodingRule,
        createRule,
        getEncodingRule,
        updateRule,
        deleteRule,
        updateStatus,
        getBusinessCategoryCodeList
    } from '@/api/manageCenter/baseConfig'
    import addRules from '@/components/manageCenter/base/addRules'

    export default {
        mixins: [boContainer],
        components: {
            addRules
        },
        data() {
            return {
                // 显示搜索条件
                showSearch: true,
                form: {},
                tableData: [],
                innerVisible: false,
                rulesShow: false,
                options: [
                    {
                        value: 1,
                        label: '模块配置',
                        show: true
                    },
                    {
                        value: 2,
                        label: '脚本生成',
                        show: false
                    }
                ],
                ruleWay: '',
                loading: false,
                category: [],
                filterCategory: [],
                editRules: {},
                editId: null,
                total: 0,
                pagination: {
                    total: 0,
                    pageSize: 10,
                    showSizeChanger: true
                },
                query: {
                    pageSize: 10,
                    pageNum: 1
                },
              menuName: '',
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            init() {
                this.getList()
            },
          searchName() {
              this.category = this.filterCategory.filter(item => {
                return item.dictLabel.includes(this.menuName)
              })
          },
            changeState(val, col, index) {
                this.$nextTick(() => {
                    this.$set(this.tableData[index], 'status', !val)
                    // console.log(val)
                    updateStatus(col.id, Number(!val)).then(res => {
                        if (res.code === 200) {
                            this.$message.success(res.msg)
                        }
                    })
                })
            },
            getRulesList() {
                this.loading = true
                getenCodingRule(this.query).then(res => {
                    this.tableData = res.data.list
                    this.pagination.total = res.data.total
                    this.loading = false
                })
            },
            getList() {
                getBusinessCategoryCodeList().then(res => {
                  res.data.map((item,index) => item.index = index)
                    this.category = res.data
                    this.filterCategory = res.data
                    this.query.ruleType = res.data[0].dictCode
                    this.getRulesList()
                })
            },
            changePage(pagination) {
                this.query.pageNum = pagination.current
                this.query.pageSize = pagination.pageSize
                this.getRulesList()
            },
            onSubmit() {
                this.query = Object.assign(this.query, this.form)
                console.log(this.query)
                this.getRulesList()
            },
            addRule() {
                this.editRules = {}
                this.innerVisible = true
                this.editId = null
            },
            makeSure() {
                if (this.ruleWay) {
                    this.innerVisible = false
                    this.rulesShow = true
                } else {
                    this.$message.error('请选择规则方式')
                }
            },
            deleteRules(row) {
                this.$confirm('确认删除该规则吗？', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteRule(row.id).then(res => {
                        this.$message.success('删除成功！')
                        this.getRulesList()
                    })
                })
            },
            selectMenu(key) {
                this.query.ruleType = key
                this.getRulesList()
                // this.selectedKeys = [key]
                console.log(key)
            },
            getRules(data) {
                console.log(data)
                const addData = JSON.parse(JSON.stringify(data))
                addData.ruleType = this.query.ruleType
                if (data.id) {
                    updateRule(data.id, addData).then(res => {
                        this.rulesShow = false
                        this.$message.success('保存成功')
                        this.getRulesList()
                    })
                } else {
                    createRule(addData).then(res => {
                        this.rulesShow = false
                        this.$message.success('保存成功')
                        this.getRulesList()
                    })
                }
            },
            edit(record, index) {
                getEncodingRule(record.id).then(res => {
                    this.rulesShow = true
                    this.editRules = res.data
                })

                this.editId = record.id
            },
            reset() {
                this.form = {
                    ruleName: null,
                    ruleWay: null
                }
                // this.$refs['form'].resetFields();
                this.onSubmit()
            }
        }
    }
</script>
<style lang="less" scoped>
</style>

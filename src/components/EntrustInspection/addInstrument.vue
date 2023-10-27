<template>
    <BoDialog :dia-log-title="showType == 'detail'?'查看仪器':Lang[lang]['addInstrument']" dia-log-width="70%"
              :dia-log-show="showLog" @close="e_close">
        <template slot="bologbody">
            <el-divider v-if="showType != 'detail'">{{ Lang[lang]['selInstrumentNumber'] }} {{selectedList.length}}</el-divider>
            <el-table
                :data="selectedList"
                stripe
                style="width: 100%;margin: 8px 0"
                border
                :empty-text="Lang[lang]['NoDataTemporarily']"
                height="320px"
            >
                <el-table-column
                    type="index"
                    width="60"
                    :label="Lang[lang]['order']"
                />
                <!--                仪器分类-->
                <el-table-column
                    prop="equipmentClassStr"
                    :label="Lang[lang]['instrumentType']"
                    align="center"
                    show-overflow-tooltip
                />
                <!--                仪器编号-->
                <el-table-column
                    prop="equipmentNumber"
                    :label="Lang[lang]['instrumentNo']"
                    align="center"
                    show-overflow-tooltip
                />
                <!--                仪器名称-->
                <el-table-column
                    prop="equipmentName"
                    :label="Lang[lang]['instrumentName']"
                    align="center"
                    show-overflow-tooltip
                />
                <!--                仪器型号-->
                <el-table-column
                    prop="equipmentModel"
                    :label="Lang[lang]['instrumentModel']"
                    align="center"
                    show-overflow-tooltip
                />
                <!--                操作-->
                <el-table-column
                    prop=""
                    :label="Lang[lang]['operate']"
                    align="center"
                    v-if="showType != 'detail'"
                >
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-delete"
                                   @click="e_delete(scope.row,scope.$index)">
                            {{Lang[lang]['delete']}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-form :model="queryParams"
                     v-show="showType != 'detail'"
                     ref="queryForm"
                     :inline="true"
                     class="searchform"
                     :label-position="lang=='chinese'?'left':'top'"
            >
                <el-row>
                    <!--                    仪器名称-->
                    <el-col :span="8">
                        <el-form-item
                            :label="Lang[lang]['instrumentName']"
                            prop="equipmentName"

                        >
                            <el-input v-model="queryParams.equipmentName" @keyup.enter.native="getlistData"
                                      @clear="getlistData" clearable/>
                        </el-form-item>
                    </el-col>
                    <!--                    仪器编号-->
                    <el-col :span="8">
                        <el-form-item
                            :label="Lang[lang]['instrumentNo']"
                            prop="equipmentNumber"

                        >
                            <el-input v-model="queryParams.equipmentNumber" @keyup.enter.native="getlistData"
                                      @clear="getlistData" clearable/>
                        </el-form-item>
                    </el-col>
                    <!--                    仪器型号-->
                    <el-col :span="8">
                        <el-form-item
                            :label="Lang[lang]['instrumentModel']"
                            prop="equipmentModel"
                        >
                            <el-input v-model="queryParams.equipmentModel" @keyup.enter.native="getlistData"
                                      @clear="getlistData" clearable/>
                        </el-form-item>
                    </el-col>
                    <!--                    仪器分类-->
                    <el-col :span="8">
                        <el-form-item
                            :label="Lang[lang]['instrumentType']"
                            prop="equipmentClassStr"
                        >
                            <el-input v-model="queryParams.equipmentClassStr" @keyup.enter.native="getlistData"
                                      @clear="getlistData" clearable/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item>
                            <!--                        查询-->
                            <el-button type="primary" size="mini" icon="el-icon-search" @click="getlistData"
                            >{{Lang[lang]['searchBtn']}}
                            </el-button>
                            <!--                重置-->
                            <el-button size="mini" icon="el-icon-refresh" @click="reset"
                            >{{Lang[lang]['Reset']}}
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-table
                v-show="showType != 'detail'"
                :data="listData"
                ref="listData"
                stripe
                style="width: 100%;margin: 8px 0"
                @select-all="SelectAllCheck"
                @select="handleSelectionChange"
                :empty-text="Lang[lang]['NoDataTemporarily']"
                border
            >
                <el-table-column
                    type="selection"
                    align="center"
                />
                <!--                仪器分类-->
                <el-table-column
                    prop="equipmentClassStr"
                    :label="Lang[lang]['instrumentType']"
                    align="center"
                    show-overflow-tooltip
                />
                <!--                仪器编号-->
                <el-table-column
                    prop="equipmentNumber"
                    :label="Lang[lang]['instrumentNo']"
                    align="center"
                    show-overflow-tooltip
                />
                <!--                仪器名称-->
                <el-table-column
                    prop="equipmentName"
                    :label="Lang[lang]['instrumentName']"
                    align="center"
                    show-overflow-tooltip
                />
                <!--                仪器型号-->
                <el-table-column
                    prop="equipmentModel"
                    :label="Lang[lang]['instrumentModel']"
                    align="center"
                    show-overflow-tooltip
                />
            </el-table>
            <pagination
                v-show="showType != 'detail'"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getlistData"
            />
        </template>
        <template slot="bologfooter">
            <el-button v-if="showType != 'detail'" type="primary" size="small" @click="e_saveBtn">{{
                Lang[lang]['saveBtn'] }}
            </el-button>
            <el-button size="small" @click="e_close">{{ Lang[lang]['closeBtn'] }}</el-button>
        </template>
    </BoDialog>
</template>
<script>
    import Lang from './Lang'
    import BoContainerMixin from '@/mixins/boContainer'

    export default {
        mixins: [BoContainerMixin],
        data() {
            return {
                Lang,
                showLog: false,
                selectedList: [],//已选择仪器数量
                parentData: [],//父级数据
                intoType: '',//进入添加仪器类型 1是点击仪器数量进入该页面，2是选择框选择数据按钮进入该页面
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    equipmentName: null,
                    equipmentNumber: null,
                    equipmentModel: null,
                    equipmentClassStr: null
                },
                listData: [],
                total: 0,
                showType: '' //结果录入菜单 查看判断
            }
        },

        methods: {
            init(type, data, showType) {
                console.log(data)
                console.log(showType)
                this.showType = showType
                this.intoType = type
                if (data != undefined) {
                    this.parentData = data
                }
                this.showLog = true
                // 刚进入页面标识
                this.getlistData('start')
            },
            async getlistData(type) {
                let getData = await this.$net('/v1/detectSampleItemInstrument/instrumentList', 'get', this.queryParams)
                if (getData.code == 200) {
                    this.listData = getData.data.list
                    this.total = getData.data.total
                    this.$nextTick(() => {
                        if (this.intoType == 1 && type == 'start') {
                            if (this.parentData.instrumentList1 == null) {
                                this.parentData.instrumentList1 = []
                            }
                            // 回显主页面带过来的数据
                            this.parentData.instrumentList1.map((item2) => {
                                console.log(item2)
                                this.selectedList.push(item2)
                                this.listData.map((item1) => {
                                    if (item1.id == item2.id) {
                                        this.selectedList.splice(this.selectedList.length - 1, 1, item1)
                                        this.$refs.listData.toggleRowSelection(item1, true)
                                    }
                                })
                            })
                        } else {
                            // 新添加项目时回显
                            this.listData.map((item) => {
                                this.selectedList.map((item2, index) => {
                                    if (item.id == item2.id) {
                                        this.selectedList.splice(index, 1, item)
                                        this.$refs.listData.toggleRowSelection(item, true)
                                    }
                                })
                            })
                        }
                    })
                }
            },
            e_saveBtn() {
                if (this.selectedList.length == 0) {
                    this.$message.info('至少选择一种设备进行保存')
                    return
                }
                this.$emit('reload', this.intoType, this.selectedList, this.parentData)
            },
            // 设备列表全选
            SelectAllCheck(selection) {
                //判断是全选还是取消全选
                let isAllChecked = false
                if (selection.length > 0) {
                    isAllChecked = true
                }
                this.listData.forEach(row => {
                    let index = this.selectedList.findIndex(function(item) {
                        return item.id === row.id
                    })
                    if (isAllChecked && index == -1) {
                        //全选状态 && 已选表格不存在这个检测项目
                        this.selectedList.push(row)
                    } else if (!isAllChecked && index > -1) {
                        //取消全选 && 已选表格存在这个检测项目
                        this.selectedList.splice(index, 1)
                    }
                })
            },
            // 手动选择
            handleSelectionChange(selection, row) {
                let selected = selection.length && selection.indexOf(row) !== -1
                if (selected) {
                    this.selectedList.push(row)
                } else {
                    //取消选中
                    var index = this.selectedList.findIndex(function(item) {
                        return item.id === row.id
                    })
                    this.selectedList.splice(index, 1)
                }
            },
            // 已选择列表 删除操作
            e_delete(row, index) {
                this.selectedList.splice(index, 1)
                this.$nextTick(() => {
                    this.$refs.listData.toggleRowSelection(row, false)
                })
            },
            // 重置 按钮
            reset() {
                this.$refs.queryForm.resetFields()
                this.getlistData()
            },
            e_close() {
                this.showLog = false
                this.$emit('cancel')
            }
        }

    }
</script>

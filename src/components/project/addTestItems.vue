<template>
    <BoDialog :diaLogShow="diaLogShow" :diaLogTitle="Lang[lang]['AddTestItems']" diaLogWidth="80%"
              @close="e_close">
        <template slot="bologbody">
            <div style="margin: 20px 0 20px 0  ">{{Lang[lang]['ItemsSelected']}}</div>
            <el-table
                :data="selectedItemList"
                border
                stripe
                style="width: 100%;"
                :row-style="{ height: '20px' }"
                :cell-style="{ padding: '2px' }"
                ref="selectedItemTable"
                :empty-text="Lang[lang]['NoDataTemporarily']"
                height="300"
            >
                <el-table-column type="index" width="60" align="center" :label="Lang[lang]['order']">
                    <template slot-scope="scope">
                        <span>{{ scope.$index + 1 }}</span>
                    </template>
                </el-table-column>
                <!--                检测项目名称-->
                <el-table-column prop="itemNameCn" :label="Lang[lang]['TestItemName']" align="center"
                                 :render-header="linefeed" :show-overflow-tooltip="true"/>
                <!--                方法编号-->
                <el-table-column prop="methodCode" :label="Lang[lang]['MethodCode']" align="center"
                                 :render-header="linefeed" :show-overflow-tooltip="true"/>
                <!--                方法名称-->
                <el-table-column prop="methodNameCn" :label="Lang[lang]['MethodName']" align="center"
                                 :render-header="linefeed" :show-overflow-tooltip="true"/>
                <!--                检测部门-->
                <el-table-column prop="detectDept" :label="Lang[lang]['TestingDepartment']" align="center"
                                 :render-header="linefeed" :show-overflow-tooltip="true"/>
                <el-table-column align="center" :label="Lang[lang]['Operation']">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-delete"
                                   @click="e_delete(scope.row,scope.$index)">
                            {{Lang[lang]['delete']}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-tabs
                type="border-card"
                tab-position="left"
                @tab-click="handleClick"
                v-model="selectItemType"
                style="margin-top: 15px"
            >
                <el-tab-pane :label="Lang[lang]['ByProject']" name="item">
                    <el-form :inline="true"
                             style="margin-top: 30px"
                             :model="projectParams"
                             ref="projectParams"
                    >
                        <el-row>
                            <el-col :span="8">
                                <el-form-item :label="Lang[lang]['TestItemName']">
                                    <el-input v-model="projectParams.itemName" @keyup.native.enter="ProjectSearchbtn"
                                              @clear="ProjectSearchbtn"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="Lang[lang]['MethodCode']">
                                    <el-input v-model="projectParams.methodCode" @keyup.native.enter="ProjectSearchbtn"
                                              @clear="ProjectSearchbtn"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2" style="margin-right: 10px">
                                <el-button type="primary" size="small" center @click="ProjectSearchbtn">{{
                                    Lang[lang]['searchBtn'] }}
                                </el-button>
                            </el-col>
                            <el-col :span="1">
                                <el-button size="small" center @click="ProjectResetbtn">{{Lang[lang]['Reset']}}
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                    <!--检测项目list   start-->
                    <el-table
                        :data="projectList"
                        ref="projectArr"
                        border
                        stripe
                        style="width: 100%;margin-left:10px"
                        @select-all="projectSelectAllCheck"
                        @select="handleSelectionChange"
                        max-height="250"
                        :empty-text="Lang[lang]['NoDataTemporarily']"
                    >
                        <el-table-column type="selection" width="45"></el-table-column>
                        <!--                        检测项目名称-->
                        <el-table-column prop="itemNameCn" :label="Lang[lang]['TestItemName']" align="center"
                                         :render-header="linefeed" :show-overflow-tooltip="true"/>
                        <!--                        方法编号-->
                        <el-table-column prop="methodCode" :label="Lang[lang]['MethodCode']" align="center"
                                         :render-header="linefeed" :show-overflow-tooltip="true"/>
                        <!--                        方法名称-->
                        <el-table-column prop="methodNameCn" :label="Lang[lang]['MethodName']" align="center"
                                         :render-header="linefeed" :show-overflow-tooltip="true"/>
                    </el-table>
                    <pagination
                        v-show="total > 0"
                        :total="total"
                        :page.sync="projectParams.pageNum"
                        :limit.sync="projectParams.pageSize"
                        @pagination="ProjectSearchbtn"
                    />
                    <!--检测项目list   end-->
                </el-tab-pane>

                <el-tab-pane :label="Lang[lang]['GroupBy']" name="group">

                    <el-row>
                        <el-col :span="6">
                            <el-form :inline="true"
                                     :model="groupParam"
                                     ref="groupParam">
                                <el-row>
                                    <el-col :span="24">
                                        <el-form-item :label="Lang[lang]['GroupName']+'：'">
                                            <el-input v-model="groupParam.groupName" style="width: 100%;" clearable
                                                      @clear="GroupSearchbtn"
                                                      @keyup.native.enter="GroupSearchbtn"
                                                      @blur="GroupSearchbtn"/>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <!--分组表格 start-->
                            <el-table
                                :data="groupList"
                                ref="groupTable"
                                border
                                stripe
                                style="width: 100%"
                                :row-style="{ height: '20px' }"
                                :cell-style="{ padding: '2px' }"
                                @row-click="groupTableClick"
                                max-height="250"
                                :empty-text="Lang[lang]['NoDataTemporarily']"
                            >
                                <el-table-column type="index" :render-header="linefeed" align="center" width="65"
                                                 :label="Lang[lang]['order']"/>
                                <el-table-column prop="groupName" :render-header="linefeed" align="center"
                                                 :label="Lang[lang]['GroupName']"/>
                            </el-table>
                            <!--分组表格 end-->
                        </el-col>
                        <el-col :span="18">
                            <!--检测项目list   start-->
                            <el-table
                                :data="itemList"
                                ref="itemArr"
                                border
                                stripe
                                style="width: 100%;margin-left:10px"
                                @select-all="groupSelectAllCheck"
                                @select="handleSelectionChange"
                                max-height="308"
                                :empty-text="Lang[lang]['NoDataTemporarily']"
                            >
                                <el-table-column type="selection" width="45"></el-table-column>
                                <!--                                检测项目名称-->
                                <el-table-column prop="itemNameCn" :label="Lang[lang]['TestItemName']" align="center"
                                                 :render-header="linefeed" :show-overflow-tooltip="true"/>
                                <!--                                方法编号-->
                                <el-table-column prop="methodCode" :label="Lang[lang]['MethodCode']" align="center"
                                                 :render-header="linefeed" :show-overflow-tooltip="true"/>
                            </el-table>
                            <!--检测项目list   end-->
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </template>
        <template slot="bologfooter">
            <el-button type="primary" size="small" @click="e_preservation">{{Lang[lang]['preservation']}}</el-button>
            <el-button size="small" @click="e_close">{{Lang[lang]['cancel']}}</el-button>
        </template>
    </BoDialog>
</template>
<script>
    import Lang from './Language/index'
    import BoContainerMixin from '@/mixins/boContainer'

    export default {
        mixins: [BoContainerMixin],
        data() {
            return {
                Lang,
                isFullScreen: true,
                diaLogShow: false,
                selectItemType: 'item',
                projectParams: {
                    itemName: '',
                    pageSize: 10,
                    pageNum: 1,
                    methodCode: ''
                },
                groupParam: {
                    groupName: '',
                    pageSize: 100,
                    pageNum: 1
                },
                projectList: [],
                selectedItemList: [],
                itemList: [],
                groupList: [],
                activeNames: ['1', '2'],
                date: '',
                option: '',
                isdisabled: false,
                total: 0
            }
        },
        methods: {
            async init(id, arr) {
                if (arr != undefined) {
                    if (arr.length != 0) {
                        arr.map((item) => {
                            this.selectedItemList.push(item)
                        })
                    }
                }
                this.diaLogShow = true
                this.detectCategory = id
                this.getProjectData()
                this.getGroupData()
            },
            // 获取项目列表
            async getProjectData() {
                let params = Object.assign(this.projectParams, { detectCategory: this.detectCategory })
                let getData = await this.$net('/standard/v1/itemMethods/getItemList', 'get', params)
                if (getData.code == 200) {
                    console.log('项目数据列表===》', getData)
                    this.projectList = getData.data.list
                    this.total = getData.data.total
                    this.$nextTick(() => {
                        this.projectList.map((item1) => {
                            this.selectedItemList.map((item2, index) => {
                                if (item1.id == item2.id) {
                                    this.selectedItemList.splice(index, 1, item1)
                                    this.$refs.projectArr.toggleRowSelection(item1, true)
                                }
                            })
                        })
                    })
                }
            },
            // 获取分组列表
            async getGroupData() {
                let params = Object.assign(this.groupParam, { detectCategory: this.detectCategory })
                let getData = await this.$net('standard/v1/itMeGroups/getGroupList', 'get', params)
                if (getData.code == 200) {
                    console.log('分组数据列表===》', getData)
                    this.groupList = getData.data
                }
            },
            //按分组查询检测项目
            async groupTableClick(row) {
                let getData = await this.$net(`/standard/v1/itMeGroups/getGroupsByItemIdList/${row.id}`, 'get')
                if (getData.code == 200) {
                    console.log('分组项目列表===》', getData)
                    this.itemList = getData.data.list
                    this.$nextTick(() => {
                        this.itemList.map((item1) => {
                            this.selectedItemList.map((item2, index) => {
                                if (item1.id == item2.id) {
                                    this.selectedItemList.splice(index, 1, item1)
                                    this.$refs.itemArr.toggleRowSelection(item1, true)
                                }
                            })
                        })
                    })
                }
            },
            // 项目搜索
            ProjectSearchbtn() {
                this.getProjectData()
            },
            // 分组搜索
            GroupSearchbtn() {
                this.getGroupData()
            },
            // 分组重置按钮
            ProjectResetbtn() {
                this.projectParams = {
                    itemName: '',
                    methodCode: '',
                    pageNum: 1,
                    pageSize: 10

                }
                this.getProjectData()
            },
            // tab切换
            handleClick(tab) {
                if (tab.name == 'item') {
                    this.ProjectResetbtn()
                } else {
                    this.groupParam.groupName = ''
                    this.getGroupData()
                }
                this.selectItemType = tab.name
            },
            // 手动选择
            handleSelectionChange(selection, row) {
                let selected = selection.length && selection.indexOf(row) !== -1
                if (selected) {
                    this.selectedItemList.push(row)
                } else {
                    //取消选中
                    var index = this.selectedItemList.findIndex(function(item) {
                        return item.id === row.id
                    })
                    this.selectedItemList.splice(index, 1)
                }
            },
            // 分组列表是否全选
            groupSelectAllCheck(selection) {
                //判断是全选还是取消全选
                let isAllChecked = false
                if (selection.length > 0) {
                    isAllChecked = true
                }
                this.itemList.forEach(row => {
                    let index = this.selectedItemList.findIndex(function(item) {
                        return item.id === row.id
                    })
                    if (isAllChecked && index == -1) {
                        //全选状态 && 已选表格不存在这个检测项目
                        this.selectedItemList.push(row)
                    } else if (!isAllChecked && index > -1) {
                        //取消全选 && 已选表格存在这个检测项目
                        this.selectedItemList.splice(index, 1)
                    }
                })
            },
            // 项目列表是否全选
            projectSelectAllCheck(selection) {
                //判断是全选还是取消全选
                let isAllChecked = false
                if (selection.length > 0) {
                    isAllChecked = true
                }
                this.projectList.forEach(row => {
                    let index = this.selectedItemList.findIndex(function(item) {
                        return item.id === row.id
                    })
                    if (isAllChecked && index == -1) {
                        //全选状态 && 已选表格不存在这个检测项目
                        this.selectedItemList.push(row)
                    } else if (!isAllChecked && index > -1) {
                        //取消全选 && 已选表格存在这个检测项目
                        this.selectedItemList.splice(index, 1)
                    }
                })
            },
            // 保存 按钮
            e_preservation() {
                if (this.selectedItemList.length == 0) {
                    this.$message.warning('请选择检测项目')
                    return
                }
                this.diaLogShow = false
                this.$emit('reload', this.selectedItemList)
            },
            // 删除 操作
            e_delete(row, index) {
                this.selectedItemList.splice(index, 1)
                this.$nextTick(() => {
                    this.$refs.itemArr.toggleRowSelection(row, false)
                    this.$refs.projectArr.toggleRowSelection(row, false)
                })
            },
            // 关闭
            e_close() {
                this.diaLogShow = false
                this.$emit('cancel')
            }
        }
    }
</script>

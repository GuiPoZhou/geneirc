<template>
    <div class="selectProject">
        <BoDialog :diaLogShow="diaLogShow" diaLogTitle="检测项目选择" diaLogWidth="80%"
                  @close="e_close">
            <template slot="bologbody">
                <el-form
                        :model="selectProjectParams"
                        ref="selectProjectForm"
                        :inline="true"
                        label-width="70px"
                >
                    <el-form-item label="项目名称" prop="itemNameCn">
                        <el-input
                                v-model="selectProjectParams.itemNameCn"
                                clearable
                                size="small"
                        />
                    </el-form-item>
                    <el-form-item label="方法编码" prop="methodCode">
                        <el-input
                                v-model="selectProjectParams.methodCode"
                                clearable
                                size="small"
                        />
                    </el-form-item>
                    <!--                <el-form-item label="现场检测">-->
                    <!--                    <el-select v-model="selectProjectParams.isScene">-->
                    <!--                        <el-option label="所有" value=""></el-option>-->
                    <!--                        <el-option label="是" value="true"></el-option>-->
                    <!--                        <el-option label="否" value="false"></el-option>-->
                    <!--                    </el-select>-->
                    <!--                </el-form-item>-->
                    <el-form-item>
                        <el-button
                                type="primary"
                                icon="el-icon-search"
                                size="mini"
                                @click="onSubmit"
                        >搜索
                        </el-button
                        >
                    </el-form-item>
                </el-form>
                <p>已选项目</p>
                <!-- 已选项目区域 -->
                <div class="sel-area">
                    <div class="sa-list" v-for="(v, i) in showSelList" :key="i">
                        <el-tag closable @close="e_close(i)">{{v.itemNameCn}}
                        </el-tag>
                    </div>
                </div>
                <!-- 表格 -->
                <p>包含项目</p>
                <el-table
                        v-loading="loading"
                        :data="tableData"
                        height="450"
                        align="center"
                        stripe
                        border
                        ref="multipleTable"
                        @select-all="handleSelectionChange"
                        @select="e_select"
                >
                    <el-table-column type="selection" width="55" align="center"/>
                    <el-table-column prop="itemNameCn" label="项目名称" :show-overflow-tooltip="true" align="center"/>
                    <!--                <el-table-column prop="isScene" label="现场检测">-->
                    <!--                    <template slot-scope="scope">-->
                    <!--                        <el-switch-->
                    <!--                            active-color="#5B7BFA"-->
                    <!--                            inactive-color="#dadde5"-->
                    <!--                            v-model="scope.row.isScene"-->
                    <!--                            :active-value="true"-->
                    <!--                            :inactive-value="false"-->
                    <!--                            disabled-->
                    <!--                            @change="-->
                    <!--								changeIsScene($event, scope.row.id, scope.row)-->
                    <!--							"-->
                    <!--                        >-->
                    <!--                        </el-switch>-->
                    <!--                    </template>-->
                    <!--                </el-table-column>-->
                    <!--                <el-table-column prop="stroma" label="基质"/>-->
                    <el-table-column prop="methodCode" label="方法编码" align="center"/>
                    <!--                <el-table-column prop="childMethodName" label="子法名称"/>-->
                </el-table>
                <!-- 分页 -->
                <pagination
                        v-show="total > 0"
                        :total="total"
                        :page.sync="selectProjectParams.pageNum"
                        :limit.sync="selectProjectParams.pageSize"
                        @pagination="getTablelist"
                />
            </template>
            <template slot="bologfooter">
                <el-button type="primary" size="small" @click="submitForm" center
                >确定
                </el-button
                >
                <el-button @click="close" size="small">取消</el-button>
            </template>
        </BoDialog>
    </div>
</template>
<script>
    import '@/views/core/components_use'
    import 'ant-design-vue/dist/antd.css'
    import {
        getProjectMethodList,
        getCommonValidItemList,
        getTakeValidItemList
    } from '@/api/standardManagement/config'

    export default {
        components: {},
        data() {
            return {
                // 检测项目选择表单数据
                selectProjectParams: {
                    itemNameCn: null,
                    methodCode: null,
                    isScene: null,
                    startPage: 1,
                    pageSize: 10
                },
                cateShow: false,
                diaLogShow: false,
                //表格数据
                tableData: [],
                //这里需要回头看
                loading: false,
                // 选中数组
                ids: [],
                // 非单个禁用
                // single: true,
                // 非多个禁用
                // multiple: true,
                showSelList: [], //已选项目数据
                //多选框选中的数据
                checkData: [],
                total: 0,
                shouldPush: true
            }
        },
        methods: {
            init(data) {
                this.diaLogShow = true
                console.log(this.diaLogShow)
                console.log(data)
                this.selectProjectParams = {
                    itemNameCn: null,
                    methodCode: null,
                    isScene: null,
                    startPage: 1,
                    pageSize: 10
                }
                this.showSelList = data
                this.getTablelist()
            },
            // 项目回显
            Echo() {
                console.log(this.showSelList)
                console.log(this.tableData)
                this.showSelList.map((item1) => {
                    this.tableData.map((item2) => {
                        if (item1.id == item2.id) {
                            this.$refs.multipleTable.toggleRowSelection(item2, true)
                        }
                    })
                })
            },
            e_select(selection, row) {
                let selected = selection.length && selection.indexOf(row) !== -1
                if (selected) {
                    this.showSelList.push(row)
                } else {
                    //取消选中
                    var index = this.showSelList.findIndex(function(item) {
                        return item.id === row.id
                    })
                    this.showSelList.splice(index, 1)
                }
                // let val = this.showSelList.some(item => {
                //     return item.id == row.id
                // })
                // if (val) {
                //     var index = this.showSelList
                //         .map(item => {
                //             return item.id
                //         })
                //         .indexOf(row.id)
                //     this.showSelList.splice(index, 1)
                //     localStorage.setItem(
                //         'tagsList',
                //         JSON.stringify(this.showSelList)
                //     )
                //     this.filterSample()
                // }
            },
            // 多选框选中数据1
            handleSelectionChange(selection) {
                //判断是全选还是取消全选
                let isAllChecked = false
                if (selection.length > 0) {
                    isAllChecked = true
                }
                this.tableData.forEach(row => {
                    let index = this.showSelList.findIndex(function(item) {
                        return item.id === row.id
                    })
                    if (isAllChecked && index == -1) {
                        //全选状态 && 已选表格不存在这个检测项目
                        this.showSelList.push(row)
                    } else if (!isAllChecked && index > -1) {
                        //取消全选 && 已选表格存在这个检测项目
                        this.showSelList.splice(index, 1)
                    }
                })
                // // 获取缓存的已选数据
                // let arr = []
                // if (localStorage.getItem('tagsList')) {
                //     arr = JSON.parse(localStorage.getItem('tagsList'))
                // }
                // //多选框选中的数据
                // this.checkData = selection
                // this.showSelList = [...arr, ...this.checkData]
                // var obj = {}
                // var cc = this.showSelList.reduce(function(item, next) {
                //     obj[next.id] ? '' : (obj[next.id] = true && item.push(next))
                //     return item
                // }, [])
                // this.showSelList = cc
            },
            /*
             *@author: 焦政
             *@date: 2021-01-26 10:17:26
             *@description: 删除已选
             */
            async e_close(i) {
                this.showSelList.splice(i, 1)
                localStorage.setItem('tagsList', JSON.stringify(this.showSelList))
                this.filterSample()
            },
            /*
             *@author: 焦政
             *@date: 2021-01-26 09:14:08
             *@description: 比较去重
             */
            filterSample() {
                let arr = JSON.parse(JSON.stringify(this.showSelList))
                let needArr = []
                arr.filter(item => {
                    this.tableData.map(it => {
                        if (it.id == item.id) {
                            needArr.push(it)
                        }
                    })
                })
                this.$refs.multipleTable.clearSelection()
                needArr.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row, true)
                })
            },
            //取消按钮操作1
            close() {
                this.diaLogShow = false
                this.$emit('close')
                localStorage.setItem('tagsList', [])
            },

            /*
             *@author: 焦政
             *@date: 2021-01-25 12:44:30
             *@description: 填充选择的数据到已选数据中
             */
            fillDataToSel() {
                let arr = JSON.parse(JSON.stringify(this.showSelList))
                arr.concat(this.checkData)
                var result = []
                for (var i = 0; i < arr.length; i++) {
                    var obj = this.rateTableData[i]
                    var mainid = obj.id
                    var isExist = false
                    for (var j = 0; j < this.showSelList.length; j++) {
                        var aj = this.showSelList[j]
                        var showid = aj.id
                        if (mainid == showid) {
                            isExist = true
                            break
                        }
                    }
                    if (!isExist) {
                        result.push(obj)
                    }
                }
                this.showSelList = result
            },
            //获取项目方法管理列表1
            getTablelist() {
                // getProjectMethodList(this.selectProjectParams).then(response => {
                // 	this.tableData = response.data.list;
                // 	this.total = response.data.total;
                // 	this.loading = false;
                // 	this.$nextTick(() => {
                // 		this.filterSample();
                // 	});
                // });
                // localStorage.setItem('tagsList', JSON.stringify(this.showSelList))
                // let projectType = this.$store.state.standardManagement.projectType
                let isAdd = this.microStore.state.standardManagement.isAdd
                let groupId = this.microStore.state.standardManagement.groupId || ''
                this.selectProjectParams.isAdd = isAdd
                !this.selectProjectParams.isAdd
                    ? (this.selectProjectParams.groupId = groupId)
                    : ''
                this.selectProjectParams.detectCategory = this.microStore.state.standardManagement.detectCategory
                // if (projectType == 'common') {
                console.log(this.selectProjectParams)
                getCommonValidItemList(this.selectProjectParams).then(
                    response => {
                        this.tableData = response.data.list
                        this.total = response.data.total
                        this.loading = false
                        this.Echo()
                        this.$nextTick(() => {
                            this.filterSample()
                        })
                    }
                )
                // } else if (projectType == 'take') {
                //     getTakeValidItemList(this.selectProjectParams).then(
                //         response => {
                //             this.tableData = response.data.list
                //             this.total = response.data.total
                //             this.loading = false
                //             this.$nextTick(() => {
                //                 this.filterSample()
                //             })
                //         }
                //     )
                // }
            },
            /*
             *@author: 焦政
             *@date: 2021-01-25 12:52:26
             *@description: 分页 或者查询之后依然保持已选数据的展示
             */
            localSaveShowSel() {
            },
            //查询按钮操作1
            onSubmit() {
                this.selectProjectParams.startPage = 1
                this.getTablelist()
            },
            //确定按钮操作1
            submitForm() {
                // if(this.showSelList.some(item=>item.isScene)&&this.showSelList.some(item=>!item.isScene)){
                // 	this.$message.error("不能同时包含现场和非现场的项目！");
                // 	return false;
                // }

                const selectitemData = {
                    // checkData: this.checkData,
                    checkData: this.showSelList,
                    ids: this.ids
                }
                this.$emit('handleItemName', selectitemData)
                this.showSelList = []
                this.close()
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
    .selectProject {
        ul,
        li {
            list-style: none;
            padding: 0;
        }
    }

    .searchParentName {
        display: flex;
    }

    .sel-area {
        width: 100%;
        //max-height: 200px;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 10px;
    }

    .sa-list {
        margin-right: 10px;
        margin-bottom: 10px;
    }
</style>

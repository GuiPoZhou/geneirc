<template>
    <div class="groupAdd">
        <ml-dialog ref="mlDialog" :dia-log-show="addShow" :dia-log-title="titles" dia-log-width="60%"
                   @close="close"
                   @open="open">
            <template slot="bologbody">
                <el-form
                        :model="groupParams"
                        :rules="rules"
                        ref="checkForm"
                        :inline="true"
                        label-width="88px"
                >
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="分组名称" prop="groupName">
                                <el-input
                                        v-model="groupParams.groupName"
                                        clearable
                                        size="small"
                                        :disabled="isdiadble"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="分组编号" prop="groupCode">
                                <el-input
                                        v-model="groupParams.groupCode"
                                        clearable
                                        size="small"
                                        :disabled="isdiadble"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="检测类别" prop="detectCategoryName">
                                <el-select filterable v-model="groupParams.detectCategoryName"
                                           :disabled="showType == 'edit' || isdiadble" size="small"
                                           @change="handleChange">
                                    <el-option v-for="(item,index) in typeList"
                                               :key="index"
                                               :label="item.detectName"
                                               :value="item.detectName"></el-option>
                                </el-select>
                                <!--                    <a-input-search-->
                                <!--                        v-model="groupParams.detectCategoryName"-->
                                <!--                        style="width: 200px"-->
                                <!--                        placeholder="选择类别名称"-->
                                <!--                        @focus="cateShow = true"-->
                                <!--                        @search="cateShow = true"-->
                                <!--                    />-->
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="共享模式" prop="departmentShare">
                                <el-select v-model="groupParams.departmentShare" placeholder="默认部门共享" size="small"
                                           :disabled="isdiadble"
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
                        </el-col>
                    </el-row>
                    <!--                <el-form-item label="项目名称" prop="itemNameCn">-->
                    <!--                    <a-input-search-->
                    <!--                        v-model="groupParams.itemNameCn"-->
                    <!--                        style="width: 200px"-->
                    <!--                        @search="e_showProject"-->
                    <!--                        @focus="e_showProject"-->
                    <!--                        placeholder="选择项目"-->
                    <!--                    />-->
                    <!--                </el-form-item>-->

                </el-form>
                <!-- 表格 -->
                <p>包含项目</p>
                <el-button type="primary" size="mini" @click="e_showProject" :disabled="isdiadble">绑定检测项目
                </el-button>
                <el-button type="primary" size="mini" @click="e_showCriteria" :disabled="isdiadble">指定判定标准
                </el-button>
                <el-table v-loading="loading" ref="multipleTable" :data="tableData" align="center" stripe
                          style="margin-top: 10px" :tree-props="{children: 'voListZ'}" row-key="id" border>
                    <el-table-column
                            prop="id"
                            type="index"
                            label="序号"
                            width="62px"
                    />
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
                    <!--                        >-->
                    <!--                        </el-switch>-->
                    <!--                    </template>-->
                    <!--                </el-table-column>-->
                    <!--                <el-table-column prop="stroma" label="基质"/>-->
                    <el-table-column prop="methodCode" label="方法编号" align="center"/>
                    <el-table-column prop="methodName" label="方法名称" align="center"/>
                    <el-table-column prop="standardTypeName" label="执行标准" align="center">
                        <template slot-scope="scope">
                            <div v-for="item in scope.row.childList" class="classFor">
                                <el-tooltip class="item" effect="dark"
                                            :content="echoData(item.standardType,standardTypeList)"
                                            placement="top-start">
                                    <div>{{ echoData(item.standardType, standardTypeList) }}</div>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="standardCategoryName" label="产品分类" align="center">
                        <template slot-scope="scope">
                            <div v-for="item in scope.row.childList" class="classFor">
                                <el-tooltip class="item" effect="dark" :content="item.standardCategoryName"
                                            placement="top-start">
                                    <div>{{ item.standardCategoryName }}</div>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="standardCode" label="执行标准号" align="center">
                        <template slot-scope="scope">
                            <div v-for="item in scope.row.childList" class="classFor">
                                <el-tooltip class="item" effect="dark" :content="item.standardCode"
                                            placement="top-start">
                                    <div>{{ item.standardCode }}</div>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="standardName" label="执行标准名称" align="center">
                        <template slot-scope="scope">
                            <div v-for="item in scope.row.childList" class="classFor">
                                <el-tooltip class="item" effect="dark" :content="item.standardName"
                                            placement="top-start">
                                    <div>{{ item.standardName }}</div>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="判定标准要求" align="center">
                        <template slot-scope="scope">
                            <div v-for="item in scope.row.childList" class="classFor">
                                <el-tooltip class="item" effect="dark" :content="item.limitDescStr"
                                            placement="top-start">
                                    <div>{{ item.limitDescStr }}</div>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <!--                <el-table-column prop="childMethodName" label="子法名称"/>-->
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button
                                    slot="reference"
                                    size="mini"
                                    type="text"
                                    icon="el-icon-delete"
                                    @click="handleDelete(scope.row, scope)"
                                    :disabled="isdiadble"
                            >删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="bologfooter">
                <el-button type="primary" size="small" @click="submitForm('checkForm')" :loading="isloading" center
                           v-if="showType !== 'detail'">保存
                </el-button>
                <el-button @click="close" size="small">取消</el-button>
            </template>
        </ml-dialog>
        <selectDetectName
                :visible.sync="cateShow"
                @handleParentName="changeDetectName" :onlyShowLeaf="true"
        />
        <selectProject
                v-if="projectShow"
                ref="selectProject"
                @handleItemName="getTableData"
                @close="projectShow = false"
        />
        <judgmentCriteria v-if="showCriteria" ref="criteria" @close="closeCriteria"></judgmentCriteria>
    </div>
</template>
<script>
import '@/views/core/components_use'
import 'ant-design-vue/dist/antd.css'
import {addProjectGroupList, getParentCheckList} from '@/api/standardManagement/config'
import selectDetectName from './selectDetectName'
import selectProject from './selectProject'
import judgmentCriteria from './judgmentCriteria'

export default {
    components: {
        selectDetectName,
        selectProject,
        judgmentCriteria
    },
    data() {
        return {
            isloading: false,
            // 项目分组表单数据
            groupParams: {
                groupName: null,
                groupCode: null,
                detectCategoryName: null,
                detectCategory: null, //这是id
                detailList: []
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
            standardTypeList: this.getDictionary('STANDARD_TYPE'),
            addShow: false,
            cateShow: false,
            projectShow: false,
            //表格数据
            tableData: [],
            //这里需要回头看
            loading: false,
            typeList: [],
            onlyShowLeaf: true,
            // 查询参数
            queryParams: {
                detectName: null,
            },
            showCriteria: false,
            showType: '',
            isdiadble: false,
            titles: ''
        }
    },
    methods: {
        init(editParams, type) {
            this.addShow = true
            this.showType = type
            if (type == 'detail') {
                this.isdiadble = true
                this.titles = '项目分组详情'
            } else if (type == 'edit') {
                this.titles = '修改项目分组'
                this.isdiadble = false
            } else {
                this.isdiadble = false
                this.titles = '新增项目分组'
            }
            if (editParams) {
                this.groupParams = {
                    ...editParams
                }
                localStorage.setItem('newObj', JSON.stringify(JSON.parse(JSON.stringify(this.flatten(editParams.detailList)))))
                this.microStore.commit(
                    'set_detectCategory',
                    this.groupParams.detectCategory
                )
                var dataList = this.groupParams.detailList;
                console.log(dataList)
                for (var i in dataList) {
                    var voListZ = dataList[i].voListZ;
                    if (dataList[i].childList == undefined) {
                        dataList[i].childList = []
                    }
                    for (var j in voListZ) {
                        var itemLimitlist = dataList[i].voListZ[j].itemLimitList;
                        var arr = new Array;
                        var newarr = new Array;
                        console.log(itemLimitlist)
                        for (var x in itemLimitlist) {
                            var index = arr.indexOf(itemLimitlist[x].decideStandardId);
                            console.log(index)
                            if (index < 0) {
                                arr.push(itemLimitlist[x].decideStandardId);
                                newarr.push(itemLimitlist[x]);
                            } else {
                                newarr[index].limitDescStr = newarr[index].limitDesc
                                itemLimitlist[x].limitDescStr = itemLimitlist[x].limitDesc
                                if (newarr[index].limitDescStr && itemLimitlist[x].limitDescStr) {
                                    newarr[index].limitDescStr = newarr[index].limitDescStr + ',' + itemLimitlist[x].limitDescStr
                                } else if (!newarr[index].limitDescStr && itemLimitlist[x].limitDescStr) {
                                    newarr[index].limitDescStr = itemLimitlist[x].limitDescStr
                                }
                            }
                        }
                        dataList[i].voListZ[j].childList = newarr;
                        if (dataList[i].voListZ[j].voListZ == null) {
                            dataList[i].voListZ[j].voListZ = []
                        }
                    }
                }
                this.tableData = dataList
                this.tableData.map(item => {
                    item.parentId = item.itemParentId
                    if (item.voListZ) {
                        item.voListZ.forEach((childItem) => {
                            childItem.parentId = childItem.itemParentId
                            if (!childItem.childList) {
                                this.$set(childItem, 'childList', [])
                            }
                        })
                    }
                    item.childList.map((items => {
                        items.standardCategoryName = items.productionName
                    }))
                })
                console.log('this.tableData', this.tableData)
            }
        },
        //获取检测类别列表
        getTypelist() {
            this.queryParams.onlyShowLeaf = this.onlyShowLeaf;
            getParentCheckList(this.queryParams).then(response => {
                this.typeList = response.data;
            });
        },
        handleChange(e) {
            if (this.tableData.length !== 0) {
                this.$confirm('已存在绑定的检测项目，如果切换检测分类，之前绑定的检测项目将会清除，是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableData = []
                }).catch(() => {
                });
            }
            let obj = this.typeList.find((item) => item.detectName == e)
            this.groupParams.detectCategory = obj.id
            this.microStore.commit(
                'set_detectCategory',
                this.groupParams.detectCategory
            )
        },
        /*
         *@author: 焦政
         *@date: 2021-02-05 14:29:12
         *@description: 选择检测项目
         */
        e_showProject() {
            if (!this.groupParams.detectCategory) {
                this.$message.info('请先选择检测类别')
                return
            }
            if (this.showType == 'edit') {
                this.microStore.commit('set_isadd', false)
            } else {
                this.microStore.commit('set_isadd', true)
            }
            let tableData = this.flatten(this.tableData)
            this.projectShow = true
            this.$nextTick(() => {
                this.$refs.selectProject.init(tableData)
            })
        },
        // 指定判定标准
        e_showCriteria() {
            if (this.tableData.length == 0) {
                this.$message.error('请先选择检测项目')
                return
            }
            this.showCriteria = true
            const params = {
                name: this.groupParams.detectCategoryName,
                id: this.groupParams.detectCategory
            }
            this.$nextTick(() => {
                this.$refs.criteria.init(this.tableData, params)
            })
        },
        open() {
        },
        //取消按钮操作1
        close() {
            this.addShow = false
            this.groupParams = {
                groupName: null,
                groupCode: null,
                detectCategoryName: null,
                detectCategory: null, //这是id
                detailList: []
            }
            this.tableData = []
            this.$emit('handleGroupAdd')
        },
        //保存接口操作1
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.tableData.length == 0) {
                        this.$message.info('请选择项目')
                        return
                    }
                    if (this.groupParams.id) {
                        let tableData = this.flatten(this.tableData)
                        console.log(tableData);
                        var objs = JSON.parse(localStorage.getItem('newObj'))
                        tableData.map(item => {
                            item.id = null
                            objs.map(items => {
                                if (items.itemMethod == item.itemMethod) {
                                    item.id = items.id
                                }
                            })
                        })
                        this.groupParams.detailList = tableData
                        this.groupParams.isAdd = false
                        this.isloading = true
                        this.$net('/standard/v1/itMeGroups/' + this.groupParams.id, 'put', this.groupParams).then(res => {
                            this.isloading = false
                            this.$message.success(res.msg)
                            this.$parent.getTablelist()
                            this.close()
                        }).catch(err => {
                            this.clearLoading()
                        })
                    } else {
                        let tableData = this.flatten(this.tableData)
                        tableData.map(item => {
                            item.id = null
                        })
                        this.groupParams.detailList = tableData
                        this.groupParams.isAdd = true
                        this.$net('/standard/v1/itMeGroups', 'post', this.groupParams).then(res => {
                            this.$message.success(res.msg)
                            this.isloading = false
                            this.$parent.getTablelist()
                            this.close()
                        }).catch(err => {
                            this.clearLoading()
                        })
                    }
                } else {
                    this.isloading = false
                }
            })
        },
        clearLoading() {
            setTimeout(() => {
                this.isloading = false
            }, 1000)
        },
        //val是子组件选择检测类别传递过来的数据
        changeDetectName(val) {
            console.log('子组件传递过来的数据==>', val)
            this.groupParams.detectCategoryName = val.selectDetectName
            this.groupParams.detectCategory = val.id
            this.$store.commit(
                'set_detectCategory',
                this.groupParams.detectCategory
            )
        },
        flatten(array) {
            if (array == null) {
                array = []
            }
            return [].concat(...array.map(item => [].concat(item, ...this.flatten(item.voListZ))))
        },
        //val是子组件选择项目传递过来的数据
        getTableData(val) {
            this.projectShow = false
            let dataTest = JSON.parse(JSON.stringify(val.checkData))
            dataTest.map((items) => {
                items.itemMethod = items.id
                if (!items.childList) {
                    this.$set(items, 'childList', [])
                }
            })
            // 数据格式化为父子结构
            let parentArr = []
            dataTest.map(item => {
                if (item.parentId == 0) {
                    parentArr.push(item)
                }
            })
            parentArr.forEach((item) => {
                item.voListZ = []
                dataTest.forEach((items) => {
                    if (item.id == items.parentId) {
                        item.voListZ.push(items)
                    }
                })
            })
            this.tableData = parentArr
            this.tableData.map(item => {
                if (!item.childList) {
                    this.$set(item, 'childList', [])
                }
            })
        },
        fn2(arr) {
            const res = new Map();
            return arr.filter(arr => !res.has(arr.itemNameCn) && res.set(arr.itemNameCn, arr.itemNameCn));
        },
        //删除按钮操作
        handleDelete(row, scope) {
            const itemNameCn = row.itemNameCn
            this.$confirm('确定要删除"' + itemNameCn + '"项目？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (row.parentId == 0) {
                    let findIndex = this.tableData.findIndex(function (items) {
                        return row.id === items.id
                    })
                    if (findIndex > -1) {
                        this.tableData.splice(findIndex, 1)
                        this.$message.success('删除成功')
                    }
                } else {
                    let findIndex = this.tableData.findIndex(function (items) {
                        return row.parentId === items.id
                    })
                    if (findIndex > -1) {
                        if (this.tableData[findIndex].voListZ.length == 1) {
                            this.tableData.splice(findIndex, 1)
                            this.$message.success('删除成功')
                        } else {
                            this.tableData[findIndex].voListZ.forEach((item, index) => {
                                if (item.id == row.id) {
                                    this.tableData[findIndex].voListZ.splice(index, 1)
                                    this.$message.success('删除成功')
                                }
                            })
                        }
                    }
                }
            }).catch(function () {
            })
        },
        closeCriteria(data) {
            this.showCriteria = false
            this.tableData = []
            this.tableData = data
            console.log(this.tableData)
            // data.forEach((item, index) => {
            //   this.$set(this.tableData, index, JSON.parse(JSON.stringify(item)))
            // })
            this.$nextTick(() => {
                this.$refs.multipleTable.doLayout();
            });
        }
    },
    created() {
    },
    mounted() {
        this.getTypelist()
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

.classFor {
  border-bottom: 1px solid #dfe6ec;
  width: 140%;
  margin-left: -12px;
  line-height: 30px;
}

.classFor div {
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.classFor:last-child {
  border-bottom: none
}
</style>

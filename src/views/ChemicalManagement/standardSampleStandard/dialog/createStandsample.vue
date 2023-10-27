<template>
<div>
    <ml-dialog ref="mlDialog" :dia-log-show="showlog" :dia-log-title="titles" :showEditDrag="true" @close="e_close">
        <template slot="bologbody">
            <el-divider content-position="left">基本信息</el-divider>
            <el-form
                :model="queryParams"
                ref="queryForm"
                label-width="100px"
                :rules="rules"
                style="margin-top: 15px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="标样编号" prop="sampleCode">
                            <el-input placeholder="请输入标样编号" v-model="queryParams.sampleCode" :disabled="isdisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="样品名称" prop="sample">
                            <el-select v-model="queryParams.sample" @change="handleSample" multiple filterable :disabled="isdisable">
                                <el-option v-for="(item,index) in MaterialNameList" :key="index" :label="item.dictLabel" :value="item.dictCode"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="检测类别" prop="detectType">
                            <el-select v-model="queryParams.detectType" @change="handleTypechange" :disabled="isdisable">
                                <el-option v-for="item in detectTypelist" :label="item.detectName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="委托类型" prop="entrustType">
                            <el-select v-model="queryParams.entrustType" @change="handleEntrust" :disabled="isdisable">
                                <el-option v-for="(item,index) in EntrustTypeList" :key="index" :label="item.dictLabel" :value="item.dictCode"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="标样类别" prop="sampleCategory">
                            <el-input placeholder="请输入标样类别" v-model="queryParams.sampleCategory" :disabled="isdisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="标样名称" prop="sampleClass">
                            <el-input placeholder="请输入标样名称" v-model="queryParams.sampleClass" :disabled="isdisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="检测次数" prop="detectCount">
                            <el-input-number v-model="queryParams.detectCount" :min="1" :disabled="isdisable"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10">
                        <div class="bordervolor">
                            <el-divider content-position="left">检测项目列表</el-divider>
                            <el-form :inline="true" :model="staffTemp" class="forms" label-width="100px">
                                <el-form-item label="项目名称" prop="itemNameCn">
                                    <el-input v-model="staffTemp.itemNameCn" placeholder="请输入项目名称" size="small"
                                              clearable></el-input>
                                </el-form-item>
                                <el-form-item style="margin-left: 20px;">
                                    <el-button type="primary" icon="el-icon-search" size="mini" @click="getItems">查询</el-button>
                                </el-form-item>
                            </el-form>
                            <el-table
                                :data="listData"
                                stripe
                                border
                                style="margin-top: 10px;"
                                ref="multipleTable"
                                max-height="450px"
                                :row-key="getRowKeys"
                                @selection-change="handleSelectionChange"
                                @select="handleSelection"
                                v-loading="istabLoading"
                            >
                                <el-table-column type="selection" width="55" :reserve-selection="true" v-if="showType !== 'detail'"/>
                                <el-table-column label="序号" type="index" align="center" width="50"/>
                                <el-table-column prop="itemNameCn" label="项目名称" align="center" show-overflow-tooltip/>
                                <el-table-column prop="methodName" label="方法名称" align="center" show-overflow-tooltip/>
                                <el-table-column prop="methodCode" label="方法编号" align="center" show-overflow-tooltip/>
                            </el-table>
<!--                            <pagination-->
<!--                                v-show="total > 0"-->
<!--                                :total="total"-->
<!--                                :page.sync="staffTemp.pageNum"-->
<!--                                :limit.sync="staffTemp.pageSize"-->
<!--                                @pagination="getItems"-->
<!--                            />-->
                        </div>
                    </el-col>
                    <el-col :span="14">
                        <div class="bordervolor">
                            <el-divider content-position="left">已选择项目</el-divider>
                            <el-table
                                :data="choicelistData"
                                stripe
                                border
                                style="margin-top: 10px;"
                            >
                                <el-table-column label="序号" type="index" align="center" width="50"/>
                                <el-table-column prop="detectTypeName" label="检测类别" align="center" show-overflow-tooltip/>
                                <el-table-column prop="itemNameCn" label="项目名称" align="center" show-overflow-tooltip/>
                                <el-table-column prop="methodName" label="方法名称" align="center" show-overflow-tooltip/>
                                <el-table-column prop="methodCode" label="方法编号" align="center" show-overflow-tooltip/>
                                <el-table-column prop="standard" label="标准值" align="center">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.standard" :disabled="isdisable"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center" v-if="showType !== 'detail'">
                                    <template slot-scope="scope">
                                        <el-button type="text" @click="e_del(scope.$index, scope.row)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </template>
        <template slot="bologfooter">
            <el-button size="small" type="primary" @click="handleSave" :loading="isLoading" v-if="showType !== 'detail'">保存</el-button>
            <el-button size="small" @click="e_close">取消</el-button>
        </template>
    </ml-dialog>
</div>
</template>

<script>

export default {
    name: "createStandsample",
    data () {
        return {
            showlog: false,
            isLoading: false,
            istabLoading: false,
            isdisable: false,
            titles: '',
            queryParams: {
                sampleCode: '',
                sampleName: '',
                detectType: '',
                detectTypeName: '',
                sampleCategory: '行业级标准样品',
                sampleClass: '',
                entrustType: '',
                entrustTypeName: '',
                sample: [],
                detectCount: 1
            },
            rules: {
                sampleCode: [
                    {required: true, message: "请输入标样编号", trigger: "blur"},
                ],
                sample: [
                    {required: true, message: "请选择样品名称", trigger: "change"},
                ],
                detectType: [
                    {required: true, message: "请选择检测类别", trigger: "change"},
                ],
                sampleCategory: [
                    {required: true, message: "请输入标样类别", trigger: "blur"},
                ],
                sampleClass: [
                    {required: true, message: "请输入标样名称", trigger: "blur"},
                ],
                entrustType: [
                    {required: true, message: "请选择委托类型", trigger: "change"},
                ],
            },
            staffTemp: {
                itemNameCn: '',
                startPage: 1,
                pageNum: 1,
                pageSize: 500,
                isAdd: true
            },
            listData: [],
            choicelistData: [],
            detectTypelist: [],
            EntrustTypeList: [],
            MaterialNameList: [],
            total: 0,
            dataList: [],
            newListdata: [],
            showType: '',
            idList: '',
            deepList: []
        }
    },
    methods: {
        init (type, data, idList) {
            console.log(data)
          this.showlog = true
            this.idList = idList
            this.showType = type
            // 获取委托类型
            this.getDicts("Entrust_Type").then(response => {
                this.EntrustTypeList = response.data
            })
            // 获取样品名称
            this.getDicts("Material_Name").then(response => {
                this.MaterialNameList = response.data
            })
          if (type == 'add') {
              this.titles = '新增'
          } else if (type == 'edit') {
              this.titles = '修改'
          } else if (type == 'detail') {
              this.titles = '详情'
              this.isdisable = true
          }
            if (data) {
                this.queryParams = {
                    ...data
                }
                // this.queryParams.sampleName = this.queryParams.sampleName.split(',')
                this.queryParams.sample = this.queryParams.sample.split(',')
                for (var i = 0; i < this.queryParams.sample.length; i++) {
                    this.queryParams.sample[i] = (this.queryParams.sample[i] - 0)
                }
                this.choicelistData = this.queryParams.standardItemList
                // this.choicelistData.map(item => {
                //     item.itemNameCn = item.itemName
                //     item.detectTypeName = this.queryParams.detectTypeName
                // })
                this.queryParams.standardItemList.map(item => {
                    item.itemNameCn = item.itemName
                    item.detectTypeName = this.queryParams.detectTypeName
                    this.$set(item, 'newId', item.id)
                })
            }
            this.getDetectType()
        },
        handleEntrust (e) {
            var obj = {}
            obj = this.EntrustTypeList.find(function(item){
                return item.dictCode === e
            })
            this.queryParams.entrustTypeName = obj.dictLabel
        },
        handleSample (e) {
            var datas = []
            this.MaterialNameList.map( (item) => {
                e.map(items => {
                    if (item.dictCode == items) {
                        datas.push(item.dictLabel)
                    }
                })
            })
            this.queryParams.sampleName =datas.join(',')
        },
        getRowKeys(row){
            return row.id
        },
        // 获取检测类别
        getDetectType () {
          this.$net('/standard/v1/detectCategorys/getList','get',{onlyShowLeaf: true}).then(res => {
              this.detectTypelist = res.data
              this.detectTypelist.map(item => {
                  if (item.detectName == '理化指标') {
                      this.queryParams.detectType = item.id
                      this.queryParams.detectTypeName = item.detectName
                  }
              })
              this.getItems()
          })
        },
        // 根据检测类别获取检测项目
        getItems () {
            this.istabLoading = true
            this.staffTemp.detectCategory =  this.queryParams.detectType
            this.$net('/material/v1/sample/standard/getValidItemMethodList', 'get', this.staffTemp).then(res => {
                this.istabLoading = false
                this.listData = res.data.list
                console.log(this.listData)
                this.total = res.data.total
                if (this.queryParams.standardItemList) {
                    this.listData.map(item => {
                        this.queryParams.standardItemList.map(items => {
                            if (item.id == items.itemId) {
                                console.log(item.id)
                                console.log(items.itemId)
                                this.$set(item, 'standard', items.standard)
                                this.$set(item, 'newId', items.id)
                                this.$nextTick(() => {
                                    this.$refs.multipleTable.toggleRowSelection(item, true)
                                    this.choicelistData = this.queryParams.standardItemList
                                    this.deepList = JSON.parse(JSON.stringify(this.choicelistData))
                                    console.log(this.choicelistData)
                                })
                            }
                        })
                    })
                }
            }).finally(() => {
                this.istabLoading = false
            })
        },
        handleSelectionChange (val) {
            this.choicelistData =  val
            this.choicelistData.map(item => {
                this.$set(item, 'detectTypeName', this.queryParams.detectTypeName)
            })
        },
        e_del (index, row) {
            if (row.itemId == null) {
                row.itemId = row.id
            }
            this.listData.map(item => {
                if (item.id == row.itemId) {
                    this.$refs.multipleTable.toggleRowSelection(item, false)
                }
            })
            this.choicelistData = this.choicelistData.filter((item) => item !== row);
            // var indexs = this.listData.findIndex(function(item) {
            //     return item.id === row.id
            // })
            // console.log(indexs)
            // if (indexs > -1) {
            //     this.$refs.multipleTable.toggleRowSelection(this.listData[indexs], false)
            // }
            // if (row.newId) {
            //     this.$net(`/material/v1/sample/standard/del/${row.newId}`, 'get').then(res => {
            //         this.$message.success(res.msg)
            //         // this.$net(`/material/v1/sample/standard/byId`, 'get', {idList: this.idList}).then(res => {
            //         //     this.queryParams.standardItemList = res.data
            //         //     this.queryParams.standardItemList.map(item => {
            //         //         item.itemNameCn = item.itemName
            //         //         this.$set(item, 'newId', item.id)
            //         //     })
            //         //     this.getItems()
            //         // })
            //     })
            // }
        },
        handleSelection (selection, row) {
            // this.getDetails(row)
        },
        // 获取标准值
        getDetails (row) {
            const params = {
                sampleCode: this.queryParams.sampleCode,
                sampleName: this.queryParams.sampleName,
                detectType: this.queryParams.detectType,
                detectTypeName: this.queryParams.detectTypeName,
                sampleCategory: this.queryParams.sampleCategory,
                sampleClass: this.queryParams.sampleClass,
                itemId: row.id,
            }
          this.$net(`/material/v1/sample/standard/byId`, 'get',{...params}).then(res => {
            if (res.data) {
                this.dataList.push({
                    standard: res.data.standard,
                    id: res.data.id,
                    itemId: res.data.itemId
                })
                const uniqueArray = Array.from(new Set(this.dataList.map(JSON.stringify))).map(JSON.parse);
                this.choicelistData.map(item => {
                    uniqueArray.map(items => {
                        if (item.id == items.itemId) {
                            this.$set(item, 'standard', items.standard)
                            this.$set(item, 'newId', items.id)
                        }
                    })
                })
            }
          })
        },
        handleTypechange (e) {
            let obj = {};
            obj = this.detectTypelist.find((item)=>{ // 这里的userList就是上面遍历的数据源
                return item.id === e; // 筛选出匹配数据
            });
            this.queryParams.detectTypeName = obj.detectName
        },
        handleSave () {
            this.$refs.queryForm.validate((valid) => {
                if (valid) {
                    if (this.choicelistData.length == 0) {
                        this.$message.error('请选择检测项目')
                        return
                    }
                    for (var i = 0; i < this.choicelistData.length; i++) {
                        if (!this.choicelistData[i].standard) {
                            this.$message.error('请输入标准值')
                            return;
                        }
                    }
                    this.isLoading = true
                    const params = {
                        sampleCode: this.queryParams.sampleCode,
                        sampleName: this.queryParams.sampleName,
                        detectType: this.queryParams.detectType,
                        detectTypeName: this.queryParams.detectTypeName,
                        sampleCategory: this.queryParams.sampleCategory,
                        sampleClass: this.queryParams.sampleClass,
                        sample: this.queryParams.sample.join(','),
                        entrustType: this.queryParams.entrustType,
                        entrustTypeName: this.queryParams.entrustTypeName,
                        detectCount: this.queryParams.detectCount,
                    }
                    console.log(this.choicelistData)
                    if (this.queryParams.id) {
                        params.id = this.queryParams.id
                        this.choicelistData.map(item => {
                            this.queryParams.standardItemList.map(items => {
                                if (item.id == items.itemId) {
                                    item.id = items.newId
                                    item.itemId = items.itemId
                                }
                            })
                            item.itemName = item.itemNameCn
                            if (item.itemId == null) {
                                item.itemId = item.id
                                this.$delete(item, 'id')
                            }
                        })
                        params.standardItemList = this.choicelistData
                        this.$net('/material/v1/sample/standard/update', 'put', params).then(res => {
                            this.isLoading = false
                            this.$message.success(res.msg)
                            this.$parent.getList()
                            this.e_close()
                        }).finally(() => {
                            this.isLoading = false
                        })
                    } else {
                        var list = this.choicelistData.map(item => {
                            return {
                                itemId: item.id,
                                itemName: item.itemNameCn,
                                standard: item.standard,
                                methodName: item.methodName,
                                methodCode: item.methodCode,

                            }
                        })
                        params.standardItemList = list
                        this.$net('/material/v1/sample/standard/add', 'post', params).then(res => {
                            this.isLoading = false
                            this.$message.success(res.msg)
                            this.$parent.getList()
                            this.e_close()
                        }).finally(() => {
                            this.isLoading = false
                        })
                    }

                }
            })
        },
        e_close () {
            this.$emit('close')
        }
    }
}
</script>

<style scoped>
.bordervolor {
    border: 1px solid #f1f2f3;
    border-radius: 4px;
    padding: 0 10px 10px;
}
.forms .el-form-item {
    width: auto;
    margin-right: 0;
    margin-bottom: 5px;
}
</style>
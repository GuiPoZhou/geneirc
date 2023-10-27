<template>
    <div class="materialType" :style="{ height: mainHeight + 'px' }">
        <div class="m_t_container">
            <div class="m_t_c_left">
                <!-- <el-link type="danger" style="margin-bottom: 0.8rem;" :underline="false">*修改名称、拖动排序、修改状态后及时保存</el-link> -->
                <div class="at_table">
                    <div class="at_t_top">
                        <div class="a_t_t_label">验收类型</div>
                        <div class="a_t_t_label">排序</div>
                        <div class="a_t_t_label">状态</div>
                    </div>
                    <draggable :disabled="isSaveDrag || editTypeName" filter=".forbid" style="width: 100%;"
                        :list="acceptTanceTypeList" chosen-class="chosen" :force-fallback="true" group="people"
                        animation="1000" :move="onMove" @end="onEnd">
                        <div class="at_t_list"
                            :class="[index == 0 ? 'forbid' : '', currenSelTypeId == item.id ? 'activeAttlist' : '']"
                            v-for="(item, index) in acceptTanceTypeList" :key="index" @click="e_selAccepType(item, index)">
                            <el-popover v-if="!editTypeName" placement="left-start" trigger="hover" :content="item.type">
                                <span slot="reference" class="atypeName" :data-text="item.type" v-if="!editTypeName">{{
                                    item.type }}</span>
                            </el-popover>
                            <el-input v-if="editTypeName" size="small" style="width: 6rem;margin-left: -1rem;"
                                v-model="item.type" @blur="e_saveSignleEdit(item)"></el-input>
                            <span>{{ item.sort }}</span>
                            <el-switch :disabled="index == 0" v-model="item.status" :active-value="1" :inactive-value="0"
                                active-color="#13ce66" inactive-color="#ff4949" @change="e_saveSignleEdit(item)">
                            </el-switch>
                        </div>
                    </draggable>
                </div>
                <el-row>
                    <el-col :span="24">
                        <el-button :loading="isLoading" style="width: 100%;margin-top: 2rem;" size="small" type="warning"
                            @click="editTypeName = !editTypeName">{{ editTypeName ? '取消编辑' : '编辑' }}</el-button>
                    </el-col>
                    <!-- <el-col :span="24" style="margin-top: 1rem;">
                        <el-button :loading="isLoading" style="width: 100%;" size="small" type="primary"
                            @click="e_saveTypeConfig">保存</el-button>
                    </el-col> -->
                </el-row>


            </div>
            <div class="m_t_c_right">
                <div class="m_t_c_r_center">
                    <el-row style="margin-bottom: 0.7rem;">
                        <el-col :span="24">
                            <el-button type="primary" size="mini" @click="e_addMaterial">新增验收要求</el-button>
                        </el-col>
                    </el-row>
                    <el-table ref="ElTable" :data="tableData" style="width: 100%" :height="tableHeight" border>
                        <el-table-column prop="code" label="编号" align="center">
                        </el-table-column>
                        <el-table-column prop="name" label="模板名称" align="center">
                        </el-table-column>
                        <el-table-column prop="isDefault" label="是否默认" align="center">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.isDefault" :active-value="1" :inactive-value="0"
                                    active-color="#13ce66" inactive-color="#ff4949"
                                    @change="e_changeDefaultStatus(scope.row)">
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" @click="e_editModel(scope.row)">修改</el-button>
                                <el-button type="text" @click="e_deleteSingle(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <add ref="add" v-if="showAdd" @close="showAdd = false" :inspectTypeId="currenSelTypeId" @saveReload="e_saveReload"
            @editReload="e_editReload" />
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import add from './dialog/add.vue'
export default {
    components: {
        draggable,
        add
    },
    props: {
        type: String
    },
    data() {
        return {
            showAdd: false,
            isSaveDrag: false,
            isLoading: false,
            acceptTanceTypeList: [],
            currentSelType: {},
            currenSelTypeId: 0,
            editTypeName: false,
            showTable: false,
            showchangeMaterial: false,
            deleteAllLoading: false,
            mainHeight: 0,
            tableHeight: 700,
            form: {
                pageNum: 1,
                pageSize: 50,
                materialTypeId: undefined,
                materialTypeName: undefined,
                subdivision: undefined
            },
            tableData: [],
        }
    },
    $route() {
        // 在切换页面时，延迟设置表格高度
        setTimeout(() => {
            this.getTableHeight();
        }, 2000);
    },
    created() {
        this.getMainHeight()
        window.addEventListener('resize', this.getMainHeight);
    },
    async mounted() {
        this.getMainHeight()
        window.addEventListener('resize', this.getMainHeight);
        await this.e_getList()
        this.defaultData()
    },
    methods: {
        e_changeDefaultStatus(row) {
            if (row.isDefault == 1) {
                let arr = JSON.parse(JSON.stringify(this.tableData))
                arr.forEach(item => {
                    if (item.id == row.id) {
                        item.isDefault = 0
                    }
                })
                let isDefaultList = arr.filter(item => { return item.isDefault == 1 })
                if (isDefaultList.length != 0) {
                    this.$message.error('已有模板被设为默认，请先取消后，再操作')
                    row.isDefault = 0
                    return
                }

            }
            this.$net('/equipment/v1/inspect/config/detail/edit', 'post', row).then(async re => {
                if (re.code == 200) {
                    this.$message.success('修改成功')
                    await this.e_getList()
                    this.currentDefault()
                } else {
                    row.isDefault = 0
                    this.$message.error(re.msg)
                }
            })
        },
        async e_editReload(data) {
            this.showAdd = false
            await this.e_getList()
            this.currentDefault()
        },
        async e_saveReload(data) {
            this.showAdd = false
            await this.e_getList()
            this.currentDefault()
        },
        currentDefault() {
            let info = this.acceptTanceTypeList.filter(item => {
                return item.id == this.currenSelTypeId
            })
            this.tableData = info[0].detailList
        },
        e_editModel(row) {
            console.log(row)
            this.showAdd = true
            this.$nextTick(() => {
                this.$refs.add.editInit(JSON.parse(JSON.stringify(row)))
            })
        },
        e_addMaterial() {
            this.showAdd = true
            this.$nextTick(() => {
                this.$refs.add.init()
            })
        },
        e_saveSignleEdit(item) {
            if (item.type) {
                const loading = this.$loading({
                    lock: true,
                    text: '配置生效中....',
                    spinner: 'el-icon-loading',
                    background: 'rgba(255, 255, 255, 0.7)'
                });
                this.$net('/equipment/v1/inspect/config/edit', 'post', item).then(re => {
                    loading.close();
                    if (re.code == 200) {
                        this.$message.success('配置已生效')
                    } else {
                        this.$message.error(re.msg)
                    }
                })
                this.editTypeName = false
            }
        },
        e_saveTypeConfig() {
            let nullType = this.acceptTanceTypeList.filter(item => {
                return !item.type
            })
            if (nullType.length != 0) {
                this.$message.error('类型名称不能为空')
                return
            }
            this.isLoading = true
            this.$net('/equipment/v1/inspect/config/edit', 'post', this.acceptTanceTypeList).then(re => {
                this.isLoading = false
                if (re.code == 200) {
                    this.$message.success('保存成功')
                    this.editTypeName = false
                } else {
                    this.$message.error(re.msg)
                }
            }).catch(error => {
                this.editTypeName = false
            })
        },
        e_selAccepType(item, index) {
            this.currenSelTypeId = item.id
            this.currentSelType = item
            this.tableData = this.currentSelType.detailList
        },
        onEnd(e) {
            if (e.oldIndex != e.newIndex) {
                this.acceptTanceTypeList.forEach((item, index) => {
                    item.sort = index + 1
                })
                this.isSaveDrag = true
                let arr = this.acceptTanceTypeList.slice(1)

                this.$net('/equipment/v1/inspect/config/editSort', 'post', arr).then(re => {
                    if (re.code == 200) {
                        this.$message.success('新的顺序已生效')
                        this.isSaveDrag = false
                    }
                })

            }
        },
        onMove(e) {
            if (e.relatedContext.element.sort == 1) {
                return false
            }
            return true
        },
        e_deleteSingle(row) {
            this.$confirm('确定删除选择的数据').then(() => {
                this.doDelte([row.id])
            })
        },
        doDelte(removeIds) {
            this.deleteAllLoading = true
            this.$net(`/equipment/v1/inspect/config/detail/del/${removeIds}`, 'delete').then(async re => {
                this.deleteAllLoading = false
                if (re.code == 200) {
                    this.$message.success('删除成功')
                    await this.e_getList()
                    this.currentDefault()
                } else {

                }
            })
        },


        async e_getList() {
            let re = await this.$net('/equipment/v1/inspect/config/list', 'get')
            this.acceptTanceTypeList = re.data
        },
        defaultData() {
            this.currenSelTypeId = this.acceptTanceTypeList[0].id
            this.tableData = this.acceptTanceTypeList[0].detailList
        },
        getMainHeight() {
            let browserHeight = window.innerHeight;
            this.mainHeight = browserHeight - 48
            this.getTableHeight()
        },
        getTableHeight() {
            this.$nextTick(() => {
                // 使用 $refs 来访问 ref 为 "kevin_drawer_head" 的元素
                const drawerHeadElement = this.$refs.m_t_c_r_top;
                // 获取元素的实际高度
                if (drawerHeadElement) {
                    const height = drawerHeadElement.offsetHeight; // 或者 offsetHeight
                    console.log('height', height)
                    this.tableHeight = this.mainHeight - 95
                    this.showTable = true
                }
            })

        }
    }
}
</script>

<style scoped lang="scss">
.materialType {
    width: 100%;
    overflow: hidden;


    .at_table {
        width: 100%;
        height: auto;
        border: 1px solid #EBEBEB;
        border-radius: 2px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .at_t_top {
            width: 100%;
            height: 40px;
            background-color: #F5F7FA;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;

            .a_t_t_label {
                font-size: 0.9rem;
                color: #909399;
            }
        }

        .at_t_list {
            width: 100%;
            height: 40px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
            border-bottom: 1px solid #EBEBEB;
            cursor: pointer;

            span {
                font-size: 0.9rem;
                color: #606266;
            }

            .atypeName {
                display: inline-block;
                width: 4rem;
                white-space: nowrap;
                /* 防止文本换行 */
                overflow: hidden;
                /* 隐藏超出元素宽度的部分 */
                text-overflow: ellipsis;
                position: relative;
                /* 显示省略号 */
            }

            &:last-child {
                border: none;
            }
        }

        .activeAttlist {

            background-color: #4468EE;
            color: #FFD55E;

            span {
                color: #FFD55E;
                font-weight: 600;
            }
        }
    }

    //使用的地方  不要加scoped


    .m_t_container {
        margin: 0.7rem;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        .m_t_c_left {
            width: 29.6rem;
            height: 100%;
            overflow: auto;
            background-color: #fff;
            border-radius: 10px;
            padding: 0.7rem;
            position: relative;
            // padding-top: 2.7rem;

            .m_t_c_l_top {
                width: 100%;
                height: 2rem;
                background-color: #fff;
                position: absolute;
                left: 0.7rem;
                top: 0.7rem;
            }
        }

        .m_t_c_right {
            flex: 1;
            height: 100%;
            margin-left: 0.7rem;
            overflow: hidden;
            background-color: #fff;
            border-radius: 10px;
            padding: 0.7rem;

            .m_t_c_r_top,
            .m_t_c_r_bottom {
                width: 100%;
                height: 2.5rem;
            }

            .m_t_c_r_top {
                margin-bottom: 0.7rem;
            }

            .m_t_c_r_bottom {
                margin-top: 0.7rem;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-end;
            }
        }
    }
}

/deep/.blue-background-class {
    background: #c6edff;
    background: -moz-linear-gradient(to right, #6d79ff 0%, #0E1438 100%);
    background: -webkit-linear-gradient(to right, #6d79ff 0%, #0E1438 100%);
    background: linear-gradient(to right, #6d79ff 0%, #0E1438 100%);
    background-size: 200% 100%;
    /* 更宽的背景尺寸，用于实现颜色移动效果 */
    animation: waveAnimation 5s linear infinite;
}

@keyframes waveAnimation {
    0% {
        background-position: 0 50%;
        /* 初始位置 */
    }

    50% {
        background-position: 100% 50%;
        /* 中间位置 */
    }

    100% {
        background-position: 0 50%;
        /* 返回初始位置 */
    }
}
</style> 
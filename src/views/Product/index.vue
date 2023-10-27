<template>
    <div class="materialType" :style="{ height: mainHeight + 'px' }">
        <div class="m_t_container">
            <div class="m_t_c_left">
                <div class="m_t_c_l_top">
                    <el-button size="mini" type="primary" @click="addMaterialType"
                        :loading="AddMaterialLoading">新增</el-button>
                    <el-button size="mini" type="warning" :loading="ChangeMaterialLoading" :disabled="!pointProductType"
                        @click="changeMaterialType">修改</el-button>
                    <el-button size="mini" type="danger" :disabled="!pointProductType" @click="deleteMaterivalType"
                        :DeleteMaterialLoading="DeleteMaterialLoading">删除</el-button>
                </div>
                <el-tree v-if="treeList.length > 0" :data="treeList" :props="defaultProps" @node-click="handleNodeClick"
                    :highlight-current="true" :default-expand-all="true" icon-class="el-icon-menu"></el-tree>
                <el-empty v-else description="暂未添加产品类型"></el-empty>
            </div>
            <div class="m_t_c_right">
                <el-form :model="form" ref="form" label-width="100px" :form="form" class="demo-ruleForm"
                    :label-position="KevinJson.KevinWidget.formlabelPosition || 'left'">
                    <el-row v-if="!nullKevinJson">
                        <KevinRender ref="KevinRender" :context="context" :Widget="renderWidget" :form="form" />
                    </el-row>
                    <el-empty v-else :description="`请配置【${widgetId}】低码唯一键`"></el-empty>
                </el-form>
            </div>
        </div>
        <addType ref="addType" v-if="showaddType" @close="showaddType = false" @saveReload="e_saveProductType" />
        <addProduct ref="addProduct" v-if="showaddProduct" @close="showaddProduct = false"
            @saveReload="e_saveProductReload" />
        <changeType ref="changeType" v-if="showchangeType" @close="showchangeType = false" @saveReload="e_saveChangeType" />
    </div>
</template>

<script>
import addProduct from './dialog/addProduct.vue';
import addType from './dialog/addType.vue';
import changeType from './dialog/changeType.vue';
export default {
    components: {
        addType,
        addProduct,
        changeType
    },
    props: {
        type: String
    },
    data() {
        return {
            showchangeType: false,
            showaddProduct: false,
            context: this,
            KevinJson: {
                KevinWidget: {
                    manuallyEvents: {}
                }
            },
            nullKevinJson: false,
            renderWidget: [],
            widgetId: 'product_list', // 记得对应好低码唯一键
            showaddType: false,
            showchangeMaterial: false,
            deleteAllLoading: false,
            showAddMaterial: false,
            AddMaterialLoading: false,
            DeleteMaterialLoading: false,
            ChangeMaterialLoading: false,
            mainHeight: 0,
            tableHeight: 700,
            treeList: [],
            defaultProps: {
                children: 'childList',
                label: 'nodeName'
            },
            pointProductType: null,
            pointMaterialTypeLabel: '',
            form: {
                materialTypeId: undefined,
                materialTypeName: undefined,
                subdivision: undefined,
                extData: {}
            },
            total: 0,
            tableData: [],
            mainTypeId: 0,
            selList: [],
            editProductTypeInfo: null,
            _this: null
        }
    },
    $route() {
        // 在切换页面时，延迟设置表格高度
        setTimeout(() => {
            this.getTableHeight();
        }, 2000);
    },
    created() {
        this.e_getWidgetInfo()
        this.getMainHeight()
        window.addEventListener('resize', this.getMainHeight);
    },
    mounted() {
        this._this = this.$refs.KevinRender
        this.getMainHeight()
        window.addEventListener('resize', this.getMainHeight);
        this.getMaterialTypeTree()
    },
    methods: {
        e_saveChangeType() {
            this.showchangeType = false
            this.e_getProduct()
        },
        e_saveProductReload() {
            this.showaddProduct = false
            this.e_getProduct()
        },
        e_getProduct() {
            new Function('ctx', '_this', this.KevinJson.KevinWidget.manuallyEvents.getProductByType)(this, this.$refs.KevinRender)
        },
        e_saveProductType() {
            this.showaddType = false
            this.getMaterialTypeTree()
        },
        async e_getWidgetInfo() {
            let re = await this.$net('/formLayout/v2/getFormLayoutConfig', 'get', { id: this.widgetId })
            try {
                let formDataStr = re.data.configStr
                let resultDataStr = formDataStr.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                let info = JSON.parse(resultDataStr)
                let KevinJson = info.KevinJson
                this.KevinJson = KevinJson
                this.showKevinLog = true
                this.dialogTitle = KevinJson.KevinWidget.title
                this.renderWidget = KevinJson.KevinWidget.children
                KevinJson.KevinWidget.diaLogFooterButton.forEach(dfb => {
                    if (!dfb.statusEvents || new Function('ctx', '_this', dfb.statusEvents)(this, this.$refs.KevinRender)) {
                        this.dialogFooterButtons.push(dfb)
                    }
                })
                this.fullScreen = true
                this.$nextTick(() => {
                    this.runWidgetAutoEvents(KevinJson.KevinWidget.autoEvents)
                    this.$refs.KevinRender.getWidgetServerData(this.renderWidget)
                    this.container = this.$refs.KevinRender
                })
            } catch {
                this.nullKevinJson = true
            }

        },
        runWidgetAutoEvents(autoEvents) {
            if (autoEvents) {
                for (let key in autoEvents) {
                    new Function('ctx', '_this', autoEvents[key])(this, this.$refs.KevinRender)
                }
            }
            this.form = { ...this.form }
        },



        e_saveChange() {
            this.showchangeMaterial = false
            this.e_getList()
        },
        e_changeMaterialType() {
            this.showchangeMaterial = true
            this.$nextTick(() => {
                this.$refs.changeMaterial.init(this.selList)
            })
        },
        e_showMaterival(row) {
            this.showAddMaterial = true
            this.$nextTick(() => {
                this.$refs.AddMaterial.showInit(JSON.parse(JSON.stringify(row)))
            })
        },
        e_deleteSingle(row) {
            this.$confirm('确定删除选择的数据').then(() => {

                this.doDelte([row.id])
            })
        },
        e_deletemore() {
            this.$confirm('确定删除选择的数据').then(() => {
                let ids = this.selList.map(item => { return item.id })
                this.doDelte(ids)
            })
        },
        doDelte(removeIds) {
            this.deleteAllLoading = true
            this.$net('/material/detail/remove', 'post', { removeIds }).then(re => {
                this.deleteAllLoading = false
                if (re.code == 200) {
                    this.$message.success('删除成功')
                    this.e_getList()
                } else {

                }
            })
        },

        handleSelectionChange(e) {
            this.selList = e
        },
        e_editmaterial(row) {
            this.showAddMaterial = true
            this.$nextTick(() => {
                this.$refs.AddMaterial.editInit(JSON.parse(JSON.stringify(row)))
            })
        },
        e_addMaterial() {
            this.showAddMaterial = true
            this.$nextTick(() => {
                let materialTypeId = ''
                if (this.pointMaterialType != -1) {
                    materialTypeId = this.pointMaterialType
                }
                if (this.mainTypeId == this.pointMaterialType) {
                    materialTypeId = ''
                }
                this.$refs.AddMaterial.init(materialTypeId)
            })
        },
        // 修改节点名称
        changeMaterialType() {
            this.showaddType = true
            this.$nextTick(() => {
                this.$refs.addType.editInit(this.editProductTypeInfo)
            })
        },
        // 删除节点
        deleteMaterivalType() {
            this.DeleteMaterialLoading = true
            this.$confirm(`确定删除${this.pointMaterialTypeLabel}类型？`).then(() => {
                this.$net(`/productionTypeTree/${this.pointProductType}`, 'delete',).then(re => {
                    this.DeleteMaterialLoading = false
                    if (re.code == 200) {
                        this.pointProductType = null
                        this.$message.success(`${this.pointMaterialTypeLabel}类型删除成功`)
                        this.getMaterialTypeTree()
                    }
                })
            })
        },
        // 新增物料类型
        addMaterialType() {

            this.showaddType = true
            this.$nextTick(() => {
                this.$refs.addType.init(this.pointProductType)
            })
        },
        // 点击选中物料类型节点
        handleNodeClick(data) {
            this.editProductTypeInfo = data
            this.pointProductType = data.id
            this.pointMaterialTypeLabel = data.nodeName
            new Function('ctx', '_this', this.KevinJson.KevinWidget.manuallyEvents.editProductButtonDisabled)(this, this.$refs.KevinRender)
            this.e_getProduct()
            // if (this.mainTypeId == this.pointMaterialType) {
            //     this.form.materialTypeId = this.mainTypeId
            // } else {
            //     this.form.materialTypeId = this.pointMaterialType
            // }
            // this.e_getList()
        },
        // 查询产品类型树
        getMaterialTypeTree() {
            this.$net('/productionTypeTree/selectTree', 'get').then(re => {
                this.treeList = re.data
                this.mainTypeId = this.treeList[0].id
                this.form.materialTypeId = this.mainTypeId
                // this.e_getList()
            })
        },
        e_reset() {
            this.form = {
                pageNum: 1,
                pageSize: 50,
                materialTypeId: this.mainTypeId,
                materialTypeName: undefined,
                subdivision: undefined
            }
            this.e_getList()
        },
        e_getList() {
            this.$net('/material/detail/getList', 'post', this.form).then(re => {
                this.total = re.data.total
                this.tableData = re.data.list
            })
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
                    this.tableHeight = this.mainHeight - 190
                    console.log('this.tableHeight ', this.tableHeight)
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

    //使用的地方  不要加scoped
    /deep/.el-tree-node.is-current>.el-tree-node__content {

        background-color: #4468EE !important;
        color: #FFD55E;
        font-size: 1.2rem;
        font-weight: bold;
        border-radius: 0.2rem;

    }

    .m_t_container {
        margin: 0.7rem;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        .m_t_c_left {
            width: 19.6rem;
            height: 100%;
            overflow: auto;
            background-color: #fff;
            border-radius: 10px;
            padding: 0.7rem;
            position: relative;
            padding-top: 3rem;

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
            overflow: auto;
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
</style> 
<template>
    <div class="kevin_drawer">
        <el-drawer :visible.sync="showDrawer" close-on-press-escape destroy-on-close :show-close="false" @close="e_close"
            :wrapperClosable="false" size="30%" custom-class="customerdraw" direction="ltr">
            <div slot="title" class="kevin_drawer_head" ref="kevin_drawer_head">
                <span class="drawertitle">调整类型</span>
                <div class="kevin_top_buttons">
                    <el-button size="small" type="primary" :disabled="mainTypeId == selPointId || selPointId == ''"
                        @click="e_save">保存</el-button>
                    <el-button size="small" @click="e_close">取消</el-button>
                </div>
            </div>
            <div class="kevin_drawer_body" ref="kevin_drawer_body" :style="{ height: KevinDrawerBodyHeight + 'px' }">
                <div class="tree_area">
                    <el-tree v-if="treeList.length > 0" :data="treeList" :props="defaultProps" @node-click="handleNodeClick"
                        :highlight-current="true" :default-expand-all="true" icon-class="el-icon-menu"></el-tree>
                </div>

            </div>
        </el-drawer>
    </div>
</template>

<script>
export default {
    components: {
    },
    props: {
        direction: String,
        title: String,
        size: {
            typeof: String,
            default: '100%'
        },
        stepList: Array,
        stepIndex: Number
    },
    data() {
        return {
            showDrawer: false,
            KevinDrawerBodyHeight: 0,
            treeList: [],
            defaultProps: {
                children: 'childList',
                label: 'nodeName'
            },
            mainTypeId: '',
            selPointId: '',
            detailIds: []
        }
    },
    mounted() {
        this.getBrowserHeight()
        window.addEventListener('resize', this.getBrowserHeight);
    },
    methods: {
        e_save() {
            this.$confirm('确定保存选定的产品类型').then(() => {
                this.$net(`/productionManage/updateType/${this.selPointId}`, 'post', this.detailIds).then(re => {
                    if (re.code == 200) {
                        this.$message.success('调整成功')
                        this.$emit('saveReload')
                    }
                })
            })
        },
        handleNodeClick(data) {
            this.selPointId = data.id
        },
        // 查询物料类型树
        getMaterialTypeTree() {
            this.$net('/productionTypeTree/selectTree', 'get').then(re => {
                this.treeList = re.data
                this.mainTypeId = this.treeList[0].id
            })
        },
        init(list) {
            this.detailIds = list.map(item => { return item.id })
            this.showDrawer = true
            this.getMaterialTypeTree()
        },
        getBrowserHeight() {
            let browserHeight = window.innerHeight;
            // 使用 $refs 来访问 ref 为 "kevin_drawer_head" 的元素
            const drawerHeadElement = this.$refs.kevin_drawer_head;

            // 获取元素的实际高度
            if (drawerHeadElement) {
                const height = drawerHeadElement.clientHeight; // 或者 offsetHeight
                console.log('Drawer Head Height:', height);
                this.KevinDrawerBodyHeight = browserHeight - height
            }
        },
        getDrawerHeadHeight() {

        },
        e_close() {
            this.$emit('close')
        }
    }

}
</script>

<style scoped lang="scss">
.kevin_drawer {
    width: 100%;
    height: 100%;
    overflow: hidden;

    /deep/.el-tree-node.is-current>.el-tree-node__content {

        background-color: #4468EE !important;
        color: #FFD55E;
        font-size: 1.2rem;
        font-weight: bold;
        border-radius: 0.2rem;

    }

    /deep/.el-drawer {
        padding: 0 !important;
        overflow: hidden;
    }

    /deep/.el-drawer__body {
        overflow: hidden !important;
    }

    /deep/.el-form-item__content>div {
        width: 98.5%;
    }

    /deep/.el-drawer__header {
        padding: 0 !important;
        margin: 0 !important;
    }

    .kevin_drawer_head {
        width: 100%;
        height: 3.5rem;
        background-color: #fff;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        .kevin_top_buttons {
            width: 20%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
            margin-right: 1rem;
        }
    }

    .kevin_drawer_body {
        width: 100%;
        height: 100%;
        background-color: #EBEEF5;
        overflow: hidden;
        padding: 0.5rem;

        .tree_area {
            width: 100%;
            height: 100%;
            overflow: auto;
            scrollbar-width: none;
            /* 隐藏标准滚动条（适用于Firefox） */
            -ms-overflow-style: none;

            /* 隐藏IE和Edge浏览器的滚动条 */
            &::-webkit-scrollbar {
                width: 0;
                /* 隐藏滚动条（适用于WebKit引擎，如Chrome和Safari） */
            }
        }
    }

    .drawertitle {
        font-size: 1.4rem;
        margin-left: 1rem;
        // background: linear-gradient(to right, #1267CE 33%, #D4D4D4 33%, #D4D4D4 66%, #EB8918 66%);
        // background-clip: text;
        // -webkit-background-clip: text;
        // color: transparent;
        // user-select: none;
        // -webkit-user-select: none;
        // -moz-user-select: none;
        // -ms-user-select: none;
    }
}
</style> 
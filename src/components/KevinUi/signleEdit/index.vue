<template>
    <div>
        <el-drawer :visible.sync="showDrawer" :append-to-body="true" :close-on-press-escape="false" :wrapperClosable="false"
            size="95%" :with-header="false">
            <component ref="component" :is="conponentsName" @close="close" @save="save"></component>
            <el-row v-if="showDev">
                <el-col :span="24">
                    <span>此项内容编辑实现中.....</span>
                </el-col>
                <el-col :span="24">
                    <el-button size="small" @click="close">关闭</el-button>
                </el-col>
            </el-row>
        </el-drawer>

    </div>
</template>
<script>
import buttonEdit from './components/buttonEdit.vue'
import inputEdit from './components/inputEdit.vue'
import tableEdit from './components/tableEdit.vue'
import elUploadEdit from './components/elUploadEdit.vue'
import autocompleteEdit from './components/autocompleteEdit.vue'
import selectEdit from './components/selectEdit.vue'
import radioEdit from './components/radioEdit.vue'
import elTabsEdit from './components/elTabsEdit.vue'
import paginationEdit from './components/paginationEdit.vue'
export default {
    components: {
        buttonEdit,
        inputEdit,
        tableEdit,
        elUploadEdit,
        autocompleteEdit,
        selectEdit,
        radioEdit,
        elTabsEdit,
        paginationEdit
    },
    data() {
        return {
            showDrawer: false,
            conponentsName: '',
            editTarget: '',
            showDev: false
        }
    },
    methods: {
        //target 主表单单项编辑  bulletBox 二级弹框单项编辑
        init(params, target = "listParamsList") {
            console.log('params', params)
            this.showDrawer = true
            this.editTarget = target
            this.renderSignleEdit(params)
        },
        // render signleComponents
        renderSignleEdit(params) {
            switch (params.component) {
                case 'el-button':
                    this.conponentsName = 'buttonEdit'
                    break;
                case 'el-input':
                case 'input':
                case 'textarea':
                    this.conponentsName = 'inputEdit'
                    break;
                case 'el-table':
                case 'el-table-tree':
                    this.conponentsName = 'tableEdit'
                    break;
                case 'el-upload':
                    this.conponentsName = 'elUploadEdit'
                    break;
                case 'el-autocomplete':
                    this.conponentsName = 'autocompleteEdit'
                    break;
                case 'el-select':
                case 'select':
                    this.conponentsName = 'selectEdit'
                    break;
                case 'el-radio':
                case 'radio':
                    this.conponentsName = 'radioEdit'
                    break;
                case 'el-tabs':
                    this.conponentsName = 'elTabsEdit'
                    break;
                case 'el-pagination':
                    this.conponentsName = 'paginationEdit'
                    break;
                default:
                    this.showDev = true
                    break
            }
            this.$nextTick(() => {
                this.$refs.component.appendParams(params)
            })
        },
        close() {
            this.$emit('close')
        },
        save(params) {
            this.$emit('saveSignleEdit', { params, editTarget: this.editTarget })
        }
    }
}
</script>
<style>
.code-card__body {
    display: block;
    margin: 10px;
    cursor: pointer;
    padding: 10px;
    max-height: 13rem;
    border: 1px solid #ccc;
    border-radius: 1rem;
    overflow: hidden;
}
</style>
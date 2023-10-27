<template>
    <div>
        <el-dialog title="维护产品类型" :visible.sync="dialogVisible" :close-on-click-modal="false" :modal-append-to-body="true"
            :append-to-body="true" width="25%" @close="e_close">
            <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="上级类型" prop="parentId">
                            <Treeselect :normalizer="normalizer" v-model="ruleForm.parentId" :showCount="true"
                                :options="options" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="本及目录名称" prop="nodeName"
                            :rules="[{ required: true, message: '请输入本级目录', trigger: 'blur' }]">
                            <el-input v-model="ruleForm.nodeName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="e_save">确 定</el-button>
                <el-button @click="e_close">取 消</el-button>

            </span>
        </el-dialog>
    </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
    components: {
        Treeselect
    },
    data() {
        return {
            dialogVisible: false,
            ruleForm: {},
            options: []
        }
    },

    methods: {
        getMaterialTypeTree() {
            this.$net('/productionTypeTree/selectTree', 'get').then(re => {
                console.log('this.handleTree(re.data, "id")', this.handleTree(re.data, "id"))
                this.options = this.handleTree(re.data, "id");
            })
        },
        normalizer(node) {
            if (node.childList && !node.childList.length) {
                delete node.childList;
            }
            return {
                id: node.id,
                label: node.nodeName,
                children: node.childList,
                parentId: node.parentId
            };
        },
        e_save() {
            this.$refs.ruleForm.validate(v => {
                if (v) {
                    if (this.ruleForm.id) {
                        this.$net('/productionTypeTree', 'put', this.ruleForm).then(re => {
                            if (re.code == 200) {
                                this.$message.success('修改成功')
                                this.$emit('saveReload')
                            }
                        })
                    } else {
                        this.$net('/productionTypeTree', 'post', this.ruleForm).then(re => {
                            if (re.code == 200) {
                                this.$message.success('添加成功')
                                this.$emit('saveReload')
                            }
                        })
                    }

                }
            })
        },
        init(pointProductType) {
            this.ruleForm.parentId = pointProductType
            this.dialogVisible = true
            this.getMaterialTypeTree()
        },
        editInit(data) {
            this.ruleForm = JSON.parse(JSON.stringify(data))
            this.dialogVisible = true
            this.getMaterialTypeTree()
        },
        e_close() {
            this.$emit('close')
        }
    }
}
</script>

<style></style>
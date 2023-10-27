<template>
    <el-form :model="signleParams" ref="signleParams" label-width="120px" class="demo-ruleForm">
        <el-row style="padding: 2rem;">
            <el-col :span="10">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="单项唯一值" prop="anchorPoint"
                            :rules="[{ required: true, message: '此项若为空请在json编辑器中进行维护(且唯一)', trigger: 'blur' }]">
                            <el-input v-model="signleParams.anchorPoint" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="标题" prop="label"
                            :rules="[{ required: true, message: '请填写上传组件的名称', trigger: 'blur' }]">
                            <el-input v-model="signleParams.label"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="e_save">保存</el-button>
                        <el-button size="small" @click="e_close">取消</el-button>
                    </el-form-item>
                </el-row>
            </el-col>
            <el-col :span="14">

            </el-col>
        </el-row>
    </el-form>
</template>
<script>
export default {
    data() {
        return {
            signleParams: {}
        }
    },
    methods: {
        e_save() {
            this.$refs.signleParams.validate(v => {
                if (v) {
                    this.$emit('save', this.signleParams)
                }
            })
        },
        appendParams(params) {
            console.log('params', params)
            this.signleParams = JSON.parse(JSON.stringify(params))
        },
        e_close() {
            this.$emit('close')
        }
    }
}
</script>

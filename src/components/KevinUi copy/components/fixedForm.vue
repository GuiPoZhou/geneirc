<template>
    <div class="fixedForm">
        <el-form :model="form" ref="form" label-width="210px" class="demo-ruleForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="表单项名称（label）" prop="label" :rules="[ { required: true, message: '请输入表单项名称', trigger: 'blur' }]">
                        <el-input v-model="form.label"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="表单项键名（prop）" prop="prop" :rules="[ { required: true, message: '请输入表单项键名', trigger: 'blur' }]">
                        <el-input v-model="form.prop"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="输入提示（placeholder）" prop="placeholder">
                        <el-input v-model="form.placeholder"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="表单项类型（component）" prop="component" :rules="[ { required: true, message: '请输入表单项键名', trigger: 'change' }]">
                        <el-select v-model="form.component">
                            <el-option label="输入框(el-input)" value="el-input"></el-option>
                            <el-option label="文本域(textarea)" value="textarea"></el-option>
                            <el-option label="输入框(el-autocomplete)" value="el-autocomplete"></el-option>
                            <el-option label="InputNumber计数器(el-input-number)" value="el-input-number"></el-option>
                            <el-option label="Select选择器(el-select)" value="el-select"></el-option>
                            <el-option label="DatePicker日期选择器(el-date-picker)" value="el-date-picker"></el-option>
                            <el-option label="TimePicker时间选择器(el-time-select)" value="el-time-select"></el-option>
                            <el-option label="Radio单选框(el-radio)" value="el-radio"></el-option>
                            <el-option label="Switch开关(el-switch)" value="el-switch"></el-option>
                            <el-option label="Checkbox多选框(el-checkbox)" value="el-checkbox"></el-option>
                            <el-option label="Upload 上传(el-upload)" value="el-upload"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="行内长度（el-col）" prop="col" :rules="[ { required: true, message: '请输入表单项行内长度', trigger: 'blur' }]">
                        <el-input-number v-model="form.col" :min="6" :max="24" label="el-col span的值"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="校验规则（rules）" prop="col">
                       <el-input type="textarea" v-model="rules"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Input事件脚本" prop="events.input">
                       <el-input type="textarea" v-model="form.events.input"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Change事件脚本" prop="events.change">
                       <el-input type="textarea" v-model="form.events.change"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item>
                        <el-button type="success" size="mini" @click="e_save">保存</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
export default {
    components:{},
    data(){
        return{
            form:{
                type:'fixed',
                "disabled": false,
                "anchorPoint":'',
                "isHide":false,
                col:6,
                rules:[],
                events:{},
                options:{
                    options:[]
                }
            },
            rules:"[]"
        }
    },
    methods:{
        e_save(){
            this.$refs.form.validate(e=>{
                if(e){
                    try{
                        let rules = eval(this.rules)
                        if(Object.prototype.toString.call(rules) === '[object Array]'){
                            this.form.rules = rules
                        }
                        this.form.anchorPoint = this.form.prop
                        this.$emit('confirm',this.form)
                    }catch{
                        this.$message.error('请检查校验规则脚本的语法正确性')
                    }


                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.fixedForm .el-select {
    width: 100%;
}

.fixedForm .el-input-number {
    width: 100% !important;
}
</style>

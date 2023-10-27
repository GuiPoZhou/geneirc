<template>
  <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body :destroy-on-close="true" :close-on-click-modal="false" :before-close="beforeClose" @open="openEvent">
    <el-form ref="form" :model="form" label-width="120px" :disabled="showDetail" size="small">
      <el-row>
        <el-col :span="24">
          <el-form-item label="数据源名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入数据源名称" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="数据源备注" prop="remark">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容" v-model="form.remark" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" v-if="!showDetail">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import {
    list,
    saveOrUpdate,
    remove
  } from '@/api/dataSource/config'

  export default {
    name: 'saveForm',
    components: {
    },
    computed:{
    },
    props:{
      showDetail:{
        type: Boolean,
        default: false
      },
      title:{
        type: String,
        default: '',
      },
      financialType:{
        type: Array,
        default: () => []
      },
      open:{
        type:Boolean,
        default: false,
      },
      sourceForm:{
        type: Object,
        default: {
          unit: '元'
        }
      }
    },
    created() {
    },
    data() {
      return {
        form: {
        },
        value:[],
      }
    },
    methods:{
      openEvent(){
        console.log(this.form, this.sourceForm);
        this.form = JSON.parse(JSON.stringify(this.sourceForm));
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            saveOrUpdate(this.form).then(res => {
              this.$message.success(res.data.msg);
              this.$emit('closeForm');
              this.$emit('getList');
            });
          }
        });
      },
      // 取消按钮
      cancel() {
        this.reset();
        this.$emit('closeForm');
      },
      beforeClose(){
        this.reset();
        this.$emit('closeForm');
      },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          year: undefined,
          month: undefined,
          summary: undefined,
          financialType: undefined,
          amount: 0,
          unit: '元',
          remark: undefined
        };
        this.value = [];
        this.resetForm("form");
      },
      input(url, res){
        console.log('res',res)
        this.value.push({
          response:{
            fileName: res.fileName,
            name: res.name,
            url: res.url,
            extensionName: res.extensionName,
            relativePath: res.fileName,
            absolutePath: res.url,
          }
        });
      },
    }
  }
</script>

<style scoped>

</style>

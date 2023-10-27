<template>
  <ml-dialog ref="mlDialog" :dia-log-show="dialogShow" dia-log-title="脚本判定" dia-log-width="60%"
             @close="cancelbtn">
    <template slot="bologbody">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-col :span="24">
        <el-form-item label="脚本信息">
          <el-input type="textarea" :rows="20" placeholder="请输入内容"
                    v-model="form.remark"></el-input>
        </el-form-item>
      </el-col>
    </el-form>
    </template>
    <template slot="bologfooter">
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSave" size="small">保存</el-button>
      <el-button @click="cancelbtn" size="small">返回</el-button>
    </div>
    </template>
  </ml-dialog>
</template>

<script>
  import Editor from '@/components/Editor';
  export default {
    name: "decideScript",
    components: {
      Editor
    },
    data () {
      return {
        isFullScreen: true,
        dialogShow: false,
        rules: {},
        form: {
          remark: ''
        },
        objdata: {},
        dataList: [],
        showType: ''
      }
    },
    methods: {
      e_changeBox(type) {
        this.isFullScreen = type;
      },
      init (data) {
        this.dialogShow = true
        this.objdata = data
        this.form.remark = this.objdata.decideScript
      },
      handleSave () {
        if (this.form.remark === '') {
          this.$message.error('请输入内容')
        } else {
          const obj = {
            decideSdandardId: this.objdata.decideSdandardId,
            itemId: this.objdata.itemId,
            fieldKey: 'decideScript',
            fieldValue: this.form.remark,
          }
          this.$emit('updateScript',obj)
          this.cancelbtn()
        }
      },
      cancelbtn() {
        this.$emit('close')
      },
    }
  }
</script>

<style scoped>

</style>

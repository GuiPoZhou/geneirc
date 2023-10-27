<template>
  <div class="chexkAdd">
    <el-dialog
      title="新增检测类别"
      :visible.sync="addShow"
      center
      class="elDialog"
      @open="open"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form
        :model="checkParams"
        :rules="rules"
        ref="checkForm"
        :inline="true"
        label-width="80px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="上级类别" prop="parentName">
              <el-input
                v-model="checkParams.parentName"
                clearable
                @focus="cateShow = true"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="cateShow = true"
                ></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类别名称" prop="detectName">
              <el-input v-model="checkParams.detectName" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类别简称" prop="abbreviation">
              <el-input v-model="checkParams.abbreviation" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="排序" prop="orderNum">
              <el-input v-model="checkParams.orderNum" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="备注说明" prop="remark">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                clearable
                v-model="checkParams.remark"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm()" center>保存</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </el-dialog>
    <selectDetectName
      :visible.sync="cateShow"
      @handleParentName="changeParentName"
    />
  </div>
</template>
<script>
  import {addCheckList} from "@/api/standardManagement/config";
  import selectDetectName from "./selectDetectName";

  export default {
    components: {
      selectDetectName,
    },
    data() {
      var validateAbbreviation = (rule, value, callback) => {
        if (!value) {
          callback(new Error("请输入类别简称"));
        } else if (value.search(/^[A-Za-z0-9]+$/) < 0) {
          callback(new Error("类别简称只能包含为英文字母、数字"));
          // if (this.ruleForm.checkPass !== '') {
          //   this.$refs.ruleForm.validateField('checkPass');
          // }
          callback();
        } else {
          callback();
        }
      };
      return {
        // 检测类别表单数据
        checkParams: {
          parentName: null,
          parentId: 0,
          detectName: null,
          abbreviation: null,
          remark: null,
          orderNum: null
        },
        rules: {
          detectName: [
            {required: true, message: "请输入类别名称", trigger: "blur"},
          ],
          abbreviation: [
            {required: true, validator: validateAbbreviation, trigger: "blur"},
          ],
        },
        cateShow: false,
          addShow: false,
      };
    },
    // props: {
    //   addShow: {
    //     type: Boolean,
    //     default: false,
    //   },
    // },
    methods: {
        init () {
            this.addShow = true
        },
      open() {
        //清除表单验证
        this.$nextTick(() => {
          this.$refs.checkForm.clearValidate();
        });
        // this.checkParams = {}
        this.resetForm("checkForm");
        this.checkParams.parentId = 0
      },
      //取消按钮操作
      close() {
        this.resetForm("checkForm");
        this.$emit("close");
      },
      //保存接口操作
      submitForm() {
        const saveDate = {
          parentId: this.checkParams.parentId,
          detectName: this.checkParams.detectName,
          abbreviation: this.checkParams.abbreviation,
          remark: this.checkParams.remark,
          orderNum: this.checkParams.orderNum
        };
        console.log('saveDate', saveDate)
        this.$refs["checkForm"].validate((valid) => {
          if (valid) {
            addCheckList(saveDate)
              .then(() => {
                //触发父组件传递过来的函数getTablelist()
                this.$emit("func", null);
                this.$message.success("保存成功");
                this.close();
              })
              .catch(function () {
              });
          }
        });
      },
      //更改自身的上级类别名称和父级id
      //val是子组件传递过来的数据
      changeParentName(val) {
        this.checkParams.parentName = val.selectDetectName;
        this.checkParams.parentId = val.id;
      },
    },
    computed: {},
    created() {
    },
    mounted() {
    },
  };
</script>
<style lang="less">
  .chexkAdd {
    ul,
    li {
      list-style: none;
      padding: 0;
    }
  }

  .searchParentName {
    display: flex;
  }
</style>

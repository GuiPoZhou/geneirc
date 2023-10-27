<template>
  <el-dialog
    title="编辑检测类别"
    :visible.sync="editShow"
    center
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form
      :model="checkParams"
      ref="checkForm"
      :rules="rules"
      :inline="true"
      label-width="78px"
    >
      <el-form-item label="上级类别" prop="parentName">
        <el-input
          v-model="checkParams.parentName"
          clearable
          disabled
          size="small"
        />
      </el-form-item>
      <el-form-item label="编制人员" prop="createBy">
        <el-input
          v-model="checkParams.createBy"
          clearable
          disabled
          size="small"
        />
      </el-form-item>
      <el-form-item
        label="编制时间"
        prop="createTime"
        :show-overflow-tooltip="true"
      >
        <el-input
          v-model="checkParams.createTime"
          clearable
          disabled
          size="small"
        />
        <!--          <el-time-picker-->
        <!--            v-model="checkParams.createTime"-->
        <!--            disabled-->
        <!--            :picker-options="{-->
        <!--              selectableRange: '00:00:00 - 23:00:00'-->
        <!--            }">-->
        <!--          </el-time-picker>-->
      </el-form-item>
      <el-form-item label="类别名称" prop="detectName">
        <el-input
          v-model="checkParams.detectName"
          clearable
          disabled
          size="small"
        />
      </el-form-item>
      <el-form-item label="类别简称" prop="abbreviation">
        <el-input v-model="checkParams.abbreviation" clearable size="small" />
      </el-form-item>
      <el-form-item label="排序" prop="orderNum">
        <el-input v-model="checkParams.orderNum" clearable size="small" />
      </el-form-item>
      <el-form-item label="备注说明" prop="remark">
        <el-input
          style="width: 732px"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          clearable
          v-model="checkParams.remark"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveForm" center>保存</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { editCheckList } from "@/api/standardManagement/config";
export default {
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
      rules: {
        detectName: [
          {required: true, message: "请输入类别名称", trigger: "blur"},
        ],
        abbreviation: [
          {required: true, validator: validateAbbreviation, trigger: "blur"},
        ],
      },
        editShow: false
    };
  },
  props: {
    // editShow: {
    //   type: Boolean,
    //   default: false,
    // },
    //表单数据
    checkParams: {},
    checkIds: {
      type: Number,
    },
  },
  methods: {
      init () {
        this.editShow = true
      },
    //取消按钮操作
    close() {
      this.$emit("close");
    },
    //保存按钮操作
    saveForm() {
      this.$refs.checkForm.validate(val => {
        if (val) {
          const queryParams = {
            parentId: this.checkParams.parentId,
            detectName: this.checkParams.detectName,
            abbreviation: this.checkParams.abbreviation,
            remark: this.checkParams.remark,
            type: this.checkParams.type,
            orderNum: this.checkParams.orderNum,
          };
          editCheckList(queryParams, this.checkIds).then((response) => {
            this.saveOk();
            this.close();
            // /在子组件的方法中使用传递过来的函数
            // emit意思是触发调用的意思,前面是函数名字，后面是参数
            this.$emit("func", null);
          });
        }
      })

    },
    //保存成功
    saveOk() {
      this.$message({
        showClose: true,
        message: "保存成功",
        type: "success",
      });
    },
  },
  computed: {},
  created() {},
  mounted() {},
};
</script>

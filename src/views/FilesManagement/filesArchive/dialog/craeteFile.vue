<template>
	<el-dialog :title="titles"
			   :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false"
			   :close-on-click-modal="false" width="70%" @close="cancelbtn" @open="open">
    <el-form
        :model="queryParams"
        ref="queryForm"
        :prop="queryParams"
        :rules="rules"
        label-width="120px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="文件编号" prop="fileNumber">
            <el-input placeholder="请输入文件编号" v-model="queryParams.fileNumber" :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="文件名称" prop="fileName">
            <el-input placeholder="请输入文件名称" v-model="queryParams.fileName" :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="保密等级" prop="secretLevel">
            <el-select v-model="queryParams.secretLevel" placeholder="请选择" :disabled="isdisable">
              <el-option label="一级" :value="1"></el-option>
              <el-option label="二级" :value="2"></el-option>
              <el-option label="三级" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
	  </el-row>
		<el-row>
        <el-col :span="8">
          <el-form-item label="份数" prop="amount">
            <el-input placeholder="请输入份数" v-model="queryParams.amount" oninput="value = value.replace(/[^\d]/g,'')" :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="归档编号" prop="archivesNumber">
            <el-input placeholder="请输入归档编号" v-model="queryParams.archivesNumber" :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="存放位置" prop="location" style="width: 100%">
            <el-input placeholder="请输入存放位置" v-model="queryParams.location" :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="保管期限" prop="termYear">
            <el-col :span="5">
              <el-input v-model="queryParams.termYear" :disabled="isdisable" @blur="yearBlur"></el-input>
            </el-col>
            <el-col :span="1">
              <p style="text-align: center">年</p>
            </el-col>
            <el-col :span="5">
              <el-input v-model="queryParams.termMouth" :disabled="isdisable" @blur="mouthBlur"></el-input>
            </el-col>
            <el-col :span="2">
              <p style="padding-left: 5px">月</p>
            </el-col>
            <el-col :span="3">
              <el-checkbox v-model="queryParams.checked" @change="onChange" :disabled="isdisable">永久保存</el-checkbox>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保管到期日" prop="expireDate" style="width: 100%">
            <el-input v-model="queryParams.expireDate" disabled></el-input>
<!--            <el-date-picker v-model="queryParams.expireDate" value-format="yyyy-MM-dd" type="date"-->
<!--                            placeholder="选择日期" style="width:100%" :disabled="isdisable">-->
<!--            </el-date-picker>-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="归档人" prop="archivesPeople">
            <el-input placeholder="请输入归档人" v-model="queryParams.archivesPeople" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="归档日期" prop="archivesDate" style="width: 100%">
            <el-date-picker v-model="queryParams.archivesDate" value-format="yyyy-MM-dd" type="date"
                            placeholder="选择日期" style="width:100%" :disabled="isdisable">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.remark" :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleOk" :loading="isloading" v-if="showType !== 'show'">确定</el-button>
      <el-button @click="cancelbtn">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getInfo} from '@/api/login'
  import { addArchives, editArchives } from '@/api/filesManagement/filesManagement'
  import moment from "moment";
  export default {
    name: "craeteFile",
    data() {
      return {
        isloading: false,
        dialogShow: false,
        isFullScreen: true,
        screenName: "fullScreen",
        titles: '新增',
        showType: 'add',
        activeName: 'first',
        queryParams: {
          checked: false,
          archivesPeople: '',
          archivesDate: '',
          expireDate: '',
          termYear: null,
          termMouth: null
        },
        rules: {
          fileNumber: [{required: true, message: "请输入文件编号", trigger: "blur"}],
          fileName: [{required: true, message: "请输入文件名称", trigger: "blur"}],
        },
        // 上传文件列表
        fileList: [],
        isdisable: false,
        // 授权岗位
        postlist: [],
        tableData: [],
        activities1: [],
        years: null,
        mouths: null
      }
    },
    computed: {
      getLeftWidth() {
        return this.$store.state.app.leftWidth;
      }
    },
    watch: {
      getLeftWidth() {
        let width = this.$store.state.app.leftWidth;
        if (width < 200) {
          this.screenName = "bigFullScreen";
        } else {
          this.screenName = "fullScreen";
        }
      },
      showType(val) {
        if (val == "add") {
          this.titles = "新增";
        } else if (val == "update") {
          this.titles = "修改";
        } else if (val == "show") {
          this.titles = "查看";
          this.isdisable = true
        }
      },
    },
    methods: {
      getNowTime() {
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = now.getMonth(); //得到月份
        var date = now.getDate(); //得到日期
        month = month + 1;
        month = month.toString().padStart(2, "0");
        date = date.toString().padStart(2, "0");
        var defaultDate = `${year}-${month}-${date}`;
        this.$set(this.queryParams, "archivesDate", defaultDate);
      },
      e_changeBox(type) {
        this.isFullScreen = type;
      },
      open() {
        this.getNowTime()
        this.e_getInfo()
      },
      e_getInfo() {
        getInfo().then(res => {
          this.queryParams.archivesPeople = res.user.nickName
        })
      },
      init(show, data) {
        this.dialogShow = true
        this.showType = show
        if (data) {
          this.queryParams = {
            ...data
          }
          this.$set(this.queryParams, 'termYear', data.year)
          this.$set(this.queryParams, 'termMouth', data.month)
          if (data.keepingFlag === 1) {
            this.$set(this.queryParams, 'checked', true)
          } else {
            this.$set(this.queryParams, 'checked', false)
          }
        }
      },
      // 失去焦点
      yearBlur () {
        this.years = (this.queryParams.termYear - 0) * 12
        if (this.queryParams.termYear !== null) {
          this.queryParams.checked = false
        }
        if (this.mouths !== null) {
          this.queryParams.keepingMonth = this.years + this.mouths
        } else {
          this.queryParams.keepingMonth = this.years
        }
        if (this.queryParams.checked === true) {
          this.queryParams.expireDate = ''
        } else {
          let days = moment().subtract(1, 'days').format('DD')//当前日期-1
          let lateMonth = moment().add(this.queryParams.keepingMonth,'month').format('YYYY-MM')
          this.queryParams.expireDate = lateMonth + '-' + days
        }
      },
      mouthBlur () {
        this.mouths = (this.queryParams.termMouth - 0)
        if (this.queryParams.termMouth !== null) {
          this.queryParams.checked = false
        }
        if (this.years !== null) {
          this.queryParams.keepingMonth = this.years + this.mouths
        } else {
          this.queryParams.keepingMonth = this.mouths
        }
        if (this.queryParams.checked === true) {
          this.queryParams.expireDate = ''
        } else {
          let days = moment().subtract(1, 'days').format('DD')//当前日期-1
          let lateMonth = moment().add(this.queryParams.keepingMonth,'month').format('YYYY-MM')
          this.queryParams.expireDate = lateMonth + '-' + days
        }
      },
      onChange (v) {
        if (v === true) {
          this.queryParams.expireDate = ''
          this.queryParams.termMouth = ''
          this.queryParams.termYear = ''
        }
      },
      // 确定
      handleOk () {
        this.$refs.queryForm.validate((valid) => {
          if (valid) {
            if (this.queryParams.checked === true) {
              this.queryParams.keepingFlag = 1
            } else {
              this.queryParams.keepingFlag = 0
            }
            this.isloading = true
            if (this.queryParams.id) {
              editArchives(this.queryParams).then(res => {
                if (res.code === 200) {
                  this.$message.success('修改成功')
                  this.$parent.getList()
                  this.cancelbtn()
                }
              }).finally(() => {
                this.isloading = false
              })
            } else {
              addArchives(this.queryParams).then(res => {
                if (res.code === 200) {
                  this.$message.success('新增成功')
                  this.$parent.getList()
                  this.cancelbtn()
                }
              }).finally(() => {
                this.isloading = false
              })
            }
          }
        })
      },
      cancelbtn() {
        this.$emit('close')
      }
    }
  }
</script>

<style scoped lang="less">
  /deep/ .el-dialog__body .el-col {
    margin-bottom: 0;
  }

  .processbox {
    ul {
      display: flex;

      li {
        color: #3C4353;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 30px;

        div {
          width: 16px;
          height: 16px;
          margin-right: 10px;
        }

        .nostep {
          background: #838A9D;
        }

        .finishstep {
          background: #1DD0BD;
        }

        .pendingstep {
          background: #F4BB4A;
        }
      }
    }
  }

  .timeline {
    position: relative;
    left: 250px;
  }

  .companydel {
    color: #909399;
    position: absolute;
    left: -200px;
    top: 1px;
    font-size: 12px;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .cont {
    background: #EEF6FF;
    padding: 16px 30px;

    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding-inline-start: 0;

      li {
        width: 33.3333%;
        margin-bottom: 5px;
      }
    }
  }
</style>

<template>
  <div>
    <ml-dialog ref="mlDialog" :dia-log-show="dialogindexShow" dia-log-title="多指标维护" dia-log-width="60%"
               @close="colse">
      <template slot="bologbody">
        <div class="a-c-top">
          <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            :prop="queryParams"
            label-position="top"
            label-width="80px"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="标准号" prop="standardCode" style="width: 100%" required>
                  <el-input placeholder="请输入标准号" v-model="queryParams.standardCode" disabled
                            style="width: 120%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="试验参数名称名称" prop="testItemName" style="width: 100%" required>
                  <el-input v-model="queryParams.testItemName" disabled
                            style="width: 120%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="子项名称" prop="testsubItemName" style="width: 100%" required>
                  <el-input v-model="queryParams.testsubItemName" disabled
                            style="width: 120%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="a-c-bottom">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                @click="handleAddDetails"
              >新增
              </el-button
              >
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="handleDeleteDetails"
              >删除
              </el-button>
            </el-col>
            <el-col :span="1.5"></el-col>
          </el-row>
          <el-table
            v-loading="loading"
            :data="listData"
            row-key="id"
            ref="selectTable"
            style="margin-top: 20px"
            highlight-current-row
            border
            @current-change="handleCurrentChange"
          >
            <!--        <el-table-column type="selection" width="55" align="center" />-->
            <el-table-column
              label="序号"
              align="center"
              type="index"
              width="50"
            />
            <el-table-column
              label="指标单位"
              show-overflow-tooltip
              width="120"
            >
              <template slot-scope="scope">
                <el-select v-model="scope.row.unit" filterable>
                  <el-option
                    v-for="item in unitoptions"
                    :key="item.id"
                    :label="item.unitName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="entrustCode"
              label="比较符号"
              show-overflow-tooltip
              width="120"
            >
              <template slot-scope="scope">
                <el-select v-model="scope.row.compareContent" filterable placeholder="请选择"
                           @change="compareChange(scope.row)">
                  <el-option
                    v-for="item in comparatoroptions"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="entrustCode"
              label="最小值"
              show-overflow-tooltip
              width="120"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.lowLimit" :ref="'min' + scope.$index" :disabled="scope.row.mindisadble"
                          @blur="minchange(scope.row, scope.$index)"
                          @keyup.enter.native="$event.target.blur()"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="entrustCode"
              label="最大值"
              show-overflow-tooltip
              width="120"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.upLimit" :ref="'max' + scope.$index" :disabled="scope.row.maxdisadble"
                          @keyup.enter.native="$event.target.blur()"
                          @blur="maxchange(scope.row, scope.$index)"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="指标说明"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.limitDesc" :ref="'desc' + scope.$index"
                          @keyup.enter.native="$event.target.blur()"
                          @blur="descChange(scope.row, scope.$index)"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="entrustCode"
              label="是否合格"
              width="130"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-select v-model="scope.row.decideResultFlag" filterable :ref="'flag' + scope.$index"
                            @change="decideResultFlagChange(scope.row, scope.$index)">
                  <el-option label="合格" :value="1"></el-option>
                  <el-option label="不合格" :value="0"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="entrustCode"
              label="判定结论"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.decideResult" :ref="'result' + scope.$index"
                          @keyup.enter.native="$event.target.blur()"
                          @blur="resultChange(scope.row, scope.$index)"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="entrustCode"
              label="备  注1"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" :ref="'int' + scope.$index" @keyup.enter.native="$event.target.blur()"
                          @blur="remarkChange(scope.row, scope.$index)"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="entrustCode"
              label="备  注2"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark1" :ref="'int1' + scope.$index"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="decideScript"
              label="脚本判定"
              show-overflow-tooltip
              width="200"
              align="center"
            >
              <template slot-scope="scope">
                <el-input readonly v-model="scope.row.decideScript" :disabled="scope.row.decideScriptadble"
                          @focus="handleScript(scope.row,scope.$index)"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <template slot="bologfooter">
        <el-button type="primary" @click="handleOk" size="small">确定</el-button>
        <el-button @click="colse" size="small">取消</el-button>
      </template>
    </ml-dialog>
    <!--脚本判定-->
    <decideScript
      v-if="showScript"
      @close="showScript = false"
      ref="scroptdecide"
      @updateScript="updateScript"
    ></decideScript>
  </div>
</template>

<script>
  import {saveStandardItem} from '@/api/standardManagement/standardManagement.js'
  import {listAllUnit} from "@/api/standardManagement/measuringUnit"
  import decideScript from './decideScript'

  export default {
    name: "multiindexMaintenance",
    components: {decideScript},
    data() {
      return {
        dialogindexShow: false,
        isFullScreen: true,
        screenName: "fullScreen",
        loading: false,
        showScript: false,
        listData: [],
        //选中的从表数据
        checkedDetail: [],
        comparatoroptions: ['＜', '≤', '＞', '≥', '＞，＜', '＞，≤', '≥，＜', '≥，≤', '匹配字符', '脚本判定'],
        queryParams: {
          upLimit: null,
          limitDesc: null,
          decideResult: null,
          remark: null,
        },
        objs: {},
        unitoptions: [],
        rowdata: {}
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
    },
    mounted() {
      let width = this.$store.state.app.leftWidth;
      if (width < 200) {
        this.screenName = "bigFullScreen";
      } else {
        this.screenName = "fullScreen";
      }
    },
    methods: {
      e_changeBox(type) {
        this.isFullScreen = type;
      },
      init(data, objs) {
        this.queryParams = {
          ...data
        }
        this.objs = objs
        this.listData = data.limitList
        // this.setFirstName(this.listData)
        this.listData.forEach(v => {
          v.mindisadble = true
          v.maxdisadble = true
        });
        this.listData.map(v => {
          if (v.compareContent === '＞' || v.compareContent === '≥' || v.compareContent === '匹配字符') {
            v.mindisadble = false
            v.maxdisadble = true
            v.decideScriptadble = true
          } else if (v.compareContent === '＜' || v.compareContent === '≤') {
            v.mindisadble = true
            v.maxdisadble = false
            v.decideScriptadble = true
          } else if (v.compareContent === '＞，＜' || v.compareContent === '＞，≤' || v.compareContent === '≥，＜' || v.compareContent === '≥，≤') {
            v.mindisadble = false
            v.maxdisadble = false
            v.decideScriptadble = true
          } else if (v.compareContent === '脚本判定') {
            v.mindisadble = true
            v.maxdisadble = true
            v.decideScriptadble = false
          }
        })
        this.dialogindexShow = true
        this.getunitlist()
      },
      //获取检测类别列表
      getunitlist() {
        listAllUnit().then(response => {
            this.unitoptions = response.data;
          }
        );
      },
      handleScript(row) {
        //this.$set(row, 'adjustFlag', '-');
        this.showScript = true
        this.rowdata = row
        this.$nextTick(() => {
          this.$refs.scroptdecide.init(row)
        })
      },
      // 脚本判定
      updateScript(data) {
        this.$set(this.rowdata, 'decideScript', data.fieldValue);
      },
      // 比较符号
      compareChange(v) {
        if (v.compareContent === '＞' || v.compareContent === '≥' || v.compareContent === '匹配字符') {
          v.mindisadble = false
          v.maxdisadble = true
          v.decideScriptadble = true
          v.limitDesc = null
          v.upLimit = null
          v.lowLimit = null
        } else if (v.compareContent === '＜' || v.compareContent === '≤') {
          v.mindisadble = true
          v.maxdisadble = false
          v.decideScriptadble = true
          v.limitDesc = null
          v.upLimit = null
          v.lowLimit = null
        } else if (v.compareContent === '脚本判定') {
          v.mindisadble = true
          v.maxdisadble = true
          v.decideScriptadble = false
        } else {
          v.mindisadble = false
          v.maxdisadble = false
          v.decideScriptadble = true
        }
      },
      // 最小值
      minchange(v, index) {
        console.log(3);
        this.comconechange(v)
        this.$nextTick(() => {
          if (v.maxdisadble === true) {
            console.log(1);
            this.$refs['desc' + index].focus()
          } else {
            console.log(2);
            this.$refs['max' + index].focus()
          }
        })
      },
      // 最大值
      maxchange(v, index) {
        this.comconechange(v)
        this.$refs['desc' + index].focus()
      },
      comconechange(v) {
        if (v.compareContent === '＜' || v.compareContent === '≤') {
          v.limitDesc = v.compareContent + v.upLimit
        } else if (v.compareContent === '＞' || v.compareContent === '≥') {
          v.limitDesc = v.compareContent + v.lowLimit
        } else if (v.compareContent === '＞，＜') {
          if (v.upLimit !== null) {
            if ((v.upLimit - 0) < (v.lowLimit - 0)) {
              this.$message.warning('最大值不能小于输入的最小值')
            } else {
              v.limitDesc = '>' + v.lowLimit + '且' + '＜' + v.upLimit
            }
          }
        } else if (v.compareContent === '＞，≤') {
          if (v.upLimit !== null) {
            if ((v.upLimit - 0) < (v.lowLimit - 0)) {
              this.$message.warning('最大值不能小于输入的最小值')
            } else {
              v.limitDesc = '>' + v.lowLimit + '且' + '≤' + v.upLimit
            }
          }
        } else if (v.compareContent === '≥，＜') {
          if (v.upLimit !== null) {
            if ((v.upLimit - 0) < (v.lowLimit - 0)) {
              this.$message.warning('最大值不能小于输入的最小值')
            } else {
              v.limitDesc = '≥' + v.lowLimit + '且' + '＜' + v.upLimit
            }
          }
        } else if (v.compareContent === '≥，≤') {
          if (v.upLimit !== null) {
            if ((v.upLimit - 0) < (v.lowLimit - 0)) {
              this.$message.warning('最大值不能小于输入的最小值')
            } else {
              v.limitDesc = '≥' + v.lowLimit + '且' + '≤' + v.upLimit
            }
          }
        } else if (v.compareContent === '匹配字符') {
          v.limitDesc = v.lowLimit
        }
      },
      // 指标说明
      descChange(v, index) {
        this.$refs['flag' + index].focus()
      },
      // 是否合格
      decideResultFlagChange(v, index) {
        this.$refs['result' + index].focus()
      },
      // 判定结论
      resultChange(v, index) {
        this.$refs['int' + index].focus()
      },
      // 备注1
      remarkChange(v, index) {
        this.$refs['int1' + index].focus()
      },
      // 新增
      handleAddDetails() {
        if (this.listData == undefined) {
          this.listData = new Array();
        }
        let obj = {};
        obj.upLimit = null,
          obj.lowLimit = null,
          obj.limitDesc = null,
          obj.decideResult = null,
          obj.remark = null,
          this.listData.push(obj);
      },
      handleCurrentChange(val) {
        this.checkedDetail = val
      },
      // 合并列
      // setFirstName(arr) {
      //   this.arr1 = []
      //   var obj = {},
      //     k
      //   for (var i = 0, len = arr.length; i < len; i++) {
      //     k = arr[i].unit
      //     if (obj[k]) {
      //       obj[k]++
      //     } else {
      //       obj[k] = 1
      //     }
      //   }
      //   //保存结果{el-'元素'，count-出现次数}
      //   for (var o in obj) {
      //     for (let i = 0; i < obj[o]; i++) {
      //       if (i === 0) {
      //         this.arr1.push(obj[o])
      //       } else {
      //         this.arr1.push(0)
      //       }
      //     }
      //   }
      // },
      // objectSpanMethod({row, column, rowIndex, columnIndex}) {
      //   if (columnIndex === 1) {
      //     return {
      //       rowspan: this.arr1[rowIndex],
      //       colspan: 1
      //     };
      //   }
      // },
      // 删除
      handleDeleteDetails() {
        if (this.checkedDetail.length == 0) {
          this.$alert("请先选择要删除的数据", "提示", {
            confirmButtonText: "确定",
          });
        } else {
          this.listData.splice(this.listData, 1);
        }
      },
      // 保存
      handleOk() {
          this.listData.map(item => {
              item.decideStandardItemId = this.objs.decideStandardItemId
          })
        const params = {
          decideSdandardId: this.objs.decideSdandardId,
          itemId: this.objs.itemId,
          standardProductionId: this.objs.standardProductionId,
            decideStandardItemId: this.objs.decideStandardItemId,
          limitList: this.listData,
        }
        saveStandardItem(params).then(res => {
          if (res.code === 200) {
            this.$message.success('保存成功')
            this.$parent.getdecision()
            this.colse()
          }
        })
      },
      colse() {
        this.$emit('close')
      }
    }
  }
</script>

<style scoped>

</style>

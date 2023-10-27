<template>
  <div class="groupAdd">
    <el-dialog
      :title="title"
      :visible.sync="addShow"
      width="90%"
      center
      :close-on-click-modal="false"
      @open="open"
      @close="close"
    >
      <el-form
        :model="groupParams"
        :rules="rules"
        ref="checkForm"
        :inline="true"
        label-width="88px"
      >
        <el-tabs v-model="activeName">
          <el-tab-pane label="分组信息" name="first">
            <el-form-item label="分组名称" prop="groupName">
              <el-input
                v-model="groupParams.groupName"
                clearable
                size="small"
                :disabled="showType == 2"
              />
            </el-form-item>
            <el-form-item label="检测类别" prop="detectCategoryName">
              <a-input-search
                v-model="groupParams.detectCategoryName"
                style="width: 200px"
                placeholder="选择类别名称"
                @search="cateShow = true"
                :disabled="showType == 2"
              />
            </el-form-item>
            <el-form-item label="项目名称" prop="itemNameCn">
              <a-input-search
                v-model="groupParams.itemNameCn"
                style="width: 200px"
                @search="e_showProject"
                placeholder="选择项目"
                :disabled="showType == 2"
              />
            </el-form-item>
            <el-form-item label="分组状态" prop="status">
              <el-select v-model="groupParams.status" placeholder="请选择">
                <el-option label="启用" :value="0"> </el-option>
                <el-option label="停用" :value="1"> </el-option>
              </el-select>
            </el-form-item>
            <!-- 表格 -->
            <p>包含项目</p>
            <el-table
              height="400"
              v-loading="loading"
              :data="tableData"
              align="center"
            >
              <el-table-column
                prop="id"
                type="index"
                label="序号"
                width="62px"
              />
              <el-table-column
                prop="itemNameCn"
                label="项目名称"
                :show-overflow-tooltip="true"
              />
              <el-table-column prop="isScene" label="现场检测">
                <template slot-scope="scope">
                  <el-switch
                    active-color="#5B7BFA"
                    inactive-color="#dadde5"
                    v-model="scope.row.isScene"
                    :active-value="true"
                    :inactive-value="false"
                    disabled
                  >
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column prop="stroma" label="基质" />
              <el-table-column prop="methodCode" label="方法编号" />
              <el-table-column prop="childMethodName" label="子法名称" />
              <el-table-column fixed="right" label="操作" v-if="showType != 2">
                <template slot-scope="scope">
                  <el-button
                    slot="reference"
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row, scope)"
                    >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="采样要求" name="second">
            <el-button
              type="primary"
              size="mini"
              style="margin-bottom: 5px"
              @click="e_appendClaim"
              v-if="showType != 2"
              >增加要求
            </el-button>
            <el-table :data="pickrequireList" style="width: 100%">
              <el-table-column prop="container" label="采样容器">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.container"
                    :disabled="showType == 2"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="equipmentName"
                label="采样仪器"
                width="180"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.equipmentName" readonly>
                    <el-button
                      slot="append"
                      size="mini"
                      @click="e_selInstrument(scope.$index, scope.row)"
                      :disabled="showType == 2"
                      >选择
                    </el-button>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="sampleNum" label="采样样品数量">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.sampleNum"
                    :disabled="showType == 2"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="sampleCodeNum" label="样品编码数量">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.sampleCodeNum"
                    :disabled="showType == 2"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="storageConditions" label="保存条件">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.storageConditions"
                    multiple
                    placeholder="请选择"
                    :disabled="showType == 2"
                    @change="e_selStorage"
                  >
                    <el-option
                      v-for="item in storageData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="preservatives" label="保存剂">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.preservatives"
                    multiple
                    placeholder="请选择"
                    :disabled="showType == 2"
                  >
                    <el-option
                      v-for="item in preservativeData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="preservativesRemark"
                label="保存剂用量说明"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.preservativesRemark"
                    :disabled="showType == 2"
                  ></el-input>
                </template>
              </el-table-column>

              <el-table-column label="样品有效期" width="180">
                <template slot-scope="scope">
                  <el-row>
                    <el-col :span="12">
                      <el-input
                        v-model="scope.row.validTime"
                        :disabled="showType == 2"
                      ></el-input>
                    </el-col>
                    <el-col :span="12">
                      <el-select v-model="scope.row.validTimeUnit" :disabled="showType == 2">
                        <el-option label="D" value="D"> </el-option>
                        <el-option label="H" value="H"> </el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column label="全量检测" width="100">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.isTotal" :disabled="showType == 2">
                    <el-option label="是" :value="1"> </el-option>
                    <el-option label="否" :value="0"> </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="编码计算方式">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.codeType" :disabled="showType == 2">
                    <el-option v-for="(v,i) in $store.state.BeiYuan.codeCalculateTypeList" :key="i" :label="v.dictLabel" :value="Number(v.dictValue)"> </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="isDefault" label="默认要求" width="100">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.isDefault"
                    active-color="#13ce66"
                    inactive-color="#e8e8e8"
                    :active-value="1"
                    :inactive-value="0"
                    :disabled="showType == 2"
                  >
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" v-if="showType != 2">
                <template slot-scope="scope">
                  <el-button type="text" @click="e_deleteCeaim(scope.$index)"
                    >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitForm('checkForm')"
          v-if="showType != 2"
          center
          >保存
        </el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </el-dialog>
    <selectDetectName
      :visible.sync="cateShow"
      @handleParentName="changeDetectName"
      :onlyShowLeaf="true"
    />
    <selectProject :visible.sync="projectShow" @handleItemName="getTableData" />
    <!-- 仪器选择 -->
    <Instrument
      v-if="showInstrument"
      ref="Instrument"
      @close="showInstrument = false"
      @confrimInstrument="e_confirmSelInstrument"
      :selData="selData"
    />
  </div>
</template>
<script>
// import "@/views/core/components_use";
// import 'ant-design-vue/dist/antd.css';
import {
  addSamplingProjectGroupList,
  editSamplingProjectGroupList,
  getDictionaryData,
} from "@/api/standardManagement/config";
import selectDetectName from "./selectDetectName";
import selectProject from "./selectProject";
import { getDicts } from "@/api/system/dict/data";
import Instrument from "./instrument.vue";

export default {
  components: {
    selectDetectName,
    selectProject,
    Instrument,
  },
  watch: {
    showType(val) {
      if (val == 0) {
        this.title = "新增采样组瓶";
      } else if (val == 1) {
        this.title = "修改采样组瓶";
      } else if (val == 2) {
        this.title = "查看采样组瓶";
      }
    },
  },
  data() {
    return {
      selData: [], //点击选择设备 回显当前已选设备ID 进行默认勾选
      title: "新增采样组瓶",
      showType: 0, //0新增  1编辑
      showInstrument: false,
      pickrequireList: [],
      activeName: "first",
      // 采样项目分组表单数据
      groupParams: {
        groupName: null,
        detectCategoryName: null,
        detectCategory: null, //这是id
        detailList: [],
        status: 0,
      },
      rules: {
        groupName: [
          {
            required: true,
            message: "请输入分组名称",
            trigger: "blur",
          },
        ],
        detectCategoryName: [
          {
            required: true,
            message: "请输入检测类别",
            trigger: "blur",
          },
        ],
        // itemNameCn: [
        // 	{
        // 		required: true,
        // 		message: "请输入项目名称",
        // 		trigger: "blur"
        // 	}
        // ],
        preservativeList: [
          { required: true, message: "请输入保存剂", trigger: "change" },
        ],
        storageList: [
          {
            required: true,
            message: "请输入存储条件",
            trigger: "change",
          },
        ],
      },
      //保存剂数据
      preservativeData: [],
      //input输入框里面选择的保存剂
      preservativeDataUpdata: [],
      //存储条件数据
      storageData: [],
      //input输入框里面选择的存储条件
      storageDataUpdata: [],
      cateShow: false,
      projectShow: false,
      //表格数据
      tableData: [],
      //这里需要回头看
      loading: false,
      preservative: "preservative",
      storage: "storage",
      currentTableIndex: 0,
    };
  },

  props: {
    addShow: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    /*
     *@author: 焦政
     *@date: 2021-12-16 10:57:52
     *@description:选择保存条件
     */
    e_selStorage(e) {
      console.log(e);
    },
    /*
     *@author: 焦政
     *@date: 2021-07-21 14:37:53
     *@description:确定选择的仪器
     */
    e_confirmSelInstrument(instrumentList, equipmentName) {
      this.showInstrument = false;
      let obj = this.pickrequireList[this.currentTableIndex];
      obj.equipmentName = equipmentName;
      obj.equipmentList = [];
      instrumentList.map((item) => {
        let params = {
          equipmentId: item.id,
          equipmentName: item.equipmentName,
          equipmentModel: item.equipmentModel,
          equipmentClass: item.equipmentClass,
          equipmentNumber: item.equipmentNumber,
        };
        obj.equipmentList.push(params);
      });
      this.$set(this.pickrequireList, this.currentTableIndex, obj);
      console.log("this.pickrequireList", this.pickrequireList);
    },
    /*
     *@author: 焦政
     *@date: 2021-07-21 14:00:12
     *@description:选择采样仪器
     */
    e_selInstrument(index, row) {
      console.log("row", row);
      this.selData = row.equipmentList || []; //赋值当前已选设备
      this.currentTableIndex = index;
      this.showInstrument = true;
      this.$nextTick(() => {
        this.$refs.Instrument.init();
      });
    },
    /*
     *@author: 焦政
     *@date: 2021-07-20 16:44:07
     *@description:删除
     */
    e_deleteCeaim(index) {
      this.$confirm("确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.pickrequireList.splice(index, 1);
      });
    },
    /*
     *@author: 焦政
     *@date: 2021-07-20 16:10:47
     *@description:新增采样要求
     */
    e_appendClaim() {
      this.pickrequireList.push({
          sampleCodeNum:1,
          sampleNum:1
      });
    },
    /*
     *@author: 焦政
     *@date: 2021-02-05 14:29:12
     *@description: 选择检测项目
     */
    e_showProject() {
      if (!this.groupParams.detectCategory) {
        this.$message.info("请先选择检测类别");
        return;
      }
      this.$store.commit("set_isadd", true);
      this.projectShow = true;
    },
    /**
     * @author 焦政
     * @Description: 选择储存条件
     * @date 2021/3/5
     */
    e_selstorageData() {
      if (this.storageDataUpdata.length == 0) {
        this.groupParams.storageList = [];
      } else {
        this.storageDataUpdata.map((item) => {
          this.groupParams.storageList.push({
            storage: item.key,
            storageLabel: item.label,
          });
        });
      }
    },
    //取消按钮操作1
    close() {
      this.$emit("update:addShow", false);
      this.$emit("close");
    },
    open() {
      this.groupParams = {
        groupName: null,
        detectCategoryName: null,
        detectCategory: null, //这是id
        detailList: [],
        preservativeList: [],
        storageList: [],
      };
      this.preservativeDataUpdata = [];
      this.storageDataUpdata = [];
      this.tableData = [];
    },
    //保存接口操作
    submitForm(formName) {
      if (
        this.tableData.some((item) => item.isScene) &&
        this.tableData.some((item) => !item.isScene)
      ) {
        this.$message.error("不能同时包含现场和非现场的项目！");
        return false;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.tableData.length == 0) {
            this.$message.error("请选择检测项目");
            return;
          }
          this.groupParams.preservativeList = [];
          this.groupParams.storageList = [];
          this.preservativeDataUpdata.map((item) => {
            this.groupParams.preservativeList.push({
              preservative: item.key,
              preservativeLabel: item.label,
            });
          });
          this.storageDataUpdata.map((item) => {
            this.groupParams.storageList.push({
              storage: item.key,
              storageLabel: item.label,
            });
          });
          let arr = JSON.parse(JSON.stringify(this.pickrequireList));
          arr.forEach((item) => {
            item.storageConditions = item.storageConditions.join(",");
            item.preservatives = item.preservatives.join(",");
            item.isDefault = Number(item.isDefault);
          });
          console.log("arr", arr);
          this.groupParams.pickrequireList = arr;
          console.log("this.groupParams", this.groupParams);

          if (this.showType == 0) {
            console.log(1111);
            console.log("this.groupParams", this.groupParams);
            addSamplingProjectGroupList(this.groupParams)
              .then(() => {
                //触发父组件传递过来的函数getTablelist()
                this.$emit("func", null);
                this.$message.success("保存成功");
                this.close();
              })
              .catch(function () {});
          } else {
            editSamplingProjectGroupList(this.groupParams, this.groupParams.id)
              .then(() => {
                //触发父组件传递过来的函数getTablelist()
                this.$emit("func", null);
                this.$message.success("保存成功");
                this.close();
              })
              .catch(function () {});
          }
        }
      });
    },
    //这个是下拉选择用到的
    getPopupContainer(triggerNode) {
      return triggerNode.parentNode;
    },
    //获取字典数据中的保存剂1
    getPreservative() {
      console.log("保存剂===>", this.preservative);
      getDictionaryData({ dictType: "preservative" }).then((response) => {
        const temp = response.data;
        console.log("temp", temp);
        temp.map((item) => {
          this.preservativeData.push({
            value: item.dictCode,
            label: item.dictLabel,
          });
        });
        this.preservativeData.push({
          value: 0,
          label: " ",
        });
        console.log("请求过来的保存剂数据===>", this.preservativeData);
      });
    },
    //获取字典数据中的存储条件1
    getStorage() {
      console.log("存储条件===>", this.storage);
      getDictionaryData({ dictType: "storage" }).then((response) => {
        const temp = response.data;
        temp.map((item) => {
          this.storageData.push({
            value: item.dictCode,
            label: item.dictLabel,
          });
        });
        this.storageData.push({
          value: 0,
          label: " ",
        });
        console.log("请求过来的存储条件===>", this.storageData);
      });
    },
    //val是子组件选择检测类别传递过来的数据1
    changeDetectName(val) {
      console.log("子组件传递过来的数据==>", val);
      this.groupParams.detectCategoryName = val.selectDetectName;
      this.groupParams.detectCategory = val.id;
      this.$store.commit("set_detectCategory", this.groupParams.detectCategory);
    },
    //val是子组件选择项目传递过来的数据1
    getTableData(val) {
      console.log("子组件选择项目传递过来的数据==>", val);
      this.tableData = val.checkData;
      val.checkData.map((data) => {
        this.groupParams.detailList.push({
          itemMethod: data.id,
        });
      });
    },
    //删除按钮操作1
    handleDelete(row, scope) {
      console.log("要删除的行数据==>", row);
      console.log(scope.$index);
      const index = scope.$index;
      const itemNameCn = row.itemNameCn;
      const groupId = row.id;
      this.$confirm('确定要删除"' + itemNameCn + '"项目？', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tableData.splice(index, 1);
          this.groupParams.detailList.splice(index, 1);
          this.$message.success("删除成功");
          console.log(this.groupParams);
        })
        .catch(function () {});
    },
    e_addShow() {
      this.showType = 0;
    },
    /*
     *@author: 焦政
     *@date: 2021-08-31 13:18:40
     *@description:编辑回显
     */
    editShow(info) {
      this.showType = 1;
      console.log("info", info);
      this.groupParams = info;
      this.tableData = this.groupParams.detailList;
      this.pickrequireList = this.groupParams.pickrequireList;
      this.designBackData();
    },
    infoShow(info) {
      this.showType = 2;
      console.log("info", info);
      this.groupParams = info;
      this.tableData = this.groupParams.detailList;
      this.pickrequireList = this.groupParams.pickrequireList;
      console.log("this.pickrequireList", this.pickrequireList);
      this.designBackData();
    },
    /*
     *@author: 焦政
     *@date: 2021-10-21 09:41:54
     *@description:处理回显
     */
    designBackData() {
      this.pickrequireList.map((item) => {
        if (item.equipmentList !== null) {
          let equipmentNameList = item.equipmentList.map((item) => {
            return item.equipmentName;
          });
          item.equipmentName = equipmentNameList.join(",");
        }
        let preservativesList = item.preservatives.split(",");
        let arr1 = preservativesList.map((item) => {
          return Number(item);
        });
        item.preservatives = arr1;
        let storageConditionsList = item.storageConditions.split(",");
        let arr2 = storageConditionsList.map((item) => {
          return Number(item);
        });
        item.storageConditions = arr2;
      });
    },
  },
  computed: {},
  created() {
    //获取保存剂数据
    this.getPreservative();
    //获取存储条件数据
    this.getStorage();
  },
  mounted() {},
};
</script>
<style lang="less">
.groupAdd {
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

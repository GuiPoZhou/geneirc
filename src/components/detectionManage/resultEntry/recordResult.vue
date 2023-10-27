<template>
  <div class="receiveTask">
    <el-dialog class="elDialog" center width="70%" :visible.sync="recordResultShow" :fullscreen="isFullScreen"
      :modal-append-to-body="false" @open="open" ref="recordResultDialog" :show-close="false">
      <!-- 标题 -->
      <div slot="title" class="dialog-title">
        <span class="topTilte">{{ title }}</span>
        <div class="topRight">
          <!-- 最小化 -->
          <i class="el-icon-minus rightIcon" v-if="isFullScreen" @click="e_changeBox(false)"></i>
          <!-- 最大化 -->
          <i class="el-icon-full-screen rightIcon" v-if="!isFullScreen" @click="e_changeBox(true)"></i>
          <!-- 关闭 -->
          <i class="el-icon-close rightIcon" @click="close"></i>
        </div>
      </div>
      <!-- 搜索 -->
      <el-form ref="queryForm" :inline="true" :model="queryData" @submit.native.prevent>
        <el-row>
          <el-col :span="4">
            <el-form-item label="项目名称">
              <el-input @keyup.enter.native="handleQuery" @clear="handleQuery" v-model="queryData.itemName" clearable
                size="small" placeholder="请输入搜索">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="样品编码">
              <el-input @keyup.enter.native="handleQuery" @clear="handleQuery" v-model="queryData.sampleCode" clearable
                placeholder="请输入搜索" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="检测类别">
              <el-input @clear="handleQuery" v-model="queryData.detectType" clearable @focus="cateShow = true"
                size="small">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="cateShow = true"></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="方法编码">
              <el-input @keyup.enter.native="handleQuery" @clear="handleQuery" v-model="queryData.itemCode" clearable
                placeholder="请输入搜索" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="批次编码">
              <el-input @keyup.enter.native="handleQuery" @clear="handleQuery" v-model="queryData.batchCode" clearable
                size="small" placeholder="请输入搜索">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <!-- 统一样式 - 查询区域 按钮 -->
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索
              </el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 按钮 -->
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleImport">
        检测结果导入
      </el-button>
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" :disabled="multiple">
        添加仪器
      </el-button>
      <el-button type="primary" icon="el-icon-s-unfold" size="mini" @click="e_entryAll">
        批量录入原始记录
      </el-button>
      <!-- <el-button
              type="primary"
              icon="el-icon-refresh"
              size="mini"
              @click="getResultList"
            >
              刷新列表
            </el-button> -->
      <el-button type="primary" icon="el-icon-upload" @click="handleUploadFile" size="mini" :disabled="multiple">
        上传记录
      </el-button>
      <!-- 废弃按钮 -->
      <el-button type="primary" icon="el-icon-upload" size="mini" @click="discardBtn" :disabled="multiple">
        废弃样品
      </el-button>
      <!-- 输入框 -->
      <el-dialog title="批量录入方法检出限" :visible="falg && disCode === 'detectLimit'" :modal-append-to-body="false"
        :append-to-body="true" width="30%" center :close-on-press-escape="false" @close="closeInput"
        :close-on-click-modal="false">
        <el-form>
          <el-form-item label="">
            <el-input class="" v-model="inputValue"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="primary" @click="changeDetectLimit()">确定
          </el-button>
          <el-button @click="closeInput()">取消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="批量录入检测结果" :visible="falg2 && disCode === 'detectResultName'" :modal-append-to-body="false"
        :append-to-body="true" width="30%" center :close-on-press-escape="false" @close="closeInput"
        :close-on-click-modal="false">
        <el-form>
          <el-form-item label="">
            <el-input class="" v-model="inputValue2"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="primary" @click="changeDetectResultName()">确定
          </el-button>
          <el-button @click="closeInput()">取消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="批量录入定量限制" :visible="falg3 && disCode === 'rationLimit'" :modal-append-to-body="false"
        :append-to-body="true" width="30%" center :close-on-press-escape="false" @close="closeInput"
        :close-on-click-modal="false">
        <el-form>
          <el-form-item>
            <el-input class="" v-model="inputValue3"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="primary" @click="changeRationLimit()">确定
          </el-button>
          <el-button @click="closeInput()">取消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="批量录入判定结论" :visible="falg4 && disCode === 'conclusion'" :modal-append-to-body="false"
        :append-to-body="true" width="30%" center :close-on-press-escape="false" @close="closeInput"
        :close-on-click-modal="false">
        <el-form>
          <el-form-item>
            <el-input v-model="inputValue4"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="primary" @click="changeConclusion()">确定</el-button>
          <el-button @click="closeInput()">取消</el-button>
        </div>
      </el-dialog>

      <el-table :data="tableData" v-loading="loading" @selection-change="handleSelectionChange" ref="multipleTable"
        :row-class-name="tableRowClassName" @cell-click="tabClick" style="margin-top: 20px; width: 100%" border
        fixed="left" :max-height="tableWidth">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="entrustCode" label="委托编号" :show-overflow-tooltip="true" />
        <el-table-column prop="detectTypeStr" label="检测类别" />
        <el-table-column prop="sampleCode" label="样品编码" />
        <el-table-column prop="itemName" label="检测项目名称" :show-overflow-tooltip="true" />
        <el-table-column prop="editHisCount" label="子项目">
          <template slot-scope="scope">
            <a @click="e_getSubItemList(scope.row)" style="color: #1890ff">{{
                scope.row.subItemNum
            }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="editHisCount" label="修改记录">
          <template slot-scope="scope">
            <a @click="getEditHisCount(scope.row)" style="color: #1890ff">{{
                scope.row.editHisCount
            }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="instrumentCount" label="检测仪器">
          <template slot-scope="scope">
            <a @click="getInstrumentCount(scope.row)" style="color: #1890ff">{{
                scope.row.instrumentCount
            }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="itemFileList" label="检测记录">
          <template slot-scope="scope">
            <a @click="getFile(scope.row)" style="color: #1890ff">{{
                scope.row.itemFileList ? scope.row.itemFileList.length : 0
            }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="detectResult" label="检测结果">
          <template #header>
            <div>检测结果</div>
            <el-input v-model="inputValue2" :disabled="ids.length == 0" />
          </template>
          <template slot-scope="scope">
            <span v-if="
              scope.row.index === tabClickIndex &&
              tabClickLabel === '检测结果'
            ">
              <el-input v-model="scope.row.detectResult" maxlength="300" placeholder="请输入" size="mini"
                @focus="e_entry(scope.row)" @blur="inputBlurResult(scope.row, scope.$index)" />
            </span>
            <span v-else>{{ scope.row.detectResult }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="detectResultUnitStr" label="结果单位" :render-header="renderHeaderDetectUnit">
          <template slot-scope="scope">
            <span v-if="
              scope.row.index === tabClickIndex &&
              tabClickLabel === '结果单位'
            ">
              <el-input v-model="scope.row.detectResultUnitStr" maxlength="300" size="mini" readonly
                @focus="getResultUnitOnly(scope.row, scope.$index)" />
              <!--							<div @click="getResultUnitOnly(scope.row, scope.$index)">-->
              <!--								{{ scope.row.detectResultUnitStr }}-->
              <!--							</div>-->
            </span>
            <span v-else>{{ scope.row.detectResultUnitStr }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="itemCode" label="方法编号">
          <template scope="scope">
            <div style="text-decoration: underline; cursor: pointer" @click="getMethod(scope.row)">
              {{ scope.row.itemCode }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="subname" label="子法名称" />
        <el-table-column prop="stroma" label="基质" />
        <el-table-column prop="customerAppoint" label="指定方法">
          <template slot-scope="scope">
            <span v-if="scope.row.customerAppoint === 0">否</span>
            <span v-else>是</span>
          </template>
        </el-table-column>
        <el-table-column prop="detectLimit" label="方法检出限">
          <template #header>
            <div>方法检出限</div>
            <el-input v-model="inputValue" :disabled="ids.length == 0" />
          </template>
          <template slot-scope="scope">
            <span v-if="
              scope.row.index === tabClickIndex &&
              tabClickLabel === '方法检出限'
            ">
              <el-input v-model="scope.row.detectLimit" maxlength="300" placeholder="请输入" size="mini"
                @blur="inputBlur" />
            </span>
            <span v-else>{{ scope.row.detectLimit }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="detectUnitStr" label="检出限单位" :render-header="renderHeaderDetectUnit">
          <template slot-scope="scope">
            <span v-if="
              scope.row.index === tabClickIndex &&
              tabClickLabel === '检出限单位'
            ">
              <el-input v-model="scope.row.detectUnitStr" maxlength="300" size="mini" readonly
                @focus="getUnitOnly(scope.row)" />
              <!--							<div @click="getUnitOnly(scope.row)">-->
              <!--								{{ scope.row.detectUnitStr }}-->
              <!--							</div>-->
            </span>
            <span v-else>{{ scope.row.detectUnitStr }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="rationLimit" label="定量限值">
          <template #header>
            <div>定量限值</div>
            <el-input v-model="inputValue3" :disabled="ids.length == 0" />
          </template>
          <template slot-scope="scope">
            <span v-if="
              scope.row.index === tabClickIndex &&
              tabClickLabel === '定量限值'
            ">
              <el-input v-model="scope.row.rationLimit" maxlength="300" placeholder="请输入" size="mini"
                @focus="e_entry(scope.row)" @blur="inputBlur" />
            </span>
            <span v-else>{{ scope.row.rationLimit }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="standardName" label="执行标准" />
        <el-table-column prop="limitDesc" label="判定指标" />
        <el-table-column prop="conclusion" label="判定结论">
          <template #header>
            <div>判定结论</div>
            <el-input v-model="inputValue4" :disabled="ids.length == 0" />
          </template>
          <template slot-scope="scope">
            <span v-if="
              scope.row.index === tabClickIndex &&
              tabClickLabel === '判定结论'
            ">
              <el-input v-model="scope.row.conclusion" maxlength="300" placeholder="请输入" size="mini"
                @focus="e_entry(scope.row)" @blur="inputBlur" />
            </span>
            <span v-else>{{ scope.row.conclusion }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination v-show="total > 0" :total="total" :pageSizes="pageSizes" :page.sync="queryData.pageNum"
        :limit.sync="queryData.pageSize" @pagination="getResultList" />
      <div slot="footer">
        <el-button :loading="isLoading" type="primary" @click="submitSave" center :disabled="multiple"
          v-show="this.distinguishCode !== 'updateSampleRecordResult'">
          保存
        </el-button>
        <el-button :loading="isLoading" type="primary" @click="submitForm" center :disabled="multiple">
          提交
        </el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </el-dialog>

    <instrument :instrumentShow.sync="instrumentShow" :instrumentIds="instrumentIds" :instrumentIdOne="instrumentIdOne"
      :instrumentType="instrumentType" :idOne="idOne" @changeInsIds="changeInsIds" @cancel="instrumentShow = false" />
    <selectMethod :selectMethodShow.sync="selectMethodShow" :parmas="parmas" @changeItemCode="changeItemCode" />
    <selectUnit :visible.sync="selectUnitShow" @backfill="changeUnit" />
    <countHis :countHisShow.sync="countHisShow" :resultId="resultId" />
    <upload :visible.sync="upload.open" :upload="upload" ref="upload" @importTemplate="importTemplate"
      @afterImport="getResultList" />
    <uploadFile v-if="uploadFile.open" :visible.sync="uploadFile.open" :upload="uploadFile" ref="uploadFile"
      @afterFileUpload="afterFileUpload" />
    <!--结果录入-->
    <RecordEntryS v-if="recordEntyShow" @close="e_close" ref="recordEntrys" />
    <fileList :showFileOpen.sync="showFileOpen" :tableData.sync="fileList" @removeFile="removeFile"
      @cancel="showFileOpen = false" />
    <ELNIFrame ref="ELNIFrame" v-if="showELNIFrame" @cancel="e_cancelELN" />

    <!--子项目详情 -->
    <SubItem ref="SubItem" v-if="showSubItem" @cancel="e_closeSubItem" />
    <detectType :visible.sync="cateShow" @handleClick="changeDetectName" />
  </div>
</template>
<script>
import SubItem from "./subItem";

import ELNIFrame from "./elnIFrame";
import {
  getRecordResultList,
  saveResult,
  getResultTemplate,
  deleteItemFile,
} from "@/api/detectionManage/resultEntry/noRecord";
import { getContext } from "@/api/system/context";
import instrument from "./instrument";
import upload from "@/components/common/upload";
import uploadFile from "@/components/common/uploadFile";
import fileList from "./fileList";
import selectMethod from "./selectMethod";
import countHis from "./countHis";
import selectUnit from "@/components/common/selectUnit";
import { getSampleListDetail } from "@/api/detectionManage/resultEntry/completed";
import RecordEntryS from "@/components/detectionManage/resultEntry/recordEntryS";
import axios from "axios";
import detectType from "@/components/project/detectType";

export default {
  name: "recordResult",
  components: {
    ELNIFrame,
    instrument,
    selectMethod,
    selectUnit,
    countHis,
    upload,
    uploadFile,
    fileList,
    RecordEntryS,
    SubItem,
    detectType,
  },

  data() {
    return {
      id: [],//废弃id
      showSubItem: false,
      showELNIFrame: false,
      isFullScreen: true,
      loading: false,
      recordEntyShow: false,
      isLoading: false,
      cateShow: false, //检测列别弹出框
      //地址参数
      queryData: {
        pageNum: 1,
        pageSize: 100,
        batchCode: null,
        sampleCode: null,
        detectTypeStr: null,
        itemCode: null,
        detectType: null,
        itemName: null,
      },
      pageSizes: [100, 200, 500],
      //保存&&提交接口的参数
      queryDataSave: {
        saveFlag: 1,
        waitingEnterList: [],
      },
      instrumentList: [{ detectInstrumentId: null }], //仪器ID
      inputValue: "", //输入框值
      inputValue2: "", //输入框值
      inputValue3: "", //输入框值
      inputValue4: "", //输入框值
      falg: false, //控制输入框显示
      falg2: false, //控制输入框显示
      falg3: false, //控制输入框显示
      falg4: false, //控制输入框显示
      disCode: "",
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      //多选框选中的数据
      checkData: [],
      total: 0,
      tableData: [],
      instrumentShow: false,
      idOne: undefined,
      instrumentIds: [], //选中的仪器id
      instrumentIdOne: [], // 点击检测仪器的仪器id
      instrumentType: 2, // 添加仪器类型（1单个添加，2多选添加）
      tabClickIndex: null, // 点击的单元格
      tabClickLabel: "", // 当前点击的列名
      selectMethodShow: false, //检测方法弹窗
      selectUnitShow: false, //计量单位弹窗
      parmas: {
        itemName: "", //检测项目名称
        detectCategory: "", //检测类别id
      },
      selectUnit: "", //检出限单位&&结果单位
      selectUnitId: null, //检出限单位&&结果单位id
      batchUpdateUnit: "unit",
      countHisShow: false, //历史记录列表
      resultId: null,
      rowId: null,
      // 0:单选，1：多选
      selectType: 0,
      selectIndex: undefined,
      // 导入参数配置
      upload: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的数据
        updateSupport: 0,
        // 上传数据的地址
        url:
          window.globalEnv.VUE_APP_BASE_API +
          "/v1/detectManage/resultEnter/waiting/importExcel",
      },
      type: -1,
      tableWidth: 680,
      //2021年4月20日 是否启用ELN
      enableEln: 0,
      //2021年9月24日 上传附件
      uploadFile: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "上传记录",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的数据
        updateSupport: 0,
        // 上传数据的地址
        url: window.globalEnv.VUE_APP_BASE_API + "/common/upload",
      },
      showFileOpen: false,
      fileList: [],
      VUE_APP_ELN_PORTAL: "http://39.108.98.239:8082/",
    };
  },
  props: {
    recordResultShow: {
      type: Boolean,
      default: false,
    },
    sampleIdList: {
      type: Array,
      default: () => [],
    },
    itemIdList: {
      type: Array,
      default: () => [],
    },
    //被退回的修改
    sampleItemIdList: {
      type: Array,
      default: () => [],
    },
    //识别码
    distinguishCode: null,
  },
  watch: {
    //录入检测结果
    inputValue2(val) {
      this.tableData.forEach((element, index) => {
        if (this.ids && this.ids.indexOf(element.id) >= 0) {
          element.detectResult = val;
          this.inputBlurResult(element, index);
        }
      });
    },
    // 录入方法检出限
    inputValue(val) {
      this.tableData.forEach((element) => {
        if (this.ids && this.ids.indexOf(element.id) >= 0) {
          element.detectLimit = val;
        }
      });
    },
    // 录入定量限值
    inputValue3(val) {
      this.tableData.forEach((element) => {
        if (this.ids && this.ids.indexOf(element.id) >= 0) {
          element.rationLimit = val;
        }
      });
    },
    // 判断结论
    inputValue4(val) {
      this.tableData.forEach((element) => {
        if (this.ids && this.ids.indexOf(element.id) >= 0) {
          element.conclusion = val;
        }
      });
    },
  },
  methods: {
    /*
     *@author: 焦政
     *@date: 2022-04-11 13:28:19
     *@description:关闭
     */
    e_closeSubItem() {
      this.showSubItem = false;
      this.getResultList();
    },
    /*
     *@author: 焦政
     *@date: 2022-04-11 09:17:31
     *@description:获取子项目列表
     */
    e_getSubItemList(row) {
      this.showSubItem = true;

      this.$nextTick(() => {
        this.$refs.SubItem.init(row);
      });
    },
    /*
     *@author: 焦政
     *@date: 2021-10-28 15:54:26
     *@description:关闭
     */
    e_cancelELN() {
      this.showELNIFrame = false;
      this.getResultList();
    },
    /*
     *@author: 焦政
     *@date: 2021-10-21 16:29:21
     *@description:实验室质控数据同步到ELN 当前接口请求成功才能跳转到ELN
     */
    async checkLinkStatus(ids) {
      let checkRes = await this.$net(
        `/v1/detectSampleItemResult/syncLabQualitySampleToEln/${ids}`,
        "get"
      );
      if (checkRes.code == 200) {
        return true;
      } else {
        this.$message.info(checkRes.msg);
        return false;
      }
    },

    e_demo() {
      this.$message.success("功能开发中，敬请期待");
    },
    /**
     * @author 焦政
     * @Description: 批量结果
     * @date 2021/3/5
     */
    async e_entryAll() {
      if (this.enableEln === 1) {
        if (this.checkData.length === 0) {
          this.$message.error("请至少选择一条数据");
          return;
        }
        // ************************************************************* //
        /*
         *@author: 焦政
         *@date: 2021-10-21 16:33:13
         *@description:实验室质控数据同步到ELN 当前接口请求成功才能跳转到ELN
         */
        let ids = this.checkData
          .map((item) => {
            return item.id;
          })
          .join(",");
        // 当前校验 是否开启ELN
        if (!(await this.checkLinkStatus(ids))) {
          return;
        }

        // ************************************************************* //
        let itemIds = this.checkData
          .map((item) => {
            return item.itemId;
          })
          .join(",");
        let checkRes = await this.e_checkProFromELN(itemIds);
        if (checkRes) {
          let detectionIds = this.checkData
            .map((item) => {
              return item.id;
            })
            .join(",");
          let url = `${window.globalEnv.VUE_APP_ELN_PORTAL}DataEntry/Mutiple?checkId=${this.checkData[0].itemId}&detectionId=${detectionIds}&editUserId=${this.$store.state.BeiYuan.currentUserInfo.userId}&editUserName=${this.$store.state.BeiYuan.currentUserInfo.userName}`;
          // window.open(url);
          this.showELNIFrame = true;
          this.$nextTick(() => {
            this.$refs.ELNIFrame.init(url);
          });
        }
      }
    },
    /**
     * @author 焦政
     * @Description: 校验所选的项目是否属于同一个ELN配置
     * @date 2021/3/5
     */
    e_checkProFromELN(ids) {
      return new Promise((resolve, reject) => {
        let url = `${window.globalEnv.VUE_APP_ELN_API}elnConfig/itemIsInTheSameELN?checkIdsStr=${ids}`;
        axios
          .get(url)
          .then((re) => {
            if (re.data.code === 200) {
              resolve(true);
            } else {
              // this.$message.error(re.data.msg);
              resolve(false);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    /**
     * @author 焦政
     * @Description: 单个录入
     * @date 2021/3/5
     */
    async e_entry(row) {
      if (this.enableEln === 1) {
        // ************************************************************* //
        /*
         *@author: 焦政
         *@date: 2021-10-21 16:33:13
         *@description:实验室质控数据同步到ELN 当前接口请求成功才能跳转到ELN
         */
        //当前校验 是否开启ELN
        if (!(await this.checkLinkStatus(row.id))) {
          return;
        }
        // 当前校验 当前项目是否配置模板
        if (!(await this.e_checkProFromELN(row.itemId))) {
          return;
        }
        // ************************************************************* //
        let url = `${window.globalEnv.VUE_APP_ELN_PORTAL}DataEntry/Single?entrustId=${row.entrustId}&detectType=${row.detectType}&batchId=${row.batchId}&checkId=${row.itemId}&detectionId=${row.id}&schemeNum=${row.sampleCode}&checkName=${row.itemName}&editUserId=${this.$store.state.BeiYuan.currentUserInfo.userId}&editUserName=${this.$store.state.BeiYuan.currentUserInfo.userName}`;
        // console.log(url);
        // window.open(url);
        this.showELNIFrame = true;
        this.$nextTick(() => {
          this.$refs.ELNIFrame.init(url);
        });
      }
    },
    e_close() {
      this.recordEntyShow = false;
      this.getResultList();
    },
    open() {
      this.getResultList();
      //清空保存参数
      this.queryDataSave = {
        saveFlag: 1,
        waitingEnterList: [],
      };
      this.instrumentList = [];
      this.falg2 = false;
      this.falg = false;
      this.falg3 = false;
      this.falg4 = false;
      getContext().then((res) => {
        if (res.data.enableEln && res.data.enableEln === 1) {
          this.enableEln = 1;
        } else {
          console.log("未开启ELN");
          this.enableEln = 0;
        }
      });
    },
    //导入
    handleImport() {
      this.upload.title = "检测结果导入";
      this.upload.open = true;
    },
    //下载模板
    importTemplate() {
      let id = "";
      if (this.type === 1) {
        id = this.sampleIdList.map((item) => item.sampleId).join(",");
      } else if (this.type === 2) {
        id = this.itemIdList.map((item) => item.sampleId).join(",");
      } else if (this.type === 3) {
        id = this.sampleItemIdList.map((item) => item.sampleId).join(",");
      }

      getResultTemplate(this.type, id).then((res) => {
        // console.log(res.msg);
          this.downLoadFile(res.msg)
      });
    },
    // 设备仪器列表
    getInstrumentCount(row) {
      // console.log(row);
      // 录入结果数据ID
      this.idOne = row.id + "";
      this.instrumentType = 1;
      if (row.instrumentIds) {
        this.instrumentIdOne = row.instrumentIds.split(",");
      } else {
        this.instrumentIdOne = [];
      }

      this.instrumentShow = true;
    },
    //历史记录列表
    getEditHisCount(row) {
      if (!row.editHisCount) {
        this.$message.error("没有相关记录！");
        return false;
      }
      console.log("row", row);
      this.resultId = row.resultId;
      this.countHisShow = true;
    },
    //自定义表头(api有新方法替代)
    renderHeaderDetectUnit(h, { column, $index }) {
      if (column.property === "detectUnitStr") {
        return h("span", [
          h("span", "检出限单位"),
          h(
            "span",
            {
              style:
                "font-size:14px;color:#027DB4;font-weight:800;margin-left:60px",
              on: {
                //点击方法
                click: () => {
                  this.getUnit();
                },
              },
            },
            "批"
          ),
        ]);
      } else if (column.property === "detectResultUnitStr") {
        return h("span", [
          h("span", "结果单位"),
          h(
            "span",
            {
              style:
                "font-size:14px;color:#027DB4;font-weight:800;margin-left:60px",
              on: {
                //点击方法
                click: () => {
                  this.getResultUnit();
                },
              },
            },
            "批"
          ),
        ]);
      } else if (column.property === "detectLimit") {
        return h("span", [
          h("span", "方法检出限"),
          h(
            "span",
            {
              style:
                "font-size:14px;color:#027DB4;font-weight:800;margin-left:60px",
              on: {
                //点击方法
                click: () => {
                  this.disp_prompt();
                },
              },
            },
            "批"
          ),
        ]);
      } else if (column.property === "rationLimit") {
        return h("span", [
          h("span", "定量限值"),
          h(
            "span",
            {
              style:
                "font-size:14px;color:#027DB4;font-weight:800;margin-left:60px",
              on: {
                //点击方法
                click: () => {
                  this.disp_prompt3();
                },
              },
            },
            "批"
          ),
        ]);
      } else if (column.property === "conclusion") {
        return h("span", [
          h("span", "判定结论"),
          h(
            "span",
            {
              style:
                "font-size:14px;color:#027DB4;font-weight:800;margin-left:60px",
              on: {
                //点击方法
                click: () => {
                  this.disp_prompt4();
                },
              },
            },
            "批"
          ),
        ]);
      } else {
        // return h("span", [
        //   h("span", "检测结果"),
        //   h("input", {
        //     style: "width:100%;",
        //     on: {
        //       //点击方法
        //       input: (e) => {
        //        this.inputValue2 = this.inputValue2+String(e.data)
        //        console.log('this.inputValue2',this.inputValue2)
        //         // if (a) {
        //         //   this.tableData.forEach((element, index) => {
        //         //     if (this.ids && this.ids.indexOf(element.id) >= 0) {
        //         //       element.detectResult = a;
        //         //       this.inputBlurResult(element, index);
        //         //     }
        //         //   });
        //         // } else {
        //         //   this.tableData.forEach((element, index) => {
        //         //     if (this.ids && this.ids.indexOf(element.id) >= 0) {
        //         //       element.detectResult = "";
        //         //       this.inputBlurResult(element, index);
        //         //     }
        //         //   });
        //         // }
        //       },
        //     },
        //   }),
        // ]);
      }
    },
    //弹出输入框
    disp_prompt() {
      this.falg = true;
      this.disCode = "detectLimit";
    },
    changeDetectLimit() {
      //方法检出限
      this.tableData.forEach((element) => {
        if (this.ids && this.ids.indexOf(element.id) >= 0) {
          element.detectLimit = this.inputValue;
        }
      });
      this.falg = false;
    },
    disp_prompt2() {
      this.falg2 = true;
      this.disCode = "detectResultName";
    },
    disp_prompt3() {
      this.falg3 = true;
      this.disCode = "rationLimit";
    },
    disp_prompt4() {
      this.falg4 = true;
      this.disCode = "conclusion";
    },
    changeDetectResultName() {
      //检测结果
      this.tableData.forEach((element, index) => {
        if (this.ids && this.ids.indexOf(element.id) >= 0) {
          element.detectResult = this.inputValue2;
          this.inputBlurResult(element, index);
        }
      });
      this.falg2 = false;
    },
    changeRationLimit() {
      //检测结果
      this.tableData.forEach((element) => {
        if (this.ids && this.ids.indexOf(element.id) >= 0) {
          element.rationLimit = this.inputValue3;
        }
      });
      this.falg3 = false;
    },
    changeConclusion() {
      //检测结果
      this.tableData.forEach((element) => {
        if (this.ids && this.ids.indexOf(element.id) >= 0) {
          element.conclusion = this.inputValue4;
        }
      });
      this.falg4 = false;
    },
    //取消文本框
    closeInput() {
      if (this.falg) {
        this.falg = false;
      }
      if (this.falg2) {
        this.falg2 = false;
      }
      if (this.falg3) {
        this.falg3 = false;
      }
      if (this.falg4) {
        this.falg4 = false;
      }
    },
    //更新方法编号的方法
    changeItemCode(val) {
      this.tableData.itemCode = val;
    },
    //计量单位选择
    changeUnit(val) {
      this.selectUnit = val.unitName;
      this.selectUnitId = val.id;
      if (this.selectType === 1) {
        // alert("多选");
        //只有多选框选中的才改变
        this.tableData.forEach((element) => {
          if (this.ids && this.ids.indexOf(element.id) >= 0) {
            if (this.batchUpdateUnit === "unit") {
              element.detectUnitStr = this.selectUnit;
              element.detectUnit = this.selectUnitId;
            } else {
              element.detectResultUnitStr = this.selectUnit;
              element.detectResultUnit = this.selectUnitId;
            }
          }
        });
      } else {
        //  if(this.batchUpdateUnit==='unit'){
        //     this.$set(this.tableData[this.selectIndex],"detectUnitStr",this.selectUnit)
        //     debugger
        //   }else{
        //       this.$set(this.tableData[this.selectIndex],"detectResultUnitStr",this.selectUnit)
        //       debugger

        //   }
        // alert("单选");
        this.tableData.forEach((element) => {
          if (this.rowId === element.id) {
            if (this.batchUpdateUnit === "unit") {
              element.detectUnitStr = this.selectUnit;
              element.detectUnit = this.selectUnitId;
            } else {
              element.detectResultUnitStr = this.selectUnit;
              element.detectResultUnit = this.selectUnitId;
            }
          }
        });
      }
    },
    getUnit(row) {
      this.selectType = 1;
      // alert("点击的选择单位批量");
      this.batchUpdateUnit = "unit";
      this.selectUnitShow = true;
    },
    getResultUnit(row) {
      this.selectType = 1;
      this.batchUpdateUnit = "resultUnit";
      this.selectUnitShow = true;
    },
    getUnitOnly(row, index) {
      this.selectType = 0;
      this.selectIndex = index;
      this.rowId = row.id;
      // alert("点击的选择单位单独");
      this.batchUpdateUnit = "unit";
      this.selectUnitShow = true;
    },
    getResultUnitOnly(row, index) {
      this.selectIndex = index;
      this.selectType = 0;
      this.rowId = row.id;
      // alert("点击的选择单位单独");
      this.batchUpdateUnit = "resultUnit";
      this.selectUnitShow = true;
    },

    //检测方法选择
    getMethod(row) {
      if (row.customerAppoint === 1) {
        this.$message.error("客户指定方法不能修改!");
      } else {
        this.parmas.itemName = row.itemName;
        this.parmas.detectCategory = row.detectType;
        this.selectMethodShow = true;
      }
    },
    tableRowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex;
    },
    // 添加明细方法编号 row 当前行 column 当前列
    tabClick(row, column, cell, event) {
      switch (column.label) {
        case "方法检出限":
          this.tabClickIndex = row.index;
          this.tabClickLabel = column.label;
          break;
        case "检出限单位":
          this.tabClickIndex = row.index;
          this.tabClickLabel = column.label;
          break;
        case "检测结果":
          this.tabClickIndex = row.index;
          this.tabClickLabel = column.label;
          break;
        case "结果单位":
          this.tabClickIndex = row.index;
          this.tabClickLabel = column.label;
          break;
        case "定量限值":
          this.tabClickIndex = row.index;
          this.tabClickLabel = column.label;
          break;
        case "判定结论":
          this.tabClickIndex = row.index;
          this.tabClickLabel = column.label;
          break;
        default:
          return;
      }
    },
    /*
     * 判定结论
     * */
    inputBlurResult(row, cIndex) {
      console.log(row, cIndex);
      this.tabClickIndex = "";
      this.tabClickLabel = "";
      if (!row.detectResult) {
        return false;
      }
      var detectResult = row.detectResult;
      var resultIndex = -1;
      try {
        var itemDecideLimitList = row.itemDecideLimitList;
        if (!itemDecideLimitList) {
          resultIndex = -2;
          throw new Error("EndIterative");
        }
        if (itemDecideLimitList.length <= 0) {
          resultIndex = -2;
          throw new Error("EndIterative");
        }
        itemDecideLimitList.forEach((item, index) => {
          item.upLimit = !isNaN(item.upLimit)
            ? Number(item.upLimit)
            : item.upLimit;
          item.lowLimit = !isNaN(item.lowLimit)
            ? Number(item.lowLimit)
            : item.lowLimit;
          detectResult = !isNaN(detectResult)
            ? Number(detectResult)
            : detectResult;
          console.log(
            item.compareContent,
            item.lowLimit,
            item.upLimit,
            detectResult
          );
          if (item.compareContent == "＜" && detectResult < item.upLimit) {
            resultIndex = index;
            throw new Error("EndIterative");
          } else if (
            item.compareContent == "≤" &&
            detectResult <= item.upLimit
          ) {
            resultIndex = index;
            throw new Error("EndIterative");
          } else if (
            item.compareContent == "＞" &&
            detectResult > item.lowLimit
          ) {
            resultIndex = index;
            throw new Error("EndIterative");
          } else if (
            item.compareContent == "≥" &&
            detectResult >= item.lowLimit
          ) {
            resultIndex = index;
            throw new Error("EndIterative");
          } else if (
            item.compareContent == "＞，＜" &&
            detectResult > item.lowLimit &&
            detectResult < item.upLimit
          ) {
            resultIndex = index;
            throw new Error("EndIterative");
          } else if (
            item.compareContent == "＞，≤" &&
            detectResult > item.lowLimit &&
            detectResult <= item.upLimit
          ) {
            resultIndex = index;
            throw new Error("EndIterative");
          } else if (
            item.compareContent == "≥，＜" &&
            detectResult >= item.lowLimit &&
            detectResult < item.upLimit
          ) {
            resultIndex = index;
            throw new Error("EndIterative");
          } else if (
            item.compareContent == "≥，≤" &&
            detectResult >= item.lowLimit &&
            detectResult <= item.upLimit
          ) {
            resultIndex = index;
            throw new Error("EndIterative");
          } else if (
            item.compareContent == "匹配字符" &&
            detectResult == item.lowLimit
          ) {
            resultIndex = index;
            throw new Error("EndIterative");
          }
        });
      } catch (e) {
        if (e.message != "EndIterative") throw e;
      }
      // console.log(resultIndex, this.tableData[cIndex]);
      if (resultIndex == -2) {
        this.tableData[cIndex].standardName = "";
        this.tableData[cIndex].limitDesc = "";
        this.tableData[cIndex].conclusion = "";
      } else if (resultIndex > -1) {
        this.tableData[cIndex].standardName =
          itemDecideLimitList[resultIndex].standardName;
        this.tableData[cIndex].limitDesc =
          itemDecideLimitList[resultIndex].limitDesc;
        this.tableData[cIndex].conclusion =
          itemDecideLimitList[resultIndex].decideResult;
      } else {
        this.tableData[cIndex].standardName = "";
        this.tableData[cIndex].limitDesc = "";
        this.tableData[cIndex].conclusion = "不合格";
      }

      // scope.row.itemDecideLimitList
    },
    // 失去焦点初始化
    inputBlur(row, event, column) {
      this.tabClickIndex = "";
      this.tabClickLabel = "";
    },
    //添加仪器
    handleAdd() {
      this.instrumentType = 2;
      this.instrumentShow = true;
      this.idOne = this.checkData.map((item) => item.id).join(",");
    },
    //上传附件
    handleUploadFile() {
      this.uploadFile.open = true;
      this.idOne = this.checkData.map((item) => item.id).join(",");
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
      //多选框选中的数据
      this.checkData = selection;
      this.instrumentIds = selection.map((item) => item.instrumentIds);
      let b = this.instrumentIds.join(","); //数组转成字符串
      let bArr = b.split(","); // 字符串转成数组
      this.instrumentIds = Array.from(new Set(bArr)); // 去重
    },
    // 废弃样品按钮
    discardBtn() {
      this.$confirm("确认废弃选择样品吗？", "废弃样品", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let sampleId = this.checkData.map((item) => {
          let result = item.id;
          return result;
        });
        this.id = [];
        this.id = sampleId;
        console.log(this.id);
        this.$net(
          "/v1/detectManage/resultEnter/abandonItems",
          "deleteData",
          this.id
        ).then(re =>{
          this.getResultList()
          this.$message({
          type: "success",
          message: "废弃成功!",
         });
        })
        // console.log(this.sampleIdList);

      });
    },
    //获取仪器列表页面传递过来的id
    changeInsIds(val, id) {
      const ids = id.split(",");
      ids.forEach((itemId) => {
        this.tableData.forEach((item) => {
          // console.log(item.id, itemId);
          if (item.id == itemId) {
            item.instrumentCount = val.length;
            item.instrumentIds = val.join(",");
            item.detectInstrumentId = val;
          }
        });
      });
    },

    e_changeBox(type) {
      console.log("type", type);
      this.isFullScreen = type;
      if (type) {
        this.tableWidth = 680;
      } else {
        this.tableWidth = 500;
      }
    },
    //取消按钮操作
    close() {
      this.$emit("update:recordResultShow", false);
      this.resetQuery()
      this.$emit("saveReload");
    },
    //保存按钮操作
    submitSave() {
      this.isLoading = true;
      this.queryDataSave.waitingEnterList = [];
      this.checkData.forEach((ele) => {
        if (undefined !== ele.instrumentIds && null !== ele.instrumentIds) {
          ele.detectInstrumentId = ele.instrumentIds.split(",");
        }

        /*
         *@author: 焦政
         *@date: 2021-02-01 17:47:17
         *@description: 保存设备ID
         */
        let arr = [];
        if (ele.detectInstrumentId) {
          ele.detectInstrumentId.forEach((ej) => {
            let obj = {
              detectInstrumentId: Number(ej),
            };
            arr.push(obj);
          });
        }

        this.queryDataSave.waitingEnterList.push({
          id: ele.id || "", //检测项目ID
          resultId: ele.resultId || "", //检测结果ID
          itemCode: ele.itemCode || "", //方法编码
          detectLimit: ele.detectLimit || "", //检出限值
          detectUnit: ele.detectUnit || "", //检出限值单位id
          detectResult: ele.detectResult || "", //检测结果
          detectResultUnit: ele.detectResultUnit || "", //结果单位
          rationLimit: ele.rationLimit || "", //定量限值
          conclusion: ele.conclusion || "", //判定结论
          instrumentList: arr,
          itemFileList: ele.itemFileList,
        });
      });
      saveResult(this.queryDataSave).then(
        (res) => {
          if (res.code === 200) {
            this.$message.success("成功");
            this.$emit("saveReload");
            this.close();
          }
          setTimeout(() => {
            this.isLoading = false;
          });
        },
        (err) => {
          setTimeout(() => {
            this.isLoading = false;
          });
        }
      );
    },
    //提交按钮操作
    submitForm() {
      this.queryDataSave.saveFlag = 2;
      this.submitSave();
    },
    //TODO 录入结果列表
    async getResultList() {
      if (this.distinguishCode === "SampleRecordResult") {
        let temp = {
          entrustSampleList: this.sampleIdList,
        };
        this.loading = true;
        await getRecordResultList(this.queryData, temp).then(
          (res) => {
            this.loading = false;
            for (var i in res.data.list) {
              res.data.list[i].standardName = res.data.list[i].standardName
                ? res.data.list[i].standardName
                : "";
              res.data.list[i].limitDesc = res.data.list[i].limitDesc
                ? res.data.list[i].limitDesc
                : "";
              res.data.list[i].conclusion = res.data.list[i].conclusion
                ? res.data.list[i].conclusion
                : "";
            }
            this.tableData = res.data.list;
            this.total = res.data.total;
            this.loading = false;
          },
          (err) => { }
        );
      } else if (this.distinguishCode === "ItemRecordResult") {
        let temp = {
          entrustItemList: this.itemIdList,
        };
        await getRecordResultList(this.queryData, temp).then(
          (res) => {
            for (var i in res.data.list) {
              res.data.list[i].standardName = res.data.list[i].standardName
                ? res.data.list[i].standardName
                : "";
              res.data.list[i].limitDesc = res.data.list[i].limitDesc
                ? res.data.list[i].limitDesc
                : "";
              res.data.list[i].conclusion = res.data.list[i].conclusion
                ? res.data.list[i].conclusion
                : "";
            }
            this.tableData = res.data.list;
            this.total = res.data.total;
            this.loading = false;
          },
          (err) => { }
        );
      } else {
        let temp = {
          sampleItemIdList: this.sampleItemIdList,
        };
        this.queryData.sampleItemIdList = this.sampleItemIdList.join(",");
        await getSampleListDetail(this.queryData).then(
          (res) => {
            for (var i in res.data.list) {
              res.data.list[i].standardName = res.data.list[i].standardName
                ? res.data.list[i].standardName
                : "";
              res.data.list[i].limitDesc = res.data.list[i].limitDesc
                ? res.data.list[i].limitDesc
                : "";
              res.data.list[i].conclusion = res.data.list[i].conclusion
                ? res.data.list[i].conclusion
                : "";
            }
            this.tableData = res.data.list;
            this.total = res.data.total;
            this.loading = false;
          },
          (err) => { }
        );
      }
      this.tableData.forEach((item, index) => {
        this.inputBlurResult(item, index);
      });
    },
    afterFileUpload(data) {
      console.log("afterFileUpload", data);
      this.checkData.forEach((item) => {
        //itemFileList
        if (!item.itemFileList) {
          this.$set(item, "itemFileList", []);
        }
        item.itemFileList.push({
          detectSampleItemId: item.id,
          fileName: data.fileName,
          filePath: data.url,
          fileSource: 1,
          createBy: data.uploadUser,
          createTime: data.uploadDate,
        });
      });
    },
    getFile(row) {
      console.log("getFile", row);
      this.fileList = row.itemFileList;
      this.showFileOpen = true;
    },
    removeFile(tableDataList, removeIdList) {
      console.log("removeFile", tableDataList, removeIdList);
      this.checkData.forEach((item) => {
        this.$set(item, "itemFileList", tableDataList);
      });
      removeIdList = removeIdList.filter((item) => item !== undefined);
      if (removeIdList && removeIdList.length > 0) {
        console.log("removeIdList", removeIdList, removeIdList.join(","));
        deleteItemFile(removeIdList.join(",")).then((res) => {
          this.getResultList();
        });
      }
    },
    // 搜索按钮
    async handleQuery() {
      let temp = {
        entrustSampleList: this.sampleIdList,
        batchCode: this.queryData.batchCode,
        sampleCode: this.queryData.sampleCode,
        detectTypeStr: this.queryData.detectTypeStr,
        itemCode: this.queryData.itemCode,
        detectType: this.queryData.detectType,
        itemName: this.queryData.itemName,
      }
      this.loading = true;
      await getRecordResultList(this.query, temp).then(
        res => {
          this.loading = false;
          this.tableData = res.data.list
          this.total = res.data.total;
          this.loading = false
        }
      )
    },
    // 重置
    resetQuery() {
      this.queryData = {
        pageNum: 1,
        pageSize: 100,
        itemName: null,
        batchCode: null,
        sampleCode: null,
        detectTypeStr: null,
        itemCode: null,
        detectType: null,
      };
      this.getResultList()
    },

    changeDetectName(val) {
      this.queryData.detectTypeStr = val.detectName;
      this.queryData.detectType = val.id;
    },
  },
  computed: {
    title() {
      switch (this.distinguishCode) {
        case "SampleRecordResult":
          this.type = 1;
          return "按样品-录入结果";
        case "ItemRecordResult":
          this.type = 2;
          return "按项目-录入任务";
        case "updateSampleRecordResult":
          this.type = 3;
          return "修改结果";
      }
    },
    // ids(){
    //   return this.$multipleTable.selection.map(item => item.id)
    // }
  },
  created() { },
  mounted() { },
  updated() { },
};
</script>
<style lang="less" scoped>
.pagination-container {
  height: 33px;
}

/deep/ .dialog-footer {
  display: flex;
  align-items: center;
  height: 50px;
  line-height: 16px;
  font-size: 16px;

  .left {
    border-right: 2px solid rgb(156, 153, 153);
    padding-right: 10px;

    span {
      color: blue;
    }
  }

  .right {
    display: flex;

    span {
      display: block;
      margin-right: 10px;
    }

    align-items: center;
    margin-left: 10px;
  }
}

/*
/deep/ .input_content {
	margin-left: 700px;
	margin-top: 14px;
}

/deep/ .input_content2 {
	margin-left: 900px;
	margin-top: 14px;
}

/deep/ .input_content3 {
	margin-left: 1100px;
	margin-top: 14px;
}

/deep/ .input_content4 {
	margin-left: 1300px;
	margin-top: 14px;
}*/
.inputs {
  margin-top: 10px;
}

/deep/ .el-dialog__body {
  padding-bottom: 0;
  padding-top: 20px;
}
</style>

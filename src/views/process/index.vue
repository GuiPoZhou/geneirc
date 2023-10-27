<template>
  <div class="app-container">
    <div class="a-c-top dynamic-el-menu">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item :index="item.id.toString()" v-for="item in tabList">
          <a-badge
            :count="item.badgeTotal"
            :overflow-count="99"
            :show-zero="item.id.toString() === '1'"
          >
            {{ item.configName }}
          </a-badge>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="a-c-top" v-show="showSearch">
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        label-width="100px"
        :prop="queryParams"
        style="margin-top: 15px"
      >
        <el-form-item
          label="提交人员"
          v-if="activeIndex !== '3'"
          prop="submitUserName"
        >
          <el-input
            v-model="queryParams.submitUserName"
            placeholder="提交人员"
            clearable
			size="small"
            @keyup.enter.native="handleQuery"
            class="input-with-select"
			style="width: 240px;"
          />
        </el-form-item>
        <el-form-item label="选择模块" prop="businessCategory">
          <el-select
            v-model="queryParams.businessCategory"
            filterable
            placeholder="请选择"
            :clearable="true"
			@change="handleQuery"
			style="width: 240px;"
			size="small"
          >
            <el-option
              v-for="item in businessCategoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批状态" v-if="activeIndex !== '1'" prop="status">
          <el-select
            v-model="queryParams.status"
            filterable
			size="small"
            placeholder="请选择"
            :clearable="true"
			@change="handleQuery"
			style="width: 240px;"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提交日期" prop="picker">
          <el-date-picker
            v-model="queryParams.picker"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            @change="datePickChange"
			style="width: 260px;"
			size="small"
          />
        </el-form-item>
        <div class="a-c-t-btnarea">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索
            </el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div id="components-layout-demo-basic">
      <a-layout>
        <a-layout-sider
          width="400px"
          :collapsible="true"
          theme="light"
          collapsedWidth="0"
        >
          <div
            v-infinite-scroll="handleInfiniteOnLoad"
            class="demo-infinite-container"
            :infinite-scroll-disabled="busy"
            :infinite-scroll-distance="10"
          >
            <a-list :data-source="data" :locale="locale">
              <a-list-item
                slot="renderItem"
                slot-scope="item, index"
                @click="clickTask(item, index)"
                :class="index === curIndex && 'curList'"
              >
                <div style="padding-left: 24px">
                  <p class="important">应用模块:{{ item.businessCategory }}</p>
                  <p class="important">业务类型:{{ item.configName }}</p>
                  <p>提交人员:{{ item.createUserName }}</p>
                  <p>提交日期:{{ item.createTime }}</p>
                </div>
                <div class="status">
                  {{ item.taskName }} <br />
                  {{ item.handleFlowName }}
                </div>
              </a-list-item>
              <div v-if="loading && !busy" class="demo-loading-container">
                <a-spin />
              </div>
            </a-list>
          </div>
        </a-layout-sider>
        <a-layout>
          <a-layout-content style="margin-left: 15px">
             <el-menu :default-active="subActiveIndex" class="el-menu-demo" mode="horizontal" @select="handleSelectSub">
              <el-menu-item :index="item.id.toString()" v-for="item in subTabList">{{item.configName}}</el-menu-item>
            </el-menu>
       <el-table :data="gridData" v-show="subActiveIndex === '2'" style="margin-top:15px" max-height="740px">
              <el-table-column property="activityName" label="任务名称"></el-table-column>
              <el-table-column property="assigneeName" label="处理人"></el-table-column>
              <el-table-column property="flowName" label="审批结果"></el-table-column>
              <el-table-column property="comment" label="审批意见"></el-table-column>
              <el-table-column property="startTime" label="上一任务提交时间"></el-table-column>
              <el-table-column property="endTime" label="本任务审批时间"></el-table-column>
<!--              <el-table-column property="durationInMillis" label="耗时"></el-table-column>-->
            </el-table>
            <!--审批详情-->
            <a-spin :spinning="spinning" v-if="spType == 1">
              <div
                style=" overflow-y: auto; margin-top: 15px"
                v-show="subActiveIndex === '1'"
              >
                <accept
                  v-if="showdetali"
                  ref="detali"
                  @close="showdetali = false"
                  :msg="msg"
                  v-show="subActiveIndex === '1'"
                ></accept>
                <borrow
                  v-if="showborrow"
                  ref="borrow"
                  @close="showborrow = false"
                  v-show="subActiveIndex === '1'"
                ></borrow>
                <print
                  v-if="showprint"
                  ref="print"
                  @close="showprint = false"
                  v-show="subActiveIndex === '1'"
                ></print>
                <change
                  v-if="showchange"
                  ref="change"
                  @close="showchange = false"
                  v-show="subActiveIndex === '1'"
                ></change>
                <trainingPlan
                  v-if="showplan"
                  ref="plan"
                  @close="showplan = false"
                  v-show="subActiveIndex === '1'"
                ></trainingPlan>
                <!--化学药品-->
                <materialBuyOrder
                  v-if="showbuyorder"
                  ref="buyOrder"
                  @close="showbuyorder = false"
                  v-show="subActiveIndex === '1'"
                ></materialBuyOrder>
                <materialBuyApply
                  v-if="showbuyapply"
                  ref="buyApply"
                  @close="showbuyapply = false"
                  v-show="subActiveIndex === '1'"
                ></materialBuyApply>
                <materialWarehousing
                  v-if="showwarehousing"
                  ref="warehousing"
                  @close="showwarehousing = false"
                  v-show="subActiveIndex === '1'"
                ></materialWarehousing>
                <materialOutStock
                  v-if="showoutstock"
                  ref="outstock"
                  @close="showoutstock = false"
                  v-show="subActiveIndex === '1'"
                ></materialOutStock>
                <materialWithdrawal
                  v-if="showwithdrawal"
                  ref="withdrawal"
                  @close="showwithdrawal = false"
                  v-show="subActiveIndex === '1'"
                ></materialWithdrawal>
                <materialRefund
                  v-if="showrefund"
                  ref="refund"
                  @close="showrefund = false"
                  v-show="subActiveIndex === '1'"
                ></materialRefund>
                <!--低值易耗品-->
                <materialCheapBuyOrder
                  v-if="showCheapBuyorder"
                  ref="cheapBuyOrder"
                  @close="showCheapBuyorder = false"
                  v-show="subActiveIndex === '1'"
                ></materialCheapBuyOrder>
                <materialCheapBuyApply
                  v-if="showCheapBuyapply"
                  ref="cheapBuyApply"
                  @close="showCheapBuyapply = false"
                  v-show="subActiveIndex === '1'"
                ></materialCheapBuyApply>
                <materialCheapWarehousing
                  v-if="showCheapWarehousing"
                  ref="cheapWarehousing"
                  @close="showCheapWarehousing = false"
                  v-show="subActiveIndex === '1'"
                ></materialCheapWarehousing>
                <materialCheapOutStock
                  v-if="showCheapOutStock"
                  ref="cheapOutstock"
                  @close="showCheapOutStock = false"
                  v-show="subActiveIndex === '1'"
                ></materialCheapOutStock>
                <materialCheapWithdrawal
                  v-if="showCheapWithdrawal"
                  ref="cheapWithdrawal"
                  @close="showCheapWithdrawal = false"
                  v-show="subActiveIndex === '1'"
                ></materialCheapWithdrawal>
                <materialCheapRefund
                  v-if="showCheapRefund"
                  ref="cheapRefund"
                  @close="showCheapRefund = false"
                  v-show="subActiveIndex === '1'"
                ></materialCheapRefund>
                <!--质量管理-->
                <qualityReviewPlan
                  v-if="showReviewPlan"
                  ref="reviewPlan"
                  @close="showReviewPlan = false"
                  v-show="subActiveIndex === '1'"
                ></qualityReviewPlan>
                <qualityAuditPlan
                  v-if="showAuditPlan"
                  ref="reviewPlan"
                  @close="showAuditPlan = false"
                  v-show="subActiveIndex === '1'"
                ></qualityAuditPlan>
                <qualityIncompatible
                  v-if="showIncompatible"
                  ref="reviewPlan"
                  @close="showIncompatible = false"
                  v-show="subActiveIndex === '1'"
                ></qualityIncompatible>
                <qualityCorrection
                  v-if="showCorrection"
                  ref="reviewPlan"
                  @close="showCorrection = false"
                  v-show="subActiveIndex === '1'"
                ></qualityCorrection>
                <siteAudit
                  v-if="showsiteAudit"
                  ref="siteAudit"
                  @close="showsiteAudit = false"
                  v-show="subActiveIndex === '1'"
                ></siteAudit>
                <inconformity
                  v-if="showinconform"
                  ref="inconform"
                  @close="showinconform = false"
                  v-show="subActiveIndex === '1'"
                ></inconformity>
                <interReport
                  v-if="showauditrecord"
                  ref="auditrecord"
                  @close="showauditrecord = false"
                  v-show="subActiveIndex === '1'"
                ></interReport>
                <!--设备管理-->
                <maintenancePlan
                  v-if="showmainplan"
                  ref="mainplan"
                  @close="showmainplan = false"
                  v-show="subActiveIndex === '1'"
                ></maintenancePlan>
                <maintenanceRecord
                  v-if="showmainrecord"
                  ref="mainrecord"
                  @close="showmainrecord = false"
                  v-show="subActiveIndex === '1'"
                ></maintenanceRecord>
                <intermediateChecks
                  v-if="showintercheck"
                  ref="intercheck"
                  @close="showintercheck = false"
                  v-show="subActiveIndex === '1'"
                ></intermediateChecks>
                <interchecksRecord
                  v-if="showinterrecord"
                  ref="interrecord"
                  @close="showinterrecord = false"
                  v-show="subActiveIndex === '1'"
                ></interchecksRecord>
                <calibrationPlan
                  v-if="showcaliplan"
                  ref="caliplan"
                  @close="showcaliplan = false"
                  v-show="subActiveIndex === '1'"
                ></calibrationPlan>
                <calibrationRecord
                  v-if="showcalirecord"
                  ref="calirecord"
                  @close="showcalirecord = false"
                  v-show="subActiveIndex === '1'"
                ></calibrationRecord>
                <maintenance
                  v-if="showmaintenance"
                  ref="maintenance"
                  @close="showmaintenance = false"
                  v-show="subActiveIndex === '1'"
                ></maintenance>
                <maintenanceOrder
                  v-if="showmaintorder"
                  ref="maintorder"
                  @close="showmaintorder = false"
                  v-show="subActiveIndex === '1'"
                ></maintenanceOrder>
                <maintenanceScrap
                  v-if="showscrap"
                  ref="scrap"
                  @close="showscrap = false"
                  v-show="subActiveIndex === '1'"
                ></maintenanceScrap>
                  <!--   样品处理详情   -->
                  <sampleProcess v-if="showProcess" ref="processRef"></sampleProcess>
              </div>
            </a-spin>
            <iframe
              v-show="subActiveIndex === '1'"
              :style="`width: 100%; max-height: 100vh; ${pdfURL ? 'height:100vh' : 'display: none'}`"
              :src="pdfURL"
              frameborder="0"
            ></iframe>
          </a-layout-content>

          <a-layout-footer>
            <el-button
              type="primary"
              v-for="item in taskFlow"
              :key="item.targetCode"
              @click="showApprovalOpinions(item)"
              >{{ item.flowName }}
            </el-button>
            <el-button
              type="primary"
              v-if="nowTask.taskKey === '4' && activeIndex === '3'"
              @click="cancelApply()"
              >撤回
            </el-button>
            <el-button
              type="primary"
              v-if="nowTask.taskKey === '9' && activeIndex === '3'"
              @click="resetProcess()"
              >重置审批
            </el-button>
          </a-layout-footer>
        </a-layout>
      </a-layout>
      <a-modal
        :title="approvalOpinions.title"
        :visible="approvalOpinions.visible"
        @ok="approvalOpinions.ok"
        @cancel="approvalOpinions.cancel"
        okText="确定"
        cancelText="关闭"
        style="top: 20px"
        :destroyOnClose="true"
        :width="`${approvalOpinions.width}px`"
        :maskClosable="false"
        centered
      >
        <a-spin :spinning="approvalOpinions.spinning">
          <a-textarea
            placeholder="请输入审批意见"
            :rows="4"
            style="resize: none"
            v-model="approvalOpinions.comment"
          />
        </a-spin>
      </a-modal>
    </div>
  </div>
</template>

<script>
import accept from "./dialog/accept";
import borrow from "./dialog/borrow";
import print from "./dialog/print";
import change from "./dialog/change";
import trainingPlan from "./dialog/trainingPlan";
// 化学药品
import materialBuyOrder from "./dialog/chemical/materialBuyOrder";
import materialBuyApply from "./dialog/chemical/materialBuyApply";
import materialWarehousing from "./dialog/chemical/materialWarehousing";
import materialOutStock from "./dialog/chemical/materialOutStock";
import materialWithdrawal from "./dialog/chemical/materialWithdrawal";
import materialRefund from "./dialog/chemical/materialRefund";
// 低值易耗品
import materialCheapBuyOrder from "./dialog/consumables/materialBuyOrder";
import materialCheapBuyApply from "./dialog/consumables/materialBuyApply";
import materialCheapWarehousing from "./dialog/consumables/materialWarehousing";
import materialCheapOutStock from "./dialog/consumables/materialOutStock";
import materialCheapWithdrawal from "./dialog/consumables/materialWithdrawal";
import materialCheapRefund from "./dialog/consumables/materialRefund";
// 质量管理
import qualityReviewPlan from "./dialog/quality/reviewPlan";
import qualityAuditPlan from "./dialog/quality/auditPlan";
import qualityIncompatible from "./dialog/quality/incompatible";
import qualityCorrection from "./dialog/quality/correction";
import siteAudit from "./dialog/quality/siteAudit";
import inconformity from "./dialog/quality/inconformity";
import interReport from "./dialog/quality/interReport";
// 设备管理
import maintenanceRecord from "./dialog/deviceManagement/maintenanceRecord";
import maintenancePlan from "./dialog/deviceManagement/maintenancePlan";
import intermediateChecks from "./dialog/deviceManagement/intermediateChecks";
import interchecksRecord from "./dialog/deviceManagement/interchecksRecord";
import calibrationPlan from "./dialog/deviceManagement/calibrationPlan";
import calibrationRecord from "./dialog/deviceManagement/calibrationRecord";
import maintenance from "./dialog/deviceManagement/maintenance";
import maintenanceOrder from "./dialog/deviceManagement/maintenanceOrder";
import maintenanceScrap from "./dialog/deviceManagement/maintenanceScrap";
import {
  getBorrowPrintdetail,
  getChangeApplydetail,
} from "@/api/resources/filesManagement/filesManagement";

import { getTranplanDetail } from "@/api/resources/personnelManagement/index";

import { getBuyApplyDetail } from "@/api/chemical/purchaseApply";
import { queryBuyOrderById } from "@/api/chemical/purchaseOrder";
import {
  queryStoreInDetail,
  queryStoreRefundDetail,
} from "@/api/chemical/AcceptanceWarehousing";
import {
  queryStoreOutDetail,
  queryStoreOutReturnDetail,
} from "@/api/chemical/collectingIssue";

import { getBuyApplyDetail as materialCheapBuyApplyDetail } from "@/api/consumables/purchaseApply";
import { queryBuyOrderById as materialCheapBuyOrderById } from "@/api/consumables/purchaseOrder";
import {
  queryStoreInDetail as materialCheapStoreInDetail,
  queryStoreRefundDetail as materialCheapStoreRefundDetail,
} from "@/api/consumables/AcceptanceWarehousing";
import {
  queryStoreOutDetail as materialCheapStoreOutDetail,
  queryStoreOutReturnDetail as materialCheapStoreOutReturnDetail,
} from "@/api/consumables/collectingIssue";

import { getPlanInfo } from "@/api/qualityAssurance/managementReview/auditPlan";
import { auditdetail, nodetail, correctdetail } from "@/api/mass/config";

import {
  getEquipmentplanDetail,
  getMaintainRecordDetail,
  getEquipmentCheckPlanDetail,
  getCheckRecordDetail,
  getCalibrationPlanDetail,
  getCaliRecordDetail,
  getRepairApplyDetail,
  getRecordIdApplyDetail,
  getScrapApplyDetail,
  mainCompleteAudit,
  mainCompleteRecordAudit,
  scrapCompleteAudit,
} from "@/api/resources/deviceManagement/index.js";
import {
  spotdetail,
  inconformitydetail,
  reportdetail,
} from "@/api/mass/config";

import infiniteScroll from "vue-infinite-scroll";
import {
  getTodoList,
  getDoneList,
  getMySubmitList,
  getTaskDetail,
  complete,
  cancelApply,
  resetProcess,
  getBusinessConfig,
  getBusinessCategoryOptions,
  getStatusOptions,
  getProcessInfo,
  getTaskDetailNew,
  borrowPrintPass,
  borrowPrintReturn,
  completeBuyApply,
  completeBuyOrder,
  completeAudit,
  completeRefundAudit,
  completeOutAudit,
  completStoreOutReturnAudit,
  completeCheapBuyApply,
  completeCheapBuyOrder,
  completeCheapAudit,
  completeCheapRefundAudit,
  completeCheapOutAudit,
  completCheapStoreOutReturnAudit,
} from "@/api/process/config";
import { getDynamicData } from "@/api/runDynamicPage/config";
import jsonModel from "@/views/KFormDesign/module/jsonModal";
import "@/views/core/components_use";
import KFormBuild from "@/views/KFormBuild/index";
import "ant-design-vue/dist/antd.css";
// 样品处理
import sampleProcess from './components/sapmleManagement/sampleProcess.vue'

export default {
  name: "myProcess",
  directives: { infiniteScroll },
  components: {
    infiniteScroll,
    jsonModel,
    KFormBuild,
    accept,
    borrow,
    change,
    print,
    trainingPlan,
    materialBuyOrder,
    materialBuyApply,
    materialWarehousing,
    materialOutStock,
    materialWithdrawal,
    materialRefund,
    materialCheapBuyOrder,
    materialCheapBuyApply,
    materialCheapWarehousing,
    materialCheapOutStock,
    materialCheapWithdrawal,
    materialCheapRefund,
    qualityReviewPlan,
    qualityAuditPlan,
    qualityIncompatible,
    qualityCorrection,
    maintenancePlan,
    maintenanceRecord,
    intermediateChecks,
    interchecksRecord,
    calibrationPlan,
    calibrationRecord,
    maintenance,
    maintenanceOrder,
    maintenanceScrap,
    siteAudit,
    inconformity,
    interReport,
      sampleProcess
  },
  data() {
    return {
      showdetali: false,
      showborrow: false,
      showprint: false,
      showchange: false,
      showplan: false,
      showbuyorder: false,
      showbuyapply: false,
      showwarehousing: false,
      showoutstock: false,
      showwithdrawal: false,
      showrefund: false,
      showCheapBuyorder: false,
      showCheapBuyapply: false,
      showCheapWarehousing: false,
      showCheapOutStock: false,
      showCheapWithdrawal: false,
      showCheapRefund: false,
      showReviewPlan: false,
      showAuditPlan: false,
      showIncompatible: false,
      showCorrection: false,
      showmainrecord: false,
      showintercheck: false,
      showinterrecord: false,
      showmainplan: false,
      showcaliplan: false,
      showmaintenance: false,
      showmaintorder: false,
      showscrap: false,
      showsiteAudit: false,
      showinconform: false,
      showauditrecord: false,
      showcalirecord: false,
        showProcess: false,
      detailInfo: {},
      beforeType: [
        "DETECT_SCHEME",
        "ENTRUSTMENT_AGREEMENT",
        "SUBCONTRACT_AGREEMENT",
        "QUOTATION",
        "CONTRACT",
      ],
      pdfURL: "",
      activeIndex: "1",
      subActiveIndex: "1",
      curIndex: 0,
      showSearch: true,
      spType: 1,
      tabList: [
        {
          id: "1",
          configName: "待我审批　",
          badgeCount: 0,
        },
        {
          id: "2",
          configName: "我已审批　",
          badgeCount: 0,
        },
        {
          id: "3",
          configName: "我提交的　",
          badgeCount: 0,
        },
      ],
      subTabList: [
        {
          id: "1",
          configName: "审批详情",
        },
        {
          id: "2",
          configName: "审批记录",
        },
      ],

      data: [],
      loading: false,
      busy: false,
      total: 0,
      // 查询参数
      queryParams: {
        businessCategory: null,
        status: null,
        submitUserName: null,
        completeDateStart: null,
        completeDateEnd: null,
        picker: null,
        pageNum: 1,
        pageSize: 10,
      },
      businessCategoryOptions: [],
      statusOptions: [],
      locale: {
        emptyText: "暂无数据",
      },

      //表单
      jsonData: {},
      defaultValue: {},
      envDetectInfoPick: [],
      entrustPackageSelectedList: [],
      extendedProperties: {},
      dynamicDataSource: {},
      cacheDynamicDataSource: {},
      isView: true,
      spinning: false,
      dynamicData: {
        selectCustomerVisible: false,
        selectCustomer(value, event) {
          this.selectCustomerVisible = true;
        },
        selectedSubcontractor: (val1, val2, val3, val4, val5) => {
          this.$EventBus.$emit("selectedSubcontractor");
        },
        disabled1: false,
        disabled2: true,
      },
      loadForm: false,
      //历史审批记录
      gridData: null,
      //任务流向
      taskFlow: [],
      nowTaskFlow: {},
      nowTask: {},
      //审批意见
      approvalOpinions: {
        title: "",
        visible: false,
        width: 300,
        flowControlKey: null,
        flowControlValue: null,
        targetCode: null,
        comment: "",
        spinning: false,
        ok: () => {
          if (!this.approvalOpinions.comment) {
            this.msgError("请先填写审批意见!");
            return;
          }
          let that = this;
          let msg = `当前选择的处理方式为[${this.nowTaskFlow.flowName}]${this.nowTaskFlow.targetName ? `, 下一节点为[${this.nowTaskFlow.targetName}]` : ""}], 是否确认？`;

          if (this.nowTaskFlow.targetCode === "End") {
            msg =
              "当前选择的处理方式为[" +
              this.nowTaskFlow.flowName +
              "], 提交后完成流程, 是否确认？";
          }
          if (this.nowTaskFlow.targetCode === "Back") {
            msg =
              "当前选择的处理方式为[" +
              this.nowTaskFlow.flowName +
              "], 提交后将回退至业务列表, 是否确认？";
          }
          this.$confirm(msg, "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            that.approvalOpinions.spinning = true;
            // console.log('approvalOpinions.ok!', that.approvalOpinions);
            let variables = {};
            variables[that.approvalOpinions.flowControlKey] =
              that.approvalOpinions.flowControlValue;
            console.log("variables", variables);
            let completeData = {
              taskId: that.nowTask.taskId,
              instanceId: that.nowTask.instanceId,
              processKey: that.nowTask.processKey,
              comment: that.approvalOpinions.comment,
              flowName: that.nowTaskFlow.flowName,
              targetCode: that.approvalOpinions.targetCode,
              variables: variables,
              executionId: this.detailInfo.executionId,
            };
            completeData.todoTaskId = this.nowTask.id;
            // 化学药品采购申请
            if (this.recordType === "MATERIAL_BUY_APPLY") {
              completeBuyApply(completeData).then((res) => {
                this.$message.success("审批成功");
                this.approvalOpinions.comment = "";
                this.approvalOpinions.spinning = false;
                this.handleSelect("1");
                this.approvalOpinions.visible = false;
                this.approvalOpinions.comment = null;
                this.taskFlow = [];
                this.showbuyapply = false;
              });
              return false;
            }
            // 化学药品采购订单
            if (this.recordType === "MATERIAL_BUY_ORDER") {
              completeBuyOrder(completeData).then((res) => {
                this.$message.success("审批成功");
                this.approvalOpinions.comment = "";
                this.approvalOpinions.spinning = false;
                this.handleSelect("1");
                this.approvalOpinions.visible = false;
                this.approvalOpinions.comment = null;
                this.taskFlow = [];
                this.showbuyorder = false;
              });
              return false;
            }
            // 化学药品入库
            if (this.recordType === "MATERIAL_STORE_IN") {
              completeAudit(completeData).then((res) => {
                this.$message.success("审批成功");
                this.approvalOpinions.comment = "";
                this.approvalOpinions.spinning = false;
                this.handleSelect("1");
                this.approvalOpinions.visible = false;
                this.approvalOpinions.comment = null;
                this.taskFlow = [];
                this.showwarehousing = false;
              });
              return false;
            }
            // 化学药品退货
            if (this.recordType === "MATERIAL_STORE_OUT") {
              completeOutAudit(completeData).then((res) => {
                this.$message.success("审批成功");
                this.approvalOpinions.comment = "";
                this.approvalOpinions.spinning = false;
                this.handleSelect("1");
                this.approvalOpinions.visible = false;
                this.approvalOpinions.comment = null;
                this.taskFlow = [];
                this.showoutstock = false;
              });
              return false;
            }
            // 化学药品出库
            if (this.recordType === "MATERIAL_STORE_OUT_RETURN") {
              completStoreOutReturnAudit(completeData).then((res) => {
                this.$message.success("审批成功");
                this.approvalOpinions.comment = "";
                this.approvalOpinions.spinning = false;
                this.handleSelect("1");
                this.approvalOpinions.visible = false;
                this.approvalOpinions.comment = null;
                this.taskFlow = [];
                this.showwithdrawal = false;
              });
              return false;
            }
            // 化学药品退库
            if (this.recordType === "MATERIAL_STORE_REFUND") {
              completeRefundAudit(completeData).then((res) => {
                this.$message.success("审批成功");
                this.approvalOpinions.comment = "";
                this.approvalOpinions.spinning = false;
                this.handleSelect("1");
                this.approvalOpinions.visible = false;
                this.approvalOpinions.comment = null;
                this.taskFlow = [];
                this.showrefund = false;
              });
              return false;
            }

            // 易耗品采购申请
            if (this.recordType === "MATERIAL_BUY_APPLY_CHEAP") {
              completeCheapBuyApply(completeData).then((res) => {
                this.$message.success("审批成功");
                this.approvalOpinions.comment = "";
                this.approvalOpinions.spinning = false;
                this.handleSelect("1");
                this.approvalOpinions.visible = false;
                this.approvalOpinions.comment = null;
                this.taskFlow = [];
                this.showCheapBuyapply = false;
              });
              return false;
            }
            // 易耗品采购订单
            if (this.recordType === "MATERIAL_BUY_ORDER_CHEAP") {
              completeCheapBuyOrder(completeData).then((res) => {
                this.$message.success("审批成功");
                this.approvalOpinions.comment = "";
                this.approvalOpinions.spinning = false;
                this.handleSelect("1");
                this.approvalOpinions.visible = false;
                this.approvalOpinions.comment = null;
                this.taskFlow = [];
                this.showCheapBuyorder = false;
              });
              return false;
            }
            // 易耗品入库
            if (this.recordType === "MATERIAL_STORE_IN_CHEAP") {
              completeCheapAudit(completeData).then((res) => {
                this.$message.success("审批成功");
                this.approvalOpinions.comment = "";
                this.approvalOpinions.spinning = false;
                this.handleSelect("1");
                this.approvalOpinions.visible = false;
                this.approvalOpinions.comment = null;
                this.taskFlow = [];
                this.showCheapWarehousing = false;
              });
              return false;
            }
            // 易耗品退货
            if (this.recordType === "MATERIAL_STORE_REFUND_CHEAP") {
              completeCheapRefundAudit(completeData).then((res) => {
                this.$message.success("审批成功");
                this.approvalOpinions.comment = "";
                this.approvalOpinions.spinning = false;
                this.handleSelect("1");
                this.approvalOpinions.visible = false;
                this.approvalOpinions.comment = null;
                this.taskFlow = [];
                this.showCheapOutStock = false;
              });
              return false;
            }
            // 易耗品出库
            if (this.recordType === "MATERIAL_STORE_OUT_CHEAP") {
              completeCheapOutAudit(completeData).then((res) => {
                this.$message.success("审批成功");
                this.approvalOpinions.comment = "";
                this.approvalOpinions.spinning = false;
                this.handleSelect("1");
                this.approvalOpinions.visible = false;
                this.approvalOpinions.comment = null;
                this.taskFlow = [];
                this.showCheapWithdrawal = false;
              });
              return false;
            }
            // 易耗品退库
            if (this.recordType === "MATERIAL_STORE_OUT_RETURN_CHEAP") {
              completCheapStoreOutReturnAudit(completeData).then((res) => {
                this.$message.success("审批成功");
                this.approvalOpinions.comment = "";
                this.approvalOpinions.spinning = false;
                this.handleSelect("1");
                this.approvalOpinions.visible = false;
                this.approvalOpinions.comment = null;
                this.taskFlow = [];
                this.showCheapRefund = false;
              });
              return false;
            }

            // 设备维修申请
            if (this.recordType == "EQUIPMENT_REPAIR_APPLY") {
              mainCompleteAudit(completeData).then((res) => {
                this.$message.success("审批成功");
                this.approvalOpinions.comment = "";
                this.approvalOpinions.spinning = false;
                this.handleSelect("1");
                this.approvalOpinions.visible = false;
                this.approvalOpinions.comment = null;
                this.taskFlow = [];
                this.showmaintenance = false;
              });
              this.approvalOpinions.spinning = false;
              return false;
            }
            // 设备维修记录申请
            if (this.recordType == "EQUIPMENT_REPAIR_RECORD") {
              mainCompleteRecordAudit(completeData).then((res) => {
                this.$message.success("审批成功");
                this.approvalOpinions.comment = "";
                this.approvalOpinions.spinning = false;
                this.handleSelect("1");
                this.approvalOpinions.visible = false;
                this.approvalOpinions.comment = null;
                this.taskFlow = [];
                this.showmaintenance = false;
              });
              this.approvalOpinions.spinning = false;
              return false;
            }
            // 设备报废申请
            if (this.recordType == "EQUIPMENT_SCRAP_APPLY") {
              scrapCompleteAudit(completeData).then((res) => {
                this.$message.success("审批成功");
                this.approvalOpinions.comment = "";
                this.approvalOpinions.spinning = false;
                this.handleSelect("1");
                this.approvalOpinions.visible = false;
                this.approvalOpinions.comment = null;
                this.taskFlow = [];
                this.showmaintenance = false;
              });
              this.approvalOpinions.spinning = false;
              return false;
            }
            delete completeData.todoTaskId;
            complete(completeData).then(
              (res) => {
                let params = {
                  recordType: this.recordType,
                  opinion: that.approvalOpinions.comment,
                  recordId: this.recordId + "",
                };

                if (
                  this.recordType === "FILE_MANAGE_BORROW" ||
                  this.recordType === "FILE_MANAGE_PRINT"
                ) {
                  // 借阅/打印申请
                  let params = {
                    businessType:
                      this.detailInfo.envBusinessConfig.businessCategory,
                    businessId: this.detailInfo.executionId,
                    instanceId: this.detailInfo.instanceId,
                    configId: this.detailInfo.envBusinessConfig.id,
                  };
                  if (this.nowTaskFlow.targetCode === "Back") {
                    // 不通过
                    borrowPrintReturn(params).then((res) => {
                      // this.approvalOpinions.spinning = false;
                      // this.handleSelect('1');
                      // // this.approvalOpinions.visible = false;
                      // // this.approvalOpinions.comment = null;
                      // this.showprint = false
                      // this.showborrow = false
                      // this.taskFlow = [];
                      console.log(this.approvalOpinion);
                    });
                  } else if (this.nowTaskFlow.targetCode === "audit2") {
                    // 通过
                    borrowPrintPass(params).then((res) => {
                      console.log(this.approvalOpinion);
                    });
                  }
                  this.approvalOpinions.spinning = false;
                  this.handleSelect("1");
                  this.approvalOpinions.visible = false;
                  this.approvalOpinions.comment = null;
                  this.showprint = false;
                  this.showborrow = false;
                  this.taskFlow = [];
                } else if (this.recordType === "FILE_MANAGE_CHANGE_APPLY") {
                  // 文件更改申请
                  let params = {
                    businessType:
                      this.detailInfo.envBusinessConfig.businessCategory,
                    businessId: this.detailInfo.executionId,
                    instanceId: this.detailInfo.instanceId,
                    configId: this.detailInfo.envBusinessConfig.id,
                  };
                  if (this.nowTaskFlow.targetCode === "Back") {
                    // 不通过
                    borrowPrintReturn(params).then((res) => {
                      // this.approvalOpinions.spinning = false;
                      // this.handleSelect('1');
                      // this.approvalOpinions.visible = false;
                      // this.approvalOpinions.comment = null;
                      // this.showchange = false
                      // this.taskFlow = [];
                    });
                  } else if (this.nowTaskFlow.targetCode === "End") {
                    // 通过
                    borrowPrintPass(params).then((res) => {});
                  }
                  this.approvalOpinions.comment = "";
                  this.approvalOpinions.spinning = false;
                  this.handleSelect("1");
                  this.approvalOpinions.visible = false;
                  this.approvalOpinions.comment = null;
                  this.taskFlow = [];
                  this.showchange = false;
                }
                that.approvalOpinions.spinning = false;
                this.handleSelect("1");
                this.approvalOpinions.visible = false;
                this.approvalOpinions.comment = null;
                this.taskFlow = [];
                this.showplan = false;
                this.showmainplan = false;
                this.showmainrecord = false;
                this.showintercheck = false;
                this.showinterrecord = false;
                this.showcaliplan = false;
                this.showmaintenance = false;
                this.showmaintorder = false;
                this.showscrap = false;
                this.showsiteAudit = false;
                this.showinconform = false;
                this.showauditrecord = false;
                this.showcalirecord = false;
                this.showProcess = false;
                this.showReviewPlan = false;
                this.showAuditPlan = false;
                this.showIncompatible = false;
                this.showCorrection = false;
                this.taskFlow = [];
                this.$message.success(res.msg);
              },
              (err) => {
                that.approvalOpinions.spinning = false;
                this.handleSelect("1");
                this.approvalOpinions.visible = false;
                this.approvalOpinions.comment = null;
                this.taskFlow = [];
                this.gridData = [];
                this.msgError(err);
              }
            );
          });
        },
        cancel: () => {
          this.approvalOpinions.visible = false;
          this.approvalOpinions.comment = "";
        },
      },
    };
  },
  beforeMount() {
    // this.fetchData();
  },
  mounted() {
    // this.pdfURL =
    //   "/pdfjs/web/viewer.html?file=" +
    //   "http://192.168.36.158:8081/agreement/20212602YY5166.pdf";
    getBusinessCategoryOptions(this.activeIndex).then((res) => {
      this.businessCategoryOptions = res.data;
    });
  },
  methods: {
    /*
     *@author: 焦政
     *@date: 2021-08-16 08:53:07
     *@description:获取审批想pdf详情
     */
    e_getProcessInfo(executionId, businessCode) {
      getProcessInfo(executionId, businessCode).then((re) => {

        let url = `/pdfjs/web/viewer.html?file=${window.globalEnv.VUE_APP_BASE_API}${re.msg}`;
		console.log(url);
        this.pdfURL = url;
      });
    },
    handleSubmit(p) {},
    getDynamicData(root, config) {
      if (!config) {
        return;
      }
      // 加载表单远程数据源
      config.forEach((f) => {
        if (f.type == "grid") {
          f.columns.forEach((c) => {
            root.getDynamicData(root, c.list);
          });
        }
        if (f.type == "card") {
          root.getDynamicData(root, f.list);
        }
        if (f.type == "tabs") {
          f.columns.forEach((c) => {
            root.getDynamicData(root, c.list);
          });
        }
        if (f.type == "table") {
          f.trs.forEach((tr) => {
            tr.tds.forEach((td) => {
              root.getDynamicData(root, td.list);
            });
          });
        }
        if (f.options && f.options.dynamicGetUrl) {
          f.options.dynamicKey = f.key + "_dk";
          let valueField = f.options.dynamicGetKey;
          let labelField = f.options.dynamicGetValue;
          getDynamicData(f.options.dynamicGetUrl).then((response) => {
            let dataSource = [];
            response.data.forEach((row, key) => {
              dataSource.push({
                value: row[valueField],
                label: row[labelField],
              });
            });
            root.$set(root.dynamicData, f.options.dynamicKey, dataSource);
          });
        }
      });
    },
    handleSelect(key) {
      // console.log('handleSelect', key)
      this.activeIndex = key;
      this.queryParams.pageNum = 1;
      this.jsonData = {};
      this.data = [];
      this.subActiveIndex = "1";
      this.taskFlow = [];
      const data = this.data;
      this.loading = true;
      this.fetchData((res, refreshTotal) => {
        this.data = data.concat(res.rows);
        this.total = res.total;
        if (refreshTotal) {
          this.tabList[0].badgeTotal = res.total;
        }
        this.loading = false;
      });
      getBusinessCategoryOptions(key).then((res) => {
        this.businessCategoryOptions = res.data;
      });
      getStatusOptions(this.activeIndex).then((res) => {
        this.statusOptions = res.data;
      });
    },
    handleSelectSub(key) {
      this.subActiveIndex = key;
    },
    initTaskData() {
      this.nowTaskFlow = null;
      this.taskFlow = null;
      this.approvalOpinions.spinning = false;
      this.approvalOpinions.comment = "";
      this.approvalOpinions.flowControlKey = null;
      this.approvalOpinions.flowControlValue = null;
      this.approvalOpinions.targetCode = null;
    },
    /*
     *@author: 焦政
     *@date: 2021-08-16 09:04:41
     *@description:点击审核列表
     */
    clickTask(item, index) {
      this.pdfURL = ""
      this.recordId = item.executionId;
      this.nowTask = item;
      this.curIndex = index;
      if (this.beforeType.indexOf(item.businessCode) != -1) {
        this.spType = 2;
        this.initTaskData();
        this.loadForm = false;
        console.log("clickTask", item);
        this.spinning = true;
        this.subActiveIndex = "1";

        this.e_getProcessInfo(item.executionId, item.businessCode);

        getTaskDetail(item.id, this.activeIndex === "1").then(
          (res) => {
            this.taskFlow = res.data.taskFlowList;
            this.extendedProperties = {};
            this.extendedProperties.formShowType = 1;
			  this.gridData = res.data.hisTaskList;

			  // this.$nextTick(() => {
        //       this.jsonData = JSON.parse(
        //         res.data.businessExecutionTemplate.metaJson
        //       );
        //       this.updateSelectOptions(this.jsonData.list, [
        //         {
        //           value: parseInt(res.data.envBusinessConfig.id),
        //           label: res.data.envBusinessConfig.configName,
        //         },
        //       ]);
        //       this.defaultValue = res.data.formData.mainFormData;
        //       this.envDetectInfoPick = res.data.formData.envDetectInfoPick;
        //       this.entrustPackageSelectedList =
        //         res.data.formData.entrustPackageSelectedList;
        //       this.extendedProperties["selectedList"] =
        //         res.data.formData.selectedList;
        //       this.extendedProperties["selectedRowKeys"] =
        //         res.data.formData.selectedRowKeys;
        //       if (res.data.formData.mainFormData.agreementMeans) {
        //         this.extendedProperties["agreementMeans"] =
        //           res.data.formData.mainFormData.agreementMeans.toString();
        //       }
        //       this.extendedProperties["subcontractorId"] =
        //         res.data.formData.mainFormData.subcontractorId;
        //       if (
        //         this.extendedProperties["agreementMeans"] &&
        //         this.extendedProperties["agreementMeans"] === "1"
        //       ) {
        //         let entrustIds = [];
        //         this.extendedProperties["selectedList"].forEach((item) => {
        //           entrustIds.push(item.entrustAgreementId);
        //         });
        //         this.extendedProperties["entrustIds"] = entrustIds.join(",");
        //       }
        //       this.dynamicData.disabled2 = false;
				//
        //       this.$store.dispatch(
        //         "getPlanType",
        //         this.jsonData.config.planType
        //       );
        //       this.loadForm = true;
        //       this.spinning = false;
			  // console.log(this.gridData)
        //     });
          },
          (err) => {
            this.spinning = false;
            this.handleSelect("1");
            this.approvalOpinions.visible = false;
            this.approvalOpinions.comment = null;
            this.taskFlow = [];
            this.gridData = [];
            this.msgError(err);
          }
        );
      } else {
        this.spType = 1;
        this.recordId = item.executionId;
        getTaskDetailNew(item.id, this.activeIndex === "1").then(
          (res) => {
            this.detailInfo = res.data;
            this.showprint = false;
            this.showborrow = false;
            this.showdetali = false;
            this.showplan = false;
            this.showchange = false;
            this.showbuyapply = false;
            this.showbuyorder = false;
            this.showwarehousing = false;
            this.showoutstock = false;
            this.showwithdrawal = false;
            this.showrefund = false;
            this.showCheapBuyorder = false;
            this.showCheapBuyapply = false;
            this.showCheapWarehousing = false;
            this.showCheapOutStock = false;
            this.showCheapWithdrawal = false;
            this.showCheapRefund = false;
            this.showmainplan = false;
            this.showmainrecord = false;
            this.showintercheck = false;
            this.showinterrecord = false;
            this.showcaliplan = false;
            this.showmaintenance = false;
            this.showmaintorder = false;
            this.showscrap = false;
            this.showsiteAudit = false;
            this.showinconform = false;
            this.showauditrecord = false;
            this.showcalirecord = false;
            this.showProcess = false;
            this.showReviewPlan = false;
            this.showAuditPlan = false;
            this.showIncompatible = false;
            this.showCorrection = false;
			console.log("aaass", res);
            if (item.businessCode === "FILE_MANAGE_BORROW") {
              this.showborrow = true;
              getBorrowPrintdetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.borrow.init(res.data, "updata");
                });
              });
            }else if (item.businessCode === "SAMPLE_PROCESSING") {
                console.log(111)
                // 样品处理
                this.showProcess = true
                this.$net('/handover/v2/sampleProcessing/detail', 'get', {id: res.data.executionId}).then(res => {
                    this.$nextTick(() => {
                        this.$refs.processRef.init(res.data, 'detail')
                    })
                })
            } else if (item.businessCode === "FILE_MANAGE_PRINT") {
              this.showprint = true;
              getBorrowPrintdetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.print.init(res.data, "updata");
                });
              });
            } else if (item.businessCode === "FILE_MANAGE_CHANGE_APPLY") {
              this.showchange = true;
              getChangeApplydetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.change.init(res.data, "updata");
                });
              });
            } else if (item.businessCode === "TRAIN_PLAN") {
              this.showplan = true;

              getTranplanDetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.plan.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "MATERIAL_BUY_ORDER") {
              this.showbuyorder = true;

              queryBuyOrderById(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.buyOrder.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "MATERIAL_BUY_APPLY") {
              this.showbuyapply = true;

              getBuyApplyDetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.buyApply.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "MATERIAL_STORE_IN") {
              this.showwarehousing = true;

              queryStoreInDetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.warehousing.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "MATERIAL_STORE_OUT") {
              this.showoutstock = true;

              queryStoreOutDetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.outstock.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "MATERIAL_STORE_OUT_RETURN") {
              this.showwithdrawal = true;

              queryStoreOutReturnDetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.withdrawal.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "MATERIAL_STORE_REFUND") {
              this.showrefund = true;

              queryStoreRefundDetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.refund.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "MATERIAL_BUY_APPLY_CHEAP") {
              // 易耗品采购申请
              this.showCheapBuyapply = true;
              materialCheapBuyApplyDetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.cheapBuyApply.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "MATERIAL_BUY_ORDER_CHEAP") {
              // 易耗品采购订单
              this.showCheapBuyorder = true;
              materialCheapBuyOrderById(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.cheapBuyOrder.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "MATERIAL_STORE_IN_CHEAP") {
              // 易耗品入库
              this.showCheapWarehousing = true;
              materialCheapStoreInDetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.cheapWarehousing.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "MATERIAL_STORE_REFUND_CHEAP") {
              // 易耗品退货
              this.showCheapOutStock = true;
              materialCheapStoreRefundDetail(res.data.executionId).then(
                (res) => {
                  this.$nextTick(() => {
                    this.$refs.cheapOutstock.init(res.data, "updata");
                  });
                }
              );
            } else if (item.businessCode == "MATERIAL_STORE_OUT_CHEAP") {
              // 易耗品出库
              this.showCheapWithdrawal = true;
              materialCheapStoreOutDetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.cheapWithdrawal.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "MATERIAL_STORE_OUT_RETURN_CHEAP") {
              // 易耗品退库
              this.showCheapRefund = true;
              materialCheapStoreOutReturnDetail(res.data.executionId).then(
                (res) => {
                  this.$nextTick(() => {
                    this.$refs.cheapRefund.init(res.data, "updata");
                  });
                }
              );
            } else if (item.businessCode == "QUALITY_REVIEW_PLAN") {
              this.showReviewPlan = true;
              getPlanInfo(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.reviewPlan.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "QUALITY_INTERNAL_AUDIT") {
              this.showAuditPlan = true;

              auditdetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.reviewPlan.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "QUALITY_INCOMPATIBLE") {
              this.showIncompatible = true;
              nodetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.reviewPlan.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "QUALITY_CORRECTION_PREVENTION") {
              this.showCorrection = true;

              correctdetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.reviewPlan.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "EQUIPMENT_MAINTAIN_PLAN") {
              this.showmainplan = true;
              getEquipmentplanDetail(res.data.executionId).then((res) => {
                console.log("aaa", res);
                this.$nextTick(() => {
                  this.$refs.mainplan.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "EQUIPMENT_MAINTAIN_RECORD") {
              this.showmainrecord = true;
              getMaintainRecordDetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.mainrecord.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "EQUIPMENT_CHECK_PLAN") {
              this.showintercheck = true;
              getEquipmentCheckPlanDetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.intercheck.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "EQUIPMENT_CHECK_RECORD") {
              this.showinterrecord = true;
              getCheckRecordDetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.interrecord.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "EQUIPMENT_CALIBRATION_PLAN") {
              this.showcaliplan = true;
              getCalibrationPlanDetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.caliplan.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "EQUIPMENT_CALIBRATION_RECORD") {
              this.showcalirecord = true;
              getCaliRecordDetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.calirecord.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "EQUIPMENT_REPAIR_APPLY") {
              this.showmaintenance = true;
              getRepairApplyDetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.maintenance.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "EQUIPMENT_REPAIR_RECORD") {
              this.showmaintorder = true;
              getRecordIdApplyDetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.maintorder.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "EQUIPMENT_SCRAP_APPLY") {
              this.showscrap = true;
              getScrapApplyDetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.scrap.init(res.data, "updata");
					console.log('res.data',res.data)
                });
              });
            } else if (item.businessCode == "INTERNAL_AUDIT_ONSITE") {
              this.showsiteAudit = true;
              spotdetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.siteAudit.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "INTERNAL_AUDIT_INCOMPATIBLE") {
              this.showinconform = true;
              inconformitydetail(res.data.executionId).then((res) => {
                this.$nextTick(() => {
                  this.$refs.inconform.init(res.data, "updata");
                });
              });
            } else if (item.businessCode == "INTERNAL_AUDIT_REPORT") {
              this.showauditrecord = true;
              reportdetail(res.data.executionId).then((res) => {
                console.log("qqq", res);
                this.$nextTick(() => {
                  this.$refs.auditrecord.init(res.data, "updata");
                });
              });
            }
            // console.log('clickTask->response ', res);
            this.extendedProperties = {};
            this.extendedProperties.formShowType = 1;
            this.$nextTick(() => {
              this.gridData = res.data.hisTaskList;
              this.jsonData = res.data.businessExecutionTemplate ? JSON.parse(res.data.businessExecutionTemplate.metaJson) : new Object();
              if(this.jsonData.list){
								this.updateSelectOptions(this.jsonData.list, [{
									value: parseInt(res.data.envBusinessConfig.id),
									label: res.data.envBusinessConfig.configName
								}])
							}
              // this.defaultValue = res.data.formData.mainFormData;
              // this.envDetectInfoPick = res.data.formData.envDetectInfoPick;
              // this.entrustPackageSelectedList = res.data.formData.entrustPackageSelectedList;
              // //分包
              // this.extendedProperties['selectedList'] = res.data.formData.selectedList;
              // this.extendedProperties['selectedRowKeys'] = res.data.formData.selectedRowKeys;
              // if(res.data.formData.mainFormData.agreementMeans){
              //   this.extendedProperties['agreementMeans'] = res.data.formData.mainFormData.agreementMeans.toString();
              // }
              // this.extendedProperties['subcontractorId'] = res.data.formData.mainFormData.subcontractorId;
              // if(this.extendedProperties['agreementMeans'] && this.extendedProperties['agreementMeans'] === '1'){
              //   let entrustIds = [];
              //   this.extendedProperties['selectedList'].forEach(item => {
              //     entrustIds.push(item.entrustAgreementId);
              //   });
              //   this.extendedProperties['entrustIds'] = entrustIds.join(',');
              // };
              this.dynamicData.disabled2 = false;


              // this.$store.dispatch('getPlanType',this.jsonData.config.planType);
              this.loadForm = true;
              this.spinning = false;
              this.taskFlow = res.data.taskFlowList;
              this.recordType = res.data.envBusinessConfig.businessCategory;
            });
          },
          (err) => {
            this.spinning = false;
            this.handleSelect("1");
            this.approvalOpinions.visible = false;
            this.approvalOpinions.comment = null;
            this.taskFlow = [];
            this.gridData = [];
            this.msgError(err);
          }
        );
      }
    },
    fetchData(callback) {
      if (this.activeIndex === "1") {
        getTodoList(this.queryParams).then((res) => {
          callback(res, true);
          this.queryParams.pageNum += 1;
        });
      } else if (this.activeIndex === "2") {
        getDoneList(this.queryParams).then((res) => {
          callback(res, false);
          this.queryParams.pageNum += 1;
        });
      } else if (this.activeIndex === "3") {
        getMySubmitList(this.queryParams).then((res) => {
          callback(res, false);
          this.queryParams.pageNum += 1;
        });
      }
    },
    handleInfiniteOnLoad() {
      const data = this.data;
      this.loading = true;
      if (data.length > 0 && data.length >= this.total) {
        this.$message.warning("已经到底了!");
        this.busy = true;
        this.loading = false;
        return;
      }
      this.fetchData((res, refreshTotal) => {
        this.data = data.concat(res.rows);
        this.total = res.total;
        if (refreshTotal) {
          this.tabList[0].badgeTotal = res.total;
        }
        this.loading = false;
      });
      if (this.data.length > 0) {
        this.e_getProcessInfo(
          this.data[0].executionId,
          this.data[0].businessCode
        );
      }
    },
    showApprovalOpinions(taskFlow) {
      console.log("taskFlow", taskFlow);
      this.nowTaskFlow = taskFlow;
      this.approvalOpinions.title = taskFlow.flowName;
	  this.approvalOpinions.comment  = taskFlow.flowName;
      this.approvalOpinions.flowControlKey = taskFlow.flowControlKey;
      this.approvalOpinions.flowControlValue = taskFlow.flowControlValue;
      this.approvalOpinions.targetCode = taskFlow.targetCode;
      this.approvalOpinions.visible = true;
    },
    updateSelectOptions(item, dataSource) {
      let that = this;
      item.forEach((f) => {
        if (f.type == "grid") {
          f.columns.forEach((c) => {
            that.updateSelectOptions(c.list, dataSource);
          });
        }
        if (f.type == "card") {
          that.updateSelectOptions(f.list);
        }
        if (f.type == "table") {
          f.trs.forEach((tr) => {
            tr.tds.forEach((td) => {
              that.updateSelectOptions(td.list);
            });
          });
        }
        if (f.model === "subcontractType") {
          getBusinessConfig("SUBCONTRACT_AGREEMENT").then((response) => {
            let remoteDataSource = [];
            response.data.forEach((item, index) => {
              remoteDataSource.push({
                value: parseInt(item.id),
                label: item.configName,
              });
            });
            f.options.options = remoteDataSource;
          });
        } else if (f.model === "schemeType") {
          // console.log('dataSource', dataSource, f);
          f.options.options = dataSource;
        } else if (f.model === "entrustType") {
          // console.log('dataSource', dataSource, f);
          f.options.options = dataSource;
        }
      });
    },
    //撤回
    cancelApply() {
      let that = this;
      let msg = "撤回后, 当前审批终止并返回到业务列表, 是否确认?";
      this.$confirm(msg, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let variables = {};
          let completeData = {
            taskId: that.nowTask.taskId,
            instanceId: that.nowTask.instanceId,
            processKey: that.nowTask.processKey,
            comment: that.approvalOpinions.comment,
            targetCode: that.approvalOpinions.targetCode,
            variables: variables,
          };
          cancelApply(completeData).then((res) => {
            this.handleSelect("1");
            this.approvalOpinions.comment = null;
            this.taskFlow = [];
            this.$message.success(res.msg);
          });
        })
        .catch(function (v1) {
          that.msgError(v1);
        });
    },
    //重置
    resetProcess() {
      let that = this;
      let msg = "重置后, 状态将修改为[草稿],并返回到业务列表, 是否确认?";
      this.$confirm(msg, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let variables = {};
          let completeData = {
            taskId: that.nowTask.taskId,
            instanceId: that.nowTask.instanceId,
            processKey: that.nowTask.processKey,
            comment: that.approvalOpinions.comment,
            targetCode: that.approvalOpinions.targetCode,
            executionId: that.nowTask.executionId,
            variables: variables,
          };
          resetProcess(completeData).then((res) => {
            this.handleSelect("1");
            this.approvalOpinions.comment = null;
            this.taskFlow = [];
            this.$message.success(res.msg);
          });
        })
        .catch(function (v1) {
          that.msgError(v1);
        });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      const data = [];
      this.fetchData((res, refreshTotal) => {
        this.data = data.concat(res.rows);
        this.total = res.total;
        if (refreshTotal) {
          this.tabList[0].badgeTotal = res.total;
        }
        this.loading = false;
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.completeDateStart = null;
      this.queryParams.completeDateEnd = null;
      this.handleQuery();
    },
    datePickChange(val) {
      if (val && val.length > 0) {
        this.queryParams.completeDateStart = val[0];
        this.queryParams.completeDateEnd = val[1];
      } else {
        this.queryParams.completeDateStart = null;
        this.queryParams.completeDateEnd = null;
      }
    },
  },
  beforeDestroy() {
    this.$EventBus.$off("selectedSubcontractor");
  },
};
</script>

<style scoped lang="less">
.demo-infinite-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px 8px 0;
  max-height: 740px;
}

.demo-loading-container {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
}

.ant-layout {
  background: #ffffff;
}

.ant-layout-footer {
  background: #ffffff;
}

.important {
  color: #13227a;
  font-size: 13px;
}

/deep/ .ant-list-item {
  cursor: pointer;
}

/deep/ .ant-layout-sider-zero-width-trigger {
  right: -12px;
}

.curList {
  // border-left:2px solid #E0620D;
  box-shadow: 5px 0px 0px #e0620d inset;
}

.status {
  color: #e0620d;
  font-size: 13px;
  vertical-align: middle;
  text-align: center;
}
</style>

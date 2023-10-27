<template>
  <el-dialog
    class="elDialog"
    center
    width="60%"
    :visible.sync="dialogShow"
    :fullscreen="isFullScreen"
    :modal-append-to-body="false"
    :modal="false"
    :show-close="false"
    @open="open"
  >
    <div slot="title" class="dialog-title">
      <span class="topTilte">{{ titles }}</span>
      <div class="topRight">
        <!-- 最小化 -->
        <i
          class="el-icon-minus rightIcon"
          v-if="isFullScreen"
          @click="e_changeBox(false)"
        ></i>
        <!-- 最大化 -->
        <i
          class="el-icon-full-screen rightIcon"
          v-if="!isFullScreen"
          @click="e_changeBox(true)"
        ></i>
        <!-- 关闭 -->
        <i class="el-icon-close rightIcon" @click="cancelbtn"></i>
      </div>
    </div>
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      :prop="queryParams"
      style="margin: 15px 0 0 0"
      :rules="rules"
      label-width="120px"
    >
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="内审计划" name="0">
          <auditPlan ref="auditPlan" :firstTbsdata="firstTbsdata"></auditPlan>
        </el-tab-pane>
        <el-tab-pane label="内审通知" name="1">
          <div class="btnbox">
            <el-button
              type="primary"
              @click="addNotice"
              :disabled="progressEndStr.search('1') !=-1 || showType == 'show'"
              >添加
            </el-button>
            <el-button
              type="success"
              :disabled="!ids.length > 0"
              @click="handlePrint"
              >打印
            </el-button>
            <el-button
              type="primary"
              @click="next()"
              :disabled="progressEndStr.search('1') !=-1 || showType == 'show'"
              >完成
            </el-button>
          </div>
          <p class="tabtit">内审通知列表</p>
          <el-table
            ref="multipleTable"
            :data="auditData"
            stripe
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              label="序号"
              align="center"
              type="index"
              width="50"
            />
            <el-table-column
              prop="serial"
              label="内审通知编号"
              show-overflow-tooltip
            />
            <el-table-column
              prop="planSerial"
              label="内审计划编号"
              show-overflow-tooltip
            />
            <el-table-column
              prop="personNames"
              label="参加审核人员"
              show-overflow-tooltip
            />
            <el-table-column
              prop="meetingTime"
              label="审核时间"
              show-overflow-tooltip
            />
            <el-table-column
              prop="location"
              label="审核地点"
              show-overflow-tooltip
            />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleLook(scope.row.id)"
                  >查看
                </el-button>
                <template
                  v-if="!(progressEndStr.search('1') !=-1 || showType == 'show')"
                  style="margin-left: 10px"
                >
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleEdit(scope.row.id)"
                    >修改
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="deletenotice(scope.row)"
                    >删除
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="首次会议" name="2">
          <div class="btnbox">
            <el-button
              type="primary"
              @click="addFirstmeet"
              :disabled="progressEndStr.search('2') !=-1 || showType == 'show'"
              >添加
            </el-button>
            <el-button
              type="success"
              :disabled="!ids.length > 0"
              @click="handlePrint"
              >打印
            </el-button>
            <el-button
              type="primary"
              @click="next()"
              :disabled="progressEndStr.search('2') !=-1 || showType == 'show'"
              >完成
            </el-button>
          </div>
          <p class="tabtit">首次会议列表</p>
          <el-table
            ref="multipleTable"
            :data="firstmeetData"
            stripe
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              label="序号"
              align="center"
              type="index"
              width="50"
            />
            <el-table-column
              prop="serial"
              label="会议记录编号"
              show-overflow-tooltip
            />
            <el-table-column
              prop="planSerial"
              label="内审计划编号"
              show-overflow-tooltip
            />
            <el-table-column
              prop="name"
              label="会议名称"
              show-overflow-tooltip
            />
            <el-table-column prop="type" label="会议类型" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.type == 1">首次</span>
                <span v-if="scope.row.type == 2">末次</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="time"
              label="会议时间"
              show-overflow-tooltip
            />
            <el-table-column
              prop="groupLeader"
              label="审核组长"
              show-overflow-tooltip
            />
            <el-table-column
              prop="recorder"
              label="记录人"
              show-overflow-tooltip
            />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="firstLook(scope.row.id)"
                  >查看
                </el-button>
                <template
                  v-if="!(progressEndStr.search('2') !=-1 || showType == 'show')"
                  style="margin-left: 10px"
                >
                  <el-button
                    size="mini"
                    type="text"
                    @click="firstEdit(scope.row.id)"
                    >修改
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="firstdelete(scope.row)"
                    >删除
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="现场审核记录" name="3">
          <div class="btnbox">
            <el-button
              type="primary"
              @click="addscene"
              :disabled="progressEndStr.search('3') !=-1 || showType == 'show'"
              >添加
            </el-button>
            <el-button
              type="success"
              :disabled="!ids.length > 0"
              @click="handlePrint"
              >打印
            </el-button>
            <el-button
              type="primary"
              @click="next()"
              :disabled="progressEndStr.search('3') !=-1 || showType == 'show'"
              >完成
            </el-button>
          </div>
          <p class="tabtit">现场审核记录列表</p>
          <el-table
            ref="multipleTable"
            :data="sceneauditData"
            stripe
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              label="序号"
              align="center"
              type="index"
              width="50"
            />
            <el-table-column
              prop="serial"
              label="现场记录编号"
              show-overflow-tooltip
            />
            <el-table-column
              prop="planSerial"
              label="内审计划编号"
              show-overflow-tooltip
            />
            <el-table-column
              prop="deptName"
              label="受审部门"
              show-overflow-tooltip
            />
            <el-table-column
              prop="reviewer"
              label="内审员"
              show-overflow-tooltip
            />
            <el-table-column
              prop="updateTime"
              label="审核日期"
              show-overflow-tooltip
            />
            <el-table-column prop="status" label="状态" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.status === 1" style="color: #1cd0bd"
                  >待提交</span
                >
                <span v-if="scope.row.status === 2" style="color: #f5bb4a"
                  >审批中</span
                >
                <span v-if="scope.row.status === 3" style="color: #1182fb"
                  >已批准</span
                >
                <span v-if="scope.row.status === 4">已退回</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="sitelook(scope.row.id)"
                  >查看
                </el-button>
                <template
                  v-if="!(progressEndStr.search('3') !=-1 || showType == 'show')"
                  style="margin-left: 10px"
                >
                  <el-button
                    size="mini"
                    type="text"
                    @click="siteedit(scope.row.id)"
                    v-if="scope.row.status === 1 || scope.row.status === 4"
                    >修改
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="sitedelete(scope.row)"
                    v-if="scope.row.status === 1 || scope.row.status === 4"
                    >删除
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="不符合记录" name="4">
          <div class="btnbox">
            <el-button type="primary" @click="addinconform" :disabled="progressEndStr.search('4') !=-1 || showType == 'show'">添加 </el-button>
            <el-button
              type="success"
              :disabled="!ids.length > 0"
              @click="handlePrint"
              >打印
            </el-button>
            <el-button
              type="primary"
              @click="next()"
              :disabled="progressEndStr.search('4') !=-1 || showType == 'show'"
              >完成
            </el-button>
          </div>
          <p class="tabtit">不符合记录列表</p>
          <el-table
            ref="multipleTable"
            :data="inconformityData"
            stripe
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              label="序号"
              align="center"
              type="index"
              width="50"
            />
            <el-table-column
              prop="serial"
              label="不符合记录编号"
              show-overflow-tooltip
            />
            <el-table-column
              prop="planSerial"
              label="内审计划编号"
              show-overflow-tooltip
            />
            <el-table-column
              prop="deptName"
              label="受审部门"
              show-overflow-tooltip
            />
            <el-table-column
              prop="reviewer"
              label="内审员"
              show-overflow-tooltip
            />
            <el-table-column
              prop="factDescription"
              label="不符合项"
              show-overflow-tooltip
            />
            <el-table-column prop="status" label="状态" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.status === 1" style="color: #1cd0bd"
                  >待提交</span
                >
                <span v-if="scope.row.status === 2" style="color: #f5bb4a"
                  >审批中</span
                >
                <span v-if="scope.row.status === 3" style="color: #1182fb"
                  >已批准</span
                >
                <span v-if="scope.row.status === 4">已退回</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="noinconlook(scope.row.id)"
                  >查看
                </el-button>
                <template
                  v-if="!(progressEndStr.search('4') !=-1 || showType == 'show')"
                  style="margin-left: 10px"
                >
                  <el-button
                    size="mini"
                    type="text"
                    @click="noinconedit(scope.row.id)"
                    v-if="scope.row.status === 1 || scope.row.status === 4"
                    >修改
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="noincondelete(scope.row)"
                    v-if="scope.row.status === 1 || scope.row.status === 4"
                    >删除
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="不符合项跟踪验证" name="5">
          <div class="btnbox">
            <el-button
              type="primary"
              @click="addtask"
              :disabled="progressEndStr.search('5') !=-1 || showType == 'show'"
              >添加
            </el-button>
            <el-button
              type="success"
              :disabled="!ids.length > 0"
              @click="handlePrint"
              >打印
            </el-button>
            <el-button
              type="primary"
              @click="next()"
              :disabled="progressEndStr.search('5') !=-1 || showType == 'show'"
              >完成
            </el-button>
          </div>
          <p class="tabtit">不符合项跟踪验证列表</p>
          <el-table
            ref="multipleTable"
            :data="inconformitytrackData"
            stripe
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              label="序号"
              align="center"
              type="index"
              width="50"
            />
            <el-table-column
              prop="item"
              label="不符合项"
              show-overflow-tooltip
            />
            <el-table-column prop="type" label="类型" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.type == 1">一般不符合</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="measure"
              label="纠正措施"
              show-overflow-tooltip
            />
            <el-table-column
              prop="finishTime"
              label="完成日期"
              show-overflow-tooltip
            />
            <el-table-column
              prop="validation"
              label="有效性验证结果"
              show-overflow-tooltip
            />
            <el-table-column prop="remark" label="备注" show-overflow-tooltip />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="clauselook(scope.row.id)"
                  >查看
                </el-button>
                <template
                  v-if="!(progressEndStr.search('5') !=-1 || showType == 'show')"
                  style="margin-left: 10px"
                >
                  <el-button
                    size="mini"
                    type="text"
                    @click="clauseedit(scope.row.id)"
                    >修改
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="clausedelete(scope.row)"
                    >删除
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="末次会议" name="6">
          <div class="btnbox">
            <el-button
              type="primary"
              @click="addLastmeet"
              :disabled="progressEndStr.search('6') !=-1 || showType == 'show'"
              >添加
            </el-button>
            <el-button
              type="success"
              :disabled="!ids.length > 0"
              @click="handlePrint"
              >打印
            </el-button>
            <el-button
              type="primary"
              @click="next()"
              :disabled="progressEndStr.search('6') !=-1 || showType == 'show'"
              >完成
            </el-button>
          </div>
          <p class="tabtit">末次会议列表</p>
          <el-table
            ref="multipleTable"
            :data="lastmeetData"
            stripe
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              label="序号"
              align="center"
              type="index"
              width="50"
            />
            <el-table-column
              prop="serial"
              label="会议记录编号"
              show-overflow-tooltip
            />
            <el-table-column
              prop="planSerial"
              label="内审计划编号"
              show-overflow-tooltip
            />
            <el-table-column
              prop="name"
              label="会议名称"
              show-overflow-tooltip
            />
            <el-table-column prop="type" label="会议类型" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.type == 1">首次</span>
                <span v-if="scope.row.type == 2">末次</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="time"
              label="会议时间"
              show-overflow-tooltip
            />
            <el-table-column
              prop="groupLeader"
              label="审核组长"
              show-overflow-tooltip
            />
            <el-table-column
              prop="recorder"
              label="记录人"
              show-overflow-tooltip
            />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="lastlook(scope.row.id)"
                  >查看
                </el-button>
                <template
                  v-if="!(progressEndStr.search('2') !=-1 || showType == 'show')"
                  style="margin-left: 10px"
                >
                  <el-button
                    size="mini"
                    type="text"
                    @click="lastedit(scope.row.id)"
                    >修改
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="lastdelete(scope.row)"
                    >删除
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="内审报告" name="7">
          <div class="btnbox">
            <el-button
              type="primary"
              @click="addReport"
              :disabled="progressEndStr.search('7') !=-1 || showType == 'show'"
              >添加
            </el-button>
            <el-button
              type="success"
              :disabled="!ids.length > 0"
              @click="handlePrint"
              >打印
            </el-button>
            <el-button
              type="primary"
              @click="next()"
              :disabled="progressEndStr.search('7') !=-1 || showType == 'show'"
              >完成</el-button
            >
          </div>
          <p class="tabtit">内审报告列表</p>
          <el-table
            ref="multipleTable"
            :data="auditReportData"
            stripe
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              label="序号"
              align="center"
              type="index"
              width="50"
            />
            <el-table-column
              prop="planSerial"
              label="内审计划编号"
              show-overflow-tooltip
            />
            <el-table-column
              prop="purpose"
              label="内审目的"
              show-overflow-tooltip
            />
            <el-table-column
              prop="scope"
              label="内审范围"
              show-overflow-tooltip
            />
            <el-table-column
              prop="scope.row.groupLeaderName"
              label="内审组长"
              show-overflow-tooltip
            >
				<template slot-scope="scope">
<!--					{{scope.row.groupLeaderName.userName}}-->
					{{scope.row.groupLeaderName?JSON.parse(scope.row.groupLeaderName).userName:""}}
				</template>
			</el-table-column>
            <el-table-column prop="status" label="状态" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.status === 1" style="color: #1cd0bd"
                  >待提交</span
                >
                <span v-if="scope.row.status === 2" style="color: #f5bb4a"
                  >审批中</span
                >
                <span v-if="scope.row.status === 3" style="color: #1182fb"
                  >已批准</span
                >
                <span v-if="scope.row.status === 4">已退回</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="informlook(scope.row.id)"
                  >查看
                </el-button>
                <template
                  v-if="!(progressEndStr.search('7') !=-1 || showType == 'show')"
                  style="margin-left: 10px"
                >
                  <el-button
                    size="mini"
                    type="text"
                    @click="informedit(scope.row.id)"
                    v-if="scope.row.status === 1 || scope.row.status === 4"
                    >修改
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="informdelete(scope.row)"
                    v-if="scope.row.status === 1 || scope.row.status === 4"
                    >删除
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelbtn">取消</el-button>
    </div>
    <!--添加/查看/修改内审通知-->
    <auditNotice
      v-if="shownotice"
      ref="notices"
      @close="shownotice = false"
      @complete="complete"
    ></auditNotice>
    <!--添加/查看/修改首次会议-->
    <createMeet
      v-if="showmeet"
      ref="meeting"
      @close="showmeet = false"
      @firstmeet="firstmeet"
    ></createMeet>
    <!--添加/查看/修改现场审核记录-->
    <sceneAudit
      v-if="showscene"
      ref="scene"
      @close="showscene = false"
      @sence="sence"
    ></sceneAudit>
    <!--添加/查看/修改不符合记录-->
    <inconformity
      v-if="showinconform"
      ref="inconform"
      @close="showinconform = false"
      @completeone="completeone"
    ></inconformity>
    <!--添加/查看/修改不符合项跟踪验证-->
    <createTask
      v-if="showtask"
      ref="task"
      @close="showtask = false"
      @creat="creat"
    ></createTask>
    <!--添加/查看/修改末次会议-->
    <createlastMeet
      v-if="showlastmeet"
      ref="lastmeeting"
      @close="showlastmeet = false"
      @lastmeet="lastmeet"
    ></createlastMeet>
    <!--添加/查看/修改内审报告-->
    <auditReport
      v-if="showreport"
      ref="report"
      @close="showreport = false"
      @reportdata="reportdata"
    ></auditReport>
    <!-- 公共分页子组件 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </el-dialog>
</template>

<script>
import auditPlan from "./implement/auditPlan";
import auditNotice from "./implement/auditNotice";
import createMeet from "./implement/createMeet";
import sceneAudit from "./implement/sceneAudit";
import inconformity from "./implement/inconformity";
import createTask from "./implement/createTask";
import createlastMeet from "./implement/createlastMeet";
import auditReport from "./implement/auditReport";
import {
  noticelist,
  meetlist,
  spotlist,
  inconformitylist,
  checklist,
  reportlist,
  noticedetail,
  meetdelete,
  spotdelete,
  inconformitydelete,
  checkdelete,
  reportdelete,
  auditdetail,
  noticedelete,
  spotdetail,
  inconformitydetail,
  checkdetail,
  reportdetail,
  meetdetail,
  auditstatus,
  finishAuditPlan
} from "@/api/mass/config";

export default {
  name: "createPlan",
  components: {
    auditPlan,
    auditNotice,
    createMeet,
    sceneAudit,
    inconformity,
    createTask,
    createlastMeet,
    auditReport,
  },
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        planId: "",
        type: "",
        deptName: null,
        deptId: null,
      },
      dialogShow: false,
      isFullScreen: true,
      screenName: "fullScreen",
      titles: "实施",
      showType: "add",
      activeName: "",
      rules: {},
      isdisable: false,
      total: 0,
      auditData: [],
      firstmeetData: [],
      sceneauditData: [],
      inconformityData: [],
      inconformitytrackData: [],
      auditReportData: [],
      lastmeetData: [],
      shownotice: false,
      showmeet: false,
      showscene: false,
      showinconform: false,
      showtask: false,
      showlastmeet: false,
      showreport: false,
      objdata: {},
      ids: [],
      tabIndex: "1",
      formData: [],
      progress: "",
      shuaxin: false,
      firstTbsdata: {},
      progressEndStr: ''
    };
  },
  computed: {
    getLeftWidth() {
      return this.$store.state.app.leftWidth;
    },
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
        this.titles = "实施";
      } else if (val == "update") {
        this.titles = "修改";
      } else if (val == "show") {
        this.titles = "查看";
        this.isdisable = true;
      }
    },
    progress(val) {
      console.log(val);
      switch (val) {
        case 0:
          this.activeName = "0";
        case 1:
          this.activeName = "1";
          break;
        case 2:
          this.activeName = "2";
          break;
        case 3:
          this.activeName = "3";
          break;
        case 4:
          this.activeName = "4";
          break;
        case 5:
          this.activeName = "5";
          break;
        case 6:
          this.activeName = "6";
          break;
        default:
          this.activeName = "7";
      }
      this.shuaxin = true;
    },
  },
  props: {
    id: 0,
    disabled: false,
  },
  methods: {
    /***多选框选中数据***/
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
    },
    // 打印
    handlePrint() {
      console.log(this.ids);
      var ids = this.ids.join(",");
      if (this.activeName === "1") {
        console.log(1111);
        // 1、获取选中行
        POBrowser.openWindowModeless(
          process.env.VUE_APP_BASE_API +
            "/qualityControl/pageOffice/printAuditPlanNotice?ids=" +
            ids,
          "width=1440px;height=860px"
        );
      } else if (this.activeName === "2") {
        POBrowser.openWindowModeless(
          process.env.VUE_APP_BASE_API +
            "/qualityControl/pageOffice/printAuditPlanMeeting?ids=" +
            ids,
          "width=1440px;height=860px"
        );
      } else if (this.activeName === "3") {
        // 1、获取选中行
        POBrowser.openWindowModeless(
          process.env.VUE_APP_BASE_API +
            "/qualityControl/pageOffice/printSiteAuditRecord?ids=" +
            ids,
          "width=1440px;height=860px"
        );
      } else if (this.activeName === "4") {
        // 1、获取选中行
        POBrowser.openWindowModeless(
          process.env.VUE_APP_BASE_API +
            "/qualityControl/pageOffice/pringInternalAuditDoesNotMeet?ids=" +
            ids,
          "width=1440px;height=860px"
        );
      } else if (this.activeName === "5") {
        // 1、获取选中行
        POBrowser.openWindowModeless(
          process.env.VUE_APP_BASE_API +
            "/qualityControl/pageOffice/printCorrectiveActionTracking?ids=" +
            ids,
          "width=1440px;height=860px"
        );
      } else if (this.activeName === "6") {
        POBrowser.openWindowModeless(
          process.env.VUE_APP_BASE_API +
            "/qualityControl/pageOffice/printAuditPlanMeeting?ids=" +
            ids,
          "width=1440px;height=860px"
        );
      } else if (this.activeName === "7") {
        // 1、获取选中行
        POBrowser.openWindowModeless(
          process.env.VUE_APP_BASE_API +
            "/qualityControl/pageOffice/printInternalAuditReport?ids=" +
            ids,
          "width=1440px;height=860px"
        );
      }
    },
    complete() {
      this.shownotice = false;
      this.getList();
    },
    completeone() {
      this.showinconform = false;
      this.getList();
    },
    firstmeet() {
      this.showmeet = false;
      this.getList();
    },
    sence() {
      this.showscene = false;
      this.getList();
    },
    creat() {
      this.showtask = false;
      this.getList();
    },
    lastmeet() {
      this.showlastmeet = false;
      this.getList();
    },
    reportdata() {
      this.showreport = false;
      this.getList();
    },
    open() {
      this.getList();
    },
    e_changeBox(type) {
      this.isFullScreen = type;
    },
    // 获取列表数据
    handleClick(tab, index) {
      this.ids = [];
      console.log(tab, index);
      this.activeName = tab.name;
      this.tabIndex = tab.index;
      this.queryParams.pageNum = 1;
      this.getList();
    },
    getList() {
      this.queryParams.planId = this.objdata.id;
      console.log(this.activeName);
      noticelist(this.queryParams).then((response) => {
        this.auditData = response.data.list;
        this.total = response.data.total;
        this.loading = false;
		  this.auditData.map((item) => {
			  let list = item.personNames.split(',')
			  let arr = []
			  list.map((item1) => {
				  arr.push(item1)
			  })
			  arr = this.repeat(arr)
			  item.personNames = arr.join(',')
		  })
      });
      if (this.activeName == "2") {
        this.queryParams.type = 1;
        console.log("首次会议", this.queryParams);
        meetlist(this.queryParams).then((response) => {
          this.firstmeetData = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        });
      } else if (this.activeName == "3") {
        spotlist(this.queryParams).then((response) => {
          this.sceneauditData = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        });
      } else if (this.activeName == "4") {
        inconformitylist(this.queryParams).then((response) => {
          this.inconformityData = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        });
      } else if (this.activeName == "5") {
        checklist(this.queryParams).then((response) => {
          this.inconformitytrackData = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        });
      } else if (this.activeName == "6") {
        this.queryParams.type = 2;
        console.log("末次会议", this.queryParams);
        meetlist(this.queryParams).then((response) => {
          this.lastmeetData = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        });
      } else if (this.activeName == "7") {
        reportlist(this.queryParams).then((response) => {
          this.auditReportData = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        });
      }
    },
	  repeat(data) {
		  for (let i = 0; i < data.length - 1; i++) {
			  for (let j = 1; j < data.length; j++) {
				  if (i != j) {
					  if (data[i] == data[j]) {
						  data.splice(j, 1)
						  j--
					  }
				  }
			  }
		  }
		  return data
	  },
    // 点击完成进行tab切换，关闭弹框后改变表格内当前进度
    next() {
      const params = {
        planId: this.id,
        progress: parseInt(this.activeName),
      };
      if (this.activeName === "3" || this.activeName === "4" || this.activeName === "7") {
        var status = [];
        for (var i in this.sceneauditData) {
          status.push(this.sceneauditData[i].status);
          console.log(this.sceneauditData[i].status);
        }
        if (status.indexOf(1) != -1 || status.indexOf(2) != -1) {
          // this.$message.error("有待审核的记录，确定完成此阶段吗？");
          this.$confirm("有待审核的记录，确定完成此阶段吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            this.changeStatus(params);
          });
        } else {
          this.changeStatus(params);
        }
      } else {
        this.changeStatus(params);
      }
    },
    changeStatus(params) {
      // params.progress = params.progress - 1
      auditstatus(params).then((res) => {
        if (res.code === 200) {
          this.progress = params.progress;
          this.activeName = (this.activeName - 0 + 1).toString();
          console.log('activeName',this.activeName)
          console.log(this.progress)
          this.getList();
          this.getFinish()
        }
      });
    },
    auditOk() {
      this.cancelbtn();
    },
    init(show, data) {
      this.progress = data.progress - 0;
      // this.activeName = (data.progress - 0 + 1).toString();
      console.log(data.progress - 0 - 1);
      this.showType = show;
      this.id = data.id;
      this.dialogShow = true;
      this.objdata = data;
      console.log(data)
      auditdetail(data.id).then((res) => {
        console.log(res);
        this.firstTbsdata = res.data;
        console.log('内审计划',this.firstTbsdata)
        // this.$nextTick(() => {
        //   this.$refs.auditPlan.init(res.data);
        // });
        this.formData = {
          planSerial: res.data.serial,
          planId: res.data.id,
        };
        this.threeData = {
          planSerial: res.data.serial,
          planId: res.data.id,
          type: 1,
          // listdata: this.auditData,
        };
        this.fourData = {
          planSerial: res.data.serial,
          planId: res.data.id,
        };
        this.fiveData = {
          planSerial: res.data.serial,
          planId: res.data.id,
        };
        this.sixData = {
          planSerial: res.data.serial,
          planId: res.data.id,
          status: res.data.status,
        };
        this.sevenData = {
          planSerial: res.data.serial,
          planId: res.data.id,
          type: 2,
        };
        this.eightData = {
          planSerial: res.data.serial,
          planId: res.data.id,
        };
      });
      this.getFinish()
    },
    // 完成情况
    getFinish () {
      finishAuditPlan(this.id).then(res => {
        console.log(res)
        if (res.data.progressEndStr === null) {
          this.progressEndStr = '0'
        } else {
          this.progressEndStr = res.data.progressEndStr
        }
      })
    },
    // 内审通知添加
    addNotice() {
      this.shownotice = true;
      this.$nextTick(() => {
        this.$refs.notices.init("add", this.formData, '');
      });
    },
    // 内审通知修改
    handleEdit(id) {
      this.shownotice = true;
      this.getdetail(id, "update");
    },
    // 内审通知查看
    handleLook(id) {
      this.shownotice = true;
      this.getdetail(id, "show");
    },
    // 内审通知获取详情
    getdetail(id, type) {
      noticedetail(id).then((res) => {
        this.$nextTick(() => {
          this.$refs.notices.init(type, res.data, '');
        });
      });
    },
    // 首次会议添加
    addFirstmeet() {
      this.showmeet = true;
      this.$nextTick(() => {
        this.$refs.meeting.init("add", this.threeData);
      });
    },
    // 首次会议修改
    firstEdit(id) {
      this.showmeet = true;
      this.firstdetail(id, "update");
    },
    // 首次会议查看
    firstLook(id) {
      this.showmeet = true;
      this.firstdetail(id, "show");
    },
    // 首次会议获取详情
    firstdetail(id, type) {
      meetdetail(id).then((res) => {
        this.$nextTick(() => {
          this.$refs.meeting.init(type, res.data);
        });
      });
    },
    // 现场审核记录添加
    addscene() {
      this.showscene = true;
      this.$nextTick(() => {
        this.$refs.scene.init("add", this.fourData);
      });
    },
    // 现场审核记录修改
    siteedit(id) {
      this.showscene = true;
      this.sitedetail(id, "update");
    },
    // 现场审核记录查看
    sitelook(id) {
      this.showscene = true;
      this.sitedetail(id, "show");
    },
    // 现场审核记录获取详情
    sitedetail(id, type) {
      spotdetail(id).then((res) => {
        this.$nextTick(() => {
          this.$refs.scene.init(type, res.data);
        });
      });
    },
    // 不符合记录添加
    addinconform() {
      this.showinconform = true;
      this.$nextTick(() => {
        this.$refs.inconform.init("add", this.fiveData);
      });
    },
    // 不符合记录修改
    noinconedit(id) {
      this.showinconform = true;
      this.noincodetail(id, "update");
    },
    // 不符合记录查看
    noinconlook(id) {
      this.showinconform = true;
      this.noincodetail(id, "show");
    },
    // 不符合记录获取详情
    noincodetail(id, type) {
      inconformitydetail(id).then((res) => {
        this.$nextTick(() => {
          this.$refs.inconform.init(type, res.data);
        });
      });
    },
    // 不符合项跟踪验证添加
    addtask() {
      console.log(this.inconformityData);
      this.showtask = true;
      this.$nextTick(() => {
        this.$refs.task.init("add", this.sixData);
      });
    },
    // 不符合项跟踪验证修改
    clauseedit(id) {
      this.showtask = true;
      this.clausedetail(id, "update");
    },
    // 不符合项跟踪验证查看
    clauselook(id) {
      this.showtask = true;
      this.clausedetail(id, "show");
    },
    // 不符合项跟踪验证获取详情
    clausedetail(id, type) {
      checkdetail(id).then((res) => {
        this.$nextTick(() => {
          this.$refs.task.init(type, res.data);
        });
      });
    },
    // 末次会议添加
    addLastmeet() {
      this.showlastmeet = true;
      this.$nextTick(() => {
        this.$refs.lastmeeting.init("add", this.sevenData);
      });
    },
    // 末次会议修改
    lastedit(id) {
      this.showlastmeet = true;
      this.lastdetail(id, "update");
    },
    // 末次会议查看
    lastlook(id) {
      this.showlastmeet = true;
      this.lastdetail(id, "show");
    },
    // 末次会议获取详情
    lastdetail(id, type) {
      meetdetail(id).then((res) => {
        this.$nextTick(() => {
          this.$refs.lastmeeting.init(type, res.data);
        });
      });
    },
    // 内审报告添加
    addReport() {
      this.showreport = true;
      this.$nextTick(() => {
        this.$refs.report.init("add", this.eightData);
      });
    },
    // 内审报告修改
    informedit(id) {
      this.showreport = true;
      this.informdetail(id, "update");
    },
    // 内审报告查看
    informlook(id) {
      this.showreport = true;
      this.informdetail(id, "show");
    },
    // 内审报告获取详情
    informdetail(id, type) {
      reportdetail(id).then((res) => {
        this.$nextTick(() => {
          this.$refs.report.init(type, res.data);
          console.log('res.data',res.data)
        });
      });
    },
    cancelbtn() {
      this.$emit("close", this.shuaxin);
    },
    // 内审通知删除
    deletenotice(row) {
      this.$confirm("确定删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        noticedelete(row.id).then((res) => {
          if (res.code == 200) {
            this.$message.success("删除成功");
            this.getList();
          } else {
            this.$message.info(res.msg);
          }
        });
      });
    },
    // 首次会议删除
    firstdelete(row) {
      this.$confirm("确定删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        meetdelete(row.id).then((res) => {
          if (res.code == 200) {
            this.$message.success("删除成功");
            this.getList();
          } else {
            this.$message.info(res.msg);
          }
        });
      });
    },
    // 现场审核记录删除
    sitedelete(row) {
      this.$confirm("确定删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        spotdelete(row.id).then((res) => {
          if (res.code == 200) {
            this.$message.success("删除成功");
            this.getList();
          } else {
            this.$message.info(res.msg);
          }
        });
      });
    },
    // 不符合记录删除
    noincondelete(row) {
      this.$confirm("确定删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        inconformitydelete(row.id).then((res) => {
          if (res.code == 200) {
            this.$message.success("删除成功");
            this.getList();
          } else {
            this.$message.info(res.msg);
          }
        });
      });
    },
    // 不符合项跟踪验证删除
    clausedelete(row) {
      this.$confirm("确定删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        checkdelete(row.id).then((res) => {
          if (res.code == 200) {
            this.$message.success("删除成功");
            this.getList();
          } else {
            this.$message.info(res.msg);
          }
        });
      });
    },
    // 末次会议删除
    lastdelete(row) {
      this.$confirm("确定删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        meetdelete(row.id).then((res) => {
          if (res.code == 200) {
            this.$message.success("删除成功");
            this.getList();
          } else {
            this.$message.info(res.msg);
          }
        });
      });
    },
    // 内审报告删除
    informdelete(row) {
      this.$confirm("确定删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        reportdelete(row.id).then((res) => {
          if (res.code == 200) {
            this.$message.success("删除成功");
            this.getList();
          } else {
            this.$message.info(res.msg);
          }
        });
      });
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .el-dialog__body .el-col {
  margin-bottom: 0;
}

.tabtit {
  display: flex;
  justify-content: space-between;
  align-content: center;

  span {
    font-size: 14px;
    color: #3c4353;
    font-weight: bold;
  }
}

/deep/ .el-dialog__body .el-table {
  background-color: #fff;
}

.btnbox {
  border-bottom: 1px solid #dfe4ed;
  padding-bottom: 15px;
}

.tabtit {
  font-size: 14px;
  color: #333333;
  font-weight: bold;
  padding: 10px 10px 0;
}
</style>

<template>
  <div>
    <!-- 环境查询页面的弹框 -->
    <el-dialog
      :visible.sync="editShow"
      :fullscreen="dialogFull"
      :before-close="handleClose"
      @open="open"
    >
      <template slot="title">
        <div class="avue-crud__dialog__header">
          <h2>环境区域：{{ spotCheckRecordParams.areaName }}</h2>
          <h4>
            温度管控范围：<span
          >{{ spotCheckRecordParams.minTemperature
              }}{{ spotCheckRecordParams.temperatureUnit }} -
              {{ spotCheckRecordParams.maxTemperature
              }}{{ spotCheckRecordParams.temperatureUnit }}</span
          >
          </h4>
          <h4>
            湿度管控范围：<span
          >{{ spotCheckRecordParams.minHumidity
              }}{{ spotCheckRecordParams.humidityUnit }} -
              {{ spotCheckRecordParams.maxHumidity
              }}{{ spotCheckRecordParams.humidityUnit }}
            </span>
          </h4>
          <h4>
            气压管控范围：
            <span
            >{{ spotCheckRecordParams.minPressure
              }}{{ spotCheckRecordParams.pressureUnit }} -
              {{ spotCheckRecordParams.maxPressure }}
              {{ spotCheckRecordParams.pressureUnit }}</span
            >
          </h4>
          <div
            class="avue-crud__dialog__menu"
            @click="dialogFull ? (dialogFull = false) : (dialogFull = true)"
          >
            <i class="el-icon-full-screen"></i>
          </div>
        </div>
      </template>
      <el-form :model="recordParams" ref="recordForm" :inline="true">
        <el-form-item label="查询日期">
          <el-date-picker
            v-model="recordParams.createTimeStart"
            class="input-with-select"
            type="date"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          ></el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="recordParams.createTimeEnd"
            class="input-with-select"
            type="date"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>

        <el-form-item class="card">
          <el-button
            type="cyan"
            icon="el-icon-search"
            size="mini"
            @click="getuser"
          >搜索
          </el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetuser"
          >重置
          </el-button
          >
        </el-form-item>
        <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="环境记录" name="first">
            <div class="contr">
              <el-button type="primary" @click="checkby = true">点检</el-button>

              <el-button type="success">打印</el-button>
              <el-button type="warning" @click="handleExport" v-if="isShowExportButton">导出</el-button>
              <el-button v-for="(v, i) in environmentalrecordsButtonList.entrySlotButtonList" :key="i" :type="v.type"
                         :size="v.size" @click="e_slotButtonEvents(v)">{{
                v.label }}
              </el-button>
            </div>
            <el-table :data="tableData" stripe border v-loading="loading">
              <el-table-column
                prop="id"
                label="序号"
                align="center"
                width="55px"
              >
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="日期"
                align="center"
                sortable
                prop="recordDate"
              />
              <el-table-column
                label="时间"
                align="center"
                sortable
                prop="recordTime"
              />
              <el-table-column
                label="点检人员"
                align="center"
                sortable
                prop="createBy"
              />
              <el-table-column
                :label="`温度(${spotCheckRecordParams.temperatureUnit})`"
                align="center"
                sortable
                prop="temperature"
              />
              <el-table-column
                :label="`湿度(${spotCheckRecordParams.humidityUnit})`"
                align="center"
                sortable
                prop="humidity"
              />
              <el-table-column
                :label="`气压(${spotCheckRecordParams.pressureUnit})`"
                align="center"
                sortable
                prop="pressure"
              />
              <el-table-column
                label="备注"
                align="center"
                sortable
                prop="remark"
              />
              <el-table-column
                label="操作"
                align="center"
                sortable
                width="200px"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    @click="(pastcard = true), spll(scope.row.id)"
                  >历史
                  </el-button
                  >
                  <el-button
                    size="mini"
                    type="text"
                    @click="(amend = true), handlls(scope.row.id)"
                  >修改
                  </el-button
                  >
                  <el-button
                    size="mini"
                    type="text"
                    @click="e_delete(scope.row)"
                  >删除
                  </el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="环境曲线">
            <template v-if="showeatch">
              <div class="chartBox">
                <el-row :gutter="20">
                  <el-col :span="11">
                    <div class="chartcont">
                      <div class="chartit">
                        <p>温度曲线图</p>
                      </div>
                      <addcharts
                        :chartreportList="chartreportList"
                        v-if="refsh"
                      ></addcharts>
                    </div>
                  </el-col>
                  <el-col :span="11">
                    <div class="chartcont">
                      <div class="chartit">
                        <p>湿度曲线图</p>
                      </div>
                      <addchll
                        :chartreport="chartreport"
                        v-if="refsh"
                      ></addchll>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="11">
                    <div class="chartcont">
                      <div class="chartit">
                        <p>气压曲线图</p>
                      </div>
                      <addsll :chart="chart" v-if="refsh"></addsll>
                    </div>
                  </el-col>
                  <el-col :span="11">
                    <el-table :data="overtable" border center stripe>
                      <h4>环境预警</h4>
                      <el-table-column
                        prop="id"
                        label="序号"
                        align="center"
                        width="55px"
                      >
                        <template slot-scope="scope">
                          <span>{{ scope.$index + 1 }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="日期" prop="createTime"/>
                      <el-table-column
                        label="预警类型"
                        prop="wariningContent"
                      />
                    </el-table>
                  </el-col>
                </el-row>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 分页 -->
      <pagination
        v-if="temp == 'second'"
        v-show="total > 0"
        :total="total"
        :page.sync="recordParams.pageNum"
        :limit.sync="recordParams.pageSize"
      />
    </el-dialog>
    <!-- 点检的模态框 -->
    <el-dialog
      :visible.sync="checkby"
      :fullscreen="dialogFull"
      @close="handlell"
    >
      <template slot="title">
        <div class="avue-crud__dialog__header">
          <span class="el-dialog__title"> 点检 </span>
          <div
            class="avue-crud__dialog__menu"
            @click="dialogFull ? (dialogFull = false) : (dialogFull = true)"
          >
            <i class="el-icon-full-screen"></i>
          </div>
        </div>
      </template>
      <el-form ref="addform" :model="addform" label-width="180px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="点检时间" prop="createTime">
              <el-input
                v-model="addform.createTime"
                disabled
                style="width: 97.5%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="点检人员" prop="createBy">
              <el-input
                v-model="addform.createBy"
                disabled
                style="width: 97.5%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" style="padding-left: 0">
            <el-form-item label="温度" prop="temperature">
              <el-col :span="21">
                <el-input v-model="addform.temperature"></el-input>
              </el-col>
              <el-col
                :span="2"
                style="padding-left: 0px; padding-right: 0px; width: 10%"
              >
                <el-input
                  style="text-align: center"
                  v-model="spotCheckRecordParams.temperatureUnit"
                  disabled
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="padding-left: 0">
            <el-form-item label="湿度" prop="humidity">
              <el-col :span="21">
                <el-input v-model="addform.humidity"></el-input>
              </el-col>

              <el-col
                :span="2"
                style="padding-left: 0px; padding-right: 0px; width: 10%"
              >
                <el-input
                  style="text-align: center"
                  v-model="spotCheckRecordParams.humidityUnit"
                  disabled
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" style="padding-left: 0">
            <el-form-item label="气压" prop="pressure">
              <el-col :span="21">
                <el-input v-model="addform.pressure"></el-input>
              </el-col>

              <el-col
                :span="2"
                style="padding-left: 0px; padding-right: 0px; width: 10%"
              >
                <el-input
                  style="text-align: center"
                  v-model="spotCheckRecordParams.pressureUnit"
                  disabled
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="addform.remark" style="width: 99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="异常情况记录及处理" prop="exceptionHandlingRecord">
              <el-input v-model="addform.exceptionHandlingRecord" style="width: 99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="footer">
        <!-- 触发点检的逻辑 -->
        <el-button type="primary" @click="addAdmin()">确定</el-button>
        <el-button @click="checkby = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 历史模态框 -->
    <el-dialog :visible.sync="pastcard" :fullscreen="dialogFull">
      <template slot="title">
        <div class="avue-crud__dialog__header">
          <span class="el-dialog__title"> 历史 </span>
          <div
            class="avue-crud__dialog__menu"
            @click="dialogFull ? (dialogFull = false) : (dialogFull = true)"
          >
            <i class="el-icon-full-screen"></i>
          </div>
        </div>
      </template>
      <el-table :data="historyData" stripe border>
        <el-table-column prop="date" label="序号" align="center" width="55px">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="修改内容"
          align="center"
          sortable
          prop="valueContent"
        />
        <el-table-column
          label="修改前"
          align="center"
          sortable
          prop="beforeValue"
        />
        <el-table-column
          label="修改后"
          align="center"
          sortable
          prop="afterValue"
        />
        <el-table-column
          label="修改人"
          align="center"
          sortable
          prop="createBy"
        />
        <el-table-column
          label="修改时间"
          align="center"
          sortable
          prop="createTime"
        />
        <el-table-column
          label="修改原因"
          align="center"
          sortable
          prop="reason"
        />
      </el-table>
    </el-dialog>
    <!-- 修改的模态框 -->
    <el-dialog :visible.sync="amend" :fullscreen="dialogFull" @close="handlel">
      <template slot="title">
        <div class="avue-crud__dialog__header">
          <span class="el-dialog__title"> 修改 </span>
          <div
            class="avue-crud__dialog__menu"
            @click="dialogFull ? (dialogFull = false) : (dialogFull = true)"
          >
            <i class="el-icon-full-screen"></i>
          </div>
        </div>
      </template>
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="点检时间" prop="createTime">
              <el-input
                v-model="form.createTime"
                disabled
                style="width: 97.5%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="点检人员" prop="createBy">
              <el-input
                v-model="form.createBy"
                disabled
                style="width: 97.5%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="修改时间" prop="updateTime">
              <el-input
                v-model="form.updateTime"
                disabled
                style="width: 97.5%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修改人员" prop="updateBy">
              <el-input
                v-model="form.updateBy"
                disabled
                style="width: 97.5%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" style="padding-left: 0">
            <el-form-item label="温度" prop="temperature">
              <el-col :span="21">
                <el-input v-model="form.temperature"></el-input>
              </el-col>
              <el-col
                :span="2"
                style="padding-left: 0px; padding-right: 0px; width: 10%"
              >
                <el-input
                  style="text-align: center"
                  v-model="spotCheckRecordParams.temperatureUnit"
                  disabled
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="padding-left: 0">
            <el-form-item label="湿度" prop="humidity">
              <el-col :span="21">
                <el-input v-model="form.humidity"></el-input>
              </el-col>

              <el-col
                :span="2"
                style="padding-left: 0px; padding-right: 0px; width: 10%"
              >
                <el-input
                  style="text-align: center"
                  v-model="spotCheckRecordParams.humidityUnit"
                  disabled
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" style="padding-left: 0">
            <el-form-item label="气压" prop="pressure">
              <el-col :span="21">
                <el-input v-model="form.pressure"></el-input>
              </el-col>

              <el-col
                :span="2"
                style="padding-left: 0px; padding-right: 0px; width: 10%"
              >
                <el-input
                  style="text-align: center;"
                  v-model="spotCheckRecordParams.pressureUnit"
                  disabled
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="修改原因" prop="reason">
              <el-input v-model="form.reason" style="width: 99%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="footer">
        <!-- 触发修改的逻辑 -->
        <el-button type="primary" @click="edcoin()">确定</el-button>
        <el-button @click="amend = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <pagination
      v-if="temp == 'second'"
      v-show="total > 0"
      :total="total"
      :page.sync="historyform.pageNum"
      :limit.sync="historyform.pageSize"
    />
  </div>
</template>
<script>
  import {
    histo,
    edia,
    lookfor,
    addeven,
    detellos,
    selechart,
    historylist,
    exportAreaRecord
  } from "@/api/ctactl/config";
  import moment from "moment";
  import addcharts from "./addcharts.vue";
  import addchll from "./addchll.vue";
  import addsll from "./addsll.vue";
  import {mapState} from "vuex";

  export default {
    data() {
      return {
        recordParams: {
          pageNum: 1,
          id: null,
          testAreaId: null,
          pageSize: 10,
          temperature: null,
          humidity: null,
          pressure: null,
          remark: null,
          createBy: null,
          createTime: null,
          recordDate: null,
          recordTime: null,
          createTimeStart: moment(moment().startOf("month").toDate()).format("YYYY-MM-DD"),
          createTimeEnd: moment().format("YYYY-MM-DD"),
          areaName: "",
        },
        form: {
          id: null,
          testAreaId: null,
          testAreaRecordId: null,
          pageNum: 1,
          pageSize: 100,
          createBy: this.$store.state.user.userInfo.nickName,
          createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
          updateTime: "",
          updateBy: "",
        },
        spotCheckRecordParams: {
          temperatureUnit: "",
          humidityUnit: "",
          pressureUnit: "",
        },
        addform: {
          id: null,
          testAreaId: null,
          testAreaRecordId: null,
          pageNum: 1,
          pageSize: 100,
          createBy: this.$store.state.user.userInfo.nickName,
          createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
        historyform: {
          pageNum: 1,
          pageSize: 100,
          testAreaRecordId: null,
        },
        listform: {
          createTimeStart: "",
          createTimeEnd: "",
          testAreaId: "",
          pageNum: 1,
          pageSize: 100,
        },
        // 参数表格数据
        tableData: [],
        overtable: [],
        tablelist: [],
        addsll: [],
        overdueEntrust: [],
        chartacceptList: [],
        EnvSpotCheckDatas: [],
        chartreportList: [],
        chartreport: [],
        chart: [],
        activeName: "first",
        loading: false,
        dialogFull: true,
        pastcard: false,
        temp: "",
        title: "", //标题
        amend: false,
        activeIndex: "",
        checkby: false,
        refsh: true,
        historyData: [],
        chartList: [],
        spotCheckRecordParams: [],
        isShowExportButton: true,
        environmentalrecordsButtonList: {
          actionButtons: [],
          entrySlotButtonList: []
        },
        rules: {
          reason: [
            {required: true, message: "请填写修改原因", trigger: "blur"},
          ],
        },
        showeatch: false,
      };
    },
    props: {
      editShow: {
        type: Boolean,
        default: false,
      },
      spotCheckRecordParams: "",
      spotCheckRecordId: "",
    },
    computed: {
      ...mapState({
        user: (state) => state.user.userInfo,
      }),
    },
    components: {addcharts, addchll, addsll},
    mounted() {
    },
    async created() {
      // 导出
      this.environmentalrecordsButtonList = await this.getProjectSlotButtons('environmentalrecords')
      this.isShowExportButton = !this.environmentalrecordsButtonList.entrySlotButtonList.some(item => item.label == '导出')
    },
    methods: {
      /**
       * @author Coder
       * @date 2023/4/20
       * @des 处理table action表格按钮
       */
      checkActionButton(events, scope) {
        return eval(events)
      },
      /**
       * @author Coder
       * @date 2023/4/20
       * @des 插槽按钮事件
       */
      e_slotButtonEvents(v) {
        var that = this
        new Function('that', v.events)(that)
      },
      e_actionButtonEvents(v, scope) {
        var that = this
        new Function('that', 'scope', v.clickEvents)(that, scope)
      },
      handleExport() {
        let TestAreaSearchParam = {
          ...this.recordParams,
        }
        TestAreaSearchParam.id = this.recordParams.testAreaId
        delete TestAreaSearchParam.pageNum
        delete TestAreaSearchParam.pageSize
        exportAreaRecord(TestAreaSearchParam).then((res) => {
          if (res.code == 200) {
            this.$message.success("导出成功");
            this.downLoadFile(res.msg)
          }
        });
        console.log(this.queryform)
      },
      handleClick(tab, event) {
        console.log(tab.index);
        if (tab.index === "1") {
          this.getdataList();
          this.showeatch = true;
        } else {
          this.showeatch = false;
        }
      },
      open() {
        this.form.createBy = this.user.createBy;
        this.addform.createTime = moment().format("YYYY-MM-DD HH:mm:ss");
        this.getenvionList();
        this.refsh = true;
        // this.getdataList()
      },
      getenvionList() {
        this.recordParams.testAreaId = this.spotCheckRecordParams.id;
        histo(this.recordParams).then((response) => {
          this.tableData = response.data.pageList.list;
          this.total = response.data.pageList.total;
          this.loading = false;
        });
      },
      // 查询
      getuser() {
        this.recordParams.pageNum = 1;
        this.getenvionList();
      },
      // 重置
      resetuser() {
        this.recordParams = {
          createTimeStart: moment(moment().startOf("month").toDate()).format("YYYY-MM-DD"),
          createTimeEnd: moment().format("YYYY-MM-DD"),
          pageNum: 1,
          pageSize: 10,
          testAreaId: "",
        };
        this.getuser();
      },
      // 关闭
      handleClose() {
        this.$emit("close");
        this.activeName = "first";
        this.refsh = false;
      },
      // 点检的功能
      addAdmin(id) {
        this.addform.createTime = moment().format("YYYY-MM-DD HH:mm:ss");
        this.addform.testAreaId = this.spotCheckRecordParams.id;
        if (this.addform.testAreaId != null) {
          addeven(this.addform).then((response) => {
            if (response.code === 200) {
              this.$message.success("添加成功");
              this.getenvionList();
              // this.getdataList()
              this.checkby = false;
            }
          });
        }
      },

      // 点检后对表单进行清空
      handlell() {
        for (let key in this.addform) {
          this.addform.createBy = this.$store.state.user.userInfo.nickName;
          this.addform.createTime = moment().format("YYYY-MM-DD HH:mm:ss");
          this.addform[key] = "";
        }
      },
      // 编辑前的回显
      handlls(id) {
        lookfor(id).then((res) => {
          this.form = res.data;
          this.form.updateBy = this.$store.state.user.userInfo.nickName;
          (this.form.updateTime = moment().format("YYYY-MM-DD HH:mm:ss")),
            this.form;
        });
      },
      // 编辑的逻辑
      edcoin(val) {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            this.form.id;
            edia(this.form)
              .then(() => {
                this.$emit("func", null);
                this.$message.success("编辑成功");
                this.amend = false;
                this.getenvionList();
              })
              .catch(function () {
              });
          }
        });
      },
      // 编辑后对表单进行清空
      handlel() {
        for (let key in this.form) {
          this.form[key] = "";
          this.addform.createTime = moment().format("YYYY-MM-DD HH:mm:ss");
        }
      },
      // 历史
      spll(testAreaId) {
        console.log(testAreaId);
        this.historyform.testAreaRecordId = testAreaId;
        historylist(this.historyform).then((response) => {
          this.historyData = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      // 删除
      e_delete(row) {
        this.$confirm("确定删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          detellos(row.id).then((res) => {
            if (res.code == 200) {
              this.$message.success("删除成功");
              this.getenvionList();
            } else {
              this.$message.info(res.msg);
            }
          });
        });
      },

      // 获取折线图数据
      getdataList() {
        this.listform.testAreaId = this.spotCheckRecordParams.id;
        this.listform.createTimeStart = moment()
          .startOf("month")
          .format("YYYY-MM-DD");
        this.listform.createTimeEnd = moment().format("YYYY-MM-DD");
        selechart(this.listform).then((res) => {
          this.dataoverList = res.data.list;
          this.chartList = res.data.chartList;
          this.chartList.forEach((ele) => {
            this.$set(
              ele,
              "minTemperature",
              this.spotCheckRecordParams.minTemperature
            );
            this.$set(
              ele,
              "maxTemperature",
              this.spotCheckRecordParams.maxTemperature
            );

            this.$set(ele, "minHumidity", this.spotCheckRecordParams.minHumidity);
            this.$set(ele, "maxHumidity", this.spotCheckRecordParams.maxHumidity);
            this.$set(ele, "minPressure", this.spotCheckRecordParams.minPressure);
            this.$set(ele, "maxPressure", this.spotCheckRecordParams.maxPressure);
          });
          console.log(this.chartList);
          let temperature = this.chartList.map((item) => {
            return {
              name: "温度底限",
              count: item.minTemperature - 0,
              date: item.createTime,
            };
          });
          let temperature1 = this.chartList.map((item) => {
            return {
              name: "温度高限",
              count: item.maxTemperature - 0,
              date: item.createTime,
            };
          });
          let temperature2 = this.chartList.map((item) => {
            return {
              name: "温度",
              count: item.temperature - 0,
              date: item.createTime,
            };
          });

          let humidity = this.chartList.map((item) => {
            return {
              name: "湿度底限",
              count: item.minHumidity - 0,
              date: item.createTime,
            };
          });
          let humidity1 = this.chartList.map((item) => {
            return {
              name: "湿度高限",
              count: item.maxHumidity - 0,
              date: item.createTime,
            };
          });
          let humidity2 = this.chartList.map((item) => {
            return {
              name: "湿度",
              count: item.humidity - 0,
              date: item.createTime,
            };
          });

          let pressure = this.chartList.map((item) => {
            return {
              name: "气压底限",
              count: item.minPressure - 0,
              date: item.createTime,
            };
          });

          let pressure1 = this.chartList.map((item) => {
            return {
              name: "气压高限",
              count: item.maxPressure - 0,
              date: item.createTime,
            };
          });

          let pressure2 = this.chartList.map((item) => {
            return {
              name: "气压",
              count: item.pressure - 0,
              date: item.createTime,
            };
          });

          this.chartreportList = temperature.concat(temperature1, temperature2);
          console.log(this.chartreportList);
          this.chartreport = humidity.concat(humidity1, humidity2);
          this.chart = pressure.concat(pressure1, pressure2);
          this.overtable = res.data.pageList.list;
          this.total = res.data.total;
        });
      },
    },
  };
</script>
<style lang="less" scoped>
  /deep/ .footer {
    position: absolute;
    bottom: 18px;
    left: 40%;

    .el-button {
      margin-right: 20px;
    }
  }

  /deep/ .chartcont {
    margin-bottom: 10px;
  }

  /deep/ .el-dialog__header {
    display: flex;

    h2 {
      width: 213px;
      height: 21px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 18px;
      color: #3c4353;
      opacity: 1;
    }

    h4 {
      margin-right: 15px;

      span {
        width: 180px;
        height: 19px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 18px;
        color: #f5bb4a;
        opacity: 1;
      }
    }
  }

  /deep/ .avue-crud__dialog__menu {
    position: absolute;
    right: 50px;
    top: 16px;
  }

  /deep/ .contr {
    margin-bottom: 10px;
  }

  /deep/ .el-col-1 {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /deep/ span {
    el-input__inner {
      text-align: center;
    }
  }

  /deep/ .el-input--medium .el-input__inner {
    padding-left: 5px;
    padding-right: 0;
  }

  /deep/ .el-input--small .el-input__inner {
    width: 100%;
    padding-left: 5px;
    padding-right: 0;
  }
</style>


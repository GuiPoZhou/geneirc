<template>
  <div style="padding: 20px">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
      <el-tab-pane :label="titleMsg" name="first">
        <el-form :model="queryParams"
                 ref="queryForm"
                 :inline="true"
                 class="searchform"
                 label-position="top"
                 label-width="80px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="处理日期"
                prop="handleDate"
              >
                <el-date-picker v-model="queryParams.handleDate"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                type="date"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                disabled></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="处理方式"
                prop="handleMethod"
              >
                <el-select v-model="queryParams.handleMethod" disabled placeholder="请选择">
                  <el-option label="弃样" value="1"/>
                  <el-option label="外送" value="2"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="接样人"
                prop="sampleRecipient"
              >
                <el-input v-model="queryParams.sampleRecipient" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="出样人"
                prop="sampler"
              >
                <el-input v-model="queryParams.sampler" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="出样数量"
                prop="samplerCount"
              >
                <el-input v-model="queryParams.samplerCount" disabled type="number"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="备注"
                prop="remark"
              >
                <el-input v-model="queryParams.remark"
                          disabled
                          type="textarea"
                          style="border: 1px solid #DCDFE6"
                          oninput="if(value.length>200)value=value.slice(0,200)"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          :data="listData"
          stripe
          border
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          />
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="65"
          />
          <el-table-column
            prop="entrustCode"
            label="请检通知号"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="sampleCode"
            label="样品编号"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="sampleCode"
            label="样品类别"
            align="center"
          >
            <template scope="scope">
              {{echoData(scope.row.sampleFlow,sampleFlowList)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="sampleCode"
            label="样品状态"
            align="center"
          >
            <template scope="scope">
              {{echoData(scope.row.extDataGive == null?'':scope.row.extDataGive.sampleStatus,sampleStatusList)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="sampleNumber"
            label="样品数量"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="itemName"
            label="检测项目"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="itemCode"
            label="检测标准"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="handleDate"
            label="送样时间"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="sampler"
            label="送样人"
            align="center"
          >
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import moment from "moment";

  export default {
    name: "createEntrust",
    data() {
      return {
        dialogShow: false,
        activeName: "first",
        visible: false,
        queryParams: {},
        queryParams1: {
          submitTimestr: "",
          submitPersonName: "4444",
          checkDesc: "",
          handleDesc: "",
          remarks: "",
        },
        sampleStatusList: this.getDictionary('sample_Status'),
        sampleFlowList: this.getDictionary('sampleFlow'),
        submitPersonName: "",
        isdisable: true,
        loading: false,
        isFullScreen: true,
        screenName: "fullScreen",
        showType: "add",
        showdisable: false,
        titleMsg: "处理",
        samplehandle: false,
        listData: [],
      };
    },
    props: {
      msg: String,
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
    },
    mounted() {
      let width = this.$store.state.app.leftWidth;
      if (width < 200) {
        this.screenName = "bigFullScreen";
      } else {
        this.screenName = "fullScreen";
      }
      console.log(this.queryParams1);
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event)
      },
      init(params) {
        console.log(params)
        if (params.length) {
          this.queryParams = params[0]
          this.listData = params
        }
      },
      e_changeBox(type) {
        this.isFullScreen = type;
      }
    },
  };
</script>

<style scoped>
  .dialog-footer {
    background: #fff;
    position: fixed;
    width: 64%;
    bottom: 0;
    height: 60px;
    z-index: 10;
  }
</style>

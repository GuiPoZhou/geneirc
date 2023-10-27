<template>
  <div class="app-container">
    <!-- 统一样式 - 查询区域 -->
    <div class="a-c-top" v-show="showSearch">
      <!-- 表单 -->
      <el-form
        ref="form"
        :model="queryform"
        class="demo-form-inline"
        v-show="showSearch"
        :inline="true"
      >
        <el-form-item label="区域名称" prop="areaName">
          <el-input
            v-model="queryform.areaName"
            clearable
            class="input-with-select"
            style="width: 240px"
            placeholder="请输入区域名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="区域状态" prop="status">
          <el-select v-model="queryform.status" label="请选择">
            <el-option label="正常" :value="0"></el-option>
            <el-option label="停用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <div class="a-c-t-btnarea">
          <el-form-item>
            <el-button
              type="cyan"
              icon="el-icon-search"
              size="mini"
              @click="search"
              >搜索</el-button
            >

            <el-button icon="el-icon-refresh" size="mini" @click="resorm"
              >重置</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-row :gutter="20">
      <!-- 树形图 -->
      <el-col :span="5" :xs="24">
        <tralms
          :treeList="treeList"
          @updata="getFiletree"
          @handleData="handleData"
          ref="multipleTable"
        ></tralms>
      </el-col>
      <el-col :span="19" :xs="24">
        <div>
          <div class="news">
            <div class="new">当前时间:{{ nowTime }}</div>
            <div class="new">{{ this.EnvSpotCheckDatas.length }}个环境区域</div>
          </div>

          <div
            class="listor"
            v-for="(data, index) in EnvSpotCheckDatas"
            :key="index"
            @click="handleEdit(data)"
          >
            <h4
              v-if="
                data.temperatureStatus == 0 &&
                data.humidityStatus == 0 &&
                data.pressureStatus == 0
              "
              style="color: #1182fb"
            >
              {{ data.areaName }}
            </h4>
            <h4
              v-else-if="
                data.temperatureStatus == 1 ||
                data.humidityStatus == 1 ||
                data.pressureStatus == 1
              "
              style="color: #ff5d5d"
            >
              {{ data.areaName }}
            </h4>

            <div class="content">
              <div class="temple">
                <span>温度</span>
                <p v-if="data.temperatureStatus == 0" style="color: #3c4353">
                  {{ data.temperature !== null ? data.temperature : "--" }}
                  {{ data.temperatureUnit }}
                </p>
                <p
                  v-else-if="data.temperatureStatus == 1"
                  style="color: #ff5d5d"
                >
                  {{ data.temperature !== null ? data.temperature : "--" }}
                  {{ data.temperatureUnit }}
                </p>
              </div>
              <div class="temple">
                <span>湿度</span>
                <p v-if="data.humidityStatus == 0" style="color: #3c4353">
                  {{ data.humidity !== null ? data.humidity : "--" }}
                  {{ data.humidityUnit }}
                </p>
                <p v-else-if="data.humidityStatus == 1" style="color: #ff5d5d">
                  {{ data.humidity !== null ? data.humidity : "--" }}
                  {{ data.humidityUnit }}
                </p>
              </div>
              <div class="temple">
                <span>气压</span>
                <p v-if="data.pressureStatus == 0" style="color: #3c4353">
                  {{ data.pressure !== null ? data.pressure : "--" }}
                  {{ data.pressureUnit }}
                </p>
                <p v-else-if="data.pressureStatus == 1" style="color: #ff5d5d">
                  {{ data.pressure !== null ? data.pressure : "--" }}
                  {{ data.pressureUnit }}
                </p>
              </div>
            </div>
            <span>更新时间：{{ data.createTime }}</span>
            <div class="pinci">
              频次{{ data.recordCount }}/{{ data.checkFrequency }}
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <dialogs
      :editShow.sync="editShow"
      :spotCheckRecordParams="spotCheckRecordParams"
      :createTimeEnd="createTimeEnd"
      :createTimeStart="createTimeStart"
      @close="close()"
    />
  </div>
</template>
<script>
// 引入api接口
import { trelos, optab } from "@/api/ctactl/config";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import tralms from "./trees/tralms.vue";
import dialogs from "./trees/dialogs.vue";
export default {
  data() {
    return {
      showSearch: true,
      loading: true,
      //当前时间
      nowTime: "",
      queryform: {
        areaName: "",
        status: "",
        treeId: "",
      },
      lis: [],
      treeList: [],
      treeOptions: [],
      tableData: [],
      EnvSpotCheckDatas: [],
      dateRanges: [],
      total: 0,
      editShow: false,
      spotCheckRecordParams: "",
      createTimeEnd: "",
      createTimeStart: "",
      multiple: true,
      dialogFull: true, // 定义全局变量 dialogFull 用来控制弹窗
      selector: "在用", //默认显示状态
      colData: [
        { title: "环境区域名称", istrue: true },
        { title: "温度管控范围", istrue: true },
        { title: "湿度管控范围", istrue: true },
        { title: "气压管控范围", istrue: true },
        { title: "点检方式", istrue: true },
        { title: "点检人员", istrue: true },
        { title: "备注", istrue: true },
        { title: "区域状态", istrue: true },
      ],
    };
  },
  mounted() {
    this.getFiletree();
  },
  created() {
    this.getNowTime();
  },
  components: { tralms, Treeselect, dialogs },
  computed: {},
  methods: {
    /** 重置按钮操作 */
    resorm() {
      this.queryform = {
        areaName: null,
        status: null,
        treeId: null,
      };
      this.search();
    },
    /** 搜索按钮操作 */
    search() {
      this.queryform.pageNum = 1;
      this.getnew();
    },
    //获取当前时间
    getNowTime() {
      const aData = new Date();
      this.nowTime =
        aData.getFullYear() +
        "-" +
        (aData.getMonth() + 1) +
        "-" +
        aData.getDate();
    },

    //获取环境点检列表
    getnew() {
      optab(this.queryform).then((response) => {
        this.EnvSpotCheckDatas = response.data;
        this.loading = false;
      });
    },
    // 文件目录列表
    getFiletree() {
      trelos().then((res) => {
        this.treeList = res.data;
        this.treeOptions = res.data;
      });
    },
    // 获取点击后的树列表
    handleData(data) {
      // this.treeOptions = data;
      this.trssdata = data;
      this.multiple = false;
      this.ismultiple = true;
      this.queryform.treeId = this.trssdata.id;
      this.getnew();
    },
    normalizer(node) {
      if (node.childList && !node.childList.length) {
        delete node.childList;
      }
      return {
        id: node.id,
        label: node.nodeName,
        children: node.childList,
        parentId: node.parentId,
      };
    },
    filterList(data) {
      if (data.length) {
        const temp = [];
        data.forEach((data) => {
          const loop = (data) => {
            if (data.childList?.length) {
              for (let i = 0; i < data.childList.length; i++) {
                loop(data.childList[i]);
              }
            } else {
              temp.push(data);
            }
          };
          loop(data);
        });
        console.log(temp);
        return temp;
      }
    },
    handleEdit(data) {
      this.spotCheckRecordParams = data;
      this.createTimeEnd = data;
      this.createTimeStart = data;
      this.editShow = true;
    },
    close() {
      this.editShow = false
      this.getnew()
    }
  },
};
</script>
<style lang="less" scoped>
.searchbox {
  margin: 10px 0;
}
.math h2 {
  display: inline;
  margin-right: 20px;
}
.math span {
  margin-right: 20px;
}
.listor {
  width: 24%;
  height: 160px;
  background: #fafbfc;
  border: 1px solid #dde2ee;
  opacity: 1;
  margin-left: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  float: left;
  padding-left: 0;
  position: relative;
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    .temple {
      width: 30%;
      text-align: center;
      p {
        text-align: center;
        margin: 20px;
        margin-left: 0px;
      }
    }
    span {
      margin-left: 0;
    }
  }
  h4 {
    width: 124px;
    height: 19px;
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 19px;
    opacity: 1;
    margin-left: 100px;
  }
  span {
    width: 24px;
    height: 16px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 16px;
    color: #838a9d;
    opacity: 1;
    margin-left: 20px;
  }
  p {
    width: 100%;
    height: 21px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 21px;
    opacity: 1;
  }
}
.pinci {
  height: 16px;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 16px;
  color: #838a9d;
  opacity: 1;
  margin-left: 20px;
  position: absolute;
  right: 34px;
  bottom: 18px;
}
.news {
  float: left;
  width: 100%;
}
.new {
  margin: 15px;
  height: 16px;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  line-height: 16px;
  color: #3c4353;
  opacity: 1;
  display: inline-block;
}
/deep/.el-col-1 {
  display: flex;
  align-items: center;
  justify-content: center;
}
/deep/.el-input--small .el-input__inner {
  width: 100%;
  padding-left: 5px;
  padding-right: 0;
}
/deep/.el-dialog__body .el-col {
  margin-bottom: 0px;
}
/*  弹框最大化按钮样式*/
/deep/.el-dialog__header {
  padding: 15px 20px 15px;
}
/deep/.el-dialog__headerbtn {
  top: 15px;
}
/deep/.avue-crud__dialog__header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}
/deep/.el-dialog__title {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 800;
  font-size: 16px;
  word-wrap: break-word;
}
/deep/.avue-crud__dialog__menu i {
  color: #909399;
  font-size: 15px;
}
/deep/.el-icon-full-screen {
  cursor: pointer;
}
/deep/.el-icon-full-screen:before {
  content: "\e719";
}
</style>

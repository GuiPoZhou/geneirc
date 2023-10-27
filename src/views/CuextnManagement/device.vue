<template>
  <div class="app-container">
    <!-- 统一样式 - 查询区域 -->
    <div class="a-c-top" v-show="showSearch">
      <!-- 表单 -->
      <el-form
        ref="queryform"
        :inline="true"
        :model="queryform"
        label-width="100px"
        class="demo-form-inline"
        v-show="showSearch"
      >
        <el-form-item label="设备编号" prop="equipmentNo">
          <el-input
            v-model="queryform.equipmentNo"
            clearable
            class="input-with-select"
            style="width: 240px"
            placeholder="请输入设备编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备名称" prop="equipmentName">
          <el-input
            v-model="queryform.equipmentName"
            clearable
            class="input-with-select"
            style="width: 240px"
            placeholder="请输入设备名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="在线状态" prop="status">
          <el-select v-model="queryform.status" label="请选择">
            <el-option label="正常" :value="0"></el-option>
            <el-option label="离线" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <!-- 统一样式 - 查询区域 按钮 -->
        <div class="a-c-t-btnarea">
          <el-form-item>
            <el-button
              type="cyan"
              icon="el-icon-search"
              size="mini"
              @click="searchPro"
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
        <trre
          :treeList="treeList"
          @updata="getFiletree"
          @handleData="handleData"
          ref="multipleTable"
        ></trre>
      </el-col>
      <el-col :span="19" :xs="24">
        <el-row :gutter="10" class="searchbox">
          <el-col :span="1.5">
            <el-button
              type="primary"
              @click="devadd = true"
              :disabled="multiple"
              >添加</el-button
            >
          </el-col>
          <el-col :span="1.5"></el-col>
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="resorm"
            @fullScreen="e_fullScreen"
            @changeBox="e_changeBox"
            :boxData="colData"
          ></right-toolbar>
        </el-row>
        <el-table
          ref="multipleTable"
          :data="tableData"
          stripe
          border
          @selection-change="handleSelectionChange"
          @sort-change="sortChange"
        >
          <el-table-column type="selection" width="55" align="center" fixed>
          </el-table-column>
          <el-table-column prop="date" label="序号" align="center" fixed>
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="equipmentNo"
            label="设备编号"
            align="center"
            sortable="custom"
            show-overflow-tooltip
            width="100"
            v-if="colData[0].istrue"
          >
          </el-table-column>
          <el-table-column
            prop="equipmentName"
            label="设备名称"
            align="center"
            sortable="custom"
            show-overflow-tooltip
            width="100"
            v-if="colData[1].istrue"
          >
          </el-table-column>
          <el-table-column
            prop="equipmentModel"
            label="规格型号"
            align="center"
            sortable="custom"
            show-overflow-tooltip
            v-if="colData[2].istrue"
          >
          </el-table-column>
          <el-table-column
            prop="equipmentBrand"
            label="品牌"
            align="center"
            sortable="custom"
            show-overflow-tooltip
            v-if="colData[3].istrue"
          >
          </el-table-column>
          <el-table-column
            prop="location"
            label="安放位置"
            align="center"
            sortable="custom"
            show-overflow-tooltip
            v-if="colData[4].istrue"
          >
          </el-table-column>
          <el-table-column
            prop="ipAddress"
            label="IP地址"
            align="center"
            sortable="custom"
            show-overflow-tooltip
            v-if="colData[5].istrue"
          >
          </el-table-column>
          <el-table-column
            prop="status"
            label="在线状态"
            align="center"
            sortable="custom"
            show-overflow-tooltip
            v-if="colData[6].istrue"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">正常</span>
              <span v-if="scope.row.status === 1">停用</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            align="center"
            sortable="custom"
            show-overflow-tooltip
            v-if="colData[7].istrue"
          >
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="(eidlok = true), (title = true), handleEdit(scope.row)"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="(eidlok = true), (title = false), lokenfor(scope.row)"
                >查看</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="e_delete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页子组件 -->
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryform.pageNum"
          :limit.sync="queryform.pageSize"
          @pagination="getnew"
        />
        <!-- 分页子组件 -->
      </el-col>
    </el-row>
    <!-- 环境设备添加的模态框 -->
    <el-dialog
      :visible.sync="devadd"
      class="leddig"
      :fullscreen="dialogFull"
      @close="handleClose"
    >
      <template slot="title">
        <div class="avue-crud__dialog__header">
          <span class="el-dialog__title"> 添加 </span>
          <div
            class="avue-crud__dialog__menu"
            @click="dialogFull ? (dialogFull = false) : (dialogFull = true)"
          >
            <i class="el-icon-full-screen"></i>
          </div>
        </div>
      </template>
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="设备编号" prop="equipmentNo">
              <el-input v-model="form.equipmentNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="设备名称" prop="equipmentName">
              <el-input v-model="form.equipmentName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="规格型号" prop="equipmentModel">
              <el-input v-model="form.equipmentModel"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="品牌" prop="equipmentBrand">
              <el-input v-model="form.equipmentBrand"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="安放位置" prop="location">
              <el-input v-model="form.location"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="IP地址" prop="ipAddress">
              <el-input v-model="form.ipAddress"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="读取间隔时间" id="rate" prop="intervalMinute">
              <!-- <el-select v-model="form.intervalMinute">
                <el-option
                  v-for="item in opton"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select> -->
              <el-select v-model="form.intervalMinute" placeholder="请选择">
                <el-option label="5" :value="1"></el-option>
                <el-option label="10" :value="2"></el-option>
                <el-option label="15" :value="3"></el-option>
                <el-option label="20" :value="4"></el-option>
                <el-option label="30" :value="5"></el-option>
                <el-option label="40" :value="6"></el-option>
                <el-option label="50" :value="7"></el-option>
                <el-option label="60" :value="8"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="在线状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择">
                <el-option label="正常" :value="0"></el-option>
                <el-option label="离线" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" style="width: 91%"></el-input>
        </el-form-item>
      </el-form>
      <div class="diafot">
        <!-- 触发添加的逻辑 -->
        <el-button type="primary" @click="addAdmin()">确定</el-button>
        <el-button @click="devadd = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 环境设备修改和查看的模态框 -->
    <el-dialog
      :visible.sync="eidlok"
      class="leddig"
      :fullscreen="dialogFull"
      @close="handleClose"
    >
      <template slot="title">
        <div class="avue-crud__dialog__header">
          <span class="el-dialog__title" v-if="title"> 编辑 </span>
          <span class="el-dialog__title" v-else> 查看 </span>
          <div
            class="avue-crud__dialog__menu"
            @click="dialogFull ? (dialogFull = false) : (dialogFull = true)"
          >
            <i class="el-icon-full-screen"></i>
          </div>
        </div>
      </template>
      <el-form ref="form" :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="设备编号" prop="equipmentNo">
              <el-input v-model="form.equipmentNo" v-if="title"></el-input>
              <el-input v-model="form.equipmentNo" v-else disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="设备名称" prop="equipmentName">
              <el-input v-model="form.equipmentName" v-if="title"></el-input>
              <el-input v-model="form.equipmentName" v-else disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="规格型号" prop="equipmentModel">
              <el-input v-model="form.equipmentModel" v-if="title"></el-input>
              <el-input
                v-model="form.equipmentModel"
                v-else
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="品牌" prop="equipmentBrand">
              <el-input v-model="form.equipmentBrand" v-if="title"></el-input>
              <el-input
                v-model="form.equipmentBrand"
                v-else
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="安放位置" prop="location">
              <el-input v-model="form.location" v-if="title"></el-input>
              <el-input v-model="form.location" v-else disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="IP地址" prop="ipAddress">
              <el-input v-model="form.ipAddress" v-if="title"></el-input>
              <el-input v-model="form.ipAddress" v-else disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="读取间隔时间"
              id="rate"
              prop="intervalMinute"
              v-if="title"
            >
              <!-- <el-select v-model="form.intervalMinute">
                <el-option
                  v-for="item in opton"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select> -->
              <el-select v-model="form.intervalMinute" placeholder="请选择">
                <el-option label="5" :value="1"></el-option>
                <el-option label="10" :value="2"></el-option>
                <el-option label="15" :value="3"></el-option>
                <el-option label="20" :value="4"></el-option>
                <el-option label="30" :value="5"></el-option>
                <el-option label="40" :value="6"></el-option>
                <el-option label="50" :value="7"></el-option>
                <el-option label="60" :value="8"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="读取间隔时间"
              id="rate"
              prop="intervalMinute"
              v-else
            >
              <el-select v-model="form.intervalMinute" placeholder="请选择" disabled>
                <el-option label="5" :value="1"></el-option>
                <el-option label="10" :value="2"></el-option>
                <el-option label="15" :value="3"></el-option>
                <el-option label="20" :value="4"></el-option>
                <el-option label="30" :value="5"></el-option>
                <el-option label="40" :value="6"></el-option>
                <el-option label="50" :value="7"></el-option>
                <el-option label="60" :value="8"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="status" v-if="title"> </el-form-item>
            <el-form-item label="在线状态" prop="status" v-else>
              <el-select v-model="form.status" placeholder="请选择" disabled>
                <el-option label="正常" :value="0"></el-option>
                <el-option label="离线" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            v-if="title"
            style="width: 90%"
          ></el-input>
          <el-input
            v-model="form.remark"
            v-else
            disabled
            style="width: 90%"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="diafot">
        <!-- 触发编辑的逻辑 -->
        <el-button type="primary" v-if="title" @click="edcoin()"
          >确定</el-button
        >
        <el-button @click="eidlok = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 引入接口
import {
  decal,
  trls,
  loodev,
  edilos,
  adddev,
  deteor,
} from "@/api/ctactl/config";
import trre from "./trees/trre.vue";
export default {
  data() {
    return {
      showSearch: true,
      loading: true,
      form: {
        equipmentNo: "",
        equipmentName: "",
        orderByColumn: "",
        orderByType: "",
        treeId: null,
        status: "",
        equipmentModel: "",
        equipmentBrand: "",
        location: "",
        ipAddress: "",
        intervalMinute: "",
        remark: ""
      },
      queryform: {
        equipmentNo: "",
        equipmentName: "",
        pageNum: 1, //页码数
        pageSize: 10, //条数
        orderByColumn: "",
        orderByType: "",
        treeId: null,
        valueTitle: "",
        name: "",
        status: ""
      },
      tableData: [],
      treeList: [],
      total: 0,
      multiple: true,
      trssdata: [],
      devadd: false, //环境设备的添加模态框
      addevs: false, //添加或修改设备类型的模态框
      eidlok: false, //环境设备的修改/查看模态框
      title: true,
      dialogFull: true, // 定义全局变量 dialogFull 用来控制弹窗 true为默认放大
      // opton: [
      //   {
      //     value: "1",
      //     label: "5",
      //   },
      //   {
      //     value: "2",
      //     label: "10",
      //   },
      //   {
      //     value: "3",
      //     label: "15",
      //   },
      //   {
      //     value: "4",
      //     label: "20",
      //   },
      //   {
      //     value: "5",
      //     label: "30",
      //   },
      //   {
      //     value: "6",
      //     label: "40",
      //   },
      //   {
      //     value: "7",
      //     label: "50",
      //   },
      //   {
      //     value: "8",
      //     label: "60",
      //   },
      // ],

      selector: "在用", //默认显示状态
      colData: [
        { title: "设备编号", istrue: true },
        { title: "设备名称", istrue: true },
        { title: "规格型号", istrue: true },
        { title: "品牌", istrue: true },
        { title: "安放位置", istrue: true },
        { title: "IP地址", istrue: true },
        { title: "在线状态", istrue: true },
        { title: "备注", istrue: true },
      ],
      rules: {
        equipmentNo: [
          { required: true, message: "请输入设备编号", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getFiletree();
  },
  methods: {
    e_changeBox(list) {
      let arrList = this.colData.filter((i) => !list.includes(i.title));
      let titleList = arrList.map((item) => {
        return item.title;
      });
      this.colData.filter((i) => {
        if (titleList.indexOf(i.title) != -1) {
          i.istrue = false;
        } else {
          i.istrue = true;
        }
      });
    },
    e_fullScreen() {
      this.fullscreen = !this.fullscreen;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.ids = val.map((item) => item.id);
    },
    /** 重置按钮操作 */
    resorm() {
      this.queryform = {
        equipmentNo: null,
        equipmentName: null,
        status: null,
        pageNum: 1,
        pageSize: 10,
      };
      this.searchPro();
      this.multiple = true
    },
    /** 搜索按钮操作 */
    searchPro() {
      this.queryform.pageNum = 1;
      this.getnew();
    },
    // 显示列表数据
    getnew(id) {
      this.queryform.treeId = id;
      decal(this.queryform).then((res) => {
        this.tableData = res.data.list;
        this.total = res.data.total;
      });
    },
    // 排序
    sortChange(column, prop, order) {
      this.queryform.orderByColumn = this.toLine(column.prop);
      if (column.order === "descending") {
        this.queryform.orderByType = "DESC";
      } else if (column.order === "ascending") {
        this.queryform.orderByType = "ASC";
      } else {
        this.queryform.orderByType = "";
      }
      this.getnew();
    },
    toLine(name) {
      return name.replace(/([A-Z])/g, "_$1").toLowerCase();
    },
    // 查看的逻辑
    lokenfor(row) {
      loodev(row.id).then((res) => {
        this.form = res.data;
        this.form;
      });
    },
    // 添加的逻辑
    addAdmin() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.treeId != null) {
            adddev(this.form).then((response) => {
              if (response.code === 200) {
                this.$message.success("添加成功");
                this.getnew();
                this.devadd = false;
                this.resorm()
              }
            });
          }
        }
      });
    },
    // 添加后对表单进行清空
    handleClose() {
      for (let key in this.form) {
        this.form[key] = "";
      }
    },
    // 编辑前的回显
    handleEdit(row) {
      loodev(row.id).then((res) => {
        this.form = res.data;
        this.form;
      });
    },
    // 编辑的逻辑
    edcoin(val) {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.id;
          edilos(this.form)
            .then(() => {
              this.$emit("func", null);
              this.$message.success("编辑成功");
              this.eidlok = false;
              this.getnew();
            })
            .catch(function () {});
        }
      });
    },
    // 编辑后对表单进行清空
    handleClose() {
      for (let key in this.form) {
        this.form[key] = "";
      }
    },
    // 文件目录列表
    getFiletree() {
      trls().then((res) => {
        this.treeList = res.data;
      });
    },
    // 获取点击后的树列表
    handleData(data) {
      console.log(data);
      this.trssdata = data;
      this.multiple = false;
      this.ismultiple = true;
      this.form.treeId = this.trssdata.id;
      this.getnew(data.id);
    },
    // 删除
    e_delete(row) {
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deteor(row.id).then((res) => {
          if (res.code == 200) {
            this.$message.success("删除成功");
            this.getnew();
          } else {
            this.$message.info(res.msg);
          }
        });
      });
    },
  },
  components: { trre },
};
</script>
<style lang="less" scoped>
.searchbox {
  margin: 10px 0;
}
.diafot {
  position: absolute;
  bottom: 18px;
  left: 40%;
  .el-button {
    margin-right: 20px;
  }
}
.letab {
  margin-top: 10px;
  height: 100%;
  background-color: #fff;
  border-left: 1px solid #dfe6ec;
  .leta {
    width: 20%;
    float: left;
    .letop button {
      color: #000;
    }
    .el-button {
      margin-left: 36px;
      width: 80%;
      margin-bottom: 10px;
      span {
        margin-left: 6px;
      }
    }
  }
  .lerh {
    width: 80%;
    float: right;
    background-color: #fff;
  }
  h3 {
    margin-bottom: 0;
    border-left: 1px solid #dfe6ec;
    border-right: 1px solid #dfe6ec;
    padding-left: 10px;
    font-size: 14px;
    font-weight: bold;
  }
  .el-pagination {
    position: absolute;
    right: 0;
    padding-top: 10px;
    padding-bottom: 10px;
  }
}
/deep/.el-input--medium {
  margin-bottom: 10px;
}
/deep/.el-form-item__error {
  top: 80%;
}
// 清除浮动
.clearfix::after {
  content: "";
  clear: both;
  display: block;
}
#rate {
  position: relative;
  span {
    position: absolute;
    width: 40px;
    right: 20px;
  }
}
// 模态框下拉菜单样式
.leddig .el-form .el-form-item .el-select {
  width: 100%;
}
// 底部按钮样式
.peopleft {
  float: left;
  width: 40%;

  .el-input--medium {
    width: 60%;
    margin-right: 16px;
    margin-bottom: 14px;
  }
}
.el-transfer__buttons {
  padding: 0;
  margin-right: 10px;
}
.el-transfer .el-transfer-panel {
  width: 40%;
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
/deep/.avue-crud__dialog__menu {
  padding-right: 20px;
  float: left;
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

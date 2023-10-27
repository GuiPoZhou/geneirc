<template>
  <div class="app-container">
    <!-- 统一样式 - 查询区域 -->
    <div class="a-c-top" v-show="showSearch">
      <!-- 表单 -->
      <el-form
        ref="form"
        :model="queryform"
        label-width="100px"
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
        <tre
          :treeList="treeList"
          @updata="getFiletree"
          @handleData="handleData"
          ref="multipleTable"
        ></tre>
      </el-col>
      <el-col :span="19" :xs="24">
        <el-row :gutter="10" class="searchbox">
          <el-col :span="1.5">
            <el-button type="primary" @click="handleAdd" :disabled="multiple"
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
          <el-table-column type="selection" width="55px" align="center" fixed>
          </el-table-column>
          <el-table-column
            prop="date"
            label="序号"
            width="55px"
            align="center"
            fixed
          >
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="areaName"
            label="环境区域名称"
            align="center"
            sortable="custom"
            show-overflow-tooltip
            v-if="colData[0].istrue"
          >
          </el-table-column>
          <el-table-column
            label="温度管控范围"
            align="center"
            show-overflow-tooltip
            v-if="colData[1].istrue"
          >
            <template slot-scope="scope">
              <span
                >{{ scope.row.minTemperature }}~{{
                  scope.row.maxTemperature
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            label="湿度管控范围"
            align="center"
            show-overflow-tooltip
            v-if="colData[2].istrue"
          >
            <template slot-scope="scope">
              <span
                >{{ scope.row.minHumidity }}~{{ scope.row.maxHumidity }}</span
              >
            </template>
          </el-table-column>

          <el-table-column
            label="气压管控范围"
            align="center"
            show-overflow-tooltip
            v-if="colData[3].istrue"
          >
            <template slot-scope="scope">
              <span
                >{{ scope.row.minPressure }}~{{ scope.row.maxPressure }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="checkType"
            label="点检方式"
            align="center"
            sortable="custom"
            show-overflow-tooltip
            v-if="colData[4].istrue"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.checkType === 1">仪器读取</span>
              <span v-if="scope.row.checkType === 2">人工点检</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="checkPersonName"
            label="点检人员"
            align="center"
            sortable="custom"
            show-overflow-tooltip
            v-if="colData[5].istrue"
          >
          </el-table-column>

          <el-table-column
            prop="remark"
            label="备注"
            align="center"
            sortable="custom"
            show-overflow-tooltip
            v-if="colData[6].istrue"
          >
          </el-table-column>

          <el-table-column
            prop="status"
            label="区域状态"
            align="center"
            sortable="custom"
            show-overflow-tooltip
            v-if="colData[7].istrue"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">正常</span>
              <span v-if="scope.row.status === 1">停用</span>
            </template>
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
                @click="(lepoint = true), (title = true), handleEdit(scope.row)"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="
                  (lepoint = true), (title = false), handleLook(scope.row)
                "
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
      </el-col>
    </el-row>
    <!-- 环境点检区域的添加模态框 -->
    <el-dialog
      :visible.sync="leradd"
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
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="环境区域名称"
              prop="areaName"
              label-width="108px"
            >
              <el-input v-model="form.areaName" style="width: 98%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="温度管控范围">
              <el-col :span="10">
                <el-input
                  v-model="form.minTemperature"
                  clearable
                  placeholder="输入温度℃"
                  @keyup.native="
                    form.minTemperature = oninput(form.minTemperature)
                  "
                />
              </el-col>
              <el-col :span="1">
                <span> - </span>
              </el-col>
              <el-col :span="10">
                <el-input
                  v-model="form.maxTemperature"
                  clearable
                  placeholder="输入温度℃"
                  @blur="actualTestFeeBlur"
                  @keyup.native="
                    form.maxTemperature = oninput(form.maxTemperature)
                  "
                />
              </el-col>
              <el-col :span="2">
                <el-input v-model="form.temperatureUnit" clearable />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="湿度管控范围">
              <el-col :span="10">
                <el-input
                  v-model="form.minHumidity"
                  clearable
                  class="borderNone"
                  placeholder="输入湿度%"
                  @keyup.native="form.minHumidity = oninput(form.minHumidity)"
                />
              </el-col>
              <el-col :span="1">
                <span> - </span>
              </el-col>
              <el-col :span="10">
                <el-input
                  v-model="form.maxHumidity"
                  clearable
                  placeholder="输入湿度%"
                  @blur="actualTestFee"
                  @keyup.native="form.maxHumidity = oninput(form.maxHumidity)"
                />
              </el-col>
              <el-col :span="2">
                <el-input v-model="form.humidityUnit" clearable />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="气压管控范围">
              <el-col :span="10">
                <el-input
                  v-model="form.minPressure"
                  clearable
                  class="borderNone"
                  placeholder="输入气压kPa"
                  @keyup.native="form.minPressure = oninput(form.minPressure)"
                />
              </el-col>
              <el-col :span="1">
                <span> - </span>
              </el-col>
              <el-col :span="10">
                <el-input
                  v-model="form.maxPressure"
                  clearable
                  placeholder="输入气压kPa"
                  @blur="actualTest"
                  @keyup.native="form.maxPressure = oninput(form.maxPressure)"
                />
              </el-col>
              <el-col :span="2">
                <el-input v-model="form.pressureUnit" clearable />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="区域状态" prop="status">
              <el-select
                v-model="form.status"
                label="请选择"
                style="width: 96%"
              >
                <el-option label="正常" :value="0"></el-option>
                <el-option label="停用" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="点检频次" prop="checkFrequency">
              <el-input
                v-model="form.checkFrequency"
                placeholder="请输入内容"
                style="width: 96%"
                ><template slot="append">次/天</template></el-input
              >
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属区域" prop="treeName">
              <treeselect
                :default-expand-level="5"
                v-model="form.treeId"
                :options="treeOptions"
                :normalizer="normalizer"
                :show-count="true"
                disabled
                style="width: 96%"
                @select="departTreeSelected"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="点检方式" prop="checkType">
              <el-radio-group v-model="form.checkType" @change="pattern">
                <el-radio :label="1">仪器读取</el-radio>
                <el-radio :label="2">人工点检</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="温湿度设备" prop="equipmentName">
              <el-input
                v-model="form.equipmentName"
                readonly
                @focus="selectOrganization"
                :disabled="equipment"
                style="width: 96%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="气压设备" prop="pressureEquipmentName">
              <el-input
                v-model="form.pressureEquipmentName"
                readonly
                @focus="selectOrganall"
                :disabled="equipment"
                style="width: 96%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="点检人员" prop="checkPersonName">
          <el-input
            v-model="form.checkPersonName"
            placeholder="请输入内容"
            readonly
            @focus="selectOrgan"
            :disabled="isequipment"
            style="width: 98%"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            placeholder="请输入内容"
            style="width: 98%"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="diafot">
        <!-- 触发添加的逻辑 -->
        <el-button type="primary" @click="addAdmin()">确定</el-button>
        <el-button @click="close()">取消</el-button>
      </div>
    </el-dialog>
    <!-- 环境点检区域修改和查看模态框 -->
    <el-dialog
      :visible.sync="lepoint"
      class="leddig"
      :fullscreen="dialogFull"
      @close="handleClose"
    >
      <template slot="title">
        <div class="avue-crud__dialog__header">
          <span class="el-dialog__title" v-if="title">修改</span>
          <span class="el-dialog__title" v-else>查看</span>
          <div
            class="avue-crud__dialog__menu"
            @click="dialogFull ? (dialogFull = false) : (dialogFull = true)"
          >
            <i class="el-icon-full-screen"></i>
          </div>
        </div>
      </template>
      <el-form ref="form" :model="form" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="环境区域名称" prop="areaName">
              <el-input
                v-model="form.areaName"
                v-if="title"
                style="width: 98%"
              ></el-input>
              <el-input
                v-model="form.areaName"
                v-else
                disabled
                style="width: 98%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="温度管控范围">
              <el-col :span="10">
                <el-input
                  v-model="form.minTemperature"
                  clearable
                  placeholder="输入温度℃"
                  v-if="title"
                  @keyup.native="
                    form.minTemperature = oninput(form.minTemperature)
                  "
                />
                <el-input
                  v-model="form.minTemperature"
                  clearable
                  placeholder="输入温度℃"
                  v-else
                  disabled
                />
              </el-col>

              <el-col :span="1">
                <span> - </span>
              </el-col>
              <el-col :span="10">
                <el-input
                  v-model="form.maxTemperature"
                  clearable
                  placeholder="输入温度℃"
                  v-if="title"
                  @blur="actualTestFeeBlur"
                  @keyup.native="
                    form.maxTemperature = oninput(form.maxTemperature)
                  "
                />
                <el-input
                  v-model="form.maxTemperature"
                  clearable
                  placeholder="输入温度℃"
                  v-else
                  disabled
                />
              </el-col>
              <el-col :span="2">
                <el-input
                  v-model="form.temperatureUnit"
                  clearable
                  v-if="title"
                />
                <el-input
                  v-model="form.temperatureUnit"
                  clearable
                  v-else
                  disabled
                />
              </el-col>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="湿度管控范围">
              <el-col :span="10">
                <el-input
                  v-model="form.minHumidity"
                  clearable
                  placeholder="输入湿度%"
                  v-if="title"
                  @keyup.native="form.minHumidity = oninput(form.minHumidity)"
                />
                <el-input
                  v-model="form.minHumidity"
                  clearable
                  placeholder="输入湿度%"
                  v-else
                  disabled
                />
              </el-col>
              <el-col :span="1">
                <span> - </span>
              </el-col>
              <el-col :span="10">
                <el-input
                  v-model="form.maxHumidity"
                  clearable
                  placeholder="输入湿度%"
                  v-if="title"
                  @blur="actualTestFeeBlur"
                  @keyup.native="form.maxHumidity = oninput(form.maxHumidity)"
                />
                <el-input
                  v-model="form.maxHumidity"
                  clearable
                  placeholder="输入湿度%"
                  v-else
                  disabled
                />
              </el-col>
              <el-col :span="2">
                <el-input v-model="form.humidityUnit" clearable v-if="title" />
                <el-input
                  v-model="form.humidityUnit"
                  clearable
                  v-else
                  disabled
                />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="气压管控范围">
              <el-col :span="10">
                <el-input
                  v-model="form.minPressure"
                  clearable
                  placeholder="输入气压kPa"
                  v-if="title"
                  @keyup.native="form.minPressure = oninput(form.minPressure)"
                />
                <el-input
                  v-model="form.minPressure"
                  clearable
                  placeholder="输入气压kPa"
                  v-else
                  disabled
                />
              </el-col>
              <el-col :span="1">
                <span> - </span>
              </el-col>
              <el-col :span="10">
                <el-input
                  v-model="form.maxPressure"
                  clearable
                  placeholder="输入气压kPa"
                  v-if="title"
                  @blur="actualTestFeeBlur"
                  @keyup.native="form.maxPressure = oninput(form.maxPressure)"
                />
                <el-input
                  v-model="form.maxPressure"
                  clearable
                  placeholder="输入气压kPa"
                  v-else
                  disabled
                />
              </el-col>
              <el-col :span="2">
                <el-input v-model="form.pressureUnit" clearable v-if="title" />
                <el-input
                  v-model="form.pressureUnit"
                  clearable
                  v-else
                  disabled
                />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="区域状态" prop="status">
              <el-select v-model="form.status" v-if="title" style="width: 96%">
                <el-option label="正常" :value="0"></el-option>
                <el-option label="停用" :value="1"></el-option>
              </el-select>
              <el-select
                v-model="form.status"
                v-else
                disabled
                style="width: 96%"
              >
                <el-option label="正常" :value="0"></el-option>
                <el-option label="停用" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="点检频次" prop="checkFrequency">
              <el-input
                v-model="form.checkFrequency"
                placeholder="请输入内容"
                v-if="title"
                style="width: 96%"
                ><template slot="append">次/天</template></el-input
              >
              <el-input
                v-model="form.checkFrequency"
                placeholder="请输入内容"
                v-else
                disabled
                style="width: 96%"
                ><template slot="append">次/天</template></el-input
              >
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属区域" prop="treeName">
              <treeselect
                :default-expand-level="5"
                v-model="form.treeId"
                :options="treeOptions"
                :normalizer="normalizer"
                :show-count="true"
                disabled
                style="width: 96%"
                @select="departTreeSelected"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="点检方式" prop="checkType">
          <el-radio-group
            v-model="form.checkType"
            v-if="title"
            @change="pattern"
          >
            <el-radio :label="1">仪器读取</el-radio>
            <el-radio :label="2">人工点检</el-radio>
          </el-radio-group>
          <el-radio-group v-model="form.checkType" disabled v-else>
            <el-radio :label="1">仪器读取</el-radio>
            <el-radio :label="2">人工点检</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="温湿度设备" prop="equipmentName">
              <el-input
                v-model="form.equipmentName"
                readonly
                @focus="selectOrganization"
                v-if="title"
                :disabled="equipment"
                style="width: 96%"
              ></el-input>
              <el-input
                v-model="form.equipmentName"
                readonly
                @focus="selectOrganization"
                v-else
                disabled
                style="width: 96%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="气压设备" prop="pressureEquipmentName">
              <el-input
                v-model="form.pressureEquipmentName"
                readonly
                @focus="selectOrganall"
                v-if="title"
                :disabled="equipment"
                style="width: 96%"
              ></el-input>
              <el-input
                v-model="form.pressureEquipmentName"
                readonly
                @focus="selectOrganall"
                v-else
                disabled
                style="width: 96%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="点检人员" prop="checkPersonName">
          <el-input
            v-model="form.checkPersonName"
            readonly
            @focus="selectOrgan"
            v-if="title"
            style="width: 98%"
            :disabled="isequipment"
          ></el-input>
          <el-input
            v-model="form.checkPersonName"
            readonly
            @focus="selectOrgan"
            v-else
            style="width: 98%"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            placeholder="请输入内容"
            v-if="title"
            style="width: 98%"
          ></el-input>
          <el-input
            v-model="form.remark"
            placeholder="请输入内容"
            v-else
            disabled
            style="width: 98%"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="diafot">
        <!-- 触发修改的逻辑 -->
        <el-button type="primary" v-if="title" @click="edcoin()"
          >确定</el-button
        >
        <el-button @click="lepoint = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 选择温度设备的模态框 -->
    <apparatus v-if="showpart" ref="apparatus" @handlapp="handlapp" />
    <!-- 选择气压设备的模态框 -->
    <appar v-if="showleft" ref="appar" @handlapk="handlapk" />
    <!-- 选择人员的模态框 -->
    <peoples v-if="showpeople" ref="peoples" @handle="handlepeopleData" />
  </div>
</template>
<script>
// 引入api接口
import {
  enlist,
  trelos,
  looing,
  adlsn,
  edlts,
  detelts,
} from "@/api/ctactl/config";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import tre from "./trees/tre.vue";
import apparatus from "./trees/apparatus.vue";
import appar from "./trees/appar.vue";
import peoples from "./trees/peoples.vue";
import { choiceUser } from "@/api/qualityAssurance";
export default {
  data() {
    return {
      showSearch: true,
      loading: true,
      form: {
        orderByColumn: "",
        orderByType: "",
        areaName: "",
        status: "",
        ids: "",
        treeId: null,
        nickName: "",
        checkPersonName: "",
        equipmentName: "",
        pressureEquipmentName: "",
        temperatureUnit: "℃",
        humidityUnit: "%",
        pressureUnit: "kPa",
        checkType: "",
      },
      queryform: {
        areaName: "",
        status: "",
        pageNum: 1, //页码数
        pageSize: 10, //条数
        equipmentName: "",
      },
      showpeople: false,
      showpart: false,
      showleft: false,
      tableData: [],
      tabledete: [],
      treeList: [],
      treeOptions: [],
      total: 0,
      addhange: false, //区域新增和修改的模态框
      leradd: false, //环境点检区域的添加模态框
      lepoint: false, //环境点检区域的修改/查看模态框
      device: false, // 选择设备的模态框
      peoples: false, // 选择人员的模态框
      title: true,
      selectGroupShow: false,
      selectGroup: false,
      dialogShow: false,
      multiple: true,
      equipment: true,
      isequipment: true,
      dialogFull: true, // 定义全局变量 dialogFull 用来控制弹窗
      options: [
        {
          value: "0",
          label: "在用",
        },
        {
          value: "1",
          label: "停用",
        },
      ],

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
      rules: {
        areaName: [
          { required: true, message: "请输入环境区域名称", trigger: "blur" },
        ],
        checkFrequency: [
          { required: true, message: "请输入点检频次", trigger: "blur" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
        equipmentName: [
          { required: true, message: "请选择环境区域设备", trigger: "change" },
        ],
        pressureEquipmentName: [
          { required: true, message: "请选择气压设备", trigger: "change" },
        ],
        checkPersonName: [
          { required: true, message: "请选择点检人员", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    this.getFiletree();
  },
  components: { tre, Treeselect, apparatus, peoples, appar },
  methods: {
    // 温度范围限制
    actualTestFeeBlur() {
      if (this.form.maxTemperature - 0 < this.form.minTemperature - 0) {
        this.$message.error("初始温度不得高于最高温度");
        this.form.maxTemperature = "";
        return;
      }
    },
    // 湿度范围限制
    actualTestFee() {
      if (this.form.maxHumidity - 0 < this.form.minHumidity - 0) {
        this.$message.error("初始湿度不得高于最高湿度");
        this.form.maxHumidity = "";
        return;
      }
    },
    // 气压范围限制
    actualTest() {
      if (this.form.maxPressure - 0 < this.form.minPressure - 0) {
        this.$message.error("初始气压不得高于最高气压");
        this.form.maxPressure = "";
        return;
      }
    },
    // 只允许录入到小数点后一位
    oninput(num) {
      var str = num;
      var len1 = str.substr(0, 1);
      var len2 = str.substr(1, 1);
      //如果第一位是0，第二位不是点，就用数字把点替换掉
      if (str.length > 1 && len1 == 0 && len2 != ".") {
        str = str.substr(1, 1);
      }
      //第一位不能是.
      if (len1 == ".") {
        str = "";
      }
      //限制只能输入一个小数点
      if (str.indexOf(".") != -1) {
        var str_ = str.substr(str.indexOf(".") + 1);
        if (str_.indexOf(".") != -1) {
          str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
        }
      }
      //正则替换
      str = str.replace(/[^\d^\.]+/g, ""); // 保留数字和小数点
      str = str.replace(/\.\d\d$/, ""); // 小数点后只能输一位
      return str;
    },
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
      this.multiple = true;
    },
    /** 搜索按钮操作 */
    searchPro() {
      this.queryform.pageNum = 1;
      this.getnew();
    },
    // 显示列表数据
    getnew(id) {
      this.queryform.treeId = id;
      enlist(this.queryform).then((res) => {
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
    //通过判断禁止输入
    pattern() {
      if (this.form.checkType == "1") {
        this.equipment = false;
        this.isequipment = true;
        this.form.checkPersonName = "";
        this.rules.checkPersonName[0].required = false;
        this.rules.equipmentName[0].required = true;
        this.rules.pressureEquipmentName[0].required = true;
      } else if (this.form.checkType == "2") {
        this.isequipment = false;
        this.equipment = true;
        this.form.equipmentName = "";
        this.form.pressureEquipmentName = "";
        this.rules.equipmentName[0].required = false;
        this.rules.pressureEquipmentName[0].required = false;
        this.rules.checkPersonName[0].required = true;
      }
    },
    // 查看的逻辑
    handleLook(row) {
      looing(row.id).then((res) => {
        this.form = res.data;
        this.pattern();
      });
    },
    // 添加的所属区域
    handleAdd() {
      this.leradd = true;
      this.form.treeId = this.queryform.treeId;
      this.equipment = true;
      this.isequipment = true;
    },
    // 添加的逻辑
    addAdmin() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.checkType == "1") {
          }
          if (this.form.treeId != null) {
            console.log(this.form);
            adlsn(this.form).then((response) => {
              if (response.code === 200) {
                this.$message.success("添加成功");
                this.getnew();
                this.leradd = false;
                this.resorm();
              }
            });
          }
        }
      });
    },
    // // 添加后对表单进行清空
    // handleClose() {
    //   for (let key in this.form) {
    //     // this.form = {
    //     //   temperatureUnit: "℃",
    //     //   humidityUnit: "%",
    //     //   pressureUnit: "kPa",
    //     // };
    //     this.form[key] = "";
    //   }
    // },
    // 编辑前的回显
    handleEdit(row) {
      looing(row.id).then((res) => {
        this.form = res.data;
        this.form.temperatureUnit = "℃";
        this.pattern();
        console.log(this.form.checkType);
      });
    },
    // 编辑的逻辑
    edcoin(val) {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.id;
          edlts(this.form)
            .then(() => {
              this.$emit("func", null);
              this.$message.success("编辑成功");
              this.lepoint = false;

              this.getnew();
            })
            .catch(function () {});
        }
      });
    },
    // // 编辑后对表单进行清空
    handleClose() {
      for (let key in this.form) {
        if (
          key !== "temperatureUnit" &&
          key !== "humidityUnit" &&
          key !== "pressureUnit"
        ) {
          this.form[key] = "";
        }
      }
    },
    close() {
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
        this.leradd = false;
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
      this.getnew(data.id);
    },
    // 删除
    e_delete(row) {
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        detelts(row.id).then((res) => {
          if (res.code == 200) {
            this.$message.success("删除成功");
            this.getnew();
          } else {
            this.$message.info(res.msg);
          }
        });
      });
    },
    // 编辑和查看的所属区域
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
    treedata(data) {
      this.treeOptions = data;
    },
    departTreeSelected(node) {
      this.form.treeId = node.id;
      this.form.treeName = node.nodeName;
    },

    // 选择人员
    selectOrgan() {
      this.showpeople = true;
      choiceUser().then((res) => {
        this.$nextTick(() => {
          this.$refs.peoples.init(res.data);
        });
      });
    },
    //选择人员
    handlepeopleData(data) {
      console.log(data);
      const names = data.map((item) => {
        return item.label;
      });
      const id = data.map((item) => {
        return item.id;
      });
      this.form.checkPersonName = names.join(",");
      this.form.checkPersonId = id.join(",");
    },
    // 选择温湿度设备
    selectOrganization() {
      this.showpart = true;
      this.$nextTick(() => {
        this.$refs.apparatus.init();
      });
    },
    handlapp(data) {
      console.log(data);
      // const names = data((item) => {
      //   return item.equipmentName;
      // });
      // const locat = data.map((item) => {
      //   return item.location;
      // });
      // const id = data.map((item) => {
      //   return item.id;
      // });

      this.form.equipmentName = data.equipmentName;
      this.form.equipmentId = data.id;
    },
    // 选择气压设备
    selectOrganall() {
      this.showleft = true;
      this.$nextTick(() => {
        this.$refs.appar.init();
      });
    },
    handlapk(data) {
      console.log(data);
      // const names = data.map((item) => {
      //   return item.equipmentName;
      // });
      // const locat = data.map((item) => {
      //   return item.location;
      // });
      // const id = data.map((item) => {
      //   return item.id;
      // });
      this.form.pressureEquipmentName = data.equipmentName;
      this.form.pressureEquipmentId = data.id;
    },
  },
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
/deep/.el-col-1 {
  display: flex;
  align-items: center;
  justify-content: center;
}
/deep/.el-input--medium .el-input__inner {
  padding-left: 5px;
  padding-right: 0;
}
/deep/.el-input--small .el-input__inner {
  width: 100%;
  padding-left: 5px;
  padding-right: 0;
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

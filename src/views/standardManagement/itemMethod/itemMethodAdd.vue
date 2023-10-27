<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="addShow"
      append-to-body
      width="60%"
      class="elDialog"
      center
      :show-close="true"
      @close="close"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="项目信息" name="first">
          <el-form
            :model="addParam"
            :rules="rules"
            ref="addForm"
            :label-position="labelPosition"
            label-width="116px"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="检测类别" prop="detectCategoryName">
                  <el-input
                    v-model="addParam.detectCategoryName"
                    clearable
                    @focus="categoryShow = true"
                    :disabled="
                      operateType === 'detail' || operateType === 'update'
                    "
                  >
                    <i
                      slot="suffix"
                      class="el-input__icon el-icon-search"
                      @click="categoryShow = true"
                    ></i>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="项目中文名称" prop="itemNameCn">
                  <el-autocomplete
                    style="width: 100%"
                    class="inline-input"
                    v-model="addParam.itemNameCn"
                    clearable
                    :fetch-suggestions="queryItem"
                    placeholder="请输入内容"
                    :trigger-on-focus="false"
                    @select="selectItem"
                    :disabled="operateType === 'detail'"
                  ></el-autocomplete>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="项目英文名称" prop="itemNameEn">
                  <el-input
                    v-model="addParam.itemNameEn"
                    clearable
                    :disabled="operateType === 'detail'"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="现场检测" prop="isScene">
                  <el-select
                    v-model="addParam.isScene"
                    style="width: 100%"
                    :disabled="operateType === 'detail'"
                  >
                    <el-option label="否" :value="0"></el-option>
                    <el-option label="是" :value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="方法编号" prop="methodCode">
                  <el-autocomplete
                    style="width: 100%"
                    class="inline-input"
                    v-model="addParam.methodCode"
                    clearable
                    :fetch-suggestions="queryMethod"
                    placeholder="请输入内容"
                    :trigger-on-focus="false"
                    @select="selectMethod"
                    :disabled="operateType === 'detail'"
                  ></el-autocomplete>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="方法中文名称" prop="methodNameCn">
                  <el-input
                    v-model="addParam.methodNameCn"
                    clearable
                    :disabled="operateType === 'detail'"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="方法英文名称" prop="methodNameEn">
                  <el-input
                    v-model="addParam.methodNameEn"
                    clearable
                    :disabled="operateType === 'detail'"
                  />
                </el-form-item>
              </el-col>


              <el-col :span="12">
                <el-form-item label="子法名称" prop="childMethodName">
                  <el-input
                    v-model="addParam.childMethodName"
                    clearable
                    :disabled="operateType === 'detail'"
                  />
                </el-form-item>
              </el-col>
                <el-col :span="12">
                    <el-form-item label="方法规程名称" prop="methodSpecificationName">
                        <el-input
                                v-model="addParam.methodSpecificationName"
                                clearable
                                :disabled="operateType === 'detail'"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="方法规程文件">
                        <el-upload ref="upload" :action="uploadUrl()" :on-success="uploadSuccess"
                                   :file-list="addParam.methodSpecificationFileList" :disabled="operateType === 'detail'">
                            <div slot="file" slot-scope="{file}">
                                <span style="padding-right: 20px">{{ file.name ? file.name : file.fileName }}</span>
                                <el-button type="text" size="small" @click="look_file(file.fileName)">
                                    查看
                                </el-button>
                                <el-button type="text" size="small" style="color: #ff4949" @click="uploadRemove(file)"
                                           v-if="operateType !== 'detail'">
                                    删除
                                </el-button>
                            </div>
                            <el-button type="primary" icon="el-icon-paperclip" size="mini" :disabled="operateType === 'detail'">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="实验方法说明" prop="experimentalMethodDescription">
                        <el-input
                                v-model="addParam.experimentalMethodDescription"
                                clearable
                                :disabled="operateType === 'detail'"
                        />
                    </el-form-item>
                </el-col>
              <el-col :span="12">
                <el-form-item label="基质" prop="stroma">
                  <el-input
                    v-model="addParam.stroma"
                    clearable
                    :disabled="operateType === 'detail'"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="检出限值" prop="detectLimit">
                  <el-input
                    v-model="addParam.detectLimit"
                    clearable
                    :disabled="operateType === 'detail'"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="限值单位" prop="unitName">
                  <el-input
                    v-model="addParam.unitName"
                    clearable
                    @clear="addParam.resultExpression = ''"
                    @focus="e_openUnit('item', -1)"
                    :disabled="operateType === 'detail'"
                  >
                    <i
                      slot="suffix"
                      class="el-input__icon el-icon-search"
                      @click="e_openUnit('item', -1)"
                    ></i>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="结果表达" prop="resultExpression">
                  <el-select
                    v-model="addParam.resultExpression"
                    clearable
                    :disabled="addParam.unitName == null || addParam.unitName == '' || operateType === 'detail'"
                  >
                    <el-option
                      v-for="item in ExpressionOfResultsListData"
                      :key="item.dictCode"
                      :label="item.dictLabel"
                      :value="item.dictLabel"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="定量限值" prop="rationLimit">
                  <el-input
                    v-model="addParam.rationLimit"
                    clearable
                    :disabled="operateType === 'detail'"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="样品时效" prop="sampleAge">
                  <el-input
                    v-model="addParam.sampleAge"
                    clearable
                    :disabled="operateType === 'detail'"
                    oninput="value = value.replace(/[^\d]/g,'')"
                  >
                    <span slot="suffix">小时</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="样品前处理" prop="preSample">
                  <el-radio-group
                    v-model="addParam.preSample"
                    :disabled="operateType === 'detail'"
                  >
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="多样平行" prop="isPx">
                  <el-col :span="12">
                    <el-select v-model="addParam.isPx" @change="changePx" :disabled="operateType === 'detail'">
                      <el-option label="否" :value="0"></el-option>
                      <el-option label="是" :value="1"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="12">
                    <el-input-number v-model="addParam.pxNum" :min="addParam.isPx === 0 ? 0 : 2"
                                     :disabled="addParam.isPx === 0 || operateType === 'detail'"/>
                  </el-col>

                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="检测多结果" prop="checkMoreRes">
                  <el-col :span="12">
                    <el-select v-model="addParam.isResults" @change="changeMoreRes"
                               :disabled="operateType === 'detail'">
                      <el-option label="否" :value="0"></el-option>
                      <el-option label="是" :value="1"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="12">
                    <el-input-number v-model="addParam.resultsNum" :min="addParam.isResults === 0 ? 0 : 2"
                                     :disabled="addParam.isResults === 0 || operateType === 'detail'"/>
                  </el-col>

                </el-form-item>
              </el-col>
              <!--                    <el-col :span="12">-->
              <!--                        <el-form-item label="检测周期" prop="detectLimit">-->
              <!--                            <el-input-->
              <!--                                v-model="addParam.detectLimit"-->
              <!--                                clearable-->
              <!--                                :disabled="operateType === 'detail'"-->
              <!--                            >-->
              <!--                                <span slot="suffix">小时</span>-->
              <!--                            </el-input>-->
              <!--                        </el-form-item>-->
              <!--                    </el-col>-->

              <el-col :span="12">
                <el-form-item label="常用项目方法" prop="commonMethod">
                  <el-radio-group
                    v-model="addParam.commonMethod"
                    :disabled="operateType === 'detail'"
                  >
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目分类" prop="itemType">
                  <el-select
                    v-model="addParam.itemType"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in initItemCategoryListData"
                      :key="item.dictCode"
                      :label="item.dictLabel"
                      :value="item.dictCode"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>


              <el-col :span="12">
                <el-form-item label="授权类别" prop="authType">
                  <el-select
                    v-model="addParam.authType"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in initAuthCategoryListData"
                      :key="item.dictCode"
                      :label="item.dictLabel"
                      :value="item.dictCode+''"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="检测周期" prop="detectPeriod">
                  <el-input
                    v-model="addParam.detectPeriod"
                    clearable
                    :disabled="operateType === 'detail'"
                    oninput="value = value.replace(/[^\d]/g,'')"
                  >
                    <span slot="suffix">小时</span>
                  </el-input>
                </el-form-item>
              </el-col>


              <el-col :span="12">
                <el-form-item label="绩效权重" prop="performanceWeight">
                  <el-input
                    v-model="addParam.performanceWeight"
                    clearable
                    :disabled="operateType === 'detail'"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="检测部门" prop="deptName">
                  <el-input
                    v-model="addParam.deptName"
                    clearable
                    @focus="deptShow = true"
                    :disabled="operateType === 'detail'"
                    :readonly="true"
                  >
                    <i
                      slot="suffix"
                      class="el-input__icon el-icon-search"
                      @click="deptShow = true"
                    ></i>
                  </el-input>
                </el-form-item>
              </el-col>


              <el-col :span="12" class="selectInfo">
                <el-form-item label="检测岗位">
                    <el-input placeholder="请输入内容" readonly v-model="addParam.detectType == 0 ? addParam.postName : addParam.userNames" class="input-with-select">
                        <el-select v-model="addParam.detectType" slot="prepend" placeholder="请选择" @change="handleS">
                            <el-option label="按岗位" :value="0"></el-option>
                            <el-option label="按人员" :value="1"></el-option>
                        </el-select>
                        <el-button slot="append" icon="el-icon-search" @click="handleSelect"></el-button>
                    </el-input>
<!--                  <el-input-->
<!--                    v-model="addParam.postName"-->
<!--                    clearable-->
<!--                    @focus="postShow = true"-->
<!--                    :disabled="operateType === 'detail'"-->
<!--                  >-->
<!--                    <i-->
<!--                      slot="suffix"-->
<!--                      class="el-input__icon el-icon-search"-->
<!--                      @click="postShow = true"-->
<!--                    ></i>-->
<!--                  </el-input>-->
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="排序字段" prop="sort">
                  <el-input
                      placeholder="请输入数字"
                      v-model="addParam.sort"
                      clearable
                      :disabled="operateType === 'detail'"
                      @input="validateNumber"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
                <el-col :span="12">
                    <el-form-item label="试验方法" prop="trialMethod">
                        <el-input
                                placeholder="请输入试验方法"
                                v-model="addParam.trialMethod"
                                clearable
                                :disabled="operateType === 'detail'"
                        >
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="预制条件" prop="precondition">
                        <el-input
                                placeholder="请输入预制条件"
                                v-model="addParam.precondition"
                                clearable
                                :disabled="operateType === 'detail'"
                        >
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="预期结果" prop="expectedResult">
                        <el-input
                                placeholder="请输入预期结果"
                                v-model="addParam.expectedResult"
                                clearable
                                :disabled="operateType === 'detail'"
                        >
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="操作指导书编号" prop="operationManualCode">
                        <el-input
                                placeholder="请输入操作指导书编号"
                                v-model="addParam.operationManualCode"
                                clearable
                                :disabled="operateType === 'detail'"
                        >
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="原始记录编号" prop="originalRecordCode">
                        <el-input
                                placeholder="请输入原始记录编号"
                                v-model="addParam.originalRecordCode"
                                clearable
                                :disabled="operateType === 'detail'"
                        >
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="优先级" prop="priority">
                        <el-input
                                placeholder="请输入优先级"
                                v-model="addParam.priority"
                                clearable
                                :disabled="operateType === 'detail'"
                        >
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>


            <el-form-item label="认证情况" prop="selectedAuthentications">
              <el-checkbox-group
                v-model="selectedAuthentications"
                :disabled="operateType === 'detail'"
              >
                <el-checkbox
                  v-for="(authentication, index) in allAuthentication"
                  :key="authentication.dictCode"
                  :label="authentication"
                >
                  {{ authentication.dictLabel }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
              <el-tabs v-model="productActiveName" type="card" @tab-click="handleClick">
                  <el-tab-pane label="使用设备" name="1">
                      <deviceTables ref="deviceChild" :deviceList="deviceList" :operateType="operateType"></deviceTables>
                  </el-tab-pane>
                  <el-tab-pane label="适用产品" name="2">
                      <productTables ref="producrChild" :operateType="operateType" :productList="productList"></productTables>
                  </el-tab-pane>
              </el-tabs>
<!--            <el-form-item label="使用设备分类" prop="equipmentType">-->
<!--              <el-radio-->
<!--                v-model="equipmentType"-->
<!--                :label="1"-->
<!--                :disabled="operateType === 'detail'"-->
<!--              >所有分类-->
<!--              </el-radio>-->
<!--              <el-radio-->
<!--                v-model="equipmentType"-->
<!--                :label="2"-->
<!--                :disabled="operateType === 'detail'"-->
<!--              >其他分类-->
<!--              </el-radio>-->
<!--            </el-form-item>-->

<!--            <el-form-item prop="equipmentTypeName">-->
<!--              <el-input-->
<!--                type="textarea"-->
<!--                :value="equipmentTypeName"-->
<!--                clearable-->
<!--                @focus="showEquipmentType"-->
<!--                :disabled="equipmentType === 1 || operateType === 'detail'"-->
<!--              />-->
<!--            </el-form-item>-->
            <el-form-item label="质控要求" prop="qualityRequirement">
              <el-input type="textarea" v-model="addParam.qualityRequirement"/>
            </el-form-item>

            <el-form-item prop="detectCategory" v-show="false">
              <el-input v-model="addParam.detectCategory"></el-input>
            </el-form-item>
            <el-form-item prop="detectUnit" v-show="false">
              <el-input v-model="addParam.detectUnit"></el-input>
            </el-form-item>

            <el-form-item prop="detectDept" v-show="false">
              <el-input v-model="addParam.detectDept"></el-input>
            </el-form-item>

            <el-form-item prop="detectPost" v-show="false">
              <el-input v-model="addParam.detectPost"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="子项目信息" name="itemData">
          <el-button style="margin: 10px 0" type="primary" :disabled="operateType === 'detail' || isMore.itemData"
                     @click="e_add('itemData')"
          >添加
          </el-button>
          <el-table :data="itemData" style="width: 100%">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="subItemName" label="子项目名称">
              <template slot-scope="scope">
                <el-input v-model="scope.row.subItemName"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="detectLimit" label="检出限值">
              <template slot-scope="scope">
                <el-input v-model="scope.row.detectLimit"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="detectUnitName" label="限值单位">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.detectUnitName"
                  @focus="e_openUnit('sub', scope.$index,'itemData')"
                >
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-search"
                    @click="e_openUnit('sub', scope.$index,'itemData')"
                  ></i>
                </el-input>
              </template>
            </el-table-column>
              <el-table-column prop="technicalRequirement" label="技术要求">
                  <template slot-scope="scope">
                      <el-input v-model="scope.row.technicalRequirement"></el-input>
                  </template>
              </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" :disabled="operateType === 'detail'" @click="e_delete(scope.$index,'itemData')"
                >删除
                </el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="项目组分信息" name="tableData">
          <el-button style="margin: 10px 0" type="primary" :disabled="operateType === 'detail' || isMore.tableData"
                     @click="e_add('tableData')"
          >添加
          </el-button>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="subItemName" label="组分名称">
              <template slot-scope="scope">
                <el-input v-model="scope.row.subItemName"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="detectLimit" label="检出限值">
              <template slot-scope="scope">
                <el-input v-model="scope.row.detectLimit"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="detectUnitName" label="限值单位">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.detectUnitName"
                  @focus="e_openUnit('sub', scope.$index,'tableData')"
                >
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-search"
                    @click="e_openUnit('sub', scope.$index,'tableData')"
                  ></i>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" :disabled="operateType === 'detail'" @click="e_delete(scope.$index,'tableData')"
                >删除
                </el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="operateType === 'add' || operateType === 'update'"
          type="primary"
          @click="save(false)"
          center
        >保存
        </el-button>
        <el-button
          v-if="operateType === 'add' || operateType === 'update'"
          @click="close"
        >取消
        </el-button>
        <el-button
          v-if="operateType === 'add'"
          type="primary"
          @click="save(true)"
          center
        >保存继续
        </el-button>
        <el-button v-if="operateType === 'add'" @click="resetAdd" center
        >重置信息
        </el-button>
        <el-button v-if="operateType === 'detail'" @click="close" center
        >返回
        </el-button>
      </div>
    </el-dialog>

    <!-- 弹出框 -->
    <selectDetectName
      :visible.sync="categoryShow"
      @handleParentName="backfillCategory"
      :onlyShowLeaf="true"
    />
    <selectUnit :visible.sync="unitShow" @backfill="backfillUnit"/>
    <selectDept
      :visible.sync="deptShow"
      @backfill="backfillDept"
      :deptScope="1"
    />
    <selectPost :visible.sync="postShow" @backfill="backfillPost"/>
    <selectUser :visible.sync="visible" @backfill="backfillUser"/>
    <selectEquipmentType
      :visible.sync="equipmentTypeShow"
      @backfill="backfillEquipmentType"
      :selectedEquipmentType="selectedEquipmentType"
      ref="equipmentType"
    />
    <div></div>
  </div>
</template>
<script>
  import {
    listAuthentication,
    searchItemsByName,
    searchMethodsByCode,
    add,
    getDetailById,
    update,
  } from "@/api/standardManagement/itemMethod";

  import {listAll, listData} from "@/api/system/dict/data";

  import selectDetectName from "@/components/project/selectDetectName";
  import selectUnit from "@/components/common/selectUnit";
  import selectDept from "@/components/common/selectDept";
  import selectPost from "@/components/common/selectPost";
  import selectUser from "@/components/common/selectUser";
  import selectEquipmentType from "@/components/common/selectEquipmentType";
  import deviceTables from './comment/deviceTables.vue'
  import productTables from './comment/productTables.vue'

  export default {
    components: {
      selectDetectName,
      selectUnit,
      selectDept,
      selectPost,
        selectUser,
      selectEquipmentType,
        deviceTables,
        productTables
    },
    data() {
      return {
          select: '1',
        ExpressionOfResultsListData: [],
        tableData: [],
        itemData: [],
          deviceList: [],
          productList: [],
        activeName: "first",
          productActiveName: "1",
        //项目方法数据
        addParam: {
              detectType: 0,
          commonMethod: 0,
          detectCategory: undefined,
            methodSpecificationFileList: [],
          detectCategoryName: undefined,
          itemNameCn: undefined,
          itemNameEn: undefined,
          isScene: 0,
          methodCode: undefined,
          methodNameCn: undefined,
          methodNameEn: undefined,
          childMethodName: undefined,
            methodSpecificationName: undefined,
            experimentalMethodDescription: undefined,
          stroma: undefined,
          detectLimit: undefined,
          detectUnit: undefined,
          detectPeriod: undefined, //检测周期
          performanceWeight: undefined,
          detectDept: undefined,
          deptName: undefined,
          detectPost: undefined,
          unitName: undefined,
          postName: undefined,
          preSample: undefined,
          itemType: undefined, //项目分类
          authType: undefined, //授权类别
          rationLimit: undefined, //定量限值
          qualityRequirement: undefined, //质控要求
          sampleAge: undefined, // 样品时效
          resultExpression: undefined, //结果表达
          trialMethod: undefined,
            precondition: undefined,
            expectedResult: undefined,
            operationManualCode: undefined,
            originalRecordCode: undefined,
            priority: undefined,
          isPx: 0,
          pxNum: 1,
          isResults: 0,
          resultsNum: 1,
          sort: null,
        },
        isMore: {
          itemData: false,
          tableData: false
        },
        //项目方法id，用于编辑和详情
        itemMethodId: undefined,
        //已选择的认证情况
        selectedAuthentications: [],
        //所有设备类型
        equipmentTypeList: [],
        //所有的认证情况
        allAuthentication: [],
        //是否显示类别列表
        categoryShow: false,
        //是否显示计量单位列表
        unitShow: false,
        //是否显示检测部门列表
        deptShow: false,
        //是否显示检测岗位列表
        postShow: false,
          visible: false,
        //是否显示设备分类列表
        equipmentTypeShow: false,

        //设备分类【全部，其他】
        equipmentType: 2,

        //对齐方式
        labelPosition: "right",
        rules: {
          detectCategoryName: [
            {required: true, message: "请输入检测类别", trigger: "change"},
          ],
          itemNameCn: [
            {required: true, message: "请输入项目中文名称", trigger: "blur"},
          ],
          methodCode: [
            {required: true, message: "请输入方法编号", trigger: "blur"},
          ],
          methodNameCn: [
            {required: true, message: "请输入方法中文名称", trigger: "blur"},
          ],
          deptName: [
            {
              // 角色 配置该权限控制后 检测部门不需要必填
              required: ((this.$store.state.user.permissions.includes('micGenric:itemMethodManage:Department-Required') == false) || this.$store.state.user.roles.includes('admin')) ? true : false,
              message: "请输入检测部门名称",
              trigger: "change"
            },
          ],
        },
        initAuthCategoryListData: [],
        initItemCategoryListData: [],
        uniShowType: "",
        currentSubTableIndex: -1,
        tableName: "",
      };
    },
    props: {
      addShow: {
        type: Boolean,
        default: false,
      },
      //操作类型：add:新增、detail:详情、update:编辑
      operateType: {
        type: String,
        default: "add",
      },
    },
    methods: {
        // 文件上传路径返回
        uploadUrl() {
            return process.env.VUE_APP_BASE_API + "/common/upload";
        },
        uploadSuccess(res, file, fileList, index) {
            if (200 == res.code) {
                this.addParam.methodSpecificationFileList.push({
                    businessType:"ITEM_METHOD",
                    fileType: 0,
                    filePath: res.url,
                    fileName: res.fileName,
                });
            } else {
                this.$message.error("文件上传失败！" + res.msg);
            }
        },
        // 查看文件
        look_file(data) {
            this.addParam.methodSpecificationFileList.map(item => {
                if (item.fileName === data) {
                    window.open(process.env.VUE_APP_BASE_API + '/' + item.filePath, '_blank');
                }
            })
        },
        // 文件删除
        uploadRemove(file, fileList) {
            /// 1.获取将要删除图片的临时路径
            const filePath = file.filePath
            // 2.从数组中，找到图片对应的索引值
            const i = this.addParam.methodSpecificationFileList.findIndex(x => x.filePath === filePath)
            // 3.调用splice方法，移除图片信息
            this.addParam.methodSpecificationFileList.splice(i, 1)
        },
        handleS () {
            if (this.addParam.detectType == 0) {
                this.addParam.postName = undefined
                this.addParam.detectPost = undefined
            } else {
                this.addParam.detectUser = undefined
                this.addParam.userNames = undefined
            }
        },
        handleSelect () {
          if (this.addParam.detectType == 0) {
              this.postShow = true
          } else {
              this.visible = true
          }
        },
        handleClick () {

        },
      validateNumber() {
        // 使用正则表达式匹配非数字字符并替换为空字符串
        this.addParam.sort = this.addParam.sort.replace(/\D/g, '');
      },
      /*
       *@author: 焦政
       *@date: 2022-04-11 15:42:24
       *@description:子项目检出限单位
       */
      e_openUnit(type, index, tableName) {
        this.tableName = tableName;
        this.currentSubTableIndex = index;
        this.uniShowType = type;
        this.unitShow = true;
      },
      /*
       *@author: 焦政
       *@date: 2022-04-11 15:15:35
       *@description:新增
       */
      e_add(tableName) {
        let obj = {
          subItemName: "",
          detectLimit: this.addParam.rationLimit || "",
          detectUnit: this.addParam.detectUnit || "",
          detectUnitName: this.addParam.unitName || "",
        };
        this[tableName].push(obj);
      },
      /*
       *@author: 焦政
       *@date: 2022-04-11 15:14:14
       *@description:删除添加的子项目
       */
      e_delete(index, tableName) {
        this[tableName].splice(index, 1);
      },
      //授权类别
      initAuthCategoryList() {
        listData({dictType: "auth_type"}).then((response) => {
          if (response.code === 200) {
            this.initAuthCategoryListData = response.rows;
          }
        });
      },
      /** 修改多结果 */
      changeMoreRes(e) {
        console.log(e);
        switch (e) {
          case 0:
            this.$set(this.addParam, 'resultsNum', 1)
            break;
          case 1:
            this.$set(this.addParam, 'resultsNum', 2)
            break;
        }
      },
      /** 修改是否多平行 */
      changePx(e) {
        console.log(e);
        switch (e) {
          case 0:
            this.$set(this.addParam, 'pxNum', 1)
            break;
          case 1:
            this.$set(this.addParam, 'pxNum', 2)
            break;
        }
      },
      //授权类别
      initItemCategoryList() {
        listData({dictType: "item_category"}).then((response) => {
          if (response.code === 200) {
            this.initItemCategoryListData = response.rows;
          }
        });
      },
      //结果表达
      ExpressionOfResultsList() {
        listData({dictType: 'expression_results'}).then((response) => {
          if (response.code === 200) {
            this.ExpressionOfResultsListData = response.rows
            this.ExpressionOfResultsListData.map((item) => {
              item.dictLabel = item.dictLabel.replace('&lt;', '<')
            })
          }
        })
      },
      //取消按钮操作
      close() {
        this.resetAdd()
          this.$refs.producrChild.dataList = []
          this.$refs.deviceChild.dataList = []
          this.productActiveName = '1'
        this.$emit("update:addShow", false);
        this.tableData = []
      },
      //重置添加表单
      resetAdd() {
        this.resetForm("addForm");
        this.activeName = 'first'
        this.selectedAuthentications = [];
        this.tableData = []
        this.itemData = []
        this.addParam.isPx = 0
        this.addParam.pxNum = 0
        this.addParam.resultsNum = 0
        this.addParam.isResults = 0
        this.addParam.methodSpecificationFileList = []
        this.addParam.detectUser = undefined
        this.addParam.userNames = undefined
          this.addParam.postName = undefined
          this.addParam.detectPost = undefined
        this.equipmentTypeList.forEach((type) => (type.isSelected = false));
        this.equipmentTypeList.reverse();
      },
      //填充类别
      backfillCategory(detectCategory) {
        this.addParam.detectCategory = detectCategory.id;
        this.addParam.detectCategoryName = detectCategory.selectDetectName;
      },
      //填充计量单位
      backfillUnit(unit) {
        if (this.uniShowType == "sub") {
          console.log(this.currentSubTableIndex);
          let obj = this[this.tableName][this.currentSubTableIndex];
          console.log(obj);
          obj.detectUnit = unit.id;
          obj.detectUnitName = unit.unitName;
          console.log(this.currentSubTableIndex);
          console.log(obj);
          this.$set(this[this.tableName], this.currentSubTableIndex, obj);
        } else {
          this.addParam.detectUnit = unit.id;
          this.addParam.unitName = unit.unitName;
        }
      },
      //填充检测单位
      backfillDept(dept) {
        this.addParam.detectDept = dept.deptId;
        this.addParam.deptName = dept.deptName;
      },
      //填充岗位
      backfillPost(post) {
        this.addParam.detectPost = post.postId;
        this.addParam.postName = post.postName;
      },
        // 填充人员
        backfillUser (user) {
          var userId = user.map(item => {
              return item.userId
          })
            var userName = user.map(item => {
                return item.nickName
            })
            this.addParam.detectUser = userId.join(',')
            this.addParam.userNames = userName.join(',')
        },
      backfillEquipmentType(rows) {
        //选中的设备类型
        console.log(rows)
        let dictCodeArr = rows.map((row) => row.dictCode);
        console.log(1);
        console.log(this.equipmentTypeList);
        this.equipmentTypeList.forEach((type) => {
          console.log(type);
          if (dictCodeArr.indexOf(type.dictCode) > -1) {
            type.isSelected = true;
          } else {
            type.isSelected = false;
          }
        });

        //翻转，为了vue响应数组操作
        this.equipmentTypeList.reverse();
      },

      showEquipmentType() {
        this.equipmentTypeShow = true;
        //勾选选中的
        this.$refs.equipmentType.initSelected();
      },

      //认证情况列表
      initAuthentication() {
        listAuthentication().then((response) => {
          if (response.code === 200) {
            this.allAuthentication = response.data;
          }
        });
      },
      //设备类型列表
      initEquipmentTypeList() {
        listData({dictType: "equipment_type"}).then((response) => {
          if (response.code === 200) {
            this.equipmentTypeList = response.rows;
          }
        });
      },
      // 根据项目名查询项目
      queryItem(itemName, cb) {
        searchItemsByName(itemName).then((response) => {
          if (response.code === 200) {
            let data = response.data;
            data.forEach((item) => {
              item.value = item.itemNameCn;
            });
            //下拉列表
            cb(response.data);
          }
        });
      },
      //选择项目回填
      selectItem(item) {
        this.addParam.itemNameEn = item.itemNameEn;
      },

      // 根据方法编码查询方法
      queryMethod(methodCode, cb) {
        searchMethodsByCode(methodCode).then((response) => {
          if (response.code === 200) {
            let data = response.data;
            data.forEach((method) => {
              method.value = method.methodCode;
            });
            //下拉列表
            cb(response.data);
          }
        });
      },
      //选择方法回填
      selectMethod(method) {
        this.addParam.methodNameCn = method.methodNameCn;
        this.addParam.methodNameEn = method.methodNameEn;
        this.addParam.childMethodName = method.childMethodName;
      },

      //新增/修改
      save(isContinue) {
        this.$refs["addForm"].validate((valid) => {
          if (valid) {
            if (this.addParam.sort == '' || this.addParam.sort == undefined) {
              this.addParam.sort = null
            }
            if(this.addParam.sort) {
              this.addParam.sort = parseInt(this.addParam.sort)
            }
            if (
              this.selectedAuthentications.some(
                (au) => au.dictLabel === "资质外"
              ) &&
              this.selectedAuthentications.length > 1
            ) {
              this.$message.error(" 认证情况：资质外不能与其他类型同时选择！");
              return false;
            }
            this.initAddParam();
            if (this.operateType === "add") {
              this.add(isContinue);
            } else {
              this.update();
            }
          }
        });
      },
      //新增
      add(isContinue) {
        this.addParam.subList = this.tableData;
        this.addParam.itemMethodSubList = this.itemData
          var list = this.$refs.deviceChild.dataList.map(item => {
              return {
                  equipmentId: item.id,
                  equipmentTypeId: item.treeId,
                  equipmentTypeName: item.equipmentTypeName
              }
          })
          var list1 = this.$refs.producrChild.dataList.map(item => {
              return {
                  productionId: item.id
              }
          })
          this.addParam.equipmentList = list
          this.addParam.productionList = list1
        add(this.addParam).then((response) => {
          if (response.code === 200) {
            this.$message({message: "添加成功！", type: "success"});
            // 保存继续
            if (!isContinue) {
              this.close();
            }
            this.$emit("reload");
          }
        });
      },
      //编辑保存
      update() {
        this.addParam.subList = this.tableData;
        this.addParam.itemMethodSubList = this.itemData
          var list = this.$refs.deviceChild.dataList.map(item => {
              return {
                  equipmentId: item.id,
                  equipmentTypeId: item.treeId,
                  equipmentTypeName: item.equipmentTypeName
              }
          })
          var list1 = this.$refs.producrChild.dataList.map(item => {
              return {
                  productionId: item.id
              }
          })
          this.addParam.productionList = list1
          this.addParam.equipmentList = list
        update(this.addParam, this.itemMethodId).then((response) => {
          if (response.code === 200) {
            this.$message({message: "操作成功！", type: "success"});
            this.close();
            this.$emit("reload");
          }
        });
      },
      //初始化参数
      initAddParam() {
        //认证情况
        let authentications = this.selectedAuthentications.map((au) => {
          return {
            authentication: au.dictCode,
            authenticationLabel: au.dictLabel,
          };
        });

        this.addParam.authenticationList = authentications;
        //设备分类
        let equipmentTypes = this.selectedEquipmentType.map((type) => {
          return {equipmentType: type.dictCode, typeLabel: type.dictLabel};
        });
        this.addParam.equipmentTypeList = equipmentTypes;

        if (!this.addParam.postName) {
          this.addParam.detectPost = null;
        }
        if (!this.addParam.unitName) {
          this.addParam.detectUnit = null;
        }
      },
      //获取详情
      getDetail(itemMethodId) {
        this.itemMethodId = itemMethodId;
        getDetailById(itemMethodId).then((response) => {
          if (response.code === 200) {
            let data = response.data;
            // this.tableData = data.equipmentList
              this.deviceList = data.equipmentList
              this.productList = data.productionList
            this.addParam = response.data;
            this.addParam.commonMethod = Number(this.addParam.commonMethod)
            this.addParam.methodSpecificationFileList = response.data.uploadFileList
            this.tableData = this.addParam.subList || []
            this.itemData = this.addParam.itemMethodSubList || []
            //初始化认证情况
            let authentications = data.authenticationList;
            if (
              authentications !== undefined &&
              authentications !== null &&
              authentications.length > 0
            ) {
              let authenticationIds = authentications.map(
                (au) => au.authentication
              );
              this.selectedAuthentications = this.allAuthentication.filter(
                (au) => authenticationIds.indexOf(au.dictCode) > -1
              );
            }

            //初始化设备分类
            let equipmentTypes = data.equipmentTypeList;
            if (
              equipmentTypes !== undefined &&
              equipmentTypes !== null &&
              equipmentTypes.length > 0
            ) {
              let equipmentTypeIds = equipmentTypes.map(
                (type) => type.equipmentType
              );
              this.equipmentTypeList.forEach((type) => {
                if (equipmentTypeIds.indexOf(type.dictCode) > -1) {
                  type.isSelected = true;
                } else {
                  type.isSelected = false;
                }
              });
              this.equipmentTypeList.reverse();
            }

            this.equipmentType = 2;
          }
        });
      },
    },
    computed: {
      //选中的设备类型
      selectedEquipmentType() {
        if (this.equipmentType === 1) {
          this.equipmentTypeList.forEach((type) => (type.isSelected = true));
          this.equipmentTypeList.reverse();
        }
        return this.equipmentTypeList.filter((type) => {
          return type.isSelected;
        });
      },
      equipmentTypeName() {
        let resultData = this.equipmentTypeList
          .filter((type) => {
            return type.isSelected;
          })
          .map((type) => type.dictLabel);
        return resultData.toLocaleString();
      },

      title() {
        switch (this.operateType) {
          case "add":
            return "新增项目";
          case "update":
            return "编辑项目";
          case "detail":
            return "项目详情";
        }
      },
    },
    watch: {
      activeName: {
        handler(val, oldval) {
          const msgDict = {
            "tableData": "项目组分信息",
            "itemData": "子项目信息"
          }
          let msg = msgDict[oldval] || '';
          // 两者都不是项目
          if (oldval !== 'first' && val !== 'first' && this[oldval].length > 0) {
            this.$message.error(`${msg}已含有数据,项目组分信息和子项目信息不能同时维护`);
            this.isMore[val] = true;
          } else {
            this.isMore.itemData = false;
            this.isMore.tableData = false;
          }
        }
      }
    },
    created() {
      //项目分类
      this.initItemCategoryList();
      // 结果表达
      this.ExpressionOfResultsList()
      //授权列表
      this.initAuthCategoryList();
      //认证情况列表
      this.initAuthentication();
      //设备类型列表
      this.initEquipmentTypeList();
    },
  };
</script>
<style>
  /deep/ .ant-input {
    height: 36px;
  }
  .selectInfo .el-select .el-input {
      width: 100px;
  }
  .selectInfo .input-with-select .el-input-group__prepend {
      background-color: #fff;
  }
</style>

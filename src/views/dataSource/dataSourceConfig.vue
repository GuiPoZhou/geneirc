<template>
  <el-dialog :title="title" :visible.sync="open" width="1024px" :fullscreen="false" append-to-body :destroy-on-close="true" :close-on-click-modal="false" :before-close="beforeClose" @open="openEvent">

    <el-row>
      <el-col :span="24">
        <el-button type="primary" size="mini" @click="showParamConfig">增加入口参数</el-button>
        <el-divider ></el-divider>
        <el-row>
          <el-col :span="24">
            <el-table
              ref="paramListTable"
              :data="paramListData"
              row-key="id">
              <el-table-column label="参数名称" prop="name"></el-table-column>
              <el-table-column label="备注" prop="remark"></el-table-column>
              <el-table-column label="操作" prop="label" width="120">
                <template slot-scope="scope">
                  <el-link type="primary" @click="showParamConfig(scope.row.id)">编辑</el-link>
                  <el-link type="danger" @click="removeParamConfig(scope.row.id)">删除</el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-divider ></el-divider>
        <el-button type="primary" size="mini" @click="showDataConfig">增加数据源</el-button>
        <el-divider ></el-divider>
        <el-row>
          <el-col :span="24">
            <el-table
              ref="listTable"
              :data="listData"
              row-key="id">
              <el-table-column label="数据源名称" prop="name"></el-table-column>
              <el-table-column label="对象映射类型" prop="dataSourceType">
                <template slot-scope="scope">{{ scope.row.dataSourceType === 1 ? 'Object' : 'Array'}}</template>
              </el-table-column>
              <el-table-column label="关系类型" prop="relationshipType">
                <template slot-scope="scope">{{ scope.row.relationshipType === 1 ? '根级' : scope.row.relationshipType === 2 ? '子级' : 'union级' }}</template>
              </el-table-column>
              <el-table-column label="备注" prop="remark"></el-table-column>
              <el-table-column label="操作" prop="label" width="120">
                <template slot-scope="scope">
                  <el-link type="primary" @click="showDataConfig(scope.row.id)">编辑</el-link>
                  <el-link type="danger" @click="removeDataSource(scope.row)">删除</el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-divider ></el-divider>
      </el-col>
    </el-row>

    <el-dialog :title="'增加数据源'" :visible.sync="showDataSource" width="1024px" append-to-body :close-on-press-escape="false" :close-on-click-modal="false" :fullscreen="isFullScreen" v-if="showDataSource">
      <el-form ref="form" :model="form" label-width="150px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="数据源名称">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="对象映射类型">
              <el-select v-model="form.dataSourceType" placeholder="请选择对象映射类型">
                <el-option label="Object" :value="1"></el-option>
                <el-option label="Array" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关系类型">
              <el-select v-model="form.relationshipType" placeholder="请选择关系类型">
                <el-option label="根级" :value="1"></el-option>
                <el-option label="子级" :value="2"></el-option>
                <el-option label="union级" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="特殊逻辑">
              <el-select v-model="form.logicType" placeholder="请选择特殊逻辑">
                <el-option label="普通" :value="1"></el-option>
                <el-option label="行转列" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="上级数据源">
              <el-tree ref="pTree" :expand-on-click-node="false" :default-expanded-keys="selectTreeNode" :data="treeData" node-key='id'  :props="defaultProps" @node-click="handleNodeClick" default-expand-all :highlight-current="true" :current-node-key="form.parentDataId"></el-tree>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="上级数据源关联条件">
              <el-select v-model="form.parentDataRelationKey" placeholder="请选择上级数据源关联条件">
                <el-option :label="item.label" :value="item.id" v-for="item in parentDataRelationData"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col :span="24">
          <el-button type="primary" size="mini" @click="showMainForm">配置主表属性</el-button>
          <el-divider direction="vertical" ></el-divider>
          <el-button type="success" size="mini" @click="showRelationForm">添加关联表属性</el-button>
          <el-divider direction="vertical" ></el-divider>
          <el-button type="success" size="mini" @click="showAggregateForm">配置聚合查询</el-button>
          <el-divider direction="vertical" ></el-divider>
          <el-button type="success" size="mini" @click="previewSql">预览Sql脚本</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            ref="multipleTable"
            :data="finalTableConfig.allColumns"
            row-key="id">
            <el-table-column label="属性key" prop="id"></el-table-column>

            <el-table-column label="属性类型" prop="label" width="80">
              <template slot-scope="scope">{{ scope.row.mateType === 1 ? '元属性' : scope.row.mateType === 2 ? '扩展属性' : '聚合属性' }}</template>
            </el-table-column>
            <el-table-column label="属性来源" prop="label" width="80">
              <template slot-scope="scope">{{ scope.row.sourceType === 1 ? '主表' : scope.row.sourceType === 2 ? '关联表' : '聚合属性'}}</template>
            </el-table-column>
            <el-table-column label="属性label" prop="label">
              <template slot-scope="scope">
                <el-input v-model="scope.row.label" placeholder="请输入列表属性label" />
              </template>
            </el-table-column>
            <el-table-column label="参数类型" prop="paramType" width="180" >
              <template slot-scope="scope">
                <el-select v-model="scope.row.paramType" style="width: 100%"  :placeholder="'参数类型'" slot="prepend" placeholder="请选择" @change="selectChange($event, scope.row)">
                  <el-option  :key="0" :value="0" label="无" ></el-option>
                  <el-option  :key="1" :value="1" label="关联父级ID" ></el-option>
                  <el-option  :key="2" :value="2" label="委托ID" ></el-option>
                  <el-option  :key="3" :value="3" label="样品编码集合" ></el-option>
                  <el-option  :key="4" :value="4" label="自定义参数" ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="自定义参数" prop="label" width="180" >
              <template slot-scope="scope">
                <el-select v-model="scope.row.paramId" style="width: 100%"  :placeholder="'行转列配置'" slot="prepend" placeholder="请选择"  :disabled="scope.row.paramType !== 4" @change="changeParamName($event, scope.row)">
                  <el-option  :key="item.id" :value="item.id" :label="item.name" v-for="item in paramListData"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="行转列配置" prop="label" v-if="form.logicType === 2" width="180" >
              <template slot-scope="scope">
                <el-select v-model="scope.row.rowToColumn" style="width: 100%"  :placeholder="'行转列配置'" slot="prepend" placeholder="请选择">
                  <el-option  :key="0" :value="0" label="普通属性" ></el-option>
                  <el-option  :key="1" :value="1" label="行转列属性" ></el-option>
                  <el-option  :key="2" :value="2" label="值属性" ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="label" width="50">
              <template slot-scope="scope">
                <el-link type="danger" @click="removeTableColumn(scope.row)">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataSource">确定</el-button>
        <el-button @click="cancelDataConfig">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="'配置主表属性'" :visible.sync="showMain" width="1024px" append-to-body :close-on-press-escape="false" :close-on-click-modal="false" :fullscreen="isFullScreen" v-if="showMain">
      <el-row>
        <el-col :span="8">
          <el-divider content-position="center">主表信息</el-divider>
          <el-input
            v-model="tableSearchName"
            placeholder="请输入表名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          ></el-input>
          <el-scrollbar style="height: 400px;">
            <el-tree
              hight="400px"
              ref="tree"
              :data="getTableListInfoList"
              :filter-node-method="filterNode"
              @node-click="handleMainCheckChange">
            </el-tree>
          </el-scrollbar>
        </el-col>
        <el-col :span="8">
          <el-divider content-position="center">主表元属性</el-divider>
          <el-input
            v-model="mainColumnSearchName"
            placeholder="请输入属性名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          ></el-input>
          <el-scrollbar style="height: 400px;">
            <el-tree
              hight="400px"
              ref="mainColumnTree"
              :check-on-click-node="true"
              :data="getMainColumnListInfoList"
              :filter-node-method="filterColumnNode"
              show-checkbox
              @check-change="handleMainColumnCheckChange">
            </el-tree>
          </el-scrollbar>
        </el-col>
        <el-col :span="8">
          <el-divider content-position="center">主表扩展属性</el-divider>
          <el-row>
            <el-col :span="12">
              <el-select v-model="relationBusinessConfigId" placeholder="请选择业务类型" filterable style="width: 100%" @change="relationMainSelectChange">
                <el-option
                  v-for="item in businessConfigList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-select v-model="exDataKey" placeholder="请选择关联表主键" filterable style="width: 100%">
                <el-option
                  v-for="item in getMainColumnListInfoList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-input
            v-model="columnExSearchName"
            placeholder="请输入属性名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          ></el-input>
          <el-scrollbar style="height: 400px;">
            <el-tree
              hight="400px"
              ref="exMainDataTree"
              :check-on-click-node="true"
              :data="exDataOptions"
              :filter-node-method="filterColumnNode"
              show-checkbox
              @check-change="handleMainColumnCheckChange">
            </el-tree>
          </el-scrollbar>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitMain">确定</el-button>
        <el-button @click="cancelMain">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="'配置关联表属性'" :visible.sync="showRelation" width="1024px" append-to-body :close-on-press-escape="false" :close-on-click-modal="false" :fullscreen="isFullScreen">
      <el-row>

        <el-col :span="8">
          <el-divider content-position="center">关联表信息</el-divider>
          <el-input
            v-model="tableSearchName"
            placeholder="请输入表名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          ></el-input>
          <el-scrollbar style="height: 400px;">
            <el-tree
              hight="400px"
              ref="tree"
              :data="getTableListInfoList"
              :filter-node-method="filterNode"
              @node-click="handleCheckChange">
            </el-tree>
          </el-scrollbar>
        </el-col>
        <el-col :span="8">
          <el-divider content-position="center">关联表元属性</el-divider>
          <el-row>
            <el-col :span="12">
              <el-select v-model="relationKeyLeft" placeholder="请选择主表关联属性" filterable style="width: 100%">
                <el-option
                  v-for="item in getMainColumnListInfoList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-select v-model="relationKeyRight" placeholder="请选择关联表属性" filterable style="width: 100%">
                <el-option
                  v-for="item in getColumnListInfoList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-input
            v-model="columnSearchName"
            placeholder="请输入属性名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          ></el-input>
          <el-scrollbar style="height: 400px;">
            <el-tree
              hight="400px"
              ref="columnTree"
              :check-on-click-node="true"
              :data="getColumnListInfoList"
              :filter-node-method="filterColumnNode"
              show-checkbox
              @check-change="handleColumnCheckChange">
            </el-tree>
          </el-scrollbar>
        </el-col>
        <el-col :span="8">
          <el-divider content-position="center">关联表扩展属性</el-divider>
          <el-row>
            <el-col :span="12">
              <el-select v-model="relationBusinessConfigId" placeholder="请选择业务类型" filterable style="width: 100%" @change="relationSelectChange">
                <el-option
                  v-for="item in businessConfigList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-select v-model="relationExDataKey" placeholder="请选择关联表主键" filterable style="width: 100%">
                <el-option
                  v-for="item in getColumnListInfoList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-input
            v-model="columnSearchName"
            placeholder="请输入属性名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          ></el-input>
          <el-scrollbar style="height: 400px;">
            <el-tree
              hight="400px"
              ref="exDataTree"
              :check-on-click-node="true"
              :data="relationExDataOptions"
              :filter-node-method="filterColumnNode"
              show-checkbox
              @check-change="handleColumnCheckChange">
            </el-tree>
          </el-scrollbar>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRelation">确定</el-button>
        <el-button @click="cancelRelation">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="'配置聚合查询'" :visible.sync="showAggregateConfig" width="1024px" append-to-body :close-on-press-escape="false" :close-on-click-modal="false" :fullscreen="isFullScreen" v-if="showAggregateConfig">
      <el-divider content-position="center">已配置表明细</el-divider>
      <el-row>
        <el-col :span="24">
          <el-scrollbar style="height: 200px;">
            <el-table
              border
              :data="getAllTableInfoList"
              ooltip-effect="dark"
            >
              <el-table-column label="表名" align="center" prop="id"></el-table-column>
              <el-table-column label="备注" align="center"  prop="label"></el-table-column>
              <el-table-column label="类型" align="center"  prop="type"></el-table-column>
              <el-table-column label="查询别名-表" align="center"  prop="alias"></el-table-column>
              <el-table-column label="查询别名-扩展" align="center"  prop="aliasEx"></el-table-column>
            </el-table>
          </el-scrollbar>
        </el-col>
      </el-row>
      <el-divider content-position="center">聚合表明细</el-divider>
      <el-row>
        <el-col :span="24">
          <el-button type="primary" size="mini" @click="addAggregateTable">添加聚合表</el-button>
          <el-divider />
        </el-col>
        <el-col :span="24">
          <el-scrollbar style="height: 200px;">
            <el-table
              border
              :data="aggregateConfig.tableList"
              ooltip-effect="dark"
            >
              <el-table-column label="Join子句脚本" align="center" prop="script">
                <template scope="scope">
                  <el-input v-model="scope.row.script" placeholder="请输入Join子句脚本" />
                </template>
              </el-table-column>
              <el-table-column label="备注" align="center" prop="commit">
                <template scope="scope">
                  <el-input v-model="scope.row.commit" placeholder="请输入备注" />
                </template>
              </el-table-column>
              <el-table-column label="操作" prop="width" width="80">
                <template slot-scope="scope">
                  <el-link type="danger" @click="removeAggregateTable(scope.row, scope.$index)">删除</el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </el-col>
      </el-row>
      <el-divider content-position="center">聚合列明细</el-divider>
      <el-row>
        <el-col :span="24">
          <el-button type="primary" size="mini" @click="addAggregateColumn">添加聚合列</el-button><el-divider />
        </el-col>

        <el-col :span="24">
          <el-scrollbar style="height: 200px;">
            <el-table
              border
              :data="aggregateConfig.columnList"
              ooltip-effect="dark"
            >
              <el-table-column label="聚合列脚本" align="center" prop="script">
                <template scope="scope">
                  <el-input v-model="scope.row.script" placeholder="请输入聚合列脚本" />
                </template>
              </el-table-column>
              <el-table-column label="别名" align="center" prop="id">
                <template scope="scope">
                  <el-input v-model="scope.row.id" placeholder="请输入别名" />
                </template>
              </el-table-column>
              <el-table-column label="属性label" align="center" prop="label">
                <template scope="scope">
                  <el-input v-model="scope.row.label" placeholder="请输入属性label" />
                </template>
              </el-table-column>
              <el-table-column label="操作" prop="width" width="80">
                <template slot-scope="scope">
                  <el-link type="danger" @click="removeTableColumn(scope.row)">删除</el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </el-col>
      </el-row>
      <el-form ref="form" :model="aggregateConfig" label-width="150px">
        <el-form-item label="Group By 子句">
          <el-input type="textarea" v-model="aggregateConfig.groupScript" />
        </el-form-item>
        <el-form-item label="Having 子句" label-width="150px">
          <el-input type="textarea" v-model="aggregateConfig.havingScript" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAggregateConfig">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="'入口参数配置'" :visible.sync="showParam" width="780px" append-to-body :destroy-on-close="true" :close-on-click-modal="false" >
      <el-form ref="paramForm" :model="paramForm" label-width="120px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="参数类型">
              <el-select v-model="paramForm.type" placeholder="请选择参数类型">
                <el-option label="普通类型" :value="1"></el-option>
                <el-option label="集合类型" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="参数名称" prop="name">
              <el-input v-model="paramForm.name" placeholder="请输入参数名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="参数备注" prop="remark">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容" v-model="paramForm.remark" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveParamConfig" >确 定</el-button>
        <el-button @click="closeParamConfig">取 消</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import axios from 'axios';
  export default {
    name: 'dataSourceConfig',
    props:{
      mainId:{
        type: Number,
        default: null
      },
      title: {
        type: String,
        default: null
      },
      open:{
        type:Boolean,
        default: false,
      },
    },
    data() {
      return {
        showDataSource: false,
        isFullScreen: true,
        showMain: false,
        tableSearchName: null,
        columnSearchName: null,
        columnExSearchName: null,
        tableListInfo: [],
        relationExDataOptions: [],
        relationKeyLeft: null,
        relationKeyRight: null,
        relationExDataKey: null,
        relationTableName: null,
        relationBusinessConfigId: null,
        businessConfigList: null,
        mainColumnListInfo: [],
        columnListInfo: [],
        exDataOptions: [],
        mainColumnSearchName: null,
        exDataKey: null,
        showRelation: false,
        finalTableConfig: {},
        mainTableInfo: {},
        form: {
          id: null,
          templateId: null,
          name: '',
          dataSourceType: 1,
          relationshipType: 1,
          logicType: 1,
          parentDataId: null,
          parentDataName: null,
          parentDataRelationKey: null,
          remark: null,
        },
        listData: [],
        templateId: null,
        apiBaseUrl: window.globalEnv.VUE_APP_BASE_API,
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label',
          id: 'id',
        },
        parentDataRelationData:[],
        selectTreeNode: [],

        showAggregateConfig: false,
        aggregateConfig: {
          tableList: [],
          columnList: [],
          groupScript: null,
          havingScript: null,
        },
        showParam: false,
        paramListData: [],
        paramForm:{
          id: null,
          type: 1,
          name: null,
          dataSourceMainId: null,
          remark: null,
        }

      }
    },
    computed: {
      getTableListInfoList() {
        let result = [];
        this.tableListInfo.forEach(item => {
          let record = {
            id: item.tableName,
            label: item.tableName + ' | (' + item.tableComment + ')',
            // label: item.tableComment ,
          }
          result.push(record);
        })
        return result;
      },
      getColumnListInfoList() {
        let result = [];
        this.columnListInfo.forEach(item => {
          let record = {
            id: item.columnName,
            label: item.columnName + ' | (' + item.columnComment + ')',
            // label: item.columnComment ,
          }
          result.push(record);
        })
        return result;
      },
      getMainColumnListInfoList() {
        let result = [];
        this.mainColumnListInfo.forEach(item => {
          let record = {
            id: item.columnName,
            label: item.columnName + ' | (' + item.columnComment + ')',
            // label: item.columnComment ,
          }
          result.push(record);
        })
        return result;
      },
      getAllTableInfoList() {
        let result = [];
        result.push({
          id: this.finalTableConfig.mateConfig.mainTableInfo.tableName,
          label: this.finalTableConfig.mateConfig.mainTableInfo.tableName + ' | (' + this.finalTableConfig.mateConfig.mainTableInfo.tableComment + ')',
          type: '主表',
          alias: 'main',
          aliasEx: 'mainEx',
        })
        if(this.finalTableConfig.relationConfig){
          this.finalTableConfig.relationConfig.forEach((item, index) => {
            result.push({
              id: item.relationTableName,
              label: this.getTableListInfoList.filter((subItem) => subItem.id === item.relationTableName)[0].label,
              type: '关联表',
              alias: 'r' + index,
              aliasEx: 'rEx' + index,
            })
          })
        }
        return result;
      }
    },
    watch: {
      tableSearchName(val) {
        this.$nextTick(()=>{
          this.$refs.tree.filter(val);
        } )
      },
      columnSearchName(val) {
        this.$refs.columnTree.filter(val);
      },
      columnExSearchName(val) {
        this.$refs.exDataTree.filter(val);
      },
      mainColumnSearchName(val) {
        this.$refs.mainColumnTree.filter(val);
      },
      templateId(val) {
        console.log('watch templateId', val);
        this.$set(this.form, 'templateId', val);
        this.getReportDataSourceList();
        this.getReportDataSourceParamList();
      }
    },
    mounted() {
      this.getTableInfo();
    },
    methods: {
      beforeClose(){
        this.$emit('closeDataSourceConfig');
      },
      openEvent(){
        console.log('dataSourceConfig openEvent', this.mainId, this.treeData);
        this.form.templateId = this.mainId;
        this.templateId = this.mainId;
      },
      getTreeData(){
        let _this = this;
        let Url = _this.apiBaseUrl + '/reportDataSourceConfig/getReportDataSourceTree/' + this.form.templateId;
        axios({
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          method: 'get',
          url: Url,
        }).then(function (res) {
          if(res && res.data){
            _this.$set(_this, 'treeData', res.data.data);
            console.log('treeData', _this.treeData);
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      getReportDataSourceList(){
        let _this = this;
        let Url = _this.apiBaseUrl + '/reportDataSourceConfig/getReportDataSourceList/' + this.form.templateId;
        let params = this.form;
        this.$set(this.form, 'dataSourceConfig', this.finalTableConfig)
        axios({
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          method: 'get',
          url: Url,
        }).then(function (res) {
          if(res && res.data){
            _this.$set(_this, 'listData', res.data.data);
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      getTableInfo(){
        let _this = this;
        let Url = _this.apiBaseUrl + '/dbConfig/getTableInfo';
        axios({
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          method: 'get',
          url: Url,
          params: {
            // appid: appid,
            // ordernos: ordernos,
          }
        }).then(function (res) {
          if(res && res.data){
            _this.$set(_this, 'tableListInfo', res.data.data);
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      getColumnInfo(id){
        let _this = this;
        let Url = _this.apiBaseUrl + '/dbConfig/getColumnInfo/' + id;
        axios({
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          method: 'get',
          url: Url,
          params: {
            // appid: appid,
            // ordernos: ordernos,
          }
        }).then(function (res) {
          if(res && res.data){
            _this.$set(_this, 'columnListInfo', res.data.data);
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      getMainColumnInfo(id){
        let _this = this;
        let Url = _this.apiBaseUrl + '/dbConfig/getColumnInfo/' + id;
        axios({
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          method: 'get',
          url: Url,
          params: {
            // appid: appid,
            // ordernos: ordernos,
          }
        }).then(function (res) {
          if(res && res.data){
            _this.$set(_this, 'mainColumnListInfo', res.data.data);
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      getBusinessConfig(id){
        let _this = this;
        let Url = _this.apiBaseUrl + '/dbConfig/getBusinessConfig/' + id;
        axios({
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          method: 'get',
          url: Url,
          params: {
            // appid: appid,
            // ordernos: ordernos,
          }
        }).then(function (res) {
          if(res && res.data){
            _this.$set(_this, 'businessConfigList', res.data.data);
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      getExDataConfigOptions(id){
        let _this = this;
        let Url = _this.apiBaseUrl + '/dbConfig/getExDataConfigOptions/' + id;
        axios({
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          method: 'get',
          url: Url,
          params: {
            // appid: appid,
            // ordernos: ordernos,
          }
        }).then(function (res) {
          if(res && res.data){
            _this.$set(_this, 'relationExDataOptions', res.data.data);
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      getMainExDataConfigOptions(id){
        let _this = this;
        let Url = _this.apiBaseUrl + '/dbConfig/getExDataConfigOptions/' + id;
        axios({
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          method: 'get',
          url: Url,
          params: {
            // appid: appid,
            // ordernos: ordernos,
          }
        }).then(function (res) {
          if(res && res.data){
            _this.$set(_this, 'exDataOptions', res.data.data);
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      showDataConfig(id){
        console.log('showDataConfig', id);
        this.getTreeData();
        this.getReportDataSourceParamList();
        this.showDataSource = true;
        let templateId = this.form.templateId;
        this.$set(this, 'form',{
          id: null,
          templateId: templateId,
          mainId: templateId,
          name: '',
          dataSourceType: 1,
          relationshipType: 1,
          logicType: 1,
          parentDataId: null,
          parentDataName: null,
          parentDataRelationKey: null,
          remark: null,
        });
        this.$set(this, 'finalTableConfig', {});
        if(id && !isNaN(id)){
          let _this = this;
          let Url = _this.apiBaseUrl + '/reportDataSourceConfig/getReportDataSource/' + id;
          axios({
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            method: 'get',
            url: Url,
          }).then(function (res) {
            if(res && res.data){
              _this.$set(_this, 'form', res.data.data);
              _this.$set(_this, 'finalTableConfig', res.data.data.dataSourceConfig);
              if (_this.finalTableConfig.aggregateConfig) {
                _this.$set(_this, 'aggregateConfig', _this.finalTableConfig.aggregateConfig);
              }
              console.log('res.data.data.parentDataId', res.data.data.parentDataId);

              if(res.data.data.parentDataId){
                _this.selectTreeNode.splice(0);
                _this.selectTreeNode.push(res.data.data.parentDataId);
                _this.handleNodeClick({id: res.data.data.parentDataId});
                _this.$refs.pTree.setCurrentKey(res.data.data.parentDataId);
              }
              console.log('showDataConfig processAllColumns');
              _this.processAllColumns();
            }
          }).catch(function (error) {
            console.log(error)
          })
        }
      },
      cancelDataConfig(){
        this.showDataSource = false;
      },
      showMainForm(){
        this.showMain = true;
      },
      cancelMain(){
        this.showMain = false;
      },

      showRelationForm(){
        this.showRelation = true;
      },
      cancelRelation(){
        this.showRelation = false;
      },
      showAggregateForm(){
        this.showAggregateConfig = !this.showAggregateConfig;
      },
      submitAggregateConfig(){
        this.$set(this.finalTableConfig, 'aggregateConfig', this.aggregateConfig);
        this.showAggregateConfig = !this.showAggregateConfig;
        this.processAllColumns();
      },
      addAggregateTable(){
        this.aggregateConfig.tableList.push({
          script: '',
          commit: '',
        })
      },
      removeAggregateTable(row, index){
        this.aggregateConfig.tableList.splice(index, 1);
      },
      addAggregateColumn(){
        this.aggregateConfig.columnList.push({
          script: '',
          sourceType: 3,
          mateType: 3,
          id: '',
          label: '',
          sortNum: 100,
        })
      },
      handleCheckChange(data, checked, indeterminate){
        this.relationTableName = data.id;
        this.relationBusinessConfigId = null;
        this.getColumnInfo(data.id);
        this.getBusinessConfig(data.id);
      },
      handleMainCheckChange(data, checked, indeterminate){
        this.$set(this.mainTableInfo, 'tableName', data.id);
        this.relationTableName = data.id;
        this.relationBusinessConfigId = null;
        this.getMainColumnInfo(data.id);
        this.getBusinessConfig(data.id);
      },
      // 筛选节点
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      handleColumnCheckChange(data, checked, indeterminate){
        console.log(data, checked, indeterminate);
      },
      handleMainColumnCheckChange(data, checked, indeterminate){
        console.log(data, checked, indeterminate);
      },
      filterColumnNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      relationSelectChange(value){
        this.getExDataConfigOptions(value);
      },
      relationMainSelectChange(value){
        this.getMainExDataConfigOptions(value);
      },
      submitMain(){
        console.log(this.$refs.mainColumnTree.getCheckedNodes(), this.$refs.exMainDataTree.getCheckedNodes());
        let mateColumns = this.$refs.mainColumnTree.getCheckedNodes();
        mateColumns.forEach(item => {
          this.$set(item, 'sourceType', 1);
          this.$set(item, 'mateType', 1);
          this.$set(item, 'sortNum', 100);
          this.$set(item, 'tableAlias', 'main');
          this.$set(item, 'having', false);
          this.$set(item, 'paramType', 0);
        });
        let dynamicColumns = this.$refs.exMainDataTree.getCheckedNodes();
        dynamicColumns.forEach(item => {
          this.$set(item, 'sourceType', 1);
          this.$set(item, 'mateType', 2);
          this.$set(item, 'sortNum', 100);
          this.$set(item, 'id', item.key);
          this.$set(item, 'tableAlias', 'mainEx');
          this.$set(item, 'having', false);
          this.$set(item, 'paramType', 0);
        });
        if(this.finalTableConfig && this.finalTableConfig.mateConfig){
          if(mateColumns && mateColumns.length > 0) {
            this.finalTableConfig.mateConfig.mateColumns.push(...mateColumns);
          }
          if(dynamicColumns && dynamicColumns.length > 0){
            this.finalTableConfig.mateConfig.dynamicColumns.push(...dynamicColumns);
          }
          if(this.relationBusinessConfigId){
            this.$set(this.finalTableConfig.mateConfig, 'businessConfigId', this.relationBusinessConfigId);
          }
          if(this.exDataKey){
            this.$set(this.finalTableConfig.mateConfig, 'exDataKey', this.exDataKey);
          }
        }else{
          this.$set(this.finalTableConfig, 'mateConfig', {mateColumns: mateColumns, dynamicColumns: dynamicColumns, exDataKey: this.exDataKey, businessConfigId: this.relationBusinessConfigId});
        }

        this.$set(this.finalTableConfig.mateConfig, 'mainTableInfo', this.mainTableInfo);
        if(this.finalTableConfig.mateConfig.mateColumns){
          let hash = {};
          let result = this.finalTableConfig.mateConfig.mateColumns.reduce((preVal, curVal) => {
            hash[curVal.id] ? "" : (hash[curVal.id] = true && preVal.push(curVal));
            return preVal;
          }, []);
          this.$set(this.finalTableConfig.mateConfig, 'mateColumns', result);
        }

        if(this.finalTableConfig.mateConfig.dynamicColumns){
          let hash = {};
          let result = this.finalTableConfig.mateConfig.dynamicColumns.reduce((preVal, curVal) => {
            hash[curVal.id] ? "" : (hash[curVal.id] = true && preVal.push(curVal));
            return preVal;
          }, []);
          this.$set(this.finalTableConfig.mateConfig, 'dynamicColumns', result);
        }
        this.processAllColumns();
        this.cancelMain();
      },
      removeTableColumn(row){
        console.log(row);
        if(row.sourceType === 1){
          if(row.mateType === 1){
            this.$set(this.finalTableConfig.mateConfig, 'mateColumns', this.finalTableConfig.mateConfig.mateColumns.filter(item => item.id !== row.id));
          }else if(row.mateType === 2){
            this.$set(this.finalTableConfig.mateConfig, 'dynamicColumns', this.finalTableConfig.mateConfig.dynamicColumns.filter(item => item.id !== row.id));
          }
        }else if(row.sourceType === 2){
          if(row.mateType === 1){
            this.finalTableConfig.relationConfig.forEach(item => {
              this.$set(item, 'mateColumns', item.mateColumns.filter(subItem => subItem.id !== row.id));
            })
          }else{
            this.finalTableConfig.relationConfig.forEach(item => {
              this.$set(item, 'dynamicColumns', item.dynamicColumns.filter(subItem => subItem.id !== row.id));
            })
          }
        }else{
          if(this.finalTableConfig.aggregateConfig && this.finalTableConfig.aggregateConfig.columnList){
            this.$set(this.finalTableConfig.aggregateConfig, 'columnList', this.finalTableConfig.aggregateConfig.columnList.filter(item => item.id !== row.id));
          }
        }
        if(this.finalTableConfig.relationConfig){
          this.finalTableConfig.relationConfig.forEach((item, index) => {
            if(item.mateColumns.length === 0 && item.dynamicColumns.length === 0){
              this.finalTableConfig.relationConfig.splice(index, 1);
            }
          })
        }
        this.processAllColumns();
      },
      submitRelation(){
        console.log(this.$refs.columnTree.getCheckedNodes(), this.$refs.exDataTree.getCheckedNodes());
        let mateColumns = this.$refs.columnTree.getCheckedNodes();
        mateColumns.forEach(item => {
          this.$set(item, 'sourceType', 2);
          this.$set(item, 'mateType', 1);
          this.$set(item, 'sortNum', 100);
          this.$set(item, 'having', false);
          this.$set(item, 'paramType', 0);
        });
        let dynamicColumns = this.$refs.exDataTree.getCheckedNodes();
        dynamicColumns.forEach(item => {
          this.$set(item, 'sourceType', 2);
          this.$set(item, 'mateType', 2);
          this.$set(item, 'sortNum', 100);
          this.$set(item, 'id', item.key);
          this.$set(item, 'having', false);
          this.$set(item, 'paramType', 0);
        });
        if(!this.finalTableConfig.relationConfig ){
          this.finalTableConfig.relationConfig = new Array();
        }
        let relationConfig = {
          mateColumns: mateColumns,
          dynamicColumns: dynamicColumns,
          exDataKey: this.relationExDataKey,
          relationKeyLeft: this.relationKeyLeft,
          relationKeyRight: this.relationKeyRight,
          relationTableName: this.relationTableName,
          businessConfigId: this.relationBusinessConfigId,
        };
        if((mateColumns && mateColumns.length > 0) || (dynamicColumns && dynamicColumns.length > 0)){
          this.finalTableConfig.relationConfig.push(relationConfig);
        }
        this.processAllColumns();
        this.cancelRelation();
      },
      submitDataSource(){
        let _this = this;
        let Url = _this.apiBaseUrl + '/reportDataSourceConfig/saveReportDataSourceConfig';
        let params = this.form;
        this.$set(this.form, 'dataSourceConfig', this.finalTableConfig)
        axios({
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          method: 'post',
          url: Url,
          data: params
        }).then(function (res) {
          _this.showDataSource = false;
          _this.getReportDataSourceList();
        }).catch(function (error) {
          console.log(error)
        })
      },
      previewSql(){
        console.log(this.finalTableConfig);
        let sql = 'select ';
        if(this.finalTableConfig.mateConfig.mateColumns){
          for(let index in this.finalTableConfig.mateConfig.mateColumns){
            let item = this.finalTableConfig.mateConfig.mateColumns[index];
            sql += item.tableAlias + '.' + item.id + ' as ' + item.id + ', ';
          }
        }
        if(this.finalTableConfig.mateConfig.dynamicColumns){
          for(let index in this.finalTableConfig.mateConfig.dynamicColumns){
            let item = this.finalTableConfig.mateConfig.dynamicColumns[index];
            sql += 'JSON_UNQUOTE(mainEx.ex_form_data -> \'$.' + item.id + '\') as ' + item.id + ', ';
          }
        }
        if(this.finalTableConfig.relationConfig){
          for(let index in this.finalTableConfig.relationConfig){
            let item = this.finalTableConfig.relationConfig[index];
            if(item.mateColumns){
              for (let subIndex in item.mateColumns){
                let subItem = item.mateColumns[subIndex];
                sql += subItem.tableAlias + '.' + subItem.id + ' as ' + subItem.id + ', ';
              }
            }
            if(item.dynamicColumns){
              for (let subIndex in item.dynamicColumns){
                let subItem = item.dynamicColumns[subIndex];
                sql += 'JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') as ' + subItem.id + ', ';
              }
            }
          }
        }
        if(this.finalTableConfig.aggregateConfig && this.finalTableConfig.aggregateConfig.columnList){
          for(let index in this.finalTableConfig.aggregateConfig.columnList){
            let item = this.finalTableConfig.aggregateConfig.columnList[index];
            sql += item.script + ' as ' + item.id + ', ';
          }
        }
        sql = sql.substr(0, sql.length - 2);
        sql += ' from ' + this.finalTableConfig.mateConfig.mainTableInfo.tableName + ' main';
        if(this.finalTableConfig.mateConfig.dynamicColumns && this.finalTableConfig.mateConfig.dynamicColumns.length > 0){
          sql += ' left join env_ex_form_data as mainEx on mainEx.business_id = main.' + this.finalTableConfig.mateConfig.exDataKey + ' and mainEx.business_config_id = ' + this.finalTableConfig.mateConfig.businessConfigId;
        }
        if(this.finalTableConfig.relationConfig){
          for(let index in this.finalTableConfig.relationConfig){
            let item = this.finalTableConfig.relationConfig[index];
            sql += ' left join ' + item.relationTableName + ' r' + index + ' on main.' + item.relationKeyLeft + ' = r' + index + '.' + item.relationKeyRight
          }
        }
        if(this.finalTableConfig.aggregateConfig && this.finalTableConfig.aggregateConfig.tableList.length > 0){
          for(let index in this.finalTableConfig.aggregateConfig.tableList){
            let item = this.finalTableConfig.aggregateConfig.tableList[index];
            sql += ' ' + item.script + ' ';
          }
        }
        sql += ' where true ';
        if(this.finalTableConfig.mateConfig.mateColumns){
          for(let index in this.finalTableConfig.mateConfig.mateColumns){
            let item = this.finalTableConfig.mateConfig.mateColumns[index];
            if(item && item.search && !item.having){
              switch (item.searchLogic) {
                case 0:
                  sql += ' and main.' + item.id + ' = ? ';
                  break;
                case 1:
                  sql += ' and main.' + item.id + ' != ? ';
                  break;
                case 2:
                  sql += ' and main.' + item.id + ' like concat(\'%\', ?, \'%\')';
                  break;
                case 3:
                  sql += ' and main.' + item.id + ' > ? ';
                  break;
                case 4:
                  sql += ' and main.' + item.id + ' >= ? ';
                  break;
                case 5:
                  sql += ' and main.' + item.id + ' < ? ';
                  break;
                case 6:
                  sql += ' and main.' + item.id + ' <= ? ';
                  break;
                case 7:
                  sql += ' and main.' + item.id + ' between ? and ? ';
                  break;

              }
            }
          }
        }
        if(this.finalTableConfig.mateConfig.dynamicColumns){
          for(let index in this.finalTableConfig.mateConfig.dynamicColumns){
            let item = this.finalTableConfig.mateConfig.dynamicColumns[index];
            if(item && item.search && !item.having){
              switch (item.searchLogic) {
                case 0:
                  sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' = ? ';
                  break;
                case 1:
                  sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' != ? ';
                  break;
                case 2:
                  sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' like concat(\'%\', ?, \'%\') ';
                  break;
                case 3:
                  sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' > ? ';
                  break;
                case 4:
                  sql += ' and main.' + item.id + ' >= ? ';
                  sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' >= ? ';
                  break;
                case 5:
                  sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' < ? ';
                  break;
                case 6:
                  sql += ' and main.' + item.id + ' <= ? ';
                  sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' <= ? ';
                  break;
                case 7:
                  sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' between ? and ? ';
                  break;

              }
            }
          }
        }
        if(this.finalTableConfig.relationConfig){
          for(let index in this.finalTableConfig.relationConfig){
            let item = this.finalTableConfig.relationConfig[index];
            if(item.mateColumns){
              for (let subIndex in item.mateColumns){
                let subItem = item.mateColumns[index];
                if(subItem && subItem.search && !subItem.having){
                  switch (item.searchLogic) {
                    case 0:
                      sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' = ? ';
                      break;
                    case 1:
                      sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' != ? ';
                      break;
                    case 2:
                      sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' like concat(\'%\', ?, \'%\')';
                      break;
                    case 3:
                      sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' > ? ';
                      break;
                    case 4:
                      sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' >= ? ';
                      break;
                    case 5:
                      sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' < ? ';
                      break;
                    case 6:
                      sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' <= ? ';
                      break;
                    case 7:
                      sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' between ? and ? ';
                      break;

                  }
                }
              }
            }
            if(item.dynamicColumns){
              for (let subIndex in item.dynamicColumns){
                let subItem = item.dynamicColumns[subIndex];
                if(subItem && subItem.search && !subItem.having){
                  switch (item.searchLogic) {
                    case 0:
                      sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') = ? ';
                      break;
                    case 1:
                      sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') != ? ';
                      break;
                    case 2:
                      sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') like concat(\'%\', ?, \'%\')';
                      break;
                    case 3:
                      sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') > ? ';
                      break;
                    case 4:
                      sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') >= ? ';
                      break;
                    case 5:
                      sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') < ? ';
                      break;
                    case 6:
                      sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') <= ? ';
                      break;
                    case 7:
                      sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') between ? and ? ';
                      break;

                  }
                }
              }
            }
          }
        }
        if(this.finalTableConfig.aggregateConfig && this.finalTableConfig.aggregateConfig.groupScript){
          sql += ' ' + this.finalTableConfig.aggregateConfig.groupScript ;
          sql += ' having true';
          if(this.finalTableConfig.mateConfig.mateColumns){
            for(let index in this.finalTableConfig.mateConfig.mateColumns){
              let item = this.finalTableConfig.mateConfig.mateColumns[index];
              if(item && item.search && item.having){
                switch (item.searchLogic) {
                  case 0:
                    sql += ' and main.' + item.id + ' = ? ';
                    break;
                  case 1:
                    sql += ' and main.' + item.id + ' != ? ';
                    break;
                  case 2:
                    sql += ' and main.' + item.id + ' like concat(\'%\', ?, \'%\')';
                    break;
                  case 3:
                    sql += ' and main.' + item.id + ' > ? ';
                    break;
                  case 4:
                    sql += ' and main.' + item.id + ' >= ? ';
                    break;
                  case 5:
                    sql += ' and main.' + item.id + ' < ? ';
                    break;
                  case 6:
                    sql += ' and main.' + item.id + ' <= ? ';
                    break;
                  case 7:
                    sql += ' and main.' + item.id + ' between ? and ? ';
                    break;

                }
              }
            }
          }
          if(this.finalTableConfig.mateConfig.dynamicColumns){
            for(let index in this.finalTableConfig.mateConfig.dynamicColumns){
              let item = this.finalTableConfig.mateConfig.dynamicColumns[index];
              if(item && item.search && item.having){
                switch (item.searchLogic) {
                  case 0:
                    sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' = ? ';
                    break;
                  case 1:
                    sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' != ? ';
                    break;
                  case 2:
                    sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' like concat(\'%\', ?, \'%\') ';
                    break;
                  case 3:
                    sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' > ? ';
                    break;
                  case 4:
                    sql += ' and main.' + item.id + ' >= ? ';
                    sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' >= ? ';
                    break;
                  case 5:
                    sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' < ? ';
                    break;
                  case 6:
                    sql += ' and main.' + item.id + ' <= ? ';
                    sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' <= ? ';
                    break;
                  case 7:
                    sql += ' and mainEx.ex_form_data -> \'$.' + item.id + '\' between ? and ? ';
                    break;

                }
              }
            }
          }
          if(this.finalTableConfig.relationConfig){
            for(let index in this.finalTableConfig.relationConfig){
              let item = this.finalTableConfig.relationConfig[index];
              if(item.mateColumns){
                for (let subIndex in item.mateColumns){
                  let subItem = item.mateColumns[index];
                  if(subItem && subItem.search && subItem.having){
                    switch (item.searchLogic) {
                      case 0:
                        sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' = ? ';
                        break;
                      case 1:
                        sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' != ? ';
                        break;
                      case 2:
                        sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' like concat(\'%\', ?, \'%\')';
                        break;
                      case 3:
                        sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' > ? ';
                        break;
                      case 4:
                        sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' >= ? ';
                        break;
                      case 5:
                        sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' < ? ';
                        break;
                      case 6:
                        sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' <= ? ';
                        break;
                      case 7:
                        sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' between ? and ? ';
                        break;

                    }
                  }
                }
              }
              if(item.dynamicColumns){
                for (let subIndex in item.dynamicColumns){
                  let subItem = item.dynamicColumns[subIndex];
                  if(subItem && subItem.search && subItem.having){
                    switch (item.searchLogic) {
                      case 0:
                        sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') = ? ';
                        break;
                      case 1:
                        sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') != ? ';
                        break;
                      case 2:
                        sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') like concat(\'%\', ?, \'%\')';
                        break;
                      case 3:
                        sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') > ? ';
                        break;
                      case 4:
                        sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') >= ? ';
                        break;
                      case 5:
                        sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') < ? ';
                        break;
                      case 6:
                        sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') <= ? ';
                        break;
                      case 7:
                        sql += ' and JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') between ? and ? ';
                        break;

                    }
                  }
                }
              }
            }
          }
        }

        if(this.finalTableConfig.allColumns.filter(item => item.sort).length > 0){
          sql += ' order by ';
          for(let index in this.finalTableConfig.allColumns){
            let item = this.finalTableConfig.allColumns[index];
            if(item.sort){
              sql += item.id + ' DESC, '
            }
          }
          sql = sql.substr(0, sql.length - 2);
        }
        sql += ' limit 10';
        console.log('sql', sql);
        this.showPreViewSql = true;
        this.preViewSqlStr = sql;

      },
      closePreView(){
        this.showPreViewSql = false;
      },
      processAllColumns(){
        let mainConfig = [];
        if(this.finalTableConfig.mateConfig){
          let mainMateColumns = this.finalTableConfig.mateConfig.mateColumns;
          let dynamicColumns = this.finalTableConfig.mateConfig.dynamicColumns;
          mainMateColumns.forEach(item => {
            this.$set(item, 'tableAlias', 'main');
            if((item.hasOwnProperty("having") && item.having) || !item.hasOwnProperty("having")){
              this.$set(item, 'having', false);
            }
          })
          dynamicColumns.forEach(item => {
            this.$set(item, 'tableAlias', 'mainEx');
            if((item.hasOwnProperty("having") && item.having) || !item.hasOwnProperty("having")){
              this.$set(item, 'having', false);
            }
          })
          mainConfig = [...mainMateColumns, ...dynamicColumns];
          console.log(mainConfig);
        }
        if(this.finalTableConfig.relationConfig){
          this.finalTableConfig.relationConfig.forEach((item, index) => {
            let mainMateColumns = item.mateColumns;
            let dynamicColumns = item.dynamicColumns;
            mainMateColumns.forEach(subItem => {
              this.$set(subItem, 'tableAlias', 'r' + index);
              if((subItem.hasOwnProperty("having") && subItem.having) || !subItem.hasOwnProperty("having")){
                this.$set(subItem, 'having', false);
              }
            })
            dynamicColumns.forEach(subItem => {
              this.$set(subItem, 'tableAlias', 'rEx' + index);
              if((subItem.hasOwnProperty("having") && subItem.having) || !subItem.hasOwnProperty("having")){
                this.$set(subItem, 'having', false);
              }
            })
            mainConfig.push(...mainMateColumns);
            mainConfig.push(...dynamicColumns);
          })
        }
        if(this.finalTableConfig.aggregateConfig && this.finalTableConfig.aggregateConfig.columnList && this.finalTableConfig.aggregateConfig.columnList.length > 0){
          let columnList = this.finalTableConfig.aggregateConfig.columnList;
          mainConfig.push(...columnList);
        }
        console.log('mainConfig', mainConfig);
        let hash = {};
        let finalMainConfig = mainConfig.reduce((preVal, curVal) => {
          hash[curVal.id] ? "" : (hash[curVal.id] = true && preVal.push(curVal));
          return preVal;
        }, []);
        finalMainConfig.forEach(item => {
          if(!item.hasOwnProperty('sortNum')){
            console.log('set sortNum')
            this.$set(item, 'sortNum', 100);
          }
        })
        finalMainConfig = finalMainConfig.sort(function (a, b) {
          return a.sortNum - b.sortNum;
        });
        this.$set(this.finalTableConfig, 'allColumns', finalMainConfig);
        // this.initSort();
      },
      handleNodeClick(data){
        console.log('handleNodeClick', data.id);
        this.$set(this.form, 'parentDataId', data.id);
        let _this = this;
        let Url = _this.apiBaseUrl + '/reportDataSourceConfig/getReportDataSource/' + data.id;
        axios({
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          method: 'get',
          url: Url,
        }).then(function (res) {
          if(res && res.data){
            console.log('handleNodeClick', res.data.data);
            _this.parentDataRelationData.splice(0);
            _this.$set(_this, 'parentDataRelationData', res.data.data.dataSourceConfig.allColumns);
          }
        }).catch(function (error) {
          console.log(error)
        })

      },
      selectChange(v1, v2){
        console.log('selectChange', v1, v2);
        if(v1 === 1){

        }else if(v1 === 2){
          this.$set(v2, 'searchLogic', 0);
        }else if(v1 === 3){
          this.$set(v2, 'searchLogic', 0);
        }
      },
      removeDataSource(row){
        console.log('removeDataSource', row);
        let _this = this;
        let Url = _this.apiBaseUrl + '/reportDataSourceConfig/remove/' + row.id;
        axios({
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          method: 'post',
          url: Url,
        }).then(function (res) {
          _this.getReportDataSourceList();
        }).catch(function (error) {
          console.log(error)
        })
      },
      showParamConfig(id){
        console.log()
        this.showParam = true;
        this.$set(this, 'paramForm', {
            id: null,
            type: 1,
            name: null,
            dataSourceMainId: null,
            remark: null,
        });
        if(id){
          let _this = this;
          let Url = _this.apiBaseUrl + '/reportDataSourceParam/get?id=' + id;
          axios({
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            method: 'get',
            url: Url,
          }).then(function (res) {
            console.log('showParamConfig', res)
            if(res && res.data){
              _this.$set(_this, 'paramForm', res.data.data);
            }
          }).catch(function (error) {
            console.log(error)
          })
        }
      },
      saveParamConfig(){
        console.log('saveParamConfig');
        let _this = this;
        _this.paramForm.dataSourceMainId = _this.templateId;
        let Url = _this.apiBaseUrl + '/reportDataSourceParam/save';
        axios({
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          method: 'post',
          url: Url,
          data: _this.paramForm
        }).then(function (res) {
          _this.getReportDataSourceParamList();
          _this.closeParamConfig();
        }).catch(function (error) {
          console.log(error)
        })
      },
      closeParamConfig(){
        this.showParam = false;
      },
      removeParamConfig(){

      },
      getReportDataSourceParamList(){
        console.log('reportDataSourceParam')
        let _this = this;
        let Url = _this.apiBaseUrl + '/reportDataSourceParam/getAllList/' + _this.templateId;
        axios({
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          method: 'post',
          url: Url,
        }).then(function (res) {
          if(res && res.data){
            _this.$set(_this, 'paramListData', res.data.data)
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      changeParamName(val, row){
        let tempData = this.paramListData.filter(item => item.id === val);
        if(tempData){
          this.$set(row, 'paramDetail', tempData[0]);
        }
      }
    }
  }
</script>

<style scoped>

</style>

<template>

    <div>
        <!-- 添加或修改业务单运行实例对话框 -->
        <el-dialog :title="title" :visible.sync="showTableColumnConfig" width="100wv" height="100hv" append-to-body
                   :close-on-press-escape="false" :close-on-click-modal="false" :fullscreen="isFullScreen" @close="cancel">
            <el-row v-if="$store.state.user.roles.includes('admin')">
                <el-col :span="24">
                    <el-button type="primary" size="mini" @click="showMainForm">配置主表属性</el-button>
                    <el-divider direction="vertical"/>
                    <el-button type="success" size="mini" @click="showRelationForm">添加关联表属性</el-button>
                    <el-divider direction="vertical"/>
                    <el-button type="success" size="mini" @click="showAggregateForm">配置聚合查询</el-button>
                    <el-divider direction="vertical"/>
                    <el-button type="success" size="mini" @click="preview">预览列表</el-button>
                    <el-divider direction="vertical"/>
                    <el-button type="success" size="mini" @click="previewSql">预览Sql脚本</el-button>
                </el-col>
            </el-row>
            <el-divider/>
            <el-row>
                <el-col :span="24">
                    <el-table
                        ref="multipleTable"
                        :data="finalTableConfig.allColumns"
                        row-key="id"
                        style="width: 100%">
                        <el-table-column class-name="handle" label="属性key" prop="id" v-if="$store.state.user.roles.includes('admin')"/>

                        <el-table-column label="属性别名" prop="label"
                                         v-if="$store.state.user.roles.includes('admin')">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.aliasName" placeholder="请输入属性别名" :disabled="scope.row.sourceType > 2" />
                            </template>
                        </el-table-column>
                        <el-table-column label="属性类型" prop="label" width="100"
                                         v-if="$store.state.user.roles.includes('admin')">
                            <template slot-scope="scope">{{
                                    scope.row.mateType === 1 ? '元属性' : scope.row.mateType === 2 ? '扩展' : '聚合'
                                }}-
                                {{ scope.row.sourceType === 1 ? '主表' : scope.row.sourceType === 2 ? '关联' : '聚合' }}
                            </template>
                        </el-table-column>
<!--                        <el-table-column label="属性来源" prop="label" width="80"-->
<!--                                         v-if="$store.state.user.roles.includes('admin')">-->
<!--                            <template slot-scope="scope">-->
<!--                                {{ scope.row.sourceType === 1 ? '主表' : scope.row.sourceType === 2 ? '关联表' : '聚合属性' }}-->
<!--                            </template>-->
<!--                        </el-table-column>-->
                        <el-table-column label="属性label" prop="label">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.label" placeholder="请输入列表属性label"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="列表隐藏" prop="hidden" width="50">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.hidden"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="查询条件" prop="search" width="50">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.search"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="Having" prop="having" width="50"
                                         v-if="$store.state.user.roles.includes('admin')">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.having"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="隐藏条件" prop="searchHidden" width="50"
                                         v-if="$store.state.user.roles.includes('admin')">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.searchHidden"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="查询控件类型" prop="search" width="120"
                                         v-if="$store.state.user.roles.includes('admin')">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.searchType" :placeholder="'查询控件类型'" slot="prepend"
                                           placeholder="请选择" :disabled="!scope.row.search"
                                           @change="initSearchTypeValue(scope.row)">
                                    <el-option :key="0" :value="0" label="文本"/>
                                    <el-option :key="1" :value="1" label="数字"/>
                                    <el-option :key="2" :value="2" label="下拉"/>
                                    <el-option :key="7" :value="7" label="下拉树"/>
                                    <el-option :key="4" :value="4" label="时间"/>
                                    <el-option :key="5" :value="5" label="日期"/>
                                    <el-option :key="6" :value="6" label="时间+日期"/>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="查询逻辑" prop="search" width="120"
                                         v-if="$store.state.user.roles.includes('admin')">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.searchLogic" :placeholder="'请选择查询逻辑'"
                                           slot="prepend" placeholder="请选择" :disabled="!scope.row.search"
                                           @change="initSearchLogic(scope.row)">
                                    <el-option :key="0" :value="0" label="等于"/>
                                    <el-option :key="1" :value="1" label="不等于"/>
                                    <el-option :key="2" :value="2" label="包含"/>
                                    <el-option :key="3" :value="3" label="大于"/>
                                    <el-option :key="4" :value="4" label="大于等于"/>
                                    <el-option :key="5" :value="5" label="小于"/>
                                    <el-option :key="6" :value="6" label="小于等于"/>
                                    <el-option :key="7" :value="7" label="区间"
                                               :disabled="![1, 4, 5, 6].includes(scope.row.searchType)"/>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="系统参数" prop="searchHidden" width="50"
                                         v-if="$store.state.user.roles.includes('admin')">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.sysQueryType"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="默认查询条件" prop="label" width="200px"
                                         v-if="$store.state.user.roles.includes('admin')">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.defaultQueryValue" placeholder="请输入默认查询条件"
                                          v-if="scope.row.searchType === 0 && !scope.row.sysQueryType"
                                          class="input-with-select"/>
                                <el-select v-model="scope.row.sysQueryValue" :placeholder="'请输入默认查询条件'"
                                           slot="prepend" placeholder="请选择"
                                           v-if="scope.row.searchType === 0 && scope.row.sysQueryType"
                                           :clearable="true">
                                    <el-option :key="0" :value="0" label="登录人ID"/>
                                    <el-option :key="1" :value="1" label="登录人nickname"/>
                                    <el-option :key="2" :value="2" label="登录人部门ID"/>
                                    <el-option :key="3" :value="3" label="登录人部门名称"/>
                                </el-select>
                                <el-input-number v-model="scope.row.defaultQueryValue" controls-position="right"
                                                 v-else-if="scope.row.searchType === 1 && scope.row.searchLogic !== 7"/>
                                <el-row v-else-if="scope.row.searchType === 1 && scope.row.searchLogic === 7">
                                    <el-col :span="24">
                                        <NumberRange v-model="scope.row.defaultQueryValue"/>
                                    </el-col>
                                </el-row>

                                <el-button type="primary" size="mini" v-else-if="scope.row.searchType === 2"
                                           @click="selectOptionConfig(scope.row)">配置数据源
                                </el-button>

                                <el-button type="primary" size="mini" v-else-if="scope.row.searchType === 7"
                                           @click="selectTreeOptionConfig(scope.row)">配置数据源
                                </el-button>
                                <el-row v-else-if="scope.row.searchType === 4">
                                    <el-col :span="24">
                                        <el-time-picker v-model="scope.row.defaultQueryValue" value-format="HH:mm:ss"
                                                        size="mini" placeholder="请选择时间"
                                                        v-if="scope.row.searchLogic !== 7"/>
                                        <el-time-picker is-range v-model="scope.row.defaultQueryValue"
                                                        value-format="HH:mm:ss" size="mini" range-separator="至"
                                                        start-placeholder="开始时间" end-placeholder="结束时间"
                                                        placeholder="选择时间范围" v-if="scope.row.searchLogic === 7"/>
                                    </el-col>
                                </el-row>
                                <el-row v-else-if="scope.row.searchType === 5">
                                    <el-col :span="24">
                                        <el-date-picker v-model="scope.row.defaultQueryValue" value-format="yyyy-MM-dd"
                                                        size="mini" align="right" type="date" placeholder="选择日期"
                                                        :picker-options="pickerOptions"
                                                        v-if="scope.row.searchLogic !== 7"/>
                                        <el-date-picker v-model="scope.row.defaultQueryValue" value-format="yyyy-MM-dd"
                                                        size="mini" type="daterange" align="right" unlink-panels
                                                        range-separator="至" start-placeholder="开始日期"
                                                        end-placeholder="结束日期" :picker-options="pickerRangeOptions"
                                                        v-if="scope.row.searchLogic === 7"/>
                                    </el-col>
                                </el-row>
                                <el-row v-else-if="scope.row.searchType === 6">
                                    <el-col :span="24">
                                        <el-date-picker v-model="scope.row.defaultQueryValue"
                                                        value-format="yyyy-MM-dd HH:mm:ss" size="mini" type="datetime"
                                                        placeholder="选择日期时间" align="right"
                                                        :picker-options="pickerOptions"
                                                        v-if="scope.row.searchLogic !== 7"/>
                                        <el-date-picker v-model="scope.row.defaultQueryValue"
                                                        value-format="yyyy-MM-dd HH:mm:ss" size="mini"
                                                        style="width: 100%" type="datetimerange" align="right"
                                                        unlink-panels range-separator="至" start-placeholder="开始日期"
                                                        end-placeholder="结束日期" :picker-options="pickerRangeOptions"
                                                        v-if="scope.row.searchLogic === 7"/>
                                    </el-col>
                                </el-row>
                            </template>
                        </el-table-column>
                        <el-table-column label="允许排序" prop="sort" width="50" >
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.sort" @change="changeSort($event, scope.$index)"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="默认排序" prop="sort" width="50" >
                            <template slot-scope="scope">
<!--                                <el-switch v-model="scope.row.defaultSort" :disabled="!scope.row.sort" @change="changeDefaultSort($event, scope.$index)"/>-->
                                <el-switch v-model="scope.row.defaultSort" :disabled="!scope.row.sort"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="排序顺序" prop="sort" width="80" >
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.defaultSortNum" placeholder="请输入排序顺序" :disabled="!scope.row.defaultSort"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="排序方式" prop="sort" width="100">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.sortType" :placeholder="'请选择查询逻辑'"
                                           slot="prepend" placeholder="请选择" :disabled="!scope.row.defaultSort">
                                    <el-option :key="0" :value="0" label="降序"/>
                                    <el-option :key="1" :value="1" label="升序"/>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="宽度" prop="width" width="80">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.width" placeholder="请输入宽度"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="排序" prop="width" width="70">
                            <template slot-scope="scope">
                                <el-link type="danger" @click="sortUp(scope.$index, scope.row)">↑上移↑</el-link>
                                <el-link type="danger" @click="sortDown(scope.$index, scope.row)">↓下移↓</el-link>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" prop="width" width="80"
                                         v-if="$store.state.user.roles.includes('admin')">
                            <template slot-scope="scope">
                                <el-link type="danger" @click="removeTableColumn(scope.row)">删除</el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确定</el-button>
                <el-button @click="cancel">取消</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="'配置主表属性'" :visible.sync="showMain" width="1024px" append-to-body
                   :close-on-press-escape="false" :close-on-click-modal="false" :fullscreen="isFullScreen"
                   v-if="showMain">
            <el-row>
                <el-col :span="12">
                    <el-switch
                        v-model="userDataScope"
                        active-text="启用数据权限"
                        inactive-text="关闭数据权限"
                        :active-value="1"
                        :inactive-value="2"
                    >
                    </el-switch>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6" v-if="userDataScope === 1">
                        <el-input
                            v-model="deptIdName"
                            placeholder="请输入部门ID列名称"
                            clearable
                            size="small"
                            style="margin-bottom: 20px"
                        />
                </el-col>
                <el-col :span="6" v-if="userDataScope === 1">
                        <el-input
                            v-model="userIdName"
                            placeholder="请输入用户ID列名称"
                            clearable
                            size="small"
                            style="margin-bottom: 20px"
                        />
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" v-if="runType !== undefined && runType !== null && runType !== 1">
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
                <el-col :span="(runType !== undefined && runType !== null && runType !== 1) ? 8 : 12">
                    <el-divider content-position="center">主表元属性</el-divider>
                    <el-input
                        v-model="mainColumnSearchName"
                        placeholder="请输入属性名称"
                        clearable
                        size="small"
                        prefix-icon="el-icon-search"
                        style="margin-bottom: 20px"
                    />
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
                <el-col :span="(runType !== undefined && runType !== null && runType !== 1) ? 8 : 12">
                    <el-divider content-position="center">主表扩展属性</el-divider>
                    <el-row>
                        <el-col :span="12" v-if="(runType !== undefined && runType !== null && runType !== 1)">
                            <el-select v-model="relationBusinessConfigId" placeholder="请选择业务类型" filterable style="width: 100%" @change="relationMainSelectChange">
                                <el-option
                                    v-for="item in businessConfigList"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="(runType !== undefined && runType !== null && runType !== 1) ? 12 : 24">
                            <el-select v-model="exDataKey" placeholder="请选择关联表主键" filterable style="width: 100%">
                                <el-option
                                    v-for="item in getMainColumnListInfoList"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="24">
                            <el-input
                                v-model="columnExSearchName"
                                placeholder="请输入属性名称"
                                clearable
                                size="small"
                                prefix-icon="el-icon-search"
                                style="margin-bottom: 20px"
                            />
                            <el-scrollbar style="height: 400px;">
                                <el-tree
                                    hight="400px"
                                    ref="exMainDataTree"
                                    :check-on-click-node="true"
                                    :data="exDataOptions"
                                    :filter-node-method="filterColumnNode"
                                    show-checkbox
                                    @check-change="handleColumnCheckChange">
                                </el-tree>
                            </el-scrollbar>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitMain">确定</el-button>
                <el-button @click="cancelMain">取消</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="'配置关联表属性'" :visible.sync="showRelation" width="1024px" append-to-body
                   :close-on-press-escape="false" :close-on-click-modal="false" :fullscreen="isFullScreen">
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
                    />
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
                            <el-select v-model="relationKeyLeft" placeholder="请选择主表关联属性" filterable
                                       style="width: 100%">
                                <el-option
                                    v-for="item in getMainColumnListInfoList"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="12">
                            <el-select v-model="relationKeyRight" placeholder="请选择关联表属性" filterable
                                       style="width: 100%">
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
                    />
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
                            <el-select v-model="relationBusinessConfigId" placeholder="请选择业务类型" filterable
                                       style="width: 100%" @change="relationSelectChange">
                                <el-option
                                    v-for="item in businessConfigList"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="12">
                            <el-select v-model="relationExDataKey" placeholder="请选择关联表主键" filterable
                                       style="width: 100%">
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
                    />
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

        <el-dialog :title="'配置下拉数据源'" :visible.sync="showSelectOptionConfig" width="1024px" append-to-body
                   :close-on-press-escape="false" :close-on-click-modal="false" :fullscreen="isFullScreen">
            <el-row>
                <el-col :span="24">
                    <el-radio-group v-model="selectOptionRow.selectOptionType" size="mini" @input="selectOptionTypeChange">
                        <el-radio-button :label="1">静态数据</el-radio-button>
                        <el-radio-button :label="2">远程数据</el-radio-button>
                        <el-radio-button :label="3">关联数据源</el-radio-button>
                    </el-radio-group>
                    <el-divider/>
                </el-col>
                <el-col :span="24" v-if="selectOptionRow.selectOptionType === 1">
                    <el-switch
                        v-model="selectOptionRow.staticKeyType"
                        active-text="字符型Key"
                        inactive-text="数字型Key"
                        :active-value="2"
                        :inactive-value="1"
                        v-if="selectOptionRow.selectOptionType === 1"
                    >
                    </el-switch>
                </el-col>
            </el-row>
            <el-row v-if="selectOptionRow.selectOptionType === 1">
                <el-divider content-position="left">配置下拉选项</el-divider>
                <el-button type="text" @click="addRow">+ 增加行</el-button>
                <el-col :span="24">
                    <el-table
                        border
                        :data="selectOptionRow.staticOptions"
                        ooltip-effect="dark"
                    >
                        <el-table-column label="选项值" align="center">
                            <template scope="scope">
                                <el-input v-model="scope.row.key" placeholder="请输入Key"
                                          v-if="selectOptionRow.staticKeyType === 1"/>
                                <el-input-number v-model="scope.row.key" controls-position="right"
                                                 v-else-if="selectOptionRow.staticKeyType === 2"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="选项名称" align="center">
                            <template scope="scope">
                                <el-input v-model="scope.row.label" placeholder="请输入Label"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="默认属性" align="center">
                            <template scope="scope">
                                <el-switch v-model="scope.row.default"
                                           @change="changeOptionDefault(scope.row, scope.$index)"/>
                            </template>
                        </el-table-column>

                        <el-table-column prop="operation" label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" size="mini" @click="deleteRow(scope.$index, scope.row)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <el-row v-if="selectOptionRow.selectOptionType === 2">
                <el-divider content-position="left">配置远程数据源</el-divider>
                <el-form ref="dynamicOptionsForm" :model="selectOptionRow" label-width="400px">
                    <el-col :span="24">
                        <el-form-item label="远程数据源Url">
                            <el-input v-model="selectOptionRow.dynamicUrl" placeholder="请输入远程数据源URL"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="远程数据源Key名称">
                            <el-input v-model="selectOptionRow.dynamicKeyName" placeholder="请输入远程数据源Key名称"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="远程数据源Label名称">
                            <el-input v-model="selectOptionRow.dynamicLabelName"
                                      placeholder="请输入远程数据源Label名称"/>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <el-row v-if="selectOptionRow.selectOptionType === 3">
                <el-col :span="24">
                    <el-form ref="dynamicOptionsForm" :model="selectOptionRow" label-width="150px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="数据源">
                                <el-select v-model="selectOptionRow.bindDataSourceId" filterable placeholder="请选择" @change="bindDataSourceChange" style="width: 100%">
                                    <el-option
                                        v-for="item in dataSourceOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="数据对象">
                                <el-tree ref="pTree" :expand-on-click-node="false" :default-expanded-keys="selectOptionRow.selectTreeNode" :data="treeData" node-key='id'  :props="defaultProps" @node-click="handleNodeClick" default-expand-all :highlight-current="true" :current-node-key="selectOptionRow.selectTreeNode ? selectOptionRow.selectTreeNode[0] : null"></el-tree>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="数据源Key名称">
                                <el-select v-model="selectOptionRow.dataSourceKey" placeholder="数据源Key名称" style="width: 100%">
                                    <el-option :label="item.label" :value="item.id" v-for="item in parentDataRelationData"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="远程数据源Label名称">
                                <el-select v-model="selectOptionRow.dataSourceLabel" placeholder="远程数据源Label名称" style="width: 100%">
                                    <el-option :label="item.label" :value="item.id" v-for="item in parentDataRelationData"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitSelectOptionConfig">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="'配置下拉树数据源'" :visible.sync="showTreeSelectOptionConfig" width="1024px" append-to-body
                   :close-on-press-escape="false" :close-on-click-modal="false" :fullscreen="isFullScreen">
            <el-row>
                <el-col :span="24">
                    <el-form ref="dynamicOptionsForm" :model="selectOptionRow" label-width="150px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="数据源">
                                    <el-select v-model="selectOptionRow.bindDataSourceId" filterable placeholder="请选择" @change="bindDataSourceChange" style="width: 100%">
                                        <el-option
                                            v-for="item in dataSourceOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="数据对象">
                                    <el-tree ref="pTree" :expand-on-click-node="false" :default-expanded-keys="selectOptionRow.selectTreeNode" :data="treeData" node-key='id'  :props="defaultProps" @node-click="handleNodeClick" default-expand-all :highlight-current="true" :current-node-key="selectOptionRow.selectTreeNode ? selectOptionRow.selectTreeNode[0] : null"></el-tree>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="数据源Key名称">
                                    <el-select v-model="selectOptionRow.dataSourceKey" placeholder="数据源Key名称" style="width: 100%">
                                        <el-option :label="item.label" :value="item.id" v-for="item in parentDataRelationData"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="远程数据源Label名称">
                                    <el-select v-model="selectOptionRow.dataSourceLabel" placeholder="远程数据源Label名称" style="width: 100%">
                                        <el-option :label="item.label" :value="item.id" v-for="item in parentDataRelationData"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="父级节点名称">
                                    <el-select v-model="selectOptionRow.dataSourceParentKey" placeholder="父级节点名称" style="width: 100%">
                                        <el-option :label="item.label" :value="item.id" v-for="item in parentDataRelationData"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitTreeSelectOptionConfig">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="'配置聚合查询'" :visible.sync="showAggregateConfig" width="1024px" append-to-body
                   :close-on-press-escape="false" :close-on-click-modal="false" :fullscreen="isFullScreen"
                   v-if="showAggregateConfig">
            <el-divider content-position="center">已配置表明细</el-divider>
            <el-row>
                <el-col :span="24">
                    <el-scrollbar style="height: 400px;">
                        <el-table
                            border
                            :data="getAllTableInfoList"
                            ooltip-effect="dark"
                        >
                            <el-table-column label="表名" align="center" prop="id"/>
                            <el-table-column label="备注" align="center" prop="label"/>
                            <el-table-column label="类型" align="center" prop="type"/>
                            <el-table-column label="查询别名-表" align="center" prop="alias"/>
                            <el-table-column label="查询别名-扩展" align="center" prop="aliasEx"/>
                        </el-table>
                    </el-scrollbar>
                </el-col>
            </el-row>
            <el-divider content-position="center">聚合表明细</el-divider>
            <el-row>
                <el-col :span="24">
                    <el-button type="primary" size="mini" @click="addAggregateTable">添加聚合表</el-button>
                    <el-divider/>
                </el-col>
                <el-col :span="24">
                    <el-scrollbar style="height: 400px;">
                        <el-table
                            border
                            :data="aggregateConfig.tableList"
                            ooltip-effect="dark"
                        >
                            <el-table-column label="Join子句脚本" align="center" prop="script">
                                <template scope="scope">
                                    <el-input v-model="scope.row.script" placeholder="请输入Join子句脚本"/>
                                </template>
                            </el-table-column>
                            <el-table-column label="备注" align="center" prop="commit">
                                <template scope="scope">
                                    <el-input v-model="scope.row.commit" placeholder="请输入备注"/>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" prop="width" width="80">
                                <template slot-scope="scope">
                                    <el-link type="danger" @click="removeAggregateTable(scope.row, scope.$index)">删除
                                    </el-link>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-scrollbar>
                </el-col>
            </el-row>
            <el-divider content-position="center">聚合列明细</el-divider>
            <el-row>
                <el-col :span="24">
                    <el-button type="primary" size="mini" @click="addAggregateColumn">添加聚合列</el-button>
                    <el-divider/>
                </el-col>

                <el-col :span="24">
                    <el-scrollbar style="height: 400px;">
                        <el-table
                            border
                            :data="aggregateConfig.columnList"
                            ooltip-effect="dark"
                        >
                            <el-table-column label="聚合列脚本" align="center" prop="script">
                                <template scope="scope">
                                    <el-input v-model="scope.row.script" placeholder="请输入聚合列脚本"/>
                                </template>
                            </el-table-column>
                            <el-table-column label="别名" align="center" prop="id">
                                <template scope="scope">
                                    <el-input v-model="scope.row.id" placeholder="请输入别名"/>
                                </template>
                            </el-table-column>
                            <el-table-column label="属性label" align="center" prop="label">
                                <template scope="scope">
                                    <el-input v-model="scope.row.label" placeholder="请输入属性label"/>
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
                    <el-input type="textarea" v-model="aggregateConfig.groupScript"/>
                </el-form-item>
                <el-form-item label="Having 子句" label-width="150px">
                    <el-input type="textarea" v-model="aggregateConfig.havingScript"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitAggregateConfig">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="'预览Sql'" :visible.sync="showPreViewSql" width="1024px" append-to-body
                   :close-on-press-escape="false" :close-on-click-modal="false" :fullscreen="isFullScreen">
            <codemirror
                style="height:100%;"
                ref="myEditor"
                :value="preViewSqlStr"
                :options="codemirrorOptions"
            ></codemirror>
<!--            <span>{{ preViewSqlStr }}</span>-->
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="closePreView">确定</el-button>
                <el-button type="primary"
                           v-clipboard:copy="preViewSqlStr"
                           v-clipboard:success="firstCopySuccess"
                           v-clipboard:error="firstCopyError"
                >复制</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    getTableInfo,
    getColumnInfo,
    getBusinessConfig,
    getColumnInfoWithBusinessId,
    getExDataConfigOptions,
    saveTableListConfig,
    getTableListConfig,
    getTableInfoWithBusinessConfigId,
    getDataSourceAllList,
    getDataSourceTreeData,
    getDataSourceConfig,
} from "@/api/tableColumnConfig/api.js";
import Sortable from "sortablejs";
import NumberRange from "@/components/executionTemplate/tableColumnConfig/queryParam/NumberRange.vue";

import sqlFormatter from "sql-formatter";
import { codemirror } from "vue-codemirror-lite";
import VueClipBoard from 'vue-clipboard2'

export default {
    name: "tableColumnConfig",
    components: {
            Sortable,
        NumberRange,
        codemirror
    },
    props: {
        showTableColumnConfig: {
            type: Boolean,
            default: false,
        },
        businessConfigId: {
            type: Number,
            default: null,
        },
        runType:{
            type: Number,
            default: 1,
        }
    },
    data() {
        return {
            title: '列表配置',
            activeNames: ['1'],
            form: {
                subBusinessCode: '',
            },
            isFullScreen: true,
            mainColumnListInfo: [],
            mainTableInfo: null,
            tableListInfo: [],
            tableSearchName: null,
            columnSearchName: null,
            columnExSearchName: null,
            mainColumnSearchName: null,
            columnListInfo: [],
            businessConfigList: null,
            relationBusinessConfigId: null,
            exDataOptions: [],
            exDataKey: null,
            relationExDataOptions: [],
            relationKeyLeft: null,
            relationKeyRight: null,
            relationExDataKey: null,
            relationTableName: null,


            showMain: false,
            showRelation: false,
            showSelectOptionConfig: false,
            showTreeSelectOptionConfig: false,
            showAggregateConfig: false,
            aggregateConfig: {
                tableList: [],
                columnList: [],
                groupScript: null,
                havingScript: null,
            },
            finalTableConfig: {},
            configId: null,
            selectOptionRow: {
                selectOptionType: 1,
                staticKeyType: 1,
            },

            preViewSqlStr: '',
            showPreViewSql: false,

            userDataScope: 2,
            deptIdName: 'create_dept_id',
            userIdName: 'create_user_id',

            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                    }
                }]
            },

            pickerRangeOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            codemirrorOptions:{
                mode: 'text/sql',
                lineNumbers: true,
                lineWrapping: true
            },

            bindDataSourceId: null,
            dataSourceOptions: [],
            selectTreeNode: [],
            selectTreeLabel: null,
            defaultProps: {
                children: 'children',
                label: 'label',
                id: 'id',
            },
            parentDataRelationData:[],
            treeData: [],
            form: {
                id: null,
                templateId: null,
                name: '',
                dataSourceType: 1,
                relationshipType: 1,
                parentDataId: null,
                parentDataName: null,
                parentDataRelationKey: null,
                remark: null,
            },

        }
    },
    //计算属性 类似于data概念
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
                id: this.mainTableInfo.tableName,
                label: this.mainTableInfo.tableName + ' | (' + this.mainTableInfo.tableComment + ')',
                type: '主表',
                alias: 'main',
                aliasEx: 'mainEx',
            })
            if (this.finalTableConfig.relationConfig) {
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
            this.$refs.tree.filter(val);
        },
        columnSearchName(val) {
            this.$refs.columnTree.filter(val);
        },
        columnExSearchName(val) {
            this.$refs.exDataTree.filter(val);
        },
        mainColumnSearchName(val) {
            this.$refs.mainColumnTree.filter(val);
        }
    },
    //方法集合
    methods: {
        submitForm() {
            let saveData = {
                id: this.configId,
                businessConfigId: this.businessConfigId,
                listConfig: this.finalTableConfig,
            }
            saveTableListConfig(saveData).then(res => {
                this.$message.success(res.msg);
                this.$emit('closeTableColumnsConfig');
            })
        },
        cancel() {
            this.$emit('closeTableColumnsConfig');
        },
        handleCheckChange(data, checked, indeterminate) {
            this.relationTableName = data.id;
            this.relationBusinessConfigId = null;
            getColumnInfo(data.id).then(res => {
                if (res && res.data) {
                    this.$set(this, 'columnListInfo', res.data);
                }
            })
            getBusinessConfig(data.id).then(res => {
                if (res && res.data) {
                    this.$set(this, 'businessConfigList', res.data);
                }
            })
        },
        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        handleColumnCheckChange(data, checked, indeterminate) {
        },
        handleMainColumnCheckChange(data, checked, indeterminate) {
        },
        filterColumnNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        relationSelectChange(value) {
            getExDataConfigOptions(value).then(res => {
                if (res && res.data) {
                    this.$set(this, 'relationExDataOptions', res.data);
                }
            })
        },


        showMainForm() {
            this.showMain = true;
        },

        showRelationForm() {
            this.showRelation = true;
        },

        submitMain() {
            let mateColumns = this.$refs.mainColumnTree.getCheckedNodes();
            mateColumns.forEach(item => {
                this.$set(item, 'sourceType', 1);
                this.$set(item, 'mateType', 1);
                this.$set(item, 'sortNum', 100);
                this.$set(item, 'tableAlias', 'main');
                this.$set(item, 'aliasName', this.toCamel(item.id));
                if(!item.having){
                    this.$set(item, 'having', false);
                }
            });
            let dynamicColumns = this.$refs.exMainDataTree.getCheckedNodes();
            dynamicColumns.forEach(item => {
                this.$set(item, 'sourceType', 1);
                this.$set(item, 'mateType', 2);
                this.$set(item, 'sortNum', 100);
                this.$set(item, 'id', item.key);
                this.$set(item, 'aliasName', this.toCamel(item.key));
                this.$set(item, 'tableAlias', 'mainEx');
                if(!item.having){
                    this.$set(item, 'having', false);
                }
            });
            if (this.finalTableConfig && this.finalTableConfig.mateConfig) {
                if (mateColumns && mateColumns.length > 0) {
                    this.finalTableConfig.mateConfig.mateColumns.push(...mateColumns);
                }
                if (dynamicColumns && dynamicColumns.length > 0) {
                    this.finalTableConfig.mateConfig.dynamicColumns.push(...dynamicColumns);
                }
                if (this.businessConfigId) {
                    this.$set(this.finalTableConfig.mateConfig, 'businessConfigId', this.businessConfigId);
                }
                if (this.exDataKey) {
                    this.$set(this.finalTableConfig.mateConfig, 'exDataKey', this.exDataKey);
                }
                this.$set(this.finalTableConfig.mateConfig, 'userDataScope', this.userDataScope);
                this.$set(this.finalTableConfig.mateConfig, 'userIdName', this.userIdName);
                this.$set(this.finalTableConfig.mateConfig, 'deptIdName', this.deptIdName);
                this.$set(this.finalTableConfig.mateConfig, 'mainTableName', this.mainTableInfo.tableName);
            } else {
                this.$set(this.finalTableConfig, 'mateConfig', {
                    mateColumns: mateColumns,
                    dynamicColumns: dynamicColumns,
                    exDataKey: this.exDataKey,
                    businessConfigId: this.businessConfigId,
                    userDataScope: this.userDataScope,
                    deptIdName: this.deptIdName,
                    userIdName: this.userIdName,
                    mainTableName: this.mainTableInfo.tableName,
                });
            }

            if (this.finalTableConfig.mateConfig.mateColumns) {
                let hash = {};
                let result = this.finalTableConfig.mateConfig.mateColumns.reduce((preVal, curVal) => {
                    hash[curVal.id] ? "" : (hash[curVal.id] = true && preVal.push(curVal));
                    return preVal;
                }, []);
                this.$set(this.finalTableConfig.mateConfig, 'mateColumns', result);
            }

            if (this.finalTableConfig.mateConfig.dynamicColumns) {
                let hash = {};
                let result = this.finalTableConfig.mateConfig.dynamicColumns.reduce((preVal, curVal) => {
                    hash[curVal.id] ? "" : (hash[curVal.id] = true && preVal.push(curVal));
                    return preVal;
                }, []);
                this.$set(this.finalTableConfig.mateConfig, 'dynamicColumns', result);
            }
            if (!this.finalTableConfig.relationConfig) {
                this.finalTableConfig.relationConfig = new Array();
            }
            if (!this.finalTableConfig.aggregateConfig) {
                this.finalTableConfig.aggregateConfig = {
                    tableList: [],
                    columnList: [],
                }
            }
            this.processAllColumns();
            this.cancelMain();
        },
        submitRelation() {
            let mateColumns = this.$refs.columnTree.getCheckedNodes();
            mateColumns.forEach(item => {
                this.$set(item, 'sourceType', 2);
                this.$set(item, 'mateType', 1);
                this.$set(item, 'sortNum', 100);
                this.$set(item, 'aliasName', this.toCamel(item.id));
                if(!item.having){
                    this.$set(item, 'having', false);
                }
            });
            let dynamicColumns = this.$refs.exDataTree.getCheckedNodes();
            dynamicColumns.forEach(item => {
                this.$set(item, 'sourceType', 2);
                this.$set(item, 'mateType', 2);
                this.$set(item, 'sortNum', 100);
                this.$set(item, 'id', item.key);
                this.$set(item, 'aliasName', this.toCamel(item.key));
                if(!item.having){
                    this.$set(item, 'having', false);
                }
            });
            if (!this.finalTableConfig.relationConfig) {
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
            if ((mateColumns && mateColumns.length > 0) || (dynamicColumns && dynamicColumns.length > 0)) {
                this.finalTableConfig.relationConfig.push(relationConfig);
            }
            this.processAllColumns();
            this.cancelRelation();
        },
        cancelMain() {
            this.showMain = false;
        },
        cancelRelation() {
            this.showRelation = false;
        },
        processAllColumns() {
            let mainConfig;
            if (this.finalTableConfig.mateConfig) {
                let mainMateColumns = this.finalTableConfig.mateConfig.mateColumns;
                let dynamicColumns = this.finalTableConfig.mateConfig.dynamicColumns;
                mainMateColumns.forEach(item => {
                    this.$set(item, 'tableAlias', 'main');
                    if (!item.hasOwnProperty("having")) {
                        this.$set(item, 'having', false);
                    }
                })
                dynamicColumns.forEach(item => {
                    this.$set(item, 'tableAlias', 'mainEx');
                    if (!item.hasOwnProperty("having")) {
                        this.$set(item, 'having', false);
                    }
                })
                mainConfig = [...mainMateColumns, ...dynamicColumns];
            }
            if (this.finalTableConfig.relationConfig) {
                this.finalTableConfig.relationConfig.forEach((item, index) => {
                    let mainMateColumns = item.mateColumns;
                    let dynamicColumns = item.dynamicColumns;
                    mainMateColumns.forEach(subItem => {
                        this.$set(subItem, 'tableAlias', 'r' + index);
                        if (!subItem.hasOwnProperty("having")) {
                            this.$set(subItem, 'having', false);
                        }
                    })
                    dynamicColumns.forEach(subItem => {
                        this.$set(subItem, 'tableAlias', 'rEx' + index);
                        if (!subItem.hasOwnProperty("having")) {
                            this.$set(subItem, 'having', false);
                        }
                    })
                    mainConfig.push(...mainMateColumns);
                    mainConfig.push(...dynamicColumns);
                })
            }
            if (this.finalTableConfig.aggregateConfig && this.finalTableConfig.aggregateConfig.columnList && this.finalTableConfig.aggregateConfig.columnList.length > 0) {
                let columnList = this.finalTableConfig.aggregateConfig.columnList;
                mainConfig.push(...columnList);
            }
            let finalMainConfig = mainConfig;
            // let hash = {};
            // let finalMainConfig = mainConfig.reduce((preVal, curVal) => {
            //     hash[curVal.id] ? "" : (hash[curVal.id] = true && preVal.push(curVal));
            //     return preVal;
            // }, []);
            finalMainConfig.forEach(item => {
                if (!item.hasOwnProperty('sortNum')) {
                    this.$set(item, 'sortNum', 100);
                }
            })
            finalMainConfig = finalMainConfig.sort(function (a, b) {
                return a.sortNum - b.sortNum;
            });
            this.$set(this.finalTableConfig, 'allColumns', finalMainConfig);
            this.initSort();
        },
        removeTableColumn(row) {
            if (row.sourceType === 1) {
                if (row.mateType === 1) {
                    this.$set(this.finalTableConfig.mateConfig, 'mateColumns', this.finalTableConfig.mateConfig.mateColumns.filter(item => item.id !== row.id));
                } else if (row.mateType === 2) {
                    this.$set(this.finalTableConfig.mateConfig, 'dynamicColumns', this.finalTableConfig.mateConfig.dynamicColumns.filter(item => item.id !== row.id));
                }
            } else if (row.sourceType === 2) {
                if (row.mateType === 1) {
                    this.finalTableConfig.relationConfig.forEach(item => {
                        this.$set(item, 'mateColumns', item.mateColumns.filter(subItem => subItem.id !== row.id));
                    })
                } else {
                    this.finalTableConfig.relationConfig.forEach(item => {
                        this.$set(item, 'dynamicColumns', item.dynamicColumns.filter(subItem => subItem.id !== row.id));
                    })
                }
            } else {
                this.$set(this.finalTableConfig.aggregateConfig, 'columnList', this.finalTableConfig.aggregateConfig.columnList.filter(item => item.id !== row.id));
            }
            if (this.finalTableConfig.relationConfig) {
                this.finalTableConfig.relationConfig.forEach((item, index) => {
                    if (item.mateColumns.length === 0 && item.dynamicColumns.length === 0) {
                        this.finalTableConfig.relationConfig.splice(index, 1);
                    }
                })
            }
            this.processAllColumns();
        },
        //上移操作
        sortUp(index, row) {
            let temp = this.finalTableConfig.allColumns[index - 1];
            if (!temp) {
                return;
            }
            this.$set(row, 'sortNum', index - 1);
            this.$set(temp, 'sortNum', index);
            // this.$set(this.finalTableConfig.allColumns, index - 1, this.finalTableConfig.allColumns[index]);
            // this.$set(this.finalTableConfig.allColumns, index, temp)
            this.processAllColumns();
        },
        //下移操作
        sortDown(index, row) {
            let temp = this.finalTableConfig.allColumns[index + 1];
            if (!temp) {
                return;
            }
            this.$set(row, 'sortNum', index + 1);
            this.$set(temp, 'sortNum', index);
            // this.$set(this.finalTableConfig.allColumns, index + 1, this.finalTableConfig.allColumns[index]);
            // this.$set(this.finalTableConfig.allColumns, index, temp)
            this.processAllColumns();
        },


        initSort() {
            const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[1];
            if(!el){
                return;
            }
            console.log(' document.querySelectorAll(\'.el-table__body-wrapper > table > tbody\')',  document.querySelectorAll('.el-table__body-wrapper > table > tbody'));
            // const sortable = new Sortable(el, options);
            // 根据具体需求配置options配置项
            let that = this;
            const sortable = new Sortable(el, {

                handle: '.handle', // handle's class
                onEnd({newIndex, oldIndex}) {
                    const currRow = that.finalTableConfig.allColumns.splice(oldIndex, 1)[0]
                    that.finalTableConfig.allColumns.splice(newIndex, 0, currRow)
                    that.finalTableConfig.allColumns[newIndex]['sortNum'] = newIndex;
                    // evt.oldIndex 是当前拖动的行，evt.newIndex 是放置到的位置。
                    // 我们有了 evt.oldIndex 和 evt.newIndex 这两个参数做索引，我们可以根据绑定在表格上面的 data 这个 Array 找到两个相应的记录。就可以针对数据进行操作啦。
                }
            })
        },
        preview() {
            this.parentRouter.push('/micFoundation/previewDynamicList?businessConfigId=' + this.businessConfigId);
        },


        selectOptionConfig(row) {
            this.selectOptionRow = row;
            if (!this.selectOptionRow.hasOwnProperty('selectOptionType')) {
                this.$set(this.selectOptionRow, 'selectOptionType', 1);
                this.$set(this.selectOptionRow, 'staticOptions', []);
                this.$set(this.selectOptionRow, 'staticKeyType', 1);
            }
            this.showSelectOptionConfig = !this.showSelectOptionConfig;
            if(this.selectOptionRow.selectOptionType === 3){
                getDataSourceAllList().then(res => {
                    if(res && res.data){
                        let tempData = [];
                        res.data.forEach(item => {
                            tempData.push({
                                value: item.id,
                                label: item.name
                            })
                        })
                        this.$set(this, 'dataSourceOptions', tempData);
                        console.log(res.data);
                        if(this.selectOptionRow.bindDataSourceId){
                            getDataSourceTreeData(this.selectOptionRow.bindDataSourceId).then(res => {
                                if(res && res.data){
                                    this.$set(this, 'treeData', res.data);
                                }
                            })
                        }
                        if(this.selectOptionRow.selectTreeNode){
                            getDataSourceConfig(this.selectOptionRow.selectTreeNode).then(res => {
                                this.parentDataRelationData.splice(0);
                                this.$set(this, 'parentDataRelationData', res.data.dataSourceConfig.allColumns);
                            })
                        }
                    }
                })
            }
        },
        selectTreeOptionConfig(row) {
            this.selectOptionRow = row;
            if (!this.selectOptionRow.hasOwnProperty('selectOptionType')) {
                this.$set(this.selectOptionRow, 'selectOptionType', 3);
                this.$set(this.selectOptionRow, 'staticOptions', []);
                this.$set(this.selectOptionRow, 'staticKeyType', 1);
            }
            this.showTreeSelectOptionConfig = !this.showTreeSelectOptionConfig;
            getDataSourceAllList().then(res => {
                if(res && res.data){
                    let tempData = [];
                    res.data.forEach(item => {
                        tempData.push({
                            value: item.id,
                            label: item.name
                        })
                    })
                    this.$set(this, 'dataSourceOptions', tempData);
                    console.log(res.data);
                    if(this.selectOptionRow.bindDataSourceId){
                        getDataSourceTreeData(this.selectOptionRow.bindDataSourceId).then(res => {
                            if(res && res.data){
                                this.$set(this, 'treeData', res.data);
                            }
                        })
                    }
                    if(this.selectOptionRow.selectTreeNode){
                        getDataSourceConfig(this.selectOptionRow.selectTreeNode).then(res => {
                            this.parentDataRelationData.splice(0);
                            this.$set(this, 'parentDataRelationData', res.data.dataSourceConfig.allColumns);
                        })
                    }
                }
            })
        },
        submitSelectOptionConfig() {
            this.showSelectOptionConfig = !this.showSelectOptionConfig;
        },
        submitTreeSelectOptionConfig() {
            this.showTreeSelectOptionConfig = !this.showTreeSelectOptionConfig;
        },
        addRow() {
            let list = {
                key: null,
                label: null,
                default: false,
            }
            this.selectOptionRow.staticOptions.push(list);
        },
        // 删除行
        deleteRow(index, row) {
            this.selectOptionRow.staticOptions.splice(index, 1)
        },
        changeOptionDefault(row, index) {
            if (row.default) {
                this.selectOptionRow.staticOptions.forEach((item, optionIndex) => {
                    if (index !== optionIndex) {
                        item.default = false;
                    }
                })
            }
        },
        initSearchTypeValue(row) {
            this.$set(row, 'defaultQueryValue', null);
            this.$set(row, 'searchLogic', 0);
        },
        initSearchLogic(row) {
            if (row.searchLogic !== 7 && row.defaultQueryValue instanceof Array) {
                this.$set(row, 'defaultQueryValue', row.defaultQueryValue[0]);
            } else if (row.searchLogic === 7) {
                this.$set(row, 'defaultQueryValue', null);
            }
        },


        showAggregateForm() {
            this.showAggregateConfig = !this.showAggregateConfig;
        },
        submitAggregateConfig() {
            this.$set(this.finalTableConfig, 'aggregateConfig', this.aggregateConfig);
            this.showAggregateConfig = !this.showAggregateConfig;
            this.processAllColumns();
        },
        addAggregateTable() {
            this.aggregateConfig.tableList.push({
                script: '',
                commit: '',
            })
        },
        removeAggregateTable(row, index) {
            this.aggregateConfig.tableList.splice(index, 1);
        },
        addAggregateColumn() {
            this.aggregateConfig.columnList.push({
                script: '',
                sourceType: 3,
                mateType: 3,
                id: '',
                label: '',
                sortNum: 100,
            })
        },
        previewSql() {
            let sql = 'select ';
            if (this.finalTableConfig.mateConfig.mateColumns) {
                for (let index in this.finalTableConfig.mateConfig.mateColumns) {
                    let item = this.finalTableConfig.mateConfig.mateColumns[index];
                    sql += item.tableAlias + '.' + item.id + ' as ' + (!item.aliasName ? item.id : item.aliasName) + ', ';
                }
            }
            if (this.finalTableConfig.mateConfig.dynamicColumns) {
                for (let index in this.finalTableConfig.mateConfig.dynamicColumns) {
                    let item = this.finalTableConfig.mateConfig.dynamicColumns[index];
                    sql += 'JSON_UNQUOTE(mainEx.ex_form_data -> \'$.' + item.id + '\') as ' + (!item.aliasName ? item.id : item.aliasName) + ', ';
                }
            }
            if (this.finalTableConfig.relationConfig) {
                for (let index in this.finalTableConfig.relationConfig) {
                    let item = this.finalTableConfig.relationConfig[index];
                    if (item.mateColumns) {
                        for (let subIndex in item.mateColumns) {
                            let subItem = item.mateColumns[subIndex];
                            sql += subItem.tableAlias + '.' + subItem.id + ' as ' + (!subItem.aliasName ? subItem.id : subItem.aliasName) + ', ';
                        }
                    }
                    if (item.dynamicColumns) {
                        for (let subIndex in item.dynamicColumns) {
                            let subItem = item.dynamicColumns[subIndex];
                            sql += 'JSON_UNQUOTE(' + subItem.tableAlias + '.ex_form_data -> \'$.' + subItem.id + '\') as ' + (!subItem.aliasName ? subItem.id : subItem.aliasName) + ', ';
                        }
                    }
                }
            }
            if (this.finalTableConfig.aggregateConfig && this.finalTableConfig.aggregateConfig.columnList) {
                for (let index in this.finalTableConfig.aggregateConfig.columnList) {
                    let item = this.finalTableConfig.aggregateConfig.columnList[index];
                    sql += item.script + ' as ' + item.id + ', ';
                }
            }
            sql = sql.substr(0, sql.length - 2);
            sql += ' from ' + this.mainTableInfo.tableName + ' main';
            if (this.finalTableConfig.mateConfig.dynamicColumns && this.finalTableConfig.mateConfig.dynamicColumns.length > 0) {
                sql += ' left join env_ex_form_data as mainEx on mainEx.business_id = main.' + this.finalTableConfig.mateConfig.exDataKey + ' and mainEx.business_config_id = ' + this.finalTableConfig.mateConfig.businessConfigId;
            }
            if (this.finalTableConfig.relationConfig) {
                for (let index in this.finalTableConfig.relationConfig) {
                    let item = this.finalTableConfig.relationConfig[index];
                    sql += ' left join ' + item.relationTableName + ' r' + index + ' on main.' + item.relationKeyLeft + ' = r' + index + '.' + item.relationKeyRight
                }
            }
            if (this.finalTableConfig.aggregateConfig && this.finalTableConfig.aggregateConfig.tableList.length > 0) {
                for (let index in this.finalTableConfig.aggregateConfig.tableList) {
                    let item = this.finalTableConfig.aggregateConfig.tableList[index];
                    sql += ' ' + item.script + ' ';
                }
            }
            sql += ' where true ';
            if (this.finalTableConfig.mateConfig.mateColumns) {
                for (let index in this.finalTableConfig.mateConfig.mateColumns) {
                    let item = this.finalTableConfig.mateConfig.mateColumns[index];
                    if (item && item.search && !item.having) {
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
            if (this.finalTableConfig.mateConfig.dynamicColumns) {
                for (let index in this.finalTableConfig.mateConfig.dynamicColumns) {
                    let item = this.finalTableConfig.mateConfig.dynamicColumns[index];
                    if (item && item.search && !item.having) {
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
            if (this.finalTableConfig.relationConfig) {
                for (let index in this.finalTableConfig.relationConfig) {
                    let item = this.finalTableConfig.relationConfig[index];
                    if (item.mateColumns) {
                        for (let subIndex in item.mateColumns) {
                            let subItem = item.mateColumns[index];
                            if (subItem && subItem.search && !subItem.having) {
                                console.log(subItem);
                                switch (subItem.searchLogic) {
                                    case 0:
                                        sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' = ? ';
                                        break;
                                    case 1:
                                        sql += ' and ' + subItem.tableAlias + '.' + subItem.id + ' != ? ';
                                        break;
                                    case 2:
                                        console.log('search', subItem)
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
                    if (item.dynamicColumns) {
                        for (let subIndex in item.dynamicColumns) {
                            let subItem = item.dynamicColumns[subIndex];
                            if (subItem && subItem.search && !subItem.having) {
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
            if (this.finalTableConfig.aggregateConfig.groupScript) {
                sql += ' ' + this.finalTableConfig.aggregateConfig.groupScript;
                sql += ' having true';
                if (this.finalTableConfig.mateConfig.mateColumns) {
                    for (let index in this.finalTableConfig.mateConfig.mateColumns) {
                        let item = this.finalTableConfig.mateConfig.mateColumns[index];
                        if (item && item.search && item.having) {
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
                if (this.finalTableConfig.mateConfig.dynamicColumns) {
                    for (let index in this.finalTableConfig.mateConfig.dynamicColumns) {
                        let item = this.finalTableConfig.mateConfig.dynamicColumns[index];
                        if (item && item.search && item.having) {
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
                if (this.finalTableConfig.relationConfig) {
                    for (let index in this.finalTableConfig.relationConfig) {
                        let item = this.finalTableConfig.relationConfig[index];
                        if (item.mateColumns) {
                            for (let subIndex in item.mateColumns) {
                                let subItem = item.mateColumns[index];
                                if (subItem && subItem.search && subItem.having) {
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
                        if (item.dynamicColumns) {
                            for (let subIndex in item.dynamicColumns) {
                                let subItem = item.dynamicColumns[subIndex];
                                if (subItem && subItem.search && subItem.having) {
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

            if (this.finalTableConfig.allColumns.filter(item => item.sort).length > 0) {
                sql += ' order by ';
                for (let index in this.finalTableConfig.allColumns) {
                    let item = this.finalTableConfig.allColumns[index];
                    if (item.sort) {
                        sql += (item.aliasName ? item.aliasName : item.id) + ' DESC, '
                    }
                }
                sql = sql.substr(0, sql.length - 2);
            }
            sql += ' limit 10';
            this.showPreViewSql = true;
            this.preViewSqlStr = sql;
            this.beautifyCode();

        },
        closePreView() {
            this.showPreViewSql = false;
        },
        changeSort(value, index){
            console.log(value, index);
            if(!value){
                this.$set(this.finalTableConfig.allColumns[index], 'defaultSort', false);
            }
        },
        changeDefaultSort(value, index){
            if(value){
                this.finalTableConfig.allColumns.forEach((item, num) => {
                    if(index !== num){
                        this.$set(item, 'defaultSort', false);
                    }
                })
            }
            console.log(value, index);
        },
        beautifyCode() {
            console.log('sqlFormatter', sqlFormatter);
            this.preViewSqlStr = sqlFormatter.format(this.preViewSqlStr);
        },
        firstCopySuccess(){
            this.$message.success('复制成功')
        },
        firstCopyError(){
            this.$message.error('复制失败')
        },
        selectOptionTypeChange(val){
            console.log('selectOptionTypeChange', val);
            if(val === 3){
                getDataSourceAllList().then(res => {
                    if(res && res.data){
                        let tempData = [];
                        res.data.forEach(item => {
                            tempData.push({
                                value: item.id,
                                label: item.name
                            })
                        })
                        this.$set(this, 'dataSourceOptions', tempData);
                        console.log(res.data);
                    }
                })
            }
        },
        bindDataSourceChange(val){
            console.log(val);
            getDataSourceTreeData(val).then(res => {
                if(res && res.data){
                    this.$set(this, 'treeData', res.data);
                }
            })
        },
        handleNodeClick(data){
            console.log('handleNodeClick', data.id, data);
            this.selectOptionRow.selectTreeNode = [data.id];
            this.selectOptionRow.selectTreeLabel = data.label;
            getDataSourceConfig(data.id).then(res => {
                this.parentDataRelationData.splice(0);
                this.$set(this, 'parentDataRelationData', res.data.dataSourceConfig.allColumns);
            })
        },
        handleMainCheckChange(data){
            console.log('handleMainCheckChange', data);
            if(!this.mainTableInfo){
                this.mainTableInfo = {};
            }
            this.$set(this.mainTableInfo, 'tableName', data.id);
            this.relationTableName = data.id;
            this.relationBusinessConfigId = null;
            this.getMainColumnInfo(data.id);
            getBusinessConfig(data.id).then(res => {
                if (res && res.data) {
                    this.$set(this, 'businessConfigList', res.data);
                }
            })
        },
        getMainColumnInfo(id){
            getColumnInfo(id).then(res => {
                if (res && res.data) {
                    this.$set(this, 'mainColumnListInfo', res.data);
                }
            })
        },
        relationMainSelectChange(value){
            getExDataConfigOptions(value).then(res => {
                if (res && res.data) {
                    this.$set(this, 'exDataOptions', res.data);
                }
            })
        },
        toCamel(str) {
            return str.replace(/([^_])(?:_+([^_]))/g, function ($0, $1, $2) {
                return $1 + $2.toUpperCase();
            });
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        //businessConfigId
        getTableListConfig(this.businessConfigId).then(res => {
            if (res && res.data) {
                this.configId = res.data.id;
                this.finalTableConfig = res.data.listConfig;
                if (this.finalTableConfig.aggregateConfig) {
                    this.$set(this, 'aggregateConfig', this.finalTableConfig.aggregateConfig);
                }
                if(this.finalTableConfig.mateConfig){
                    this.$set(this, 'userDataScope', this.finalTableConfig.mateConfig.userDataScope);
                    if(this.finalTableConfig.mateConfig.deptIdName){
                        this.$set(this, 'deptIdName', this.finalTableConfig.mateConfig.deptIdName);
                    }
                    if(this.finalTableConfig.mateConfig.userIdName){
                        this.$set(this, 'userIdName', this.finalTableConfig.mateConfig.userIdName);
                    }
                    if(this.runType === 2 && this.finalTableConfig.mateConfig.mainTableName){
                        this.mainTableInfo = {};
                        this.$set(this.mainTableInfo, 'tableName', this.finalTableConfig.mateConfig.mainTableName);
                    }
                }
                this.processAllColumns();
            }
        })
        getTableInfo().then(res => {
            if (res && res.data) {
                this.$set(this, 'tableListInfo', res.data);
            }
        })
        if(this.runType !== 2){
            getColumnInfoWithBusinessId(this.businessConfigId).then(res => {
                if (res && res.data) {
                    this.$set(this, 'mainColumnListInfo', res.data);
                }

            })
            getExDataConfigOptions(this.businessConfigId).then(res => {
                if (res && res.data) {
                    this.$set(this, 'exDataOptions', res.data);
                }
            })
            getTableInfoWithBusinessConfigId(this.businessConfigId).then(res => {
                if (res && res.data) {
                    this.$set(this, 'mainTableInfo', res.data);
                }
            })
        }
    },
    //生命周期 - 创建之前
    beforeCreate() {
    },
    //生命周期 - 挂载之前
    beforeMount() {
    },
    //生命周期 - 更新之前
    beforeUpdate() {
    },
    //生命周期 - 更新之后
    updated() {
    },
    //生命周期 - 销毁之前
    beforeDestroy() {
    },
    //生命周期 - 销毁完成
    destroyed() {
    },
    //如果页面有keep-alive缓存功能，这个函数会触发
    activated() {
    }
};
</script>

<style scoped>
.down-tree {
    height: 300px;
    display: block;
    overflow-y: scroll;
}
</style>

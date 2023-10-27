<template>
    <div>
        <BoContainer ref="BoContainer" pageTitle="预览动态列表" :total="total" @changePage="changePage">
            <template slot="boMain">
                <BoMain>
                    <template slot="botabs">
                        <slot name="botabs"></slot>
                    </template>
                    <template slot="bosearch">
                        <queryParam :finalTableConfig="finalTableConfig" ref="query" @getList="getList" @reset="reset"/>
                    </template>
                    <template slot="bobutton">
                        <div class="toolarea">
                            <slot name="bobutton"></slot>
                            <tableListConfigToolBar v-if="canEdit" @showConfig="tableColumnsConfig"/>
                        </div>

                    </template>
                    <!-- 表格 -->
                    <template slot="tableArea">
                        <!--    列表-->
                        <el-table v-loading="loading" :data="dynamicList" @selection-change="handleSelectionChange"
                                  v-if="finalTableConfig && finalTableConfig.allColumns"
                                  stripe
                                  border
                                  ref="listTable"
                                  :height="mainTableHeight"
                                  :default-sort="defaultSort"
                                  @sort-change="sortChange">
                            <el-table-column type="selection" width="55" align="center"/>
                            <el-table-column label="序号" align="center" type="index" width="50"/>
                            <el-table-column v-for="item in finalTableConfig.allColumns" :label="item.label"
                                             :prop="!item.aliasName ? item.id : item.aliasName"
                                             :sortable="item.sort ? 'custom' : false" :width="item.width"
                                             :show-overflow-tooltip="true" v-if="!item.hidden">
                                <template scope="scope">
                                    <slot :name="'tableColumn.' + item.id" :slot-scopt="scope.row" v-if="!item.aliasName || item.aliasName === ''">
                                        {{ scope.row[item.id] }}
                                    </slot>
                                    <slot :name="'tableColumn.' + item.aliasName" :slot-scopt="scope.row">
                                        {{ scope.row[item.aliasName] }}
                                    </slot>
                                </template>
                            </el-table-column>
                            <el-table-column :label="'操作'" v-if="showAction" width="220">
                                <template scope="scope">
                                    <slot name="action" :slot-scopt="scope"/>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </BoMain>
            </template>
        </BoContainer>
        <tableColumnConfig v-if="showTableColumnConfig" @closeTableColumnsConfig="closeTableColumnsConfig"
                           :showTableColumnConfig="showTableColumnConfig" :businessConfigId="Number(businessConfigId)" :runType="runType"/>
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
    getBusinessConfigWithId,
    getDynamicListData,
} from "@/api/tableColumnConfig/api.js";

import queryParam from '@/components/executionTemplate/tableColumnConfig/queryParam/queryParam';
import tableListConfigToolBar from '@/components/RightToolbar/tableListConfigToolBar'
import tableColumnConfig from '@/components/executionTemplate/tableColumnConfig/index';

export default {
    name: "listContainer",
    components: {
        queryParam,
        tableListConfigToolBar,
        tableColumnConfig,
    },
    props: {
        businessConfigId: {
            type: String,
            default: null,
        },
        showAction: {
            type: Boolean,
            default: true
        },
        //  外部传入 根据不同页面 不同业务 不同角色权限
        canEdit:{
            type: Boolean,
            default: true
        },
        runType:{
            type: Number,
            default: 1,
        }
    },
    data() {
        return {
            finalTableConfig: null,
            total: 0,
            loading: false,
            dynamicList: null,
            pageTitle: null,
            orderCondition: [],
            selection: null,
            showTableColumnConfig: false,
            defaultSort: null,
          queryData: null,
        }
    },
    //计算属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
        businessConfigId() {
            this.orderCondition.splice(0);
            getTableListConfig(this.businessConfigId).then(res => {
                if (res && res.data) {
                    this.configId = res.data.id;
                    this.finalTableConfig = res.data.listConfig;
                    let defaultSortList = this.finalTableConfig.allColumns.filter(item => item.sort && item.defaultSort);
                    defaultSortList.sort((a,b)=>{ return a.defaultSortNum - b.defaultSortNum});
                        console.log('defaultSortList', defaultSortList);
                    defaultSortList.forEach(item => {
                        if(item.defaultSort){
                            let order = {
                                // key: item.tableAlias ? item.tableAlias + '.' + item.id : item.id,
                                key: item.aliasName ? item.aliasName : item.id,
                                orderType: item.sortType === 0 ? 2 : 1
                            }
                            this.orderCondition.push(order);
                            // this.$set(this, 'defaultSort', {
                            //     prop: item.id,
                            //     order: item.sortType === 0 ? 'descending' : 'ascending'
                            // })
                            // this.$refs.listTable.sort(order.key, order.orderType);
                        }
                    })
                }
                // this.getList();
            })
            if(this.runType !== 2){
                getBusinessConfigWithId(this.businessConfigId).then(res => {
                    if (res && res.data) {
                        this.pageTitle = res.data.configName;
                    }
                })
            }
        }
    },
    //方法集合
    methods: {
        // aa(){
        //     this.orderCondition.splice(0);
        //     getTableListConfig(this.businessConfigId).then(res => {
        //         if (res && res.data) {
        //             this.configId = res.data.id;
        //             this.finalTableConfig = res.data.listConfig;
        //             this.finalTableConfig.allColumns.filter(item => item.sort).forEach(item => {
        //                 let order = {
        //                     key: item.tableAlias ? item.tableAlias + '.' + item.id : item.id,
        //                     orderType: item.order === 'ascending' ? 1 : 2
        //                 }
        //                 this.orderCondition.push(order);
        //             })
        //         }
        //         // this.getList();
        //     })
        //     getBusinessConfigWithId(this.businessConfigId).then(res => {
        //         if (res && res.data) {
        //             this.pageTitle = res.data.configName;
        //         }
        //     })
        // },
        /**
        * @author Coder
        * @date 2023/5/4
        * @des 为纳通检测适配同路由不同菜单打开
         * 被动调用
        */
        getIndexTable(){
            getTableListConfig(this.businessConfigId).then(res => {
                if (res && res.data) {
                    this.configId = res.data.id;
                    this.finalTableConfig = res.data.listConfig;
                    this.finalTableConfig.allColumns.filter(item => item.sort).forEach(item => {
                        if(item.defaultSort){
                            let order = {
                                // key: item.tableAlias ? item.tableAlias + '.' + item.id : item.id,
                                key: item.aliasName ? item.aliasName : item.id,
                                orderType: item.sortType === 0 ? 2 : 1
                            }
                            this.orderCondition.push(order);
                            // this.$set(this, 'defaultSort', {
                            //     key: item.aliasName ? item.aliasName : item.id,
                            //     order: item.sortType === 0 ? 'descending' : 'ascending'
                            // })
                            // this.$refs.listTable.sort(order.key, order.orderType);
                        }
                    })
                }
            })
        },
        reset() {
            this.$refs.BoContainer.resetPage()
        },
        getList(queryParams) {
            let queryData = {
                queryParams: queryParams,
                pageNum: 1,
                pageSize: 10,
                orderConditionList: this.orderCondition,
                runType: this.runType,
            }
            if (!queryParams) {
                queryData.queryParams = this.$refs.query.getListQueryParams()
            }
            this.queryData = queryData
            getDynamicListData(this.businessConfigId, queryData).then(res => {
                if (res && res.data && res.data.list) {
                    this.dynamicList = res.data.list;
                    this.total = res.data.total;
                }
            })
        },
        changePage(e) {
            let queryData = {
                queryParams: this.$refs.query.getListQueryParams(),
                pageNum: e.page,
                pageSize: e.limit,
                orderConditionList: this.orderCondition,
                runType: this.runType,
            }
            getDynamicListData(this.businessConfigId, queryData).then(res => {
                if (res && res.data && res.data.list) {
                    this.dynamicList = res.data.list;
                    this.total = res.data.total;
                }
            })
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.selection = selection;
            this.$emit('handleSelectionChange', selection);
        },
        getSelection() {
            return this.selection;
        },
        sortChange(v1, v2) {
            console.log('sortChange', v1, v2);
            console.log('sortChange', v1, this.finalTableConfig.allColumns);
            let keyName = v1.prop;
            let mateColumnConfig = this.finalTableConfig.allColumns.filter(item => item.id === v1.prop);
            console.log('mateColumnConfig', mateColumnConfig, this.finalTableConfig);
            if (mateColumnConfig.length > 0) {
                // keyName = mateColumnConfig[0].tableAlias ? mateColumnConfig[0].tableAlias + '.' + mateColumnConfig[0].id : mateColumnConfig[0].id;
                keyName = mateColumnConfig[0].id;
            }
            if (v1.order != null) {
                let order = {
                    key: keyName,
                    orderType: v1.order === 'ascending' ? 1 : 2
                }
                console.log('sortChange', order);
                let temp = this.orderCondition.filter(item => item.key === keyName);
                console.log('sortChange', temp, this.orderCondition, this.orderCondition.filter(item => item.key !== keyName));
                if (temp.length === 0) {
                    this.orderCondition.push(order);
                } else {
                    this.orderCondition = this.orderCondition.filter(item => item.key !== keyName);
                    this.orderCondition.push(order);
                }
            } else {
                this.orderCondition = this.orderCondition.filter(item => item.key !== keyName);
            }
            this.getList();
        },
        showConfig() {

        },
        tableColumnsConfig() {
            this.showTableColumnConfig = true;
        },
        closeTableColumnsConfig() {
            this.showTableColumnConfig = false;
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        // this.aa()
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

<style scoped lang="scss">
.toolarea {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
/deep/.el-button+.el-button, .el-checkbox.is-bordered+.el-checkbox.is-bordered{
    margin-left: 0 !important;
    margin-right: 10px !important;
}
/deep/.el-button--text{
    margin-right: 10px !important;
}
</style>

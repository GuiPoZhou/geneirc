<template>
    <BoDialog :dia-log-title="Lang[lang]['addInstrument']" dia-log-width="70%" :dia-log-show="showLog" @close="e_close">
        <template slot="bologbody">
            <el-divider>{{ Lang[lang]['selInstrumentNumber'] }} {{selInsList.length}}</el-divider>
            <el-table
                :data="selInsList"
                stripe
                style="width: 100%;margin: 8px 0"
                border
            >
                <el-table-column
                    prop="date"
                    :label="Lang[lang]['instrumentType']"
                />
                <el-table-column
                    prop="date"
                    :label="Lang[lang]['instrumentNo']"
                />
                <el-table-column
                    prop="date"
                    :label="Lang[lang]['instrumentName']"
                />
                 <el-table-column
                    prop="date"
                    :label="Lang[lang]['instrumentModel']"
                />
                 <el-table-column
                    prop="date"
                    :label="Lang[lang]['operate']"
                />
            </el-table>
            <el-form :model="queryParams"
                     ref="queryFroms"
                     :inline="true"
                     class="searchform"
                     :label-position="lang=='chinese'?'left':'top'"
            >
                <el-row>
                    <el-col :span="8">
                        <el-form-item
                            :label="Lang[lang]['instrumentName']"
                            prop="factoryArea"

                        >
                            <el-input v-model="queryParams.factoryArea" clearable/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item
                            :label="Lang[lang]['instrumentNo']"
                            prop="factoryArea"

                        >
                            <el-input v-model="queryParams.factoryArea" clearable/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item
                            :label="Lang[lang]['instrumentModel']"
                            prop="factoryArea"

                        >
                            <el-input v-model="queryParams.factoryArea" clearable/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item
                            :label="Lang[lang]['instrumentType']"
                            prop="factoryArea"
                        >
                            <el-input v-model="queryParams.factoryArea" clearable/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-table
                :data="list"
                stripe
                style="width: 100%;margin: 8px 0"
                border
            >
                <el-table-column
                    prop="date"
                    :label="Lang[lang]['instrumentType']"
                />
                <el-table-column
                    prop="date"
                    :label="Lang[lang]['instrumentNo']"
                />
                <el-table-column
                    prop="date"
                    :label="Lang[lang]['instrumentName']"
                />
                <el-table-column
                    prop="date"
                    :label="Lang[lang]['instrumentModel']"
                />

            </el-table>
            <pagination
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="e_changePag"
            />
        </template>
        <template slot="bologfooter">
            <el-button type="primary" size="small">{{ Lang[lang]['saveBtn'] }}</el-button>
            <el-button size="small" @click="e_close">{{ Lang[lang]['closeBtn'] }}</el-button>
        </template>
    </BoDialog>
</template>
<script>
import Lang from './Lang'
import BoContainerMixin from '@/mixins/boContainer'

export default {
    mixins: [BoContainerMixin],
    data() {
        return {
            Lang,
            showLog: false,
            selInsList: [],//已选择仪器数量
            queryParams:{
                pageNum:1,
                pageSize:10,
            },
            list:[],
            total:0
        }
    },

    methods: {
        init() {
            this.showLog = true
        },
        e_close() {
            this.showLog = false
            this.$emit('cancel')
        },
        e_changePag(){

        }
    }

}
</script>

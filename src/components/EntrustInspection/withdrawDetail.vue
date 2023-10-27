<template>
    <BoDialog :diaLogShow="diaLogShow" :diaLogTitle="Lang[lang]['WithdrawalDetails']" diaLogWidth="30%"
              @close="e_close">
        <template slot="bologbody">
            <el-form :inline="true" :model="queryParams" label-position="top">
                <el-form-item
                    :label="Lang[lang]['withdrawalReason']"
                    prop="withdrawalReason"
                >
                    <el-select v-model="queryParams.withdrawalReason" disabled
                               :placeholder="Lang[lang]['PleaseSelect']">
                        <el-option v-for="(item,index) in withdrawalReasonList" :label="item.label" :key="index"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="Lang[lang]['remarks']"
                    prop="withdrawalRemark"
                >
                    <el-input v-model="queryParams.withdrawalRemark"
                              type="textarea"
                              disabled
                              style="border: 1px solid #DCDFE6"
                              :placeholder="Lang[lang]['PleaseEnter']"
                              oninput="if(value.length>200)value=value.slice(0,200)"
                              clearable/>
                </el-form-item>
                <!--                审批人-->
                <el-form-item
                    :label="Lang[lang]['Approver']"
                    prop="approvedBy"
                >
                    <el-input v-model="queryParams.approvedBy" disabled
                              :placeholder="Lang[lang]['PleaseEnter']"
                              clearable/>
                </el-form-item>
                <!--                审批时间-->
                <el-form-item
                    :label="Lang[lang]['ApprovalTime']"
                    prop="approvedTime"
                >
                    <el-date-picker
                        v-model="queryParams.approvedTime"
                        type="datetime"
                        value="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :placeholder="Lang[lang]['SelectDate']"
                        disabled
                    >
                    </el-date-picker>
                </el-form-item>
                <!--                审批意见-->
                <el-form-item
                    :label="Lang[lang]['ApprovalOpinions']"
                    prop="approvedOpinion"
                >
                    <el-input v-model="queryParams.approvedOpinion"
                              type="textarea"
                              style="border: 1px solid #DCDFE6"
                              :placeholder="Lang[lang]['PleaseEnter']"
                              oninput="if(value.length>200)value=value.slice(0,200)"
                              clearable
                              disabled
                    />
                </el-form-item>
            </el-form>
        </template>
        <template slot="bologfooter">
            <el-button size="small" @click="e_close">{{Lang[lang]['cancel']}}</el-button>
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
                queryParams: {},
                diaLogShow: false,
                date: '',
                withdrawalReasonList: this.getDictionary('withdrawalReason')
            }
        },
        methods: {
            init(data) {
                this.queryParams = data
                this.diaLogShow = true
            },
            e_close() {
                this.diaLogShow = false
                this.$emit('cancel')
            }
        }
    }
</script>

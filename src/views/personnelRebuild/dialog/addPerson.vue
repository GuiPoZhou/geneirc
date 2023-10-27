<template>
    <div>
        <BoDialog :diaLogShow="showKevinLog" :fullScreen="fullScreen" :diaLogTitle="dialogTitle" @close="e_close">
            <template slot="bologbody">
                <el-form :model="form" ref="form" label-width="100px" :form="form" class="demo-ruleForm"
                    :label-position="KevinJson.KevinWidget.formlabelPosition || 'top'">
                    <el-row v-if="!nullKevinJson">
                        <KevinRender ref="KevinRender" :context="context" :Widget="renderWidget" :form="form" />
                    </el-row>
                    <el-empty v-else :description="`请配置【${widgetId}】低码唯一键`"></el-empty>
                </el-form>
            </template>
            <template slot="bologfooter">
                <el-button :type="buttonInfo.type" :size="buttonInfo.size"
                    v-for="(buttonInfo, buttonIndex) in dialogFooterButtons" :key="buttonIndex"
                    :loading="buttonInfo.isLoading" @click="e_dialogButtonEvents(buttonInfo)">
                    {{ buttonInfo.title }}
                </el-button>
            </template>
        </BoDialog>
      <selectDept :visible.sync="deptShow" @backfill="backFillDept"/>
      <selectPost :visible.sync="postShow" @backfill="backFillPost"/>
      <selectUser :visible.sync="userShow" @backfill="backFillUser"/>
<!--      添加证书-->
      <addCertificate
        v-if="showCertificate"
        ref="refCertificate"
        @saveCertificate="reloadCertificate"
        @close="showCertificate = false"
      />
<!--      其他额外动态表单-->
      <addDialog
        v-if="addSub"
        ref="refSub"
        @reload="reloadSub"
        @close="addSub = false"
      />
    </div>
</template>

<script>
import selectUser from "../../PersonnelManagement/selectUser.vue";
import selectDept from '@/components/common/selectDept'
import selectPost from '@/components/common/selectMultiplePost'
import addCertificate from "./addCertificate.vue";
import addDialog from './addDialog.vue'
import moment from 'moment'
export default {
  components: {
    selectUser,
    selectDept,
    selectPost,
    addCertificate,
    addDialog,
  },
    data() {
        return {
          addSub: false,
            showKevinLog: false,
            fullScreen: false,
            dialogTitle: '',
            renderWidget: [],
            dialogFooterButtons: [],
            KevinJson: {
                KevinWidget: {}
            },
            nullKevinJson: false,
            context: this,
            form: {
                extData: {}
            },
            runKevinRender: false,
            widgetId: 'personal_form', // 记得对应好低码唯一键
            businessEnv: 'add', //add 新增  edit 编辑   detail 详情
            container: null,
          selection:[],
          deptShow: false,
          postShow: false,
          userShow: false,
          showCertificate: false,
        }
    },
    methods: {
        init(productionTypeId) {
            this.form.productionTypeId = productionTypeId
            this.showKevinLog = true
            this.e_getWidgetInfo()
        },
        async editInit(data, businessEnv = 'edit') {
            this.businessEnv = businessEnv
            this.showKevinLog = true
            await this.e_getWidgetInfo()
            new Function('ctx', '_this', 'mainTableRowData', this.KevinJson.KevinWidget.manuallyEvents.editProductinfo)(this.context, this.$refs.KevinRender, data)
        },
        async e_getWidgetInfo() {
            let re = await this.$net('/formLayout/v2/getFormLayoutConfig', 'get', { id: this.widgetId })
            try{
                let formDataStr = re.data.configStr
            let resultDataStr = formDataStr.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            let info = JSON.parse(resultDataStr)
            let KevinJson = info.KevinJson
            this.KevinJson = KevinJson
            this.showKevinLog = true
            this.dialogTitle = KevinJson.KevinWidget.title
            this.renderWidget = KevinJson.KevinWidget.children
            KevinJson.KevinWidget.diaLogFooterButton.forEach(dfb => {
                if (!dfb.statusEvents || new Function('ctx', '_this', dfb.statusEvents)(this, this.$refs.KevinRender)) {
                    this.dialogFooterButtons.push(dfb)
                }
            })
            this.fullScreen = true
            this.$nextTick(() => {
                this.runWidgetAutoEvents(KevinJson.KevinWidget.autoEvents)
                this.$refs.KevinRender.getWidgetServerData(this.renderWidget)
                this.container = this.$refs.KevinRender
            })
            }catch{
                this.nullKevinJson = true
            }

        },
        // 弹框底部动态按钮事件执行
        e_dialogButtonEvents(widgetInfo) {
            new Function('ctx', '_this', 'widgetInfo', widgetInfo.events)(this, this.$refs.KevinRender, widgetInfo)
            this.$forceUpdate()
        },
        // 执行动态表单自动执行脚本
        runWidgetAutoEvents(autoEvents) {
            if (autoEvents) {
                for (let key in autoEvents) {
                    new Function('ctx', '_this', autoEvents[key])(this, this.$refs.KevinRender)
                }
            }
            this.form = { ...this.form }
        },
      //填充检测单位
      backFillDept(dept) {
        this.form.departmentId = dept.deptId
        this.$set(this.form, 'departmentName', dept.deptName)
      },
      backFillPost(resultPosts) {
        let tempIds = ''
        let tempNames = ''
        resultPosts.forEach((item) => {
          tempIds += item.postId + ','
          tempNames += item.postName + ','
        })
        this.form.positionId = tempIds
        this.form.positionName = tempNames
      },
      //回填选中的用户
      backFillUser(resultUsers) {
        let tempIds = ''
        let tempNames = ''
        resultUsers.forEach((item) => {
          tempIds += item.userId
          tempNames += item.userName
        })
        this.form.userId = tempIds
        this.form.userName = tempNames
      },
      reloadSub() {

      },
      // 回填证书
      reloadCertificate(form) {
          console.log('form',form)
          this.showCertificate = false
        new Function('ctx', '_this', 'certificate','moment', this.KevinJson.KevinWidget.manuallyEvents.saveCertificate)(this, this.$refs.KevinRender, form,moment)
      },
        e_close() {
            this.$emit('close')
        }
    }
}
</script>

<style></style>

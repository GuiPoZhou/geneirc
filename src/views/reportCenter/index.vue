<template>
    <div class='qualityManual-container'>
        <div v-if='show' class='qualityManual-container-office'>
            <vab-only-office :option='option' />
        </div>
    </div>
</template>
<script>
import vabOnlyOffice from '@/components/VabOnlyOffice';


import {
  getReportCenter
} from "@/api/reportCenter/index";
import {logout} from "@/api/login";

export default {
    components: {
        vabOnlyOffice
    },
    data() {
        return {
            reportCenterBaseUrl: window.globalEnv.VUE_APP_BASE_API,
            option: {
                url: '',
                isEdit: true,
                fileType: '',
                title: '',
                lang: 'zh-CN',
                isPrint: true,
                user: {
                    name: ''
                },
                editUrl: '',
                token:'sangelxiu1',
            },
            show: false,
        }
    },
    created(){
        /**
        * @author Coder
        * @date 2023/2/8
        * @des 打印地址栏参数
        */
        console.log('参数',this.$route.query)
        this.loadOnlyOffice(this.$route.query)
    },
    methods:{
        getNetworkIp() {
            let needHost = ''; // 打开的host
            try {
                // 获得网络接口列表
                let network = os.networkInterfaces();
                for (let dev in network) {
                    let iface = network[dev];
                    for (let i = 0; i < iface.length; i++) {
                        let alias = iface[i];
                        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                            needHost = alias.address;
                        }
                    }
                }
            } catch (e) {
                needHost = 'localhost';
            }
            return needHost;
        },
        loadOnlyOffice(val){
          let url = this.reportCenterBaseUrl + "/reportCenter/getReportConfig";
          let param = {
            businessId: val.id,
            type: 1,
            templateName: val.templateName,
            templateType: val.templateType,
            templateId: val.templateId,
              token: val.token,
          }
          getReportCenter(url, param).then(res => {
            console.log('param', val, this.$store.state);
            this.option.name = val.templateName + '.docx';
            this.option.title = val.templateName + '.docx';
            this.option.url = this.reportCenterBaseUrl + '/reportCenter/getTemplateFile?id=' + val.id + '&businessId=' + val.id + '&type=1&templateName=' + val.templateName + '&templateType=' + val.templateType + '&templateId=' + val.templateId;
            this.option.fileType = 'doc';
            this.option.editUrl = this.reportCenterBaseUrl + '/reportCenter/webOffice/callBack?baseUrl=' + encodeURIComponent(this.reportCenterBaseUrl) + '&id=' + val.id + '&businessId=' + val.id + '&type=1&token=' + val.token;
            this.option.user = {
              name: this.$store.state.user.name
            }
            console.log(this.option)
            this.show = true
          })
        }
    }
}
</script>
<style>
  .qualityManual-container {
    padding: 0 !important;
    height: 100%;
  }

  .qualityManual-container-office {
    width: 100%;
    height: calc(100vh - 84px);
    /*height: calc(100% - 55px);*/
  }
</style>

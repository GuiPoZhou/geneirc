<template>
    <div class="bo-container projectInfo"
        :style="{ height: innerHeight + 'px', backgroundColor: '#fff' }">
        <el-form ref="form" :model="form" label-width="130px" label-position="top">
            <el-divider content-position="left">系统基础参数设置</el-divider>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="登录页名称" prop="projectName">
                        <el-input v-model="form.projectName" :style="{ '--inputColor': form.nameColor }"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="登录页标题颜色" prop="extData.nameColor">
                        <el-color-picker v-model="form.extData.nameColor"></el-color-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="系统标题" prop="title">
                        <el-input v-model="form.title"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="登录页风格" prop="extData.themeTypeName">
                        <el-select v-model="form.extData.themeTypeName" @change="e_selTheme">
                            <el-option label="风格1" value="envKevin"></el-option>
                            <el-option label="风格2" value="envPoint"></el-option>
                            <el-option label="风格3" value="envDakaStyle"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="系统ico" prop="extData.icoName">
                        <el-input v-model="form.extData.icoName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="系统logo" prop="extData.logo">
                        <div class="logoarea">
                            <el-button type="primary" size="mini" style="margin-top: 5px" @click="e_up">上传</el-button>
                            <el-image class="elImage" :preview-src-list="[form.extData.logo]" v-if="form.extData.logo"
                                :src="form.extData.logo"></el-image>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="登录页产品Logo" prop="extData.projectLogo">
                        <div class="logoarea">
                            <el-button type="primary" size="mini" style="margin-top: 5px"
                                @click="e_upProjectLogo('projectLogo')">上传</el-button>
                            <el-image class="elImage" :preview-src-list="[form.extData.projectLogo]"
                                v-if="form.extData.projectLogo" :src="form.extData.projectLogo"></el-image>
                        </div>
                    </el-form-item>
                </el-col>
              <el-col :span="12">
                <el-form-item label="底部产品Logo" prop="extData.bottomProjectLogo">
                  <div class="logoarea">
                    <el-button type="primary" size="mini" style="margin-top: 5px"
                               @click="e_upProjectLogo('bottomProjectLogo')">上传</el-button>
                    <el-image class="elImage" :preview-src-list="[form.extData.bottomProjectLogo]"
                              v-if="form.extData.bottomProjectLogo" :src="form.extData.bottomProjectLogo"></el-image>
                  </div>
                </el-form-item>
              </el-col>
                <el-divider content-position="left">系统业务参数设置</el-divider>

                <el-col :span="12">
                    <el-form-item label="OnlyOffice服务配置" prop="extData.onlineOfficeServer">
                        <el-input v-model="form.extData.onlineOfficeServer" placeholder="http://****:****"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="是否接收站内消息" prop="extData.systemMessage">
                        <el-switch v-model="form.extData.systemMessage" :active-value="true" :inactive-value="false"
                            active-text="接收" inactive-text="关闭" active-color="#13ce66" inactive-color="#ff4949">
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="是否开启大屏入口" prop="extData.dataScreen">
                        <el-switch v-model="form.extData.dataScreen" :active-value="true" :inactive-value="false"
                            active-text="开启" inactive-text="关闭" active-color="#13ce66" inactive-color="#ff4949">
                        </el-switch>
                    </el-form-item>
                </el-col>

                <el-col :span="24" style="margin-top: 6rem;">
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">更新</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <uploadFile ref="uploadFile" v-if="showuploadFile" @close="showuploadFile = false" @save="e_save" />
        <!-- 上传登录页产品logo -->
        <uploadLoginProjectLogo ref="uploadLoginProjectLogo" v-if="showuploadLoginProjectLogo"
            @close="showuploadLoginProjectLogo = false" @save="e_saveuploadLoginProjectLogo" />
    </div>
</template>
<script>
import uploadFile from './uploadLogo.vue'
import uploadLoginProjectLogo from './uploadLoginProjectLogo.vue'
export default {
    components: {
        uploadFile,
        uploadLoginProjectLogo
    },
    data() {
        return {
            showuploadFile: false,
            showuploadLoginProjectLogo: false,
          selectIndex: '',
            form: {
                projectName: 'LIMS管理系统',
                logoPath: 'aaa',
                title: '',
                extData: {
                    icoName: 'default',
                    onlineOfficeServer: "http://192.168.36.59:9980",
                    nameColor: '#000000',
                    logo: '',
                    themeTypeName: 'envKevin',
                    systemMessage: true,
                    projectLogo: '',
                  bottomProjectLogo: '',
                }
            },
            innerHeight:0,
        }
    },
    created() {
        this.getSystemInfo()
        this.getInnerHeight()
        document.addEventListener('resize',this.getInnerHeight)
    },
    methods: {
        getInnerHeight(){
            this.innerHeight = window.innerHeight-50
        },
        e_saveuploadLoginProjectLogo(base64) {
            this.showuploadLoginProjectLogo = false
            this.form.extData[this.selectIndex] = base64
        },
        e_upProjectLogo(e) {
          this.selectIndex = e
            this.showuploadLoginProjectLogo = true
            this.$nextTick(() => {
                this.$refs.uploadLoginProjectLogo.init()
            })
        },
        e_selTheme() {
            this.form = { ...this.form }
        },
        e_save(base64) {
            this.showuploadFile = false
            this.form.extData.logo = base64
        },
        e_up() {
            this.showuploadFile = true
            this.$nextTick(() => {
                this.$refs.uploadFile.init()
            })
        },
        getSystemInfo() {
            this.$net('/v1/theme/queryProjectInfo', 'get').then(re => {
                if (re.code == 200 && re.data) {
                    if (re.data.extData.systemMessage == undefined) {
                        re.data.extData.systemMessage = true
                    }
                    this.form = re.data
                    if (!this.form.extData.themeTypeName) {
                        this.form.extData.themeTypeName = 'envKevin'
                    }
                    if (!this.form.extData.projectLogo) {
                        this.form.extData.projectLogo = ''
                    }

                }
            })
        },
        onSubmit() {
            const loading = this.$loading({
                lock: true,
                text: '更新中',
                spinner: 'el-icon-loading',
                background: 'rgba(255, 255, 255, 0.5)'
            });
            this.$net('/v1/theme/saveProjectInfo', 'put', this.form).then(re => {
                loading.close()
                if (re.code == 200) {
                    this.$message.success('更新成功')
                    this.$mainStore.commit('set_systemInfo', this.form)
                }
            })
        },
    }
}
</script>
<style lang="scss" scoped>
.projectInfo {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    overflow: auto;

    /deep/.el-divider__text {
        font-size: 1rem;
        color: #000;
        font-weight: bold;
    }

    /deep/.el-form-item {
        width: 95%;
    }
}

/deep/ .el-input__inner {
    color: var(--inputColor)
}

.logoarea {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.elImage {
    width: 50px;
    height: 50px;
    border: 1px solid #ccc;
    margin-left: 20px;
    cursor: pointer;
}
</style>

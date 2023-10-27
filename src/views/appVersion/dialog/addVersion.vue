<template>
	<div>
		<BoDialog dia-log-width="40%" :dia-log-show="showlog" dia-log-title="发版" @close="e_close">
			<template slot="bologbody">
				<el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-row>
						<el-col :span="24">
							<el-form-item label="版本名称" prop="versionName">
								<el-input v-model="ruleForm.versionName"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="版本号" prop="versionNum">
								<el-input v-model="ruleForm.versionNum" type="number"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="版本描述" prop="versionDescribed">
								<el-input v-model="ruleForm.versionDescribed"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="上传文件">
								<el-button size="small" type="primary" @click="e_selectFile">选取文件</el-button>
								<span>{{  ruleForm.filePath}}</span>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</template>
			<template slot="bologfooter">
				<el-button size="small" type="primary" @click="e_save">保存</el-button>
				<el-button size="small" @click="e_close">取消</el-button>
			</template>
		</BoDialog>
		<upload :visible.sync="upload.open" :upload="upload" ref="upload" :showTips="false" @afterImport="e_uploadSu"/>
	</div>
</template>
<script>
import { uploadFile } from '@/api/system/common'
import upload from './upload.vue'
export default {
	components: {
		upload
	},
	data() {
		return {
			headersObj: {},
			showlog: false,
			ruleForm: {},
			fileList: [],
			fileList: [],
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			// 导入参数配置
			upload: {
				// 是否显示弹出层
				open: false,
				// 弹出层标题
				title: '',
				// 是否禁用上传
				isUploading: false,
				// 上传数据的地址
				url: window.globalEnv.VUE_APP_BASE_API + '/common/upload'
			},
		}
	},
	computed: {
		uploadUrl() {
			return window.globalEnv.VUE_APP_BASE_API + '/common/upload'
		}
	},
	methods: {
		e_uploadSu(response){
			this.upload.open= false
			this.ruleForm.filePath = response.url
			this.ruleForm.fileName = response.fileName
		},
		e_selectFile() {
			this.upload.open = true
		},
		onProgress(event, file, fileList) {
			// 对指定文件更新上传进度百分比
			const index = fileList.findIndex(f => f.name === file.name);
			if (index !== -1) {
				fileList[index].percentage = event.percent;
			}
		},
		submitUpload() {
			// 手动触发上传全部已选文件
			this.$refs.upload.submit();
		},
		//打开上传
		e_upload() {
			this.$refs.DiyfileInput.click()
		},
		e_doUpload() {
			const file = this.$refs.DiyfileInput.files[0]; // 获取选中的文件
			const formData = new FormData(); // 新建 FormData 实例
			formData.append('file', file)
			uploadFile(formData).then(re => {

			})
		},
		/**
		* @author Coder
		* @date 2022/11/4
		* @des 保存发布的版本
		*/
		e_save() {
			let params = {
				versionName: this.ruleForm.versionName,
				versionNum: this.ruleForm.versionNum,
				versionDescribed: this.ruleForm.versionDescribed,
				fileName: this.ruleForm.fileName,
				filePath: this.ruleForm.filePath
			}
			this.$net('appFile', 'post', params).then(re => {
				if (re.code == 200) {
					this.$message.success('发布成功')
					this.$emit('saveReload')
				} else {
					this.$message.error(re.msg)
				}
			})
		},
		init() {
			this.showlog = true
		},
		e_close() {
			this.$emit('cancel')
		},
		e_remove() {

		},
		/**
		 * @author Coder
		 * @date 2022/11/4
		 * @des 上传文件
		 */
		uploadSuccess(res, file) {
			if (200 == res.code) {
				let obj = {
					name: file.name,
					fileName: file.name,
					filePath: res.url
				}
				this.fileList.push(obj)

			} else {
				this.$message.error('文件上传失败！' + res.msg)
			}
		},
		e_fileExced() {

		}
	}
}
</script>

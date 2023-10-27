<!-- 模板 - PF -->
<template>
	<el-dialog title="PF模板" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="1000px" center>
		<el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="80px">
			<div>
				<el-tabs v-model="activeName" @change="changeTabs">
					<el-tab-pane label="模板信息" name="tab1">

						<el-form-item label="模板名称" prop="templateName">
							<el-input v-model="dataForm.templateName" placeholder="请输入模板名称"/>
						</el-form-item>

						<el-form-item label="上传模板" prop="templatePath">
							<el-upload ref="upload"
									   :action="uploadUrl()"
									   :on-success="uploadSuccess"
									   :on-remove="uploadRemove"
									   :on-preview="uploadPreview"
									   :limit="1"
									   :file-list="fileList">
								<el-button type="primary" icon="el-icon-upload2" size="mini">点击上传</el-button>
							</el-upload>
                            <el-button type="primary" size="mini" @click="showReportCenter">在线编辑模板</el-button>

                        </el-form-item>
                        <el-form-item label="模板编码" prop="remarks">
                            <el-input
                                v-model="dataForm.templateCode"
                                placeholder="请输入编码"
                            ></el-input>
                        </el-form-item>
						<el-form-item label="模板说明" prop="remarks">
							<el-input v-model="dataForm.remarks" type="textarea" rows="4" placeholder="请输入内容"></el-input>
						</el-form-item>

					</el-tab-pane>
					<el-tab-pane label="脚本信息" name="tab2">

						<el-form-item label="脚本内容" prop="script">
							<el-input v-model="dataForm.script" type="textarea" rows="10" placeholder="请输入内容"></el-input>
						</el-form-item>

					</el-tab-pane>
				</el-tabs>
			</div>

			<div class="dialog-footer" align="center">
				<el-button type="primary" @click="submit">确定</el-button>
				<el-button @click="cancel">取消</el-button>
			</div>

		</el-form>
	</el-dialog>
</template>

<script>
	import {addData, updateData} from "@/api/manageCenter/base/templateManage/pf";
	import { getToken } from '@/utils/auth'
	const MenuId = localStorage.getItem('menuId')

	export default {
		data() {
			return {
				// 是否显示
				visible: false,
				// 选中tab名称
				activeName: "tab1",
				// 上传成功的文件列表
				fileList: [],
				// 表单参数
				dataForm: {
					id: '',
					templateType: '',
					prepareWay: '',
					templateName: '',
					templatePath: '',
					remarks: '',
					script: ''
				},
				// 表单校验
				rules: {
					templateName: [
						{required: true, message: "模板名称不能为空", trigger: "blur"},
						{max: 50, message: '模板名称不能超过50个字', trigger: 'blur'}
					],
					remarks: [
						{max: 200, message: '模板说明不能超过200个字', trigger: 'blur'}
					]
				}
			};
		},
		created() {

		},
		methods: {
			showReportCenter(){
					this.parentRouter.push({
							path: '/micGenric/designReportCenter?id=' + this.dataForm.id + "&templateType=" + this.dataForm.templateType + "&templateName=" + this.dataForm.templateName + '&templateId=' + this.dataForm.templateId + "&token=" + localStorage.getItem("Admin-Token")
					});
			},
			showWebDoc(){
				this.parentRouter.push({
					path: '/micGenric/showWebDoc?templateName=test&absolutePath=' + encodeURIComponent('D:/boshland/uploadPath/reportCenter/106/1/done/1/17/render.docx')
				});
			},
			// 显示弹框
			show() {
				this.visible = true;
			},
			// 切换标签
			changeTabs(tab, event) {
				this.activeName = tab;
			},
			// 重置表单数据
			reset(dataObj) {
				this.resetForm("dataForm");
				if (dataObj) {
					this.dataForm = dataObj;
					if (dataObj.templatePath) {
						// 修改时，初始化文件列表
						this.fileList = [{name: dataObj.templatePath}];
					} else {
						this.fileList = [];
					}
				}
			},
			// 文件上传路径返回
			uploadUrl() {
				return window.globalEnv.VUE_APP_BASE_API + "/common/uploadTemplate"+'?Authorization='+localStorage.getItem('Admin-Token')+'&MenuId='+localStorage.getItem('menuId');
			},
			// 文件上传成功
			uploadSuccess(res, file, fileList) {
				if (200 == res.code) {
					// 上传成功，赋值保存，用于保存修改
					this.dataForm.templatePath = res.url;
				}
			},
			// 点击文件列表
			uploadPreview(file) {
				let filePath = "";
				if (this.dataForm.id) {
					filePath = file.name;
				} else {
					filePath = file.response.fileName;
				}
				window.location.href =
					window.globalEnv.VUE_APP_BASE_API +
					"/common/downloadTemplatePF?fileName=" + encodeURI(filePath)+ '&Authorization=' + getToken()+ '&MenuId=' + MenuId;
			},
			// 文件删除
			uploadRemove(file, fileList) {
				this.dataForm.templatePath = "";
			},

			// 确定按钮操作
			submit() {
				this.$refs["dataForm"].validate((valid) => {
						if (valid) {
							if (this.dataForm.id) {
								updateData(this.dataForm.id, this.dataForm).then((response) => {
									if (response.code === 200) {
										this.$message.success("修改成功");
										this.visible = false;
										this.$parent.getDataList();
									}
								});
							} else {
								addData(this.dataForm).then((response) => {
									if (response.code === 200) {
										this.$message.success("新增成功");
										this.visible = false;
										this.$parent.getDataList();
									}
								});
							}
						}
					}
				)
			},
			// 取消按钮操作
			cancel() {
				this.visible = false;
				this.fileList = [];
			}
		}
	}
</script>

<!-- 模板 - 标签 -->
<template>
	<el-dialog
		title="新建标签模板"
		:visible.sync="visible"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		width="1200px"
		center
	>
		<el-form
			ref="dataForm"
			:model="dataForm"
			:rules="rules"
			label-width="80px"
		>
			<el-row>
				<el-col :span="8">
					<el-form-item label="模板名称" prop="templateName">
						<el-input
							v-model="dataForm.templateName"
							placeholder="请输入模板名称"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="纸张宽度" prop="width">
						<el-input-number
							v-model="dataForm.width"
							:min="1"
							:max="99999"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="纸张高度" prop="height">
						<el-input-number
							v-model="dataForm.height"
							:min="1"
							:max="99999"
						/>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="8">
					<el-form-item label="打印DPI" prop="dpi">
						<el-input-number
							v-model="dataForm.dpi"
							:min="1"
							:max="99999"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="打印字体" prop="fontFamily">
						<el-select
							v-model="dataForm.fontFamily"
							size="small"
							clearable
						>
							<el-option
								v-for="item in fontFamilyOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="24">
					<el-form-item label="模板说明" prop="remark">
						<el-input
							v-model="dataForm.remark"
							type="textarea"
							rows="4"
							placeholder="请输入内容"
						></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<showLabel
				:contentDataList="contentDataList"
				:pageStyle="{
					width: `${dataForm.width}mm`,
					height: `${dataForm.height}mm`
				}"
				v-if="contentDataList.length"
			/>

			<el-row>
				<el-tabs type="border-card">
					<el-tab-pane label="标签内容设置">
						<el-form
							:model="contentForm"
							ref="contentForm"
							:inline="true"
							class="formInline"
						>
							<div>
								<el-form-item
									label="内容类型"
									prop="contentType"
								>
									<el-select
										v-model="contentForm.contentType"
										placeholder="内容类型"
										size="small"
									>
										<el-option
											v-for="item in contentTypeOptions"
											:key="item.key"
											:label="item.label"
											:value="item.label"
										/>
									</el-select>
								</el-form-item>
								<el-form-item>
									<el-button
										@click="addContent"
										type="primary"
										icon="el-icon-plus"
										size="mini"
										>添加
									</el-button>
								</el-form-item>
							</div>
						</el-form>
					</el-tab-pane>
				</el-tabs>
			</el-row>

			<el-row>
				<!-- 列表数据 -->
				<el-table
					v-loading="loading"
					:data="contentDataList"
					height="350"
				>
					<el-table-column
						prop="contentType"
						label="类型"
						align="center"
					></el-table-column>
					<el-table-column
						prop="content"
						label="内容"
						align="center"
						width="200"
					></el-table-column>
					<el-table-column
						prop="fontSize"
						label="字体大小"
						align="center"
						width="150"
					>
						<template slot-scope="scope">
							<el-input-number
								style="width: 120px"
								v-model="scope.row.fontSize"
								:min="1"
								:max="10000"
							></el-input-number>
						</template>
					</el-table-column>
					<el-table-column
						prop="leftOffset"
						label="左偏移mm"
						align="center"
						width="150"
					>
						<template slot-scope="scope">
							<el-input-number
								style="width: 120px"
								v-model="scope.row.leftOffset"
								:min="1"
								:max="10000"
							></el-input-number>
						</template>
					</el-table-column>
					<el-table-column
						prop="upperOffset"
						label="上偏移mm"
						align="center"
						width="150"
					>
						<template slot-scope="scope">
							<el-input-number
								style="width: 120px"
								v-model="scope.row.upperOffset"
								:min="1"
								:max="10000"
							></el-input-number>
						</template>
					</el-table-column>
					<el-table-column
						prop="width"
						label="宽度mm"
						align="center"
						width="150"
					>
						<template slot-scope="scope">
							<el-input-number
								style="width: 120px"
								v-model="scope.row.width"
								:min="1"
								:max="10000"
							></el-input-number>
						</template>
					</el-table-column>
					<el-table-column
						prop="height"
						label="高度mm"
						align="center"
						width="150"
					>
						<template slot-scope="scope">
							<el-input-number
								style="width: 120px"
								v-model="scope.row.height"
								:min="1"
								:max="10000"
							></el-input-number>
						</template>
					</el-table-column>
					<el-table-column
						prop="isCenter"
						label="居中"
						align="center"
					>
						<template slot-scope="scope"
							>{{ scope.row.isCenter == 1 ? "是" : "否" }}
						</template>
					</el-table-column>
					<el-table-column prop="isBlank" label="加粗" align="center">
						<template slot-scope="scope"
							>{{ scope.row.isBlank == 1 ? "是" : "否" }}
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="120">
						<template slot-scope="scope">
							<el-button
								size="mini"
								type="text"
								icon="el-icon-edit"
								@click="updateContent(scope.row, scope.$index)"
								>修改
							</el-button>
							<el-button
								size="mini"
								type="text"
								icon="el-icon-delete"
								@click="deleteContent(scope.$index)"
								>删除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-row>

			<div align="center" style="margin-top:6px;">
				<el-button type="primary" @click="submit">确定</el-button>
				<el-button @click="visible = false">取消</el-button>
			</div>
		</el-form>

		<el-dialog
			:title="contentTitle + '信息设置'"
			:visible.sync="contentVisible"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			width="480px"
			append-to-body
			center
		>
			<el-form
				ref="contentDataForm"
				:model="contentDataForm"
				:rules="contentRules"
				label-width="120px"
			>
				<el-form-item
					label="图片内容"
					prop="imgUrl"
					v-if="contentDataShow.imgUrl"
				>
					<el-upload
						v-model="contentDataForm.imgUrl"
						:action="uploadUrl()"
						:before-upload="beforeUpload"
						:on-success="uploadSuccess"
						:on-remove="uploadRemove"
						:limit="1"
						:file-list="fileList"
					>
						<el-button
							type="primary"
							icon="el-icon-upload2"
							size="mini"
							>点击上传</el-button
						>
					</el-upload>
				</el-form-item>
				<el-form-item
					:label="contentSetText + '内容'"
					prop="content"
					v-if="contentDataShow.content"
				>
					<el-input v-model="contentDataForm.content" />
				</el-form-item>
				<el-form-item
					:label="contentSetText + '示例'"
					prop="example"
					v-if="contentDataShow.example"
				>
					<el-input v-model="contentDataForm.example" />
				</el-form-item>
				<el-form-item
					label="字体大小"
					prop="fontSize"
					v-if="contentDataShow.fontSize"
				>
					<el-input-number
						v-model="contentDataForm.fontSize"
						:min="1"
						:max="99999"
					/>
				</el-form-item>
				<el-form-item label="上偏移" prop="upperOffset">
					<el-input-number
						v-model="contentDataForm.upperOffset"
						:min="1"
						:max="99999"
					/>
				</el-form-item>
				<el-form-item label="左偏移" prop="leftOffset">
					<el-input-number
						v-model="contentDataForm.leftOffset"
						:min="1"
						:max="99999"
					/>
				</el-form-item>
				<el-form-item
					label="宽度"
					prop="width"
					v-if="contentDataShow.width"
				>
					<el-input-number
						v-model="contentDataForm.width"
						:min="1"
						:max="99999"
					/>
				</el-form-item>
				<el-form-item
					label="高度"
					prop="height"
					v-if="contentDataShow.height"
				>
					<el-input-number
						v-model="contentDataForm.height"
						:min="1"
						:max="99999"
					/>
				</el-form-item>
				<el-form-item
					label="是否居中"
					prop="isCenter"
					v-if="contentDataShow.isCenter"
				>
					<el-select v-model="contentDataForm.isCenter" size="small">
						<el-option
							v-for="item in contentOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item
					label="是否加粗"
					prop="isBlank"
					v-if="contentDataShow.isBlank"
				>
					<el-select v-model="contentDataForm.isBlank" size="small">
						<el-option
							v-for="item in contentOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<div align="center">
					<el-button type="primary" @click="submitContent"
						>确定
					</el-button>
					<el-button @click="cancelContent">取消</el-button>
				</div>
			</div>
		</el-dialog>
	</el-dialog>
</template>

<script>
import {
	addData,
	updateData
} from "@/api/manageCenter/base/templateManage/label";
import showLabel from "@/components/manageCenter/print/showLabel";

export default {
	data() {
		return {
			fileList: [],
			// 是否显示
			visible: false,
			loading: false,
			editIndex: null,
			// 表单参数
			dataForm: {
				id: "",
				templateType: "",
				prepareWay: "",
				templateName: "",
				width: "",
				height: "",
				dpi: "",
				fontFamily: ""
			},
			// 打印字体下拉选项
			fontFamilyOptions: [
				{
					value: "宋体",
					label: "宋体"
				},
				{
					value: "仿宋",
					label: "仿宋"
				}
			],
			// 表单校验
			rules: {
				templateName: [
					{
						required: true,
						message: "模板名称不能为空",
						trigger: "blur"
					},
					{
						max: 50,
						message: "模板名称不能超过50个字",
						trigger: "blur"
					}
				],
				width: [
					{
						required: true,
						message: "纸张宽度不能为空",
						trigger: "blur"
					}
				],
				height: [
					{
						required: true,
						message: "纸张高度不能为空",
						trigger: "blur"
					}
				],
				dpi: [
					{
						required: true,
						message: "打印DPI不能为空",
						trigger: "blur"
					}
				],
				fontFamily: [
					{
						required: true,
						message: "打印字体不能为空",
						trigger: "blur"
					}
				],
				remark: [
					{
						max: 200,
						message: "模板说明不能超过200个字",
						trigger: "blur"
					}
				]
			},
			// 标签内容列表数据
			contentDataList: [],
			// 标签内容
			contentForm: {
				contentType: "固定文字"
			},
			// 标签内容内容类型选项
			contentTypeOptions: [
				{
					label: "固定文字",
					key: 1
				},
				{
					label: "变量",
					key: 2
				},
				{
					label: "条形码",
					key: 3
				},
				{
					label: "二维码",
					key: 4
				},
				{
					label: "横线",
					key: 5
				},
				{
					label: "竖线",
					key: 6
				},
				{
					label: "图片",
					key: 7
				}
			],
			// 内容设置标题
			contentTitle: "",
			// 设置内容显示名字
			contentSetText: "",
			// 内容设置显示
			contentVisible: false,
			// 内容设置数据表单
			contentDataForm: {
				id: "",
				templateId: "",
				contentType: "",
				imgUrl: "",
				content: "",
				example: "",
				fontSize: "",
				upperOffset: "",
				leftOffset: "",
				width: "",
				height: "",
				isCenter: 0,
				isBlank: 0
			},
			// 设置内容控件是否显示
			contentDataShow: {
				imgUrl: false,
				content: false,
				example: false,
				fontSize: false,
				width: false,
				height: false,
				isCenter: false,
				isBlank: false
			},
			// 内容设置校验规则
			contentRules: {
				imgUrl: [
					{ required: true, message: "图片不能为空", trigger: "blur" }
				],
				content: [
					{ required: true, message: "内容不能为空", trigger: "blur" }
				],
				fontSize: [
					{
						required: true,
						message: "字体大小不能为空",
						trigger: "blur"
					}
				],
				upperOffset: [
					{
						required: true,
						message: "上偏移不能为空",
						trigger: "blur"
					}
				],
				leftOffset: [
					{
						required: true,
						message: "左偏移不能为空",
						trigger: "blur"
					}
				],
				width: [
					{ required: true, message: "宽度不能为空", trigger: "blur" }
				],
				height: [
					{ required: true, message: "高度不能为空", trigger: "blur" }
				],
				isCenter: [
					{
						required: true,
						message: "是否居中不能为空",
						trigger: "blur"
					}
				],
				isBlank: [
					{
						required: true,
						message: "是否加粗不能为空",
						trigger: "blur"
					}
				]
			},
			// 内容设置选项
			contentOptions: [
				{
					value: 0,
					label: "否"
				},
				{
					value: 1,
					label: "是"
				}
			]
		};
	},
	components: {
		showLabel
	},
	// 创建方法
	created() {},
	methods: {
		// 显示弹框
		show() {
			this.visible = true;
		},
		// 重置表单数据
		reset(dataObj) {
			this.resetForm("dataForm");
			this.contentDataList = [];
			if (dataObj) {
				this.dataForm = dataObj;
				if (dataObj.detailList) {
					for (let i = 0; i < dataObj.detailList.length; i++) {
						this.contentDataList.push(dataObj.detailList[i]);
					}
				}
			}
		},
		// 创建标签内容表单
		createContentForm(type) {
			switch (type) {
				case "固定文字":
					this.contentTitle = "固定文字";
					this.contentSetText = "文字";
					this.contentDataForm.contentType = "固定文字";
					this.contentDataShow = {
						imgUrl: false,
						content: true,
						example: false,
						fontSize: true,
						width: false,
						height: false,
						isCenter: true,
						isBlank: true
					};
					break;
				case "变量":
					this.contentTitle = "变量";
					this.contentSetText = "变量";
					this.contentDataForm.contentType = "变量";
					this.contentDataShow = {
						imgUrl: false,
						content: true,
						example: true,
						fontSize: true,
						width: false,
						height: false,
						isCenter: true,
						isBlank: true
					};
					break;
				case "条形码":
					this.contentTitle = "条形码";
					this.contentSetText = "条码";
					this.contentDataForm.contentType = "条形码";
					this.contentDataShow = {
						imgUrl: false,
						content: true,
						example: true,
						fontSize: false,
						width: true,
						height: true,
						isCenter: true,
						isBlank: false
					};
					break;
				case "二维码":
					this.contentTitle = "二维码";
					this.contentSetText = "二维码";
					this.contentDataForm.contentType = "二维码";
					this.contentDataShow = {
						imgUrl: false,
						content: true,
						example: true,
						fontSize: false,
						width: true,
						height: true,
						isCenter: true,
						isBlank: false
					};
					break;
				case "横线":
					this.contentTitle = "横线";
					this.contentDataForm.contentType = "横线";
					this.contentDataShow = {
						imgUrl: false,
						content: false,
						example: false,
						fontSize: false,
						width: true,
						height: false,
						isCenter: true,
						isBlank: true
					};
					break;
				case "竖线":
					this.contentTitle = "竖线";
					this.contentDataForm.contentType = "竖线";
					this.contentDataShow = {
						imgUrl: false,
						content: false,
						example: false,
						fontSize: false,
						width: false,
						height: true,
						isCenter: true,
						isBlank: true
					};
					break;
				case "图片":
					this.contentTitle = "图片";
					this.contentDataForm.contentType = "图片";
					this.contentDataShow = {
						imgUrl: true,
						content: false,
						example: false,
						fontSize: false,
						width: true,
						height: true,
						isCenter: true,
						isBlank: false
					};
					break;
			}
		},
		// 添加标签内容
		addContent() {
			this.editIndex = null;
			this.createContentForm(this.contentForm.contentType);
			this.resetForm("contentDataForm");
			this.contentVisible = true;
		},
		// 修改标签内容
		updateContent(row, index) {
			const temp = JSON.parse(JSON.stringify(row));
			this.addContent();
			this.createContentForm(temp.contentType);
			this.contentDataForm = temp;
			this.editIndex = index;
		},
		// 删除标签内容
		deleteContent(index) {
			this.contentDataList.splice(index, 1);
		},
		// 确定标签内容
		submitContent() {
			console.info(this.contentDataForm);
			this.$refs["contentDataForm"].validate(valid => {
				if (valid) {
					let obj = JSON.parse(JSON.stringify(this.contentDataForm));
					console.log(this.editIndex);
					if (this.editIndex === null) {
						this.contentDataList.push(obj);
					} else {
						this.$set(this.contentDataList, this.editIndex, obj);
					}
					this.editIndex = null;
					this.cancelContent();
				}
			});
		},
		// 取消标签内容
		cancelContent() {
			this.contentVisible = false;
			// this.resetForm("contentDataForm");
		},

		// 确定按钮操作
		submit() {
			this.$refs["dataForm"].validate(valid => {
				if (valid) {
					this.dataForm.labelDetailJson = JSON.stringify(
						this.contentDataList
					);
					if (this.dataForm.id) {
						updateData(this.dataForm.id, this.dataForm).then(
							response => {
								if (response.code === 200) {
									this.$message.success("修改成功");
									this.visible = false;
									this.$parent.getDataList();
								}
							}
						);
					} else {
						addData(this.dataForm).then(response => {
							if (response.code === 200) {
								this.$message.success("新增成功");
								this.visible = false;
								this.$parent.getDataList();
							}
						});
					}
				}
			});
		},

		// 文件上传路径返回
		uploadUrl() {
			return window.globalEnv.VUE_APP_BASE_API + "/common/upload";
		},
		//
		beforeUpload(file) {
			if (
				!(
					file.type === "image/png" ||
					file.type === "image/gif" ||
					file.type === "image/jpg" ||
					file.type === "image/jpeg"
				)
			) {
				this.$notify.warning({
					title: "警告",
					message: "图片格式目前只支持 png, gif, jpg, jpeg"
				});
				return false;
			}
			return true;
		},
		// 文件上传成功
		uploadSuccess(res, file, fileList) {
			if (200 == res.code) {
				// 上传成功，赋值保存，用于保存修改
				this.contentDataForm.imgUrl = res.url;
				this.contentDataForm.content = file.name;
			}
		},
		// 文件删除
		uploadRemove(file, fileList) {
			this.contentDataForm.imgUrl = "";
		}
	}
};
</script>

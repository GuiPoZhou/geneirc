<template>
	<div class="infoView">
		<el-dialog
			title="查看单位信息"
			:visible.sync="viewShow"
			center
			:show-close="true"
			:close-on-press-escape="false"
			:close-on-click-modal="false"
			@close="close"
		>
			<el-form
				:model="viewParams"
				:rules="rules"
				ref="checkForm"
				:inline="true"
				label-width="200px"
			>
				<el-tabs
					v-model="activeName"
					@tab-click="handleClick"
					:stretch="true"
				>
					<el-tab-pane label="基本信息" name="first">
						<div>
							<el-form-item label="单位名称" prop="deptName">
								<el-input
									v-model="viewParams.deptName"
									size="large"
									:disabled="true"
								/>
							</el-form-item>
							<el-form-item
								label="统一社会信用代码"
								prop="creditCode"
							>
								<el-input
									v-model="viewParams.creditCode"
									size="large"
									:disabled="true"
								/>
							</el-form-item>
						</div>
						<div class="input-size">
							<el-form-item label="单位法人" prop="legalPerson">
								<el-input
									v-model="viewParams.legalPerson"
									size="large"
									:disabled="true"
								/>
							</el-form-item>
							<el-form-item label="单位地址" prop="address">
								<el-input
									v-model="viewParams.address"
									size="large"
									:disabled="true"
								/>
							</el-form-item>
						</div>
						<div class="input-size">
							<el-form-item label="单位电话" prop="deptPhone">
								<el-input
									v-model="viewParams.deptPhone"
									size="large"
									:disabled="true"
								/>
							</el-form-item>
							<el-form-item label="单位邮箱" prop="contactsEmail">
								<el-input
									v-model="viewParams.contactsEmail"
									size="large"
									:disabled="true"
								/>
							</el-form-item>
						</div>
						<div class="input-size">
							<el-form-item label="单位邮编" prop="zipCode">
								<el-input
									v-model="viewParams.zipCode"
									size="large"
									:disabled="true"
								/>
							</el-form-item>
							<el-form-item label="单位传真" prop="fax">
								<el-input
									v-model="viewParams.fax"
									size="large"
									:disabled="true"
								/>
							</el-form-item>
						</div>
						<div class="input-size">
							<el-form-item label="单位联系人" prop="contacts">
								<el-input
									v-model="viewParams.contacts"
									size="large"
									:disabled="true"
								/>
							</el-form-item>
							<el-form-item
								label="联系人电话"
								prop="contactsPhone"
							>
								<el-input
									v-model="viewParams.contactsPhone"
									size="large"
									:disabled="true"
								/>
							</el-form-item>
						</div>
						<div class="input-size">
							<el-form-item label="开户银行" prop="openBank">
								<el-input
									v-model="viewParams.openBank"
									size="large"
									:disabled="true"
								/>
							</el-form-item>
							<el-form-item label="开户账号" prop="account">
								<el-input
									v-model="viewParams.account"
									size="large"
									:disabled="true"
								/>
							</el-form-item>
						</div>
					</el-tab-pane>

					<el-tab-pane label="签章信息" name="second">
						<div class="app">
							<div style="display:inline-block; width:60%">
								<el-table
									v-loading="loading"
									:data="viewParams.signatureList"
									align="center"
									@row-click="handleCheck"
								>
									<el-table-column
										prop="id"
										type="index"
										label="序号"
										width="62px"
                                        align="center"
									/>
									<el-table-column
										prop="signatureType"
										label="签章类型"
										width="100"
										:formatter="formatter"
                                        align="center"
									/>
									<el-table-column
										prop="signatureName"
										label="签章文件图片"
                                        align="center"
									/>
									<el-table-column
										fixed="right"
										label="操作"
										width="150%"
                                        align="center"
									>
										<template slot-scope="scope">
											<el-button
												size="mini" type="text" icon="el-icon-download"
												@click="downloadHandle(scope.row)">
												下载
											</el-button>
										</template>
									</el-table-column>
								</el-table>
							</div>

							<div
								style="display:inline-block;margin-left:10px;width:35%"
							>
								<img
									width="100%"
									:src="dialogImageUrl"
									alt=""
								/>
							</div>
						</div>
					</el-tab-pane>
				</el-tabs>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="close">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
export default {
	components: {},
	data() {
		return {
			activeName: "first",
			loading: false,
			dialogImageUrl: "",
			dialogVisible: false,
			rules: {
				deptName: [
					{
						required: true,
						message: "请输入单位名称",
						trigger: "blur"
					}
				],
				creditCode: [
					{
						required: true,
						message: "请输入统一社会信用代码",
						trigger: "blur"
					}
				]
			}
		};
	},
	props: {
		viewShow: {
			type: Boolean,
			default: false
		},
		viewParams: {
			type: Object
		}
	},
	methods: {
		handleRemove(file, fileList) {
			console.log(file, fileList);
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		handleClick(tab, event) {
			console.log(tab, event);
		},
		//取消按钮操作
		close() {
			this.dialogImageUrl = '';
			this.$emit("update:viewShow", false);
		},
		//下载图片
		downloadHandle(row) {
			this.mbu_downloadFile(row.signatureUrl)
		},
		handleCheck(row, event, column) {
			this.dialogImageUrl =
				window.globalEnv.VUE_APP_BASE_API + "/" + row.signatureUrl;
		},
		formatter(row) {
			let signatureTypeName = "";
			switch (row.signatureType) {
				case 0:
					signatureTypeName = "公章";
					break;
				case 1:
					signatureTypeName = "骑缝章";
					break;
				case 2:
					signatureTypeName = "CMA章";
					break;
        case 3:
          signatureTypeName = "其他";
          break;
        case 4:
          signatureTypeName = "CNAS章";
          break;
        case 5:
          signatureTypeName = "检验检测章";
          break
        default:
          signatureTypeName = "";
          break;
			}
			return signatureTypeName;
		}
	},
	computed: {},
	created() {},
	mounted() {}
};
</script>
<style lang="less">
.infoView {
	ul,
	li {
		list-style: none;
		padding: 0;
	}
}
.searchParentName {
	display: flex;
}
</style>

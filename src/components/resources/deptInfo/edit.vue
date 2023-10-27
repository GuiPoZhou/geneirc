<template>
	<div class="infoEdit">
		<el-dialog
			title="编辑单位信息"
			:visible.sync="editShow"
			center
			:show-close="true"
			:close-on-press-escape="false"
			:close-on-click-modal="false"
			@close="close"
		>
			<el-form
				:model="editParams"
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
									v-model="editParams.deptName"
									size="large"
									:disabled="true"
								/>
							</el-form-item>
							<el-form-item
								label="统一社会信用代码"
								prop="creditCode"
							>
								<el-input
									v-model="editParams.creditCode"
									size="large"
								/>
							</el-form-item>
						</div>
						<div class="input-size">
							<el-form-item label="单位法人" prop="legalPerson">
								<el-input
									v-model="editParams.legalPerson"
									size="large"
								/>
							</el-form-item>
							<el-form-item label="单位地址" prop="address">
								<el-input
									v-model="editParams.address"
									size="large"
								/>
							</el-form-item>
						</div>
						<div class="input-size">
							<el-form-item label="单位电话" prop="deptPhone">
								<el-input
									v-model="editParams.deptPhone"
									size="large"
								/>
							</el-form-item>
							<el-form-item label="单位邮箱" prop="contactsEmail">
								<el-input
									v-model="editParams.contactsEmail"
									size="large"
								/>
							</el-form-item>
						</div>
						<div class="input-size">
							<el-form-item label="单位邮编" prop="zipCode">
								<el-input
									v-model="editParams.zipCode"
									size="large"
								/>
							</el-form-item>
							<el-form-item label="单位传真" prop="fax">
								<el-input
									v-model="editParams.fax"
									size="large"
								/>
							</el-form-item>
						</div>
						<div class="input-size">
							<el-form-item label="单位联系人" prop="contacts">
								<el-input
									v-model="editParams.contacts"
									size="large"
								/>
							</el-form-item>
							<el-form-item
								label="联系人电话"
								prop="contactsPhone"
							>
								<el-input
									v-model="editParams.contactsPhone"
									size="large"
								/>
							</el-form-item>
						</div>
						<div class="input-size">
							<el-form-item label="开户银行" prop="openBank">
								<el-input
									v-model="editParams.openBank"
									size="large"
								/>
							</el-form-item>
							<el-form-item label="开户账号" prop="account">
								<el-input
									v-model="editParams.account"
									size="large"
								/>
							</el-form-item>
						</div>
					</el-tab-pane>

					<el-tab-pane label="签章信息" name="second">
						<div class="app">
							<div style="display:inline-block; width:60%">
								<el-form-item
									label="上传签字图片"
									prop="address"
								>
									<el-button
										type="primary"
										size="mini"
										icon="el-icon-upload"
										@click="uploadShow = true"
									>
										上传
									</el-button>
								</el-form-item>

								<el-table
									v-loading="loading"
									:data="editParams.signatureList"
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
												@click="
													downloadHandle(scope.row)
												"
											>
												下载
											</el-button>
											<el-button
												size="mini" type="text" icon="el-icon-delete"
												@click="
													deleteHandle(
														scope.row,
														scope
													)
												"
											>
												删除
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
				<el-button type="primary" @click="submitForm('checkForm')" center
				>保存
				</el-button
				>
				<el-button @click="close">取消</el-button>
			</div>
		</el-dialog>
		<infoUpload
			:uploadShow.sync="uploadShow"
			@uploadHandle="getTableData"
		/>
	</div>
</template>
<script>
import {editCheck} from "@/api/resources/deptInfo/deptInfo";
import infoUpload from "@/components/resources/deptInfo/upload";

export default {
	components: {
		infoUpload
	},
	data() {
		return {
			activeName: "first",
			loading: false,
			dialogImageUrl: "",
			dialogVisible: false,
			uploadShow: false,
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
		editShow: {
			type: Boolean,
			default: false
		},
		editParams: {
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
			this.$emit("update:editShow", false);
		},
		//保存接口操作
		submitForm(checkForm) {
			this.$refs['checkForm'].validate(valid => {
				if (valid) {
					const saveDate = {
						deptName: this.editParams.deptName,
						legalPerson: this.editParams.legalPerson,
						creditCode: this.editParams.creditCode,
						address: this.editParams.address,
						deptPhone: this.editParams.deptPhone,
						contacts: this.editParams.contacts,
						contactsPhone: this.editParams.contactsPhone,
						fax: this.editParams.fax,
						contactsEmail: this.editParams.contactsEmail,
						zipCode: this.editParams.zipCode,
						openBank: this.editParams.openBank,
						account: this.editParams.account,
						signatureJson: JSON.stringify(this.editParams.signatureList)
					};
					editCheck(saveDate, this.editParams.id)
						.then(() => {
							//触发父组件传递过来的函数getTablelist()
							this.$emit("func", null);
							this.$message.success("保存成功");
							this.close();
						})
				}
			})

		},
		//删除按钮操作
		deleteHandle(row, scope) {
			console.log(1111);
			const index = scope.$index;
			const name = row.signatureName;
			this.$confirm('确定要删除"' + name + '"项目？', "警告", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			})
				.then(() => {
					this.editParams.signatureList.splice(index, 1);
					this.$message.success("删除成功");
				})
				.catch(function () {
				});
		},
		//下载图片
		downloadHandle(row) {
			this.mbu_downloadFile(row.signatureUrl)
		},
		handleCheck(row, event, column) {
			this.dialogImageUrl =
				window.globalEnv.VUE_APP_BASE_API + "/" + row.signatureUrl;
		},
		getTableData(val) {
			if (null == this.editParams.signatureList) {
				// 修改时，列表没有内容，需要初始化一次
				this.editParams.signatureList = [];
			}
			this.editParams.signatureList.push(val);
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
	created() {
	},
	mounted() {
	}
};
</script>
<style lang="less">
.infoEdit {
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

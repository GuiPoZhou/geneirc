<template>
	<div>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="验收入库" name="first">
				<el-form ref="formsample" :model="queryParams" label-width="100px" class="flexdit">
					<el-row>
						<el-col :span="8">
							<el-form-item label="采购单号">
								<el-input placeholder="采购单号" v-model="queryParams.buyOrderNo" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="供应商名称">
								<el-input placeholder="采购单号" v-model="queryParams.supplierName" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="行号">
								<el-input placeholder="行号" v-model="queryParams.rowIndex" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="耗材编号">
								<el-input placeholder="耗材编号" v-model="queryParams.materialNumber" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="耗材名称">
								<el-input placeholder="耗材名称" v-model="queryParams.materialName" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="规格型号">
								<el-input placeholder="规格型号" v-model="queryParams.materialModel" :disabled="true"></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="8">
							<el-form-item label="计量单位">
								<el-input placeholder="计量单位" v-model="queryParams.unit" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="品牌">
								<el-input placeholder="品牌" v-model="queryParams.brand" :disabled="true"></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="8">
							<el-form-item label="生产厂商">
								<el-input placeholder="生产厂商" v-model="queryParams.manufacturer"
										  :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="试剂级别">
								<el-input placeholder="试剂级别" v-model="queryParams.grade" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="采购数量">
								<el-input placeholder="入库数量" v-model="queryParams.orderCount" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="入库数量合计">
								<el-input placeholder="入库数量合计" v-model="queryParams.acceptCount"
										  :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="未交数量">
								<el-input placeholder="未交数量" v-model="queryParams.unAcceptCount"
										  :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="要求到货日期">
								<el-input placeholder="要求到货日期" v-model="queryParams.finishDate"
										  :disabled="true"></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="24" style="margin-top: 50px;"></el-col>

						<el-col :span="8">
							<el-form-item label="入库日期">
								<el-date-picker
									v-model="queryParams.storeInDate"
									type="date" value-format="yyyy-MM-dd"
									format="yyyy-MM-dd" :disabled="isdisable"
									placeholder="选择入库日期">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="入库数量">
								<el-input placeholder="入库数量" v-model="queryParams.materialCount"
										  :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="入库库位">
								<el-input placeholder="入库库位" v-model="queryParams.storeSiteName" :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="单价">
								<el-input placeholder="单价" v-model="queryParams.price"
										  :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="金额">
								<el-input placeholder="金额" v-model="queryParams.amount"
										  :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="批号">
								<el-input placeholder="批号" v-model="queryParams.batchNumber"
										  :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="生产日期">
								<el-date-picker
									v-model="queryParams.productionDate"
									type="date" value-format="yyyy-MM-dd"
									format="yyyy-MM-dd" :disabled="isdisable"
									placeholder="选择生产日期">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="有效期">
								<el-input placeholder="有效期" v-model="queryParams.safeDate"
										  :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="有效到期日">
								<el-date-picker
									v-model="queryParams.invalidDate"
									type="date" value-format="yyyy-MM-dd"
									format="yyyy-MM-dd" :disabled="isdisable"
									placeholder="选择有效到期日">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="证书编号">
								<el-input placeholder="证书编号" v-model="queryParams.certificateNo"
										  :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8" 　style="height: 58px;"></el-col>
						<el-col :span="24">
							<el-form-item label="备注">
								<el-input type="textarea" placeholder="备注" v-model="queryParams.remark"
										  :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="验收人1">
								<el-input placeholder="验收人1" v-model="queryParams.checkPersonaName"
										  :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="入库人1">
								<el-input placeholder="入库人1" v-model="queryParams.storePersonaName"
										  :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="送货人">
								<el-input placeholder="送货人" v-model="queryParams.postPerson"
										  :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="验收人2">
								<el-input placeholder="验收人2" v-model="queryParams.checkPersonbName"
										  :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="入库人2">
								<el-input placeholder="入库人2" v-model="queryParams.storePersonbName"
										  :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="要求关闭采购订单行吗？" label-width="200px" style="height: 36px">
								<el-radio v-model="queryParams.closeFlag" :disabled="isdisable" label="Y">是</el-radio>
								<el-radio v-model="queryParams.closeFlag" :disabled="isdisable" label="N">否</el-radio>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="录入人员">
								<el-input placeholder="录入人员" v-model="queryParams.createByStr" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="最新修改日期">
								<el-input placeholder="最新修改日期" v-model="queryParams.updateTimeStr"
										  :disabled="true"></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="24">
							<el-form-item label="上传附件" prop="standardNameCn">
<!--								<el-upload ref="upload" action="" :file-list="queryParams.uploadFileList"-->
<!--										   :disabled="isdisable" name="file">-->
<!--									<div slot="file" slot-scope="{file}">-->
<!--										<span style="padding-right: 20px">{{ file.name?file.name:file.fileName }}</span>-->
<!--										<el-button type="text" size="small" @click="look_file(file.response)">查看-->
<!--										</el-button>-->

<!--										<el-button type="text" size="small" style="color: #1CD0BD"-->
<!--												   @click="down_file(file.response)">下载-->
<!--										</el-button>-->
<!--									</div>-->
<!--									<el-button type="primary" icon="el-icon-paperclip" :disabled="isdisable">点击上传-->
<!--									</el-button>-->
<!--								</el-upload>-->
                                <el-tag style="margin-right: 5px;cursor: pointer;margin-bottom: 5px;"
                                        v-for="(file, fileIndex) in queryParams.uploadFileList"
                                        :key="fileIndex"
                                        @click="e_downLoadPonitFile(file)"
                                >{{ file.fileName }}
                                </el-tag
                                >
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
export default {
	name: "materialWarehousing",
	data() {
		return {
			queryParams: {},
			dataList: [],
			isdisable: true,
			activeName: 'first',
			fileList: [],

		}
	},
	mounted() {

	},
	methods: {
		handleClick(tab, event) {
			console.log(tab, event);
		},
		init(params) {
			if (params) {
				this.queryParams = {
					...params
				}
			}
		},
        e_downLoadPonitFile(file) {
            // window.open(file.filePath);
            this.downLoadFile2(file.filePath);
        },
		// 查看文件
		look_file(data) {
			// console.log(data);
			window.open(window.globalEnv.VUE_APP_BASE_API + '/' + data.fileName, '_blank');
		},
		// 下载文件
		down_file(data) {
			this.mbu_downloadFile(data.fileName)
		},
	}
}
</script>

<style scoped>

</style>

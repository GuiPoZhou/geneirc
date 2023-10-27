<template>
	<div>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="耗材退货" name="first">
				<el-form ref="formsample" :model="queryParams" label-width="100px" class="flexdit">
					<el-row>
						<el-col :span="8">
							<el-form-item label="入库日期">
								<el-input placeholder="入库日期" v-model="queryParams.storeInDate" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="供应商名称">
								<el-input placeholder="供应商名称" v-model="queryParams.supplierName" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item style="height: 36px"></el-form-item>
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
								<el-input placeholder="生产厂商" v-model="queryParams.manufacturer" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="试剂级别">
								<el-input placeholder="试剂级别" v-model="queryParams.grade" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="入库数量">
								<el-input placeholder="入库数量" v-model="queryParams.orderCount" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="入库库位">
								<el-input placeholder="入库库位" v-model="queryParams.storeSiteName" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="单价">
								<el-input placeholder="单价" v-model="queryParams.price" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="金额">
								<el-input placeholder="金额" v-model="queryParams.amount" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="批号">
								<el-input placeholder="批号" v-model="queryParams.batchNumber" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="生产日期">
								<el-input placeholder="生产日期" v-model="queryParams.productionDate" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="有效期">
								<el-input placeholder="有效期" v-model="queryParams.safeDate" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="有效到期日">
								<el-input placeholder="有效到期日" v-model="queryParams.invalidDate" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="证书编号">
								<el-input placeholder="证书编号" v-model="queryParams.certificateNo" :disabled="true"></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="24" style="margin-top: 50px;"></el-col>

						<el-col :span="8">
							<el-form-item label="退货日期">
								<el-date-picker v-model="queryParams.refundDate" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :disabled="isdisable" placeholder="选择退货日期">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="退货数量">
								<el-input placeholder="退货数量" v-model="queryParams.materialCount" :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="退货库位">
								<el-input placeholder="退货库位" v-model="queryParams.storeSiteName" :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="退货人">
								<el-input placeholder="退货人" v-model="queryParams.refundPersonName" :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="16">
							<el-form-item label="退货原因">
								<el-input type="textarea" placeholder="退货原因" v-model="queryParams.reason" :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="录入人员">
								<el-input placeholder="录入人员" v-model="queryParams.createByStr" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="最新修改日期">
								<el-input placeholder="最新修改日期" v-model="queryParams.updateTimeStr" :disabled="true"></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="24">
							<el-form-item label="附件上传" prop="standardNameCn">
<!--								<el-upload ref="upload" action="" :file-list="queryParams.uploadFileList" :disabled="isdisable" name="file">-->
<!--									<div slot="file" slot-scope="{file}">-->
<!--										<span style="padding-right: 20px">{{ file.name?file.name:file.fileName }}</span>-->
<!--										<el-button type="text" size="small" @click="look_file(file.response)">查看</el-button>-->
<!--										<el-button type="text" size="small" style="color: #1CD0BD" @click="down_file(file.response)">下载</el-button>-->
<!--									</div>-->
<!--									<el-button type="primary" icon="el-icon-paperclip" :disabled="isdisable">点击上传</el-button>-->
<!--								</el-upload>-->
                                <el-tag style="margin-right: 5px;cursor: pointer;margin-bottom: 5px;"
                                        v-for="(file, fileIndex) in queryParams.uploadFileList"
                                        :key="fileIndex"
                                        @click="e_downLoadPonitFile(file)"
                                >{{ file.fileName }}
                                </el-tag>
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
	name: "materialRefund",
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

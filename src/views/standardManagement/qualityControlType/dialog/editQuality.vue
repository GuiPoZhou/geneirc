<template>
<div>
	<bo-dialog
		dia-log-title="质控类型"
		:dia-log-show="isShow"
		dia-log-width="60%"
	>
		<template slot="bologbody">
			<el-form
			 :model="queryForm"
			 :inline="true"
			 :rules="rules"
			 label-width="100px"
			 ref="queryForm"
			>
				<el-row>
					<el-col :span="12">
						<el-form-item label="质控名称" prop="qcName">
							<el-input v-model="queryForm.qcName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" >
						<el-form-item label="质控类型" prop="qcType">
							<el-select v-model="queryForm.qcType"
									   filterable
									   @change="changeLabel">
								<el-option
									v-for="item in typeList"
									:label="item.dictLabel"
									:value="item.dictCode"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="备注">
							<el-input v-model="queryForm.remark" type="textarea" :rows="3"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</template>
		<template slot="bologfooter">
			<el-button type="primary" :loading="isloading" size="small" @click="save">保存</el-button>
			<el-button size="small" @click="e_close">关闭</el-button>
		</template>
	</bo-dialog>
	</div>
</template>

<script>
export default {
	name: "editQuality",
	props: {
		typeList: Array
	},
	data() {
		return {
			isShow: false,
			queryForm: {
				remark:null,
				qcName: null,
				qcType:null,
				qcTypeName:null,
			},
			showType: null,
			isloading: false,
			rules: {
				qcName:[
					{required: true,
						message: "请输入质控名称",
						trigger: "blur",}
				],
				qcType: [
					{
						required: true,
						message: "请选择质控类型",
						trigger: "change",
					},
				],
			}
		}
	},
	methods: {
		init(type,data) {
			this.isShow = true
			this.showType = type
			if (data) {
				this.queryForm =  data
			}
		},
		save() {
			this.$refs.queryForm.validate(val => {
				if (val) {
					this.isloading = true
					this.$net('/v1/quality/control/addOrUpdate','post',this.queryForm).then(res => {
						if (res.code === 200) {
							this.$message.success(res.msg)
							this.isloading = false
							this.e_close()
						}else {
							this.isloading = false
						}
					}).catch(e => {
						this.isloading = false
					})
				}
			})

		},
		changeLabel(e) {
			console.log(e);
			this.queryForm.qcTypeName = this.typeList.filter(item => item.dictCode === e)[0].dictLabel
		},
		e_close() {
			this.isShow = false
			this.$emit('close')
		},
	},
}
</script>

<style scoped>

</style>

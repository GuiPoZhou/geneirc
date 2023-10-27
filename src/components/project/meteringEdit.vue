<template>
	<el-dialog title="编辑计量单位" :visible.sync="editShow" center :before-close="close" :close-on-press-escape="false"
			   :close-on-click-modal="false" width="55%">
		<el-form :model="unitParams" ref="unitForm" :inline="true" label-width="100px">
			<el-row>
				<el-col :span="8">
					<el-form-item label="单位名称" prop="unitName">
						<el-input v-model="unitParams.unitName" clearable size="small" disabled/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="编制人员" prop="updateBy">
						<el-input v-model="unitParams.updateBy" clearable size="small" disabled/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="编制时间" prop="createTime">
						<el-time-picker
							v-model="unitParams.createTime"
							disabled
							:picker-options="{
						selectableRange: '00:00:00 - 23:00:00',
					}"
						>
						</el-time-picker>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="8">
					<el-form-item label="单位别称" prop="unitAlias">
						<el-input v-model="unitParams.unitAlias" clearable size="small"/>
					</el-form-item>
				</el-col>
				<el-col :span="10">
					<el-form-item label="备注说明" prop="remark">
						<el-input style="width: 300px" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" clearable
								  v-model="unitParams.remark"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="saveForm" center>保存</el-button>
			<el-button @click="close">取消</el-button>
		</div>
	</el-dialog>
</template>
<script>
import {saveMeasuringList} from '@/api/standardManagement/config'
export default {
	data() {
		return {
			editShow: false
		}
	},
	props: {
		//表单数据
		unitParams: {},
	},
	methods: {
		init () {
			this.editShow = true
		},
		//取消按钮操作
		close() {
			this.$emit('close')
		},
		//保存按钮操作
		saveForm() {
			const queryParams = {
				id: this.unitParams.id,
				unitAlias: this.unitParams.unitAlias,
				remark: this.unitParams.remark,
			}
			saveMeasuringList(queryParams).then(response => {
				this.saveOk()
				this.close()
				// /在子组件的方法中使用传递过来的函数
				// emit意思是触发调用的意思,前面是函数名字，后面是参数
				this.$emit('func', null)
			})
		},
		//保存成功
		saveOk() {
			this.$message({
				showClose: true,
				message: '保存成功',
				type: 'success',
			})
		},
	},
	created() {
	},
	mounted() {
	},
}
</script>

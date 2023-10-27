<template>
	<el-dialog title="新增计量单位" :visible.sync="addShow" center @open="open" :before-close="close"
			   :close-on-press-escape="false" :close-on-click-modal="false" width="800px">
		<el-form :model="unitParams" :rules="rules" ref="unitParams" label-width="116px">
			<el-row>
				<el-col :span="12">
					<el-form-item label="单位名称" prop="unitName">
						<el-input v-model.trim="unitParams.unitName" clearable size="small"/>
					</el-form-item>
				</el-col>

				<el-col :span="12">
					<el-form-item label="单位别称" prop="unitAlias">
						<el-input v-model="unitParams.unitAlias" clearable size="small"/>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="备注说明" prop="remark">
				<el-input type="textarea" clearable v-model="unitParams.remark"></el-input>
			</el-form-item>
			<!-- <el-form-item label="编制人员" prop="createBy">
          <el-input
            v-model="unitParams.createBy"
            clearable
            size="small"
          />
        </el-form-item> -->
			<!-- <el-form-item label="编制时间" prop="createTime">
          <el-time-picker
            v-model="unitParams.createTime"
            :picker-options="{
              selectableRange: '00:00:00 - 23:00:00'
            }">
          </el-time-picker>
        </el-form-item> -->


		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="submitForm('unitParams')" center>保存</el-button>
			<el-button @click="close">取消</el-button>
		</div>
	</el-dialog>
</template>
<script>
import {addMeasuringList} from '@/api/standardManagement/config'

export default {
	data() {
		return {
			// 计量单位参数
			unitParams: {
				unitName: null, //单位名称
				createBy: null, //编制人员
				createTime: null, //编制时间
				unitAlias: null, //单位别称
				remark: null, //备注说明
				status: true,
			},
			rules: {
				unitName: [{required: true, message: '请输入单位名称', trigger: 'blur'}],
			},
			addShow: false
		}
	},
	methods: {
		init () {
			this.addShow = true
		},
		open() {
			//清除表单验证
			this.$nextTick(() => {
				this.$refs.unitParams.clearValidate()
			})
			this.unitParams = {}
		},
		//取消按钮操作
		close() {
			this.$emit('close')
		},
		//保存接口操作
		submitForm(unitParams) {
			this.$refs[unitParams].validate(valid => {
				if (valid) {
					addMeasuringList(this.unitParams)
						.then(() => {
							//触发父组件传递过来的函数getTablelist()
							this.$emit('func', null)
							this.$message.success('保存成功')
							this.close()
						})
						.catch(function () {
						})
				}
			})
		},
	},
	computed: {},
	created() {
	},
	mounted() {
	},
}
</script>

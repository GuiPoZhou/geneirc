<template>
	<el-dialog :title="ruleTitle" :visible.sync="visible" append-to-body width="800px" center
		:close-on-press-escape="false" :close-on-click-modal="false" @open="open" @close="close">
		<el-form ref="queryForm" :model="rules" label-width="80px" :rules="validate">
			<el-form-item label="规则名称" style="width:300px" prop="ruleName">
				<el-input v-model="rules.ruleName" />
			</el-form-item>
			<el-form-item label="规则说明">
				<el-input v-model="rules.ruleExplain" />
			</el-form-item>
		</el-form>
		<el-button type="primary" @click="addNewLogic" size="small" icon="el-icon-plus" style="margin-bottom:10px">新增逻辑
		</el-button>
		<!-- <a-table :columns="columns" :data-source="tableData" :pagination="false" :scroll={y:300} bordered>
			<template
				slot="operation"
				slot-scope="text, record, index"
			>
				<el-button size="mini" type="text" icon="el-icon-edit" @click="edit(record,index)">修改</el-button>
				<el-button size="mini" type="text" icon="el-icon-delete" @click="deleteList(record,index)">删除</el-button>
			</template>
		</a-table> -->
		<el-table ref="multipleTable" :data="tableData"  style="width: 100%" border>
			<el-table-column prop="logicContent" label="逻辑模块" align="center"></el-table-column>
			<el-table-column prop="logicExplain" label="模块说明" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="logicSort" label="排序" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column label="操作" show-overflow-tooltip align="center">
				<template slot-scope="scope">
				<el-button size="mini" type="text" icon="el-icon-edit" @click="edit(scope.row,index)">修改</el-button>
				<el-button size="mini" type="text" icon="el-icon-delete" @click="deleteList(scope.row,index)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="handleSave">保存</el-button>
			<el-button @click="close">取消</el-button>
		</div>
		<el-dialog title="选择模块" :visible="selectModule" append-to-body width="500px" center
			:close-on-press-escape="false" :close-on-click-modal="false" @close="closeLogic">
			<div class="logicModule">
				<p>逻辑模块:</p>
				<el-select v-model="logicModule" style="width:100%">
					<el-option v-for="item in modules" :label="item.label" :value="item.value" :key="item.value">
					</el-option>
				</el-select>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="save">保存</el-button>
				<el-button @click="closeLogic">取消</el-button>
			</div>
		</el-dialog>

		<addLogic :addLogicShow.sync="addLogicShow" :logicModule="logicModule" @getLogic="getLogic" :editData="editData"
			:editId="editId" :ruleType="ruleType" />

	</el-dialog>
</template>

<script>
import { getEncodingRuleLogic, deleteEncodingRuleLogic } from '@/api/manageCenter/baseConfig'
import addLogic from './addLogic'

const columns = [
	{
		title: '逻辑模块',
		dataIndex: 'logicModule',
		align: 'center',
		customRender: (text, record, index) => modules.filter(item => item.value === text)[0].label
	}, {
		title: '模块说明',
		align: 'center',
		dataIndex: 'logicExplain',
	}, {
		title: '排序',
		align: 'center',
		dataIndex: 'logicSort',
	}, {
		title: '操作',
		align: 'center',
		dataIndex: 'operation',
		sign: false,
		scopedSlots: { customRender: 'operation' },
	},
]
//1.日期时间、2.固定值、3.随机数、4.按时间串计数、5.groovy表达式、6.引用其他
const modules = [{
	value: 1,
	label: '日期时间'
}, {
	value: 2,
	label: '固定值'
}, {
	value: 3,
	label: '随机数'
}, {
	value: 4,
	label: '按时间串计数'
}, {
	value: 5,
	label: 'groovy表达式'
}, {
	value: 6,
	label: '引用其他'
}]
export default {
	components: {
		addLogic
	},
	data() {
		return {
			rules: {},
			tableData: [],
			columns,
			selectModule: false,
			addLogicShow: false,
			modules,
			logicModule: '',
			currentEdit: null,
			editData: {},
			validate: {
				ruleName: [
					{ required: true, message: '请输入规则名称', trigger: 'change' },
				],
			},
			ruleTitle: "新增规则"
		}
	},
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		editRules: {},
		editId: null,
		ruleWay: '',
		ruleType: ''
	},
	methods: {
		open() {
			const temp = JSON.parse(JSON.stringify(this.editRules))
			console.log(temp)
			if (null != this.editId) {
				this.ruleTitle = "修改规则";
			} else {
				this.ruleTitle = "新增规则";
			}
			this.rules = temp
			this.tableData = temp.encodingRuleLogicDTOList || []
		},
		close() {
			this.$emit("update:visible", false);
		},
		save() {
			if (this.logicModule) {
				this.addLogicShow = true
				this.selectModule = false
			} else {
				this.$message.error('请选择模块')
			}
		},
		closeLogic() {
			this.selectModule = false;
		},
		addNewLogic() {
			this.selectModule = true
			this.currentEdit = null;
			this.editData = {}
		},
		edit(record, index) {
			// if (record.id) {
			//   getEncodingRuleLogic(record.id).then(res=>{
			//     this.currentEdit = index;
			//     this.editData = record
			//     console.log(record,res)
			//     this.addLogicShow = true
			//     this.logicModule = record.logicModule
			//   })
			// } else {
			this.currentEdit = index;
			this.editData = record
			this.addLogicShow = true
			this.logicModule = record.logicModule
			// }


			console.log(record)
		},
		getLogic(form) {
			console.log(form)
			const temp = JSON.parse(JSON.stringify(form))
			if (this.currentEdit !== null) {
				this.$set(this.tableData, this.currentEdit, temp)
			} else {
				this.tableData.push(temp)
			}
		},
		handleSave() {
			this.$refs['queryForm'].validate((valid) => {
				if (valid) {
					const query = Object.assign({}, this.rules)
					query.encodingRuleLogicList = this.tableData
					query.ruleWay = query.ruleWay || this.ruleWay
					console.log(query)
					this.$emit('getRules', query)
				}
			})

		},
		deleteList(row, index) {
			console.log(row.id)
			if (row.id) {
				deleteEncodingRuleLogic(row.id).then(res => {
					this.$message.success(res.msg)
				})
			}
			this.tableData.splice(index, 1)

		}
	}
}
</script>
<style lang="less" scoped>
/deep/ .logicModule {
	display: flex;
	align-items: center;

	p {
		width: 100px;
		margin-bottom: 0;
	}
}
</style>

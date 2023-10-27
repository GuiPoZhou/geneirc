<template>
	<!-- 添加或修改-- 检测审批配置对话框 -->
	<el-dialog :title="title" center :visible.sync="approvalTypeVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="660px"
			   append-to-body @close="closeDialog">
		<el-form :model="queryParams">
			<el-form-item>
				<span class="require-css" style="margin-right: 10px"><b>审批类型 :</b></span>
				<el-select v-model="approvalTypeCode" @change="approvalTypeChange" :disabled="isDisabled">
					<el-option v-for="item in approvalTypeOption" :label="item.dictLabel" :value="item.dictValue" :key="item.dictValue"/>
				</el-select>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" icon="el-icon-plus" size="mini" @click="addRow">增加审批步骤</el-button>
			</el-form-item>

			<el-form-item>
				<el-table :data="nodeList">
					<el-table-column label="审批步骤" prop="nodeLevel" width="95px" align="center"/>
					<el-table-column label="审批人/角色" align="center" prop="nodeHandlerName"/>
					<el-table-column label="操作" width="120px" align="center" class-name="small-padding fixed-width">
						<template slot-scope="scope">
							<el-button size="mini" type="text" icon="el-icon-delete" @click="deleteRow(scope.row)">删除</el-button>
							<el-button size="mini" type="text" icon="el-icon-info" @click="selectHandler(scope.row)">选择</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<div style="text-align: center; margin-top: 15px">
				<el-button type="primary" @click="saveNodeList()">确认</el-button>
				<el-button @click="closeDialog()">取消</el-button>
			</div>
		</div>

		<add-approval-handler @refrehData="fillSelectHander" :nodeLevel2Child.sync="nodeLevel2Child" :selectHandlerVisible.sync="selectHandlerVisible"
							  v-if="selectHandlerVisible"></add-approval-handler>
	</el-dialog>
</template>
<script>
	import {nodeList} from '@/api/manageCenter/base/approvalManage/approvalConfig'
	import {addDetail} from '@/api/manageCenter/base/approvalManage/approvalConfigDetail'
	import addApprovalHandler from '@/components/manageCenter/base/approvalManage/AddApprovalHandler'

	export default {
		components: {
			addApprovalHandler,
		},
		data() {
			return {
				isDisabled: true, //true 可以操作审批类型下拉框
				nodeLevel2Child: null,
				//选择人员/角色弹框
				selectHandlerVisible: false,
				//父页面传过来的审批类型  为空是新增入口
				approvalTypeCode: '',
				//审批节点（步骤）表格数据
				nodeList: [],

				//表单查询参数
				queryParams: {
					approvalTypeName: '',
					approvalTypeValue: null,
				},
				title: '',
				approvalTypeValue: undefined,
			}
		},
		props: {
			approvalTypeVisible: {
				type: Boolean,
				default: false,
			},
			approvalTypeOption: {
				type: Array,
			},
			// approvalTypeValue:{//为空时说明是新增入口
			//   type: String,
			//   default: "",
			// }
		},
		methods: {
			closeDialog() {
				this.$emit('closePop', [1])
			},
			//父页面调用传值 新增入口无审批类型
			initApprovalType(val) {
				this.approvalTypeCode = val;
				if (this.approvalTypeCode) {
					//修改时有值并将下拉框更改为不可编辑
					this.isDisabled = true;
					this.title = '修改流程';
					this.getNodeList()
				} else {
					this.isDisabled = false;
					this.title = '新增流程'
				}
			},
			//切换审批类型下拉框
			approvalTypeChange(val) {
				this.getNodeList()
			},
			//保存节点数据
			saveNodeList() {
				if (!this.approvalTypeCode) {
					this.msgError('请选择审批类型');
					return
				}
				if (this.nodeList.length === 0) {
					this.msgError('未添加审批步骤');
					return
				}
				const index = this.nodeList.findIndex(node => !node.nodeHandlerName || !node.nodeHandlerId);
				if (index > -1) {
					this.msgError(`审批步骤${this.nodeList[index].nodeLevel}未选择操作人员或角色`);
					return
				}
				this.nodeList.forEach(node => {
					node.approvalType = this.approvalTypeCode
				});
				//组织提交数据
				addDetail(this.nodeList).then(response => {
					console.log(response);
					this.closeDialog()
				})
			},
			//接收子组件回传的所选name和id并填充至表格
			fillSelectHander(data) {
				this.selectHandlerVisible = false;
				if (!data) {
					return
				}
				let idStr = data[0]; //所选人员/角色id
				let nameStr = data[1]; //所选人员/角色名称
				let nodeLevel = data[2]; //节点步骤
				let nodeHanderType = data[3]; //节点处理人类型  0用户  1角色
				//根据nodeLevel  定位表格行  并填充数据
				this.nodeList.forEach((node, index) => {
					if (node.nodeLevel === nodeLevel) {
						node.nodeHandlerType = nodeHanderType;
						node.nodeHandlerName = nameStr;
						node.nodeHandlerId = idStr
					}
				})
			},
			getNodeList() {
				//按照审批类型获取审批步骤
				if (!this.approvalTypeCode) {
					return;
				}
				let obj = {
					approvalName: '',
				}
				nodeList(this.approvalTypeCode,obj).then(response => {
					if (response.code === 200) {
						let data = response.data;
						this.nodeList = data.list;
					} else {
						console.info(response.msg)
					}
					this.loading = false
				})
			},
			//选择节点处理人
			selectHandler(row) {
				this.nodeLevel2Child = row.nodeLevel;
				this.selectHandlerVisible = true
			},
			//删除审批步骤表格空白行
			deleteRow(row) {
				if (!row) {
					return false;
				}
				//根据nodeLevel 剔除数据
				let tableList = this.nodeList.filter(function (node) {
					return node.nodeLevel !== row.nodeLevel;
				});
				//重新将步骤排序
				tableList.forEach((node, index, array) => {
					node.nodeLevel = index + 1
				});
				this.nodeList = tableList
			},
			//增加审批步骤表格空白行
			addRow() {
				if (!this.approvalTypeCode) {
					this.msgError('请选择审批类型');
					return
				}
				const lastRow = {
					nodeLevel: 1,
					nodeHandlerId: '',
					nodeHandlerType: '',
					nodeHandlerName: '',
				};
				if (this.nodeList.length !== 0) {
					//当表格有数据时取长度+1
					lastRow.nodeLevel = this.nodeList.length + 1 //步骤数
				}
				this.nodeList.push(lastRow)
			},
		},
		computed: {},
		created() {
		},
		mounted() {
		},
		// watch: {
		//   approvalTypeValue: function setApprovalTypeValue(oldVal, newVal) {
		//     if (newVal !== newVal) {
		//       this.getNodeList()
		//     }
		//   }
		// },
	}
</script>
<style>
	.require-css::before {
		content: '* ';
		color: red;
	}
</style>

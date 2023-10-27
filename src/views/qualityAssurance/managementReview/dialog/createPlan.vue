<template>
	<el-dialog
		class="elDialog"
		center
		width="60%"
		:visible.sync="dialogShow"
		:fullscreen="isFullScreen"
		:modal-append-to-body="false"
		:modal="false"
		:show-close="false"
		@open="open"
	>
		<div slot="title" class="dialog-title">
			<span class="topTilte">{{ titles }}</span>
			<div class="topRight">
				<!-- 最小化 -->
				<i
					class="el-icon-minus rightIcon"
					v-if="isFullScreen"
					@click="e_changeBox(false)"
				></i>
				<!-- 最大化 -->
				<i
					class="el-icon-full-screen rightIcon"
					v-if="!isFullScreen"
					@click="e_changeBox(true)"
				></i>
				<!-- 关闭 -->
				<i class="el-icon-close rightIcon" @click="cancelbtn"></i>
			</div>
		</div>
		<el-form
			:model="queryParams"
			ref="queryForm"
			:inline="true"
			:prop="queryParams"
			style="margin: 15px 0 0 0"
			:rules="rules"
			label-width="120px"
		>
			<el-tabs v-model="activeName" type="card">
				<el-tab-pane label="管理评审计划" name="first">
					<el-row>
						<el-col :span="12">
							<el-form-item label="计划编号" prop="serial">
								<el-input
									placeholder="请输入计划编号"
									v-model="queryParams.serial"
									:disabled="isdisable"
								></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="计划年度" prop="year">
								<el-date-picker
									v-model="queryParams.year"
									type="year"
									value-format="yyyy"
									:disabled="isdisable"
									placeholder="选择计划年度"
								>
								</el-date-picker>
							</el-form-item>
						</el-col>

						<el-col :span="12">
							<el-form-item label="编制人员" prop="compilerName">
								<el-input
									placeholder="请选择编制人员"
									v-model="queryParams.compilerName"
									:disabled="isdisable"
									readonly
									@focus="selectUser()"
								></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="编制日期" prop="compilerTime">
								<el-date-picker
									v-model="queryParams.compilerTime"
									value-format="yyyy-MM-dd"
									type="date"
									placeholder="选择日期"
									style="width: 100%"
									:disabled="isdisable"
								></el-date-picker>
							</el-form-item>
						</el-col>

						<el-col :span="12">
							<el-form-item label="评审地点" prop="location">
								<el-input
									placeholder="请输入评审地点"
									v-model="queryParams.location"
									:disabled="isdisable"
								></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="24">
							<el-form-item label="评审时间安排" prop="reviewTime">
								<!--                <el-date-picker
												  v-model="queryParams.reviewTime"
												  value-format="yyyy-MM-dd HH:mm:ss"
												  type="datetime"
												  placeholder="选择日期"
												  style="width: 100%"
												  :disabled="isdisable"
												></el-date-picker>-->
								<el-input
									placeholder="请输入评审时间安排"
									v-model="queryParams.reviewTime"
									:disabled="isdisable"
									type="textarea"
									autosize
								></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="评审目的" prop="purpose">
								<el-input
									type="textarea"
									autosize
									placeholder="请输入内容"
									v-model="queryParams.purpose"
									:disabled="isdisable"
								></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="评审依据" prop="basis">
								<el-input
									type="textarea"
									:rows="2"
									autosize
									placeholder="请输入内容"
									v-model="queryParams.basis"
									:disabled="isdisable"
								></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="22">
							<el-form-item label="参加评审部门及人员" prop="planPersonList">
								<el-input
									placeholder="请选择参加评审部门及人员"
									v-model="planPersonName"
									disabled
								></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="1" style="padding-left: 25px">
							<el-button @click="selectOrgan()" type="primary" :disabled="isdisable">选择</el-button>
						</el-col>
						<el-col :span="24">
							<el-form-item label="评审内容" prop="content">
								<el-input
									type="textarea"
									:rows="2"
									autosize
									placeholder="请输入内容"
									v-model="queryParams.content"
									:disabled="isdisable"
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-tab-pane>
				<el-tab-pane label="审批流程" name="second">
					<approvalProcess :approvalProcess="approvalProcess"></approvalProcess>
				</el-tab-pane>
			</el-tabs>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button
				type="success"
				@click="handleSave(2)"
				v-if="showType !== 'show'"
			>提交
			</el-button
			>
			<el-button
				type="primary"
				@click="handleSave(1)"
				v-if="showType !== 'show'"
			>保存
			</el-button
			>
			<el-button @click="cancelbtn">取消</el-button>
		</div>
		<treeTransfer
			v-if="showTransfer"
			ref="transfer"
			@close="showTransfer = false"
			@handleData="handleData"
		></treeTransfer>
		<roleTreeTransfer
			v-if="showRoleTransfer"
			ref="roleTransfer"
			@close="showRoleTransfer = false"
			@roleHandleData="roleHandleData"
		></roleTreeTransfer>
	</el-dialog>
</template>

<script>
	import { choiceUser, roleChoiceUser, getApprovalProcess } from '@/api/qualityAssurance/index'
	import treeTransfer from '../../common/treeTransfer'
	import roleTreeTransfer from '../../common/roleTreeTransfer'
	import approvalProcess from '@/components/approvalProcess/index'

	import {
		addPlan,
		editPlan
	} from '@/api/qualityAssurance/managementReview/auditPlan'

	export default {
		name: 'createPlan',
		components: { treeTransfer, approvalProcess, roleTreeTransfer },
		data() {
			return {
				showTransfer: false,
				showRoleTransfer: false,
				dialogShow: false,
				isFullScreen: true,
				screenName: 'fullScreen',
				titles: '新增',
				showType: 'add',
				activeName: 'first',
				queryParams: {
					serial: '',
					year: '',
					// compilerId: "",
					compilerName: '',
					compilerTime: '',
					reviewTime: '',
					purpose: '',
					basis: '',
					location: '',
					content: ''
				},
				rules: {
					serial: [
						{ required: true, message: '请输入计划编号', trigger: 'blur' }
					],
					year: [{ required: true, message: '请选择计划年度', trigger: 'blur' }],
					compilerName: [
						{ required: true, message: '请选择编制人员', trigger: 'change' }
					],
					compilerTime: [
						{ required: true, message: '请选择编制日期', trigger: 'blur' }
					],
					reviewTime: [
						{ required: true, message: '请选择评审时间安排', trigger: 'blur' }
					],
					location: [
						{ required: true, message: '请输入评审地点', trigger: 'blur' }
					],
					purpose: [
						{ required: true, message: '请输入评审目的', trigger: 'blur' }
					],
					basis: [{ required: true, message: '请输入评审依据', trigger: 'blur' }]
				},
				isdisable: false,
				auditMode: [],
				modeList: [
					{ value: '1', label: '抽样检查有关资料、记录', ischecked: false },
					{ value: '2', label: '现场检测', ischecked: false }
				],
				loading: false,
				personalData: [],
				schedulelData: [],
				selectHandlerVisible: true,
				planPersonList: [],
				planPersonName: '',
				approvalProcess: {},
				selectType: 2
			}
		},
		computed: {
			getLeftWidth() {
				return this.$store.state.app.leftWidth
			}
		},
		watch: {
			getLeftWidth() {
				let width = this.$store.state.app.leftWidth
				if (width < 200) {
					this.screenName = 'bigFullScreen'
				} else {
					this.screenName = 'fullScreen'
				}
			},
			showType(val) {
				if (val == 'add') {
					this.titles = '新增'
				} else if (val == 'update') {
					this.titles = '修改'
				} else if (val == 'show') {
					this.titles = '查看'
					this.isdisable = true
				}
			}
		},
		methods: {
			// 获取审批流程
			getProcess() {
				const params = {
					businessType: 'QUALITY_REVIEW_PLAN',
					businessId: this.queryParams.id,
					businessStatus: this.queryParams.status
				}
				getApprovalProcess(params).then((res) => {
					this.approvalProcess = res
				})
			},
			// 选择人员
			selectOrgan(type) {
				this.selectType = 2
				this.showRoleTransfer = true
				var data = []
				console.log('this.planPersonList', this.planPersonList)
				for (var i in this.planPersonList) {
					data.push(`${this.planPersonList[i].userPostId}-${this.planPersonList[i].userId}`)
				}
				console.log('data', data)
				roleChoiceUser().then((res) => {
					this.$nextTick(() => {
						this.$refs.roleTransfer.init(res.data, data)
					})
				})
			},
			selectUser() {
				this.selectType = 1
				this.showTransfer = true
				choiceUser().then((res) => {
					this.$nextTick(() => {
						this.$refs.transfer.init(res.data, this.queryParams.compilerName, 'radio')
					})
				})
			},
			//选择人员
			handleData(data) {
				console.log(data)
				if (this.selectType == 1) {
					this.queryParams.compilerName = data[0].label
				} else {
					this.planPersonList = []
					this.planPersonName = ''
					for (var i in data) {
						this.planPersonList.push({
							userId: data[i].id,
							userName: data[i].label
						})
						this.planPersonName += data[i].label + (i < data.length - 1 ? '，' : '')
					}
				}
				// console.log(this.planPersonList);
			},
			roleHandleData(data) {
				console.log('data', data)
				// return
				let nameArr = []
				data.map((item) => {
					nameArr.push(item)
				})
				nameArr = this.repeat(nameArr)
				console.log('this.planPersonName', this.planPersonName)
				if (this.selectType == 1) {
					this.queryParams.compilerName = data[0].userDeptName
				} else {
					this.planPersonList = []
					this.planPersonName = ''

					for (var i in data) {
						this.planPersonList.push({
							userId: data[i].userId,
							userName: data[i].nickName,
							userPostId: data[i].userDeptId,
							userPostName: data[i].userDeptName
						})
					}
					for (var i in nameArr) {
						this.planPersonName += nameArr[i].userDeptName + (i < nameArr.length - 1 ? '，' : '')
					}
				}
				console.log(this.planPersonList)
			},
			//去重参加部门及人员
			repeat(data) {
				// console.log('data',data)
				for (let i = 0; i < data.length - 1; i++) {
					for (let j = 1; j < data.length; j++) {
						if (i != j) {
							if (data[i].userDeptId == data[j].userDeptId) {
								data.splice(j, 1)
								j--
							}
						}
					}
				}
				return data
			},
			init(show, data) {
				this.showType = show
				this.dialogShow = true
				if (data) {
					console.log(data)
					this.queryParams = {
						id: data.id,
						serial: data.serial,
						year: data.year ? data.year : '',
						compilerId: data.compilerId,
						compilerName: data.compilerName,
						compilerTime: data.compilerTime,
						reviewTime: data.reviewTime,
						purpose: data.purpose,
						basis: data.basis,
						location: data.location,
						content: data.content,
						status: data.status
					}
					this.getProcess()
					this.planPersonList = data.planPersonList
					console.log('data.planPersonList', data.planPersonList)
					this.planPersonName = ''
					let nameArr = []
					data.planPersonList.map((item) => {
						nameArr.push(item)
					})
					nameArr = this.repeat1(nameArr)
					console.log('nameArr', nameArr)
					for (var i in nameArr) {
						this.planPersonName +=
							nameArr[i].userPostName +
							(i < nameArr.length - 1 ? '，' : '')
					}
				}
			},
			//去重参加部门及人员
			repeat1(data) {
				for (let i = 0; i < data.length - 1; i++) {
					for (let j = 1; j < data.length; j++) {
						if (i != j) {
							if (data[i].userPostId == data[j].userPostId) {
								data.splice(j, 1)
								j--
							}
						}
					}
				}
				return data
			},
			open() {
			},
			e_changeBox(type) {
				this.isFullScreen = type
			},
			cancelbtn() {
				this.$emit('close')
			},
			handleSave(status) {
				this.$refs.queryForm.validate((valid) => {
					if (valid) {
						this.queryParams.status = status
						this.queryParams.planPersonList = this.planPersonList
						this.queryParams.compilerTime = this.queryParams.compilerTime
						this.queryParams.reviewTime = this.queryParams.reviewTime
						if (this.queryParams.planPersonList.length === 0) {
							this.$message.error('请至少选择一条参加评审部门及人员信息，完善表格数据')
							return
						}
						if (this.showType == 'add') {
							addPlan(this.queryParams).then((res) => {
								this.$message.success('新增成功')
								this.$emit('complete')
							})
						} else {
							console.log(this.queryParams)
							editPlan(this.queryParams).then((res) => {
								this.$message.success('修改成功')
								this.$emit('complete')
							})
						}
					}
				})
			}
		}
	}
</script>

<style scoped lang="less">
	/deep/ .el-dialog__body .el-col {
		margin-bottom: 0;
	}

	.tabtit {
		display: flex;
		justify-content: space-between;
		align-content: center;

		span {
			font-size: 14px;
			color: #3c4353;
			font-weight: bold;
		}
	}

	/deep/ .el-dialog__body .el-table {
		background-color: #fff;
	}

	/deep/ textarea {
		min-height: 50px !important;
	}
</style>

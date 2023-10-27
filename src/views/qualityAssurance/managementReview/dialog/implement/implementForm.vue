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
		@open="open">
		<div slot="title" class="dialog-title">
			<span class="topTilte">{{titles}}</span>
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
			<el-row>
				<el-col :span="12">
					<el-form-item label="实施计划编号" prop="serial">
						<el-input placeholder="请输入实施计划编号" v-model="queryParams.serial" :disabled="isdisable"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="管评计划编号" prop="planSerial">
						<el-input placeholder="请输入管评计划编号" v-model="queryParams.planSerial" disabled></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="编制人员" prop="compilerName">
						<el-input placeholder="请输入编制人员" v-model="queryParams.compilerName"
								  :disabled="isdisable"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="编制日期" prop="compilerTime">
						<el-date-picker v-model="queryParams.compilerTime" value-format="yyyy-MM-dd"
										type="date" placeholder="选择日期" style="width:100%"
										:disabled="isdisable"></el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="目的" prop="purpose">
						<el-input placeholder="请输入目的" v-model="queryParams.purpose" :disabled="isdisable"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="会议地点" prop="location">
						<el-input placeholder="请输入会议地点" v-model="queryParams.location" :disabled="isdisable"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24">
					<el-form-item label="时间安排" prop="reviewTime">
						<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.reviewTime"
								  :disabled="isdisable"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="22">
					<el-form-item label="参与人员" prop="personList">
						<el-input placeholder="请选择参与人员" v-model="personName" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="1" style="padding-left: 25px">
					<el-button type="primary" @click="selectOrgan()" :disabled="isdisable">选择</el-button>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24">
					<el-form-item label="所需文件" prop="documentsRequired">
						<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.documentsRequired"
								  :disabled="isdisable"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24">
					<span class="checkboxs">评审内容（勾选）</span>
				</el-col>
			</el-row>
			<el-row style="padding: 10px 0 0 20px">
				<el-col :span="4">
					<el-checkbox-group v-model="queryParams.content" :disabled="isdisable">
						<el-checkbox v-for="(item, index) in review" :key="index" :label="item.label"
									 name="type"></el-checkbox>
					</el-checkbox-group>
				</el-col>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" v-if="showType !== 'show'" @click="save()">保存</el-button>
			<el-button @click="cancelbtn">取消</el-button>
		</div>
		<treeTransfer v-if="showTransfer" ref="transfer" @close="showTransfer = false"
					  @handleData="handleData"></treeTransfer>
	</el-dialog>

</template>

<script>
import {choiceUser} from "@/api/qualityAssurance/index";
import treeTransfer from "../../../common/treeTransfer"
import {addImplement, editImplement} from "@/api/qualityAssurance/managementReview/auditImplement"

export default {
	name: "implementForm",
	components: {treeTransfer},
	data() {
		return {
			showTransfer: false,
			dialogShow: false,
			isFullScreen: true,
			screenName: "fullScreen",
			titles: '添加',
			showType: 'add',
			queryParams: {
				serial: "",
				planSerial: "",
				compilerName: "",
				compilerTime: "",
				purpose: "",
				location: "",
				reviewTime: "",
				personList: "",
				documentsRequired: "",
				content: [],
				personList:[],
			},
			personName: "",
			rules: {
				serial: [{required: true, trigger: "blur", message: "请输入实施计划编号"}],
				compilerName: [{required: true, trigger: "blur", message: "请输入编制人员"}],
				compilerTime: [{required: true, trigger: "blur", message: "请选择编制日期"}],
				purpose: [{required: true, trigger: "blur", message: "请输入目的"}],
				location: [{required: true, trigger: "blur", message: "请输入会议地点"}],
			},
			isdisable: false,
			listData: [],
			review: [
				{label: '(1) 检验检测机构相关的内外部因素变化'},
				{label: '(2) 目标的可行性'},
				{label: '(3) 政策和程序的适用性'},
				{label: '(4) 以往管理评审所采取措施的情况'},
				{label: '(5) 近期内部审核的结果；'},
				{label: '(6) 纠正措施'},
				{label: '(7) 由外部机构进行的评审'},
				{label: '(8) 工作量和工作类型的变化或检验检测机构活动范围的变化'},
				{label: '(9) 客户和员工的反馈'},
				{label: '(10) 投诉'},
				{label: '(11) 实施改进和有效性'},
				{label: '(12) 资源配备的合理性'},
				{label: '(13) 风险识别的可控性'},
				{label: '(14) 其他相关因素，如监督活动和培训'},
			]
		}
	},
	computed: {
		getLeftWidth() {
			return this.$store.state.app.leftWidth;
		}
	},
	watch: {
		getLeftWidth() {
			let width = this.$store.state.app.leftWidth;
			if (width < 200) {
				this.screenName = "bigFullScreen";
			} else {
				this.screenName = "fullScreen";
			}
		},
		showType(val) {
			if (val == "add") {
				this.titles = "添加";
			} else if (val == "edit") {
				this.titles = "修改";
			} else if (val == "show") {
				this.titles = "查看";
				this.isdisable = true
			}
		},
	},
	methods: {
		// 选择人员
		selectOrgan() {
			this.showTransfer = true;
			var data = [];
			for (var i in this.queryParams.personList) {
				data.push(this.queryParams.personList[i].userId)
			}
			choiceUser().then((res) => {
				this.$nextTick(() => {
					this.$refs.transfer.init(res.data, data);
				})
			})
		},
		//选择人员
		handleData(data) {
			this.queryParams.personList = [];
			this.personName = "";
			for (var i in data) {
				this.queryParams.personList.push({
					userId: data[i].id,
					userName: data[i].label
				})
			}
			/* 去重 */
			this.queryParams.personList = this.array_uniq(this.queryParams.personList)
			for (var i in this.queryParams.personList) {
				this.personName += this.queryParams.personList[i].userName + (i < data.length - 1 ? '，' : '')
			}
		},
		array_uniq(input_arr) {
			var h = {};
			var arr = [];
			for (var i = 0; i < input_arr.length; i++) {
				if (!h[JSON.stringify(input_arr[i])]) {
					h[JSON.stringify(input_arr[i])] = true;
					arr.push(input_arr[i]);
				}
			}
			return arr;
		},
		init(show, data) {
			this.showType = show
			this.dialogShow = true
			if (this.showType == "add") {
				this.queryParams.planSerial = data.planSerial;
				this.queryParams.planId = data.planId;
				console.log(data)
			} else {
				this.queryParams.planSerial = data.planSerial;
				this.queryParams.planId = data.planId;
				this.queryParams.serial = data.serial;
				this.queryParams.compilerName = data.compilerName;
				this.queryParams.compilerTime = data.compilerTime;
				this.queryParams.purpose = data.purpose;
				this.queryParams.location = data.location;
				this.queryParams.reviewTime = data.reviewTime;
				this.queryParams.personList = data.personList;
				this.queryParams.documentsRequired = data.documentsRequired;
				this.queryParams.content = data.content.split(';');
				this.queryParams.id = data.id;

				this.personName = "";
				for (var i in data.personList) {
					this.personName += data.personList[i].userName + (i < data.personList.length - 1 ? '，' : '')
				}
			}
		},
		open() {
		},
		e_changeBox(type) {
			this.isFullScreen = type;
		},
		cancelbtn() {
			this.$emit('close')
		},
		save() {
			this.$refs.queryForm.validate((valid) => {
				if (valid) {
					this.queryParams.content = this.queryParams.content.join(';')
					if (this.showType == "add") {
						addImplement(this.queryParams).then(res => {
							this.$message.success("新增成功");
							this.$emit("complete")
						})
					} else {
						editImplement(this.queryParams).then(res => {
							this.$message.success("修改成功")
							this.$emit("complete")
						})
					}
				}
			})
		}
	}
}
</script>

<style scoped lang="less">
.tabtit {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;

	span {
		font-size: 14px;
		color: #3C4353;
		font-weight: bold;
	}
}

.checkboxs {
	font-size: 14px;
	color: #000F1D;
	font-weight: bold;
}

/deep/ .el-checkbox {
	color: #3C4353;
	line-height: 30px;
}
</style>

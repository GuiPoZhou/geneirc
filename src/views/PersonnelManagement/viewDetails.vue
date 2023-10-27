<template>
	<el-dialog :title="title" :visible.sync="viewShow" center :show-close="true"
			   :close-on-press-escape="false" :close-on-click-modal="false" @close="close">
		<el-form :model="personnelParam"  ref="saveForm" :inline="true" label-width="100px">
			<el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true">
				<el-tab-pane label="基本信息" name="first">
					<div>
						<el-form-item label="员工工号" prop="staffCode">
							<el-input v-model="personnelParam.staffCode" size="large" :disabled="true" />
						</el-form-item>
						<el-form-item label="员工姓名" prop="staffName">
							<el-input v-model="personnelParam.staffName" size="large" :disabled="true" />
						</el-form-item>
						<el-form-item label="员工性别" prop="staffSex">
							<el-select v-model="personnelParam.staffEducation" style="width: 180px" :disabled="true" >
								<el-option label="男" :value="0"></el-option>
								<el-option label="女" :value="1"></el-option>
							</el-select>
						</el-form-item>
					</div>
					<div class="input-size">
						<el-form-item label="身份证号" prop="idCard">
							<el-input v-model="personnelParam.idCard" size="large" :disabled="true" />
						</el-form-item>
						<el-form-item label="所属部门" prop="departmentName">
							<el-input v-model="personnelParam.departmentName" size="large" :disabled="true" />
						</el-form-item>
						<el-form-item label="职务岗位" prop="positionName">
							<el-input v-model="personnelParam.positionName" size="large" :disabled="true" />
						</el-form-item>
					</div>
					<div class="input-size">
						<el-form-item label="员工学历" prop="staffEducation">
							<el-select v-model="personnelParam.staffEducation" style="width: 180px" :disabled="true"  >
								<el-option label="硕士" :value="0"></el-option>
								<el-option label="本科" :value="1"></el-option>
								<el-option label="专科" :value="2"></el-option>
								<el-option label="博士" :value="3"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="所学专业" prop="professional">
							<el-input v-model="personnelParam.professional" size="large" :disabled="true" />
						</el-form-item>
						<el-form-item label="员工状态" prop="status">
							<el-select v-model="personnelParam.status" style="width: 100%" :disabled="true"  >
								<el-option label="在职" :value="0"></el-option>
								<el-option label="离职" :value="1"></el-option>
							</el-select>
						</el-form-item>
					</div>
					<div class="input-size">
						<el-form-item label="入职时间" prop="entryTime">
							<el-date-picker
								style="width: 180px"
								v-model="personnelParam.entryTime"
								type="date"
								placeholder="选择日期" :disabled="true" >
							</el-date-picker>
						</el-form-item>
						<el-form-item label="离职时间" prop="departureTime">
							<el-date-picker
								style="width: 180px"
								v-model="personnelParam.departureTime"
								type="date"
								placeholder="选择日期" :disabled="true" >
							</el-date-picker>
						</el-form-item>
						<el-form-item label="关联用户账号" prop="userName">
							<el-input v-model="personnelParam.userName" size="large" :disabled="true" />
						</el-form-item>
					</div>

				</el-tab-pane>

				<el-tab-pane label="上岗证信息" name="second">
					<div class="input-size">
						<el-form-item label="上岗证类型" prop="workLicenseType">
							<el-select v-model="personnelParam.workLicenseType" style="width: 100%" @change="handleClickchild($event)">
								<el-option label="采样证" :value="0" ></el-option>
								<el-option label="检测证" :value="1"></el-option>
							</el-select>
						</el-form-item>
					</div>
					<el-tabs v-model="activeNameSon" @tab-click="handleClickSon" :stretch="true">
						<el-tab-pane label="采样证" name="first">
							<el-table v-loading="loading" :data="sampleTableData" align="center" >
								<el-table-column prop="id" type="index" label="序号" width="55px" />
								<el-table-column prop="detectName" label="检测类别名称" align="center" :show-overflow-tooltip="true"/>
								<el-table-column prop="parentName" label="上级类别名称" align="center" :show-overflow-tooltip="true"/>
							</el-table>
						</el-tab-pane>
						<el-tab-pane label="检测证" name="second">
							<el-table v-loading="loading" :data="detectionTableData" align="center" >
								<el-table-column prop="id" type="index" label="序号" width="55px" />
								<el-table-column prop="detectName" label="检测类别名称" align="center" :show-overflow-tooltip="true"/>
								<el-table-column prop="itemName" label="检测项目名称" align="center" :show-overflow-tooltip="true"/>
								<el-table-column prop="methodCode" label="检测方法编号" align="center" :show-overflow-tooltip="true"/>
								<el-table-column prop="methodName" label="检测方法名称" align="center" :show-overflow-tooltip="true"/>
							</el-table>

						</el-tab-pane>
					</el-tabs>
				</el-tab-pane>
			</el-tabs>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="close">取消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import {
		getPersonnel,getWorkLicenseList
	} from "@/api/personnel/personnel";
  export default {
    name: 'viewDetails',
	  data() {
		  return {
			  activeName: "first",
			  activeNameSon: "first",
			  loading: false,

			  // 采样证表格数据
			  sampleTableData: [],
			  // 检测证表格数据
			  detectionTableData: [],
			  personnelParam: {
				  id:null,
				  staffCode: null,
				  staffName: null,
				  staffSex: null,
				  idCard: null,
				  departmentId: null,
				  departmentName: null,
				  positionId:null,
				  positionName:null,
				  staffEducation:null,
				  professional:null,
				  status:null,
				  entryTime:null,
				  departureTime:null,
				  userId:null,
				  userName:null,
				  workLicenseType:null,
				  workLicenseTypeSample:null,
				  workLicenseTypeDetection:null,
				  samplingList:null,
				  detectionList:null,
			  }
		  };
	  },
	  props: {
		  viewShow: {
			  type: Boolean,
			  default: false
		  },
		  title:{
			  type: String,
			  default: '',
		  }
	  },
	  methods: {
		  viewInIt(id){
			  this.activeName = "first";
			  this.activeNameSon = "first";

			  getPersonnel(id).then(response => {
				  this.personnelParam = response.data;
			  });

			  this.personnelParam.id = id
			  getWorkLicenseList(this.personnelParam).then(response => {
			  	console.log('this.sampleTableData',this.sampleTableData)
				  console.log('this.detectionTableData',this.detectionTableData)
				  this.sampleTableData = response.data.sampleList;
				  this.detectionTableData = response.data.detectionList
			  });


		  },
		  handleClick(tab, event) {
			  console.log(tab, event);
			  if (this.activeName === "second"){
				  this.personnelParam.workLicenseType = 0;
				  this.activeNameSon = "first";
			  }
		  },
		  handleClickchild(e){
			  this.personnelParam.workLicenseType = e
			  if (this.personnelParam.workLicenseType == 0) {
				  this.activeNameSon = 'first'
			  } else if (this.personnelParam.workLicenseType == 1) {
				  this.activeNameSon = 'second'
			  }
		  },
		  handleClickSon(tab, event) {
			  if (this.activeNameSon === "first"){
				  this.personnelParam.workLicenseType = 0;
			  } else if (this.activeNameSon === "second"){
				  this.personnelParam.workLicenseType = 1;
			  }
			  console.log(tab, event);
		  },
		  //取消按钮操作
		  close() {
			  this.$emit('update:viewShow', false)
		  },

	  },
  }
</script>

<style scoped>

</style>

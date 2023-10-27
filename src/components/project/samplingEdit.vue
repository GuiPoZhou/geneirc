<template>
	<div class="groupEdit">
		<el-dialog
			title="修改采样项目分组"
			:visible.sync="editShow"
			center
			:close-on-click-modal="false"
			@open="open"
		>
			<el-form
				:model="editParams"
				:rules="rules"
				ref="checkForm"
				:inline="true"
				label-width="88px"
			>
				<el-form-item label="分组名称" prop="groupName">
					<el-input
						v-model="editParams.groupName"
						clearable
						size="small"
					/>
				</el-form-item>
				<el-form-item label="检测类别" prop="detectCategoryName">
					<a-input-search
						v-model="editParams.detectCategoryName"
						style="width: 200px"
						placeholder="选择类别名称"
						disabled
						@search="cateShow = true"
					/>
				</el-form-item>
				<el-form-item label="项目名称" prop="itemNameCn">
					<a-input-search
						v-model="editParams.itemNameCn"
						style="width: 200px"
						@search="e_showProject"
						placeholder="选择项目"
					/>
				</el-form-item>
				<!-- 储存条件 -->
				<el-form-item label="储存条件" prop="storageDataUpdata">
					<a-select
						style="width:200px"
						:options="storageData"
						:getPopupContainer="getPopupContainer"
						v-model="storageDataUpdata"
						mode="multiple"
						:labelInValue="true"
					/>
				</el-form-item>
				<!-- 保存剂 -->
				<el-form-item label="保存剂" prop="preservativeDataUpdata">
					<a-select
						style="width:200px"
						:options="preservativeData"
						:getPopupContainer="getPopupContainer"
						v-model="preservativeDataUpdata"
						mode="multiple"
						:labelInValue="true"
					/>
				</el-form-item>
			</el-form>
			<!-- 表格 -->
			<p>包含项目</p>
			<el-table height="400" v-loading="loading" :data="tableData" align="center">
				<el-table-column
					prop="id"
					type="index"
					label="序号"
					width="62px"
				/>
				<el-table-column prop="itemNameCn" label="项目名称" :show-overflow-tooltip="true" />
				<el-table-column prop="isScene" label="现场检测">
					<template slot-scope="scope">
						<el-switch
							active-color="#5B7BFA"
							inactive-color="#dadde5"
							v-model="scope.row.isScene"
							:active-value="true"
							:inactive-value="false"
							disabled
						>
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column prop="stroma" label="基质" />
				<el-table-column prop="methodCode" label="方法编号" />
				<el-table-column prop="childMethodName" label="子法名称" />
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button
							slot="reference"
							size="mini"
							type="text"
							icon="el-icon-delete"
							@click="handleDelete(scope.row, scope)"
							>删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm('checkForm')" center
					>保存</el-button
				>
				<el-button @click="close">取消</el-button>
			</div>
		</el-dialog>
		<selectDetectName
			:visible.sync="cateShow"
			@handleParentName="changeDetectName"
		/>
		<selectProject
			:visible.sync="projectShow"
			@handleItemName="getTableData"
		/>
	</div>
</template>
<script>
// import "@/views/core/components_use";
// import 'ant-design-vue/dist/antd.css';
import {
	editSamplingList,
	getDictionaryData
} from "@/api/standardManagement/config";
import selectDetectName from "./selectDetectName";
import selectProject from "./selectProject";

export default {
	components: {
		selectDetectName,
		selectProject
	},
	data() {
		return {
			// 采样项目分组表单数据
			groupParams: {
				groupName: null,
				detectCategoryName: null,
				detectCategory: null, //这是id
				detailList: [],
				preservativeList: [],
				storageList: []
			},
			rules: {
				groupName: [
					{
						required: true,
						message: "请输入分组名称",
						trigger: "blur"
					}
				],
				detectCategoryName: [
					{
						required: true,
						message: "请输入检测类别",
						trigger: "blur"
					}
				],
				// itemNameCn: [
				// 	{
				// 		required: true,
				// 		message: "请输入项目名称",
				// 		trigger: "blur"
				// 	}
				// ],
				preservativeDataUpdata: [
					{ required: true, message: "请输入保存剂", trigger: "blur" }
				],

				storageDataUpdata: [
					{
						required: true,
						message: "请输入存储条件",
						trigger: "blur"
					}
				]
			},
			//保存剂数据
			preservativeData: [],
			//输入框里面选择的保存剂&&回显
			preservativeDataUpdata: [],
			//存储条件数据
			storageData: [],
			//输入框里面选择的存储条件&&回显
			storageDataUpdata: [],

			cateShow: false,
			projectShow: false,
			//表格数据
			tableData: [],
			//去重之后的表格数据
			newTableData: [],
			//这里需要回头看
			loading: false,
			preservative: "preservative",
			storage: "storage"
		};
	},
	props: {
		editShow: {
			type: Boolean,
			default: false
		},
		//从上一页带过来的所有数据
		editParams: {
			type: Object
		},
		editIds: {
			type: Number
		}
	},
	methods: {
		/*
		 *@author: 焦政
		 *@date: 2021-02-05 14:43:04
		 *@description: 选择检测项目
		 */
		e_showProject() {
			this.$store.commit("set_isadd", false);
			this.$store.commit("set_groupId", this.editIds);
			this.projectShow = true;
		},
		//取消按钮操作1
		close() {
			this.$emit("update:editShow", false);
			//在关闭之前需要把以下数据清空
			this.preservativeDataUpdata = [];
			this.storageDataUpdata = [];
			//在关闭之前将项目分组列表的数据清空
			this.tableData = [];
			this.groupParams = {
				groupName: null,
				detectCategoryName: null,
				detectCategory: null, //这是id
				detailList: [],
				preservativeList: [],
				storageList: []
			};
		},
		//处理数据，因为上一页传递过来的数据格式不能正常在文本框中显示
		updateData() {
			// this.groupParams = JSON.parse(JSON.stringify(this.editParams))
			if (this.editParams.preservativeList) {
				this.editParams.preservativeList.map(item => {
					this.preservativeDataUpdata.push({
						key: item.preservative,
						label: item.preservativeLabel
					});
				});
			}
			if (this.editParams.storageList) {
				this.editParams.storageList.map(item => {
					this.storageDataUpdata.push({
						key: item.storage,
						label: item.storageLabel
					});
				});
			}
			this.editParams.storageDataUpdata = this.storageDataUpdata;
			this.editParams.preservativeDataUpdata = this.preservativeDataUpdata;
		},
		open() {
			//处理回填的字典数据
			this.updateData();
			//将回显的表格数据放在tabledata里面
			this.tableData = this.tableData.concat(this.editParams.detailList);
			console.log("现在是回显的表格数据tableData", this.tableData);
		},
		//保存接口操作
		submitForm(formName) {
			console.log("preservativeDataUpdata", this.preservativeDataUpdata);
			console.log("storageDataUpdata", this.storageDataUpdata);

			if(this.tableData.some(item=>item.isScene)&&this.tableData.some(item=>!item.isScene)){
				this.$message.error("不能同时包含现场和非现场的项目！");
				return false;
			}

			this.$refs[formName].validate(valid => {
				if (valid) {
					if (this.tableData.length == 0) {
						this.$message.error('请选择检测项目')
						return
					}
					this.preservativeDataUpdata.map(item => {
						this.groupParams.preservativeList.push({
							preservative: item.key,
							preservativeLabel: item.label
						});
					});
					this.storageDataUpdata.map(item => {
						this.groupParams.storageList.push({
							storage: item.key,
							storageLabel: item.label
						});
					});
					this.tableData.map(item => {
						this.groupParams.detailList.push({
							itemMethod: item.id
						});
					});
					this.groupParams.groupName = this.editParams.groupName;
					this.groupParams.detectCategoryName = this.editParams.detectCategoryName;
					this.groupParams.detectCategory = this.editParams.detectCategory;




					editSamplingList(this.groupParams, this.editIds)
						.then(() => {
							//触发父组件传递过来的函数getTablelist()
							this.$emit("func", null);
							this.$message.success("保存成功");
							this.close();
						})
						.catch(function() {});
				}
			})

		},
		//这个是下拉选择用到的
		getPopupContainer(triggerNode) {
			return triggerNode.parentNode;
		},
		//获取字典数据中的保存剂1
		getPreservative() {
			console.log("保存剂===>", this.preservative);
			getDictionaryData({ dictType: "preservative" }).then(response => {
				const temp = response.data;
				temp.map(item => {
					this.preservativeData.push({
						value: item.dictCode,
						label: item.dictLabel
					});
				});
				console.log("请求过来的保存剂数据===>", this.preservativeData);
			});
		},
		//获取字典数据中的存储条件1
		getStorage() {
			console.log("存储条件===>", this.storage);
			getDictionaryData({ dictType: "storage" }).then(response => {
				const temp = response.data;
				temp.map(item => {
					this.storageData.push({
						value: item.dictCode,
						label: item.dictLabel
					});
				});
				console.log("请求过来的存储条件===>", this.storageData);
			});
		},
		//val是子组件选择检测类别传递过来的数据1
		changeDetectName(val) {
			console.log("子组件传递过来的数据==>", val);
			this.groupParams.detectCategoryName = val.selectDetectName;
			this.groupParams.detectCategory = val.id;
		},
		//val是子组件选择项目传递过来的数据1
		getTableData(val) {
			console.log("子组件选择项目传递过来的数据==>", val);
			this.tableData.forEach(item => {
				val.checkData.forEach((ele, i) => {
					// 比较this.tableData和val.checkData，如果this.tableData里面的数据val.checkData中已经存在了，就删除
					if (item.id == ele.id) {
						console.log(ele);
						val.checkData.splice(i, 1);
					}
				});
			});
			this.tableData = this.tableData.concat(val.checkData);
			console.log("去重后的数据=>", this.tableData);
		},
		//删除按钮操作1
		handleDelete(row, scope) {
			console.log("要删除的行数据==>", row);
			console.log(scope.$index);
			const index = scope.$index;
			const itemNameCn = row.itemNameCn;
			const groupId = row.id;
			this.$confirm('确定要删除"' + itemNameCn + '"项目？', "警告", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			})
				.then(() => {
					console.log(this.tableData);
					this.tableData.splice(index, 1);
					this.groupParams.detailList.splice(index, 1);
					this.$message.success("删除成功");
				})
				.catch(function() {});
		}
	},
	computed: {},
	created() {
		//获取保存剂数据
		this.getPreservative();
		//获取存储条件数据
		this.getStorage();
	},
	mounted() {}
};
</script>
<style lang="less">
.groupAdd {
	ul,
	li {
		list-style: none;
		padding: 0;
	}
}
.searchParentName {
	display: flex;
}
</style>

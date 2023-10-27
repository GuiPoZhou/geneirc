<template>
	<div class="customProject">
		<el-row v-if="isShow">
			<el-col :span="4">
				检测信息
			</el-col>
			<el-col :span="16">
				<el-button
					type="primary"
					icon="el-icon-plus"
					size="mini"
					@click="handleAdd"
					style="width:100%"
					:disabled="extendedProperties.formShowType === 1 "
					>新增检测计划
				</el-button>
			</el-col>
		</el-row>
		<div class="container">
			<el-collapse accordion v-model="active">
				<el-collapse-item
					v-for="(item, itemIndex) in envDetectInfoPick"
					:name="itemIndex"
					class="coll"
				>
					<template slot="title">
						<div
							class="contain"
							:style="
								extendedProperties.isEntrust && {
									'justify-content': 'flex-end'
								}
							"
						>
							<div
								@click.stop="noScript"
								v-if="!extendedProperties.isEntrust"
							>
								<span>{{
									`${itemIndex + 1}、计划执行日期：`
								}}</span>
								<el-date-picker
									v-model="item.planDate"
									align="right"
									type="date"
									:disabled="
										extendedProperties.formShowType === 1
									"
									placeholder="请选择日期"
									format="yyyy-MM-dd"
									@change="handleSelectPlanDate(item, $event)"
								>
								</el-date-picker>
							</div>
							<div
								class="btnGroups"
								v-if="extendedProperties.formShowType === 0"
							>
								<el-button
									type="primary"
									size="mini"
									plain
									@click.stop="addMess(item, itemIndex)"
									>新增检测信息</el-button
								>
								<el-button
									type="primary"
									size="mini"
									plain
									@click.stop="copyMess(itemIndex)"
									v-if="!extendedProperties.isEntrust"
									>复制计划</el-button
								>
								<el-button
									type="danger"
									icon="el-icon-delete"
									circle
									@click.stop="delMess(itemIndex)"
									v-if="!extendedProperties.isEntrust"
								></el-button>
							</div>
						</div>
					</template>
					<div v-if="planType === 1">
						<div
							class="tableBody"
							v-for="(microList,
							microListIndex) in item.pickRequire"
						>
							<el-row>
								<el-col :span="4">
									检测类别：
								</el-col>
								<el-col :span="4">
									<el-input
										placeholder="请输入内容"
										v-model="microList.detectTypeShow"
										:disabled="true"
									>
									</el-input>
								</el-col>
								<el-col :span="8">
								</el-col>
<!--								<el-col :span="4">-->
<!--									<el-select-->
<!--										v-model="microList.pickRequire"-->
<!--										placeholder="请选择"-->
<!--										:disabled="true"-->
<!--									>-->
<!--										<el-option-->
<!--											v-for="item in options"-->
<!--											:label="item.label"-->
<!--											:value="item.value"-->
<!--										>-->
<!--										</el-option>-->
<!--									</el-select>-->
<!--								</el-col>-->
								<el-col
									:offset="4"
									:span="2"
									style="display:flex"
									v-if="extendedProperties.formShowType === 0"
								>
									<el-button
										type="primary"
										size="mini"
										plain
										@click="
											addPoint(
												itemIndex,
												microListIndex,
												microList
											)
										"
										>增加点位</el-button
									>
									<el-button
										type="danger"
										icon="el-icon-delete"
										circle
										@click="delPickRequire(item, microList)"
									></el-button>
								</el-col>
							</el-row>
							<el-table
								:data="microList.detectPoint || []"
								max-height="250"
								style="width: calc(100% - 8px)"
							>
								<el-table-column
									type="index"
									fixed
									width="50"
									label="序号"
								>
								</el-table-column>
								<el-table-column
									v-for="(col, index2) in columns"
									:key="index2"
									:prop="col.dataIndex"
									:width="col.width"
									:label="col.title"
									:show-overflow-tooltip="true"
								>
									<template slot-scope="scope">
										<div>
											{{
												col.dataIndex === "detectItem"
													? detectItem(
															scope.row.rateList,
															microList,
															scope.row
													  )
													: scope.row[col.dataIndex]
											}}
										</div>
									</template>
								</el-table-column>
								<el-table-column
									fixed="right"
									label="操作"
									width="120"
								>
									<template slot-scope="scope">
										<el-button
											@click.native.prevent="
												editRow(
													scope.$index,
													microListIndex,
													itemIndex,
													scope.row
												)
											"
											type="text"
											size="small"
											:icon="
												extendedProperties.formShowType ===
												0
													? 'icon iconfont iconxiugai'
													: 'icon iconfont iconbsl-icon-xiangqing'
											"
											>{{
												extendedProperties.formShowType ===
												0
													? "编辑"
													: "详情"
											}}</el-button
										>
										<el-button
											@click.native.prevent="
												deleteRow(
													scope.$index,
													microListIndex,
													itemIndex
												)
											"
											type="text"
											size="small"
											icon="el-icon-delete"
											v-if="
												extendedProperties.formShowType ===
													0
											"
											>移除</el-button
										>
										<el-button
											@click.native.prevent="
												copyRow(
													scope.$index,
													microListIndex,
													itemIndex
												)
											"
											type="text"
											size="small"
											icon="icon iconfont iconbsl-icon-fuzhi"
											v-if="
												extendedProperties.formShowType ===
													0
											"
											>复制</el-button
										>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
					<div v-else>
						<el-table
							:data="item.pickRequire"
							max-height="250"
							style="width: calc(100% - 8px)"
						>
							<el-table-column
								type="index"
								fixed
								width="50"
								label="序号"
							>
							</el-table-column>
							<el-table-column
								v-for="(col, index2) in columns"
								:key="index2"
								:width="col.width"
								:prop="col.dataIndex"
								:label="col.title"
								:show-overflow-tooltip="true"
							>
								<template slot-scope="scope">
									<div>
										<!--                      {{col.dataIndex === 'detectItem' ? detectItem(scope.row) :-->
										<!--                           col.dataIndex === 'detectType' ? detectType(scope.row) :-->
										<!--                           col.dataIndex === 'sampleStatus' ? sampleStatus(scope.row) :-->
										<!--                           col.dataIndex === 'saveConditionId' ? saveConditionId(scope.row) :-->
										<!--                           scope.row[col.dataIndex]}}-->
										{{
											formatter(
												col.dataIndex,
												scope.row,
												col
											)
										}}
									</div>
								</template>
							</el-table-column>
							<el-table-column
								fixed="right"
								label="操作"
								width="120"
							>
								<template slot-scope="scope">
									<el-button
										@click.native.prevent="
											editRow(
												scope.$index,
												0,
												itemIndex,
												scope.row
											)
										"
										type="text"
										size="small"
										:icon="
											extendedProperties.formShowType ===
											0
												? 'icon iconfont iconxiugai'
												: 'icon iconfont iconbsl-icon-xiangqing'
										"
										>{{
											extendedProperties.formShowType ===
											0
												? "编辑"
												: "详情"
										}}</el-button
									>
									<el-button
										@click.native.prevent="
											deleteRow(
												scope.$index,
												0,
												itemIndex
											)
										"
										type="text"
										size="small"
										icon="el-icon-delete"
										v-if="
											extendedProperties.formShowType ===
												0
										"
										>移除</el-button
									>
									<el-button
										@click.native.prevent="
											copyRow(scope.$index, 0, itemIndex)
										"
										type="text"
										size="small"
										icon="icon iconfont iconbsl-icon-fuzhi"
										v-if="
											extendedProperties.formShowType ===
												0
										"
										>复制</el-button
									>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</el-collapse-item>
			</el-collapse>
		</div>
		<el-dialog
			title="新增检测信息"
			:visible.sync="innerVisible"
			append-to-body
			width="500px"
			center
		>
			<el-form
				ref="addForm"
				:model="addForm"
				:rules="rules"
				label-width="80px"
			>
				<el-form-item label="检测类别" prop="detectTypeShow">
					<div class="searchDetectCategory">
						<el-input
							v-model="addForm.detectTypeShow"
							placeholder="检测类别"
							clearable
							@click.native="cateShow = true"
							:disabled="true"
							@
						>
							<i
								slot="suffix"
								class="el-input__icon el-icon-search"
								@click="cateShow = true"
							></i>
						</el-input>
						<!--            <el-input-->
						<!--              v-model="addForm.detectTypeShow"-->
						<!--              :disabled="true"-->
						<!--            ></el-input>-->
						<!--            <el-button type="primary" @click="cateShow = true">查询</el-button>-->
					</div>
				</el-form-item>
				<el-form-item label="采样要求" prop="pickRequire">
					<el-select v-model="addForm.pickRequire" style="width:100%">
						<el-option
							v-for="item in options"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="onSubmit">确认</el-button>
				<el-button @click="innerVisible = false">取消</el-button>
			</div>
		</el-dialog>
		<detectType :visible.sync="cateShow" @handleClick="handleClick" />
		<pointMess
			:showPointModal.sync="pointShow"
			:list="record.list"
			:extendedProperties="extendedProperties"
			:pointMessParam="pointMessParam"
			:pointInfo="nowEditPointInfo"
			@savePointInfo="savePointInfo"
		/>
		<proMess
			:showProModal.sync="projectShow"
			:list="record.list"
			:extendedProperties="extendedProperties"
			:pointMessParam="pointMessParam"
			:pointInfo="nowEditPointInfo"
			@saveInfo="saveInfo"
		/>
	</div>
</template>
<script>
import "../../views/core/components_use";
import { getDynamicData } from "@/api/runDynamicPage/config";
import "ant-design-vue/dist/antd.css";
import detectType from "./detectType";
import pointMess from "./pointMess";
import proMess from "./proMess";
import { mapGetters } from "vuex";
export default {
	components: {
		detectType,
		pointMess,
		proMess
		// KFormModelItem
	},
	props: ["record", "envDetectInfoPick", "extendedProperties"],
	data() {
		return {
			active: 0,
			innerVisible: false,
			addForm: {
				detectType: null,
				detectTypeShow: "",
				pickRequire: null,
				pickRequireShow: ""
			},
			planDate: "",
			options: [],
			tempIndex: 0,
			nowEditPlan: {},
			nowEditPointInfo: {},
			nowItemIndex: null,
			nowMicroListIndex: null,
			nowPointIndex: null,
			rules: {
				detectTypeShow: [
					{
						required: true,
						message: "请输入检测类别",
						trigger: "blur"
					}
				],
				pickRequire: [
					{
						required: true,
						message: "请输入采样要求",
						trigger: "blur"
					}
				]
			},
			cateShow: false,
			pointShow: false,
			projectShow: false,
			//传入下层的检测类别,采样要求
			pointMessParam: {
				pickRequireOptions: [],
				detectTypeShow: "",
				detectTypeId: null,
				pickRequire: [],
				//送样
				tableData: [],
				depth: []
			},
			//动态数据源
			dynamicDataSource: {},
			cacheDynamicDataSource: {}
		};
	},
	computed: {
		columns() {
			let columns = [];
			columns.push(
				...this.record.list
					.filter(item => !item.options.hidden)
					.map((item, index) => {
						return {
							title: item.label,
							dataIndex: item.model,
							// width: 120,
							scopedSlots: { customRender: item.key },
							item: item
						};
					})
			);
			return columns;
		},
		isShow() {
			if (this.extendedProperties.isEntrust) {
				if(this.envDetectInfoPick.length < 1){
					this.handleAdd();
				}
				// 没想明白原因,先注释.
				// return this.envDetectInfoPick.length < 1;
				return false;
			} else {
				return true;
			}
		},
		...mapGetters(["planType"])
	},
	created() {
		this.initSelectData();
		this.columns.forEach((item, index) => {
			this.loadDataSource(item.item);
		});
	},
	methods: {
		initSelectData() {
			this.getDicts("evn_pick_require").then(response => {
				// this.options = response.data;
				let that = this;
				response.data.forEach((item, index) => {
					that.options.push({
						value: item.dictCode,
						label: item.dictLabel
					});
				});
			});
		},
		handleAdd() {
			this.envDetectInfoPick.push({
				planDate: "",
				id: Date.now(),
				pickRequire: []
			});
		},
		addMess(item, index) {
			if (this.planType === 1) {
				this.cateShow = true;
			} else {
				this.projectShow = true;
				// console.log(this.nowEditPointInfo)
				this.nowEditPointInfo = JSON.parse(JSON.stringify(item));
				this.nowEditPointInfo.planDate = "";
				this.nowEditPointInfo.pickRequire = [];
				this.pointMessParam.depth = [];
				this.pointMessParam.pickRequire = [];
				this.$store.dispatch("getType", 0);
			}
			this.active = index;
			this.nowEditPlan = item;
			this.tempIndex = index;
			console.log(this.nowEditPointInfo);
			// console.log(this.planType)
		},
		copyMess(index) {
			let target = JSON.parse(
				JSON.stringify(this.envDetectInfoPick[index])
			);
			target["id"] = Date.now();
			target.planDate = "";
			this.envDetectInfoPick.push(target);
		},
		delMess(index) {
			this.envDetectInfoPick.splice(index, 1);
		},
		noScript() {
			return false;
		},
		addPoint(itemIndex, microListIndex, microList) {
			console.log(itemIndex, microListIndex, microList)
			// console.log("microList", microList);
			this.$store.dispatch("getType", microList.type);
			this.nowItemIndex = itemIndex;
			this.nowMicroListIndex = microListIndex;
			this.pointShow = true;
			this.pointMessParam.pickRequireOptions = this.options;
			this.pointMessParam.detectTypeShow = this.envDetectInfoPick[
				itemIndex
			].pickRequire[microListIndex].detectTypeShow;
			this.pointMessParam.detectTypeId = this.envDetectInfoPick[
				itemIndex
			].pickRequire[microListIndex].detectType;
			this.pointMessParam.type = this.envDetectInfoPick[
				itemIndex
			].pickRequire[microListIndex].type;
			this.pointMessParam.pickRequire = this.envDetectInfoPick[
				itemIndex
			].pickRequire[microListIndex].pickRequire;
			console.log("pointMessParam", this.pointMessParam);
			let pointInfo = {};
			this.record.list.forEach((item, index) => {
				pointInfo[item.model] = null;
			});
			console.log("pointInfo", this.pointInfo);
			this.nowEditPointInfo = pointInfo;
		},
		savePointInfo(pointInfo, isClose) {
			// console.log(this.nowPointIndex != null);
			if (this.nowPointIndex != null) {
				this.$set(
					this.envDetectInfoPick[this.nowItemIndex].pickRequire[
						this.nowMicroListIndex
					].detectPoint,
					this.nowPointIndex,
					pointInfo
				);
			} else {
				if(!this.envDetectInfoPick[this.nowItemIndex].pickRequire[
					this.nowMicroListIndex
					].detectPoint){
					this.$set(this.envDetectInfoPick[this.nowItemIndex].pickRequire[
						this.nowMicroListIndex
						], 'detectPoint', []);

				}
				this.envDetectInfoPick[this.nowItemIndex].pickRequire[
					this.nowMicroListIndex
				].detectPoint.push(pointInfo);
			}
			this.nowItemIndex = null;
			this.nowMicroListIndex = null;
			this.nowPointIndex = null;
			if (isClose) {
				this.nowEditPointInfo = null;
			}
		},
		saveInfo(pointInfo, isClose) {
			console.log(pointInfo);
			if (this.nowPointIndex != null) {
				this.$set(
					this.envDetectInfoPick[this.tempIndex].pickRequire,
					this.nowPointIndex,
					pointInfo
				);
			} else {
				pointInfo["depth"] = this.pointMessParam.depth;
				this.envDetectInfoPick[this.tempIndex].pickRequire.push(
					pointInfo
				);
			}
			this.nowItemIndex = null;
			this.nowMicroListIndex = null;
			this.nowPointIndex = null;
			if (isClose) {
				this.nowEditPointInfo = null;
			}
		},
		editRow(pointIndex, microListIndex, itemIndex, scope) {
			// console.log(pointIndex, microListIndex, itemIndex,scope)
			this.nowItemIndex = itemIndex;
			this.nowMicroListIndex = microListIndex;
			this.nowPointIndex = pointIndex;
			if (this.planType === 1) {
				this.pointShow = true;
				this.pointMessParam.pickRequireOptions = this.options;
				this.pointMessParam.detectTypeShow = this.envDetectInfoPick[
					itemIndex
				].pickRequire[microListIndex].detectTypeShow;
				this.pointMessParam.type = this.envDetectInfoPick[
					itemIndex
				].pickRequire[microListIndex].type;
				this.pointMessParam.pickRequire = this.envDetectInfoPick[
					itemIndex
				].pickRequire[microListIndex].pickRequire;
				this.pointMessParam.detectTypeId = this.envDetectInfoPick[
					itemIndex
				].pickRequire[microListIndex].detectType;
				let target = JSON.parse(
					JSON.stringify(
						this.envDetectInfoPick[itemIndex].pickRequire[
							microListIndex
						].detectPoint[pointIndex]
					)
				);
				this.nowEditPointInfo = target;
			} else {
				this.tempIndex = itemIndex;
				this.projectShow = true;
				let target = JSON.parse(
					JSON.stringify(
						this.envDetectInfoPick[itemIndex].pickRequire[
							pointIndex
						]
					)
				);
				target["detectType"] = target.detectTypeName;
				let pickRequireTarget = JSON.parse(
					JSON.stringify(
						this.envDetectInfoPick[itemIndex].pickRequire[
							pointIndex
						]
					)
				);
				this.pointMessParam.tableData = pickRequireTarget.rateList;
				this.pointMessParam.depth = pickRequireTarget.depth;
				this.pointMessParam.depth.selectedList =
					pickRequireTarget.rateList;
				this.pointMessParam.type = 0;
				this.pointMessParam.pickRequire = pickRequireTarget;
				this.pointMessParam.detectTypeId =
					pickRequireTarget.detectTypeId;
				this.pointMessParam.detectType =
					pickRequireTarget.detectTypeName;
				this.pointMessParam.detectTypeShow =
					pickRequireTarget.detectTypeName;
				this.nowEditPointInfo = target;
			}

			this.$store.dispatch("getType", this.pointMessParam.type);
		},
		copyRow(pointIndex, microListIndex, itemIndex) {
			if (this.planType === 1) {
				let target = JSON.parse(
					JSON.stringify(
						this.envDetectInfoPick[itemIndex].pickRequire[
							microListIndex
						].detectPoint[pointIndex]
					)
				);
				this.envDetectInfoPick[itemIndex].pickRequire[
					microListIndex
				].detectPoint.push(target);
			} else {
				let target = JSON.parse(
					JSON.stringify(
						this.envDetectInfoPick[itemIndex].pickRequire[
							pointIndex
						]
					)
				);
				this.envDetectInfoPick[itemIndex].pickRequire.push(target);
			}
		},
		deleteRow(pointIndex, microListIndex, itemIndex) {
			if (this.planType === 1) {
				this.envDetectInfoPick[itemIndex].pickRequire[
					microListIndex
				].detectPoint.splice(pointIndex, 1);
			} else {
				this.envDetectInfoPick[itemIndex].pickRequire.splice(
					pointIndex,
					1
				);
			}
		},
		onSubmit() {
			let validRepeat = false;
			if(this.nowEditPlan.pickRequire){
        this.nowEditPlan.pickRequire.forEach((item, index) => {
          if (
            this.addForm.detectType === item.detectType
            // && this.addForm.pickRequire === item.pickRequire
          ) {
            validRepeat = true;
          }
        });
      }else{
        this.nowEditPlan.pickRequire = [];
      }
			if (validRepeat) {
				this.$message.error(
					// "已经添加相同检测类别与采样要求的点位信息, 不允许重复添加!"
					"已经添加相同检测类别的点位信息, 不允许重复添加!"
				);
				return false;
			}
      this.active = this.tempIndex;
      this.nowEditPlan.pickRequire.push({
        detectType: this.addForm.detectType,
        detectName: this.addForm.detectTypeShow,
        pickRequire: this.addForm.pickRequire,
        detectTypeShow: this.addForm.detectTypeShow,
        type: this.addForm.type,
        detectPoint: []
      });
      this.addForm.detectType = 0;
      this.addForm.detectName = "";
      this.addForm.detectTypeShow = "";
      this.addForm.pickRequire = null;
      this.innerVisible = false;
		},
		handleClick(row) {
			// console.log(row)
			this.addForm.detectType = row.id;
			this.addForm.detectTypeShow = row.detectName;
			this.addForm.type = row.type;
			this.addForm.pickRequire = 1;
			this.onSubmit()
		},
		handleSelectPlanDate(item, newValue) {
			let validRepeat = false;
			this.envDetectInfoPick.forEach((row, index) => {
				if (row.planDate - newValue == 0 && row.id != item.id) {
					validRepeat = true;
				}
			});
			if (validRepeat) {
				this.$message.error(
					"已经添加相同时间的检测计划, 不允许重复添加!"
				);
				item.planDate = "";
			}
		},
		delPickRequire(planDateRow, pickRequireRow) {
			this.envDetectInfoPick.forEach((row, index1) => {
				if (row.id == planDateRow.id) {
					row.pickRequire.forEach((item, index2) => {
						if (
							item.detectType === pickRequireRow.detectType &&
							item.pickRequire === pickRequireRow.pickRequire
						) {
							row.pickRequire.splice(index2, 1);
							return;
						}
					});
				}
			});
		},
		//formatter
		formatter(dataIndex, row, col) {
			if (dataIndex === "detectItem") {
				return this.detectItem(row);
			}
			if (dataIndex === "detectType") {
				return this.detectType(row);
			}
			let returnVal = "";
			let dataSource = this.dynamicDataSource[col.dataIndex];
			if (dataIndex === col.dataIndex) {
				let cellValue = row[dataIndex];
				switch (col.item.type) {
					case "select":
						if (!dataSource) {
							return "";
						}
						if (col.item.options.multiple) {
							let valueList = cellValue;
							valueList?.forEach((forSubRow, subIndex) => {
								dataSource.forEach((forRow, index) => {
									if (forRow.key == forSubRow) {
										returnVal += forRow.value + ",";
									}
								});
							});
							return returnVal.substr(0, returnVal.length - 1);
						} else {
							dataSource.forEach((row, index) => {
								if (cellValue == row.key) {
									returnVal = row.value;
								}
							});
						}
						return returnVal;
						break;
					case "radio":
						if (!dataSource) {
							return "";
						}
						dataSource.forEach((row, index) => {
							if (cellValue == row.key) {
								returnVal = row.value;
							}
						});
						return returnVal;
						break;
					case "checkbox":
						if (!dataSource) {
							return "";
						}
						let valueList = [];
						valueList = JSON.parse(cellValue);
						valueList.forEach((forSubRow, subIndex) => {
							dataSource.forEach((forRow, index) => {
								if (forRow.key == forSubRow) {
									returnVal += forRow.value + ",";
								}
							});
						});
						return returnVal.substr(0, returnVal.length - 1);
						break;
					default:
						returnVal = cellValue;
						break;
				}
			}
			return returnVal;
		},
		detectItem(list, row, pointRow) {
			let text;
			if (this.planType === 1) {
				const max = Math.max.apply(
					Math,
					list.map(item => (item.depth ? item.depth.length : 0))
				);
				let temp = [];
				list.map(item => {
					if (item.depth) {
						item.depth.map(item1 => {
							temp = temp.concat(item1.selectedRowKeys);
						});
					}
				});
				temp = new Set(temp);
				if (row && row.type === 1) {
					text = `${max}个深度 ，${temp.size}个检测项目`;
				} else {
					text = `${temp.size}个检测项目`;
				}
				pointRow.detectItem = text;
			} else {
			  if(list.depth){
          text = `${list.depth[0].selectedRowKeys.length}个检测项目`;
          list.detectItem = text;
        }
			}
			return text;
		},
		detectType(row) {
			return row.detectTypeName;
		},
		sampleStatus(row) {
			const dataSource = this.dynamicDataSource["sampleStatus"];
			let returnVal = null;
			dataSource.forEach((dataRow, index) => {
				if (row.sampleStatus == dataRow.key) {
					returnVal = dataRow.value;
				}
			});
			return returnVal;
		},
		saveConditionId(row) {
			const dataSource = this.dynamicDataSource["saveConditionId"];
			let valueList = row.saveConditionId;
			let returnVal = "";
			valueList.forEach((forSubRow, subIndex) => {
				dataSource.forEach((forRow, index) => {
					if (forRow.key == forSubRow) {
						returnVal += forRow.value + ",";
					}
				});
			});
			return returnVal.substr(0, returnVal.length - 1);
		},
		loadDataSource(item) {
			const that = this;
			//加载数据源
			if (item.options && item.options.dynamic) {
				//远程
				if (this.cacheDynamicDataSource[item.options.dynamicGetUrl]) {
					//缓存
					this.$set(
						this.dynamicDataSource,
						item.key,
						this.cacheDynamicDataSource[item.options.dynamicGetUrl]
					);
				} else {
					//远程拉取
					getDynamicData(item.options.dynamicGetUrl).then(
						response => {
							let dataSource = [];
							response.data.forEach((row, key) => {
								dataSource.push({
									key: row[item.options.dynamicGetKey],
									value: row[item.options.dynamicGetValue]
								});
							});
							that.$set(
								that.dynamicDataSource,
								item.model,
								dataSource
							);
							that.$set(
								that.cacheDynamicDataSource,
								item.options.dynamicGetUrl,
								dataSource
							);
							// console.log(that.dynamicDataSource);
							// console.log(that.cacheDynamicDataSource);
						}
					);
				}
			} else if (item.options && item.options.options) {
				//本地
				let dataSource = [];
				item.options.options.forEach((row, key) => {
					dataSource.push({
						key: row.value,
						value: row.label
					});
				});
				this.$set(this.dynamicDataSource, item.model, dataSource);
			}
		}
	}
};
</script>
<style lang="less">
.customProject {
	ul,
	li {
		list-style: none;
		padding: 0;
	}
	.coll {
		max-height: 400px;
		overflow: auto;
	}
	.container {
		border: 1px solid #999;
		margin-bottom: 10px;
	}
	.el-collapse-item__arrow {
		margin: 0 8px;
	}
	.el-collapse-item__content {
		padding-bottom: 0;
	}
	.contain {
		display: flex;
		justify-content: space-between;
		width: 100%;
		// border-bottom:1px solid #999;
	}
	.tableBody {
		margin: 4px;
		border: 1px solid #999;
	}
	.el-row {
		display: flex;
		align-items: center;
		text-align: center;
	}
	.el-table {
		margin: 4px;
		border: 1px solid #999;
	}
	.noscript {
		pointer-events: none;
	}
	/deep/.el-table th > .cell {
		text-align: center;
	}

	/deep/.el-table .cell {
		text-align: center;
	}
	/deep/ .el-button.is-circle {
		padding: 6px;
	}
}
.searchDetectCategory {
	display: flex;
}
</style>

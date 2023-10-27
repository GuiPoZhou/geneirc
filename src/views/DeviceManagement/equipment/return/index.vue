<template>
	<div class="app-container">

		<!-- 统一样式 - 查询区域 -->
		<div class="a-c-top" v-show="showSearch">

			<!-- 搜索表单 -->
			<el-form :inline="true" ref="queryForm" :model="queryParams" class="demo-form-inline" v-show="showSearch" @open="open"
					 label-width="100px">

				<el-form-item label="归还部门" prop="deptName">
					<el-input v-model="deptName" size="small" placeholder="请输入所属部门" @focus="deptShow=true" suffix-icon="el-icon-search" clearable @clear="resetDeptName"  style="width: 240px"/>
				</el-form-item>

				<el-form-item label="归还人员" prop="userName">
					<el-input v-model="queryParams.userName" @clear="handleQuery"clearable size="small"  style="width: 240px"/>
				</el-form-item>
				<el-form-item label="归还日期">
					<el-date-picker v-model="dateRange" size="small" style="width: 260px" value-format="yyyy-MM-dd" type="daterange"
									range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" @change="setData"></el-date-picker>
				</el-form-item>

				<!-- 统一样式 - 查询区域 按钮 -->
				<div class="a-c-t-btnarea">
					<el-form-item>
						<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
						<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
					</el-form-item>
				</div>

			</el-form>

		</div>

		<!-- 统一样式 - 主列表区域 -->
		<div class="a-c-bottom">

			<el-row :gutter="10" class="mb8">
				<right-toolbar :showSearch.sync="showSearch" @queryTable="initList"></right-toolbar>
				<el-button type="primary" icon="el-icon-mouse" size="mini" @click="equipmentCollect()">设备归还</el-button>
			</el-row>

			<!-- 表格 -->
			<el-table v-loading="loading" :data="tableData">

				<el-table-column type="index" label="序号" width="62px" align="center">
					<template slot-scope="scope">
						<span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
					</template>
				</el-table-column>

				<el-table-column prop="deptName" label="归还部门" align="center"/>

				<el-table-column prop="returnNumber" label="归还数量" align="center"/>
				<el-table-column prop="userName" label="归还人员" align="center"/>

				<el-table-column prop="createTime" label="归还日期" align="center"/>

				<el-table-column fixed="right" label="操作（归还）" align="center">
					<template slot-scope="scope">
						<el-button size="mini" type="text" icon="el-icon-info" @click="handleDetail(scope.row)">详情</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="initList"/>

		</div>

		<selectDept :visible.sync="deptShow" @backfill="backfillDept"/>
		<equipmentCollect :equipmentCollectShow.sync="equipmentCollectShow" :distinguishCode="distinguishCode" :showCollect="showCollect"/>
		<equipmentReturnDetails :detailData='detailData' :equipmentDetailsShow.sync="equipmentDetailsShow" :detailId='detailId'
								:distinguishCode="distinguishCode"/>

	</div>

</template>

<script>
	import {
		getEquipmentReturnList,

	} from "@/api/equipment/equipment"
	import selectDept from '@/components/common/selectDept'
	import equipmentCollect from '@/components/equipment/equipmentCollect'
	import equipmentReturnDetails from '@/components/equipment/equipmentReturnDetails'

	export default {
		name: "return",
		data() {
			return {
				// 遮罩层
				loading: false,
				// 查询参数
				queryParams: {
					pageSize: 10,
					pageNum: 1,
					deptName: null,//领用部门
					userName: null,//归还人员
					beginTime: null,
					endTime: null,
					deptId: null,//部门id
				},
				// 显示搜索条件
				showSearch: true,
				//表格数据
				tableData: [],
				total: 0,
				// 日期范围
				dateRange: [],
				deptName: null,
				deptShow: false,
				equipmentCollectShow: false,
				equipmentDetailsShow: false,
				distinguishCode: '',//识别码
				showCollect: false,//领用还是归还
				detailId: '',
				detailData: {}
			}
		},
		methods: {
			open() {
				this.queryParams = {}
				this.deptName = ""
			},
			//详情按钮操作
			handleDetail(row) {
				console.log('设备归还的详情=>', row)
				this.detailData = row
				this.detailId = row.id
				this.equipmentDetailsShow = true
			},
			//设备归还按钮
			equipmentCollect() {
				this.equipmentCollectShow = true
				this.showCollect = true;
				this.distinguishCode = 'return'
			},
			//搜索按钮操作
			handleQuery() {
				this.queryParams.pageNum = 1
				this.initList()
			},
			resetDeptName(){
				this.queryParams.deptId = null
				this.handleQuery()
			},
			//重置按钮操作
			resetQuery() {
				this.dateRange = [];
				this.queryParams.beginTime = null
				this.queryParams.endTime = null
				this.queryParams.deptId = null
				this.deptName = null
				this.resetForm("queryForm");
				this.handleQuery();
			},
            setData(v){
                this.dateRange = v
                if (this.dateRange) {
                    this.queryParams.beginTime = this.dateRange[0]
                    this.queryParams.endTime = this.dateRange[1]
                }else{
                    this.queryParams.beginTime = ''
                    this.queryParams.endTime = ''
                }
            },
			/** 查询列表 */
			initList() {
				this.loading = true;
				getEquipmentReturnList(this.queryParams).then(
					(response) => {
						if (response.code == 200) {
							let data = response.data
							this.tableData = data.list
							this.total = data.total
						}
						this.loading = false;

					}
				);
			},
			//填充检测单位
			backfillDept(dept) {
				this.queryParams.deptId = dept.deptId
				this.deptName = dept.deptName
				this.handleQuery()
			},
		},

		components: {
			selectDept,
			equipmentCollect,
			equipmentReturnDetails
		},

		created() {
			this.initList()
		},

	}
</script>

<style lang="less" scoped>


</style>

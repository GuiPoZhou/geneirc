<template>
	<div class="app-container">

		<!-- 统一样式 - 查询区域 -->
		<div class="a-c-top" v-show="showSearch">

			<!-- 搜索表单 -->
			<el-form :inline="true" ref="queryForm" :model="queryParams" class="demo-form-inline" v-show="showSearch"
					 @open="open"
					 label-width="100px">

				<el-form-item label="领用部门" prop="deptName">
					<el-input v-model="deptName" placeholder="请输入所属部门" @focus="deptShow=true" clearable @clear="resetDeptName"
							  suffix-icon="el-icon-search"  style="width: 240px"
							  size="small"/>
				</el-form-item>

				<el-form-item label="领用人员" prop="userName">
					<el-input v-model="queryParams.userName" clearable @clear="handleQuery"  style="width: 240px"
							  size="small"/>
				</el-form-item>
				<el-form-item label="领用日期">
					<el-date-picker v-model="dateRange" size="small" style="width: 260px" value-format="yyyy-MM-dd"
									type="daterange"
									range-separator="-" start-placeholder="开始日期"
									end-placeholder="结束日期"
                                    @change="setData"
                    ></el-date-picker>
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
                <el-button type="primary" icon="el-icon-mouse" size="mini" @click="equipmentCollect()">设备领用</el-button>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="initList"></right-toolbar>
			</el-row>

			<!-- 表格 -->
			<el-table v-loading="loading" :data="tableData">

				<el-table-column type="index" label="序号" width="62px"  align="center">
					<template slot-scope="scope">
						<span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
					</template>
				</el-table-column>

				<el-table-column prop="deptName" label="领用部门" align="center"/>

				<el-table-column prop="receiveNumber" label="领用数量" align="center"/>
				<el-table-column prop="userName" label="领用人员" align="center"/>

				<el-table-column prop="createTime" label="领用日期" align="center"/>

				<el-table-column fixed="right" label="操作（领用）" align="center">
					<template slot-scope="scope">
						<el-button size="mini" type="text" icon="el-icon-info" @click="handleDetail(scope.row)">详情
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum"
						:limit.sync="queryParams.pageSize" @pagination="initList"/>

		</div>

		<selectDept :visible.sync="deptShow" @backfill="backfillDept"/>
		<equipmentCollect :equipmentCollectShow.sync="equipmentCollectShow" :distinguishCode="distinguishCode"
						  :showCollect="showCollect"/>
		<equipmentCollectDetails :detailData='detailData' :equipmentDetailsShow.sync="equipmentDetailsShow"
								 :detailId='detailId'
								 :distinguishCode="distinguishCode"/>

	</div>

</template>

<script>
	import {
		getEquipmentReceiveList

	} from '@/api/equipment/equipment'
	import selectDept from '@/components/common/selectDept'
	import equipmentCollect from '@/components/equipment/equipmentCollect'
	import equipmentCollectDetails from '@/components/equipment/equipmentCollectDetails'

	export default {
		name: 'collect',
		data() {
			return {
				// 遮罩层
				loading: false,
				// 查询参数
				queryParams: {
					pageSize: 10,
					pageNum: 1,
					deptName: null,//领用部门
					userName: null,//领用人员
					receiveNumber: null,//领用数量
					createTime: null,//领用时间
					deptId: null,//部门id
					beginTime: null,
					endTime: null
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
				detailId: '',//详情id
				detailData: {}
			}
		},
		methods: {
			open() {
				this.queryParams = {}
				this.deptName = ''
			},
			//详情按钮操作
			handleDetail(row) {
				this.detailData = row
				this.detailId = row.id
				console.log('详情==>', row)
				this.equipmentDetailsShow = true
			},
			//设备领用按钮
			equipmentCollect() {
				this.equipmentCollectShow = true
				this.distinguishCode = 'collect'
			},
			//搜索按钮操作
			handleQuery() {
				if(this.dateRange){
					this.queryParams.beginTime = this.dateRange[0]
					this.queryParams.endTime = this.dateRange[1]
				}else{
					this.queryParams.beginTime = null
					this.queryParams.endTime = null
				}
				this.queryParams.pageNum = 1
				this.initList()
			},
            setData(v) {
                this.dateRange = v
                if(this.dateRange){
                    this.queryParams.beginTime = this.dateRange[0]
                    this.queryParams.endTime = this.dateRange[1]
                }else{
                    this.queryParams.beginTime = null
                    this.queryParams.endTime = null
                }
            },
			resetDeptName(){
				this.queryParams.deptId = null
				this.handleQuery()
			},
			//重置按钮操作
			resetQuery() {
			    this.$refs.queryForm.resetFields()
				this.dateRange = []
				this.queryParams.beginTime = null
				this.queryParams.endTime = null
				this.queryParams.deptId = null
				this.deptName = ''
				this.handleQuery()
                console.log(1111)
            },
			/** 查询列表 */
			initList() {
				this.loading = true
				getEquipmentReceiveList(this.queryParams).then(
					(response) => {
						if (response.code == 200) {
							let data = response.data
							this.tableData = data.list
							console.log('设备领用分页列表数据=>', data.list)
							this.total = data.total
						}
						this.loading = false

					}
				)
			},
			//填充检测单位
			backfillDept(dept) {
				this.queryParams.deptId = dept.deptId
				this.deptName = dept.deptName
			}
		},

		components: {
			selectDept,
			equipmentCollect,
			equipmentCollectDetails
		},

		created() {
			this.initList()
		}

	}
</script>

<style lang="less" scoped>


</style>

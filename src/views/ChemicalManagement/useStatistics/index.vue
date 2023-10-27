<template>
	<div>
		<div class="a-c-top" v-show="showSearch">
			<el-form ref="formsample2" :model="queryParams" label-width="100px" class="demo-form-inline"
					 :inline="true">
				<el-form-item label="耗材分类">
					<treeselect
						style="width: 240px" size="small"
						:default-expand-level="5"
						v-model="queryParams.materialTreeId"
						:options="treeOptions"
						:normalizer="normalizer"
						:show-count="true"
						placeholder="请选择文件目录"
						@select="departTreeSelected"/>
				</el-form-item>
				<el-form-item label="出库日期">
					<el-date-picker
						style="width: 260px" size="small"
						v-model="deliveryDate"
						@change="deliveryDateChange"
						type="daterange"
						range-separator="—"
						value-format="yyyy-MM-dd"
						start-placeholder="开始日期"
						end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="耗材编号">
					<el-input v-model="queryParams.materialNumber" class="input-with-select" style="width: 240px" size="small"
							  placeholder="请输入内容" clearable
							  @clear="searchPro"></el-input>
				</el-form-item>
				<el-form-item label="耗材名称">
					<el-input v-model="queryParams.materialName" class="input-with-select" style="width: 240px" size="small"
							  placeholder="请输入内容"  clearable
							  @clear="searchPro"></el-input>
				</el-form-item>
				<el-form-item label="规格型号">
					<el-input v-model="queryParams.materialModel" class="input-with-select" style="width: 240px" size="small"
							  placeholder="请输入内容"  clearable
							  @clear="searchPro"></el-input>
				</el-form-item>
				<el-form-item label="批号">
					<el-input v-model="queryParams.batchNumber" class="input-with-select" style="width: 240px" size="small"
							  placeholder="请输入内容"  clearable
							  @clear="searchPro"></el-input>
				</el-form-item>
				<el-form-item label="领用部门">
					<el-select v-model="queryParams.useDept" clearable filterable
							   style="width: 240px" size="small">
						<el-option :value="item.deptId" :label="item.deptName" :key="index"
								   v-for="(item,index) in deptList"></el-option>
					</el-select>
				</el-form-item>
				<div class="a-c-t-btnarea">
					<el-form-item class="">
						<el-button type="primary"
								   icon="el-icon-search"
								   size="mini" @click="searchPro">
							查询
						</el-button>
						<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
							重置
						</el-button>
					</el-form-item>
				</div>
			</el-form>
		</div>
		<div class="a-c-bottom">
			<el-row :gutter="10" class="mb8">
				<el-col :span="1.5">
					<el-button size="mini" type="warning" @click="exportWaitStoreIns()">导出</el-button>
				</el-col>

				<el-col :span="1.5"></el-col>
				<right-toolbar
					:showSearch.sync="showSearch"
					@queryTable="resetQuery"
					@fullScreen="e_fullScreen"
					@changeBox="e_changeBox"
					:boxData="colData"
					style="padding-right: 10px">
				</right-toolbar>
			</el-row>

			<!-- 列表区域 -->
			<el-table ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center"/>
				<el-table-column label="序号" align="center" type="index" width="50"/>
				<el-table-column prop="outerDate" label="出库日期" sortable show-overflow-tooltip align="center"
								 v-if="colData[0].istrue"/>
				<el-table-column prop="useDeptName" label="领用部门" sortable show-overflow-tooltip align="center"
								 v-if="colData[1].istrue"/>
				<el-table-column prop="useStr" label="领用人" sortable show-overflow-tooltip align="center"
								 v-if="colData[2].istrue"/>
				<el-table-column prop="materialNumber" label="耗材编号" sortable show-overflow-tooltip align="center"
								 v-if="colData[3].istrue"/>
				<el-table-column prop="materialName" label="耗材名称" sortable show-overflow-tooltip align="center"
								 v-if="colData[4].istrue"/>
				<el-table-column prop="materialModel" label="规格型号" sortable show-overflow-tooltip align="center"
								 v-if="colData[5].istrue"/>
				<el-table-column prop="brand" label="品牌" sortable show-overflow-tooltip align="center"
								 v-if="colData[6].istrue"/>
				<el-table-column prop="manufacturer" label="生产厂商" sortable show-overflow-tooltip align="center"
								 v-if="colData[7].istrue"/>
				<el-table-column prop="grade" label="试剂级别" sortable show-overflow-tooltip align="center"
								 v-if="colData[8].istrue"/>
				<el-table-column prop="materialCount" label="出库数量" sortable show-overflow-tooltip align="center"
								 v-if="colData[9].istrue"/>
				<el-table-column prop="returnCount" label="退库数量" sortable show-overflow-tooltip align="center"
								 v-if="colData[10].istrue"/>
				<el-table-column prop="unit" label="计量单位" sortable show-overflow-tooltip align="center"
								 v-if="colData[11].istrue"/>
				<el-table-column prop="costPrice" label="单价" sortable show-overflow-tooltip align="center"
								 v-if="colData[12].istrue"/>
				<el-table-column prop="costTotal" label="金额" sortable show-overflow-tooltip align="center"
								 v-if="colData[13].istrue"/>
			</el-table>
			<pagination v-show="total > 0"
						:total="total"
						:page.sync="queryParams.pageNum"
						:limit.sync="queryParams.pageSize"
						@pagination="getList"/>
		</div>
	</div>
</template>

<script>
	import { queryUseReportList, exportStoreIn } from '@/api/chemical/useStatistics'
	import { getMaterialTreelist } from '@/api/chemical/essentialInformation'
	import Treeselect from '@riophae/vue-treeselect'
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'
	import { getDept } from '@/api/chemical/collectingIssue'

	export default {
		name: 'useStatistics',
		components: { Treeselect },
		data() {
			return {
				deliveryDate: '',
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					materialTreeId: null,
					materialNumber: '',
					materialName: '',
					materialModel: '',
					batchNumber: '',
					outerDateBegin: '',
					outerDateEnd: '',
					useDept: null
				},
				total: 0,
				tableData: [],
				showSearch: true,
				colData: [
					{ title: '出库日期', istrue: true },
					{ title: '领用部门', istrue: true },
					{ title: '领用人', istrue: true },
					{ title: '耗材编号', istrue: true },
					{ title: '耗材名称', istrue: true },
					{ title: '规格型号', istrue: true },
					{ title: '品牌', istrue: true },
					{ title: '生产厂商', istrue: true },
					{ title: '试剂级别', istrue: true },
					{ title: '出库数量', istrue: true },
					{ title: '退库数量', istrue: true },
					{ title: '计量单位', istrue: true },
					{ title: '单价', istrue: true },
					{ title: '金额', istrue: true }
				],
				treeOptions: [],
				deptList: []

			}
		},
		created() {
			this.getTreeselect()
			this.getList()
			getDept().then(res => {
				this.deptList = res.data
				console.log('this.deptList', this.deptList)
			})
		},
		methods: {
			deptChange(val) {
				for (var i in this.deptList) {
					if (val == this.deptList[i].deptName) {
						this.queryParams.useDept = this.deptList[i].deptName
					}
				}
				this.searchPro()
			},
			deliveryDateChange(v) {
			    this.deliveryDate = v
				if (this.deliveryDate) {
					this.queryParams.outerDateBegin = v[0]
					this.queryParams.outerDateEnd = v[1]
				} else {
					this.queryParams.outerDateBegin = ''
					this.queryParams.outerDateEnd = ''
				}
			},
			getTreeselect() {
				getMaterialTreelist().then(response => {
					response.data[0].label = response.data[0].name
					this.treeOptions = response.data
				})
			},
			normalizer(node) {
				if (node.childList && !node.childList.length) {
					delete node.childList
				}
				return {
					id: node.id,
					label: node.name,
					children: node.childList,
					parentId: node.parentId
				}
			},
			departTreeSelected(node) {
				this.queryParams.materialTreeId = node.id
				this.queryParams.treeName = node.name
			},
			searchPro() {
				this.getList()
				console.log('11111', this.tableData)
			},
			handleSelectionChange() {

			},
			resetQuery() {
				this.queryParams = {
					pageNum: 1,
					pageSize: 10,
					materialTreeId: null,
					materialNumber: '',
					materialName: '',
					materialModel: '',
					batchNumber: '',
					outerDateBegin: '',
					outerDateEnd: '',
					useDept: null
				}
                this.deliveryDate = null
                this.queryParams.outerDateBegin = ''
                this.queryParams.outerDateEnd = ''
				this.getList()

			},
			e_fullScreen() {
				this.fullscreen = !this.fullscreen
			},
			e_changeBox(list) {
				let arrList = this.colData.filter(i => !list.includes(i.title))
				let titleList = arrList.map(item => {
					return item.title
				})
				this.colData.filter(i => {
					if (titleList.indexOf(i.title) != -1) {
						i.istrue = false
					} else {
						i.istrue = true
					}
				})
			},
			exportWaitStoreIns() {
				exportStoreIn(this.queryParams).then(res => {
					if (res.code == 200) {
                        this.downLoadFile(res.msg)
					}
				})
			},
			getList() {
				queryUseReportList(this.queryParams).then(res => {
					this.total = res.data.total
					this.tableData = res.data.list
				})
			}
		}
	}
</script>


<style scoped lang="less">
</style>

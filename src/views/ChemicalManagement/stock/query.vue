<template>
	<div>
		<div class="a-c-top" v-show="showSearch">
			<el-form rf="formsample2" :model="queryParams" label-width="100px" class="demo-form-inline" :inline="true">

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
				<el-form-item label="耗材编号">
					<el-input v-model="queryParams.materialNumber" class="input-with-select" style="width: 240px" size="small"
							  placeholder="请输入内容"  clearable
							  @clear="searchPro"></el-input>
				</el-form-item>
				<el-table-column prop="materialName" label="耗材名称" sortable show-overflow-tooltip align="center"
												 v-if="colData[1].istrue">
					<template slot-scope="scope">
						<span :style="{color: scope.row.warningMark == 1 ? 'red' : ''}">{{scope.row.materialName}}</span>
					</template>
				</el-table-column>
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
				<el-form-item label="库位">
					<el-input v-model="queryParams.storeSiteName" class="input-with-select" style="width: 240px" size="small"
							  placeholder="请输入内容"  clearable
							  @clear="searchPro"></el-input>
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
						<span style="color: #ff2222;margin-left: 20px">当前查询：所有耗材共有{{ total }}种</span>
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
				<el-table-column type="selection" width="55" align="center" />
				<el-table-column label="序号" align="center" type="index" width="50"/>
				<el-table-column prop="materialNumber" label="耗材编号" sortable show-overflow-tooltip  align="center"
								 v-if="colData[0].istrue"/>
				<el-table-column prop="materialName" label="耗材名称" sortable show-overflow-tooltip align="center"
												 v-if="colData[1].istrue">
					<template slot-scope="scope">
						<span :style="{color: scope.row.warningMark == 1 ? 'red' : ''}">{{scope.row.materialName}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="materialModel" label="规格型号" sortable show-overflow-tooltip align="center"
								 v-if="colData[2].istrue"/>
				<el-table-column prop="brand" label="品牌" sortable show-overflow-tooltip align="center"
								 v-if="colData[3].istrue"/>
				<el-table-column prop="manufacturer" label="生产厂商" sortable show-overflow-tooltip align="center"
								 v-if="colData[4].istrue"/>
				<el-table-column prop="grade" label="试剂级别" sortable show-overflow-tooltip align="center"
								 v-if="colData[5].istrue"/>
				<el-table-column prop="materialCount" label="库存数量" sortable show-overflow-tooltip align="center"
								 v-if="colData[6].istrue"/>
				<el-table-column prop="unit" label="计量单位" sortable show-overflow-tooltip align="center"
								 v-if="colData[7].istrue"/>
				<el-table-column prop="storeSiteName" label="存放库位" sortable show-overflow-tooltip align="center"
								 v-if="colData[8].istrue"/>
				<!--				<el-table-column prop="price" label="单价" sortable show-overflow-tooltip
												 v-if="colData[9].istrue"/>
								<el-table-column prop="amount" label="金额" sortable show-overflow-tooltip
												 v-if="colData[10].istrue"/>-->
				<el-table-column prop="batchNumber" label="批号" sortable show-overflow-tooltip align="center"
								 v-if="colData[11].istrue"/>
				<el-table-column prop="productionDate" label="生产日期" sortable show-overflow-tooltip align="center"
								 v-if="colData[12].istrue"/>
				<el-table-column prop="safeDate" label="有限期" sortable show-overflow-tooltip align="center"
								 v-if="colData[13].istrue"/>
				<el-table-column prop="invalidDate" label="有限到期日" sortable show-overflow-tooltip align="center"
								 v-if="colData[14].istrue"/>
			</el-table>
			<pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
						:limit.sync="queryParams.pageSize" @pagination="getList"/>
		</div>
	</div>
</template>

<script>
	import { queryStoreList, exportStore } from '@/api/chemical/stock'
	import { getMaterialTreelist } from '@/api/chemical/essentialInformation'
	import Treeselect from '@riophae/vue-treeselect'
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'

	export default {
		name: 'stockQuery',
		components: { Treeselect },
		data() {
			return {
				total: 0,
				showSearch: true,
				queryParams: {
					materialTreeId: null,
					materialName: '',
					materialNumber: '',
					materialModel: '',
					batchNumber: '',
					storeSiteName: ''
				},
				supplierList: [],
				treeOptions: [],
				colData: [
					{ title: '耗材编号', istrue: true },
					{ title: '耗材名称', istrue: true },
					{ title: '规格型号', istrue: true },
					{ title: '品牌', istrue: true },
					{ title: '生产厂商', istrue: true },
					{ title: '试剂级别', istrue: true },
					{ title: '入库数量', istrue: true },
					{ title: '计量单位', istrue: true },
					{ title: '存放库位', istrue: true },
					{ title: '单价', istrue: true },
					{ title: '金额', istrue: true },
					{ title: '批号', istrue: true },
					{ title: '生产日期', istrue: true },
					{ title: '有限期', istrue: true },
					{ title: '有限到期日', istrue: true }
				],
				tableData: []
			}
		},
		mounted() {
			this.getList()
			this.getTreeselect()
		},
		methods: {
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
			},
			resetQuery() {
				this.queryParams = {
					materialTreeId: null,
					materialName: '',
					materialNumber: '',
					materialModel: '',
					batchNumber: '',
					storeSiteName: ''
				}
				this.getList()
			},
			exportWaitStoreIns() {
				exportStore(this.queryParams).then(res => {
					if (res.code === 200) {
                        this.downLoadFile(res.msg)
					}
				})
			},
			e_fullScreen() {

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
			handleSelectionChange() {

			},
			getList() {
				queryStoreList(this.queryParams).then(res => {
					this.tableData = res.data.list
					this.total = res.data.total
				})
			}
		}
	}
</script>


<style scoped lang="less">
</style>

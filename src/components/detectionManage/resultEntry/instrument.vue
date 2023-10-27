<template>
	<el-dialog :visible.sync="instrumentShow" append-to-body width="1000px" center :close-on-press-escape="false" :close-on-click-modal="false" :before-close="cancel" @open="open" >
		<div style="display: flex">
			<div style="flex: 1">
				<div class="selected" style="text-align: center">
					<span>{{ `已选择项目(共${selectedList.length}个)` }}</span>
					<div class="otherGroups">
						<a-button type="primary" size="small" @click="save">保存</a-button>
						<a-button size="small" @click="cancel">取消</a-button>
					</div>
				</div>
				<a-table :columns="listColumns" :data-source="selectedList" size="small" :pagination="false" :scroll="{ y: 200 }">
					<template slot="customerAppoint" slot-scope="text, record, index">
						<a-switch :checked="selectedList[index].customerAppoint" />
					</template>
					<template slot="operation" slot-scope="text, record, index">
						<a href="javascript:;" @click="deletePro(record, index)" style="color: #1890ff;">删除</a>
					</template>
				</a-table>
			</div>
		</div>
		<section style="display: flex">
			<div style="flex: 1">
				<div>
					<a-form-model layout="inline" :form="form">
						<a-form-model-item label="仪器名称：">
							<a-input v-model="form.equipmentName" @keyup.enter.native="searchPro" />
						</a-form-model-item>
						<a-form-model-item label="仪器编号：">
							<a-input v-model="form.equipmentNumber" @keyup.enter.native="searchPro" />
						</a-form-model-item>
						<a-form-model-item label="仪器型号：">
							<a-input v-model="form.equipmentModel" @keyup.enter.native="searchPro" />
						</a-form-model-item>
						<a-form-model-item label="仪器分类：">
							<a-input v-model="form.equipmentClassStr" @keyup.enter.native="searchPro" />
						</a-form-model-item>
					</a-form-model>
					<a-table
						:row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, onSelect: selectRow,onSelectAll: selectAll } || null"
						:columns="listColumns.filter(item => item.sign)"
						:data-source="searchList"
						size="small"
						:pagination="false"
						@change="changePage"
						:rowKey="record => record.id"
						ref="multipleTable"
						:scroll="{ y: 400 }"
					/>
					<div class="block">
						<pagination
							v-show="pagination.total>0"
							:total="pagination.total"
							:page.sync="params.pageNum"
							:limit.sync="params.pageSize"
							@pagination="init"
						/>
					</div>
				</div>
			</div>
		</section>
	</el-dialog>
</template>
<script>
import { getInstrumentList } from '@/api/detectionManage/resultEntry/noRecord'
const deepColumns = [
	{
		title: '操作',
		dataIndex: 'operation',
		align: 'center',
		scopedSlots: { customRender: 'operation' },
	},
]
const listColumns = [
	{
		title: '序号',
		width: 50,
		dataIndex: 'index',
		sign: false,
		customRender: (text, record, index) => `${index + 1}`,
		scopedSlots: { customRender: 'index' },
	},
	{
		title: '仪器分类',
		dataIndex: 'equipmentClassStr',
		sign: true,
		scopedSlots: { customRender: 'equipmentClassStr' },
	},
	{
		title: '仪器编号',
		dataIndex: 'equipmentNumber',
		sign: true,
		scopedSlots: { customRender: 'equipmentNumber' },
	},
	{
		title: '仪器名称',
		dataIndex: 'equipmentName',
		sign: true,
		scopedSlots: { customRender: 'equipmentName' },
	},
	{
		title: '仪器型号',
		dataIndex: 'equipmentModel',
		sign: true,
		scopedSlots: { customRender: 'equipmentModel' },
	},
	{
		title: '操作',
		dataIndex: 'operation',
		sign: false,
		scopedSlots: { customRender: 'operation' },
	},
]
const projectColumns = [
	{
		title: '序号',
		width: 50,
		align: 'center',
		dataIndex: 'index',
		customRender: (text, record, index) => `${index + 1}`,
	},
]
export default {
	data() {
		return {
			searchList: [], //请求列表数据
			selectedList: [],
			deepColumns,
			listColumns,
			projectColumns,
			form: {},
			selectedRowKeys: [],
			customerAppoint: [],
			pagination: {
				total: 0,
				pageSize: 10,
				showSizeChanger: true,
			},
			params: {
				pageNum: 1,
				pageSize: 10,
			},
		}
	},
	props: {
		instrumentShow: {
			type: Boolean,
			default: false,
		},
		instrumentIds: {
			type: Array,
			default: () => [],
		},
		instrumentIdOne: {
			type: Array,
			default: () => [],
		},
		// 添加仪器类型（1单个添加，2多选添加）
		instrumentType: {
			type: Number,
			default: 1
		},
		idOne: {
			type: String,
			default: '',
		},
	},
	computed: {
		// ...mapGetters([
		//   'detectType',
		// ])
	},
	methods: {
		open() {
			this.init();
		},
		opened() {},
		//仪器列表
		init() {
			let params = Object.assign(this.form, this.params)
			console.log('params',params)
			console.log('this.form, this.params',this.form, this.params)
			getInstrumentList(params).then(res => {
				console.log('仪器列表请求的数据=>', res)
				this.searchList = res.data.list
				this.pagination.total = res.data.total

				this.$nextTick(() => {
					// 初始化勾选项
					if (this.instrumentType === 1) {
						this.searchList.forEach(item => {
							if (this.instrumentIdOne.includes(item.id.toString())) {
								this.selectedList.push(item)
							}
						})
					} else {
						this.searchList.forEach(item => {
							if (this.instrumentIds.includes(item.id.toString())) {
								this.selectedList.push(item)
							}
						})
					}
					console.log(this.selectedList.map(item => item.id))
					this.selectedRowKeys = this.selectedList.map(item=>item.id)

				})
			})
		},
		//回填
		refill() {},
		cancel() {
			this.close();
			this.$emit('cancel')
		},
		save() {
			if (this.selectedList.length == 0) {
				this.$message.info("至少选择一种设备进行保存");
				return;
			}
			let insIds = this.selectedList.map(item => item.id)
			console.log('上表的表格数据的设备id==>', insIds)
			this.$emit('changeInsIds', insIds,this.idOne)
			this.cancel()
		},
		//删除
		deletePro(record, index) {
			this.selectedList.splice(index, 1)
			let id = record.id
			//在selectedRowKeys里面找到record.id的位置
			let idx = this.selectedRowKeys.indexOf(id + '')
			if (idx >= 0) {
				this.selectedRowKeys.splice(idx, 1)
			}
		},
		//多选框手势
		rowPointer() {
			return 'rowPointer'
		},
		//搜索
		searchPro() {
			this.init()
		},
		selectRow(record, selected, selectedRows, nativeEvent) {
			console.log(selected)
			if(!selected) {
				var ids = this.selectedList.map(item => item.id)
				// console.log();
				this.selectedList.splice(ids.indexOf(record.id),1)
			}
		},
		selectAll(selected, selectedRows, changeRows) {
			if(!selected) {
				let arrIdList = changeRows.map(x => x.id)
				// var ids = this.selectedList.map(item => item.id)
				this.selectedList = this.selectedList.filter(x => !arrIdList.includes(x.id))
			}
		},
		//多选
		onSelectChange(selectedRowKeys, selectedRows) {
			var ids = this.selectedList.map(item => item.id)
			this.selectedList = this.removeRepeat(this.selectedList.concat(selectedRows))


			// this.selectedList.splice(0, this.selectedList.length, ...JSON.parse(JSON.stringify(selectedRows)))
			this.selectedRowKeys = selectedRowKeys
		},
		removeRepeat (arr) {
			for (var i = 0; i < arr.length - 1; i++) {
				for (var j = 1; j < arr.length; j++) {
					if (i != j) {
						if (arr[i].id == arr[j].id) {
							arr.splice(j, 1)
						}
					}
				}
			}
			return arr
		},
		//改变页码
		changePage(pagination) {
			this.params.pageNum = pagination.current
			this.params.pageSize = pagination.pageSize
			this.init()
		},
		close() {
			this.searchList = []
			this.selectedList = []
			this.selectedRowKeys = []
			this.form = {}
		},
	},
	mounted() {
		this.refill()
	},
}
</script>
<style lang="less" scoped>
/deep/ .selected {
	height: 30px;
	line-height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
}
/deep/ .rowPointer {
	cursor: pointer;
}
/deep/.otherGroups {
	position: absolute;
	right: 25px;
	.ant-btn {
		margin-right: 20px;
	}
}
</style>

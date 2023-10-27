<template>
	<el-dialog :visible.sync="addShow" append-to-body width="1000px"
			   center :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" @close="close"
			   @open="open">
		<div style="display:flex">
			<div class="contain" v-if="detectType ===1">
				<div class="selected" style="text-align:right">
					<a-button type="primary" size="small" @click="addDeep">增加深度</a-button>
				</div>
				<a-table :columns="deepColumns" :data-source="depth" size="small" :pagination="false" :scroll={y:167}
						 style="width:250px;height:235px">
					<template
						slot="deep"
						slot-scope="text, record, index"
					>
						<!-- <div>
						  <a-input
							style="margin: -5px 0"
							:value="text"
							@change="e => handleChange(e.target.value, index,'deep')"
						  />
						</div> -->
						<div :class="currentDeep === index ? 'currentDeep' : 'editable-cell-text-wrapper'">
							<div v-if="editable[index]" class="editable-cell-input-wrapper">
								<a-input :value="text" @change="e => handleChange(e.target.value, index,'deep')"
										 @pressEnter="check(index)"/>
								<a-icon
									type="check"
									class="editable-cell-icon-check"
									@click="check(index)"
								/>
							</div>
							<div v-else class="editable-cell-text-wrapper">
								<a href="javascript:;" @click="openDeep(record,index)"
								   style="margin-right:20px;">{{ text }}</a>
								<a-icon type="edit" class="editable-cell-icon" @click="edit(index)"/>
							</div>
						</div>
					</template>
					<template slot="operation" slot-scope="text, record,index">
						<a href="javascript:;" @click="deleteDep(record,index)"
						   style="margin-right:10px;color: #40a9ff;">删除</a>
						<a href="javascript:;" @click="copy(record,index)">复制</a>
					</template>
				</a-table>
				<div class="btnGroups">
					<a-button type="primary" @click="saveDeep">保存</a-button>
					<a-button @click="cancel">取消</a-button>
				</div>
			</div>

			<div style="flex:1">
				<div class="selected" style="text-align:center">
					<span>{{ `已选择项目(共${depth && depth[currentDeep] && depth[currentDeep].selectedList ? depth[currentDeep].selectedList.length : 0}个)` }}</span>
					<div class="otherGroups" v-if="detectType ===0">
						<a-button type="primary" @click="saveDeep">保存</a-button>
						<a-button @click="cancel">取消</a-button>
					</div>
				</div>
				<a-table :columns="listColumns" :data-source="selectedList" size="small" :pagination="false"
						 :scroll={y:200}>
					<template slot="customerAppoint" slot-scope="text, record,index">
						<a-switch @change="e => selectApp(e, record,index)"
								  :checked="selectedList[index].customerAppoint"/>
					</template>
					<template slot="operation" slot-scope="text, record,index">
						<a href="javascript:;" @click="deletePro(record,index)" style="color: #40a9ff;">删除</a>
					</template>
				</a-table>
			</div>
		</div>
		<section style="display:flex">
			<a-menu style="width: 100px" mode="vertical" :default-selected-keys="['1']" @select="selectMenu">
				<a-menu-item v-for="item in menuList" :key="item.key">
					{{ item.name }}
				</a-menu-item>
			</a-menu>
			<div v-if="currentMenu == 2" style="width:270px">
				<div>
					<a-form layout="inline" :form="form">
						<a-form-item label="分组名称：">
							<a-input v-model="form.groupName" @keyup.enter.native="searchGroup"/>
						</a-form-item>
					</a-form>
					<a-table
						:columns="projectColumns"
						:data-source="groupList"
						size="small"
						:customRow="clickRow"
						:rowClassName="rowPointer"
						:pagination="false"
					/>
				</div>
			</div>
			<div style="flex:1">
				<div>
					<a-form-model layout="inline" :form="form" v-if="currentMenu == 1">
						<a-form-model-item label="项目名称：">
							<a-input v-model="form.itemName" @keyup.enter.native="searchPro"/>
						</a-form-model-item>
						<a-form-model-item label="方法编号：">
							<a-input v-model="form.methodCode" @keyup.enter.native="searchPro"/>
						</a-form-model-item>
					</a-form-model>
					<a-table
						:row-selection="(depth.length > 0 || detectType === 0) ? { selectedRowKeys: selectedRowKeys, onChange: onSelectChange} : null"
						:columns="listColumns.filter(item=>item.sign)"
						:data-source="searchList"
						size="small"
						:pagination="pagination"
						@change="changePage"
						rowKey="id"
						:scroll={y:400}
					/>
				</div>
			</div>
		</section>
		<!-- <div slot="footer" class="dialog-footer">
		  <el-button type="primary">保存</el-button>
		  <el-button @click="cancel">取消</el-button>
		</div> -->
	</el-dialog>
</template>
<script>
import {getItemList, getGroupList, getGroupItemList} from '@/api/envCheckScheme/config'
import {mapGetters} from 'vuex'

const deepColumns = [
	{
		title: '深度',
		dataIndex: 'deep',
		align: 'center',
		scopedSlots: {customRender: 'deep'},
	}, {
		title: '操作',
		dataIndex: 'operation',
		align: 'center',
		scopedSlots: {customRender: 'operation'},
	},
]
const listColumns = [
	{
		title: '序号',
		width: 50,
		dataIndex: 'index',
		sign: false,
		customRender: (text, record, index) => `${index + 1}`,
		scopedSlots: {customRender: 'index'},
	},
	{
		title: '项目名称',
		dataIndex: 'itemNameCn',
		sign: true,
		scopedSlots: {customRender: 'itemNameCn'},
	}, {
		title: '方法编码',
		dataIndex: 'methodCode',
		sign: true,
		scopedSlots: {customRender: 'methodCode'},
	}, {
		title: '子法名称',
		dataIndex: 'childMethodName',
		sign: true,
		scopedSlots: {customRender: 'childMethodName'},
	}, {
		title: '基质',
		dataIndex: 'stroma',
		sign: true,
		scopedSlots: {customRender: 'stroma'},
	}, {
		title: '现场检测',
		dataIndex: 'isScene',
		sign: true,
		scopedSlots: {customRender: 'isScene'},
		customRender: (text, record, index) => text ? '是' : '否',
	}, {
		title: '客户指定',
		dataIndex: 'customerAppoint',
		sign: false,
		scopedSlots: {customRender: 'customerAppoint'},
	}, {
		title: '操作',
		dataIndex: 'operation',
		sign: false,
		scopedSlots: {customRender: 'operation'},
	},
]
const projectColumns = [{
	title: '序号',
	width: 50,
	align: 'center',
	dataIndex: 'index',
	customRender: (text, record, index) => `${index + 1}`,
},
	{
		title: '分组名称',
		dataIndex: 'groupName',
		align: 'center',
	}]
export default {
	data() {
		return {
			depth: [],
			searchList: [],
			selectedList: [],
			deepColumns,
			listColumns,
			projectColumns,
			form: {},
			groupList: [],
			selectedRowKeys: [],
			currentMenu: 1,
			editable: [],
			customerAppoint: [],
			currentDeep: 0,
			pagination: {
				total: 0,
				pageSize: 100,
				showSizeChanger: true,
				pageSizeOptions: ['100', '500', '1000']
			},
			params: {
				pageNum: 1,
				pageSize: 100
			},
			menuList: [{
				key: '1',
				name: '按项目'
			}, {
				key: '2',
				name: '按分组'
			}]
		}
	},
	props: {
		addShow: {
			type: Boolean,
			default: false,
		},
		activePoint: {
			type: Array,
		},
		editDepth: {
			type: Object
		},
		detectTypeId: {
			type: Number
		}
	},
	computed: {
		...mapGetters([
			'detectType',
		])
	},
	methods: {
		open() {
			this.init()
			this.getGroup()
			this.refill()
			// console.log(this.editDepth)
		},
		init() {
			let params = Object.assign(this.form, this.params);
			getItemList(params, this.detectTypeId).then(res => {
				this.searchList = res.data.list
				this.pagination.total = res.data.total;
			})
		},
		refill() {
			if (this.editDepth.depth && this.editDepth.depth.length > 0) {
				this.depth = JSON.parse(JSON.stringify(this.editDepth?.depth))
				this.selectedList = this.depth[0]?.selectedList || []
				this.selectedRowKeys = this.depth[0]?.selectedRowKeys || []
				// this.selectedList.map((item,index1)=>{
				//   this.$set(this.selectedList[index1],'customerAppoint',val)
				// })
			}
		},
		getGroup() {
			getGroupList({groupName: this.form.groupName}, this.detectTypeId).then(res => {
				this.groupList = res.data
			})
		},
		cancel() {
			this.$emit("update:addShow", false);
		},
		saveDeep() {
			if (this.depth.length > 0) {
				this.$emit('depth', this.depth)
				this.$emit('update:addShow', false)
			} else {
				this.$message.warning('请添加项目')
			}

		},
		clickRow(record) {
			return {
				on: { // 事件
					click: (event) => {
						// console.log(record)
						let params = {
							groupId: record.id,
							query: this.params
						}
						console.log(this.detectTypeId);
						getGroupItemList(params, this.detectTypeId).then(res => {
							this.searchList = res.data.list
						})
					},
				},
			}
		},
		deletePro(record, index) {
			const selectedList = [...this.selectedList];
			const selectedRowKeys = [...this.selectedRowKeys];
			this.selectedList = selectedList.filter(item => item.id !== record.id);
			this.selectedRowKeys = selectedRowKeys.filter(item => item !== record.id);
			this.depth[this.currentDeep].selectedList = this.selectedList;
			this.depth[this.currentDeep].selectedRowKeys = this.selectedRowKeys
		},
		deleteDep(record, key) {
			const depth = [...this.depth];
			this.depth = depth.filter((item, index) => key !== index);
			this.editable.splice(key, 1);
		},
		rowPointer() {
			return 'rowPointer'
		},
		handleChange(value, key, column) {
			const target = [...this.depth];
			target[column] = value;
			this.depth[key].deep = target[column];

			// console.log(this.depth)
		},
		selectApp(val, col, index) {
			this.$nextTick(() => {
				this.$set(this.selectedList[index], 'customerAppoint', val)
				this.$forceUpdate();

				// console.log(val,col)
			})
		},
		searchPro() {
			this.init()
		},
		searchGroup() {
			this.getGroup()
		},
		addDeep() {
			this.depth.push({})
		},
		copy(record, index) {
			const temp = JSON.parse(JSON.stringify(record))
			this.depth.push(temp)
		},
		onSelectChange(selectedRowKeys, selectedRows) {
			// console.log( selectedRowKeys,selectedRows);
			// this.selectedList = selectedRows;
			const temp = JSON.parse(JSON.stringify(this.selectedList))
			let arr = []
			temp.map(item => {
				if (item.customerAppoint) {
					arr.push(item.id)
				}
			})
			// this.selectedList.splice(0, this.selectedList.length, ...JSON.parse(JSON.stringify(selectedRows)));
			let waitPushList = selectedRows.filter(s => !this.selectedRowKeys.includes(s.id));
			this.selectedList.splice(this.selectedList.length, waitPushList.length, ...JSON.parse(JSON.stringify(waitPushList)));
			this.selectedList = this.selectedList.filter(s => selectedRowKeys.includes(s.id));
			this.selectedList.map(item => {
				item.customerAppoint = false
				if (arr.includes(item.id)) {
					// console.log(item)
					item.customerAppoint = true
				}

			});
			this.selectedRowKeys = selectedRowKeys;
			if (this.detectType === 1) {
				if (this.depth[this.currentDeep].deep) {
					this.depth[this.currentDeep].selectedList = this.selectedList
				} else {
					this.depth.splice(this.currentDeep, 1, {selectedList: this.selectedList})
				}
			} else {
				this.depth.splice(this.currentDeep, 1, {selectedList: this.selectedList})
				// this.depth[this.currentDeep].selectedList = this.selectedList;
			}
			this.depth[this.currentDeep].selectedRowKeys = selectedRowKeys
		},
		changePage(pagination) {
			this.params.pageNum = pagination.current
			this.params.pageSize = pagination.pageSize
			this.init()
		},
		openDeep(record, index) {
			console.log(record, index)
			this.currentDeep = index;
			this.selectedList = this.depth[this.currentDeep].selectedList || [];
			this.selectedRowKeys = this.depth[this.currentDeep].selectedRowKeys || []
			this.$forceUpdate();
			// console.log(this.customerAppoint)
		},
		selectMenu(item) {
			// console.log(item)

			this.form = {};
			if (item.key == 1) {
				this.init()
			}
			this.currentMenu = item.key
		},
		check(index) {
			console.log('check', index);
			this.$set(this.editable, index, false)
		},
		edit(index) {
			this.$set(this.editable, index, true)
		},
		close() {
			this.depth = [];
			this.groupList = [];
			this.searchList = []
			this.selectedList = []
			this.selectedRowKeys = []
			this.currentDeep = 0
			this.form = {}
		}
	}
}
</script>
<style lang="less" scoped>
	/deep/ .currentDeep{
		background: #c1f1ff;
	}
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

/deep/ .contain {
	position: relative;
	text-align: center;
}

/deep/ .btnGroups {
	position: absolute;
	bottom: 0;
	width: 100%;

	.ant-btn {
		margin-right: 20px;
	}
}

/deep/ .otherGroups {
	position: absolute;
	right: 25px;

	.ant-btn {
		margin-right: 20px;
	}
}
</style>

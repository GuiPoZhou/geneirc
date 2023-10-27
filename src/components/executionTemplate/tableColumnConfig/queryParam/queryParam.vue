<template>
	<div>
		<el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
			<el-row>
				<el-form-item :label="item.label" :prop="item.id" v-for="item in getQueryParam" v-show="!item.searchHidden">

					<el-col>

						<el-input size="small" v-model="queryParams[item.id]" placeholder="请输入默认查询条件"
							v-if="item.searchType === 0" />

						<el-select size="mini" v-model="queryParams[item.id]" filterable :placeholder="'请选择查询逻辑'"
							placeholder="请选择" v-else-if="item.searchType === 2" :clearable="true">
							<el-option :key="subItem.key" :value="subItem.key" :label="subItem.label"
								v-for="subItem in item.staticOptions" v-if="item.selectOptionType === 1" />
							<el-option :key="subItem.key" :value="subItem.key" :label="subItem.label"
								v-for="subItem in cacheRemoteDataSource[item.dynamicUrl]"
								v-if="item.selectOptionType === 2" />
							<el-option :key="subItem.key" :value="subItem.key" :label="subItem.label"
								v-for="subItem in cacheRemoteDataSource[item.bindDataSourceId]"
								v-if="item.selectOptionType === 3" />
						</el-select>
						<selectTree size="mini" v-model="queryParams[item.id]" filterable :placeholder="'请选择查询逻辑'"
							placeholder="请选择" v-else-if="item.searchType === 7" :clearable="true" :config="item"
							:dataSource="cacheRemoteDataSource[item.bindDataSourceId]"></selectTree>

						<el-input-number v-model="queryParams[item.id]" controls-position="right"
							v-else-if="item.searchType === 1 && item.searchLogic !== 7" />

						<el-row v-else-if="item.searchType === 1 && item.searchLogic === 7">
							<el-col :span="24">
								<NumberRange v-model="queryParams[item.id]" />
							</el-col>
						</el-row>
						<el-row v-else-if="item.searchType === 4">
							<el-col :span="24">
								<el-time-picker v-model="queryParams[item.id]" value-format="HH:mm:ss" size="small"
									placeholder="请选择时间" v-if="item.searchLogic !== 7" />
								<el-time-picker is-range v-model="queryParams[item.id]" value-format="HH:mm:ss" size="small"
									range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"
									v-if="item.searchLogic === 7" />
							</el-col>
						</el-row>
						<el-row v-else-if="item.searchType === 5">
							<el-col :span="24">
								<el-date-picker v-model="queryParams[item.id]" value-format="yyyy-MM-dd" size="mini"
									align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions"
									v-if="item.searchLogic !== 7" />
								<el-date-picker v-model="queryParams[item.id]" value-format="yyyy-MM-dd" size="mini"
									type="daterange" align="right" unlink-panels range-separator="至"
									start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerRangeOptions"
									v-if="item.searchLogic === 7" />
							</el-col>
						</el-row>
						<el-row v-else-if="item.searchType === 6">
							<el-col :span="24">
								<el-date-picker v-model="queryParams[item.id]" value-format="yyyy-MM-dd HH:mm:ss"
									size="small" type="datetime" placeholder="选择日期时间" align="right"
									:picker-options="pickerOptions" v-if="item.searchLogic !== 7" />
								<el-date-picker v-model="queryParams[item.id]" value-format="yyyy-MM-dd HH:mm:ss"
									size="mini" style="width: 100%" type="datetimerange" align="right" unlink-panels
									range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
									:picker-options="pickerRangeOptions" v-if="item.searchLogic === 7" />
							</el-col>
						</el-row>
					</el-col>

				</el-form-item>
				<el-form-item>
					<el-col>
						<el-button type="primary" style="margin-right: 0.6rem;" icon="el-icon-search" size="mini"
						@click="getList">搜索</el-button>
					<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
					</el-col>
					
				</el-form-item>
			</el-row>
		</el-form>
	</div>
</template>

<script>
import {
	getPageConfig,
	getDynamicData,
	getExecutionList,
	submitProcess,
} from "@/api/runDynamicPage/config";
import {
	getBusinessData,
} from "@/api/tableColumnConfig/api.js";

import NumberRange from "@/components/executionTemplate/tableColumnConfig/queryParam/NumberRange.vue";
import selectTree from "@/components/executionTemplate/tableColumnConfig/queryParam/selectTree.vue";
export default {
	name: "queryParam",
	components: {
		NumberRange,
		selectTree
	},
	props: {
		finalTableConfig: {
			type: Object,
			default: null
		}
	},
	data() {
		return {
			queryParams: {},
			defaultQueryParams: {},
			cacheRemoteDataSource: {},
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() > Date.now();
				},
				shortcuts: [{
					text: '今天',
					onClick(picker) {
						picker.$emit('pick', new Date());
					}
				}, {
					text: '昨天',
					onClick(picker) {
						const date = new Date();
						date.setTime(date.getTime() - 3600 * 1000 * 24);
						picker.$emit('pick', date);
					}
				}, {
					text: '一周前',
					onClick(picker) {
						const date = new Date();
						date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
						picker.$emit('pick', date);
					}
				}]
			},

			pickerRangeOptions: {
				shortcuts: [{
					text: '最近一周',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近一个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近三个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
						picker.$emit('pick', [start, end]);
					}
				}]
			},
		}
	},
	//计算属性 类似于data概念
	computed: {
		getQueryParam() {
			if (this.finalTableConfig && this.finalTableConfig.allColumns) {
				let queryConfigList = this.finalTableConfig.allColumns.filter(item => item.search)
				return queryConfigList;
			}
			return null;
		}
	},
	//监控data中的数据变化
	watch: {
		finalTableConfig(val) {
			let queryConfigList = val.allColumns.filter(item => item.search);
			queryConfigList.forEach(item => {
				if (item.hasOwnProperty('sysQueryType')) {
					if (item.sysQueryType) {
						if (item.sysQueryValue === 0) {
							this.$set(this.queryParams, item.id, this.$store.state.user.userInfo.userId);
						} else if (item.sysQueryValue === 1) {
							this.$set(this.queryParams, item.id, this.$store.state.user.userInfo.nickName);
						} else if (item.sysQueryValue === 2) {
							this.$set(this.queryParams, item.id, this.$store.state.user.userInfo.dept.deptId);
						} else if (item.sysQueryValue === 3) {
							this.$set(this.queryParams, item.id, this.$store.state.user.userInfo.dept.deptName);
						}
					} else if (item.hasOwnProperty('defaultQueryValue')) {
						this.$set(this.queryParams, item.id, item.defaultQueryValue);
					}
				} else if (item.hasOwnProperty('defaultQueryValue')) {
					this.$set(this.queryParams, item.id, item.defaultQueryValue);
				}
				if (item.hasOwnProperty('selectOptionType')) {
					if (item.selectOptionType === 1) {
						item.staticOptions.forEach(subItem => {
							if (subItem.default) {
								this.$set(this.queryParams, item.id, subItem.key);
							}
						})
					} else {
						this.loadRemoteDataSource(item);
					}
				}
			})
			Object.assign(this.defaultQueryParams, this.queryParams);
			this.getList();
		}
	},
	//方法集合
	methods: {
		getList() {
			for (let key in this.queryParams) {
				console.log(key, this.queryParams[key], this.queryParams[key] === null, this.queryParams[key] === undefined, this.queryParams[key] === '');
				if (this.queryParams[key] === null || this.queryParams[key] === undefined || this.queryParams[key] === '') {
					delete this.queryParams[key];
				}
			}
			this.$emit('getList', this.queryParams);
		},
		resetQuery() {
			// let queryConfigList = this.finalTableConfig.allColumns.filter(item => item.search);
			// queryConfigList.forEach(item => {
			//   if(item.hasOwnProperty('defaultQueryValue')){
			//     this.$set(this.queryParams, item.id, item.defaultQueryValue);
			//   }
			//   if(item.hasOwnProperty('selectOptionType')){
			//     if(item.selectOptionType === 1){
			//       item.staticOptions.forEach(subItem => {
			//         if(subItem.default){
			//           this.$set(this.queryParams, item.id, subItem.key);
			//         }
			//       })
			//     }else{
			//       this.loadRemoteDataSource(item);
			//     }
			//   }
			// })
			let tempQueryParam = {};
			Object.assign(tempQueryParam, this.defaultQueryParams);
			for (let key in tempQueryParam) {
				console.log(key, tempQueryParam[key], tempQueryParam[key] === null, tempQueryParam[key] === undefined, tempQueryParam[key] === '');
				if (tempQueryParam[key] === null || tempQueryParam[key] === undefined || tempQueryParam[key] === '') {
					delete tempQueryParam[key];
				}
			}
			this.$set(this, 'queryParams', tempQueryParam);
			this.$emit('reset')
			// this.resetForm("queryForm");
			this.getList();
		},
		getListQueryParams() {
			return this.queryParams;
		},
		loadRemoteDataSource(item) {
			console.log('loadRemoteDataSource', item);
			if (item.selectOptionType === 2 && (!this.cacheRemoteDataSource || !this.cacheRemoteDataSource[item.dynamicUrl] || this.cacheRemoteDataSource[item.dynamicUrl].length < 1)) {
				getDynamicData(item.dynamicUrl).then(res => {
					let dataSource = [];
					if (res && res.data) {
						res.data.forEach((row, key) => {
							dataSource.push({
								key: row[item.dynamicKeyName],
								value: row[item.dynamicKeyName],
								label: row[item.dynamicLabelName],
							});
						});
					}
					this.$set(this.cacheRemoteDataSource, item.dynamicUrl, dataSource);
				})
			} else if (item.selectOptionType === 3) {
				getBusinessData(item.bindDataSourceId).then(res => {
					console.log('loadRemoteDataSource getBusinessData', res);
					if (res && res.data) {
						let tempOptions = res.data[item.selectTreeLabel];
						console.log('loadRemoteDataSource tempOptions', tempOptions);
						let dataSource = [];
						if (tempOptions instanceof Array) {
							tempOptions.forEach(record => {
								dataSource.push({
									key: record[item.dataSourceKey],
									value: record[item.dataSourceKey],
									label: record[item.dataSourceLabel],
									parentId: record[item.dataSourceParentKey],
								});
							})
						} else if (tempOptions instanceof Object) {
							dataSource.push({
								key: tempOptions[item.dataSourceKey],
								value: tempOptions[item.dataSourceKey],
								label: tempOptions[item.dataSourceLabel],
							});
						}
						this.$set(this.cacheRemoteDataSource, item.bindDataSourceId, dataSource);
					}
				})
			}
		}
	},
	//生命周期 - 创建完成（可以访问当前this实例）
	created() {
	},
	//生命周期 - 挂载完成（可以访问DOM元素）
	mounted() {
	},
	//生命周期 - 创建之前
	beforeCreate() {
	},
	//生命周期 - 挂载之前
	beforeMount() {
	},
	//生命周期 - 更新之前
	beforeUpdate() {
	},
	//生命周期 - 更新之后
	updated() {
	},
	//生命周期 - 销毁之前
	beforeDestroy() {
	},
	//生命周期 - 销毁完成
	destroyed() {
	},
	//如果页面有keep-alive缓存功能，这个函数会触发
	activated() {
	}
};
</script>

<style scoped>
/deep/ .sangelxiu1_right {
	position: relative;
	margin-left: auto;
}</style>

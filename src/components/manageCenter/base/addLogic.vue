<template>
	<el-dialog title="逻辑模块" :visible.sync="addLogicShow" append-to-body width="800px"
			   center :close-on-press-escape="false" :close-on-click-modal="false" @open="open" @close="close">
		<el-form ref="queryForm" :model="rules" label-width="80px">
			<el-form-item label="模块排序" style="width:300px">
				<el-input v-model="rules.logicSort"/>
			</el-form-item>
			<el-form-item label="模块说明">
				<el-input v-model="rules.logicExplain"/>
			</el-form-item>
			<!-- 1.日期时间、2.固定值、3.随机数、4.按时间串计数、5.groovy表达式、6.引用其他 -->
			<el-form-item label="格式" v-if="logicModule === 1">
				<el-input v-model="rules.logicContent"/>
				<el-row style="line-height:28px">
					日期格式说明：
				</el-row>
				<el-row style="line-height:20px">
					y：年；M：月；d：日
				</el-row>
				<el-row style="line-height:20px">
					H：时；m：分；s：秒
				</el-row>
			</el-form-item>
			<el-form-item label="内容" v-else-if="logicModule === 2">
				<el-input v-model="rules.logicContent"/>
			</el-form-item>
			<el-form-item label="长度" v-else-if="logicModule === 3">
				<el-input v-model="rules.logicLength" maxlength="2"/>
			</el-form-item>
			<section v-else-if="logicModule === 4">
				<el-form-item label="长度">
					<el-input v-model.number="rules.logicLength" maxlength="2"/>
				</el-form-item>
				<el-form-item label="时间格式">
					<el-select v-model="rules.logicContent" placeholder="请选择">
						<el-option
							v-for="item in options"
							:key="item"
							:label="item"
							:value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="上次">
					<el-input v-model="rules.lastValue"/>
				</el-form-item>
			</section>
			<section v-else-if="logicModule === 5">
				<el-form-item label="长度">
					<el-input v-model="rules.logicLength" maxlength="2"/>
				</el-form-item>
				<el-form-item label="表达式">
					<el-input type="textarea" v-model="rules.logicExpression"/>
				</el-form-item>
			</section>
			<section v-else>
				<el-form-item label="格式">
					<el-input v-model="rules.ruleName" style="width:200px" readonly/>
				</el-form-item>
				<a-table :columns="columns" :data-source="tableData" :pagination="false" bordered :customRow="rowClick" size="small"/>
			</section>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save">保存</el-button>
			<el-button @click="close">取消</el-button>
		</div>
	</el-dialog>
</template>
<script>
	import {mapState} from 'vuex';
	import {updateEncodingRuleLogic, createEncodingRuleLogic, getEncodingRuleLogic} from '@/api/manageCenter/baseConfig'
	import store from "../../../store";
	import {Message} from "element-ui";

	const columns = [
		{
			title: '编码名称',
			dataIndex: 'ruleName',
		}, {
			title: '序号',
			dataIndex: 'index',
			customRender: (text, record, index) => `${index + 1}`,
		}, {
			title: '元素名称',
			dataIndex: 'logicModule',
			customRender: (text, record, index) => modules.filter(item => item.value === text)[0].label,
		}, {
			title: '描述信息',
			dataIndex: 'logicExplain',
		},
	]
	const modules = [{
		value: 1,
		label: '日期时间'
	}, {
		value: 2,
		label: '固定值'
	}, {
		value: 3,
		label: '随机数'
	}, {
		value: 4,
		label: '按时间串计数'
	}, {
		value: 5,
		label: 'groovy表达式'
	}, {
		value: 6,
		label: '引用其他'
	}]
	export default {
		data() {
			return {
				rules: {},
				tableData: [],
				columns,
				search: '',
				logicElement: '',
				options: ['yyyy', 'MM', 'dd'],
				rowClick: record => ({
					on: {
						click: () => {
							console.log(record)
							this.$set(this.rules, 'logicElement', record.id)
							this.$set(this.rules, 'ruleName', record.ruleName)
							// this.rules.logicElement = record.id;
							// this.rules.ruleName = record.ruleName
						}
					}
				})
			}
		},
		props: {
			addLogicShow: {
				type: Boolean,
				default: false,
			},
			logicModule: '',
			editData: {},
			editId: null,
			ruleType: ''
		},
		methods: {
			open() {
				this.rules = JSON.parse(JSON.stringify(this.editData))
				if (this.logicModule === 6) {
					getEncodingRuleLogic({logicModule: 4, ruleType: this.ruleType}).then(res => {
						this.tableData = res.data
					})
				}
			},
			close() {
				this.$emit("update:addLogicShow", false);
			},
			save() {
				if (this.rules.id) {
					updateEncodingRuleLogic(this.rules.id, this.rules).then(res => {
						this.saveAfterClose();
					}).catch(err => {
						console.info(err);
					})
				} else {
					if (this.editId) {
						this.rules.ruleId = this.editId;
						this.rules.logicModule = this.logicModule;
						createEncodingRuleLogic(this.rules).then(res => {
							this.saveAfterClose();
						}).catch(err => {
							console.info(err);
						})
					} else {
						this.saveAfterClose();
					}
				}
				console.log(this.rules)
			},
			saveAfterClose() {
				this.rules.logicModule = this.logicModule
				this.$emit("update:addLogicShow", false);
				this.$emit("getLogic", this.rules);
			}
		}
	}
</script>

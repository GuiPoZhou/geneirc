<template>
	<div>
		<div class="btnbox">
			<el-button type="primary" @click="addNotice" :disabled="disabled"
			>添加
			</el-button
			>
			<el-button type="success" @click="handlePrint" :disabled="!ids.length > 0"
			>打印
			</el-button
			>
			<el-button type="primary" @click="next" :disabled="disabled"
			>完成
			</el-button
			>
		</div>
		<p class="tabtit">管评通知列表</p>
		<el-table
			ref="multipleTable"
			:data="noticeData"
			stripe
			border
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" width="55"/>
			<el-table-column label="序号" align="center" type="index" width="50"/>
			<el-table-column prop="serial" label="通知编号" show-overflow-tooltip/>
			<el-table-column
				prop="planSerial"
				label="管评计划编号"
				show-overflow-tooltip
			/>
			<el-table-column
				prop="personNames"
				label="参加评审人员"
				show-overflow-tooltip
			/>
			<el-table-column
				prop="meetingTime"
				label="评审会议时间"
				show-overflow-tooltip
			/>
			<el-table-column prop="location" label="评审地点" show-overflow-tooltip/>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button size="mini" type="text" @click="lookNotice(scope.row.id)"
					>查看
					</el-button
					>
					<el-button
						size="mini"
						type="text"
						v-if="!disabled"
						@click="editNotice(scope.row.id)"
					>修改
					</el-button
					>
					<el-button
						size="mini"
						type="text"
						v-if="!disabled"
						@click="delNotice(scope.row.id)"
					>删除
					</el-button
					>
				</template>
			</el-table-column>
		</el-table>
		<pagination
			v-show="total > 0"
			:total="total"
			:page.sync="queryParams.pageNum"
			:limit.sync="queryParams.pageSize"
			@pagination="getList"
			style="height: 30px"
		/>
		<!--添加/查看/修改实施计划-->
		<noticeForm
			v-if="shownotice"
			ref="notices"
			@complete="complete"
			@close="shownotice = false"
		></noticeForm>
	</div>
</template>

<script>
	import noticeForm from '../implement/noticeForm'
	import {
		getNoticeList,
		getNoticeInfo,
		delNotice
	} from '@/api/qualityAssurance/managementReview/auditImplement'

	export default {
		name: 'notice',
		components: { noticeForm },
		data() {
			return {
				shownotice: false,
				noticeData: [],
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					planId: 0
				},
				total: 0,
				formData: {},
				ids: []
			}
		},
		props: {
			id: 0,
			disabled: false
		},
		mounted() {
			this.getList()
		},
		methods: {
			next() {
				this.$emit('nextStep', {
					planId: this.id,
					progress: 2
				})
			},
			addNotice() {
				this.shownotice = true

				this.$nextTick(() => {
					this.$refs.notices.init('add', this.formData)
				})
			},
			lookNotice(id) {
				this.shownotice = true
				getNoticeInfo(id).then((res) => {
					this.$nextTick(() => {
						this.$refs.notices.init('show', res.data)
					})
				})
			},
			editNotice(id) {
				this.shownotice = true
				getNoticeInfo(id).then((res) => {
					this.$nextTick(() => {
						this.$refs.notices.init('edit', res.data)
					})
				})
			},
			delNotice(id) {
				this.$confirm('确定删除该管评通知吗？', '提示').then((res) => {
					delNotice(id).then((res) => {
						this.$message.success('删除成功')
						this.getList()
					})
				})
			},
			setData(data) {
				console.log(data)
				this.formData = {
					planId: data.id,
					planSerial: data.serial
				}
			},
			complete() {
				this.getList()
				this.shownotice = false
			},
			getList() {
				this.queryParams.planId = this.id
				getNoticeList(this.queryParams).then((res) => {
					console.log(' res.data.list;', res.data.list)
					this.noticeData = res.data.list
					this.total = res.data.total
					this.noticeData.map((item) => {
						let list = item.personNames.split(',')
						let arr = []
						list.map((item1) => {
							arr.push(item1)
						})
						arr = this.repeat(arr)
						console.log('arr', arr)
						item.personNames = arr.join(',')

					})
				})
			},
			repeat(data) {
			  for (let i = 0; i < data.length - 1; i++) {
				  for (let j = 1; j < data.length; j++) {
					  if (i != j) {
						  if (data[i] == data[j]) {
							  data.splice(j, 1)
							  j--
						  }
					  }
				  }
			  }
			  return data
			},
			/***多选框选中数据***/
			handleSelectionChange(selection) {
				this.ids = selection.map((item) => item.id)
			},
			// 打印
			handlePrint() {
				var ids = this.ids.join(',')
				POBrowser.openWindowModeless(
					process.env.VUE_APP_BASE_API +
					'/qualityControl/pageOffice/printManagementReviewNoticeTwo?ids=' +
					ids,
					'width=1440px;height=860px'
				)
			}
		}
	}
</script>

<style scoped>
</style>

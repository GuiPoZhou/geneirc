<template>
	<div class="groupAdd">
		<el-dialog :title="title" :visible.sync="addShow" append-to-body width="800px" center :show-close="true"
				   @close="close" :close-on-press-escape="false" :close-on-click-modal="false">
			<el-form :model="addParam" :rules="rules" ref="addForm" label-width="88px">
				<el-form-item label="小组人员">
					<el-button type="primary" @click="selectOrgan">选择</el-button>
				</el-form-item>
			</el-form>

			<!-- 表格 -->
			<el-table v-loading="loading" :data="selectedUser">
				<el-table-column prop="id" type="index" label="序号" width="55px"/>
				<el-table-column prop="userName" label="人员姓名"/>
				<el-table-column prop="userDeptName" label="所属部门"/>
				<el-table-column prop="isGroupLeader" label="是否组长">
					<template slot-scope="scope">
						<el-radio v-model="addParam.teamLeader" :label="scope.row.userId">{{ '' }}</el-radio>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button slot="reference" size="mini" type="text" icon="el-icon-delete"
								   @click="handleDelete(scope.row.userId)">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="save()" center>保存</el-button>
				<el-button @click="close">取消</el-button>
			</div>
		</el-dialog>

		<treeTransfer
			v-if="showTransfer"
			ref="transfer"
			@close="showTransfer = false"
			@handleData="handleData"
		></treeTransfer>
<!--		<selectUser :visible.sync="userShow" v-if="userShow" @backfill="backfillUser" ref="users"/>-->
	</div>
</template>
<script>
import treeTransfer from "@/views/qualityAssurance/common/treeTransfer.vue"
// import selectUser from '@/components/common/selectUser'
import {add, getDetailById, update} from '@/api/resources/samplingTeam/samplingTeam'
import { choiceUser } from "@/api/qualityAssurance/index";

import {Message} from 'element-ui'

export default {
	components: {
		treeTransfer,
		// selectUser,
	},
	data() {
		return {
			addParam: {
				//组长
				teamLeader: undefined,
				teamLeaderName: undefined,
			},

			rules: {
				teamName: [{required: true, message: '请输入小组名称', trigger: 'blur'}],
			},

			loading: false,
			//是否显示人员列表
			userShow: false,
			//选中的人员
			selectedUser: [],
			teamId: undefined,
			showTransfer: false
		}
	},
	props: {
		//是否添加页面
		addShow: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		//取消按钮操作
		close() {
			this.$emit('update:addShow', false)
			this.addParam.teamLeader = undefined
		},
		// 选择人员
		selectOrgan() {
			this.showTransfer = true;
			var data = [];
			for (var i in this.selectedUser) {
				data.push(this.selectedUser[i].userId);
			}
			choiceUser().then((res) => {
				this.$nextTick(() => {
					this.$refs.transfer.init(res.data, data);
				});
			});
		},
		//选择人员
		handleData(data) {
			console.log(data)
			this.selectedUser = []
			for (var j in data) {
				this.selectedUser.push({
					userId: data[j].id,
					userName: data[j].label,
					userDeptId: data[j].userDeptId,
					userDeptName: data[j].userDeptName,
					status: 1
				});
			}
		},
		array_uniq(input_arr) {
			var h = {};
			var arr = [];
			for (var i = 0; i < input_arr.length; i++) {
				if (!h[JSON.stringify(input_arr[i])]) {
					h[JSON.stringify(input_arr[i])] = true;
					arr.push(input_arr[i]);
				}
			}
			return arr;
		},
		//删除
		handleDelete(userId) {
			this.selectedUser.forEach((user, index, arr) => {
				if (user.userId == userId) {
					this.selectedUser.splice(index, 1)
				}
			})

			//重置组长
			if (this.addParam.teamLeader == userId) {
				this.addParam.teamLeader = undefined
			}
		},
		//重置添加表单
		initAdd(data) {
			this.selectedUser = data
			this.selectedUser.forEach(user => {
				if (user.isGroupLeader) {
					this.addParam.teamLeader = user.userId
					this.addParam.teamLeaderName = user.userName
				}
			})
		},

		//保存
		save() {
			this.$refs['addForm'].validate(valid => {
				if (valid) {
					if (this.selectedUser.length == 0) {
						Message({message: '请选择小组人员', type: 'error'})
						return
					}
					if (this.addParam.teamLeader == undefined) {
						Message({message: '请选择组长', type: 'error'})
						return
					}
					this.selectedUser.forEach(user => {
						if (this.addParam.teamLeader == user.userId) {
							user.isGroupLeader = true
							this.addParam.teamLeaderName = user.userName
						} else {
							user.isGroupLeader = false
						}
					})
					this.selectedUser.sort((a, b) => {
						return b.isGroupLeader - a.isGroupLeader
					})
					console.log('this.selectedUser',this.selectedUser)
					this.$emit("setUerData", this.selectedUser)
					this.close()
				}
			})
		},

		//回填选中的用户
		backfillUser(resultUsers) {
			let users = resultUsers.map(user => ({
				userId: user.userId,
				userName: user.userName,
				deptId: user.deptId,
				deptName: user.dept.deptName,
			}))

			let selectedIds = this.selectedUser.map(user => user.userId)

			users.forEach(user => {
				//没有则添加
				if (selectedIds.indexOf(user.userId) < 0) {
					this.selectedUser.push(user)
				}
			})
		},

		//显示人员选择框
		showUsers() {
			this.userShow = true
			// this.$refs.users.clearAll()
		},
	},
	computed: {
		title() {
			return '选择审核组长及成员'
		},
	},
	created() {
	},
	mounted() {
	},
}
</script>

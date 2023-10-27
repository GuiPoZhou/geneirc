<template>
	<el-dialog
		class="elDialog"
		center
		width="50%"
		:visible.sync="dialogShow"
		append-to-body
		title="选择成员"
	>
		<div class="tranferbox">
			<div class="conbox">
				<div class="titbox">
					<el-input size="mini" placeholder="搜索成员、部门" suffix-icon="el-icon-search"
							  v-model="filterText"></el-input>
				</div>
				<div class="wordbox">
					<el-tree
						:show-checkbox="ischecked"
						class="filter-tree"
						node-key="id"
						:data="dataLeft"
						:props="defaultProps"
						:filter-node-method="filterNode"
						@node-click="handleNodeClick"
						ref="tree"
					></el-tree>
				</div>
			</div>
			<el-button type="primary" style="margin: 0 10px" @click="getData" v-if="choice !== 'radio'">添加</el-button>
			<div class="conbox">
				<div class="titbox">
					<h2>已选择用户（{{ keyarr.length }}）</h2>
				</div>
				<div class="wordbox">
					<ul>
						<li v-for="(item,index) in keyarr" :key="index">
							<div class="inli">
								<i class="el-icon-s-custom"></i>
								<span>{{ item.label }}</span>
								<i class="el-icon-close" @click="removeData(item)"></i>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="handleOk">确定</el-button>
			<el-button @click="cancelbtn">取消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	export default {
		// props:['datas','defaultProps'],
		data() {
			return {
				input3: "",
				checkList: [],
				keyarr: [],
				filterText: "",
				defaultProps: {
					children: "children",
					label: "label",
				},
				dialogShow: false,
				dataLeft: [],
				checkedKeys: [],
				choice: "",
				ischecked: true,
			};
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			},
		},
		methods: {
			//关键词搜索
			filterNode(value, data) {
				if (!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			init(data, selectData, types) {
				console.log(types)
				this.dataLeft = data;
				this.dialogShow = true;
				console.log(selectData);

				if (types) {
					this.choice = types;
					if (types === "radio") {
						this.ischecked = false;
						if(selectData) {
							this.keyarr = [{label: selectData}]
						}
						return
					}
				}
				if (selectData !== undefined) {
					// 设置默认值 Array ids
					if (selectData.length > 0) {
						setTimeout((res) => {
							this.$refs.tree.setCheckedKeys(selectData, true);
							this.getData();
						}, 500);
					}
				}
			},
			handleNodeClick(data, node) {
				if(data.type == 2) {
					return
				}
				console.log(data, "当前节点的父节点:", node);
				console.log(this.choice);
				if (this.choice) {
					this.keyarr = [data];
				}
			},
			getData() {
				this.keyarr = [];
				this.checkList = this.$refs.tree.getCheckedNodes();
				this.checkListKeys = this.$refs.tree.getCheckedKeys();
				// console.log(this.$refs.tree.getNode(this.checkListKeys[0]).parent.data.id);
				if (this.checkList.length != 0) {
					for (var i = 0; i < this.checkList.length; i++) {
						if (!this.checkList[i].children) {
							// 获取父级
							if(this.checkList[i].type != 2) {
								var parent = this.$refs.tree.getNode(this.checkListKeys[i]).parent.data;
								this.checkList[i].userDeptId = parent.id
								this.checkList[i].userDeptName = parent.label
								this.keyarr.push(this.checkList[i])
							}
						}
					}
				} else {
					this.keyarr = []
				}
			},
			setCheckedNodes(arr) {
				this.$refs.tree.setCheckedNodes(arr);
			},
			removeData(data) {
				let checklist = this.keyarr;
				for (var i = 0; i < checklist.length; i++) {
					if (checklist[i].label === data.label) {
						checklist.splice(i, 1);
					}
				}
				this.keyarr = checklist;
				this.setCheckedNodes(this.keyarr);
			},
			cancelbtn() {
				this.$emit("close")
			},
			handleOk() {
				this.$emit("handleData", this.keyarr)
				this.cancelbtn()
			}
		}
	}
</script>

<style scoped lang="less">
	.tranferbox {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.conbox {
			height: 500px;
			border: 1px solid #e9eaed;
			border-radius: 2px;
			background: #fdfdfd;
			width: calc(50% - 35px);
			padding: 10px;

			.titbox {
				height: 29px;
				line-height: 29px;

				h2 {
					font-size: 14px
				}
			}

			.wordbox {
				font-size: 12px;
				height: 448px;
				margin-top: 10px;
				overflow-y: auto;

				.el-tree-node__label {
					font-size: 12px;
				}

				ul {
					li {
						.inli {
							display: flex;
							align-items: baseline;
							span {
								width: 100%;
								display: block;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
						}

						span {
							font-size: 14px;
							display: block;
							padding-left: 10px;
							padding-right: 5px;
						}

						.el-icon-s-custom {
							color: #93a9d3
						}

						.el-icon-close {
							color: #808080;
							cursor: pointer;
							font-size: 14px;
						}
					}
				}
			}
		}
	}
</style>

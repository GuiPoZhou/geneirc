<template>

	<!--	<el-dialog class="elDialog" center width="60%"
				   :visible.sync="dialogShow" :fullscreen="isFullScreen"
				   :modal-append-to-body="false" :modal="false" :show-close="false">
			<div slot="title" class="dialog-title">
				<span class="topTilte">选择库位</span>
				<div class="topRight">
					&lt;!&ndash; 最小化 &ndash;&gt;
					<i class="el-icon-minus rightIcon" v-if="isFullScreen" @click="e_changeBox(false)"></i>
					&lt;!&ndash; 最大化 &ndash;&gt;
					<i class="el-icon-full-screen rightIcon" v-if="!isFullScreen" @click="e_changeBox(true)"></i>
					&lt;!&ndash; 关闭 &ndash;&gt;
					<i class="el-icon-close rightIcon" @click="cancelbtn"></i>
				</div>
			</div>-->
	<el-table class="treeDiv" ref="singleTable" height="170" width="250" style="width: 100%" highlight-current-row @current-change="handleCurrentChange" :data="dataList" stripe border>
		<el-table-column label="序号" align="center" type="index"/>
		<el-table-column prop="storeSiteName" label="库位"/>
		<el-table-column prop="batchNumber" label="批号"/>
		<el-table-column prop="certificateNo" label="证书编号"/>
		<el-table-column prop="materialCount" label="库存数量"/>
	</el-table>
	<!--<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleOk()">确定</el-button>
				<el-button @click="cancelbtn">取消</el-button>
			</div>
		</el-dialog>-->
</template>

<script>


	export default {
		name: "stockSelect",

		data() {
			return {
				isFullScreen: false,
				dialogShow: true,
				selectIndex: -1,
				currentRow: ""
			}
		},
		props: {
			id: 0,
			isEditDetail: 0,
			isOrder: false,
			dataList: {
				type: Array,
				default: []
			}
		},
		created() {

		},
		methods: {
			e_changeBox(type) {
				this.isFullScreen = type;
			},
			setCurrent(row) {
				this.$refs.singleTable.setCurrentRow(row);
			},
			handleCurrentChange(val) {
				this.$emit('confims', val);
				// this.currentRow = val;
			},
			handleOk() {
				if (this.currentRow) {
					this.$emit('confims', this.currentRow);
				} else {
					this.$message.error('请选择库位')
				}
			},
			cancelbtn() {
				this.$emit('close');
			}
		}
	}
</script>

<style scoped lang="less">
	/deep/ .el-dialog__body .el-col {
		margin-bottom: 0;
	}

	.el-tabs__content {
	}

	/deep/ .el-tabs .el-tabs__content {
		overflow: initial !important;
	}

	/deep/ .el-dialog__body .el-table {
		background-color: #fff;
	}

	.tabDataHeader {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10px;

		h3 {
			font-weight: bold;
		}
	}

	.treeDiv {
		position: absolute;
		top: 40px;
		left: -1px;
		z-index: 1000;
		width: 100%;
		overflow: auto;
		//height: 100px;
		height: 200px;
		max-height: 200px;
	}
</style>

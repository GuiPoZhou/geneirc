<template>
	<div class="receiveTask">
		<el-dialog
			title="结果录入"
			:visible.sync="recordEntyShow"
			append-to-body
			@open="open"
			width="70%"
			center
			:close-on-press-escape="false"
			:close-on-click-modal="false"
			style="height: 100vh"
		>

			<iframe class="area" :src="url"></iframe>
			<div slot="footer">
				<el-button type="primary" @click="close">确定</el-button>
				<el-button @click="close">取消</el-button>
			</div>
		</el-dialog>

	</div>
</template>
<script>
export default {
	name: "recordResult",
	data() {
		return {
			recordEntyShow: false,
			url: ''
		};
	},
	props: {},
	methods: {
		init(url) {
			this.recordEntyShow = true
			this.url = url
		},
		close() {
			this.recordEntyShow = false
			this.$emit('close')
		}
	},
	created() {
	},
	mounted() {
	},
	updated() {
	}
};
</script>
<style lang="less" scoped>
.area {
	width: 100%;
	height: 800px;
}
</style>

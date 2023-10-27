<!--
 * @Autor: 焦政
 * @Date: 2021-06-16 17:28:17
 * @Description:
-->
<!-- @author Shiyn/   huangmx 20200807优化-->
<template>
	<div class="top-right-btn">
		<el-row>
			<el-tooltip
				placement="right"
				title="设置列表"
				trigger="click"
				width="420"
				style="margin:0 10px"
				content="设置列表"
			>
				<el-button
					size="mini"
					circle
					icon="el-icon-setting"
					@click="showConfig()"
				/>
			</el-tooltip>
		</el-row>
	</div>
</template>
<script>
export default {
	name: "tableListConfigToolBar",
	data() {
		return {
			checkedColumns: []
		};
	},
	props: {
		showSearch: {
			type: Boolean,
			default: true
		},
		boxData: {
			type: Array,
			default: () => {}
		}
	},
	mounted() {
	},
	methods: {
		showConfig() {
			this.$emit("showConfig");
		},
	}
};
</script>

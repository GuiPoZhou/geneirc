<template>
	<div>
		<div class="a-c-top dynamic-el-menu">
			<div class="a-c-t-list">
				<el-menu
					:default-active="activeIndex"
					class="el-menu-demo"
					mode="horizontal"
					@select="e_selTab"
				>
					<el-menu-item index="0">
						<template slot="title">
							<div class="fontImage">
								<span>领用出库</span>
							</div>
						</template>

					</el-menu-item>
					<el-menu-item index="1">
						<template slot="title">
							<div class="fontImage">
								<span>退库</span>
							</div>
						</template>

					</el-menu-item>
				</el-menu>
			</div>
		</div>
		<outOfStock v-if="activeIndex == 0 "></outOfStock>
		<withdrawal v-if="activeIndex == 1 "></withdrawal>
	</div>
</template>

<script>
import outOfStock from "./components/outOfStock";
import withdrawal from "./components/withdrawal";

export default {
	name: "collectingIssue",
	components: {outOfStock, withdrawal},
	data() {
		return {
			activeIndex:"0"
		}
	},
	methods: {
		e_selTab(e) {
			this.activeIndex = e
		},
	}
}
</script>

<style scoped lang="less">
</style>

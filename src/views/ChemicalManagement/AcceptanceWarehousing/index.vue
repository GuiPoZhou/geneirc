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
								<!-- <span>采购未交耗材</span> -->
								<span>待验收入库</span>
							</div>
						</template>
					</el-menu-item>

					<el-menu-item index="1">
						<template slot="title">
							<div class="fontImage">
								<span>已经验收入库</span>
							</div>
						</template>
					</el-menu-item>

					<el-menu-item index="2">
						<template slot="title">
							<div class="fontImage">
								<span>退货</span>
							</div>
						</template>
					</el-menu-item>
				</el-menu>
			</div>
		</div>
		<undelivered @warehousing="resetList()" v-if="activeIndex == 0"></undelivered>
		<inspectionIncomeLibrary @returnGood="resetList()" ref="incomeLibrary"v-if="activeIndex == 1"></inspectionIncomeLibrary>
		<returnOfGoods ref="returnGoods"v-if="activeIndex == 2"></returnOfGoods>
	</div>
</template>

<script>
	import inspectionIncomeLibrary from "./components/inspectionIncomeLibrary";
	import returnOfGoods from "./components/returnOfGoods";
	import undelivered from "./components/undelivered";

	export default {
		name: "AcceptanceWarehousing",
		components: {inspectionIncomeLibrary, returnOfGoods, undelivered},
		data() {
			return {
				activeIndex: "0"
			}
		},
		methods: {
			resetList() {
				this.$nextTick(res => {
					this.$refs.returnGoods.getList();
					this.$refs.incomeLibrary.getList();
				})
			},
			e_selTab(e) {
				this.activeIndex = e
			},
		}
	}
</script>

<style scoped lang="less">
</style>

<template>
	<div>
		<div class="a-c-top">
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
							<span>已批准申请</span>
						</div>
					</template>

				</el-menu-item>
				<el-menu-item index="1">
					<template slot="title">
						<div class="fontImage">
							<span>采购订单</span>
						</div>
					</template>

				</el-menu-item>
			</el-menu>
			</div>
		</div>
		<applicationApproved @addOrder="getList" v-if="activeIndex == 0"></applicationApproved>
		<purchaseOrders ref="orders" v-if="activeIndex == 1"></purchaseOrders>
	</div>
</template>

<script>
	import purchaseOrders from "./components/purchaseOrders.vue"
	import applicationApproved from "./components/applicationApproved.vue"

	export default {
		name: "purchaseOrder",
		components: {purchaseOrders, applicationApproved},
		data() {
			return {
				activeIndex:"0"
			}
		},
		methods: {
			getList() {
				this.$nextTick(res => {
					this.$refs.orders.getList();
				})
			},
			e_selTab(e) {
				this.activeIndex = e
				this.getList();
			},
		}


	}
</script>


<style scoped lang="less">

	/deep/ .el-tabs__item {
		height: 60px;
		line-height: 60px;
	}
</style>

<template>
	<section class="showLabel">
		<div
			class="content"
			style="position:relative"
			ref="content"
			@click="e_save"
		>
			<div
				v-for="(item, index) in contentDataList"
				:key="index"
				:style="setCss(item)"
			>
      <!-- 文字 -->
				<span
					v-if="
						item.contentType === contentTypeOptions[0].label ||
							item.contentType === contentTypeOptions[1].label
					"
				>
					{{ item.content }}
				</span>
        <!-- 图片 -->
				<img
					v-if="item.contentType === contentTypeOptions[6].label"
					:src="item.imgUrl"
					:style="{
						width: `${item.width}px`,
						height: `${item.height}px`
					}"
				/>
				<vue-qr
					v-if="item.contentType === contentTypeOptions[3].label"
					:text="item.content"
					:size="+item.width"
				/>
				<barcode
					v-if="item.contentType === contentTypeOptions[2].label"
					:text="item.content"
					v-bind="{ height: item.height }"
					elementTag="img"
					:style="{ width: `${item.width}px` }"
				/>
			</div>
		</div>
	</section>
</template>
<script>
import vueQr from "vue-qr";
import barcode from "vue-barcode";
const contentTypeOptions = [
	{
		label: "固定文字",
		key: 1
	},
	{
		label: "变量",
		key: 2
	},
	{
		label: "条形码",
		key: 3
	},
	{
		label: "二维码",
		key: 4
	},
	{
		label: "横线",
		key: 5
	},
	{
		label: "竖线",
		key: 6
	},
	{
		label: "图片",
		key: 7
	}
];
export default {
	props: {
		contentDataList: {
			type: Array
		}
	},
	components: {
		vueQr,
		barcode
	},

	computed: {
		setCss() {
			return function(item) {
				console.log(item);
				return {
					position: "absolute",
					fontSize: `${item.fontSize}px`,
					left: item.isCenter ? "50%" : `${item.leftOffset}px`,
					top: `${item.upperOffset}px`,
					width:
						item.contentType === "竖线"
							? "1px"
							: item.width
							? `${item.width}px`
							: "auto",
					height:
						item.contentType === "横线"
							? "1px"
							: item.height
							? `${item.height}px`
							: "auto",
					fontWeight: item.isBlank ? "bold" : "normal",
					background:
						item.contentType === "横线" ||
						item.contentType === "竖线"
							? "#333"
							: "",
					transform: item.isCenter ? "translateX(-50%)" : "none"
				};
			};
		}
	},

	mounted() {
		console.log("contentDataList", this.contentDataList);
	},
	data() {
		return {
			contentTypeOptions
		};
	},
	methods: {
		e_save() {
      console.log("content", this.$refs.content);
      console.log('contentDataList',this.contentDataList)
		}
	}
};
</script>
<style lang="less" scoped>
.showLabel {
	width: 800px;
	height: 300px;
	margin: 0 auto 22px;
	border: 1px solid #999;
	.content {
		width: 50%;
		height: 260px;
		border: 1px solid #999;
		margin: 20px auto;
	}
}
/deep/ .vue-barcode-element {
	width: 100%;
}
</style>

<template>
	<div ref="hello">
	<div class="showLabel" ref="content">
		<div class="content" :style="pageStyle" @click="e_save">
			<!-- 划线 -->
			<div
				v-for="(item, index) in contentDataList"
				:key="index"
				:style="setCss(item)"
			>
				<!-- 文字 -->
				<span v-if="item.contentType === contentTypeOptions[0].label">
					{{ item.content }}
				</span>
				<!-- 值 -->
				<span v-if="item.contentType === contentTypeOptions[1].label">
					{{ item.example }}
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
<!--				<vue-qr-->
<!--					v-if="item.contentType === contentTypeOptions[2].label"-->
<!--					:text="item.example"-->
<!--					:size="+item.width"-->
<!--				/>-->
                <div class="qrcode-pic" v-if="item.contentType === contentTypeOptions[2].label" ref="codeItem"></div>
				<barcode
					v-if="item.contentType === contentTypeOptions[3].label"
					:value="item.example"
					v-bind="{ height: item.height }"
					elementTag="img"
					:style="{ width: `${item.width}mm` }"
				/>
			</div>
		</div>
	</div>
	</div>
</template>
<script>
import vueQr from "vue-qr";
import barcode from "@/utils/barcode";
import QRCode from 'qrcodejs2'

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
		// 元素数据
		contentDataList: {
			type: Array
		},
		// 纸张宽度及高度
		pageStyle: {
			type: Object,
			default: {
				width: "50%",
				height: "260px"
			}
		}
	},

	components: {
		vueQr,
		barcode
	},

	computed: {
		setCss() {
			return function(item) {
				return {
					position: "absolute",
					fontSize: `${item.fontSize}px`,
					left: item.isCenter ? "50%" : `${item.leftOffset}px`,
					top: `${item.upperOffset}px`,
					width:
						item.contentType === "竖线"
							? "1px"
							: item.width
							? `${item.width}mm`
							: "auto",
					height:
						item.contentType === "横线"
							? "1px"
							: item.height
							? `${item.height}mm`
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
        setTimeout(()=>{
            this.$nextTick(()=>{
                console.log('QRCode',QRCode)
                this.contentDataList.map((item,index)=>{
                    console.log('QRCode',QRCode)
                    this.$refs.codeItem[index].innerHTML = ''
                    new QRCode(this.$refs.codeItem[index], {
                        text: item.example, //二维码内容
                        width: 40,
                        height: 40
                        // colorDark: "#333333", //二维码颜色
                        // colorLight: "#ffffff", //二维码背景色
                    })
                })
            })
        },1000)

	},
	data() {
		return {
			contentTypeOptions,
			cc: ""
		};
	},
	methods: {
		e_save() {

			this.cc = this.$refs.content.innerHTML;
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
		// width: 50%;
		// height: 260px;
		border: 1px solid #999;
		margin: 20px auto;
		position: relative;
	}
}
/deep/ .vue-barcode-element {
	width: 100%;
}


</style>

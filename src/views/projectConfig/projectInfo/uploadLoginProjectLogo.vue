<template>
    <BoDialog ref="BoDialog" :dia-log-show="showlog" dia-log-title="上传图片(建议图片比例1:1)" dia-log-width="40%" @close="e_close"
        :can-edit-full-screen="true">
        <template slot="bologbody">
            <el-row>
                <el-col :xs="24" :style="{ height: '620px' }">
                    <vue-cropper ref="cropper" :img="options.img" :info="true" :autoCrop="options.autoCrop"
                        :backgroundColor="options.backgroundColor" :outputType="options.outputType" :autoCropWidth="options.autoCropWidth"
                        :autoCropHeight="options.autoCropHeight" :fixedBox="options.fixedBox" @realTime="realTime"
                        v-if="visible" />
                </el-col>
            </el-row>
            <el-row style="margin-top:20px">
                <el-col :lg="2" :md="2">
                    <el-upload action="#" :show-file-list="false" :before-upload="beforeUpload">
                        <el-button size="small">
                            选择
                            <i class="el-icon-upload el-icon--right"></i>
                        </el-button>
                    </el-upload>
                </el-col>
                <el-col :lg="{ span: 1, offset: 2 }" :md="2">
                    <el-button icon="el-icon-plus" size="small" @click="changeScale(1)"></el-button>
                </el-col>
                <el-col :lg="{ span: 1, offset: 1 }" :md="2">
                    <el-button icon="el-icon-minus" size="small" @click="changeScale(-1)"></el-button>
                </el-col>
                <!--                <el-col :lg="{span: 1, offset: 1}" :md="2">-->
                <!--                    <el-button icon="el-icon-refresh-left" size="small" @click="rotateLeft()"></el-button>-->
                <!--                </el-col>-->
                <!--                <el-col :lg="{span: 1, offset: 1}" :md="2">-->
                <!--                    <el-button icon="el-icon-refresh-right" size="small" @click="rotateRight()"></el-button>-->
                <!--                </el-col>-->
            </el-row>
        </template>
        <template slot="bologfooter">
            <el-button type="primary" :disabled="fullscreenLoading" :loading="fullscreenLoading" size="small"
                @click="uploadImg()">提交</el-button>
            <el-button size="small" @click="e_close">取消</el-button>
        </template>
    </BoDialog>
</template>
<script>
import { VueCropper } from "vue-cropper";
import { uploadAvatar } from "@/api/system/user";

export default {
    components: { VueCropper },
    data() {
        return {
            fullscreenLoading: false,
            showlog: false,
            fileList: [],
            visible: false,
            options: {
                backgroundColor: '#ffffff',
                img: '', // 裁剪图片的地址
                info: true, // 裁剪框的大小信息
                outputSize: 1, // 剪切后的图片质量（0.1-1）
                full: false, // 输出原图比例截图 props名full
                outputType: 'png', // 裁剪生成额图片的格式
                canMove: false, // 能否拖动图片
                original: false, // 上传图片是否显示原始宽高
                canMoveBox: true, // 能否拖动截图框
                autoCrop: true, // 是否默认生成截图框
                autoCropWidth: 500, // 默认生成截图框宽度
                autoCropHeight: 500, // 默认生成截图框高度
                fixedBox: false, // 截图框固定大小
                fixedNumber: [1, 1],//（截图框宽高比，fixed必须为true才生效）
                fixed: true, //是否开启截图框宽高固定比例
                centerBox: true,// 截图框是否被限制在图片里面
                infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
            },
            previews: {}
        }
    },
    methods: {
        // 实时预览
        realTime(data) {
            this.previews = data;
        },
        e_close() {
            this.$emit('close')
        },
        init() {
            this.showlog = true
            this.visible = true
            // this.$refs.BoDialog.isFullScreen= false
        },
        // 上传预处理
        beforeUpload(file) {
            if (file.type.indexOf("image/") == -1) {
                this.$modal.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
            } else {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    this.options.img = reader.result;
                };
            }
        },
        // 图片缩放
        changeScale(num) {
            num = num || 1;
            this.$refs.cropper.changeScale(num);
        },
        // 向左旋转
        rotateLeft() {
            this.$refs.cropper.rotateLeft();
        },
        // 向右旋转
        rotateRight() {
            this.$refs.cropper.rotateRight();
        },
        // 上传图片
        uploadImg() {
            this.$refs.cropper.getCropBlob(async data => {
                console.log('data', data)
                this.fullscreenLoading = true
                let blobToBase64 = await this.blobToBase64(data)
                this.$emit('save', blobToBase64)
            });
        },
        cropImage() {
            // Get the cropped data from the cropper component
            const croppedData = this.$refs.cropper.getCroppedCanvas().toDataURL();

            // Check if the image has transparency (alpha channel)
            const hasTransparency = croppedData.match(/,1\)$/);

            // If the image has transparency, create a new canvas and draw the image with a white background
            if (hasTransparency) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const img = new Image();
                img.src = croppedData;

                canvas.width = img.width;
                canvas.height = img.height;

                ctx.fillStyle = this.options.backgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                console.log('结果1',canvas.toDataURL())
                this.croppedImage = canvas.toDataURL();
            } else {
                // this.croppedImage = croppedData;
                console.log('结果2',croppedData)
            }
        },
        blobToFile(blob, fileName, type) {  // blob转file
            let files = new window.File([blob], fileName, { type: type })
            return files
        },
        blobToBase64(blob) {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.onload = (e) => {
                    resolve(e.target.result);
                };
                // readAsDataURL
                fileReader.readAsDataURL(blob);
                fileReader.onerror = () => {
                    reject(new Error('blobToBase64 error'));
                };
            });
        }
    }
}
</script>

<template>
    <span class="codeIcon" @click="e_click">
        <svg t="1676037980883" style="width: 20px;height: 20px" class="icon" viewBox="0 0 1024 1024" version="1.1"
             xmlns="http://www.w3.org/2000/svg" p-id="4046" width="400" height="400"><path
            d="M919.68 1015.68H104.96a95.36 95.36 0 0 1-95.36-95.36V105.6A96 96 0 0 1 104.96 9.6h814.72a96 96 0 0 1 96 96v814.72a96 96 0 0 1-96 95.36zM104.96 73.6a31.36 31.36 0 0 0-31.36 32v814.72a31.36 31.36 0 0 0 31.36 31.36h814.72a32 32 0 0 0 32-31.36V105.6a32 32 0 0 0-32-32z"
            fill="#323333" p-id="4047"></path><path
            d="M971.52 256H53.12a32 32 0 0 1 0-64h918.4a32 32 0 0 1 0 64zM442.24 886.4h-8.96a32 32 0 0 1-21.76-39.68l145.92-504.32a32 32 0 1 1 64 17.92l-148.48 503.04a32.64 32.64 0 0 1-30.72 23.04zM312.32 798.72a32 32 0 0 1-19.84-6.4l-186.88-142.72a31.36 31.36 0 0 1-12.16-24.96 32 32 0 0 1 11.52-25.6L291.84 448a32.64 32.64 0 0 1 45.44 5.12 32 32 0 0 1-5.12 44.8L177.28 623.36l154.24 117.76a32 32 0 0 1 5.76 44.8 30.08 30.08 0 0 1-24.96 12.8zM712.96 798.72a32 32 0 0 1-19.84-57.6l154.24-117.76-154.88-124.16a32 32 0 1 1 40.32-51.2l186.88 149.76a30.08 30.08 0 0 1 11.52 25.6 31.36 31.36 0 0 1-12.16 24.96l-186.88 142.72a31.36 31.36 0 0 1-19.2 7.68z"
            fill="#323333" p-id="4048"></path></svg>
    </span>
</template>
<script>
export default {
    name:'ml-code',
    data() {
        return {}
    },
    methods:{
        e_click(){
            this.$emit('click')
        }
    }
}
</script>
<style lang="scss" scoped>
.codeIcon {
    display: inline-block;
    position: relative;
    margin-left: 10px;
    cursor: pointer;
    .icon{
        position: absolute;
        top: -15px;
    }
}
</style>

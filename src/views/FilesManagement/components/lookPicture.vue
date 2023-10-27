<template>
  <el-dialog
      class="elDialog"
      center
      width="60%"
      :visible.sync="dialogShow"
      :fullscreen="isFullScreen"
      :modal-append-to-body="false"
      :modal="false"
      :show-close="false"
  >
    <div slot="title" class="dialog-title">
      <span class="topTilte">{{titles}}</span>
      <div class="topRight">
        <!-- 最小化 -->
        <i
            class="el-icon-minus rightIcon"
            v-if="isFullScreen"
            @click="e_changeBox(false)"
        ></i>
        <!-- 最大化 -->
        <i
            class="el-icon-full-screen rightIcon"
            v-if="!isFullScreen"
            @click="e_changeBox(true)"
        ></i>
        <!-- 关闭 -->
        <i class="el-icon-close rightIcon" @click="cancelbtn"></i>
      </div>
    </div>
    <img :src="srcurl" alt="">
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="cancelbtn">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: "lookPicture",
    data () {
      return {
        dialogShow: false,
        isFullScreen: true,
        screenName: "fullScreen",
        titles: '查看图片',
        srcurl: ''
      }
    },
    methods: {
      e_changeBox(type) {
        this.isFullScreen = type;
      },
      init (data) {
        this.dialogShow = true
        this.srcurl = window.globalEnv.VUE_APP_BASE_API + '/' + data
      },
      cancelbtn() {
        this.$emit('close')
      }
    }
  }
</script>

<style scoped>

</style>

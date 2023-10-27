<template>
  <div class="app-container">
    <div class="a-c-top">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">待执行计划</el-menu-item>
        <el-menu-item index="2">期间核查记录</el-menu-item>
      </el-menu>
    </div>
    <!--待执行计划-->
    <waitPlan v-if="activeIndex === '1'" ref="waitPlan" @implement="implement"></waitPlan>
    <!--维护保养记录-->
    <record v-if="activeIndex === '2'" @lookDetail="lookDetail"></record>
    <!--执行-->
    <implement v-if="showimplement" ref="imt" @close="showimplement = false" @reload="handleWaitPlan"></implement>
    <!--    项目化执行-->
    <mainimplement v-show="showimplement2" ref="imt2" @close="closeDialog" @reload="handleWaitPlan"></mainimplement>
  </div>
</template>

<script>
import waitPlan from './tables/waitPlan'
import record from './tables/record'
import implement from './dialog/implement'
import { getCheckRecordDetail } from '@/api/resources/deviceManagement/index.js'
import Vue from 'vue'
export default {
  name: "index",
  components: { waitPlan, implement, record },
  data() {
    return {
      activeIndex: '1',
      showimplement: false,
      showimplement2: false,
    }
  },
  async created() {
    console.log(window.commonComponents)
    await this.doLoadMicroApp('microProject', this.microProjectEntry)
    Vue.component('mainimplement', window.commonComponents.mainimplement)
    console.log(this.$refs)
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeIndex = key
    },
    // 执行
    implement(data) {
      
      if (this.$refs.imt2 instanceof Vue) {
        this.showimplement2 = true
        this.$nextTick(() => {
          this.$refs.imt2.init('add', data)
        })
      } else {
        this.showimplement = true
        this.$nextTick(() => {
          this.$refs.imt.init('add', data)
        })
      }

    },
    handleWaitPlan() {
      this.showimplement = false
      this.showimplement2 = false
      this.$nextTick(() => {
        this.$refs.waitPlan.getList()
      })
    },
    // 查看
    lookDetail(data) {
      this.getDetails(data.id, 'show')
    },
    closeDialog() {
      this.showimplement2 = false
    },
    // 详情
    getDetails(id, type) {
      console.log(this.$refs)
      getCheckRecordDetail(id).then(res => {
        if (this.$refs.imt2 instanceof Vue) {
          this.showimplement2 = true
          this.$nextTick(() => {
            this.$refs.imt2.init(type, res.data)
          })
        } else {
          this.showimplement = true
          this.$nextTick(() => {
            this.$refs.imt.init(type, res.data)
          })
        }

      })
    }
  }
}
</script>

<style scoped></style>

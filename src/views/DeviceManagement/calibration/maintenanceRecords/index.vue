<template>
  <div class="app-container">
    <div class="a-c-top">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">待执行计划</el-menu-item>
        <el-menu-item index="2">检定校准记录</el-menu-item>
      </el-menu>
    </div>
    <!--待执行计划-->
    <waitPlan v-if="activeIndex === '1'" ref="waitPlan" @implement="implement" :deviceK18Info="deviceK18Info"></waitPlan>
    <!--维护保养记录-->
    <record v-if="activeIndex === '2'" @lookDetail="lookDetail"></record>
    <!--执行-->
    <implement v-if="showimplement" ref="imt" @close="showimplement = false" @reload="handleWaitPlan"></implement>
  </div>
</template>

<script>
  import waitPlan from './tables/waitPlan'
  import record from './tables/record'
  import implement from './dialog/implement'
  import { getCaliRecordDetail } from '@/api/resources/deviceManagement/index.js'
  export default {
    name: "index",
    components: { waitPlan, implement, record },
    data () {
      return {
        activeIndex: '1',
        showimplement: false,
        deviceK18Info:null
      }
    },
    async created(){
      this.getProjectK18('device').then(re=>{
        this.deviceK18Info = re
      }).catch(error=>{
        this.deviceK18Info = error
      })
    },
    methods: {
      handleSelect(key, keyPath) {
        this.activeIndex = key
      },
      // 执行
      implement (data) {
        this.showimplement = true
        this.$nextTick(() => {
          this.$refs.imt.init('add', data)
        })
      },
      handleWaitPlan() {
        this.showimplement = false
        this.$nextTick(() => {
          this.$refs.waitPlan.getList()
        })
      },
      // 查看
      lookDetail (data) {
        this.getDetails(data.id, 'show')
      },
      // 详情
      getDetails (id, type) {
        this.showimplement = true
        getCaliRecordDetail(id).then(res => {
          this.$nextTick(() => {
            this.$refs.imt.init(type, res.data)
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>

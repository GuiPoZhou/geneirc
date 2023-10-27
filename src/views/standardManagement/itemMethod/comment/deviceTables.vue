<template>
  <div>
      <el-button type="primary" size="small" @click="handleAdd" v-if="operateType !== 'detail'">新增设备</el-button>
      <el-table :data="dataList" border style="margin: 10px 0">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="equipmentTypeName" label="设备分类" align="center"/>
          <el-table-column prop="equipmentNumber" label="设备编号" align="center"/>
          <el-table-column prop="equipmentName" label="设备名称" align="center"/>
          <el-table-column prop="equipmentModel" label="设备型号" align="center"/>
          <el-table-column label="操作" align="center" v-if="operateType !== 'detail'">
              <template slot-scope="scope">
                  <el-button type="text" size="small" @click="e_del(scope.$index)">删除</el-button>
              </template>
          </el-table-column>
      </el-table>
      <selectDevice v-if="showDevice" ref="deviceRef" @close="showDevice = false" @tableList="tableList"></selectDevice>
  </div>
</template>

<script>
import selectDevice from './selectDevice.vue'
export default {
    components: {
        selectDevice
    },
    props: {
        deviceList: {
            type: Array,
            default: []
        },
        operateType: String
    },
    data () {
        return {
            dataList: [],
            showDevice: false
        }
    },
    watch: {
        deviceList (val) {
            if (val.length !== 0) {
                val.map(item => {
                    item.treeId = item.equipmentTypeId
                    item.id = item.equipmentId
                })
                this.dataList = val
            }
        }
    },
    methods: {
        handleAdd () {
            this.showDevice = true
            this.$nextTick(() => {
                this.$refs.deviceRef.init(this.dataList)
            })
        },
        e_del (index) {
            this.dataList.splice(index,1)
        },
        tableList (data) {
            this.dataList = data
        }
    }
}
</script>


<style scoped>

</style>
<template>
  <div>
      <el-button type="primary" size="small" @click="handleAdd" v-if="operateType !== 'detail'">新增产品</el-button>
      <el-table :data="dataList" border style="margin: 10px 0">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="productionTypeName" label="产品类型" align="center"/>
          <el-table-column prop="productionName" label="产品名称" align="center"/>
          <el-table-column prop="hardwareVersion" label="硬件版本" align="center"/>
          <el-table-column prop="softwareVersion" label="软件版本" align="center"/>
          <el-table-column label="操作" align="center" v-if="operateType !== 'detail'">
              <template slot-scope="scope">
                  <el-button type="text" size="small" @click="e_del(scope.$index)">删除</el-button>
              </template>
          </el-table-column>
      </el-table>
      <selectProduct v-if="showProduct" ref="productRef" @close="showProduct = false" @tableList="tableList"></selectProduct>
  </div>
</template>

<script>
import selectProduct from './selectProduct.vue'
export default {
    components: {
        selectProduct
    },
    props: {
        productList: {
            type: Array,
            default: []
        },
        operateType: String
    },
    watch: {
        productList (val) {
            if (val.length !== 0) {
                val.map(item => {
                    item.treeId = item.productionTypeId
                    item.id = item.productionId
                })
                this.dataList = val
            }
        }
    },
    data () {
        return {
            dataList: [],
            showProduct: false
        }
    },
    methods: {
        handleAdd () {
            this.showProduct = true
            this.$nextTick(() => {
                this.$refs.productRef.init(this.dataList)
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
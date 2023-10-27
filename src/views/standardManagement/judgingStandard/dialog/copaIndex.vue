<template>
  <ml-dialog ref="mlDialog" :dia-log-show="dialogShow" dia-log-title="复制指标" dia-log-width="60%"
             @close="cancelbtn">
    <template slot="bologbody">
    <div class="targetBox">
      <!--分类-->
      <el-col :span="5" :xs="24">
        <product-classification
            :copy="copy"
            :treeList="treeList"
            @updata="updata"
            @handleData="handleData"
            :decidestandardId="decidestandardId">
        </product-classification>
      </el-col>
      <el-col :span="18" :xs="24" class="a-m-c-right">
        <div>
          <el-table
            border
            v-loading="loading"
            :data="listData"
            row-key="rowIndex"
            ref="selectTable"
            style="margin-top: 10px"
            @selection-change="handleSelectionChange"
        >
            <el-table-column
                type="selection"
                width="55"
                align="center"
            />
          <el-table-column
              label="序号"
              align="center"
              prop="rowIndex"
              width="50"
          />
          <el-table-column
              prop="itemName"
              label="试验参数名称"
              align="center"
              width="120"
              show-overflow-tooltip
          />
          <el-table-column
              prop="itemSubName"
              label="子项名称"
              align="center"
              width="120"
              show-overflow-tooltip
          />
          <el-table-column
              label="指标单位"
              show-overflow-tooltip
              width="120"
          >
            <template slot-scope="scope">
              <el-select v-model="scope.row.unit" filterable disabled @change="unitChange(scope.row)">
                <el-option
                    v-for="item in unitoptions"
                    :key="item.id"
                    :label="item.unitName"
                    :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
              prop="entrustCode"
              label="比较符号"
              show-overflow-tooltip
              width="130"
              align="center"
              show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-select v-if="scope.row.limitCount <= 1" v-model="scope.row.compareContent" filterable disabled>
                <el-option
                    v-for="item in comparatoroptions"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
              <div class="rowclass" v-if="scope.row.limitCount > 1" v-for="item in scope.row.multiList">
                <el-input v-model="item.compareContent" readonly></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              prop="entrustCode"
              label="最小值"
              show-overflow-tooltip
              width="120"
              align="center"
          >
            <template slot-scope="scope">
              <div class="rowclass" v-if="scope.row.limitCount > 1" v-for="item in scope.row.multiList">
                <el-input v-model="item.lowLimit" readonly v-if="item.lowLimit !== null"></el-input>
                <el-input v-model="item.lowLimit" disabled v-else></el-input>
              </div>
              <el-input v-if="scope.row.limitCount <= 1" v-model="scope.row.lowLimit" readonly></el-input>
            </template>
          </el-table-column>
          <el-table-column
              prop="entrustCode"
              label="最大值"
              show-overflow-tooltip
              width="120"
              align="center"
          >
            <template slot-scope="scope">
              <div class="rowclass" v-if="scope.row.limitCount > 1" v-for="item in scope.row.multiList">
                <el-input v-model="item.upLimit" readonly v-if="item.upLimit !== null"></el-input>
                <el-input v-model="item.upLimit" disabled v-else></el-input>
              </div>
              <el-input v-if="scope.row.limitCount <= 1" v-model="scope.row.upLimit" readonly></el-input>
            </template>
          </el-table-column>
          <el-table-column
              prop="limitDesc"
              label="指标说明"
              show-overflow-tooltip
              width="150"
              align="center"
              show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div class="rowclass" v-if="scope.row.limitCount > 1" v-for="item in scope.row.multiList">
                <el-input v-model="item.limitDesc" readonly></el-input>
              </div>
              <el-input v-if="scope.row.limitCount <= 1" v-model="scope.row.limitDesc" readonly></el-input>
            </template>
          </el-table-column>
          <el-table-column
              prop="decideResult"
              label="判定结论"
              show-overflow-tooltip
              width="120"
              align="center"
              show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div class="rowclass" v-if="scope.row.limitCount > 1" v-for="item in scope.row.multiList">
                <el-input v-model="item.decideResult" readonly></el-input>
              </div>
              <el-input v-if="scope.row.limitCount <= 1" v-model="scope.row.decideResult" readonly></el-input>
            </template>
          </el-table-column>.
          <el-table-column
              prop="remark"
              label="备  注"
              show-overflow-tooltip
              width="200"
              align="center"
          >
            <template slot-scope="scope">
              <div class="rowclass" v-if="scope.row.limitCount > 1" v-for="item in scope.row.multiList">
                <el-input v-model="item.remark" readonly></el-input>
              </div>
              <el-input v-if="scope.row.limitCount <= 1" v-model="scope.row.remark" readonly></el-input>
            </template>
          </el-table-column>
        </el-table>
        </div>
      </el-col>
    </div>
    </template>
    <template slot="bologfooter">
      <el-button type="primary" @click="handleCopy" :loading="btnloading" size="small">复制指标</el-button>
      <el-button @click="cancelbtn" size="small">取消</el-button>
    </template>
  </ml-dialog>
</template>

<script>
  import productClassification from "../components/productClassification";
  import { getstandaraItemList, copyStandardItem } from '@/api/standardManagement/standardManagement.js'
  export default {
    name: "copaIndex",
    components: {productClassification},
    data () {
      return {
        dialogShow: false,
        isFullScreen: true,
        treeList: [],
        decidestandardId: 0,
        copy: true,
        loading: false,
        listData: [],
        ids: [],
        unitoptions: [],
        indexdata: {},
        comparatoroptions: ['＜', '≤', '＞', '≥', '＞，＜', '＞，≤', '≥，＜', '≥，≤', '匹配字符'],
        toStandardProductionId: 0,
        btnloading: false
      }
    },
    methods: {
      e_changeBox(type) {
        this.isFullScreen = type;
      },
      cancelbtn() {
        this.$emit('close')
      },
      init (data) {
        console.log(data)
        this.dialogShow = true
        this.$nextTick(() => {
          this.treeList = data.treeList
          this.decidestandardId = data.decidestandardId
          this.unitoptions = data.unitoptions
          this.toStandardProductionId = data.toStandardProductionId
        })
      },
      // 点击树更新右边列表
      updata() {
        // this.getList()
      },
      getList () {
        const params = {
          decideStandardId: this.decidestandardId,
          standardProductionId: this.indexdata.id,
        }
        getstandaraItemList(params).then(res => {
          if (res.code === 200) {
            this.listData = res.data
          }
        })
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.itemId);
      },
      handleData (data) {
        this.indexdata = data
        this.getList()
      },
      // 复制指标
      handleCopy () {
        this.btnloading = true
        const params = {
          fromStandardProductionId: this.indexdata.id,
          toStandardProductionId: this.toStandardProductionId,
          itemIdStr: this.ids.join(',')
        }
        copyStandardItem(params).then(res => {
          if (res.code === 200) {
            this.btnloading = false
            this.$message.success('复制成功')
            this.$parent.getdecision()
            this.cancelbtn()
          } else {
            this.btnloading = false
          }
        }).catch(err => {
          this.btnloading = false
        })
      }
    }
  }
</script>

<style scoped>
  .targetBox {
    border-top: 1px solid #f5f5f5;
    display: flex;
    justify-content: space-between;
  }
  .rowclass {
    /*white-space: pre-wrap;*/
    margin-bottom: 5px;
  }
</style>

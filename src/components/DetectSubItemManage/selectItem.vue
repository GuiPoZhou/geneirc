<!--选择项目-->
<template>
  <BoDialog :dia-log-show="selectItemShow" dia-log-width="70%" :dia-log-title="`已选择项目（共 ${sampleNum} 个）`" @close="close">
    <template slot="bologbody">
      <el-table :data="selectedItemTableData" border element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" style="width: 100%"
        height="300" :row-style="{ height: '20px' }" :cell-style="{ padding: '2px' }" row-key="id"
        :tree-props="{ children: 'voListZ' }" ref="selectedItemTable">
        <el-table-column prop="itemName" label="项目名称" :show-overflow-tooltip="true">
          <!--          <template scope="scope">-->
          <!--            {{scope.row.itemParentId == 0?scope.row.itemName:''}}-->
          <!--          </template>-->
        </el-table-column>
        <!--        <el-table-column-->
        <!--          prop="itemName"-->
        <!--          label="子项目名称"-->
        <!--          :show-overflow-tooltip="true"-->
        <!--        >-->
        <!--          <template scope="scope">-->
        <!--            {{scope.row.itemParentId != 0?scope.row.itemName:''}}-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column prop="itemCode" label="方法编码" show-overflow-tooltip />
        <el-table-column prop="subname" label="子法名称" />
        <el-table-column prop="methodNameCn" label="方法中文名称" />
        <el-table-column prop="stroma" label="基质" />
        <el-table-column label="现场检测">
          <template slot-scope="scope">
            <el-switch active-color="#5B7BFA" inactive-color="#dadde5" :active-value="1" :inactive-value="0"
              :value="scope.row.sceneDetect" disabled>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="customerAppoint" label="客户指定">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.customerAppoint" :active-value="1" :inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-delete" @click="deleteItem(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 10px; height: 400px">
        <el-tabs type="border-card" tab-position="left" @tab-click="handleClick" :value="selectItemType">
          <el-tab-pane label="按检测项目" name="item">
            <itemList ref="itemList" @parseSelectedItems="parseSelectedItems" :selectedItems="selectedItemTableData" />
          </el-tab-pane>
          <el-tab-pane label="按项目分组" name="group">
            <groupList ref="groupList" @parseSelectedItems="parseSelectedItems" :selectedItems="selectedItemTableData" />
          </el-tab-pane>
          <!--                    <el-tab-pane label="按产品类别" name="productCategory" v-if="!microStore.state.BeiYuan.detectType">-->
          <!--                        <useDetect :selectedItems="selectedItemTableData" @parseSelectedItems="parseSelectedItems"/>-->
          <!--                    </el-tab-pane>-->
          <!--                    <el-tab-pane label="按方法标准" name="methodStandard">-->
          <!--                       <useMethodStand :selectedItems="selectedItemTableData" @parseSelectedItems="parseSelectedItems"/>-->
          <!--                    </el-tab-pane>-->
        </el-tabs>
      </div>
    </template>
    <template slot="bologfooter">
      <el-button type="primary" size="small" center @click="saveItem">保存</el-button>
      <el-button size="small" @click="close">取消</el-button>
    </template>
  </BoDialog>
</template>

<script>
import itemList from './itemList'
import groupList from './groupList'
// import useDetect from "./useDetect.vue";
// import useMethodStand from "./useMethodStand.vue";

export default {
  name: 'selectItem',
  components: {
    itemList,
    groupList,
  },
  computed: {
    //已选择项目样品数
    sampleNum() {
      return this.selectedItemTableData.length
    }
  },

  data() {
    return {
      selectItemShow: false,
      //选中项目的方式 item:按项目选择 ，group:按组选择
      selectItemType: 'item',
      //检测类别
      detectType: this.microStore.state.BeiYuan.detectType,
      //记录单类别
      recordType: undefined,
      selectedItemTableData: [],
      isFullScreen: true,
    }
  },
  methods: {
    //处理编辑频次项目回显
    itemListData(data) {
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].recordItemList) {
          for (let j = 0; j < data[i].recordItemList.length; j++) {
            arr.push(data[i].recordItemList[j])
          }
        }
      }
      return arr;
    },

    initItemList(detectType, selectedItems, recordType) {
        console.log(detectType)
        console.log(selectedItems)
        console.log(recordType)
      this.selectItemShow = true
      if (selectedItems.length == 0) {
        this.$nextTick(() => {
          this.$refs.itemList.clearBtn()
        })
      }
      let isAdd = true;
      let arr = []
      selectedItems.forEach((item) => {
        console.log(item);
        if (item.parentId != undefined) {
          item.itemParentId = item.parentId
        }
        if (item.recordItemList) {
          isAdd = false
          item.recordItemList.forEach((items) => {
            arr.push(items)
          })
        }
      })
      if (isAdd) {
        this.selectedItemTableData = selectedItems //委托
      } else {
        this.selectedItemTableData = this.itemListData(selectedItems) //编码管理
      }
      this.selectItemType = 'item'
      this.$nextTick(() => {
        this.recordType = recordType
        this.$refs.itemList.initItemList(detectType, recordType)
      })
    },
    flatten(array) {
      return [].concat(...array.map(item => [].concat(item, ...this.flatten(item.voListZ))))
    },
    //保存选中项目
    saveItem() {
      this.selectedItemTableData.forEach((item) => {
        if (!item.voListZ) {
          item.voListZ = []

        }else{
          item.voListZ.forEach(aa => {
            console.log('aa',aa)
            if (!aa.voListZ) {
              aa.voListZ = []
            }

          })
        }
        if (!item.detectTypeStr) {
          item.detectTypeStr = this.microStore.state.BeiYuan.detectName
        }
        this.$set(
          item,
          'customerAppoint',
          item.customerAppoint === undefined ? false : item.customerAppoint
        )
      })
      console.log(' this.selectedItemTableData', this.selectedItemTableData)
      // var navigation = this.flatten(this.selectedItemTableData)
      // navigation.map(item => {
      //     this.$delete(item, 'children')
      // })
      // var dataList = this.flatten(this.selectedItemTableData)
      // this.$emit('saveItem', dataList)
      this.$emit('saveItem', this.selectedItemTableData)
      this.close()
    },
    // clear(){

    // },
    //取消按钮操作
    close() {
        this.selectItemShow = false
      this.$emit('cancel')
    },
    handleClick(tab, event) {
      this.selectItemType = tab.name
      this.$nextTick(() => {
        if (this.selectItemType === 'group') {
          this.$refs.groupList.initGroupList(this.detectType, this.recordType)
        } else {
          console.log('selectedItemTableData', this.selectedItemTableData)
          this.$refs.itemList.initItemList(this.detectType, this.recordType)
        }
      })
    },

    //操作未选中项目时解析已选中项目
    parseSelectedItems({ currentSelectedItems, allItem }) {
      console.log('aaaa', currentSelectedItems);
      //所有项目列表--选中项目id
      let currentSelectedItemIds = currentSelectedItems.map(
        (itemMethod) => itemMethod.itemId
      )

      //所有项目列表中--项目id
      let allItemIds = allItem.map((itemMethod) => itemMethod.itemId)

      //所有项目列表--未选中 项目id
      let currentUnSelectedItemIds = allItemIds.filter((id) => {
        return currentSelectedItemIds.indexOf(id) < 0
      })

      //已选项目列表中 项目id
      let alreadySelectedItemIds = this.selectedItemTableData.map((itemMethod) => itemMethod.itemId)
      //添加
      currentSelectedItems.map((itemMethod) => {
        if (alreadySelectedItemIds.indexOf(itemMethod.itemId) < 0) {
          this.selectedItemTableData.push(itemMethod)
        }
      })
      //删除未选中项
      for (let i = this.selectedItemTableData.length - 1; i >= 0; i--) {
        let itemId = this.selectedItemTableData[i].itemId
        if (currentUnSelectedItemIds.indexOf(itemId) >= 0) {
          this.selectedItemTableData.splice(i, 1)
        }
      }
      console.log('selectedItemTableData', this.selectedItemTableData)
    },
    //删除项目
    // deleteItem(index, item) {
    //   //删除选重行
    //   if (item.itemParentId == 0) {
    //     for (let i = this.selectedItemTableData.length - 1; i > 0; i--) {
    //       if (this.selectedItemTableData[i].itemParentId == item.itemId) {
    //         console.log(i);
    //         this.selectedItemTableData.splice(i, 1)
    //       }
    //     }
    //     this.selectedItemTableData.splice(index, 1)
    //   } else {
    //     this.selectedItemTableData.splice(index, 1)
    //     let arr = []
    //     this.selectedItemTableData.map((itemA) => {
    //       if (itemA.itemParentId == item.itemParentId) {
    //         arr.push(itemA)
    //       }
    //     })
    //     if (arr.length == 0) {
    //       this.selectedItemTableData.map((itemA, indexA) => {
    //         if (itemA.itemId == item.itemParentId) {
    //           this.selectedItemTableData.splice(indexA, 1)
    //           item = itemA
    //         }
    //       })
    //     }
    //   }
    //   if (this.selectItemType == 'item') {
    //     this.$refs.itemList.customerSel(item.itemId)
    //   } else {
    //     this.$refs.groupList.customerSel(item.itemId)
    //   }
    // }
    deleteItem(index, item) {
      if (item.itemParentId == 0) {
        this.selectedItemTableData.splice(index, 1)
      } else {
        console.log(item)
        var findIndex = this.selectedItemTableData.findIndex(items => items.itemId == item.itemParentId)
        if (findIndex > -1) {
          if (this.selectedItemTableData[findIndex].voListZ.length == 1) {
            item = this.selectedItemTableData[findIndex]
            this.selectedItemTableData.splice(findIndex, 1)
          } else {
            this.selectedItemTableData[findIndex].voListZ.map((itemss, indexss) => {
              if (itemss.itemId == item.itemId) {
                this.selectedItemTableData[findIndex].voListZ.splice(indexss, 1)
              }
            })
          }
        }
      }
      console.log(item);
      if (this.selectItemType == 'item') {
        this.$refs.itemList.customerSel(item.itemId)
      } else {
        this.$refs.groupList.customerSel(item.itemId)
      }
    }
  }
}
</script>

<style scoped></style>

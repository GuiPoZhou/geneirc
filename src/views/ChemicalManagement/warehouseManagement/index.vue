<template>
  <div>
    <BoContainer ref="BoContainer" pageTitle="样本" :total="total" @changePage="changePage">
      <template slot="boMain">
        <BoMain>
          <template slot="bosearch">
            <el-form :model="queryParams"
                     ref="queryFrom"
                     :inline="true"
                     class="searchform"
            >
              <!--                            库位名称-->
              <el-form-item
                label="库位名称："
                prop="storeName"
              >
                <el-input v-model="queryParams.storeName"
                          placeholder="请输入"
                          @clear="searchBtn" clearable/>
              </el-form-item>
              <!--                            库位状态-->
              <el-form-item
                label="库位状态："
                prop="status"
              >
                <el-select v-model="queryParams.status"
                           placeholder="请选择" clearable @clear="searchBtn">
                  <el-option label="启用" :value="1"></el-option>
                  <el-option label="停用" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="searchBtn"
                >查询
                </el-button>
                <el-button size="mini" icon="el-icon-refresh" @click="ResetBtn"
                >重置
                </el-button>
              </el-form-item>
            </el-form>
          </template>
          <template slot="tableArea">
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button @click="e_addBtn" type="primary" size="small">新增
                </el-button>
              </el-col>
            </el-row>
            <el-table
              :height="mainTableHeight"
              :data="listData"
              stripe
              border
            >
              <el-table-column
                label="序号"
                type="index"
                align="center"
                width="65"
              />
              <!--            库位名称-->
              <el-table-column
                prop="storeName"
                label="库位名称"
                align="center"
              >
              </el-table-column>
              <!--            备注-->
              <el-table-column
                prop="remark"
                label="备注"
                align="center"
              >
              </el-table-column>
              <!--            库位状态-->
              <el-table-column
                prop="status"
                label="库位状态"
                align="center"
              >
                <template scope="scope">
                  <span v-if="scope.row.status == 0">停用</span>
                  <span v-if="scope.row.status == 1">启用</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    @click="e_DisableEnable(scope.row)"
                  >启用/停用
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="e_editBtn(scope.row)"
                  >编辑
                  </el-button>
                  <el-button
                    size="mini"
                    style="color: #D9001B"
                    type="text"
                    @click="e_deleteBtn(scope.row)"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--                            </el-col>-->
            <!--                        </el-row>-->
          </template>
        </BoMain>
      </template>
    </BoContainer>
    <!--        库位详情-->
    <WarehouseManagementDetail
      ref="WarehouseManagementDetail"
      v-if="showWarehouseManagementDetail"
      @reload="reload"
      @cancel="showWarehouseManagementDetail = false"
    />
  </div>
</template>
<script>
  import BoContainerMixin from '@/mixins/boContainer'
  import WarehouseManagementDetail from './Dialog/warehouseManagementDetail'

  export default {
    mixins: [BoContainerMixin],
    components: {
      WarehouseManagementDetail
    },
    data() {
      return {
        showWarehouseManagementDetail: false,
        showImport: false,
        queryParams: {
          pageNum: 1,
          pageSize: 100,
          pointName: '',
          isUse: ''
        },
        listData: [],
        total: 0,
        treeId: null

      }
    },
    mounted() {
      // 获取列表数据
      this.getListData()
    },
    methods: {
      // 新增 按钮
      e_addBtn() {
        this.showWarehouseManagementDetail = true
        this.$nextTick(() => {
          this.$refs.WarehouseManagementDetail.init('add')
        })
      },
      // 新增修改采样点回调
      reload() {
        this.showWarehouseManagementDetail = false
        this.getListData()
      },
      // 停用启用
      e_DisableEnable(row) {
        this.$confirm('是否确定将改采样点停用/启用, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let getData = await this.$net(`/material/v1/storeSite/use/${row.id}`, 'get')
          if (getData.code == 200) {
            console.log(getData)
            this.$message.success('操作成功')
            this.getListData()
          }
        })
      },
      // 修改 按钮
      async e_editBtn(row) {
        this.showWarehouseManagementDetail = true
        this.$nextTick(() => {
          this.$refs.WarehouseManagementDetail.init('edit', row)
        })
      },
      // 删除
      async e_deleteBtn(row) {
        let getData = await this.$net(`/material/v1/storeSite/${row.id}`, 'delete')
        if (getData.code == 200) {
          this.$message.success('删除成功')
          this.getListData()
        }
      },
      //获取列表数据
      async getListData() {
        // 获取库位数据
        let getData = await this.$net('/material/v1/storeSite/queryStoreSiteList', 'get', this.queryParams)
        if (getData.code == 200) {
          console.log(getData)
          this.listData = getData.data
          this.total = getData.data.length
        }
      },
      // 搜索
      searchBtn() {
        this.queryParams.pageNum = 1
        this.getListData()
      },
      // 重置
      ResetBtn() {
        this.$refs.queryFrom.resetFields()
        this.$nextTick(() => {
          this.$refs.BoContainer.resetPage()
        })
        this.searchBtn()
      },
      changePage(e) {
        this.queryParams.pageNum = e.page
        this.queryParams.pageSize = e.limit
        this.getListData()
      }
    }
  }
</script>

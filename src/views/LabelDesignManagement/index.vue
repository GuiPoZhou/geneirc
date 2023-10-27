<template>
  <div>
    <BoContainer pageTitle="样本" :total="total" ref="BoContainer" @changePage="changePage">
      <template slot="boMain">
        <BoMain>
          <template slot="bosearch">
            <el-form :model="queryParams"
                     ref="queryFrom"
                     :inline="true"
                     class="searchform"
            >
              <!--              标签名称-->
              <div class="intBor">
                <el-form-item
                    label="标签名称："
                    prop="name"
                >
                  <el-input v-model="queryParams.name" @keyup.enter.native="searchBtn"
                            clearable
                            @clear="searchBtn"/>
                </el-form-item>
              </div>

              <!--                            是否启用-->
              <div class="intBor">
                <el-form-item
                    label="是否启用："
                    prop="status"
                >
                  <el-select v-model="queryParams.status"
                             placeholder="请选择"
                             clearable
                             @clear="searchBtn">

                    <el-option label="启用" :value="1"></el-option>
                    <el-option label="停用" :value="0"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="searchBtn"
                >搜索
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
                <el-button size="small" type="primary" :disabled="selectionList.length>1"
                           @click="e_add">新增
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
                  width="55"
              />
              <!--            标签名称-->
              <el-table-column
                  prop="name"
                  label="标签名称"
                  align="center"
              >
              </el-table-column>
              <!--            是否启用-->
              <el-table-column
                  prop="status"
                  label="是否启用"
                  align="center"
              >
                <template scope="scope">
                  <el-switch
                      v-model="scope.row.status"
                      active-color="#13ce66"
                      :active-value="1"
                      :inactive-value="0"
                      @change="(e)=>setLabelStatus(e,scope.row)"
                  >
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column
                  label="操作"
                  align="center"
                  width="150"
              >
                <template slot-scope="scope">
                  <el-button
                      size="mini"
                      type="text"
                      @click="e_edit(scope.row)"
                  >编辑
                  </el-button>
                  <el-button
                      size="mini"
                      type="text"
                      @click="e_see(scope.row)"
                  >查看
                  </el-button>
                  <el-button
                      size="mini"
                      type="text"
                      style="color: red"
                      @click="e_delete(scope.row)"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </BoMain>
      </template>
    </BoContainer>
    <!--        标签设计页面-->
    <TagePrint
        ref="TagePrint"
        v-if="showTagePrint"
        @reload="handleTagePrint"
        @cancel="showTagePrint = false"
    />
  </div>
</template>
<script>
import BoContainerMixin from '@/mixins/boContainer'
import TagePrint from './tagePrint/index'

export default {
  mixins: [BoContainerMixin],
  components: {
    TagePrint
  },
  data() {
    return {
      showLog: false,
      showTagePrint: false,
      showBatchSampling: false,
      dateValue: '',
      date: '',
      total: 0,
      showSampleReceivingRecord: false,
      showSampling: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        content: null,
        status: null
      },
      listData: [],
      selectionList: [],
      sampleCodeList: []
    }
  },
  mounted() {
    this.getListData()
  },
  methods: {
    // 新增
    e_add() {
      this.showTagePrint = true
      this.$nextTick(() => {
        this.$refs.TagePrint.init('add')
      })
    },
    // 查看 操作
    async e_see(row) {
      let getData = await this.$net(`/base/v1/label/manage/${row.id}`, 'get')
      if (getData.code == 200) {
        this.showTagePrint = true
        this.$nextTick(() => {
          this.$refs.TagePrint.init('see', getData.data)
        })
      }
    },
    // 修改 操作
    async e_edit(row) {
      let getData = await this.$net(`/base/v1/label/manage/${row.id}`, 'get')
      if (getData.code == 200) {
        this.showTagePrint = true
        this.$nextTick(() => {
          this.$refs.TagePrint.init('edit', getData.data)
        })
      }
    },
    // 删除 操作
    async e_delete(row) {
      let getData = await this.$net(`/base/v1/label/manage/${row.id}`, 'delete')
      if (getData.code == 200) {
        this.$message.success('删除成功')
        this.getListData()
      }
    },
    // 更新标签状态
    async setLabelStatus(e, row) {
      let params = {
        id: row.id,
        status: e
      }
      let getData = await this.$net(`/base/v1/label/manage`, 'put', params)
      if (getData.code == 200) {
        this.$message.success('更新成功')
        this.getListData()
      }
    },
    // 回调
    handleTagePrint() {
      this.showTagePrint = false
      this.getListData()
    },
    // 搜索 按钮
    searchBtn() {
      this.queryParams.pageNum = 1
      this.queryParams.pageSize = 10
      this.getListData()
    },
    // 页码更改
    changePage(e) {
      this.queryParams.pageNum = e.page
      this.queryParams.pageSize = e.limit
      this.getListData()
    },
    // 重置 按钮
    ResetBtn() {
      this.$refs.queryFrom.resetFields()
      this.$nextTick(() => {
        this.$refs.BoContainer.resetPage()
      })
      this.getListData()
    },
    // 获取接口列表
    async getListData() {
      let getData = await this.$net('/base/v1/label/manage/list', 'get', this.queryParams)
      if (getData.code == 200) {
        console.log(getData)
        this.listData = getData.data.list
        this.total = getData.data.total
      }
      // this.getOrderNumber(this.listData, this.queryParams.pageNum, this.queryParams.pageSize)
    }
  }
}
</script>

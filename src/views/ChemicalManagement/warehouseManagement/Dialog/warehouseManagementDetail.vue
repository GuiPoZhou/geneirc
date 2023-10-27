<template>
  <div>
    <BoDialog :diaLogShow="diaLogShow" :diaLogTitle="showType == 'add'?'新增':'修改'"
              diaLogWidth="40%" @close="e_close">
      <template slot="bologbody">
        <el-form :model="queryParams"
                 ref="queryFrom"
                 :inline="true"
                 class="searchform"
                 label-position="top"
        >
          <el-row>
            <!--                    库位名称-->
            <el-col :span="12">
              <el-form-item
                label="库位名称"
                prop="storeName"
                :rules="[{
                                    required: true,
                                    message: '请输入',
                                    trigger: 'blur',
                                }]"
              >
                <el-input v-model="queryParams.storeName"
                          placeholder="请输入"
                          :disabled="isdisabled"
                          clearable/>
              </el-form-item>
            </el-col>
            <!--                    备注-->
            <el-col :span="24">
              <el-form-item
                label="备注"
                prop="remark"
              >
                <el-input v-model="queryParams.remark"
                          placeholder="请输入"
                          :disabled="isdisabled"
                          clearable/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <template slot="bologfooter">
        <el-button type="primary" size="small" @click="e_preservation" :loading="isloading">保存
        </el-button>
        <el-button size="small" @click="e_close">取消</el-button>
      </template>
    </BoDialog>
  </div>
</template>
<script>
  import BoContainerMixin from '@/mixins/boContainer'

  export default {
    mixins: [BoContainerMixin],
    data() {
      return {
        diaLogShow: false,
        isloading: false,
        queryParams: {},
        listData: [],
        showType: 'add',
        isdisabled: false,
      }
    },
    methods: {
      init(type, data) {
        this.showType = type
        this.diaLogShow = true
        if (type == 'edit') {
          this.queryParams = data
        }
      },
      // 保存 按钮
      async e_preservation() {
        this.$refs.queryFrom.validate(async (valid) => {
          if (valid) {
            let method = ''
            this.showType == 'edit' ? method = 'put' : method = 'post'
            console.log(this.queryParams)
            this.isloading = true
            try {
              let getData = await this.$net('/material/v1/storeSite', method, this.queryParams)
              if (getData.code == 200) {
                this.diaLogShow = false
                this.isloading = false
                this.$emit('reload')
                this.$message.success('保存成功')
              }
            } catch (e) {
              this.isloading = false
            }
          }
        })
      },
      e_close() {
        this.diaLogShow = false
        this.$emit('cancel')
      }
    }
  }
</script>

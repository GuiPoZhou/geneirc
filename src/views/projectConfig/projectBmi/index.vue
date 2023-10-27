<template>
    <div>
        <BoContainer>
            <template slot="boMain">
                <BoMain>
                    <template slot="bosearch">
                        <el-button type="primary" size="small" @click="e_add">新增</el-button>
                    </template>
                    <template slot="tableArea">
                        <el-table
                            :data="tableData"
                            style="width: 100%">
                            <el-table-column
                                prop="themeSkin"
                                label="图片预览" align="center">
                                <template slot-scope="scope">
                                    <img style="width: 180px;height: 135px" :src="scope.row.themeSkin" alt="">
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="hasDefault"
                                label="是否默认" align="center">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.hasDefault">默认</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="操作" align="center">
                                <template slot-scope="scope">
                                    <el-button v-if="!scope.row.hasDefault" type="text" style="color: red" @click="e_delete(scope.row.id)">删除</el-button>
                                    <el-button v-if="!scope.row.hasDefault" type="text" @click="e_setDefault(scope.row.id)">设置默认</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </BoMain>
            </template>
        </BoContainer>
        <uploadFile ref="uploadFile" v-if="showuploadFile" @close="showuploadFile=false" @save="e_Reload"/>
    </div>
</template>
<script>
import uploadFile from './dialog/uploadFile.vue'

export default {
    components: {
        uploadFile
    },
    data() {
        return {
            tableData: [],
            showuploadFile: false
        }
    },
    created() {
        this.e_getlist()
    },
    methods:{
        e_Reload(){
            this.showuploadFile = false
            this.e_getlist()
        },
        e_add(){
            this.showuploadFile = true
            this.$nextTick(()=>{
                this.$refs.uploadFile.init()
            })
        },
        e_getlist(){
            this.$net('/v1/theme/queryThemeSkinList','get').then(re=>{
                if(re.code == 200){
                    this.tableData = re.data
                }
            })
        },
        e_delete(id){
            this.$confirm('确定删除该张壁纸?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
               this.$net(`/v1/theme/deleteThemeSkin/${id}`,'delete').then(re=>{
                   if(re.code == 200){
                       this.$message.success('删除成功')
                       this.e_getlist()
                   }
               })
            })
        },
        e_setDefault(id){
            this.$confirm('确定设置该张图为默认登录背景图?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$net(`/v1/theme/setDefaultTheme/${id}`,'put').then(re=>{
                    if(re.code == 200){
                        this.$message.success('设置成功')
                        this.e_getlist()
                    }
                })
            })
        }
    }
}
</script>
<style lang="scss" scoped>

</style>

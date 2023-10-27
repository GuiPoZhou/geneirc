<template>
	<div>
		<BoContainer :total="total" @changePage="e_changePage">
			<template slot="boMain">
				<BoMain>
					<template slot="bosearch">
						<el-button size="small" type="primary" @click="e_addNewVersion">发版</el-button>
					</template>
					<template slot="tableArea">
						<el-table
							:data="tableData"
							:height="mainTableHeight"
							style="width: 100%">
							<el-table-column
								prop="versionName"
								label="版本名称">
							</el-table-column>
							<el-table-column
								prop="versionNum"
								label="版本号">
							</el-table-column>
							<el-table-column
								prop="versionDescribed" label="版本描述">
							</el-table-column>
							<el-table-column
								prop="filePath" label="版本地址">
							</el-table-column>
							<el-table-column
								label="操作">
								<template slot-scope="scope">
									<el-button type="text" @click="e_delte(scope.row)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</template>
				</BoMain>
			</template>

		</BoContainer>
		<!--		发布版本-->
		<AddVersion ref="AddVersion" v-if="showAddVersion" @cancel="showAddVersion=false" @saveReload="e_saveReload"/>
	</div>
</template>
<script>
import AddVersion from "./dialog/addVersion";

export default {
	components: {AddVersion},
	data() {
		return {
			tableData: [],
			total: 0,
			showAddVersion: false,
			queryParams:{
				pageNum: 1,
				pageSize: 10,
			}
		}
	},
	mounted() {
		this.getList()
	},
	methods: {
		e_delte(row){
			this.$net(`appFile?id=${row.id}`,'delete').then(re=>{
				if(re.code == 200){
					this.getList()
				}else{
					this.$message.error(re.msg)
				}
			})
		},
		e_addNewVersion(){
			this.showAddVersion = true
			this.$nextTick(()=>{
				this.$refs.AddVersion.init()
			})
		},
		e_saveReload(){
			this.showAddVersion = false
			this.getList()
		},
		e_changePage(e){
			console.log(e)
			this.queryParams.pageNum = e.page
			this.queryParams.pageSize = e.limit
			this.getList()
		},
		getList(){
			this.$net('appFile/list','get',this.queryParams).then(re=>{
				this.total = re.total
				this.tableData = re.rows
			})
		},

	}
}
</script>

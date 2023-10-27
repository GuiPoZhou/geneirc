<template>
    <el-table-column :label="item.label" align="center" :prop="item.key" :show-overflow-tooltip="true" v-if="!item.subItemList">
      <template slot="header" slot-scope="scope">
        <el-row>
          <el-col :span="24">{{item.label}}</el-col>
          <el-col :span="24"><el-button type="text" :disabled="multiple" @click="multipleColumnShow(item)">批量录入</el-button></el-col>
        </el-row>
      </template>
    </el-table-column>
    <el-table-column :label="item.label" align="center" :prop="item.key" :show-overflow-tooltip="true" v-else>
      <el-table-column :label="subItem.label" align="center" :prop="subItem.key" :show-overflow-tooltip="true" v-for="subItem in item.subItemList">
        <template slot="header" slot-scope="scope">
          <el-row>
            <el-col :span="24">{{subItem.label}}</el-col>
            <el-col :span="24"><el-button type="text" :disabled="multiple" @click="multipleColumnShow(subItem)">批量录入</el-button></el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table-column>
</template>

<script>
	export default {
		name: 'multipleTableColumn',
		components: {},
		data() {
			return {
			}
		},
		props: {
      item: {
        type: Object,
        default: [],
      },
      multiple: {
        type: Boolean,
        default: true
      },
      startKey:{
        type: Number,
        default: 0,
      }
		},
		mounted() {
		},
		methods: {
      multipleColumnShow(item){
        this.$emit('multipleColumnShow', item);
      }
    }
	}
</script>

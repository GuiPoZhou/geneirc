<template>
  <div>
    <el-form-item :label="item.label" :prop="item.key" v-for="item in queryCriteria">
      <el-row >
        <el-col>
          <el-input
            v-if="item.type === 'input' || item.type === 'search'"
            v-model="queryParams[item.key]"
            :placeholder="item.label"
            clearable
			@clear="handleQuery"
            @keyup.enter.native="handleQuery"
			size="small"
            class="input-with-select">
            <el-select v-model="queryParams['queryLogic_' +item.key]" :placeholder="item.label" slot="prepend" placeholder="请选择" class="queryLogicSelect" size="small">
              <el-option  key="0" value="0" label="等于" />
              <el-option  key="1" value="1" label="不等于" />
              <el-option  key="2" value="2" label="包含" />
            </el-select>
          </el-input>
        </el-col>

        <el-col>
          <el-input
            type="number"
            v-if="item.type === 'number'"
            v-model="queryParams[item.key]"
            :placeholder="item.label"
            clearable
			@clear="handleQuery"
			size="small"
            @keyup.enter.native="handleQuery"
            class="input-with-select">
            <el-select v-model="queryParams['queryLogic_' +item.key]" :placeholder="item.label" slot="prepend" placeholder="请选择" class="queryLogicSelect" size="small">
              <el-option  key="0" value="0" label="等于" />
              <el-option  key="1" value="1" label="不等于" />
              <el-option  key="2" value="2" label="包含" />
            </el-select>
          </el-input>
        </el-col>

        <el-col>
          <el-date-picker
            type="date"
            v-if="item.type === 'date'"
            v-model="queryParams[item.key]"
            :placeholder="item.label"
            clearable
			size="small"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @keyup.enter.native="handleQuery"
            class="input-with-select">
            <el-select v-model="queryParams['queryLogic_' +item.key]" :placeholder="item.label" slot="prepend" placeholder="请选择" class="queryLogicSelect" size="small">
              <el-option  key="0" value="0" label="等于" />
              <el-option  key="1" value="1" label="不等于" />
              <el-option  key="2" value="2" label="包含" />
            </el-select>
          </el-date-picker>
        </el-col>

        <el-col >
          <el-select v-if="item.type ==='select' && item.options.multiple === true" v-model="queryParams[item.key]" :placeholder="item.label"  multiple size="small">
            <el-option
              v-for="row in dynamicDataSource[item.key]"
              :key="row.key"
              :label="row.value"
              :value="row.key"
            />
            <el-input v-model="queryParams['queryLogic_' +item.key]" value="0" slot="append" type="hidden" size="small"/>
          </el-select>
          <el-select v-if="item.type ==='select' && item.options.multiple === false" v-model="queryParams[item.key]" :placeholder="item.label"  @change="handleQuery" clearable size="small">
            <el-option
              v-for="row in dynamicDataSource[item.key]"
              :key="row.key"
              :label="row.value"
              :value="row.key"
            />
            <el-input v-model="queryParams['queryLogic_' +item.key]" value="0" slot="append" type="hidden" size="small"/>
          </el-select>
          <el-select v-if="item.type ==='radio' " v-model="queryParams[item.key]" :placeholder="item.label"  @change="handleQuery" clearable size="small">
            <el-option
              v-for="row in dynamicDataSource[item.key]"
              :key="row.key"
              :label="row.value"
              :value="row.key"
            />
            <el-input v-model="queryParams['queryLogic_' +item.key]" value="0" slot="append" type="hidden" size="small"/>
          </el-select>
        </el-col>
      </el-row>
    </el-form-item>
    <div class="a-c-t-btnarea">
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'dynamicQuery',
    props:{
      queryCriteria: {
        type: Array,
      },
      queryParams:{
        type: Object,
      },
      dynamicDataSource:{
        type: Object,
      }

    },
    methods:{
      handleQuery(){
        this.$parent.$parent.handleQuery();
      },
      resetQuery() {
        this.$parent.$parent.resetQuery();
      },
    }
  }
</script>

<style scoped>

</style>

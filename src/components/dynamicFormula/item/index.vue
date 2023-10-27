<template>
  <label>
    <label v-if="record.list" v-for="item in record.list">
      <dynamic-formula-item v-if="item.type === 'function'" :record="item"></dynamic-formula-item>
      <dynamic-formula-item v-else-if="item.type === 'brackets'" :record="item"></dynamic-formula-item>
      <label v-else-if="item.type === 'constant'"> {{item.value}} </label>
      <label v-else> {{item.selected.label}} </label>
    </label>
    <label v-if="record.columns" v-for="item in record.columns">
      <dynamic-formula-item v-if="item.type === 'function'" :record="item"></dynamic-formula-item>
      <dynamic-formula-item v-else-if="item.type === 'brackets'" :record="item"></dynamic-formula-item>
      <dynamic-formula-item v-else :record="item" />
    </label>
  </label>
</template>

<script>
  export default {
    name: 'dynamicFormulaItem',
    props: {
      record: {
        type: Object,
        required: true
      },
    },
  }
</script>

<style scoped>

</style>

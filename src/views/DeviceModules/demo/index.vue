<template>
    <div>
        <el-button @click="e_add">测试</el-button>
        <add ref="add" v-if="showAdd" />
    </div>
</template>

<script>
import add from './add.vue'
export default {
    components: {
        add
    },
    data() {
        return {
            showAdd: false,
        }
    },
    methods: {
        e_add() {
            this.showAdd = true
            this.$nextTick(() => {
                this.$refs.add.init()
            })
        }
    }
}
</script>

<style></style>
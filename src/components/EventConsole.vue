/*
*作为当前日志输出组件
*/

<template>
    <div class="consoleRoot">
        <div v-for="(item,idx) in listData" :key="idx">
            {{item}}
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            listData:[
                "hahhahaa",
                "aaaa"
            ]
        }
    }
}
</script>
<style lang="scss" scoped>
.consoleRoot{
    width: 100%;
}
</style>
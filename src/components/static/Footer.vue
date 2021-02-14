<template>
    <footer>
        <span>© 2021 LinnCooper</span>
    </footer>
</template>

<script>
export default {
    name:'Footer'
}
</script>

<style lang="less" scoped>
footer{
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;  
    span{
        margin-bottom: 5px;
        font-size: 12px;
    }
}
</style>
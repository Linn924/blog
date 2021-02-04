<template>
    <footer>
        <section>
            <p>{{content1}}</p>
            <p>{{content2}}</p>
        </section>
    </footer>
</template>

<script>
export default {
    data(){
        return {
            content1:'© 2020 - 2021 Simon 版权所有',
            content2:'苏ICP备20023864号'
        }
    }
}
</script>

<style lang="less" scoped>
footer{
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    section{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center; 
        p{
            margin-bottom: 5px;
            font-size: 12px;
        }  
    }
}
</style>
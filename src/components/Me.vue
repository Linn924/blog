<template>
    <div id="me">
        <h1>关于本人</h1>
        <div class="line"></div>
        <nav>
            <li>00后，大四，现居南京</li>
            <li>热爱学习，吃苦耐劳，幽默风趣</li>
            <li>喜欢和同道中人分享和讨论，热爱团队氛围</li>
            <li>近期愿望：希望能找到一份好的工作</li>
        </nav>
    </div>
</template>

<script>
export default {
    data(){
        return {

        }
    }
}
</script>

<style lang="less" scoped>
#me{
    width: 100%;
    min-height: 220px;
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 8px;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.12);
    margin-bottom: 10px;
    padding: 20px 20px;
    box-sizing: border-box;
    color: #000;
    h1{font-size: 30px;}
    .line{border: 1px solid #ddd;margin: 10px 0;}
    nav{li{margin: 10px 0;}}
}
</style>
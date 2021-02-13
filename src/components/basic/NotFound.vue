<template>
    <div id="notFound">
        <header>
            <span>LinnCooper</span>
            
            <div class="menu" @mouseenter="visible = true" @mouseleave="visible = false">
                <span>MENU</span>
                <i class="fa fa-bars"></i>
                <div class="comboBox" v-show="visible">
                    <i class="fa fa-angle-up"></i>
                    <router-link v-for="(item,index) in routerList" :key="index" :to="item.router">
                        <i :class="item.className"></i>
                        <span>{{item.name}}</span>
                    </router-link>
                </div>
            </div>
        </header>

        <section>
            <span>You are lost.</span>
        </section>
    </div>
</template>

<script>
export default {
    name:'NotFound',
    data(){
        return {
            visible:false,
            routerList:[
                {name:'首页',router:'/home',className:'fa fa-home'}
            ]
        }
    }
}
</script>

<style lang="less" scoped>
#notFound{
    height: 100vh;
    box-sizing: border-box;
    background-color:#101113;
    box-sizing: border-box;
    font-family: Helvetica;
    header{
        width: 62.5vw;
        margin: 0 auto;
        display: flex;
        justify-content: space-around;
        color: #fff;
        padding-top: 20px;
        box-sizing: border-box;
        span{text-shadow: -2px -2px 10px rgba(255, 255, 255);}
    }
    section{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%);
        span{
            color: #58CB68;  
            font-size: 24px;
            text-shadow: -2px -2px 10px rgba(79,194,99);
        }
    }
}
.menu{
    position: relative;
    cursor: pointer;
    >i{
        margin-left: 5px;
        color: #58CB68;
    }
    .comboBox{
        position: absolute;
        width: 70px;
        background-color: rgba(255, 255, 255,.5);
        border-radius: 2px;
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        font-size: 14px;
        box-sizing: border-box;
        >i{
            position: absolute;
            top: -11px;
            left: 50%;
            transform: translateX(-50%);
        }
        a{
            display: flex;
            justify-content: center;
            align-items: center;
            width: inherit;
            box-sizing: border-box;
            padding: 2px 0;
            color: #fff;
            transition: color .25s;
            span{margin-left: 4px;}
            &:not(&:last-child){border-bottom: 1px solid #ccc;}
            &:hover{color: lawngreen;}
        }
    }
}
</style>
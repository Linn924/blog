<template>
    <header>
        <section>
            <!-- 头像 -->
            <a href="javascript:void(0);">
                <img src="../../assets/image/cat.jpg" alt="">
                <span>LinnCooper</span>
            </a>
            <!-- 导航 -->
            <nav>
                <li>
                    <router-link to="/home"
                        @click.native="isSearch?getBlogsAgain():''">
                        <i class="fa fa-home"></i>
                        <span>主页</span>
                    </router-link>
                </li>
            </nav>
            <!-- 未登录提示语 -->
            <div class="not-logon" v-show="!status">
                <span>未登录，</span>
                <router-link to="/login">登录</router-link>
            </div>
            <!-- 登录提示语 -->
            <div class="logon" v-show="status">
                <span>欢迎您，</span>
                <span @mouseenter="personBoxShow = true" @mouseleave="personBoxShow = false">
                    {{username}}
                </span>
                <!-- 个人中心盒子 -->
                <div class="person-box" @mouseenter="personBoxShow = true" 
                    @mouseleave="personBoxShow = false" v-show="personBoxShow">
                    <div class="person-center">
                        <router-link to="/personalcenter">个人中心</router-link>
                    </div>
                    <div class="logout" @click="logout">
                        <span>登出</span>
                    </div>
                </div>
            </div>

            <el-dropdown placement="bottom-start" trigger="click">
                <span class="el-dropdown-link">
                    <i class="fa fa-bars"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                        <router-link to="/home" 
                            @click.native="isSearch?getBlogAgain():''">
                            <i class="el-icon-s-home" style="color:#000"></i>
                            <span style="color:#000">首页</span>
                        </router-link>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </section>
        
    </header>
</template>

<script>
export default {
    inject:['reload'],
    name:'Header',
    props:{
        getBlogsAgain:{
            type:Function,
            required:true
        },
        isSearch:{
            type:Boolean,
            required:true
        }
    },
    data(){
        return {
            username:'', //昵称
            status:false,//登录状态         
            personBoxShow:false,//控制个人中心盒子显隐 
        }
    },
    created(){
        this.getUserData()
    },
    methods:{
        //登出
        logout(){
            sessionStorage.clear()
            this.reload()
            this.$router.push('/home')
            this.$message({message:'登出成功',type: 'success',duration:1200})
        },
        //获取用户信息及状态
        getUserData(){
            let userForm = JSON.parse(sessionStorage.getItem('userForm'))
            if(!userForm) this.status = false
            else{
                this.username = userForm.username
                this.status = true
            }   
        }
    }
}
</script>

<style lang="less" scoped>
header{
    min-height: 60px;
    background-color: #fff;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.12);
    display: flex;
    justify-content: center;
    align-items: center;
    section{
        width: 80vw;
        display: grid;
        grid-template-columns:200px 1fr auto;
        grid-template-rows: 1fr;
        margin: 0 auto;
        >a{
            display: flex;
            align-items: center;
            &:hover span{color: #2468F2;}
            img{
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-right: 20px;
            }
            span{
                color: #000;
                font-size: 20px;
                transition: color .15s; 
            }
        }
        nav{
            display: flex;
            list-style: none;
            line-height: 60px;
            li{
                margin-right: 20px;
                a{
                    color: #000;
                    transition: color .15s; 
                    &:hover{color: #2468F2!important;}
                    font-size: 15px;
                    >i{margin-right: 2px;}
                }
                
            }
        }
        .not-logon{
            display: flex;
            justify-content: center;
            align-items: center;
            a{color: #2468F2!important;}
        }
        .logon{
            display: flex;
            justify-content: flex-end;
            align-items: center;
            span:nth-child(2){
                color: #2468F2;
                cursor: pointer;
            }
        }
    }
}
.logon{
    position: relative;
    .person-box{
        position: absolute;
        top: 50px;
        right: -30px;
        z-index: 999;
        width: 100px;
        height: 50px;
        background-color: #fff;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,0.12);
        display: flex;
        flex-direction: column;
        font-size: 14px;
        border-radius: 5px;
        &::before{
            content: "";
            position: absolute;
            top: -10px;
            left:40px;
            width: 0;
            height: 0;
            border-width:0 10px 10px 10px;
            border-style: solid;
            border-color: transparent transparent #2468F2 transparent;
            box-shadow: 0 2px 10px 0 rgba(0,0,0,0.12);
        }
        div{
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 5px;
            cursor: pointer;
            &:hover{color: #2468F2;}
        }
        div:first-child{
            border-bottom: 1px solid #ccc;
            a{
                color: #000;
                &:hover{color: #2468F2;}
            }
        }
    }
}
@media screen and (min-width:376px){
  header{
      position: sticky;
      top: 0;
      z-index: 998;
    }
}
@media screen and (min-width:561px){
    .el-dropdown{
        display: none!important;
    }
}
@media screen and (max-width:560px){
    header>section nav,
    .not-logon,
    .logon,
    header>section>a span{
        display: none!important;
    }
    header>section{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .el-dropdown{
        display: block!important;
    }
    .el-dropdown>span i{
        font-size: 24px;
        cursor: pointer;
        transition: color .15s;
        &:hover{color: #2468F2;}
    }
}
</style>
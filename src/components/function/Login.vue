<template>
    <div class="logon">
        <header></header>
        <main>
            <!-- 左侧登录 -->
            <div class="main-left">
                <div class="logon-form">
                    <div class="title">
                        <span>账号登录</span>
                    </div>
                    <div class="line"></div>
                    <!-- 登录方法 -->
                    <div class="logon-method">
                        <!-- 账号登录 -->
                        <div class="account-form">
                            <div class="account-content">
                                <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
                                    <el-form-item prop="username">
                                        <el-input v-model="loginForm.username" clearable prefix-icon="el-icon-user-solid"
                                            placeholder="username"></el-input>
                                    </el-form-item>
                                    <el-form-item prop="password">
                                        <el-input v-model="loginForm.password" clearable prefix-icon="el-icon-lock"
                                            type="password" placeholder="password"></el-input>
                                    </el-form-item>
                                </el-form>
                                <button @click="logon">登录</button>
                            </div>
                            <div class="account-end">
                                <router-link to="/register">注册</router-link>
                                <span>|</span>
                                <router-link to="/resetpwd">忘记密码</router-link>
                                <span>|</span>
                                <router-link to="/home">游客浏览</router-link>
                            </div>
                            <p class="account-tips">温馨提示：<br/>只有登录才能使用一些有权限的功能哦!</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 右侧修饰部分 -->
            <div class="main-right">
            </div>
        </main> 
        <footer>
            <section>
                <span>© 2020 - 2021 LinnCode 版权所有</span>
                <span> 苏ICP备20023864号</span>
            </section>  
        </footer>
    </div>
</template>

<script>
export default {
    data(){
        return {
            loginForm:{//登录表单
                username:'test',
                password:'123456'
            },
            loginRules:{//登录表单验证规则
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
                ]
            },
        }
    },
    methods:{
        //登录
        async logon(){
            this.$refs.loginFormRef.validate( async valid => {
                if(!valid) return this.$message({message: '请输入用户名密码登录',type: 'error',duration:1200})
                const {data:res} = await this.$axios.get('users',{params:this.loginForm})
                if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1200})
                this.$message({message: `${res.tips}`,type: 'success',duration:1200})
                let userFrom = {
                    id:res.id,
                    username:res.username,
                    email:res.email,
                    avatar:res.avatar,
                    logontime:new Date()
                }
                sessionStorage.setItem('token',res.token)
                sessionStorage.setItem('userForm',JSON.stringify(userFrom))
                this.$router.push('/home')
                this.saveOperateLog()
            })
        },
        //操作日志
        saveOperateLog(){
            let operationlogArr = []
            let operationlogForm = {
                title:'欢迎您登录',
                time:new Date()
            }
            operationlogArr.push(operationlogForm)
            sessionStorage.setItem('operationlogArr',JSON.stringify(operationlogArr))
        }
    }
}
</script>

<style lang="less" scoped>
.logon{
    height: 100vh;
    background-color: #F6F8FB;
    background-repeat: repeat-y;
    background-size: 30% 100%;
    background-position: 0 0;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAABCAYAAABkOJMpAAAAAXNSR0IArs4c6QAAABpJREFUOBFjVMn49J9hFIyGwGgIjIbAEAgBAK6uAn+8Yc3TAAAAAElFTkSuQmCC);
    display: flex;
    flex-direction: column;
    header{
        padding: 70px 0;
        height: 20px;
        width: 1200px;
        margin: 0 auto;
    }
    main{
        width: 1200px;
        border-radius: 5px;
        margin: 0 auto;
        background:url(https://s3.ax1x.com/2021/02/02/ynl0PJ.jpg) no-repeat right center;
    }
    footer{
        flex: 1;
        width: 1200px;
        margin: 0 auto; 
    }
}
main{
    display: flex;
    justify-content: space-between;
    .main-left{
        width: 420px;
        height: 492px;
        background-color:#FFFFFF;
        border-radius: 5px 0 0 5px;
        box-shadow: 0 10px 20px 0px rgba(0, 0, 0, .05);
        box-sizing: border-box;
        padding: 50px;
        .logon-form{
            width: 100%;
            height: 100%;
            position: relative;
            .title{
                display: flex;
                justify-content: space-around;
                padding: 20px 0;
                font-size: 18px;
                cursor: pointer;
            }
            .line{
                border: 1px solid #ECECEC;
            }
        }
        
    }
}
footer{
    display: flex;
    justify-content: center;
    align-items: flex-end;
    section{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        span{font-size: 12px;}
    }
}
.logon-method{
    height: 100%;
    width: 100%;
    display: flex;
    .account-form{
        .account-content{
            padding: 30px 0;
            button{
                width: 320px;
                padding: 12px 0;
                border-radius: 20px;
                border: none;
                outline: none;
                background-color: #2468F2;
                color: #fff;
                cursor: pointer;
            }
        }
        .account-end{
            display: flex;
            justify-content: space-around;
            a{
                font-size: 12px;
                color: #333;
                cursor: pointer;
                &:hover{color: #2468F2;}
            }
            span:nth-child(2n){color: #EBEBEB;font-size: 12px;}   
        }
        .account-tips{
            margin-top: 30px;
            font-size: 12px;
            line-height: 2;
            color: #AAAAAA;
        }
    }
}
</style>
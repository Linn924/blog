<template>
    <div class="register">
        <!-- 遮罩 -->
        <div class="mask"></div>
        <!-- 主体内容 -->
        <section>
            <header></header>
            <main>
                <!-- 左侧修饰样式 -->
                <div class="main-left"></div>
                <!-- 右侧关于登录的部分 -->
                <div class="main-right">
                    <div class="register-form">
                        <div class="title">
                            <span>注册账号</span>
                        </div>
                        <div class="line"></div>
                        <!-- 注册方法 -->
                        <div class="register-method">
                            <!-- 账号注册 -->
                            <div class="account-form">
                                <div class="account-content">
                                    <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules">
                                        <el-form-item>
                                            <el-input v-model="registerForm.username" clearable prefix-icon="el-icon-user-solid" 
                                                placeholder="请设置昵称" @keyup.native="checkName" 
                                                :class="isSuccess?'':'fail'" @blur="checkName"></el-input>
                                            <span class="check" :style="{color:validateForm.success?'#67C23A':'#F56C6C'}">
                                                {{validateForm.value}}</span>
                                        </el-form-item>
                                        <el-form-item prop="password">
                                            <el-input v-model="registerForm.password" clearable prefix-icon="el-icon-lock" 
                                                type="password" placeholder="请设置密码"></el-input>
                                        </el-form-item>
                                        <el-form-item prop="email">
                                            <el-input v-model="registerForm.email" clearable prefix-icon="el-icon-message" 
                                                placeholder="请设置邮箱"></el-input>
                                        </el-form-item>
                                    </el-form>
                                    <button @click="register">注册</button>
                                    <div class="account-end">
                                        已有账号？<router-link to="/login">登录</router-link>
                                    </div>
                                    <p class="account-tips">温馨提示：请按照规定注册账号哦!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer></footer>
        </section>
    </div>
</template>

<script>
export default {
    data(){
        // 验证邮箱的规则
        let checkEmail = (rule, value, cb) => {
            // 验证邮箱的正则表达式
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (regEmail.test(value)) {
                // 合法的邮箱   
                return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }
        return {
            registerForm:{//注册表单
                username:'',
                password:'',
                email:'',
                avatar:'https://s3.ax1x.com/2020/12/09/r9jlDg.png',//默认头像
                status:'注册',//操作状态
            },
            registerRules:{//注册表单验证规则
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ]
            },
            timer:null,//设置定时器初始值
            validateForm:{//验证表单
                value:'',
                success:''
            },
            isSuccess:true,//控制昵称输入框的边框颜色变化
        }
    },
    watch:{
        'registerForm.username':{
            handler: function(value) {
                if(value.trim().length === 0){
                    this.validateForm.value = ''
                    this.validateForm.success = ''
                    this.isSuccess = true
                }
            },
        }
    },
    methods:{
        //检查昵称是否可用
        checkName(){
            clearTimeout(this.timer)
            this.timer = setTimeout(async () => {
                const {data:res} = await this.$axios.get('checkName',{
                    params:{
                        username:this.registerForm.username,
                        status:this.registerForm.status
                    }
                })
                if(res.code != 200){
                    this.validateForm.success = false
                    this.isSuccess = false
                }
                else{
                    this.validateForm.success = true
                    this.isSuccess = true
                }
                this.validateForm.value = res.tips
            },500)
        },
        //注册
        async register(){
            if(!this.registerForm.username.trim() || !this.isSuccess){
                this.checkName()
                return
            }
            this.$refs.registerFormRef.validate( async valid => {
                if(!valid) return
                const {data:res} = await this.$axios.post('users',this.registerForm)
                if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1200})
                this.$message({message: `${res.tips}`,type: 'success',duration:1200})
                this.$router.push('/login')
            })
        },
    }
}
</script>

<style lang="less" scoped>
.register{
    height: 100vh;
    background: url(https://s3.ax1x.com/2021/02/04/y1r534.jpg) no-repeat center center;
    .mask{
        height: 100%;
        background-image: radial-gradient(rgba(0,0,0,0) 0%,rgba(0,0,0,0.5) 100%),radial-gradient(rgba(0,0,0,0) 33%,rgba(0,0,0,0.3) 166%);
    }
    section{
        position: absolute;
        top: 0;
        width: 100vw;
        height: 100vh;
    }
}
section{
    header,footer{
        padding: 70px 0;
        height: 7.5vh;
        width: 90vw;
        margin: 0 auto;
    }
    main{
        width: 90vw;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
    }
}
main{
    .main-right{
        width: 480px;
        height: 460px;
        background-color:rgba(255,255,255,.5);
        backdrop-filter: blur(5px);
        border-radius: 15px;
        box-sizing: border-box;
        padding: 20px;
        .register-form{
            width: 100%;
            height: 100%;
            position: relative;
            .title{
                display: flex;
                justify-content: space-around;
                padding: 10px 0;
                font-size: 20px;
            }
            .line{
                border: 1px solid #ECECEC;
            }
        }
        
    }
}
.register-method{
    height: 100%;
    width: 100%;
    display: flex;
    .account-form{
        margin: 0 auto;
        .account-content{
            padding-top: 30px;
            button{
                width: 400px;
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
            justify-content: flex-end;
            margin-top: 20px;
            a{
                color: #2468F2;
                cursor: pointer;
            } 
        }
        .account-tips{
            margin-top: 20px;
            font-size: 12px;
            line-height: 2;
        }
    }
}
.check{
    position: absolute;
    top: 30px;
    left: 0;
    font-size: 12px;
}
.el-input{
    width: 400px!important;
}
</style>
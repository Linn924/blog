<template>
    <div id="register">
        <header></header>
        <main>
            <div class="main-left"></div>
            <div class="main-right">
                <div class="title"><span>注册账号</span></div>
                <div class="line"></div>
                <div class="form">
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
                    <div class="nav">
                        已有账号？<router-link to="/login">登录</router-link>
                    </div>
                    <p class="tips">温馨提示：请按照规定注册账号哦!</p>
                </div>
            </div>
        </main>
        <footer></footer>
    </div>
</template>

<script>
export default {
    name:'Register',
    data(){
        let checkEmail = (rule, value, cb) => {
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (regEmail.test(value)) {  
                return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }
        return {
            registerForm:{
                username:'',
                password:'',
                email:'',
                status:'注册',
            },
            registerRules:{
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ]
            },
            timer:null,
            validateForm:{
                value:'',
                success:''
            },
            isSuccess:true
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
        checkName(){
            clearTimeout(this.timer)
            this.timer = setTimeout(async () => {
                const {data:res} = await this.axios.get('checkName',{
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
        async register(){
            if(!this.registerForm.username.trim() || !this.isSuccess){
                this.checkName()
                return this.$message({message: '请按规则注册账号',type: 'error',duration:1200})
            }
            this.$refs.registerFormRef.validate( async valid => {
                if(!valid) return
                const {data:res} = await this.axios.post('register',this.registerForm)
                if(res.code != 200) 
                return this.$message({message: `${res.tips}`,type: 'error',duration:1200})
                this.$message({message: `${res.tips}`,type: 'success',duration:1200})
                this.$router.push('/login')
            })
        }
    }
}
</script>

<style lang="less" scoped>
#register{
    height: 100vh;
    background: url('../../assets/image/work.jpg') no-repeat center center;
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
.main-right{
    width: 480px;
    height: 460px;
    background-color:rgba(255,255,255,.5);
    backdrop-filter: blur(5px);
    border-radius: 15px;
    box-sizing: border-box;
    padding: 20px;
    .title{
        display: flex;
        justify-content: space-around;
        padding: 20px 0;
        font-size: 20px;
    }
    .line{
        border: 1px solid #ECECEC;
        margin-bottom: 40px;
    }
}
.form{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
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
    .nav{
        align-self: flex-end;
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
        a{
            color: #2468F2;
            cursor: pointer;
        } 
    }
    .tips{
        align-self: flex-start;
        margin-top: 20px;
        font-size: 12px;
        line-height: 2;
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
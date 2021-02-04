<template>
    <div class="personal-center">
        <Header :isSearch="false"></Header>
        <main>
            <!-- 左侧导航 -->
            <div class="main-left">
                <nav>
                    <li v-for="item in navList" :key="item.id" @click="switchNav(item.id)"  
                        :class="currentIndex == item.id?'changeColor':''">
                        <i :class="item.className"></i>
                        <span>{{item.title}}</span>
                    </li>
                </nav>
            </div>
            <!-- 右侧与导航相对应模块 -->
            <div class="main-right">
                <!-- 个人信息 -->
                <div class="personal-information" v-show="currentIndex == 0">
                    <div class="basic-data">
                        <div class="basic-data-title">
                            <span>基本信息</span>
                            <div>
                                <span v-show="disabled" @click="editUsers">编辑信息</span>
                                <span v-show="!disabled" @click="cancelEdit">取消编辑</span>
                            </div>
                        </div>
                        <div class="head-portrait">
                            <img :src="userForm.avatar" alt="">
                            <div>
                                <input type="file" accept="image/*" @change="uploadAvatar" ref="uploadImg" v-show="false"/>
                                <span @click="$refs.uploadImg.click()">修改头像</span>
                            </div>
                        </div>
                        <div class="basic-data-item">
                            <span>昵称：</span>
                            <input class="input" ref="uname" type="text" @keyup="checkName"
                                :disabled="disabled" v-model="userForm.username">
                            <span :class="isSuccessUname?'tips success-message':'tips fail-message'" 
                                v-show="tipsUname">{{tipsUname}}</span>
                        </div>
                        <div class="basic-data-item">
                            <span>邮箱：</span>
                            <input class="input" type="text" @keyup="checkEmail"
                                :disabled="disabled" v-model="userForm.email">
                            <span :class="isSuccessEmail?'tips success-message':'tips fail-message'" 
                                v-show="tipsEmail">{{tipsEmail}}</span>
                        </div>
                        <div class="resetpwd">
                            <span>密码：</span>
                            <router-link to="/resetpwd">修改密码</router-link>
                        </div>
                        <button class="button" @click="putUsers">提交</button>
                    </div>
                    <div class="fixed-data">
                        <div class="fixed-data-title">
                            <span>动态信息</span>
                        </div>
                        <div class="fixed-data-item">
                            <span>登录时间：{{userForm.logontime | date}}</span>
                        </div>
                    </div>
                </div>
                <!-- 评论文章 -->
                <div class="comment-article" v-show="currentIndex == 1">
                    <!-- 博客区域 -->
                    <article v-for="item in blogList" :key="item.id">
                        <span @click="readBlogs(item)">{{item.title}}</span>
                        <div>
                            <i class="el-icon-date"><span>{{item.date | date}}</span></i>
                        </div>
                        <p>{{item.introduce}}</p>
                    </article>
                </div>
                <!-- 操作日志 -->
                <div class="operation-log" v-show="currentIndex == 2">
                    <el-timeline :reverse="true">
                        <el-timeline-item v-for="(item,index) in operationlogArr" :key="index" :timestamp="item.time" placement="top">
                            <el-card>
                                <h4>{{item.title}}</h4>
                            </el-card>
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </div>
        </main>
        <Footer></Footer>
    </div>
</template>

<script>
import Header from '../basic/Header.vue'
import Footer from '../basic/Footer.vue'
export default {
    inject:['reload'],//注入重载方法
    components:{//私有组件
        Header,
        Footer
    },
    data(){
        return {
            navList:[//左侧导航
                {id:0,className:'el-icon-user',title:'个人信息'},
                {id:1,className:'el-icon-tickets',title:'评论文章'},
                {id:2,className:'el-icon-document-remove',title:'操作日志'},
            ],
            currentIndex:0,//当前导航下标
            userForm:{
                id:Number,
                username:'',//用户昵称
                email:'',//用户邮箱
                avatar:'',//用户头像
                status:'修改',//操作状态
                logontime:''//登录时间
            },
            disabled:true,//禁止修改个人信息
            tipsUname:'',//昵称提示语
            tipsEmail:'',//邮箱提示语
            timerUname:null,//用户名定时器
            timerEmail:null,//邮箱定时器
            isSuccessUname:false,//用户名验证信息是否正确
            isSuccessEmail:false,//邮箱验证信息是否正确
            blogList:[],//当前用户评论的所有博客
            operationlogArr:[],//操作日志
        }
    },
    created(){
        this.getUserForm()
        this.getBlogs()
    },
    methods:{
        //处理时间格式
        dealDate(time){
            const t = new Date(time)
            const y = t.getFullYear()
            const m = (t.getMonth() + 1 + '').padStart(2, '0')
            const d = (t.getDate() + '').padStart(2, '0')
            const hh = (t.getHours() + '').padStart(2, '0')
            const mm = (t.getMinutes() + '').padStart(2, '0')
            const ss = (t.getSeconds() + '').padStart(2, '0')
            return `${y}/${m}/${d} ${hh}:${mm}:${ss}`
        },
        //切换导航
        switchNav(id){
            this.currentIndex = id
            if(id == 2) this.getOperateLog()
        },
        //获取用户个人信息
        getUserForm(){
            let userForm = JSON.parse(sessionStorage.getItem('userForm'))
            if(userForm){
                this.userForm.username = userForm.username
                this.userForm.email = userForm.email
                this.userForm.logontime = userForm.logontime
                this.userForm.id = userForm.id
                this.userForm.avatar = userForm.avatar
            }
        },
        //编辑个人信息
        editUsers(){
            this.disabled = false
            this.$nextTick(() => {this.$refs.uname.focus()})
        },
        //取消编辑
        cancelEdit(){
            this.disabled = true
            this.getUserForm()
            this.tipsUname = ''
            this.tipsEmail = ''
        },
        //修改个人信息
        async putUsers(){
            if(this.disabled) return this.$message({message:'未作出任何修改',type:'error',duration:1200})
            if(!this.isSuccessEmail && !this.isSuccessUname) 
            return this.$message({message:'请按规定修改信息',type:'error',duration:1200})
            const {data:res} = await this.$axios.put('users',this.userForm)
            if(res.code !== 200) return this.$message({message:`${res.tips}`,type:'error',duration:1200})
            this.$message({message:`${res.tips}`,type:'success',duration:1200})
            this.putStorage()
            this.reload()
        },
        //更新本地存储
        putStorage(){
            let userForm = {
                id:this.userForm.id,
                username:this.userForm.username,
                email:this.userForm.email,
                logontime:this.userForm.logontime,
                avatar:this.userForm.avatar
            }
            sessionStorage.setItem('userForm',JSON.stringify(userForm))
        },
        //检查昵称是否可用
        checkName(){
            clearTimeout(this.timerUname)
            this.timerUname = setTimeout(async () => {
                const {data:res} = await this.$axios.get('checkName',{
                    params:{
                        username:this.userForm.username,
                        status:this.userForm.status
                    }
                })
                if(res.code != 200) this.isSuccessUname = false
                else this.isSuccessUname = true
                this.tipsUname = res.tips
            },500)
        },
        //检查邮箱是否可用
        checkEmail(){
            clearTimeout(this.timerEmail)
            this.timerEmail = setTimeout(() => {
                const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                if (regEmail.test(this.userForm.email)) {
                    if(this.userForm.email === JSON.parse(sessionStorage.getItem('userForm')).email) {
                        this.tipsEmail = '未作出修改'
                        this.isSuccessEmail = false
                    }
                    else {
                        this.tipsEmail = '邮箱可用~'
                        this.isSuccessEmail = true
                    }
                }
                else {
                    this.tipsEmail = '邮箱不可用'
                    this.isSuccessEmail = false
                }
            },500)
        },
        //上传头像
        async uploadAvatar(e){
            let image = e.target.files[0] //获取图片文件
            let formData = new FormData()  // 创建form对象
            formData.append('image', image)  // 通过append向form对象添加数据
            formData.append('username',this.userForm.username)
            formData.append('avatar',this.userForm.avatar)
            const {data:res} = await this.$axios.post('images',formData)
            if(res.code != 200) return this.$message({message:`${res.tips}`,type:'error',duration:1200})
            this.$message({message:`${res.tips}`,type:'success',duration:1200})
            this.userForm.avatar = res.data
            this.putStorage()
            this.reload()
        },
        //获取用户评论过的所有博客信息
        async getBlogs(){
            const {data:res} = await this.$axios.get(`blogs/${this.userForm.id}`)
            if(res.code !== 200) return new Error()
            this.blogList = res.data
        },
        //进入相应的博客
        readBlogs(item){
            this.$router.push({path:`/home/article?${item.mdname}`})
            if(sessionStorage.token){
                this.saveOperateLog(item.title)
            }
        },
        //操作日志
        saveOperateLog(content){
            let str = sessionStorage.getItem('operationlogArr')
            let operationlogArr = str == null ? [] : JSON.parse(str)
            let operationlogForm = {
                title:`您浏览了${content}这篇文章`,
                time:new Date()
            }
            operationlogArr.push(operationlogForm)
            sessionStorage.setItem('operationlogArr',JSON.stringify(operationlogArr))
        },
        //获取操作日志
        getOperateLog(){
            let str = sessionStorage.getItem('operationlogArr')
            this.operationlogArr = JSON.parse(str)
            this.operationlogArr.forEach(item => item.time = this.dealDate(item.time))
        }
    },
    
}
</script>

<style lang="less" scoped>
.personal-center{
    width: 100vw;
    height: 100vh;
}
main{
    box-sizing: border-box;
    padding: 2vh 0 5vh 0;
    width: 80vw;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.5fr 8.5fr;
    grid-template-rows: auto;
    gap: 20px;
}
.main-left{
    background-color: #fff;
    box-shadow: 0 10px 20px 0px rgba(0, 0, 0, .05);
    box-sizing: border-box;
    border-radius: 3px;
    height: 425px;
    nav{
        list-style: none;
        box-sizing: border-box;
        padding: 0 15px;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        li{
            flex: 1;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            cursor: pointer;
            border-bottom: 1px solid #ccc;
            span{margin-left: 5px;}
            &:hover{color:#2468F2;}
            &:last-child{border: none;}
        }

    }
}
.main-right{
    max-height: 425px;
    background-color: #fff;
    box-shadow: 0 10px 20px 0px rgba(0, 0, 0, .05);
    box-sizing: border-box;
    border-radius: 3px;
    padding: 50px;
    overflow: hidden;
    &:hover{overflow-y: auto;}
}
.changeColor{
    color: #2468F2!important;
}
.personal-information{
    display: flex;
    justify-content: flex-start;
    .basic-data{
        flex: 1;
        display: flex;
        flex-direction: column;
        border-right: 1px solid #ccc;
        box-sizing: border-box;
        .basic-data-title{
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            div{margin-right: 22px;}
            div span{
                color: #2468F2;
                cursor: pointer;
                &:hover{text-decoration: underline;}
            }
        }
        .head-portrait{
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            img{
                height: 60px;
                width: 60px;
                border-radius: 50%;
            }
            div{
                margin-left: 20px;
                span{
                    color: #2468F2;
                    cursor: pointer;
                    &:hover{text-decoration: underline;}  
                }
            }
        }
        .basic-data-item{
            display: flex;
            position: relative;
            margin-bottom: 30px;
            .tips{
                position: absolute;
                top: 25px;
                font-size: 12px;
            }
        }
        .resetpwd{
            a{
                color: #2468F2;
                font-size: 14px;
                &:hover{text-decoration: underline;}  
            }
        }
    }
    .fixed-data{
        box-sizing: border-box;
        padding: 0 22px;
        flex: 1;
        display: flex;
        flex-direction: column;
        .fixed-data-title{
            margin-bottom: 30px;
        }
        .fixed-data-item{
            margin-bottom: 30px;
        }
    }
}
.input{
    border: none;
    outline: none;
    width: 500px;
    border-bottom: 1px solid #ccc;
    background-color: #fff;
}
.button{
    align-self: center;
    outline: none;
    border: none;
    background-color: #2468F2;
    color: #fff;
    width: 80px;
    height: 30px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 14px;
    margin-top: 30px;
    &:hover{opacity: 0.8;}
}
.success-message{
    color: #67C23A!important;
}
.fail-message{
    color:#F56C6C!important;
}
.comment-article{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    article{
        background-color: rgba(255, 255, 255, 0.4);
        box-shadow: 0 2px 10px 0 rgba(0,0,0,0.12);
        border: 1px solid #ebeef5;
        margin-bottom: 10px;
        padding: 20px 20px;
        border-radius: 3px;
        box-sizing: border-box;
        color: #000;
        >span{
            font-size: 28px;
            font-weight: 400;
            cursor: pointer;
            &:hover{color: #2468F2;}
        }
        div{
            margin: 20px 0;
            i{
                margin-right: 10px;
                span{margin-left: 5px;}
            }
        }
    }
}
.main-right::-webkit-scrollbar {width: 6px;}
.main-right::-webkit-scrollbar-thumb {background-color: #ddd;border-radius: 3px;}
.main-right::-webkit-scrollbar-track{background-color: #fff;}
</style>
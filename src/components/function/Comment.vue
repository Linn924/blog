<template>
    <div class="comment">
        <div class="title-comment">
            <span>评论</span>
            <span>共{{commentList.length}}条评论</span>
            <div></div>
        </div>
        <div class="yours-comment">
            <div class="part-one">
                <img :src="user_avatar" alt="">
                <div class="triangle"></div>
                <textarea placeholder="评论" maxlength=140 v-model="commentForm.content"></textarea>
            </div>
            <div class="part-two">
                <span>140</span>
                <button @click="postComments">评论</button>
            </div>
        </div>
        <div class="others-comment">
            <div class="title">
                <span>所有评论</span>
                <div></div>
            </div>
            <div class="others-comment-item" v-for="(item,index) in commentList" :key="item.id">
                <img :src="item.avatar" alt="">
                <div class="right">
                    <div class="content">
                        <span>{{item.username}}：</span>
                        <span>{{item.content}}</span>
                    </div>
                    <div class="reply-comment" v-for="(it,i) in item.children" :key="i">
                        <span>{{it.username}}：</span>
                        <span>{{it.reply_content}}</span>
                    </div>
                    <div class="time">
                        <span>{{item.date | date}}</span>
                        <div class="operate">
                            <span @click="putComments(item,index)" :class="agree[index].status?'changeColor':''">
                                <i class="el-icon-thumb"></i>{{item.agree_count}}</span>
                            <span>|</span>
                            <span @click="showReplyBox(index)">回复</span>
                        </div>
                    </div>
                    <div class="replyBox" v-if="reply[index].status">
                        <div class="triangle"></div>
                        <textarea maxlength=140 v-model="reply[index].content"></textarea>
                        <div>
                            <span>140</span>
                            <button @click="replyComment(item,index)">回复</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="empty" v-if="commentList.length == 0">
                暂无评论
            </div>
        </div>
    </div>
</template>

<script>
export default {
    inject:['reload'],
    name:'Comment',
    props:{
        commentList:{
            type:Array,
            required:true
        },
        id:{
            type:Number,
            required:true
        },
        getComments:{
            type:Function,
            required:true
        }
    },
    data(){
        return {
            commentForm:{//评论表单
                blog_id:'',
                user_id:'',
                content:'',
                date:new Date(),
                agree_count:0
            },
            user_avatar:'',//当前用户头像
            agreeArr:[],//判断当前登录的用户点赞了哪些评论
            replyArr:[],//判断点击了哪些评论下边的回复链接
        }
    },
    created(){
        let userForm = JSON.parse(sessionStorage.getItem('userForm'))
        if(userForm) {
            this.commentForm.user_id = userForm.id
            this.user_avatar = userForm.avatar
        }else{
            this.user_avatar = 'https://s3.ax1x.com/2020/12/09/r9jlDg.png'
        }
    },
    computed:{
        //获取当前用户点赞了哪些评论(状态判断)
        agree(){
            this.agreeArr = Array.from({length: this.commentList.length}, () => ({status:false}))
            this.commentList.forEach((item,index) => {
                if(JSON.parse(item.agree_user_id).length !== 0){
                   JSON.parse(item.agree_user_id).some(i => {
                       if(i == this.commentForm.user_id){
                           this.agreeArr[index].status = true
                       }
                   })
                }
            })
            return this.agreeArr
        },
        //获取当前用户点击了哪些评论下边的回复(状态判断)
        reply(){
            this.replyArr = Array.from({length: this.commentList.length}, () => ({status:false,content:''}))
            this.commentList.forEach((item,index) => this.replyArr[index].content = '回复' + item.username + ':')
            return this.replyArr
        }
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
            return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
        },
        //提交评论
        async postComments(){
            if(!sessionStorage.token) {
                this.commentForm.content = ''
                return this.$message({message:'您还没有登录，请点击右上角的登录链接',type:'error',duration:1200})
            } 
            if(!this.commentForm.content.length) 
            return this.$message({message:'您还没有评论',type:'error',duration:1200})
            this.commentForm.blog_id = this.id
            this.commentForm.date = this.dealDate(this.commentForm.date)
            const {data:res} = await this.axios.post('comments',this.commentForm)
            if(res.code != 200) {
                this.commentForm.content = ''
                return this.$message({message:`${res.tips}`,type:'error',duration:1200})
            }
            this.$message({message:`${res.tips}`,type:'success',duration:1200})
            this.saveOperateLog(this.commentForm.content)
            this.reload()
        },
        //点赞
        async putComments(data,index){
            if(!sessionStorage.token) 
            return this.$message({message:'您还没有登录，请点击右上角的登录链接',type:'error',duration:1200})
            let commentForm = this.dealAgree(data,index)
            const {data:res} = await this.axios.put('comments',commentForm)
            if(res.code != 200) {
                this.agreeArr[index].status = !this.agreeArr[index].status
                return this.$message({message:`${res.tips}`,type:'error',duration:1200})
            }
            this.$message({message:`${res.tips}`,type:'success',duration:1200})
            this.getComments(sessionStorage.getItem('blog_id'))
        },
        //处理点赞的逻辑代码
        dealAgree(data,index){
            this.agreeArr[index].status = !this.agreeArr[index].status
            let arr = JSON.parse(data.agree_user_id),agree_user_id,agree_count
            if(arr.length == 0){
                if(this.agreeArr[index].status){
                    agree_user_id = JSON.stringify(arr.concat(this.commentForm.user_id))
                    agree_count = data.agree_count + 1
                }else {
                    agree_user_id = JSON.stringify(arr)
                    agree_count = data.agree_count - 1
                }
            }else{
                if(this.agreeArr[index].status){
                    agree_count = data.agree_count + 1
                    let flag = arr.some(item => item == this.commentForm.user_id)
                    if(flag) agree_user_id = JSON.stringify(arr)
                    else agree_user_id = JSON.stringify(arr.concat(this.commentForm.user_id))
                }else{
                    agree_user_id = JSON.stringify(arr.filter(item => item != this.commentForm.user_id))
                    agree_count = data.agree_count - 1
                }  
            }
            let commentForm = {
                id:data.id,
                linked_id:data.user_id,
                agree_count:agree_count,
                agree_user_id:agree_user_id,
                status:this.agreeArr[index].status,
                praised:this.agreeArr[index].status? data.praised + 1 : data.praised - 1
            }
            return commentForm
        },
        //显示回复盒子
        showReplyBox(index){
            if(!sessionStorage.token) 
            return this.$message({message:'您还没有登录，请点击右上角的登录链接',type:'error',duration:1200})
            this.replyArr[index].status = !this.replyArr[index].status
        },
        //回复
        async replyComment(data,index){
            let replyForm = {
                blog_id:'',//博客id
                commentator_id:'',//评论人ID
                respondent_id:'',//被评论人ID
                reply_content:'',//回复评论的内容
            }
            replyForm.blog_id = this.id
            replyForm.commentator_id = this.commentForm.user_id
            replyForm.respondent_id = data.user_id
            replyForm.reply_content = this.replyArr[index].content.split(`回复${data.username}:`)[1]
            const {data:res} = await this.axios.post('replyComment',replyForm)
            if(res.code != 200) 
            return this.$message({message:`${res.tips}`,type:'error',duration:1200})
            this.$message({message:`${res.tips}`,type:'success',duration:1200})
            this.getComments(sessionStorage.getItem('blog_id'))
        },
        //操作日志
        saveOperateLog(content){
            let str = sessionStorage.getItem('operationlogArr')
            let operationlogArr = str == null ? [] : JSON.parse(str)
            let operationlogForm = {
                title:`您评论了${content}`,
                time:new Date()
            }
            operationlogArr.push(operationlogForm)
            sessionStorage.setItem('operationlogArr',JSON.stringify(operationlogArr))
        },
    }
}
</script>

<style lang="less" scoped>
.comment{
    box-sizing: border-box;
    padding: 0 20px;
}
.title-comment{
    span:first-child{font-size: 18px;}
    span:nth-child(2){
        font-size: 12px;
        margin-left: 20px;
        color: #666;
    }
    div{
        border: 1px solid #2468F2;
        margin: 10px 0 20px 0;
    }
}
.yours-comment{
    .part-one{
        display: flex;
        box-sizing: border-box;
        position: relative;
        img{
            width: 60px;
            height: 60px;
            margin-right: 15px;
        }
        .triangle{
            position: absolute;
            top: 12px;
            left:65px;
            width: 0;
            height: 0;
            border-width:6px 10px 6px 0;
            border-style: solid;
            border-color: transparent #CDCDCD transparent transparent;
            &::after{
                content: "";
                position: absolute;
                top: -5px;
                left:3px;
                width: 0;
                height: 0;
                border-width:5px 8px 5px 0;
                border-style: solid;
                border-color: transparent #fff transparent transparent;
            }
        } 
        textarea{
            resize: none;
            width: 100%;
            border-color: #CDCDCD;
            border-radius: 2px;
            outline: #CDCDCD;
            padding: 3px 0 0 5px;
        }
    }
    .part-two{
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
        span{color: #666;font-size: 14px;}
        button{
            margin-left: 10px;
            height: 20px;
            width: 44px;
            color: #fff;
            background-color: #2468F2;
            border: none;
            outline: none;
            cursor: pointer;
            border-radius: 2px;
            font-size: 12px;
            &:hover{opacity: 0.8;}
        }
    }
}
.others-comment{
    .title{
        span{font-size: 14px;}
        div{border: 1px solid #CFCFCF;margin-top: 5px;}
    }
    .others-comment-item{
        padding: 15px 0;
        display: flex;
        border-bottom: 1px dotted #ccc;
        img{
            width: 60px;
            height: 60px;
            margin-right: 15px;
        }
        .right{
            flex: 1;
            display: flex;
            flex-direction: column;
            .content{
                font-size: 14px;
                span:first-child{color: #2468F2;}
            }
            .reply-comment{
                min-height: 40px;
                box-sizing: border-box;
                background-color: #F8F8F8;
                border: 1px solid #D9D9D9;
                margin-top: 10px;
                display: flex;
                align-items: center;
                padding-left:20px;
                span{font-size: 12px;}
                span:first-child{color: #2468F2;}
            }
            .time{
                margin-top: 20px;
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                >span{color: #999;}
                .operate{
                    span:first-child{
                        cursor: pointer;
                        &:hover{color: #2468F2;}
                        i{margin-right: 2px;}
                    }
                    span:nth-child(2){
                        margin: 0 10px;
                        color: #CFDBED;
                    }
                    span:last-child{
                        cursor: pointer;
                        &:hover{color: #2468F2;text-decoration: underline;}
                    }
                }
            }
            .replyBox{
                position: relative;
                box-sizing: border-box;
                padding: 20px;
                height: 100px;
                background-color: #F8F8F8;
                border: 1px solid #D9D9D9;
                margin-top: 20px;
                .triangle{
                    position: absolute;
                    top: -10px;
                    right:5px;
                    width: 0;
                    height: 0;
                    border-width:0 10px 10px 10px;
                    border-style: solid;
                    border-color: transparent transparent #CDCDCD transparent;
                    &::after{
                        content: "";
                        position: absolute;
                        top: 1px;
                        right: -9px;
                        width: 0;
                        height: 0;
                        border-width: 0 9px 9px 9px;
                        border-style: solid;
                        border-color: transparent transparent #F8F8F8 transparent;
                    }
                }
                textarea{
                    width: 100%;
                    resize: none;
                    border-radius: 2px;
                    border: 1px solid #CDCDCD;
                    outline: #CDCDCD;
                    padding: 3px 0 0 5px;
                }
                div:last-child{
                    margin-top: 10px;
                    display: flex;
                    justify-content: flex-end;
                    span{color: #666;font-size: 14px;}
                    button{
                        margin-left: 10px;
                        height: 20px;
                        width: 44px;
                        color: #fff;
                        background-color: #2468F2;
                        border: none;
                        outline: none;
                        cursor: pointer;
                        border-radius: 2px;
                        font-size: 12px;
                        &:hover{opacity: 0.8;}
                    }
                }
            }
        }
    }
}
.empty{
    text-align: center;
    margin: 50px 0;
    color: red;
}
.changeColor{
    color: #2468F2!important;
}
@media screen and (max-width: 440px) {
    .part-one img{
        width: 30px!important;
        height: 30px!important;
    }
    .part-one .triangle{
        display: none!important;
    }
    .others-comment-item img{
        width: 30px!important;
        height: 30px!important;
    }
    .reply-comment{
         min-height: 20px!important;
    }
}
</style>
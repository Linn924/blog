<template>
    <div id="home">

        <el-backtop>
            <i class="el-icon-caret-top"></i>
        </el-backtop>
        
        <Header 
            :getBlogsAgain="getBlogsAgain" 
            :isSearch="isSearch">
        </Header>

        <main>
            <section>
                <aside class="aside-left">
                    <div class="me">
                        <header>
                            <img src="../assets/image/avatar.jpg">
                            <div><span>爱开发</span><span>爱学习</span></div>
                        </header>
                        <main>
                            <span>LinnCooper</span>
                            <span>Learner &amp; Developer</span>
                            <span class="el-icon-location-outline">江苏 · 徐州</span>
                        </main>
                        <footer>
                            <header>
                                <div><span>{{total}}</span><span>文章</span></div>
                                <div><span>{{sortCount}}</span><span>分类</span>
                                </div>
                            </header>
                            <footer>
                                <a href="https://github.com/Linn924" target="_blank">
                                    <el-tooltip content="GitHub" placement="right">
                                        <img src="https://api.iowen.cn/favicon/github.com.png" alt="">
                                    </el-tooltip>
                                </a>
                                <a href="http://www.linncode.cn/" target="_blank">
                                    <el-tooltip content="个人主页" placement="left">
                                        <img src="https://api.iowen.cn/favicon/www.linncode.cn.png" alt="">
                                    </el-tooltip>
                                </a>
                            </footer>
                        </footer>
                    </div>
                </aside>

                <router-view 
                    ref="article" 
                    :value="value" 
                    :isPaging="isPaging" 
                    :hidePage="hidePage" 
                    :showPage="showPage">
                </router-view>

                <aside class="aside-right">
                    <div class="search">
                        <span><i class="el-icon-search"></i>搜索</span>
                        <div class="line"></div>
                        <el-input 
                            size="small" placeholder="按标题搜索" clearable
                            v-model="value" @keyup.enter.native="enter" 
                            suffix-icon="el-icon-search">
                        </el-input>
                    </div>
                    <div class="sort">
                        <span><i class="el-icon-folder-opened"></i>分类</span>
                        <div class="line"></div>
                        <section>
                            <button 
                                v-for="item in sortList" 
                                :key="item.id" 
                                @click="clickSort(item)">
                                {{item.sort_name}}
                            </button>
                        </section>
                    </div>
                    <article>
                        <span><i class="el-icon-document"></i>最近文章</span>
                        <div class="line"></div>
                        <nav>
                            <li v-for="item in blogList" :key="item.id">
                                <label 
                                    @click="readBlogs(item)">
                                    {{item.title}}
                                </label>
                            </li>
                        </nav>
                    </article>                      
                </aside>  
            </section>
        </main>
        
        <Footer></Footer>        
    </div>
</template>

<script>
import Header from './static/Header.vue'
import Footer from './static/Footer.vue'
export default {
    inject:['reload'],
    name:'Home',
    components:{
        Header,
        Footer
    },
    data(){
        return {
            blogList:[],//博客数据
            total:0,//博客总数
            sortCount:0,//分类总数
            sortList:[],//分类数据
            value:'',//搜索框数据
            isSearch:false,//是否点击了搜索
            imageList:[//预加载图片数据
                'https://s3.ax1x.com/2020/12/09/r9jlDg.png'
            ],
            isPaging:true,//是否显示分页
        }
    },
    created() {
        this.getSorts()
        this.getRecentBlogs()
        this.preLoadImg(this.imageList)
        document.oncontextmenu =  () => {event.returnValue = false}
    },
    methods: {
        // 预加载图片
        preLoadImg(arr){
            let imgList = []
            arr.forEach((item,index) => {
                imgList[index] = new Image()
                imgList[index].src = arr[index]
            })
        },
        //获取博客最近文章
        async getRecentBlogs(){
            const {data:res} = await this.axios.get('recentBlogs')
            if(res.code != 200) 
            return this.$message({message: `${res.tips}`,type: 'error',duration:1200})
            this.total = res.total
            this.blogList = res.data
        },
        //搜索框按回车搜索文章
        enter(){
            this.$refs.article.getBlogs()
            this.value = ''
            this.isSearch = true
        },
        //获取分类数据
        async getSorts(){
            const {data:res} = await this.axios.get("sortsAndlabels")
            if(res.code != 200) 
            return this.$message({message: `${res.tips}`,type: 'error',duration:1200})
            this.sortList = res.data.data
            this.sortCount = this.sortList.length
        },
        //监听要查看的博客地址
        readBlogs(item){
            this.$router.push({path:`/article?${item.mdname}`})
            if(sessionStorage.token){
                this.saveOperateLog(item.title)
                this.addPageviews(item)
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
        //增加浏览量
        async addPageviews(data){
            let blogForm = {
                blog_id:data.id,
                pageviews:data.pageviews + 1
            }
            const {data:res} = await this.axios.put('blogsPageview',blogForm)
            if(res.code != 200) 
            return this.$message({message: `${res.tips}`,type: 'error',duration:1200})
        },
        //跳转路由
        clickSort(data){
            this.$router.push(`/articlelist?sort=${data.sort_name}&id=${data.id}`)
            this.isPaging = false
        }, 
        //再次获取博客列表
        getBlogsAgain(){
            this.$refs.article.getBlogs()
            this.isSearch = false
        },
        //隐藏分页组件
        hidePage(){
            this.isPaging = false
        },
        //显示分页组件
        showPage(){
            this.isPaging = true
        }
    }
}
</script>

<style lang="less" scoped>
#home{
    width: 100vw;
    min-width: 375px;
    min-height: 100vh;
    position: relative;
    >main{
        padding: 2vh 0 5vh 0;
        >section{
            width: 80vw;
            box-sizing: border-box;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 2fr 6fr 2fr;
            grid-template-rows: auto auto;
            gap: 20px;
        }
    }
    .el-backtop{
        bottom: 20px!important;
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 5px;
        color:#2468F2;
    }
}
#home>main{
    aside:first-child{
        width: 100%;
        .me{
            min-height: 330px;
            padding: 20px 0 0 0;
            background-color: rgba(255, 255, 255, 0.4);
            border-radius: 3px;
            box-shadow: 0 2px 10px 0 rgba(0,0,0,0.12);
            >header{
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100px;
                img{
                    width: 100px;
                    height: 100px;
                    margin-right: 40px;
                    border-radius: 5px;
                }
                div{
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    color: #000;
                    font-size: 14px;
                    span:nth-child(2){margin: 10px 0;}
                }
            }
            main{
                display: flex;
                flex-direction: column;
                align-items: center;
                margin: 20px 0;
                span{margin-bottom: 8px;color: #000;}
            }
            >footer{
                header{
                    display: flex;
                    border-top: 1px solid #ECEFF2;
                    border-bottom: 1px solid #ECEFF2;
                    div{
                        width: 50%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 8px 0;
                        &:first-child{border-right: 1px solid #ECEFF2;}
                    }
                }
                footer{
                    display: flex;
                    justify-content: space-around;
                    margin-top: 10px;
                    img{width: 30px;height: 30px;border-radius: 50%;}
                }
            }
        }
    }
    aside:last-child{
        width: 100%;
        .search{
            min-height: 100px;
            background-color: rgba(255, 255, 255, 0.4);
            border-radius: 3px;
            box-shadow: 0 2px 10px 0 rgba(0,0,0,0.12);
            box-sizing: border-box;
            padding: 10px 10px;
            span>i{margin-right: 5px;}
            .line{border: 1px solid #2468F2;margin: 10px 0;}
        }
        .sort{
            min-height: 120px;
            margin-top: 10px;
            background-color: rgba(255, 255, 255, 0.4);
            border-radius: 3px;
            box-shadow: 0 2px 10px 0 rgba(0,0,0,0.12);
            box-sizing: border-box;
            padding: 10px 10px;
            span>i{margin-right: 5px;}
            .line{border: 1px solid #2468F2;margin: 10px 0;}
            section{
                display: grid;
                place-content: center center;
                grid-template-columns: repeat(3,1fr);
                gap: 10px;
                button{
                    height: 25px;
                    border-radius: 4px;
                    border: none;
                    background-color: rgba(231,76,60);
                    color: #fff;
                    font-size: 12px;
                    cursor: pointer;
                    outline: none;
                    &:nth-child(2n+1){background-color: rgba(112,161,225);}
                    &:nth-child(3n){background-color: rgba(46,204,113);}
                    &:hover{&:hover{opacity: 0.8;}}
                }
            }
        }
        article{
            background-color: rgba(255, 255, 255, 0.5);
            border-radius: 3px;
            box-shadow: 0 2px 10px 0 rgba(0,0,0,0.12);
            box-sizing: border-box;
            padding: 10px 10px;
            margin: 10px 0;
            span>i{margin-right: 5px;}
            .line{border: 1px solid #2468F2;margin-top: 10px;}
            li{
                list-style: none;
                line-height: 30px;
                border-bottom: 1px solid #ccc;
                font-size: 14px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                &:last-child{border: 0;}
                label{
                    cursor: pointer;
                    &:hover{color:#2468F2;}
                }
            }
        }
    }  
}
@media screen and (max-width: 1260px) {
  #home>main>section{
    grid-template-columns: 80vw!important;
    grid-template-rows: auto auto!important;
    grid-template-areas: 'a' 'b'!important;
  }
  #home>main>section aside:first-child{
    display: none!important;
  } 
  #home>main>section aside:last-child {
    grid-area: b!important;
  }
}
@media screen and (min-width: 1261px) and (max-width: 1680px) {
  #home>main>section{
    grid-template-columns: 300px 1fr!important;
    grid-template-rows: 350px auto!important;
    grid-template-areas: 'a b' 'c b'!important;
    row-gap: 10px!important;
  }
  #home>main>section aside:last-child {
    grid-area: c!important;
  }
  #home>main>section #content,#home>main>section #article {
    grid-area: b!important;
  }
}
@media screen and (min-width: 1681px) {
  #home>main aside:first-child .me{
    position: sticky;
    top: 80px;
  }
  #home>main aside:last-child .search{
    position: sticky;
    top: 80px;
  }
  #home>main aside:last-child .sort{
    position: sticky;
    top: 190px;
  }
  #home>main aside:last-child article{
    position: sticky;
    top: 324px;
  }
}
</style>
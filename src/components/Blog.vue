<template>
    <div id="blog">

        <!-- 回到顶部 写在顶部-->
        <el-backtop><i class="el-icon-caret-top"></i></el-backtop>

        <!-- 头部导航 -->
        <header>
            <section>
                <a href="javascript:void(0);">
                    <img src="https://s1.ax1x.com/2020/09/04/wkxl9K.jpg" alt="">
                    <span>Simon</span>
                </a>
                <nav>
                    <li><router-link to="/content" @click.native="reload"><i class="el-icon-s-home" ></i>主页</router-link></li>
                    <li><router-link to="/me"><i class="el-icon-user-solid"></i>关于我</router-link></li>
                </nav>
                <el-input size="small" placeholder="搜索" suffix-icon="el-icon-search" v-model="value" @keyup.enter.native="enter" clearable></el-input>
            </section>
        </header>

        <!-- 内容区域 -->
        <main>
            <section>

                    <!-- 左侧边栏 -->
                    <aside class="aside-left">

                        <!-- 个人简介 -->
                        <div class="me">
                            <header>
                                <img src="https://s1.ax1x.com/2020/09/04/wkxl9K.jpg" alt="">
                                <div>
                                    <span>爱开发</span>
                                    <span>爱学习</span>
                                </div>
                            </header>
                            <main>
                                <span>Simon</span>
                                <span>Learner &amp; Developer</span>
                                <span class="el-icon-location-outline">江苏 · 南京</span>
                            </main>
                            <footer>
                                <header>
                                    <div>
                                        <span>{{total}}</span>
                                        <span>文章</span>                                  
                                    </div>
                                    <div>
                                        <span>{{sortCount}}</span>
                                        <span>分类</span>
                                    </div>
                                </header>
                                <footer>
                                    <a href="https://github.com/Linn924">
                                        <el-tooltip content="GitHub" placement="right">
                                            <img src="https://infinityicon.infinitynewtab.com/user-share-icon/a23b4cf17327527ae66aad5d13f059da.png" alt="">
                                        </el-tooltip>
                                    </a>
                                    <a href="https://mp.csdn.net/console/article">
                                        <el-tooltip content="CSDN" placement="left">
                                            <img src="https://s1.ax1x.com/2020/05/01/JXhclt.png" alt="">
                                        </el-tooltip>
                                    </a>
                                </footer>
                            </footer>
                        </div>

                    </aside>

                    <!-- 博客文章 -->
                    <router-view ref="article"></router-view>

                    <!--右侧边栏 -->
                    <aside class="aside-right">
                        
                         <!-- 分类区域 -->
                        <div class="sort">
                            <span><i class="el-icon-menu"></i>分类</span>
                            <div class="line"></div>
                            <section>
                                <button v-for="item in sortList" :key="item.id" @click="click_sort(item.id)">{{item.sort_name}}</button>
                            </section>
                        </div>

                        <!-- 最近文章区域 -->
                        <article>
                            <span><i class="el-icon-document"></i>最近文章</span>
                            <div class="line"></div>
                            <nav>
                                <li v-for="item in blogList" :key="item.id">
                                    <label @click="changePath(item)">
                                        {{item.title}}
                                    </label>
                                </li>
                            </nav>
                        </article>
                        
                        <!-- 友情链接 -->
                        <div class="link">
                            <span><i class="el-icon-link"></i>友情链接</span>
                            <div class="line"></div>
                            <nav>
                                <a href="http://www.linncode.cn" target="__blank">西蒙首页</a>
                                <a href="http://www.linncode.cn:9547">简约导航</a>
                            </nav>
                        </div>
                    </aside>  

            </section>
        </main>
        
        <!-- 底部区域 -->
        <footer>         
            <section>
                <p>© 2020 - 2021 LinnCode 版权所有</p>
                <p>苏ICP备20023864号</p>
            </section>
        </footer>
        
    </div>
</template>

<script>
export default {
    data(){
        return {
            blogList:[],
            total:0,
            sortCount:0,//分类总数
            sortList:[],//分类数据
            value:'',//搜索框数据
        }
    },
    created() {
        this.getSTData()//调用获取分类与标签数据方法
        this.getBlogAllData()//调用获取所有博客数据方法
         //禁止鼠标右键点击
        document.oncontextmenu =  () => {
            event.returnValue = false
        }
    },
    watch: {
        $route(to,from){//监听路由变化
            this.disableBtn(to.path)   
        }
    },
    methods: {
        //获取博客最近文章
        async getBlogAllData(){
            const {data:res} = await this.$http.get('blogAllData')
            if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.total = res.total
            this.blogList = res.data
        },
        //搜索框按回车搜索文章
        enter(){
            this.$store.commit("setValue",this.value)
            this.$refs.article.getBlogData()
            this.value = ''
        },
        //获取分类与标签数据
        async getSTData(){
            const {data:res} = await this.$http.get("blogdatadetail")
            if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.sortList = res.data.data
            this.sortCount = this.sortList.length
        },
        //监听要查看的博客地址
        changePath(item){
            this.$store.commit('setMdname',item.mdname)
            this.$router.push({path:`/article?${item.mdname}`})
        },
        //调用子组件中方法获取所有有关此分类的数据
        click_sort(id){
            this.$refs.article.getAboutSortData(id)
        }, 
        //重载 调用子组件中方法重新获取博客数据
        reload(){
            this.$refs.article.getBlogData()
        },
        //路由发生改变后 禁用button按钮 
        disableBtn(path){
            var btns = document.querySelectorAll('.sort button')
            if(path != '/content'){
                btns.forEach(item => {
                    item.setAttribute('disabled','true')
                    item.style.cursor = 'not-allowed'
                })
            }else{
                btns.forEach(item => {
                    item.removeAttribute('disabled')
                    item.style.cursor = 'pointer'
                })
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import '../assets/css/blog.css';
#blog{
    width: 100vw;
    min-height: 100vh;
    background-color: #F5F8F9;
    position: relative;
    >header{
        min-height: 60px;
        background-color: rgba(255, 255, 255, 0.4);
        box-shadow: 0 2px 10px 0 rgba(0,0,0,0.12);
    }
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
    >footer{
        box-sizing: border-box;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
    }
    .el-backtop{
        bottom: 20px!important;
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 5px;
        color:#1e90ff;
    }
}
#blog>header{
    section{
        width: 80vw;
        display: grid;
        grid-template-columns:140px auto 180px;
        grid-template-rows: 1fr;
        margin: 0 auto;
        >a{
            display: flex;
            align-items: center;
            margin-right: 2vw;
            &:hover span{color: #1E90FF;}
            img{
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-right: 20px;
            }
            span{
                color: #000;
                font-size: 20px;
                transition: color .25s; 
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
                    transition: color .5s;
                    &:hover{color: #1E90FF!important;}
                    font-size: 15px;
                    >i{margin-right: 2px;}
                }
                
            }
        }
    }
}
#blog>header .el-input{
    width: 180px!important;
    place-self: center center;
}
#blog>main{
        aside:first-child{
            width: 100%;
            .me{
                min-height: 330px;
                padding: 20px 0 0 0;
                background-color: rgba(255, 255, 255, 0.4);
                border-radius: 8px;
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
            .sort{
                min-height: 160px;
                background-color: rgba(255, 255, 255, 0.4);
                border-radius: 8px;
                box-shadow: 0 2px 10px 0 rgba(0,0,0,0.12);
                box-sizing: border-box;
                padding: 10px 10px;
                transition: all .5s;
                span>i{margin-right: 5px;}
                .line{border: 1px solid #70A1FF;margin: 10px 0;}
                section{
                    display: grid;
                    grid-template-columns: repeat(3,1fr);
                    gap: 10px;
                    min-height: 90px;
                    button{
                        border-radius: 5px;
                        border: 0;
                        background-color: rgba(231,76,60);
                        color: #fff;
                        font-size: 14px;
                        cursor: pointer;
                        outline: none;
                        transition:all .2s;
                        &:nth-child(2n+1){background-color: rgba(112,161,225);}
                        &:nth-child(3n){background-color: rgba(46,204,113);}
                        &:hover{transform: scale(0.9);}
                    }
                }
            }
            article{
                background-color: rgba(255, 255, 255, 0.5);
                border-radius: 8px;
                box-shadow: 0 2px 10px 0 rgba(0,0,0,0.12);
                box-sizing: border-box;
                padding: 10px 10px;
                margin: 10px 0;
                transition: all .5s;
                span>i{margin-right: 5px;}
                .line{border: 1px solid #70A1FF;margin-top: 10px;}
                li{
                    list-style: none;
                    line-height: 30px;
                    border-bottom: 1px solid #ccc;
                    font-size: 14px;
                    &:last-child{border: 0;}
                    label{
                        transition: color .25s;
                        cursor: pointer;
                        &:hover{color: #1e90ff;}
                    }
                }
            }
            .link{
                background-color: rgba(255, 255, 255, 0.5);
                border-radius: 8px;
                box-shadow: 0 2px 10px 0 rgba(0,0,0,0.12);
                box-sizing: border-box;
                padding: 10px 10px;
                margin: 10px 0;
                transition: all .25s;
                span>i{margin-right: 5px;}
                .line{border: 1px solid #70A1FF;margin: 10px 0;}
                nav{
                    a{
                        color: #000;
                        transition: all .25s;
                        &:hover{color: #1e90ff;}
                        &:last-child{margin: 0 0 0 10px;}
                    }
                }
            }
        }  
}
#blog>footer{
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
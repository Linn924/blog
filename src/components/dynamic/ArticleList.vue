<template>
    <div id="articlelist">
        <article 
            v-for="item in blogList" 
            :key="item.id">
            <span 
                @click="readBlogs(item)">
                {{item.title}}
            </span>
            <div>
                <i class="el-icon-date">
                    <span>{{item.date | date}}</span>
                </i>
                <i class="el-icon-folder-opened">
                    <span 
                        @click="clickSort(item)">
                        {{item.sort_name}}
                    </span>
                </i>
                <i class="el-icon-collection-tag">
                    <span 
                        @click="clickLabel(item)">
                        {{item.technology_name}}
                    </span>
                </i>
            </div>
            <p>{{item.introduce}}</p>
        </article>
        <footer v-show="isPaging">
            <el-pagination  
                @current-change="handleCurrentChange"
                :current-page="queryList.pagenum" 
                :page-sizes="[3, 5, 8]" 
                :page-size="queryList.pagesize" 
                :total="total"
                layout="prev, pager, next">
            </el-pagination>
        </footer>
        
    </div>
</template>

<script>
export default {
    name:'ArticleList',
    props:{
        value:{
            type:String,
            required:true
        },
        isPaging:{
            type:Boolean,
            required:true
        },
        hidePage:{
            type:Function,
            reuqired:true
        },
        showPage:{
            type:Function,
            reuqired:true
        }
    },
    data(){
        return {
            blogList:[],//博客数据   
            queryList:{//默认分页数据
                key:'',
                pagenum:1,
                pagesize:5
            }, 
            total:0,//博客数据总数
        }
    },
    created() {
        if(location.href.includes('/articlelist?sort')){
            let id = location.href.split("=")[2]
            this.getBlogsBySort(id)
        }else if(location.href.includes('/articlelist?label')){
            let id = location.href.split("=")[2]
            this.getBlogsByLabel(id)
        }else{
            this.getBlogs()
        }
    },
    watch:{
        $route(to){
            if(to.fullPath.includes('/articlelist?sort')){
                let id = to.fullPath.split("=")[2]
                this.getBlogsBySort(id)
            }else if(to.fullPath.includes('/articlelist?label')){
                let id = to.fullPath.split("=")[2]
                this.getBlogsByLabel(id)
            }
            if(to.fullPath === '/articlelist'){
                this.getBlogs()
            }
        }
    },
    methods: {
        //获取博客数据
        async getBlogs(){
            this.queryList.key = this.value
            !this.value && this.showPage()
            this.value && this.hidePage()
            const {data:res} = await this.axios.get("blogs",{params:this.queryList})
            if(res.code != 200) 
            return this.$message({message: `${res.tips}`,type: 'error',duration:1200})
            this.blogList = res.data
            this.total = res.total
            this.queryList.key = ''
        },
        //监听去往第几页
        handleCurrentChange(newNum) {
            this.queryList.pagenum = newNum
            this.getBlogs()
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
        //根据点击的分类id获取所有有关此分类的数据
        async getBlogsBySort(id){
            const {data:res} = await this.axios.get('blogsBySort',{params:{id}})
            if(res.code != 200) 
            return this.$message({message: `${res.tips}`,type: 'error',duration:1200})
            this.blogList = res.data
        },
        //根据点击的标签id获取所有有关此标签的数据
        async getBlogsByLabel(id){
            const {data:res} = await this.axios.get('blogsByLabel',{params:{id}})
            if(res.code != 200) 
            return this.$message({message: `${res.tips}`,type: 'error',duration:1200})
            this.blogList = res.data
        },
        //根据分类查询博客
        clickSort(data){
            this.hidePage()
            this.$router.push(`/articlelist?sort=${data.sort_name}&id=${data.sortId}`)
        },
        //根据标签查询博客
        clickLabel(data){
            this.hidePage()
            this.$router.push(`/articlelist?label=${data.technology_name}&id=${data.technologyId}`)
        }
    }
}
</script>

<style lang="less" scoped>
#articlelist{
    width: 100%;
    article{
        background-color: rgba(255, 255, 255, 0.4);
        border-radius: 3px;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,0.12);
        margin-bottom: 10px;
        padding: 15px 20px;
        box-sizing: border-box;
        color: #282A2D;
        >span{
            display: block;
            color: #000;
            font-size: 28px;
            font-weight: 400;
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            &:hover{color: #2468F2;}
        }
        div{
            margin: 20px 0;
            i{
                margin-right: 20px;
                &:first-child span{margin-left: 3px;}
                &:nth-child(2) span,&:nth-child(3) span{
                    cursor: pointer;
                    margin-left: -2px;
                    &:hover{color: #2468F2;}
                }
            }
        }
        p{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    footer{
        display: flex;
        justify-content: center;
    }
}
@media screen and (min-width:376px) and (max-width:600px){
  #articlelist article>span{
    font-size: 24px;
  }
}
@media screen and (max-width:375px){
  #articlelist article>span{
    font-size: 20px;
    font-weight: bold;
  }
}
</style>
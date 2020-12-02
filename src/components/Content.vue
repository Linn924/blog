<template>
    <div id="content">
        <!-- 博客区域 -->
        <article v-for="item in blogList" :key="item.id">
            <span @click="changePath(item)">{{item.title}}</span>
            <div>
                <i class="el-icon-date"><span>{{item.date | date}}</span></i>
                <i class="el-icon-folder-opened"><span>{{item.sort_name}}</span></i>
                <i class="el-icon-collection-tag"><span>{{item.technology_name}}</span></i>
            </div>
            <p>{{item.introduce}}</p>
        </article>

        <!-- 分页区域 -->
        <footer>
            <el-pagination background @current-change="handleCurrentChange"
                :current-page="queryList.pagenum" :page-sizes="[3, 5, 8]" 
                :page-size="queryList.pagesize" :total="total"
                layout="prev, pager, next">
            </el-pagination>
        </footer>
        
    </div>
</template>

<script>
export default {
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
        if(window.location.href.includes('/content?')){
            let id = window.location.href.split("=")[2]
            this.getAboutSortData(id)
        }else{
            this.getBlogData()
        }
    },
    watch:{
        $route(to,from){
            if(to.fullPath.includes('/content?')){
                let id = to.fullPath.split("=")[2]
                this.getAboutSortData(id)
            }
            if(to.fullPath === '/content'){
                this.getBlogData()
            }
            
        }
    },
    methods: {
        //获取博客数据
        async getBlogData(){
            this.queryList.key = this.$store.state.value 
            const {data:res} = await this.$http.get("blogdata",{params:this.queryList})
            if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.blogList = res.data
            this.total = res.total
            this.$message({message: `${res.data.length}条数据`,type: 'success',duration:1000,offset:10})
            this.queryList.key = ''
            this.$store.commit("setValueAgain")
        },
        //监听去往第几页
        handleCurrentChange(newNum) {
            this.queryList.pagenum = newNum
            this.getBlogData()
        },
        //监听要查看的博客地址
        changePath(item){
            this.$store.commit('setMdname',item.mdname)
            this.$router.push({path:`/article?${item.mdname}`})
        },
        //根据点击的分类标签id获取所有有关此分类的数据
        async getAboutSortData(id){
            const {data:res} = await this.$http.get('/getAboutSortData',{params:{id}})
            if(res.code != 200) return this.$message({message: `${res.tips}`,type: 'error',duration:1000})
            this.blogList = res.data
            if(res.data.length == 0) return this.$message({message: '暂无数据',type: 'error',duration:1000,offset:10})
            this.$message({message: `${res.data.length}条数据`,type: 'success',duration:1000,offset:10})
        }
    }
}
</script>

<style lang="less" scoped>
#content{
    width: 100%;
    article{
        background-color: rgba(255, 255, 255, 0.4);
        border-radius: 8px;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,0.12);
        margin-bottom: 10px;
        padding: 20px 20px;
        box-sizing: border-box;
        color: #000;
        >span{
            font-size: 28px;
            font-weight: 400;
            cursor: pointer;
            transition: color .3s;
            &:hover{color: #1e90ff;}
        }
        div{
            margin: 20px 0;
            i{
                margin-right: 10px;
                span{margin-left: 5px;}
            }
        }
    }
    footer{
        display: flex;
        justify-content: center;
    }
}
@media screen and (min-width:376px) and (max-width:600px){
  #content article>span{
    font-size: 24px;
  }
}
@media screen and (max-width:375px){
  #content article>span{
    font-size: 20px;
    font-weight: bold;
  }
}
</style>
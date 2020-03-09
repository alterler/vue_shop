<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <!-- 查询商品 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    class="input-with-select"
                    clearable
                    @clear='getGoodsList'>
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品 -->
        <el-col :span="6">
          <el-button type="primary"
                     @click="gotoAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品展示列表 -->
      <el-table :data="goodsList">
        <el-table-column label="#"
                         type="index"></el-table-column>
        <el-table-column label="产品名称"
                         prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）"
                         prop="goods_price"
                         width="95px"></el-table-column>
        <el-table-column label="商品重量"
                         prop="goods_weight"
                         width="70px"></el-table-column>
        <el-table-column label="添加时间"
                         prop="add_time"
                         width="160px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}</template></el-table-column>
        <el-table-column label="操作"
                         width="130px">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="editGoods(scope.row)"></el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="removeGoods(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination background
                     layout="total,sizes,prev, pager, next , jumper"
                     :total="total"
                     :page-sizes="[5, 10, 15, 20]"
                     :current-page="queryInfo.pagenum"
                     :page-size="queryInfo.pagesize"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      goodsList: []
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newCur) {
      this.queryInfo.pagenum = newCur
      this.getGoodsList()
    },
    editGoods(item) {},
    async removeGoods(item) {
      const { data: res } = await this.$http.delete(`goods/${item.goods_id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('删除商品成功！')
      this.getGoodsList()
    },
    gotoAddPage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
</style>

<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 查询输入框 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query">
            <el-button type="primary"
                       slot="append"
                       icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单表 -->
      <el-table :data="ordersList"
                style="width: 100%">
        <el-table-column type="index"
                         label="#">
        </el-table-column>
        <el-table-column label="订单编号"
                         prop="order_number"></el-table-column>
        <el-table-column label="订单价格"
                         prop="order_price"></el-table-column>
        <el-table-column label="是否付款"
                         prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success"
                    v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger"
                    v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货"
                         prop="is_send">
          <template slot-scope="scope">
            <template>
              {{scope.row.is_send}}
            </template>
          </template>
        </el-table-column>
        <el-table-column label="下单时间"
                         prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="primary"
                       icon="el-icon-edit"
                       @click="showBox(scope.row)"></el-button>
            <el-button size="mini"
                       type="success"
                       icon="el-icon-location"
                       @click="showProgressBox(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page=" queryInfo.pagenum"
                     :page-sizes="[5, 10,15]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next,jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <!-- 修改对话框 -->
    <el-dialog title="修改信息"
               :visible.sync="editCityDialogVisible"
               width="50%"
               @close="closeCityDialog">
      <el-form :model="editCityForm"
               :rules="editCityRules"
               ref="editCityFormRef"
               label-width="100px">
        <el-form-item label="选择籍贯"
                      prop="city">
          <el-cascader v-model="editCityForm.city"
                       :options="citydata"
                       :props="{ expandTrigger: 'hover' }"
                       @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址"
                      prop="address">
          <el-input v-model="editCityForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editCityDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editCityDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog title="物流进度"
               :visible.sync="ProgressBoxDialogVisible"
               width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo"
                          :key="index"
                          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>

    </el-dialog>
  </div>
</template>

<script>
import citydata from './citydata.js'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      ordersList: [],
      editCityDialogVisible: false,
      editCityForm: {
        address: '',
        city: ''
      },
      editCityRules: {
        city: [{ required: true, message: '请选择省市区县', trigger: 'blur' }],
        address: [
          { required: true, message: '详细地址必填！', trigger: 'blur' }
        ]
      },
      citydata,
      ProgressBoxDialogVisible: false,
      progressInfo: []
    }
  },
  methods: {
    async getOrdersData() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.ordersList = res.data.goods
      this.total = res.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersData()
    },
    handleCurrentChange(newCur) {
      this.queryInfo.pagenum = newCur
      this.getOrdersData()
    },
    showBox(item) {
      this.editCityDialogVisible = true
    },
    closeCityDialog() {
      this.$refs.editCityFormRef.resetFields()
    },
    async showProgressBox(item) {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.progressInfo = res.data
      this.ProgressBoxDialogVisible = true
    },
    handleChange() {}
  },
  created() {
    this.getOrdersData()
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>

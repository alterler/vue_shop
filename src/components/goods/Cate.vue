<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-button type="primary"
                   @click="showCateDialog">添加分类</el-button>
      </el-row>
      <!-- 表格 -->
      <tree-table :data="cateList"
                  border
                  :show-row-hover="false"
                  show-index
                  index-text="#"
                  :columns="columns"
                  :selection-type="false"
                  :expand-type="false"
                  class="treeTable">
        <template slot="isok"
                  slot-scope="scope">
          <i class="el-icon-success"
             v-if="scope.row.cat_deleted === false"
             style="color: lightgreen;"></i>
          <i class="el-icon-error"
             v-else
             style="color: red;"></i>

        </template>
        <template slot="order"
                  slot-scope="scope">
          <el-tag size="mini"
                  v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success"
                  size="mini"
                  v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning"
                  size="mini"
                  v-else>三级</el-tag>
        </template>
        <template slot="opt"
                  slot-scope="scope">
          <el-button type="primary"
                     icon="el-icon-edit"
                     size="mini"
                     @click="editCate(scope.row)">编辑</el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="mini"
                     @click="removeCate(scope.row)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page=" queryList.pagenum"
                     :page-sizes="[3, 5, 10]"
                     :page-size="queryList.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog :visible.sync="cateDialogVisible"
               width="50%"
               @close='closeAddCateDialog'>
      <el-form :rules="newCateRule"
               ref="newCateRef"
               label-width="100px"
               :model="newCate">
        <el-form-item label="分类名称"
                      prop="cat_name">
          <el-input v-model="newCate.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="selectedKey"
                       :options="parentCateInfo"
                       :props="cascaderProps"
                       clearable
                       @change="parentCateKeyChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="cateDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="AddCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryList: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      cateDialogVisible: false,
      newCate: {
        cat_pid: 0,
        cat_name: 'we',
        cat_level: 0
      },
      newCateRule: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateInfo: [],
      selectedKey: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      }
    }
  },
  methods: {
    async getCateInfo() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryList
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data.result
      this.total = res.total
    },
    editCate(item) {},
    removeCate(item) {},
    async showCateDialog() {
      this.getParentCateData()
      this.cateDialogVisible = true
    },
    async getParentCateData() {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meat.msg)
      this.parentCateInfo = res.data
    },
    parentCateKeyChange() {
      console.log(this.selectedKey)
      if (this.selectedKey.length > 0) {
        this.newCate.cat_pid = this.selectedKey[this.selectedKey.length - 1]
        this.newCate.cat_level = this.selectedKey.length
      } else {
        this.newCate.cat_pid = 0
        this.newCate.cat_level = 0
      }
    },
    closeAddCateDialog() {
      this.$refs.newCateRef.resetFields()
      this.selectedKey = []
      this.newCate.cat_pid = 0
      this.newCate.cat_level = 0
    },
    AddCate() {
      this.$refs.newCateRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.post('categories', this.newCate)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加分类成功')
        this.cateDialogVisible = false
      })
    },
    handleSizeChange(newSize) {
      this.queryList.pagesize = newSize
      this.getCateInfo()
    },
    handleCurrentChange(newPage) {
      this.queryList.pagenum = newPage
      this.getCateInfo()
    }
  },
  created() {
    this.getCateInfo()
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
  height: 100px;
}
</style>

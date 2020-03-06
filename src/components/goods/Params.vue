<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert title="警告：只能选择第三级分类！"
                type="warning"
                show-icon=""
                :closable="false">
      </el-alert>
      <!-- 选择分类 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader v-model="selectedKey"
                       :options="cateList"
                       :props=" cateProp"
                       @change="handleCateChange"></el-cascader>
        </el-col>
      </el-row>
      <!-- tab栏 -->
      <el-tabs v-model="activeName"
               @tab-click="handleTabClick">
        <!-- 实现动态表格 -->
        <el-tab-pane label="动态参数"
                     name="many">
          <el-button type="primary"
                     :disabled="isBtnDisable"
                     @click="addParamsdialogVisible = true">添加参数</el-button>

          <el-table :data="manyParamsData"
                    stripe
                    border>
            <!-- 扩展列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag :key="index"
                        v-for="(item,index) in scope.row.attr_vals"
                        closable
                        @close="handleClose(scope.row,index)">
                  {{item}}
                </el-tag>
                <el-input class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInputRef"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            <el-table-column type="index">
            </el-table-column>
            <el-table-column label="属性名称"
                             prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                           icon="el-icon-edit"
                           @click="showEditParams(scope.row)">编辑</el-button>
                <el-button type="danger"
                           icon="el-icon-delete"
                           @click="removeParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>
        <!-- 实现静态表格 -->
        <el-tab-pane label="静态参数"
                     name="only">
          <el-button type="primary"
                     :disabled="isBtnDisable"
                     @click="addParamsdialogVisible = true">添加参数</el-button>

          <el-table :data="onlyParamsData"
                    stripe
                    border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag :key="index"
                        v-for="(item,index) in scope.row.attr_vals"
                        closable
                        @close="handleClose(scope.row,index)">
                  {{item}}
                </el-tag>
                <el-input class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInputRef"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            <el-table-column type="index">
            </el-table-column>
            <el-table-column label="参数名称"
                             prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                           icon="el-icon-edit"
                           @click="editParams(scope.row)">编辑</el-button>
                <el-button type="danger"
                           icon="el-icon-delete"
                           @click="removeParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog :title="titleText"
               :visible.sync="addParamsdialogVisible"
               width="50%">
      <el-form :model="addParamsForm"
               :rules="addParamsRules"
               ref="addParamsRef"
               label-width="100px">
        <el-form-item label="参数名称"
                      prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addParamsdialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog :title="'修改'+titleText"
               :visible.sync="editParamsdialogVisible"
               width="50%">
      <el-form :model="editParamsForm"
               :rules="editParamsRules"
               ref="editParamsRef"
               label-width="100px">
        <el-form-item label="参数名称"
                      prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editParamsdialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedKey: [],
      cateList: [],
      cateProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      activeName: 'many',
      manyParamsData: [],
      onlyParamsData: [],
      // 添加参数
      addParamsdialogVisible: false,
      addParamsRules: {
        attr_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      addParamsForm: {
        attr_name: ''
      },
      //   修改参数
      editParamsdialogVisible: false,
      editParamsRules: {
        attr_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      editParamsForm: {
        attr_name: ''
      }
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
    },
    handleCateChange() {
      this.getParamsData()
    },
    handleTabClick() {
      this.getParamsData()
    },
    // 得到参数数据
    async getParamsData() {
      if (this.selectedKey.length !== 3) {
        this.selectedKey = []
        this.manyParamsData = []
        this.onlyParamsData = []
        return
      }
      if (!this.isBtnDisable) {
        const { data: res } = await this.$http.get(
          `categories/${this.selectedKey[2]}/attributes`,
          {
            params: { sel: this.activeName }
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals === '' ? [] : item.attr_vals.split(' ')
          item.inputVisible = false
          item.inputValue = ''
        })
        if (this.activeName === 'many') {
          this.manyParamsData = res.data
        } else {
          this.onlyParamsData = res.data
        }
      }
    },
    addParams() {
      this.$refs.addParamsRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.selectedKey[2]}/attributes`,
          {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.getParamsData()
        this.$message.success('添加参数成功！')
        this.addParamsdialogVisible = false
      })
    },
    editParams() {
      this.$refs.editParamsRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.editParamsForm.cat_id}/attributes/${this.editParamsForm.attr_id}`,
          {
            attr_sel: this.activeName,
            attr_name: this.editParamsForm.attr_name
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('修改成功！')
        this.getParamsData()
        this.editParamsdialogVisible = false
      })
    },
    async showEditParams(item) {
      const { data: res } = await this.$http.get(
        `categories/${item.cat_id}/attributes/${item.attr_id}`,
        {
          params: { attr_sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editParamsForm = res.data
      this.editParamsdialogVisible = true
    },
    async removeParams(item) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 用户取消了删除的操作
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await this.$http.delete(
        `categories/${item.cat_id}/attributes/${item.attr_id}`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('删除参数成功！')
      this.getParamsData()
    },
    async saveTagData(item) {
      const { data: res } = await this.$http.put(
        `categories/${item.cat_id}/attributes/${item.attr_id}`,
        {
          attr_sel: item.attr_sel,
          attr_name: item.attr_name,
          attr_vals: item.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('修改成功！')
      this.getParamsData()
    },
    async handleClose(item, index) {
      item.attr_vals.splice(index, 1)
      this.saveTagData(item)
    },
    handleInputConfirm(item) {
      if (item.inputValue.trim().length === 0) {
        item.inputValue = ''
        item.inputVisible = false
        return false
      }
      item.attr_vals.push(item.inputValue.trim())
      item.inputValue = ''
      item.inputVisible = false
      this.saveTagData(item)
    },
    showInput(item) {
      item.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInputRef.$refs.input.focus()
      })
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    isBtnDisable() {
      if (this.selectedKey.length !== 3) return true
      else {
        return false
      }
    },
    titleText() {
      if (this.activeName === 'many') return '动态参数'
      else {
        return '静态参数'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  margin: 15px 0;
}
.el-tag {
  margin: 0 10px;
}
.input-new-tag {
  width: 180px;
}
</style>

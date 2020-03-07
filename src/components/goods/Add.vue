<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片域 -->
    <el-card>
      <!-- 进度条 -->
      <el-steps :active="activeIndex - 0"
                align-center
                finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 商品信息表单 -->
      <el-form :model="addGoodsForm"
               :rules="addGoodsFormRules"
               ref="addGoodsFormRef"
               label-width="140px">
        <!-- tab栏 -->
        <el-tabs :tab-position="'left'"
                 v-model="activeIndex"
                 :before-leave="beforeLeave"
                 @tab-click='tabClicked'>
          <el-tab-pane label="基本信息"
                       name="0">
            <el-form-item label="商品名称"
                          prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格"
                          prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量"
                          prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量"
                          prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader v-model="addGoodsForm.goods_cat"
                           :options="cateList"
                           :props="cateListProp"
                           clearable
                           @change="CateKeyChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数"
                       name="1">
            <el-form-item :label="item.attr_name"
                          v-for="(item ,index) in manyParamsData"
                          :key="index">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb"
                             v-for="(cb, i) in item.attr_vals"
                             :key="i"
                             border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性"
                       name="2">
            <el-form-item :label="item.attr_name"
                          v-for="item in onlyParamsData"
                          :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片"
                       name="3">
            <el-upload :action="uploadURL"
                       :headers="headerObj"
                       :on-preview="handlePreview"
                       :on-remove="handleRemove"
                       :on-success="handleSuccess"
                       list-type="picture">
              <el-button size="small"
                         type="primary">点击上传</el-button>
              <div slot="tip"
                   class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容"
                       name="4">
            <quill-editor :content="addGoodsForm.goods_introduce">

            </quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary"
                       @click="add"
                       class="addBtn">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 显示图片 -->
    <el-dialog title="显示图片"
               :visible.sync="picDialogVisible"
               width="50%">
      <img :src="previewPath"
           alt=""
           class="preview">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: '0',
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: '商品名称必填！', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '商品价格必填！', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '商品重量必填！', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '商品数量必填！', trigger: 'blur' }
        ]
      },
      cateList: [],
      cateListProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      //   动态参数
      manyParamsData: [],
      onlyParamsData: [],
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      picDialogVisible: false,
      previewPath: ''
    }
  },
  methods: {
    async getCateInfo() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
    },
    CateKeyChange() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
      }
    },
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    async tabClicked() {
      // tad栏为动态参数
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.addGoodsForm.goods_cat[2]}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyParamsData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.addGoodsForm.goods_cat[2]}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.onlyParamsData = res.data
      }
    },
    handlePreview(file) {
      this.previewPath = file.response.data.url
      console.log(this.previewPath)
      this.picDialogVisible = true
    },
    handleRemove(file) {
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从 pics 数组中，找到这个图片对应的索引值
      //   console.log(this.addGoodsForm.pics)
      const i = this.addGoodsForm.pics.findIndex(x => x.pic === filePath)
      // 3. 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
      this.addGoodsForm.pics.splice(i, 1)
    },
    handleSuccess(rep) {
      this.addGoodsForm.pics.push({ pic: rep.data.tmp_upload })
    },
    add() {
      this.$refs.addGoodsFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项！')
        const form = _.cloneDeep(this.addGoodsForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyParamsData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyParamsData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addGoodsForm.attrs.push(newInfo)
        })
        form.attrs = this.addGoodsForm.attrs
        console.log(form)
        // 发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$http.post('goods', form)

        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }

        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    }
  },
  created() {
    this.getCateInfo()
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
.preview {
  width: 100%;
}
.addBtn {
  margin: 15px 0;
}
</style>

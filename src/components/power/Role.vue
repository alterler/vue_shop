<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-button type="primary">添加角色</el-button>
      </el-row>
      <el-table :data='rolesData'
                border
                stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['btborder', index1 ===0 ? 'topborder':'','vcenter']"
                    v-for="(item1 ,index1) in scope.row.children"
                    :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable
                        @close="removeRightsById(scope.row, item1.id)">
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二 3 级权限 -->
              <el-col :span="19">
                <el-row :class="[index2 === 0 ? '' : 'topborder','vcenter']"
                        v-for="(item2 , index2) in item1.children"
                        :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success"
                            closable
                            @close="removeRightsById(scope.row, item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="
                            el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning"
                            v-for="item3 in item2.children"
                            :key="item3.id"
                            closable
                            @close="removeRightsById(scope.row, item3.id)">
                      {{item3.authName}}

                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称"
                         prop="roleName"></el-table-column>
        <el-table-column label="角色描述"
                         prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="primary"
                       icon="el-icon-edi">编辑</el-button>
            <el-button size="mini"
                       type="danger"
                       icon="el-icon-delete">删除</el-button>
            <el-button size="mini"
                       type="warning"
                       icon="el-icon-setting"
                       @click="showRolesDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="提示"
               :visible.sync="roleDialogVisible"
               width="50%"
               @close="closeRoleDialog">
      <el-tree :data="rightsList"
               :props="treeProps"
               show-checkbox
               node-key="id"
               default-expand-all
               :default-checked-keys='defaultKey'
               ref="treeRef"></el-tree>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesData: [],
      roleDialogVisible: false,
      rightsList: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defaultKey: [],
      roleId: ''
    }
  },
  methods: {
    async getRolesData() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesData = res.data
    },
    async removeRightsById(role, id) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${id}`
      )
      if (res.meta.status !== 200) return this.$$message.error(res.meta.msg)
      role.children = res.data
    },
    async showRolesDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightsList = res.data
      this.getLeafNodeId(role, this.defaultKey)
      this.roleDialogVisible = true
    },
    getLeafNodeId(node, arr) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => {
        this.getLeafNodeId(item, arr)
      })
    },
    closeRoleDialog() {
      this.defaultKey = []
    },
    async setRights() {
      const arr = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const str = arr.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: str
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.status)
      this.$message.success('分配成功！')
      this.getRolesData()
      this.roleDialogVisible = false
    }
  },
  created() {
    this.getRolesData()
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.btborder {
  border-bottom: 1px solid #eee;
}
.topborder {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>

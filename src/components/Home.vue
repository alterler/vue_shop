<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/heima.png">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info"
                 @click="LoginOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollpase ? '64px' :'200px'">
        <div class="toggle-collapse" @click="toggleCollapse">|||</div>
        <el-menu background-color="#373d41"
                 text-color="#fff"
                 active-text-color="#409EFF"
                 unique-opened
                 :collapse="isCollpase"
                 :collapse-transition="false"
                 router
                 :default-active="activePath">
          <el-submenu :index="item.id + ''"
                      v-for="item in MenuData"
                      :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/' + subItem.path "
                          v-for="subItem in item.children"
                          :key="subItem.id"
                          @click="SaveState('/' + subItem.path )">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      MenuData: [],
      isCollpase: false,
      activePath: ''
    }
  },
  methods: {
    LoginOut() {
      window.sessionStorage.clear()
      this.$router.push('./login')
    },
    async getMenu() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.MenuData = res.data
    },
    toggleCollapse() {
      this.isCollpase = !this.isCollpase
    },
    SaveState(activepath) {
      window.sessionStorage.setItem('activepath', activepath)
      this.activePath = activepath
    }
  },
  created() {
    this.getMenu()
    this.activePath = window.sessionStorage.getItem('activepath')
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  color: #fff;
  font-size: 20px;
  padding-left: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
    border-right: none
  }
}
.el-main {
  background-color: #eaedf1;
}
.toggle-collapse{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>

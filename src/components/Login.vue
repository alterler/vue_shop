<template>
  <div class="login">
    <div class="login_box">
      <!-- logo -->
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <!-- 表单 -->
      <el-form
        ref="LoginFormRef"
        :model="LoginForm"
        :rules="LoginFormRule"
        class="form_box"
      >
        <el-form-item prop="username">
          <el-input
            v-model="LoginForm.username"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="LoginForm.password"
            type="password"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="Login">登录</el-button>
          <el-button type="info" @click="ResetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      LoginForm: {
        username: 'admin',
        password: '123456'
      },
      LoginFormRule: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 3,
            max: 5,
            message: '名称长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 3,
            max: 15,
            message: '密码长度在 3 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    ResetForm() {
      this.$refs.LoginFormRef.resetFields()
    },
    Login() {
      this.$refs.LoginFormRef.validate(async valid => {
        if (!valid) return
        // eslint-disable-next-line no-unused-vars
        const { data: res } = await this.$http.post('login', this.LoginForm)
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败！')
        }
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  height: 300px;
  width: 450px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 3px;
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
    }
  }
  .form_box {
    width: 100%;
    position: absolute;
    bottom: 0px;
    padding: 0 20px;
    box-sizing: border-box;
    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>

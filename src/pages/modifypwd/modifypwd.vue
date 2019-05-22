<template>
 <a-card title="修改密码" id="components-form-demo-normal-login" :bordered="false">
  <a-form
    :form="form"
    class="login-form"
    @submit="handleSubmit"
  >
    <a-form-item>
      <a-input
        v-decorator="[
          'user_name',
          { rules: [{ required: true, message: '请输入用户名' }] }
        ]"
        placeholder="用户名"
      >
        <a-icon
          slot="prefix"
          type="user"
          style="color: rgba(0,0,0,.25)"
        />
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input
        v-decorator="[
          'password',
          { rules: [{ required: true, message: '请输入旧密码' }] }
        ]"
        type="password"
        placeholder="旧密码"
      >
        <a-icon
          slot="prefix"
          type="lock"
          style="color: rgba(0,0,0,.25)"
        />
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input
        v-decorator="[
          'new_password',
          { rules: [{ required: true, message: '请输入新密码' }] }
        ]"
        type="password"
        placeholder="新密码"
      >
        <a-icon
          slot="prefix"
          type="lock"
          style="color: rgba(0,0,0,.25)"
        />
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-checkbox
        v-decorator="[
          'remember',
          {
            valuePropName: 'checked',
            initialValue: true,
          }
        ]"
      >
        Remember me
      </a-checkbox>
      <!-- <a
        class="login-form-forgot"
        href=""
      >
        Forgot password
      </a> -->
      <a-button
        type="primary"
        html-type="submit"
        class="login-form-button"
      >
        确认修改
      </a-button>
      Or <a href="#/login">
        login now!
      </a>
    </a-form-item>
  </a-form>
 </a-card>
</template>

<script>

export default {
  beforeCreate () {
    this.form = this.$form.createForm(this);
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$api.modifypwd(values).then(obj=>{
            this.$message.success('密码修改成功！');
            this.$router.push('/login');
          })
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
#components-form-demo-normal-login{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    border-radius: 8px;
    box-shadow: 5.7px 8.2px 45px 5px rgba(0,0,0,.1);
    padding: 20px;
    width: 350px;
    padding: 0;
}

  #components-form-demo-normal-login .login-form-forgot {
    float: right;
  }
  #components-form-demo-normal-login .login-form-button {
    width: 100%;
  }
</style>
<template>
  <div>
    <div :style="{ borderBottom: '1px solid #E9E9E9' }">
      <a-checkbox
        :indeterminate="indeterminate"
        @change="onCheckAllChange"
        :checked="checkAll"
      >
        Check all
      </a-checkbox>
    </div>
    <br />
    <a-row>
      
    <a-checkbox-group :options="['Apple']" v-model="checkedList" @change="onChange" />
    <a-checkbox-group :options="['Pear']" v-model="checkedList" @change="onChange" />
    <a-checkbox-group :options="['Orange']" v-model="checkedList" @change="onChange" />
    </a-row>
  </div>
</template>
<script>
const defaultCheckedList = ['Apple', 'Orange']
export default {
  data () {
    return {
      checkedList: [],
      indeterminate: true,
      checkAll: false,
    }
  },
  computed:{
    plainOptions(){
      return ['Apple', 'Pear', 'Orange']
    }
  },
  methods: {
    onChange (checkedList) {
      let {plainOptions} = this;
      this.indeterminate = !!checkedList.length && (checkedList.length < plainOptions.length)
      this.checkAll = checkedList.length === plainOptions.length;
      console.log(checkedList)
    },
    onCheckAllChange (e) {
      let {plainOptions}= this;
      console.log(this.checkedList)
      Object.assign(this, {
        checkedList: e.target.checked ? plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked,
      })
    },
  },
}
</script>

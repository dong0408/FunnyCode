<script setup lang="ts">
import { addPatient, deletePatient, getPatientList, updatePatient } from '@/services/user'
import type { Patient } from '@/types/user'
import { showConfirmDialog, showSuccessToast, showToast } from 'vant'
import { ref, onMounted, computed } from 'vue'
import Validator from 'id-validator'
import { useRoute, useRouter } from 'vue-router'
import { useConsultStore } from '@/stores/consult'

const list = ref<Patient[]>([])
const getList = async () => {
  const res = await getPatientList()
  list.value = res.data
  changeDefaultPatient()
}
onMounted(() => {
  getList()
})
const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]
const count = ref(100)
const car = ref('马自达')
const gender = ref(1)

const show = ref(false)
const showPopup = (item?: Patient) => {
  if (item) {
    //填充表单
    console.log(item)
    const { id, idCard, name, gender, defaultFlag } = item
    patient.value = { id, idCard, name, gender, defaultFlag }
  } else {
    //重置表单
    patient.value = { ...initPatient }
  }
  show.value = true
}

const fn = () => {
  show.value = false
}

const initPatient: Patient = {
  name: '',
  idCard: '',
  gender: 1,
  defaultFlag: 0
}
const patient = ref<Patient>({ ...initPatient })

const defaultFlag = computed({
  get() {
    return patient.value.defaultFlag === 1
  },
  set(val) {
    patient.value.defaultFlag = val ? 1 : 0
  }
})

//表单提交
const submit = async () => {
  if (!patient.value.name) {
    return showToast('请输入名字')
  }
  if (!patient.value.idCard) {
    return showToast('请输入身份证号')
  }
  const validate = new Validator()
  // validate.isValid(patient.value.idCard)
  if (!validate.isValid(patient.value.idCard)) {
    return showToast('身份证号不正确')
  }
  const info = validate.getInfo(patient.value.idCard)
  if (info.sex !== patient.value.gender) {
    return showToast('性别与身份证不符合')
  }
  patient.value.id ? await updatePatient(patient.value) : await addPatient(patient.value)
  // await addPatient(patient.value)
  show.value = false
  getList()
  showSuccessToast(patient.value.id ? '编辑患者成功' : '添加患者成功')
}
//删除操作
const handleDel = async () => {
  await showConfirmDialog({
    title: '温馨提示',
    message: '你是否确认删除该患者信息?'
  })
  await deletePatient(patient.value.id as string)
  show.value = false
  getList()
  showSuccessToast('删除患者成功')
}

//选择患者
// 1.界面兼容
const route = useRoute()
const isChange = computed(() => {
  return route.query.isChange === '1'
})
const patientId = ref<string>()
const selectedPatient = (item: Patient) => {
  if (isChange.value) {
    patientId.value = item.id
  }
}
const changeDefaultPatient = () => {
  if (isChange.value && list.value.length) {
    const defPatient = list.value.find((item) => {
      item.defaultFlag === 1
    })
    if (defPatient) {
      patientId.value = defPatient.id
    } else {
      patientId.value = list.value[0].id
    }
  }
}
const store = useConsultStore()
const router = useRouter()
const next = () => {
  console.log('124')

  if (!patientId.value) return showToast('请选择一个患者')
  store.setPatient(patientId.value)
  router.push('/consult/pay')
}
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar :title="isChange ? '选择患者' : ' 家庭档案'"></cp-nav-bar>
    <!-- 头部提示 -->
    <div class="patient-change" v-if="isChange">
      <h3>请选择患者信息</h3>
      <p>以便医生给出更准确的治疗，信息仅医生可见</p>
    </div>

    <div class="patient-list">
      <div
        class="patient-item"
        v-for="item in list"
        :key="item.id"
        @click="selectedPatient(item)"
        :class="{ selected: patientId === item.id }"
      >
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{ item.idCard.replace(/^(.{6}).+(.{4})$/, '\$1********\$2') }}</span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div class="icon"><cp-icon name="user-edit" @click="showPopup(item)" /></div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>

      <div class="patient-add" v-if="list.length < 6" @click="showPopup()">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
    </div>
    <!-- 底部按钮 -->
    <div class="patient-next" v-if="isChange">
      <van-button type="primary" round block @click="next">下一步</van-button>
    </div>
    <!-- v-model的使用 -->
    <!-- <com-a :model-value="count" @update:model-value="count = $event"></com-a> -->
    <!-- <com-a v-model="count" :car="car" @update:car="car = $event"></com-a> -->
    <!-- <com-a v-model="count" v-model:car="car"></com-a> -->

    <!-- 测试cp-radio-btn组件 -->
    <!-- <cp-radio-btn :options="options" v-model="gender"></cp-radio-btn> -->

    <!-- 弹出层 -->
    <van-popup v-model:show="show" @update:show="show = $event" position="right">
      <cp-nav-bar
        :back="() => (show = false)"
        :title="patient.id ? '编辑患者' : '添加患者'"
        right-text="保存"
        @click-right="submit"
      ></cp-nav-bar>
      <van-form autocomplete="off" ref="form">
        <van-field v-model="patient.name" label="真实姓名" placeholder="请输入真实姓名" />
        <van-field v-model="patient.idCard" label="身份证号" placeholder="请输入身份证号" />
        <van-field label="性别" class="pb4">
          <!-- 单选按钮组件 -->
          <template #input>
            <cp-radio-btn :options="options" v-model="patient.gender"></cp-radio-btn>
          </template>
        </van-field>
        <van-field label="默认就诊人">
          <template #input>
            <van-checkbox v-model="defaultFlag" :icon-size="18" round />
          </template>
        </van-field>
      </van-form>
      <van-action-bar v-if="patient.id">
        <van-action-bar-button @click="handleDel">删除</van-action-bar-button>
      </van-action-bar>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;
  ::v-deep() {
    .van-popup {
      width: 100%;
      height: 100%;
      padding-top: 46px;
      box-sizing: border-box;
    }
  }
}
.van-action-bar {
  padding: 0 10px;
  margin-bottom: 10px;
  .van-button {
    color: var(--cp-price);
    background-color: var(--cp-bg);
  }
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
.pb4 {
  padding-bottom: 4px;
}
.patient-change {
  padding: 15px;
  > h3 {
    font-weight: normal;
    margin-bottom: 5px;
  }
  > p {
    color: var(--cp-text3);
  }
}
.patient-next {
  padding: 15px;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  box-sizing: border-box;
}
</style>

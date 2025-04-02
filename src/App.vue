
<!-- 在Vue的模板中，动态绑定的值如果是字符串，必须用单引号包裹-->
<template>
  <div>
    <div class="app-container">
      <!-- 基础用法 -->
      <TextScroll text="这是一条基础的滚动公告，默认向左滚动。" typewriter />

      <!-- 使用不同的类型 -->
      <TextScroll type="success" text="这是一条成功类型的滚动公告" typewriter />

      <TextScroll type="warning" text="这是一条警告类型的滚动公告" />

      <TextScroll type="danger" text="这是一条危险类型的滚动公告" />

      <TextScroll type="info" text="这是一条信息类型的滚动公告" />

      <!-- 自定义速度和方向 -->
      <TextScroll text="这是一条速度较慢、向右滚动的公告" :speed="30" direction="right" showClose />
    </div>
    <TableSelect :select-config="selectConfig" :is-popover="true" ></TableSelect>
    <InputTag :config="attr"></InputTag>
  </div>
</template>


<script setup lang="ts">
import TextScroll from '@/components/TextScroll/index.vue';
import InputTag from "@/components/InputTag/index.vue"
import TableSelect from "@/components/TableSelect/index.vue"
import type { ISelectConfig } from "@/components/TableSelect/index.vue";

const attr = {
  buttonAttrs: {
    btnText: "新增标签"
  }

}


const selectConfig: ISelectConfig = {
  pk: "id",
  width: "70%",
  placeholder: "请选择用户",
  formItems: [
    {
      type: "input",
      label: "关键字",
      prop: "keywords",
      attrs: {
        placeholder: "用户名/昵称/手机号",
        clearable: true,
        style: {
          width: "200px",
        },
      },
    },
    {
      type: "tree-select",
      label: "部门",
      prop: "deptId",
      attrs: {
        placeholder: "请选择",
        data: [
          {
            value: 1,
            label: "有来技术",
            children: [
              {
                value: 2,
                label: "研发部门",
              },
              {
                value: 3,
                label: "测试部门",
              },
            ],
          },
        ],
        filterable: true,
        "check-strictly": true,
        "render-after-expand": false,
        clearable: true,
        style: {
          width: "150px",
        },
      },
    },
    {
      type: "select",
      label: "状态",
      prop: "status",
      attrs: {
        placeholder: "全部",
        clearable: true,
        style: {
          width: "100px",
        },
      },
      options: [
        { label: "启用", value: 1 },
        { label: "禁用", value: 0 },
      ],
    },
    {
      type: "date-picker",
      label: "创建时间",
      prop: "createAt",
      attrs: {
        type: "daterange",
        "range-separator": "~",
        "start-placeholder": "开始时间",
        "end-placeholder": "截止时间",
        "value-format": "YYYY-MM-DD",
        style: {
          width: "240px",
        },
      },
    },
  ],
  indexAction: function (params: any) {
    if ("createAt" in params) {
      const createAt = params.createAt as string[];
      if (createAt?.length > 1) {
        params.startTime = createAt[0];
        params.endTime = createAt[1];
      }
      delete params.createAt;
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 0,
          data: {
            list: [
              {
                id: 1,
                username: "admin",
                nickname: "超级管理员",
                gender: 1,
                deptName: "有来技术",
                mobile: "13888888888",
                status: 1,
                createTime: "2022-01-01 00:00:00",
              }
            ]
          }
        })
      })
    })
  },
  tableColumns: [
    { type: "selection", width: 50, align: "center" },
    { label: "编号", align: "center", prop: "id", width: 100 },
    { label: "用户名", align: "center", prop: "username" },
    { label: "用户昵称", align: "center", prop: "nickname", width: 120 },
    {
      label: "性别",
      align: "center",
      prop: "gender",
      width: 100,
      templet: "custom",
      slotName: "gender",
    },
    { label: "部门", align: "center", prop: "deptName", width: 120 },
    { label: "手机号码", align: "center", prop: "mobile", width: 120 },
    {
      label: "状态",
      align: "center",
      prop: "status",
      templet: "custom",
      slotName: "status",
    },
    { label: "创建时间", align: "center", prop: "createTime", width: 180 },
  ]
}


</script>


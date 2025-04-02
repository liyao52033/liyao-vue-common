<template>
    <div v-for="tip in tips" :key="tip.id" :class="['global-tip', `tip-${tip.type}`]" :style="getTipStyle(tip)">
        <i :class="['iconfont', tip.type ? getIconClass(tip.type) : '']"></i>
        <p :class="`tip-${tip.type}-content`">{{ tip.content }}</p>
    </div>
</template>

<script setup lang="ts">

defineOptions({
    name: 'GlobalTip'
})

import { onMounted, ref } from "vue";

const initRoute = () => {

    let globalTip = document.getElementsByClassName('global-tip')
    if (globalTip.length <= 0) {
        showTimeBasedTip()
    }
}

onMounted(() => {
    initRoute();
});

interface Tip {
    id: number
    content: string
    type: 'info' | 'success' | 'warning' | 'danger'
    top: number
    opacity: number
}

const tips = ref<Tip[]>([])
const time = ref(3000)

function getIconClass(type: Tip['type']): string {
    const iconMap = {
        info: 'icon-info',
        success: 'icon-dagouyouquan',
        danger: 'icon-cuowu',
        warning: 'icon-gantanhao'
    }
    return iconMap[type]
}

function getTipStyle(tip: Tip) {
    return {
        top: `${tip.top}px`,
        opacity: tip.opacity
    }
}

function addTip(content: string, type: Tip['type']) {
    const tip: Tip = {
        id: Date.now(),
        content,
        type,
        top: tips.value.length ? tips.value[tips.value.length - 1].top + 70 : 50,
        opacity: 1
    }

    tips.value.push(tip)

    setTimeout(() => {
        const index = tips.value.findIndex(t => t.id === tip.id)
        if (index !== -1) {
            tips.value.splice(index, 1)
        }
    }, time.value)
}

function showTimeBasedTip() {
    const now = new Date()
    const hours = now.getHours()
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    const timeStr = `${hours}:${minutes}:${seconds}`

    if (hours >= 6 && hours < 11) {
        addTip(`早上好呀~~，现在是 ${timeStr}，吃早餐了吗？😊🤭`, 'success')
    } else if (hours >= 11 && hours <= 12) {
        addTip(`中午好呀~~，现在是 ${timeStr}，睡个午觉吧🥤🏀~~`, 'success')
    } else if (hours >= 13 && hours < 17) {
        addTip(`下午好呀~~，现在是 ${timeStr}，繁忙的下午也要适当休息哦🥤🏀~~`, 'info')
    } else if (hours >= 17 && hours < 19) {
        addTip(`到黄昏了~~，现在是 ${timeStr}，准备下班干饭🥗🍖~~`, 'info')
    } else if (hours >= 19 && hours < 22) {
        addTip(`晚上好呀~~，现在是 ${timeStr}，看个电影放松一下吧🥱😪~~`, 'success')
    } else if (hours >= 22 && hours < 24) {
        addTip(`晚上好呀~~，现在是 ${timeStr}，该准备睡觉了🥱😪~~`, 'warning')
    } else if (hours >= 0 && hours < 6) {
        addTip(`别再熬夜了~~，现在是 ${timeStr}，早点睡吧，让我们一起欣赏明天早上的太阳~~😇🛏`, 'danger')
    }
}
</script>

<style scoped>
.global-tip {
    position: fixed;
    display: flex;
    align-items: center;
    left: 50%;
    transform: translateX(-50%);
    min-width: 320px;
    transition: all 0.3s ease;
    z-index: 99999;
    padding: 15px 15px 15px 20px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    line-height: 17px;
}

.global-tip p {
    line-height: 17px;
    margin: 0;
    font-size: 14px;
}

.icon {
    margin-right: 10px;
    line-height: 17px;
}

.tip-success {
    color: #67c23a;
    background-color: #f0f9eb;
    border-color: #e1f3d8;
}

.tip-success .tip-success-content {
    color: #67c23a;
}

.tip-danger {
    color: #f56c6c;
    background-color: #fef0f0;
    border-color: #fde2e2;
}

.tip-danger .tip-danger-content {
    color: #f56c6c;
}

.tip-info {
    background-color: #edf2fc;
    border-color: #ebeef5;
}

.tip-info .tip-info-content {
    color: #909399;
}

.tip-warning {
    color: #e6a23c;
    background-color: #fdf6ec;
    border-color: #faecd8;
}

.tip-warning .tip-warning-content {
    color: #e6a23c;
}
</style>

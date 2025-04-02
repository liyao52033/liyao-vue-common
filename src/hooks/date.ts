import { ref, computed } from "vue";

/**
 * 计算两个日期相差多少天的 Hook
 */
export function useDayDiff(startDate: string, endDate?: string) {
    const startTimestamp = ref(new Date(startDate).getTime());
    const endTimestamp = ref(endDate ? new Date(endDate).getTime() : new Date().getTime());

    const diffDays = computed(() => {
        return Math.floor(Math.abs(endTimestamp.value - startTimestamp.value) / (1000 * 60 * 60 * 24));
    });

    return {
        diffDays
    };
}

/**
 * 计算时间差（年/月/日/时/分/秒）的 Hook
 */
export function useTimeDiff(startDate: Date | string, endDate?: Date | string) {
    const start = ref(startDate instanceof Date ? startDate : new Date(startDate));
    const end = ref(endDate ? (endDate instanceof Date ? endDate : new Date(endDate)) : new Date());

    const timeDiff = computed(() => {
        const diffValue = Math.abs(end.value.getTime() - start.value.getTime()) / 1000;

        if (diffValue < 60) {
            return "刚刚";
        } else if (diffValue < 3600) {
            return `${Math.floor(diffValue / 60)} 分钟前`;
        } else if (diffValue < 86400) {
            return `${Math.floor(diffValue / 3600)} 小时前`;
        } else if (diffValue < 2592000) {
            return `${Math.floor(diffValue / 86400)} 天前`;
        } else if (diffValue < 31104000) {
            return `${Math.floor(diffValue / 2592000)} 月前`;
        } else {
            return `${Math.floor(diffValue / 31104000)} 年前`;
        }
    });

    return {
        timeDiff
    };
}

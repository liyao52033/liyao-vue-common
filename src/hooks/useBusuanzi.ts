import { onMounted, ref   } from "vue";

export interface BusuanziData {
    site_pv?: number;
    site_uv?: number;
    page_pv?: number;
    page_uv?: number;
}

export function useBusuanzi() {
    if (typeof window === "undefined") {
        // 在 SSR 期间直接返回默认值，避免访问 window
        return { stats: ref<BusuanziData>({}), loading: ref(false), error: ref(null) };
    }

    const site_pv = ref<number>(0);
    const site_uv = ref<number>(0);
    const page_pv = ref<number>(0);
    const page_uv = ref<number>(0);

    const fetchBusuanziData = async () => {
        try {
            const headers = new Headers();
            headers.append("x-bsz-referer", window.location.href);
            headers.append("Referer", window.location.href);
            headers.append("User-Agent", navigator.userAgent);

            const response = await fetch("https://busuanzi.9420.ltd/api", {
                method: "GET",
                headers,
                redirect: "follow",
            });

            const text = await response.text();
            const jsonData = JSON.parse(text);
            if (jsonData.success && jsonData.data) {
                site_pv.value = jsonData.data.site_pv ?? 0;
                site_uv.value = jsonData.data.site_uv ?? 0;
                page_pv.value = jsonData.data.page_pv ?? 0;
                page_uv.value = jsonData.data.page_uv ?? 0;
            }

            // 确保 document 可用（防止意外 SSR 访问）
            if (typeof document !== "undefined") {
                ["site_pv", "site_uv", "page_pv", "page_uv"].forEach((key) => {
                    const el = document.getElementById(`busuanzi_${key}`);
                    if (el) el.innerText = String(jsonData[key as keyof BusuanziData] ?? "loading" );
                });

                ["site_pv", "site_uv", "page_pv", "page_uv"].forEach((key) => {
                    const container = document.getElementById(`busuanzi_container_${key}`);
                    if (container) container.style.display = "inline";
                });
            }
        } catch (err) {
            console.error("获取 Busuanzi 统计数据失败:", err);
        }
    }

    onMounted(fetchBusuanziData);

    return { site_pv, site_uv, page_pv, page_uv };
}

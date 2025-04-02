import { onMounted, onUnmounted, ref } from 'vue';

// 用于记录已经加载成功的脚本
const loadedScripts = new Map<string, boolean>();

interface ScriptOptions {
    src: string;
    timeout?: number;
    maxRetries?: number;
}

export function useScript(opts: ScriptOptions) {
    const isLoading = ref(false);
    const error = ref(false);
    const success = ref(false);
    const isTimeout = ref(false);
    let script: HTMLScriptElement | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let retryCount = 0;
    const maxRetries = opts.maxRetries || 5;
    const timeout = opts.timeout || 5000;

    const loadScript = () => {
        if (loadedScripts.has(opts.src)) {
            // 如果脚本已经加载成功，直接使用
            isLoading.value = false;
            success.value = true;
            error.value = false;
            isTimeout.value = false;
            return;
        }

        isLoading.value = true;
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = opts.src;
        script.async = true; // 设置脚本为异步加载

        script.onload = function () {
            clearTimeout(timeoutId as ReturnType<typeof setTimeout>);
            isLoading.value = false;
            success.value = true;
            error.value = false;
            isTimeout.value = false;
            loadedScripts.set(opts.src, true); // 记录脚本加载成功
        };

        script.onerror = function (event) {
            clearTimeout(timeoutId as ReturnType<typeof setTimeout>);
            // 将 event 转换为 Error 类型
            const err = new Error(`脚本加载出错: ${event}`);
            handleError(err);
        };

        document.head.appendChild(script);

        if (timeout) {
            timeoutId = setTimeout(() => {
                if (script) {
                    script.remove();
                }
                const err = new Error('脚本加载超时');
                handleError(err);
            }, timeout);
        }
    };

    const handleError = (err: Error) => {
        isLoading.value = false;
        success.value = false;
        error.value = true;
        isTimeout.value = err.message === '脚本加载超时';

        if (retryCount < maxRetries) {
            retryCount++;
            console.log(`脚本加载失败，开始第 ${retryCount} 次重试...`);
            loadScript();
        }
    };

    onMounted(() => {
        loadScript();
    });

    onUnmounted(() => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        if (script) {
            script.remove();
        }
    });

    return {
        isLoading,
        error,
        success,
        isTimeout
    };
}
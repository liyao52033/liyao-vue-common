import { getCurrentInstance, onBeforeUnmount, ref, Ref, shallowRef, unref, watchEffect } from 'vue';
import { addResizeListener, removeResizeListener } from '@/utils/event';
import { isDef } from '@/utils/is';

// 扩展 HTMLElement 接口以包含自定义属性
interface WatermarkHTMLElement extends HTMLElement {
    'data-watermark-text'?: string;
}

const watermarkSymbol = 'watermark-dom';
const updateWatermarkText = ref<string | null>(null);

type UseWatermarkRes = {
    setWatermark: (str: string) => void;
    clear: () => void;
    clearAll: () => void;
    waterMarkOptions?: waterMarkOptionsType;
    obInstance?: MutationObserver;
    targetElement?: WatermarkHTMLElement;
    parentElement?: HTMLElement;
};

type waterMarkOptionsType = {
    // 自定义水印的文字大小
    fontSize?: number;
    // 自定义水印的文字颜色
    fontColor?: string;
    // 自定义水印的文字字体
    fontFamily?: string;
    // 自定义水印的文字对齐方式
    textAlign?: CanvasTextAlign;
    // 自定义水印的文字基线
    textBaseline?: CanvasTextBaseline;
    // 自定义水印的文字倾斜角度
    rotate?: number;
};

const sourceMap = new Map<symbol, Omit<UseWatermarkRes, 'clearAll'>>();

function findTargetNode(el: WatermarkHTMLElement) {
    return Array.from(sourceMap.values()).find((item) => item.targetElement === el);
}

function createBase64(str: string, waterMarkOptions: waterMarkOptionsType) {
    const can = document.createElement('canvas');
    const cans = can.getContext('2d');
    if (cans) {
        const fontFamily = waterMarkOptions?.fontFamily || 'Vedana';
        const fontSize = waterMarkOptions?.fontSize || 20;
        const fontColor = waterMarkOptions?.fontColor || 'rgba(0, 0, 0, 0.15)';
        const textAlign = waterMarkOptions?.textAlign || 'left';
        const textBaseline = waterMarkOptions?.textBaseline || 'middle';
        const rotate = waterMarkOptions?.rotate || 10;

        cans.font = `${fontSize}px ${fontFamily}`;
        cans.fillStyle = fontColor;
        cans.textAlign = textAlign;
        cans.textBaseline = textBaseline;

        // 动态计算每行字符数，以适应不同的文字长度
        const maxLineWidth = 500; // 预设最大行宽
        let maxCharsPerLine = 1;
        let loopCount = 0; // 增加循环次数计数器
        const maxLoop = 1000; // 设定最大循环次数
        while (cans.measureText(str.slice(0, maxCharsPerLine)).width < maxLineWidth && loopCount < maxLoop) {
            maxCharsPerLine++;
            loopCount++;
        }
        maxCharsPerLine--; // 回退一个字符，确保不超过最大行宽

        const lines = [];
        for (let i = 0; i < str.length; i += maxCharsPerLine) {
            lines.push(str.slice(i, i + maxCharsPerLine));
        }

        let totalWidth = 0;
        let totalHeight = 0;
        lines.forEach((line) => {
            const lineWidth = cans.measureText(line).width;
            totalWidth = Math.max(totalWidth, lineWidth);
        });
        totalHeight = lines.length * (fontSize + 8); // 行高为 fontSize + 8

        // 考虑旋转角度对宽度和高度的影响
        const radians = (rotate * Math.PI) / 180;
        const cosValue = Math.abs(Math.cos(radians));
        const sinValue = Math.abs(Math.sin(radians));
        const width = totalWidth * cosValue + totalHeight * sinValue + 100; // 增加边距
        const height = totalWidth * sinValue + totalHeight * cosValue * 3 + 80; // 增加边距

        can.width = width;
        can.height = height;

        cans.rotate((-rotate * Math.PI) / 180);
        cans.font = `${fontSize}px ${fontFamily}`;
        cans.fillStyle = fontColor;
        cans.textAlign = textAlign;
        cans.textBaseline = textBaseline;

        const lineHeight = fontSize + 8;
        lines.forEach((line, index) => {
            cans.fillText(line, 40, height / 2 + index * lineHeight);
        });
    }
    return can.toDataURL('image/png');
}

const resetWatermarkStyle = (
    element: WatermarkHTMLElement,
    watermarkText: string,
    waterMarkOptions: waterMarkOptionsType,
) => {
    element.className = '__' + watermarkSymbol;
    element.style.pointerEvents = 'none';
    element.style.display = 'block';
    element.style.visibility = 'visible';
    element.style.top = '0px';
    element.style.left = '0px';
    element.style.position = 'absolute';
    element.style.zIndex = '100000';
    element.style.height = '100%';
    element.style.width = '100%';
    element.style.background = `url(${createBase64(
        unref(updateWatermarkText) || watermarkText,
        waterMarkOptions,
    )}) left top repeat`;
};

const obFn = () => {
    const obInstance = new MutationObserver((mutationRecords) => {
        for (const mutation of mutationRecords) {
            if (mutation.type === 'childList') {
                for (const node of Array.from(mutation.removedNodes)) {
                    const target = findTargetNode(node as WatermarkHTMLElement);
                    if (target) {
                        const { targetElement, parentElement } = target;
                        if (!parentElement?.contains(targetElement as Node | null)) {
                            target?.parentElement?.appendChild(node as WatermarkHTMLElement);
                        }
                    }
                }
            } else if (mutation.type === 'attributes' && mutation.target) {
                const _target = mutation.target as WatermarkHTMLElement;
                const target = findTargetNode(_target);
                if (target) {
                    clearAll();
                    target.setWatermark(target.targetElement?.['data-watermark-text'] || '');
                }
            }
        }
    });
    return obInstance;
};

export function useWatermark(
    appendEl: Ref<HTMLElement | null> = ref(document.body) as Ref<HTMLElement>,
    waterMarkOptions: waterMarkOptionsType = {},
): UseWatermarkRes {
    const domSymbol = Symbol(watermarkSymbol);
    const appendElRaw = unref(appendEl);
    if (appendElRaw && sourceMap.has(domSymbol)) {
        const { setWatermark, clear } = sourceMap.get(domSymbol) as UseWatermarkRes;
        return { setWatermark, clear, clearAll };
    }

    const useRafThrottle = (callback: () => void) => {
        const isThrottled = ref(false);

        const throttledCallback = () => {
            if (isThrottled.value) return;
            isThrottled.value = true;
            requestAnimationFrame(() => {
                callback();
                isThrottled.value = false;
            });
        };

        watchEffect(() => {
            throttledCallback();
        });

        return throttledCallback;
    };

    const func = useRafThrottle(function () {
        const el = unref(appendEl);
        if (!el) return;
        const { clientHeight: height, clientWidth: width } = el;
        updateWatermark({ height, width });
    });
    const watermarkEl = shallowRef<WatermarkHTMLElement>();
    const clear = () => {
        const domId = unref(watermarkEl);
        watermarkEl.value = undefined;
        const el = unref(appendEl);
        sourceMap.has(domSymbol) && sourceMap.get(domSymbol)?.obInstance?.disconnect();
        sourceMap.delete(domSymbol);
        if (!el) return;
        domId && el.removeChild(domId);
        removeResizeListener(el, func);
    };

    function updateWatermark(
        options: {
            width?: number;
            height?: number;
            str?: string;
        } = {},
    ) {
        const el = unref(watermarkEl);
        if (!el) return;
        const parentEl = unref(appendEl);
        if (parentEl) {
            const { clientWidth: width, clientHeight: height } = parentEl;
            el.style.width = `${width}px`;
            el.style.height = `${height}px`;
        }
        if (isDef(options.str)) {
            el.style.background = `url(${createBase64(options.str, waterMarkOptions)}) left top repeat`;
        }
    }

    const createWatermark = (str: string) => {
        if (unref(watermarkEl) && sourceMap.has(domSymbol)) {
            updateWatermarkText.value = str;
            updateWatermark({ str });
            return;
        }
        const div = document.createElement('div') as WatermarkHTMLElement;
        div['data-watermark-text'] = str; // 自定义属性 用于恢复水印
        updateWatermarkText.value = str;
        watermarkEl.value = div;
        resetWatermarkStyle(div, str, waterMarkOptions);
        const el = unref(appendEl);
        if (!el) return;
        const { clientHeight: height, clientWidth: width } = el;
        updateWatermark({ str, width, height });
        el.appendChild(div);
        sourceMap.set(domSymbol, {
            setWatermark,
            clear,
            parentElement: el,
            targetElement: div,
            obInstance: obFn(),
            waterMarkOptions,
        });
        sourceMap.get(domSymbol)?.obInstance?.observe(el, {
            childList: true, // 子节点的变动（指新增，删除或者更改）
            subtree: true, // 该观察器应用于该节点的所有后代节点
            attributes: true, // 属性的变动
        });
    };

    function setWatermark(str: string) {
        createWatermark(str);
        addResizeListener(document.documentElement, func);
        const instance = getCurrentInstance();
        if (instance) {
            onBeforeUnmount(() => {
                clear();
            });
        }
    }
    return { setWatermark, clear, clearAll };
}

function clearAll() {
    Array.from(sourceMap.values()).forEach((item) => {
        item?.obInstance?.disconnect();
        item.clear();
    });
}
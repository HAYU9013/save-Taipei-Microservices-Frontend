<template>
    <div class="app">
        <h1>測試與 Flutter WebView 的雙向通訊</h1>

        <!-- 發送訊息到 Flutter -->
        <div>
            <button @click="sendMessageToFlutter">發送訊息到 Flutter</button>
        </div>

        <!-- 顯示來自 Flutter 的回應 -->
        <div v-if="flutterResponse">
            <p>來自 Flutter 的回應：</p>
            <pre>{{ flutterResponse }}</pre>
        </div>

        <!-- 顯示所有的 debug 日誌 -->
        <div>
            <h2>Debug 日誌：</h2>
            <ul>
                <li v-for="(log, index) in logs" :key="index">{{ log }}</li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useConnectionMessage } from '@/composables/useConnectionMessage';
import { useHandleConnectionData } from '@/composables/useHandleConnectionData';

// 資料狀態管理
const flutterResponse = ref(''); // 儲存來自 Flutter 的回應
const logs = ref<string[]>([]); // 使用標準泛型語法來修正

// 添加日誌方法
const addLog = (log: string) => {
    logs.value.push(log);
};

// 發送訊息到 Flutter 的方法
// const sendMessageToFlutter = () => {
//     const messageData = { name: 'userinfo', data: null };
//     addLog(`即將發送訊息到 Flutter: ${JSON.stringify(messageData)}`);
//     useConnectionMessage('userinfo', null);
//     addLog('訊息已發送至 Flutter');
// };
const sendMessageToFlutter = () => {
    const messageData = {
        name: 'open_link',
        data: 'https://taipei-microservices-initiative-hayu.onrender.com/api/autofillform/showpdf/travelform_%E9%98%BF%E5%9B%89%E5%93%88.pdf'
    };
    addLog(`即將發送訊息到 Flutter: ${JSON.stringify(messageData)}`);
    useConnectionMessage('open_link', messageData.data); // 使用 'open_link' 發送資料
    addLog('訊息已發送至 Flutter');
};


// 處理來自 Flutter 的回應
const handleFlutterMessage = (event: { data: string }) => {
    try {
        addLog(`收到來自 Flutter 的消息: ${event.data}`);
        const responseData = JSON.parse(event.data);
        flutterResponse.value = JSON.stringify(responseData, null, 2);
        addLog(`解析後的消息: ${flutterResponse.value}`);
    } catch (e) {
        addLog(`解析來自 Flutter 的消息失敗: ${e}`);
    }
};

// 監聽 Flutter 傳回的資料
useHandleConnectionData(handleFlutterMessage);
</script>

<style scoped>
.app {
    max-width: 600px;
    margin: 40px auto;
    padding: 30px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;
    font-weight: 600;
}

button {
    display: block;
    margin: 20px auto;
    padding: 12px 20px;
    background-color: #0056b3;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease, transform 0.3s ease;
}

button:hover {
    background-color: #004494;
    transform: translateY(-2px);
}

button:active {
    background-color: #003366;
    transform: translateY(0);
}

pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    background-color: #f0f0f0;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
}

ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

li {
    margin-bottom: 10px;
    color: #555;
}

/* 響應式設計 */
@media (max-width: 768px) {
    .app {
        padding: 20px;
    }

    h1 {
        font-size: 1.75rem;
    }

    button {
        font-size: 0.9rem;
        padding: 10px;
    }

    pre {
        padding: 10px;
    }
}
</style>

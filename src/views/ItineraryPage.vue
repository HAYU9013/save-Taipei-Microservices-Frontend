<template>
  <div>
    <h1 class="title">旅遊行程安排</h1>

    <form @submit.prevent="submitItinerary" class="form-container">
      <input
        type="text"
        v-model="form.location"
        placeholder="輸入地點"
        required
      />
      <input
        type="text"
        v-model="form.description"
        placeholder="輸入行程描述"
        required
      />
      <button type="submit" class="submit-btn">送出行程</button>
    </form>

    <!-- 使用 Google Maps iframe 顯示多個推薦地點 -->
    <div v-if="recommendedLocations.length > 0" class="map-container">
      <div
        v-for="(location, index) in recommendedLocations"
        :key="index"
        class="location-item"
      >
        <iframe
          width="100%"
          height="300"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
          :src="
            'https://maps.google.com/maps?width=100%25&amp;height=300&amp;hl=zh-TW&amp;q=' +
            encodeURIComponent(location) +
            '&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed&disableDefaultUI=true&zoomControl=false&mapTypeControl=false&scaleControl=false&streetViewControl=false'
          "
          allowfullscreen
          aria-hidden="false"
          tabindex="0"
        ></iframe>
      </div>
    </div>

    <!-- 顯示 API 回應的 Markdown 內容，並包裝在卡片中 -->
    <div v-if="mes" class="response-card">
      <div class="response-card-header">AI 回應結果</div>
      <div class="response-card-content" v-html="parseMarkdown(mes)"></div>
    </div>
  </div>
</template>

<script>
import OpenAI from "openai";
import { marked } from "marked";
let kkk =
  "c2stcHJvai1jS2M0c3NFNkpPQWFycFN4QnFQYmxfMmtOdXBxbXJId05abUppdVRtdm84ZjJrR2ZONW1fX2hFOWdJVDNCbGJrRkpRekpTd2hGRkJuUGFqNVlHazBwd1BNdmdvb0lKeXQyMVd3cmZMNUR6aDU5VXV4VmxLRmNjZmdwZGNB";
const decodedStr = atob(kkk);
console.log(decodedStr);

let msg = "";
export default {
  data() {
    return {
      form: {
        location: "",
        description: "",
      },
      recommendedLocations: [], // 存儲 gemini 推薦的多個地點
      responseMessage: null, // 儲存回應訊息
      mes: null,
    };
  },
  methods: {
    parseMarkdown(content) {
      return marked(content); // Convert Markdown to HTML
    },
    async submitItinerary() {
      // 構建發送到 gemini 的資料，包含地點和行程描述，並要求返回地點以逗號分隔
      const input = `地點: ${this.form.location}, 行程描述: ${this.form.description}，請根據這些資訊返回幾個旅遊地點，並以逗號分隔。例如：地點1, 地點2, 地點3`;

      try {
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=AIzaSyAsrQ5ObzfFJfGjwAIaMcRxp4gW-PMiELg", // 替換為正確的 API 金鑰
          // "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAsrQ5ObzfFJfGjwAIaMcRxp4gW-PMiELg", // 替換為正確的 API 金鑰

          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: input,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const geminiResponse = data.candidates[0].content.parts[0].text;

        // 假設 gemini 返回多個地點，以逗號分隔
        this.recommendedLocations = geminiResponse.split(","); // 分隔多個地點
        msg = this.recommendedLocations;
        console.log(msg);
        this.responseMessage = "行程提交成功，已顯示推薦地點。";
      } catch (error) {
        console.error("Error submitting itinerary:", error);
        this.responseMessage = "提交時發生錯誤，請稍後再試。";
      }

      console.log("1");
      const openai = new OpenAI({
        apiKey: decodedStr,
        dangerouslyAllowBrowser: true,
      });

      const thread = await openai.beta.threads.create();
      let mes;
      const message = await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: msg[0] + "," + msg[1] + "," + msg[2],
      });
      console.log("2");
      let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
        assistant_id: "asst_8GkyxwRkgLuvSkUcvhkFIFKT",
        instructions:
          "Please address the user as Jane Doe. The user has a premium account.",
      });
      console.log("3");
      if (run.status === "completed") {
        const messages = await openai.beta.threads.messages.list(run.thread_id);
        for (const message of messages.data.reverse()) {
          console.log(`${message.role} > ${message.content[0].text.value}`);
          this.mes = message.content[0].text.value;
        }
      } else {
        console.log(run.status);
      }
    },
  },

  methods_1: {
    //     async submitItinerary() {
    //       console.log("1")
    // const openai = new OpenAI({ apiKey: decodedStr , dangerouslyAllowBrowser: true});
    // const thread = await openai.beta.threads.create();
    // const message = await openai.beta.threads.messages.create(
    //   thread.id,
    //   {
    //     role: "user",
    //     content: msg[0] + ","+ msg[1]+ "," + msg[2]
    //   }
    // );
    // console.log("2")
    // let run = await openai.beta.threads.runs.createAndPoll(
    //   thread.id,
    //   {
    //     assistant_id: 'asst_8GkyxwRkgLuvSkUcvhkFIFKT',
    //     instructions: "Please address the user as Jane Doe. The user has a premium account."
    //   }
    // );
    // console.log("3")
    // if (run.status === 'completed') {
    //   const messages = await openai.beta.threads.messages.list(
    //     run.thread_id
    //   );
    //   for (const message of messages.data.reverse()) {
    //     console.log(`${message.role} > ${message.content[0].text.value}`);
    //   }
    // } else {
    //   console.log(run.status);
    // }
    //       }
  },
};
</script>

<style scoped>
body {
  font-family: "Roboto", sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f9;
  color: #333;
}

.title {
  text-align: center;
  padding: 1.5em;
  background-color: #00bcd4;
  color: #fff;
  font-size: 1.5em;
  margin-bottom: 1em;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.form-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 1em;
  padding: 1em;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

input {
  padding: 0.75em;
  border: 1px solid #ccc;
  border-radius: 0.5em;
  font-size: 1.2em;
  margin-bottom: 1em;
  transition: all 0.3s ease-in-out;
}

input:focus {
  border-color: #00bcd4;
  box-shadow: 0 4px 8px rgba(0, 188, 212, 0.2);
  outline: none;
}

.submit-btn {
  padding: 0.75em 1.5em;
  border: none;
  border-radius: 0.5em;
  background-color: #00bcd4;
  color: #fff;
  font-size: 1.2em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #0097a7;
  box-shadow: 0 4px 12px rgba(0, 188, 212, 0.3);
}

.map-container {
  margin: 2em auto;
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.location-item {
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.location-item:hover {
  transform: scale(1.05);
}

/* 卡片樣式設計 */
.response-card {
  margin: 2em auto;
  padding: 1.5em;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 800px;
  transition: transform 0.3s ease;
}

.response-card-header {
  font-size: 1.8em;
  font-weight: bold;
  color: #00bcd4;
  margin-bottom: 1em;
  text-align: center;
}

.response-card-content {
  font-size: 1.2em;
  color: #333;
  line-height: 1.6em;
  word-wrap: break-word;
}

.response-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}
</style>

<template>
  <div>
    <h1 class="title">旅遊行程安排</h1>
    <form @submit.prevent="submitItinerary">
      <input type="text" v-model="form.location" placeholder="輸入地點" required />
      <input type="text" v-model="form.description" placeholder="輸入行程描述" required />
      <button type="submit">送出行程</button>
    </form>

    <div v-if="recommendedLocation" class="map-container">
      <!-- 使用Google Maps iframe來顯示 gemini 推薦的地點 -->
      <iframe
        width="100%"
        height="300"
        frameborder="0"
        scrolling="no"
        marginheight="0"
        marginwidth="0"
        :src="'https://maps.google.com/maps?width=100%25&amp;height=300&amp;hl=zh-TW&amp;q=' + encodeURIComponent(recommendedLocation) + '&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed&disableDefaultUI=true&zoomControl=false&mapTypeControl=false&scaleControl=false&streetViewControl=false'"
        allowfullscreen
        aria-hidden="false"
        tabindex="0"
      ></iframe>
    </div>

    <div v-if="responseMessage">
      <p>{{ responseMessage }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        location: "",
        description: "",
      },
      recommendedLocation: null, // 儲存 gemini 推薦的地點
      responseMessage: null, // 儲存回應訊息
    };
  },
  methods: {
    async submitItinerary() {
      // 構建發送到 gemini 的資料，包含地點和行程描述
      const input = `地點: ${this.form.location}, 行程描述: ${this.form.description}`;

      try {
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAsrQ5ObzfFJfGjwAIaMcRxp4gW-PMiELg", // 請替換為正確的 API 金鑰
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

        // 根據 gemini 的回應來設置推薦的地點
        this.recommendedLocation = geminiResponse; // 假設 gemini 返回的是推薦的地點
        this.responseMessage = "行程提交成功，已顯示推薦地點。";
      } catch (error) {
        console.error("Error submitting itinerary:", error);
        this.responseMessage = "提交時發生錯誤，請稍後再試。";
      }
    },
  },
};
</script>

<style scoped>
body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f9;
  color: #333;
}

.title {
  text-align: center;
  padding: 1em;
  background-color: #6200ea;
  color: #fff;
  font-size: 2em;
}

form {
  display: flex;
  justify-content: center;
  margin: 1em;
  gap: 0.5em;
}

input {
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 0.5em;
  font-size: 1em;
}

button {
  padding: 0.5em 1em;
  border: none;
  border-radius: 0.5em;
  background-color: #6200ea;
  color: #fff;
  cursor: pointer;
}

button:hover {
  background-color: #3700b3;
}

.map-container {
  margin: 1em auto;
  width: 80%;
  max-width: 600px;
}

p {
  text-align: center;
  color: #6200ea;
}
</style>

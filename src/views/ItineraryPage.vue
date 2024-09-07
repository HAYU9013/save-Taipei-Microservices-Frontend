<template>
  <div>
    <h1 class="title">旅遊行程安排</h1>
    <form @submit.prevent="submitItinerary">
      <input type="text" v-model="form.location" placeholder="輸入地點" required />
      <input type="text" v-model="form.description" placeholder="輸入行程描述" required />
      <button type="submit">送出行程</button>
    </form>

    <div v-if="recommendedLocations.length > 0" class="map-container">
      <div v-for="(location, index) in recommendedLocations" :key="index" class="location-item">
        <iframe
          width="100%"
          height="300"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
          :src="'https://maps.google.com/maps?width=100%25&amp;height=300&amp;hl=zh-TW&amp;q=' + encodeURIComponent(location) + '+(My%20Location)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed&markers=color:red%7Clabel:L%7C' + encodeURIComponent(location)"
          allowfullscreen
          aria-hidden="false"
          tabindex="0"
        ></iframe>
      </div>
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
      recommendedLocations: [], // 存儲 gemini 推薦的多個地點
      responseMessage: null, // 儲存回應訊息
    };
  },
  methods: {
    async submitItinerary() {
      const input = `地點: ${this.form.location}, 行程描述: ${this.form.description}，請根據這些資訊返回幾個旅遊地點，並以逗號分隔。例如：地點1, 地點2, 地點3`;

      try {
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAsrQ5ObzfFJfGjwAIaMcRxp4gW-PMiELg",
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

        this.recommendedLocations = geminiResponse.split(",");
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

.location-item {
  margin-bottom: 20px;
}

p {
  text-align: center;
  color: #6200ea;
}
</style>

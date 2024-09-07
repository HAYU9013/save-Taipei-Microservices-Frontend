<template>
  <div class="container">
    <h1 class="title">旅遊行程安排</h1>
    <div class="form-container">
      <form @submit.prevent="submitItinerary">
        <div class="input-group">
          <label for="location" class="input-label">行程地點:</label>
          <input id="location" v-model="form.location" placeholder="輸入地點" required class="input-field"/>
        </div>

        <div class="input-group">
          <label for="description" class="input-label">行程描述:</label>
          <textarea id="description" v-model="form.description" placeholder="描述你的行程" class="textarea-field"></textarea>
        </div>

        <button type="submit" class="submit-button">提交行程</button>
      </form>
    </div>

    <!-- 顯示推薦的 Google Maps -->
    <div v-if="recommendedLocation" class="map-container">
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

    <div v-if="responseMessage" class="response-container">
      <h2>回應</h2>
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
      recommendedLocation: null, // 存儲 gemini 推薦的地點
      responseMessage: null, // 儲存後端回應
    };
  },
  methods: {
    async submitItinerary() {
      try {
        // 發送 POST 請求至後端 API
        const response = await fetch("http://localhost:8081/api/itinerary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.form),
        });

        // 檢查後端是否回應成功
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 解析後端的 JSON 回應
        const data = await response.json();
        this.responseMessage = data.message || "行程提交成功";
        this.recommendedLocation = data.recommendedLocation; // 使用 gemini 推薦的地點
      } catch (error) {
        console.error("Error submitting itinerary:", error);
        this.responseMessage = "提交失敗，請檢查後端 API 路徑或伺服器狀態。";
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
}

.form-container {
  margin-bottom: 30px;
}

.input-group {
  margin-bottom: 20px;
}

.input-label {
  display: block;
  font-size: 1.1rem;
  color: #34495e;
  margin-bottom: 8px;
}

.input-field, .textarea-field {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #bdc3c7;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-field:focus, .textarea-field:focus {
  border-color: #2980b9;
}

.textarea-field {
  height: 120px;
  resize: none;
}

.submit-button {
  display: inline-block;
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #2980b9;
}

.map-container {
  margin-top: 30px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.response-container {
  margin-top: 20px;
  background-color: #ecf0f1;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.response-container h2 {
  margin-top: 0;
  color: #2c3e50;
}
</style>

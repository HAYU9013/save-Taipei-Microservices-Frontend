<template>
  <div class="vote-container">
    <div v-for="option in options" :key="option.id" class="option-container">
      <!-- 投票前：顯示按鈕 -->
      <div class="progress-bar-container" v-if="!voted">
        <button class="vote-bar" @click="vote(option.id)" :disabled="voted">{{ option.label }}</button>
      </div>
      <!-- 投票後：顯示結果 -->
      <div v-else class="result-row">
        <div class="progress-bar-container result">
          <div class="progress-bar" :style="{ width: calculatePercentage(option.votes) + '%' }">
            <span class="vote-info">{{ option.votes }} 票 ({{ calculatePercentage(option.votes) }}%)</span>
          </div>
        </div>
        <div class="option-label">{{ option.label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: Array, // 傳入的選項列表
    showResults: Boolean // 是否顯示結果
  },
  data() {
    return {
      voted: false // 控制是否已投票
    };
  },
  methods: {
    vote(optionId) {
      this.voted = true; // 設定為已投票狀態
      this.$emit('vote', optionId); // 當用戶點擊投票按鈕時，觸發 'vote' 事件並傳遞選項的 ID
    },
    calculatePercentage(votes) {
      const totalVotes = this.options.reduce((total, option) => total + option.votes, 0);
      return totalVotes ? ((votes / totalVotes) * 100).toFixed(2) : 0;
    }
  }
}
</script>

<style scoped>
.vote-container {
  margin: 20px;
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.option-container {
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  justify-content: space-between;
}

/* 投票按鈕樣式 */
.vote-bar {
  flex-grow: 1;
  background-color: #00bcd4;
  color: white;
  text-align: center;
  padding: 15px;
  font-size: 1.2rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.4s ease;
}

.vote-bar:disabled {
  background-color: #a9a9a9;
  /* 禁用狀態按鈕顏色 */
  cursor: not-allowed;
}

.vote-bar:hover:enabled {
  background-color: #0097a7;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 188, 212, 0.4);
}

/* 投票結果顯示區域 */
.result-row {
  display: flex;
  align-items: center;
  width: 100%;
}

.progress-bar-container {
  flex-grow: 1;
  background-color: #e0e0e0;
  border-radius: 30px;
  height: 50px;
  position: relative;
  overflow: hidden;
}

.progress-bar {
  background-color: #00bcd4;
  height: 100%;
  border-radius: 30px;
  transition: width 0.6s ease;
  display: flex;
  align-items: center;
  justify-content: left;
  padding-left: 20px;
  color: white;
  font-weight: bold;
}

.vote-info {
  font-size: 1rem;
}

.option-label {
  font-size: 1.2rem;
  font-weight: bold;
  margin-left: 15px;
  color: #00bcd4;
}

.result .progress-bar {
  animation: expandBar 0.6s ease forwards;
}

@keyframes expandBar {
  0% {
    width: 0;
  }

  100% {
    width: var(--progress-width);
  }
}

/* 讓按鈕的整體過渡更滑順 */
.vote-bar,
.progress-bar {
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}

@media (max-width: 768px) {
  .vote-container {
    padding: 15px;
  }

  .vote-bar,
  .progress-bar {
    font-size: 1rem;
    padding: 12px;
  }

  .option-label {
    font-size: 1rem;
  }
}
</style>

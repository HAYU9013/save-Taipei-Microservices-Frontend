<template>
  <div class="vote-page">
    <h2 class="page-title">活動投票</h2>
    <div v-if="activities.length === 0" class="empty-message">目前沒有可供投票的活動。</div>
    <div v-for="activity in activities" :key="activity.id" class="activity-card"
      :class="{ 'voted': votedActivities[activity.id] }">
      <h3 class="activity-title">{{ activity.name }}</h3>
      <!-- 檢查是否已投票 -->
      <div v-if="!votedActivities[activity.id]">
        <VoteOptions :options="activity.options" :showResults="true"
          @vote="(optionId) => handleVote(activity.id, optionId)" />
      </div>
      <div v-else class="voted-message">
        你已經對此活動投過票了！
        <!-- 禁止再次投票，disabled屬性設為true -->
        <VoteOptions :options="activity.options" :showResults="true" :disabled="true" />
      </div>
      <!-- 顯示投票結果 -->
      <div v-if="activity.showResults || votedActivities[activity.id]" class="result-chart">
        <canvas :id="'chart-' + activity.id"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import VoteOptions from '@/components/VoteOptions.vue';
import { Chart } from 'chart.js';
import axios from 'axios';

export default {
  data() {
    return {
      activities: [],
      votedActivities: {},  // 只在記憶體中儲存投票狀態
    };
  },
  components: {
    VoteOptions
  },
  methods: {
    fetchActivities() {
      axios.get('http://localhost:8081/api/vote/activities')
        .then(response => {
          this.activities = response.data;
        })
        .catch(error => {
          console.error("無法獲取活動數據", error);
        });
    },

    handleVote(activityId, optionId) {
      axios.post('http://localhost:8081/api/vote/submit', { option_id: optionId })
        .then(() => {
          // 投票成功後，將活動 ID 暫時保存在記憶體中
          this.votedActivities[activityId] = true;
          this.fetchActivities();  // 重新獲取活動數據，刷新結果
        })
        .catch(error => {
          console.error("投票失敗", error);
        });
    },

    renderChart(activity) {
      const ctx = document.getElementById(`chart-${activity.id}`);
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: activity.options.map(option => option.name),
          datasets: [{
            data: activity.options.map(option => option.voteCount),
            backgroundColor: ['#4a90e2', '#50e3c2', '#f5a623', '#d0021b'],
          }]
        },
        options: {
          responsive: true,
        }
      });
    }
  },
  watch: {
    activities(newActivities) {
      newActivities.forEach(activity => {
        if (activity.showResults || this.votedActivities[activity.id]) {
          this.$nextTick(() => this.renderChart(activity));
        }
      });
    }
  },
  created() {
    this.fetchActivities();
  }
};
</script>

<style scoped>
.vote-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  background-color: #f8f9fa;
}

.page-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  color: #343a40;
  margin-bottom: 30px;
}

.empty-message {
  text-align: center;
  color: #6c757d;
  font-size: 18px;
  padding: 20px;
}

.activity-card {
  margin-bottom: 30px;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.activity-card.voted {
  background-color: #e9ecef;
  border: 1px solid #ced4da;
}

.activity-title {
  font-size: 1.75rem;
  font-weight: 500;
  color: #495057;
  margin-bottom: 15px;
  text-align: center;
  border-bottom: 2px solid #6c757d;
  padding-bottom: 10px;
}

.result-chart {
  margin-top: 20px;
}

.voted-message {
  text-align: center;
  font-size: 1rem;
  color: #6c757d;
  background-color: #f1f3f5;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
}

.vote-page .activity-card:hover {
  transform: translateY(-5px);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .vote-page {
    padding: 20px;
  }

  .page-title {
    font-size: 1.75rem;
  }

  .activity-title {
    font-size: 1.5rem;
  }
}
</style>

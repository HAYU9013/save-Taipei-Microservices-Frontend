<template>
    <div>
        <!-- Tabs 切換按鈕 -->
        <div class="tabs">
            <button @click="activeTab = 0" :class="{ active: activeTab === 0 }">活動列表</button>
            <button @click="activeTab = 1" :class="{ active: activeTab === 1 }">活動投票</button>
            <button @click="activeTab = 2" :class="{ active: activeTab === 2 }">AI導遊</button>
        </div>

        <!-- 活動列表頁籤 -->
        <div v-if="activeTab === 0" class="activities-list">
            <!-- <h1>活動列表</h1> -->
            <button @click="handleSwitchFollow" class="switch-btn">{{ showFollow ? '顯示未追蹤活動' : '顯示追蹤活動' }}</button>
            <ul v-if="!showFollow" class="unfollow-list">
                <li v-for="activity in unfollowActivities " :key="activity.id" class="activity-item">
                    <h2 class="page-title">活動列表</h2>
                    <div class="activity-content">
                        <!-- 標題 -->
                        <h3 class="activity-title">{{ activity.title }}</h3>
                        <!-- 描述 -->
                        <p class="activity-description">{{ activity.description }}</p>
                        <!-- 地圖 -->
                        <div v-if="activity.location" class="map-container">
                            <iframe width="100%" height="300" frameborder="0" scrolling="no" marginheight="0"
                                marginwidth="0"
                                :src="'https://maps.google.com/maps?width=100%25&amp;height=300&amp;hl=zh-TW&amp;q=' + encodeURIComponent(activity.location) + '&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed'">
                            </iframe>
                        </div>
                        <!-- 地點與時間 -->
                        <div class="activity-details">
                            <!-- 地點 -->
                            <div class="activity-location">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path
                                        d="M12 2C8.13401 2 5 5.13401 5 9C5 13.3137 12 22 12 22C12 22 19 13.3137 19 9C19 5.13401 15.866 2 12 2ZM12 11.5C11.1716 11.5 10.5 10.8284 10.5 10C10.5 9.17157 11.1716 8.5 12 8.5C12.8284 8.5 13.5 9.17157 13.5 10C13.5 10.8284 12.8284 11.5 12 11.5Z" />
                                </svg>
                                <span>{{ activity.location }}</span>
                            </div>
                            <!-- 時間 -->
                            <div class="activity-time">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                <span>{{ new Date(activity.time).toLocaleString() }}</span>
                            </div>
                            <!-- 參與按鈕 -->
                            <button class="join-button" @click="handleFollow(activity.title)">參與</button>
                        </div>
                    </div>
                </li>
            </ul>
            <ul v-if="showFollow" class="follow-list">
                <h2 class="page-title">追蹤列表</h2>
                <li v-for="activity in followActivities" :key="activity.id" class="activity-item">
                    <div class="activity-content">
                        <!-- 標題 -->
                        <h3 class="activity-title">{{ activity.title }}</h3>
                        <!-- 描述 -->
                        <p class="activity-description">{{ activity.description }}</p>
                        <!-- 地圖 -->
                        <div v-if="activity.location" class="map-container">
                            <iframe width="100%" height="300" frameborder="0" scrolling="no" marginheight="0"
                                marginwidth="0"
                                :src="'https://maps.google.com/maps?width=100%25&amp;height=300&amp;hl=zh-TW&amp;q=' + encodeURIComponent(activity.location) + '&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed'">
                            </iframe>
                        </div>
                        <!-- 地點與時間 -->
                        <div class="activity-details">
                            <!-- 地點 -->
                            <div class="activity-location">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path
                                        d="M12 2C8.13401 2 5 5.13401 5 9C5 13.3137 12 22 12 22C12 22 19 13.3137 19 9C19 5.13401 15.866 2 12 2ZM12 11.5C11.1716 11.5 10.5 10.8284 10.5 10C10.5 9.17157 11.1716 8.5 12 8.5C12.8284 8.5 13.5 9.17157 13.5 10C13.5 10.8284 12.8284 11.5 12 11.5Z" />
                                </svg>
                                <span>{{ activity.location }}</span>
                            </div>
                            <!-- 時間 -->
                            <div class="activity-time">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                <span>{{ new Date(activity.time).toLocaleString() }}</span>
                            </div>
                            <!-- 參與按鈕 -->
                            <button class="join-button" @click="handleFollow(activity.title)">取消參與</button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <!-- 活動投票頁籤 -->
        <div v-if="activeTab === 1" class="vote-page">
            <!-- <h2 class="page-title">活動投票</h2> -->
            <div v-if="activities2.length === 0" class="empty-message">目前沒有可供投票的活動。</div>
            <div v-for="activity in activities2" :key="activity.id" class="activity-card"
                :class="{ 'voted': votedActivities[activity.id] }">
                <h3 class="activity-title">{{ activity.name }}</h3>
                <div v-if="!votedActivities[activity.id]">
                </div>
                <div v-else class="voted-message">
                    你已經對此活動投過票了！
                </div>
                <VoteOptions :options="activity.options" :showResults="true"
                    @vote="(optionId) => handleVote(activity.id, optionId)" />
            </div>
        </div>

        <div v-if="activeTab === 2" class="vote-page">

        </div>
    </div>
    <div class="floating-button" @click="handleFloatingButtonClick">+</div>


</template>

<script>
import VoteOptions from '@/components/VoteOptions.vue';
import { Chart } from 'chart.js';
import axios from 'axios';
import { handleError } from 'vue';

export default {
    components: {
        VoteOptions
    },
    data() {
        return {
            allActivities: [],
            unfollowActivities: [],
            followActivities: [],
            activities2: [],
            votedActivities: {},
            activeTab: 0,
            showFollow: false
        };
    },
    methods: {
        handleFloatingButtonClick() {
            if (this.activeTab === 0) {
                // 當前tab是活動列表，跳轉到 "/"
                this.$router.push('/');
            } else if (this.activeTab === 1) {
                // 當前tab是活動投票，跳轉到 "/create-activity"
                this.$router.push('/create-activity');
            }
        },
        fetchActivities() {
            fetch('https://taipei-microservices-initiative-haskson.onrender.com/api/activitys/all')
                .then(response => response.json())
                .then(data => {
                    this.allActivities = data;
                })
                .catch(error => {
                    console.error('Error fetching activities:', error);
                });
        },

        fetchUnfollowActivities() {
            fetch('https://taipei-microservices-initiative-haskson.onrender.com/api/users/unfollow/1')
                .then(response => response.json())
                .then(data => {
                    this.unfollowActivities = data;
                })
                .catch(error => {
                    console.error('Error fetching unfollow activities:', error);
                });
        },

        fetchFollowActivities() {
            fetch('https://taipei-microservices-initiative-haskson.onrender.com/api/users/follow/1')
                .then(response => response.json())
                .then(data => {
                    this.followActivities = data;
                })
                .catch(error => {
                    console.error('Error fetching follow activities:', error);
                });
        },

        fetchActivities2() {
            axios.get('https://taipei-microservices-initiative-haskson.onrender.com/api/vote/activities')
                .then(response => {
                    this.activities2 = response.data;
                })
                .catch(error => {
                    console.error("無法獲取活動數據", error);
                });
        },

        handleVote(activityId, optionId) {
            axios.post('https://taipei-microservices-initiative-haskson.onrender.com/api/vote/submit', { option_id: optionId })
                .then(() => {
                    this.votedActivities[activityId] = true;
                    this.fetchActivities2();
                })
                .catch(error => {
                    console.error('投票失敗', error);
                });
        },

        handleSwitchFollow() {
            this.showFollow = !this.showFollow;
        },

        handleFollow(activityTitle) {
            axios.post(`https://taipei-microservices-initiative-haskson.onrender.com/api/users/follow/${activityTitle}`)
                .then(() => {
                    this.fetchUnfollowActivities();
                    this.fetchFollowActivities();
                })
                .catch(error => {
                    console.error('追蹤活動失敗', error);
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
                        backgroundColor: ['#00bcd4', '#50e3c2', '#f5a623', '#d0021b'],
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
        this.fetchUnfollowActivities();
        this.fetchFollowActivities();
        this.fetchActivities2();
    }
};
</script>

<style scoped>
/* 主色調：#00bcd4 */
:root {
    --primary-color: #00bcd4;
    --secondary-color: #6c757d;
    --background-color: #f8f9fa;
}

/* 活動列表樣式 */
.activities-list {
    max-width: 100%;
    margin: 20px auto;
    padding: 15px;
    background: #ffffff;
    border-radius: 12px;

}

.activity-item {
    margin-bottom: 20px;
    padding: 20px;
    background-color: var(--background-color);
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.10);
}

.activity-content {
    display: flex;
    flex-direction: column;
}

.activity-title {
    font-size: 2rem !important;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 10px;
    text-align: left;
}

.activity-description {
    font-size: 1rem;
    color: var(--secondary-color);
    margin-bottom: 15px;
    text-align: left;
}

/* 地點與時間 */
.activity-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
}

.activity-location,
.activity-time {
    display: flex;
    align-items: center;
    color: var(--secondary-color);
}

.activity-location svg,
.activity-time svg {
    margin-right: 8px;
}

.join-button {
    background-color: #00bcd4;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.join-button:hover {
    background-color: #85e3ed;
}

/* Tabs 樣式 */
.tabs {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    position: relative;
    border-bottom: 1px solid #e0e0e0;
}

.tabs button {
    background: none;
    border: none;
    padding: 10px 20px;
    font-size: 1.2rem;
    cursor: pointer;
    color: #6c757d;
    /* 默認灰色 */
    position: relative;
    font-weight: 400;
    transition: color 0.3s, font-weight 0.3s;
}

.tabs button.active {
    color: #00bcd4;
    /* 當前選中的字體顏色 */
    font-weight: 600;
    /* 當前選中的字體加粗 */
}

.tabs button.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10%;
    width: 80%;
    height: 2px;
    background-color: #00bcd4;
    /* 底線顏色 */
    transition: width 0.3s ease-in-out;
}

/* Tab 內容區域 */
.tab-content {
    padding: 20px;
}


/* 響應式設計 */
@media (max-width: 768px) {

    .activities-list,
    .vote-page {
        padding: 10px;
    }

    .activity-header h3 {
        font-size: 1rem;
    }

    .activity-title {
        font-size: 1.3rem;
    }

    .page-title {
        font-size: 1.5rem;
    }

    .tabs button {
        font-size: 1rem;
    }
}

/* 響應式設計 */
@media (max-width: 768px) {
    .activity-item {
        padding: 15px;
    }

    .activity-title {
        font-size: 1.3rem;
    }

    .activity-description {
        font-size: 0.9rem;
    }

    .join-button {
        padding: 8px 16px;
        font-size: 0.9rem;
    }
}

.map-container {
    margin-top: 15px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.);
}

.floating-button {
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 60px;
    height: 60px;
    background-color: #00bcd4;
    border-radius: 50%;
    color: white;
    font-size: 2rem;
    text-align: center;
    line-height: 60px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: transform 0.3s ease, background-color 0.3s ease;
    animation: float 3s ease-in-out infinite;
}

.floating-button:hover {
    background-color: #0097a7;
    transform: translateY(-5px);
}

.switch-btn {
    background-color: #00bcd4;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
}

@keyframes float {
    0% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }

    100% {
        transform: translateY(0);
    }
}
</style>

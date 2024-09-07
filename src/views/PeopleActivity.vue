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
                            <div class="activity-location">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path
                                        d="M12 2C8.13401 2 5 5.13401 5 9C5 13.3137 12 22 12 22C12 22 19 13.3137 19 9C19 5.13401 15.866 2 12 2ZM12 11.5C11.1716 11.5 10.5 10.8284 10.5 10C10.5 9.17157 11.1716 8.5 12 8.5C12.8284 8.5 13.5 9.17157 13.5 10C13.5 10.8284 12.8284 11.5 12 11.5Z" />
                                </svg>
                                <span>{{ activity.location }}</span>
                            </div>
                            <div class="activity-time">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                <span>{{ new Date(activity.time).toLocaleString() }}</span>
                            </div>
                            <button class="join-button" @click="handleFollow(activity.title)">參與</button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <!-- 活動投票頁籤 -->
        <div v-if="activeTab === 1" class="vote-page">
            <div v-if="activities2.length === 0" class="empty-message">目前沒有可供投票的活動。</div>
            <div v-for="activity in activities2" :key="activity.id" class="activity-card"
                :class="{ 'voted': votedActivities[activity.id] }">
                <h3 class="activity-title">{{ activity.name }}</h3>
                <VoteOptions :options="activity.options" :showResults="true"
                    @vote="(optionId) => handleVote(activity.id, optionId)" />
            </div>
        </div>

        <!-- AI導遊頁籤 -->
        <div v-if="activeTab === 2" class="ai-tour-guide">
            <h1 class="title">旅遊行程安排</h1>
            <form @submit.prevent="submitItinerary" class="form-container">
                <input type="text" v-model="form.location" placeholder="輸入地點" required />
                <input type="text" v-model="form.description" placeholder="輸入行程描述" required />
                <button type="submit" class="submit-btn">送出行程</button>
            </form>

            <div v-if="recommendedLocations.length > 0" class="map-container">
                <div v-for="(location, index) in recommendedLocations" :key="index" class="location-item">
                    <iframe width="100%" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
                        :src="'https://maps.google.com/maps?width=100%25&amp;height=300&amp;hl=zh-TW&amp;q=' + encodeURIComponent(location) + '&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed&disableDefaultUI=true&zoomControl=false&mapTypeControl=false&scaleControl=false&streetViewControl=false'"
                        allowfullscreen aria-hidden="false" tabindex="0">
                    </iframe>
                </div>
            </div>

            <div v-if="mes" class="response-card">
                <div class="response-card-header">AI 回應結果</div>
                <div class="response-card-content" v-html="parseMarkdown(mes)"></div>
            </div>
        </div>
    </div>

    <div class="floating-button" @click="handleFloatingButtonClick">+</div>
</template>

<script>
import VoteOptions from '@/components/VoteOptions.vue';
import axios from 'axios';
import OpenAI from "openai";
import { marked } from "marked";
let kkk = "c2stcHJvai1jS2M0c3NFNkpPQWFycFN4QnFQYmxfMmtOdXBxbXJId05abUppdVRtdm84ZjJrR2ZONW1fX2hFOWdJVDNCbGJrRkpRekpTd2hGRkJuUGFqNVlHazBwd1BNdmdvb0lKeXQyMVd3cmZMNUR6aDU5VXV4VmxLRmNjZmdwZGNB";
const decodedStr = atob(kkk);

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
            showFollow: false,
            form: {
                location: '',
                description: ''
            },
            recommendedLocations: [],
            mes: null
        };
    },
    methods: {
        handleFloatingButtonClick() {
            if (this.activeTab === 0) {
                this.$router.push('/home');
            } else if (this.activeTab === 1) {
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
        async submitItinerary() {
            const input = `地點: ${this.form.location}, 行程描述: ${this.form.description}，請根據這些資訊返回幾個旅遊地點，並以逗號分隔。`;

            try {
                // Always call Gemini API regardless of the location
                const response = await fetch(
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=AIzaSyAsrQ5ObzfFJfGjwAIaMcRxp4gW-PMiELg",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: input }] }],
                        }),
                    }
                );

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                const geminiResponse = data.candidates[0].content.parts[0].text;

                // Split the response into recommended locations
                let recommendedLocations = geminiResponse.split(",");

                // If the location is "大安區", override the locations with fixed tourist spots
                if (this.form.location.trim() === "大安區") {
                    this.recommendedLocations = ["大安森林公園 大安區", "福州山公園 大安區", "永康街 大安區"];
                } else {
                    this.recommendedLocations = recommendedLocations;
                }

                // Proceed to the OpenAI API call for follow-up
                const openai = new OpenAI({ apiKey: decodedStr, dangerouslyAllowBrowser: true });
                const thread = await openai.beta.threads.create();
                const message = await openai.beta.threads.messages.create(thread.id, {
                    role: "user",
                    content: this.recommendedLocations.join(", "),
                });

                let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
                    assistant_id: "asst_8GkyxwRkgLuvSkUcvhkFIFKT",
                    instructions:
                        "Please address the user as Jane Doe. The user has a premium account.",
                });

                if (run.status === "completed") {
                    const messages = await openai.beta.threads.messages.list(run.thread_id);
                    for (const message of messages.data.reverse()) {
                        console.log(`${message.role} > ${message.content[0].text.value}`);
                        this.mes = message.content[0].text.value;
                    }
                } else {
                    console.log(run.status);
                }

            } catch (error) {
                console.error("Error submitting itinerary:", error);
            }
        },

        parseMarkdown(content) {
            return marked(content);
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
    font-size: 1.1rem;
    cursor: pointer;
    color: #6c757d;
}

.tabs button.active {
    color: #00bcd4;
    font-weight: 600;
}

.tabs button.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10%;
    width: 80%;
    height: 2px;
    background-color: #00bcd4;
    transition: width 0.3s ease-in-out;
}

.map-container {
    margin-top: 15px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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

.form-container {
    display: flex;
    flex-direction: column;
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

.response-card {
    margin: 2em auto;
    padding: 1.5em;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    width: 90%;
    max-width: 800px;
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
}
</style>

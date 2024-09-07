<template>
    <div class="report-manage">
        <h1>報告列表</h1>
        <div class="report-list">

            <li v-for="report in reports" :key="report.id" class="report-item">
                <span class="report-item-header">
                    <h3>{{ report.title }}</h3>
                    <p class="report-type">{{ report.type }}</p>
                    <p class="report-description">{{ report.description }}</p>
                    <p class="report-time">提交時間：{{ new Date(report.time).toLocaleString() }}</p>
                    <p class="report-id">ID: {{ report.id }}</p>
                    <button class="dlelete-btn" @click="deleteReport(report.id)">刪除</button>
                </span>
            </li>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ReportManage',
    data() {
        return {
            reports: []
        };
    },
    created() {
        this.fetchReports();
    },
    methods: {
        fetchReports() {
            fetch('http://localhost:8081/api/report/all')
                .then(response => response.json())
                .then(data => {
                    this.reports = data;
                })
                .catch(error => {
                    console.error('Error fetching reports:', error);
                });
        },
        deleteReport(id) {
            fetch(`http://localhost:8081/api/report/${id}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Report deleted:', data);
                    this.fetchReports();
                })
                .catch(error => {
                    console.error('Error deleting report:', error);
                    alert('刪除報告過程中出現錯誤！');
                });
        }
    }
}

</script>

<style scoped>
.report-manage {
    max-width: 900px;
    margin: 40px auto;
    padding: 30px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.report-manage h1 {
    text-align: center;
    font-size: 2rem;
    color: #333;
    margin-bottom: 30px;
    font-weight: 600;
}

.report-list {
    list-style-type: none;
    /* 去除列表點 */
    padding: 0;
    margin: 0;
}

.report-item {
    background: #f9f9f9;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease, box-shadow 0.3s ease;
}

.report-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.report-item-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.report-type {
    font-size: 0.9rem;
    color: #666;
    font-weight: bold;
}

.report-description {
    font-size: 1rem;
    margin: 15px 0;
    color: #555;
}

.report-time {
    font-size: 0.8rem;
    color: #999;
    margin-bottom: 10px;
}

.report-id {
    font-size: 0.8rem;
    color: #888;
    margin-top: 5px;
}

.delete-btn {
    padding: 8px 15px;
    background-color: #ff4d4f;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.delete-btn:hover {
    background-color: #d9363e;
    transform: translateY(-2px);
}

.delete-btn:active {
    background-color: #b32628;
    transform: translateY(0);
}

/* 響應式設計 */
@media (max-width: 768px) {
    .report-manage {
        padding: 20px;
    }

    .report-item {
        padding: 15px;
    }

    .delete-btn {
        font-size: 0.8rem;
        padding: 6px 12px;
    }
}
</style>

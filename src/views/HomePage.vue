<template>
    <div class="home">
        <div class="top-bar">
            <button class="back-button" @click="$router.go(-1)">&lt;</button>
            <h2 class="page-title">發起活動</h2>
        </div>
        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="title">活動標題:</label>
                <input id="title" v-model="form.title" type="text" required>
            </div>
            <div class="form-group">
                <label for="description">活動內容:</label>
                <textarea id="description" v-model="form.description" required></textarea>
            </div>
            <div class="form-group">
                <label for="location">活動地點:</label>
                <input id="location" v-model="form.location" type="text" required>
                <!-- 地點有文字时顯示地圖 -->
                <div v-if="form.location" class="map-container">
                    <iframe width="100%" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
                        :src="'https://maps.google.com/maps?width=100%25&amp;height=300&amp;hl=zh-TW&amp;q=' + encodeURIComponent(form.location) + '&t=&z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed'"
                        allowfullscreen aria-hidden="false" tabindex="0"></iframe>
                </div>
            </div>
            <div class="form-group">
                <label for="time">活動時段:</label>
                <input id="time" v-model="form.time" type="datetime-local" required>
            </div>
            <div class="form-group">
                <label for="image">活動圖片:</label>
                <input id="image" @change="onFileChange" type="file" required>
            </div>
            <button type="submit" class="submit-btn">提交活動</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'HomePage',
    data() {
        return {
            form: {
                title: '',
                description: '',
                location: '',
                time: '',
                image: null
            }
        };
    },
    methods: {
        onFileChange(e) {
            this.form.image = e.target.files[0];
        },
        submitForm() {
            let formData = new FormData();
            formData.append('image', this.form.image);

            fetch('https://taipei-microservices-initiative-haskson.onrender.com/api/upload/image', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    this.submitEventDetails(data.path);
                })
                .catch(error => {
                    console.error('Error uploading image:', error);
                    alert('圖片上傳過程中出現錯誤！');
                });
        },
        submitEventDetails(imageUrl) {
            let formattedTime = new Date(this.form.time).toISOString();

            let detailsData = {
                title: this.form.title,
                description: this.form.description,
                location: this.form.location,
                time: formattedTime,
                image_url: imageUrl
            };

            fetch('https://taipei-microservices-initiative-haskson.onrender.com/api/activitys/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(detailsData),
            })
                .then(response => response.json())
                .then(() => {
                    alert('活動成功提交！');
                    this.resetForm();
                })
                .catch(error => {
                    console.error('Error submitting activity:', error);
                    alert('活動提交過程中出現錯誤！');
                });
        },
        resetForm() {
            this.form = {
                title: '',
                description: '',
                location: '',
                time: '',
                image: null
            };
        }
    }
}
</script>

<style scoped>
/* Top Bar */
.top-bar {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    color: #00bcd4;
    padding: 15px;
    border-bottom: 1px solid #e0e0e0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
}

.back-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #00bcd4;
    cursor: pointer;
    margin-right: 15px;
}

.page-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #00bcd4;
    margin: 0 auto;
    position: relative;
}

.page-title::after {
    content: '';
    display: block;
    width: 50%;
    height: 2px;
    background-color: #00bcd4;
    margin: 5px auto 0;
}

/* Form Styling */
.home {
    max-width: 700px;
    margin: 40px auto;
    padding: 30px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 20px;
}

label {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    display: block;
    margin-bottom: 8px;
}

input,
textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
    background: #fafafa;
}

input:focus,
textarea:focus {
    border-color: #00bcd4;
    background: #fff;
    outline: none;
}

textarea {
    height: 120px;
}

.map-container {
    width: 100%;
    margin-top: 15px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

/* Submit Button */
.submit-btn {
    display: block;
    width: 100%;
    padding: 15px;
    background-color: #00bcd4;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1.25rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    text-align: center;
}

.submit-btn:hover {
    background-color: #0097a7;
    transform: translateY(-2px);
}

.submit-btn:active {
    background-color: #007bff;
}

/* Responsive Design */
@media (max-width: 768px) {
    .home {
        padding: 20px;
    }

    .submit-btn {
        font-size: 1rem;
        padding: 12px;
    }
}
</style>

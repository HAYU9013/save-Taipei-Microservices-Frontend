<template>
  <div class="create-activity">
    <div class="top-bar">
      <button class="back-button" @click="$router.go(-1)">&lt;</button>
      <h2 class="page-title">活動列表</h2>
    </div>
    <form @submit.prevent="submitActivity" class="activity-form">
      <div class="form-group">
        <label for="activity-name">活動名稱：</label>
        <input type="text" id="activity-name" v-model="activityName" placeholder="請輸入活動名稱" required />
      </div>
      <div class="form-group">
        <label>選項：</label>
        <div v-for="(option, index) in options" :key="index" class="option-group">
          <input type="text" v-model="options[index].label" placeholder="輸入選項名稱" required />
          <button type="button" @click="removeOption(index)" class="btn-remove">移除</button>
        </div>
        <button type="button" @click="addOption" class="btn-add-option">新增選項</button>
      </div>
      <button type="submit" class="btn-submit">提交活動</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activityName: '', // 活動名稱
      options: [{ label: '' }], // 活動的選項
      successMessage: '', // 成功訊息
    };
  },
  methods: {
    addOption() {
      this.options.push({ label: '' });
    },
    removeOption(index) {
      this.options.splice(index, 1);
    },
    submitActivity() {
      const payload = {
        name: this.activityName,
        options: this.options.map(option => ({ label: option.label }))
      };

      fetch('https://taipei-microservices-initiative-haskson.onrender.com/api/vote/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          alert(data.message);
          this.activityName = '';
          this.options = [{ label: '' }];
        })
        .catch(error => {
          alert('新增活動發生錯誤，內容可能包含不宜內容');
          console.error('新增活動發生錯誤', error);
        });
    }
  }
};
</script>

<style scoped>
/* Top Bar */
.top-bar {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  color: #00bcd4;
  padding: 15px 10px;
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

.back-button:hover {
  color: #0097a7;
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

/* Create Activity Form Styling */
.create-activity {
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
  display: block;
  margin-bottom: 8px;
}

input[type="text"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 1rem;
  color: #495057;
  background: #fafafa;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus {
  border-color: #00bcd4;
  background: #fff;
  outline: none;
}

.option-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.btn-remove {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.btn-remove:hover {
  background-color: #c82333;
}

.btn-remove:active {
  transform: translateY(1px);
}

.btn-add-option {
  background-color: #00bcd4;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.btn-add-option:hover {
  background-color: #0097a7;
}

.btn-submit {
  background-color: #00bcd4;
  color: white;
  padding: 12px 15px;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin-top: 20px;
}

.btn-submit:hover {
  background-color: #0097a7;
}

.btn-submit:active {
  background-color: #007bff;
  transform: translateY(1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .create-activity {
    padding: 20px;
  }

  input[type="text"] {
    padding: 10px;
    font-size: 0.95rem;
  }

  .btn-add-option,
  .btn-submit {
    padding: 10px;
    font-size: 1rem;
  }
}
</style>

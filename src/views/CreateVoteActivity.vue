<template>
  <div class="create-activity">
    <h2>新增活動</h2>
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
    <!--p v-if="successMessage" class="success">{{ successMessage }}</p!-->
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
    // 新增選項
    addOption() {
      this.options.push({ label: '' });
    },
    // 移除選項
    removeOption(index) {
      this.options.splice(index, 1);
    },
    // 提交活動
    submitActivity() {
      const payload = {
        name: this.activityName,
        options: this.options.map(option => ({ label: option.label }))
      };

      fetch('http://localhost:8081/api/vote/create', {
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
          alert(data.message)
          this.activityName = '';
          this.options = [{ label: '' }];
        })
        .catch(error => {
          alert("新增活動發生錯誤，內容可能包含不宜內容")
          console.error("新增活動發生錯誤", error);
        });
    }
  }
};
</script>

<style scoped>
.create-activity {
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #343a40;
  font-size: 2rem;
  font-weight: 600;
}

.activity-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: 600;
  margin-bottom: 10px;
  color: #495057;
}

input[type="text"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 1rem;
  color: #495057;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus {
  border-color: #007bff;
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
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.btn-add-option:hover {
  background-color: #0056b3;
}

.btn-submit {
  background-color: #28a745;
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
  background-color: #218838;
}

.btn-submit:active {
  background-color: #1e7e34;
  transform: translateY(1px);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .create-activity {
    padding: 20px;
  }

  h2 {
    font-size: 1.75rem;
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
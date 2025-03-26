<template>
  <div class="discussion-container">
    <el-card shadow="hover">
      <h2 class="title">{{ caseName }} 课程讨论</h2>

      <el-collapse v-model="activeNames" accordion>
        <el-collapse-item title="讨论话题 1" name="1">
          <div class="comment-list">
            <div v-for="(comment, index) in comments" :key="index" class="comment">
              <el-avatar :src="comment.avatar" size="small"></el-avatar>
              <div class="comment-content">
                <span class="comment-user">{{ comment.user }}</span>
                <span class="comment-time">{{ comment.time }}</span>
                <p class="comment-text">{{ comment.text }}</p>
              </div>
            </div>
          </div>

          <el-divider />

          <!-- 新评论输入 -->
          <div class="input-area">
            <el-input v-model="newComment" placeholder="写下你的评论..." class="comment-input" />
            <el-button @click="sendComment" type="primary" class="send-button">发送</el-button>
          </div>
        </el-collapse-item>

        <el-collapse-item title="讨论话题 2" name="2">
          <div class="comment">
            <el-avatar src="https://randomuser.me/api/portraits/men/4.jpg" size="small"></el-avatar>
            <div class="comment-content">
              <span class="comment-user">用户D</span>
              <span class="comment-time">2024-02-18 14:30</span>
              <p class="comment-text">这个项目的技术实现看起来有些挑战，大家怎么看？</p>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useCaseStore } from '@/store/case';
import { onMounted, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';

const caseStore = useCaseStore();
onMounted(async () => {
  await caseStore.fetchCases();
});

const props = defineProps<{ id?: string }>();

const caseName = computed(() => caseStore.cases[parseInt(props.id || '1') - 1]?.name || '未知课程');
const activeNames = ref<string[]>([]);
const newComment = ref<string>('');
const comments = ref([
  { user: '用户A', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', text: '这个案例的设计思路非常清晰，大家觉得呢？', time: '2024-02-18 14:20' },
  { user: '用户B', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', text: '是的，特别是第一部分的分析，真的很到位。', time: '2024-02-18 14:25' },
  { user: '用户C', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', text: '我也有类似的想法，尤其是在数据分析方面很有启发。', time: '2024-02-18 14:28' }
]);

const sendComment = () => {
  if (newComment.value.trim()) {
    comments.value.push({
      user: '我',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      text: newComment.value,
      time: new Date().toLocaleString()
    });
    ElMessage.success('评论已发送');
    newComment.value = ''; // 清空输入框
  }
};
</script>

<style scoped>
.discussion-container {
  max-width: 800px;
  margin: auto;
}

.title {
  text-align: center;
  margin-bottom: 15px;
  font-weight: bold;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comment {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  background: #f6f6f6;
  border-radius: 8px;
  transition: background 0.3s;
}

.comment:hover {
  background: #eaeaea;
}

.comment-content {
  display: flex;
  flex-direction: column;
}

.comment-user {
  font-weight: bold;
  margin-bottom: 3px;
}

.comment-time {
  font-size: 12px;
  color: #888;
  margin-bottom: 5px;
}

.comment-text {
  margin: 0;
  font-size: 14px;
}

.input-area {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.comment-input {
  flex: 1;
}

.send-button {
  white-space: nowrap;
}
</style>

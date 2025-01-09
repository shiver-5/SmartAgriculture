<template>
    <div>
      <h2>{{ caseName }} 案例谈论</h2>
      <br/>

      <el-collapse v-model="activeNames" accordion>
        <el-collapse-item title="讨论话题 1" name="1">
          <div class="comment">
            <el-avatar src="https://randomuser.me/api/portraits/men/1.jpg" size="small"></el-avatar>
            <span class="comment-user">用户A：</span>
            <p>这个案例的设计思路非常清晰，大家觉得呢？</p>
          </div>
          <el-collapse>
            <el-collapse-item title="回复 1" name="1-1">
              <div class="comment">
                <el-avatar src="https://randomuser.me/api/portraits/men/2.jpg" size="small"></el-avatar>
                <span class="comment-user">用户B：</span>
                <p>是的，特别是第一部分的分析，真的很到位。</p>
              </div>
            </el-collapse-item>
            <el-collapse-item title="回复 2" name="1-2">
              <div class="comment">
                <el-avatar src="https://randomuser.me/api/portraits/men/3.jpg" size="small"></el-avatar>
                <span class="comment-user">用户C：</span>
                <p>我也有类似的想法，尤其是在数据分析方面很有启发。</p>
              </div>
            </el-collapse-item>
          </el-collapse>
  
          <el-input v-model="newComment" placeholder="写下你的评论..." class="comment-input" />
          <el-button @click="sendComment" type="primary" class="send-button">发送</el-button>
        </el-collapse-item>

        <el-collapse-item title="讨论话题 2" name="2">
          <div class="comment">
            <el-avatar src="https://randomuser.me/api/portraits/men/4.jpg" size="small"></el-avatar>
            <span class="comment-user">用户D：</span>
            <p>这个项目的技术实现看起来有些挑战，大家怎么看？</p>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useCaseStore } from '@/store/case';
  import { onMounted, ref } from 'vue';
  
  const caseStore = useCaseStore();

  onMounted(async () => {
    await caseStore.fetchCases();
  });
  
  const props = defineProps<{
    id?: string;
  }>();
  
  const caseName = caseStore.cases[parseInt(props.id) - 1].name;

  const activeNames = ref<string[]>([]);

  const newComment = ref<string>('');

  const sendComment = () => {
    if (newComment.value) {
      console.log('发送评论:', newComment.value);
      newComment.value = ''; // 清空输入框
    }
  };
  </script>
  
  <style scoped>
  .comment {
    margin: 10px 0;
    display: flex;
    align-items: center;
  }
  
  .comment-user {
    font-weight: bold;
    margin-left: 5px;
  }
  
  .comment-input {
    width: 100%;
    margin-top: 10px;
  }
  
  .send-button {
    margin-top: 10px;
  }
  </style>
  
<template>
  <div>
    <el-row :gutter="20" class="mgb20">
      <el-col :span="6">
        <el-card shadow="hover" body-class="card-body">
          <el-icon class="card-icon bg3">
            <School />
          </el-icon>
          <div class="card-content">
            <countup class="card-num color3" :end="500" />
            <div>课程使用量</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" body-class="card-body">
          <el-icon class="card-icon bg2">
            <User />
          </el-icon>
          <div class="card-content">
            <countup class="card-num color2" :end="300" />
            <div>活跃用户量</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card shadow="hover" :body-style="{ height: '400px' }">
          <div class="card-header">
            <p class="card-header-title">用户活跃度分析</p>
            <p class="card-header-desc">最近一个月的用户活跃度统计</p>
          </div>
          <v-chart class="chart" :option="activityStats" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" :body-style="{ height: '400px'}">
          <div class="card-header">
            <p class="card-header-title">热门课程排行榜</p>
            <p class="card-header-desc">使用最频繁的课程Top5</p>
          </div>
          <div>
            <div class="rank-item" v-for="(rank, index) in ranks" :key="index">
              <div class="rank-item-avatar">{{ index + 1 }}</div>
              <div class="rank-item-content">
                <div class="rank-item-top">
                  <div class="rank-item-title">{{ rank.name }}</div>
                  <div class="rank-item-desc">主题：{{ rank.theme }}</div>
                </div>
                <el-progress :show-text="false" striped :stroke-width="10" :percentage="rank.percent"
                  :color="rank.color" />
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="dashboard">
import countup from '@/components/countup.vue';
import { use, registerMap } from 'echarts/core';
import { BarChart, LineChart, PieChart, MapChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';
import chinaMap from '@/utils/china';
import { ref } from 'vue';
import { School } from '@element-plus/icons-vue';
use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  LineChart,
  PieChart,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  MapChart,
]);
registerMap('china', chinaMap);

const ranks = [
  {
    name: '计算机编程基础',
    theme: '信息技术',
    percent: 80,
    color: '#f25e43',
  },
  {
    name: '农业大数据与智能分析',
    theme: '农业与人工智能',
    percent: 70,
    color: '#00bcd4',
  },
  {
    name: '智慧灌溉系统',
    theme: '农业物联网',
    percent: 60,
    color: '#64d572',
  },
  {
    name: '数据库原理',
    theme: '信息技术',
    percent: 55,
    color: '#e9a745',
  },
  {
    name: '农业信息技术融合',
    theme: '信息技术与农业',
    percent: 50,
    color: '#009688',
  },
];

const activityStats = ref({
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line', // 修改为折线图
      smooth: true, // 设置平滑曲线
      color: '#2d8cf0',
    },
  ],
});
</script>

<style>
.card-body {
  display: flex;
  align-items: center;
  height: 100px;
  padding: 0;
}
</style>
<style scoped>
.card-content {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
  padding: 0 20px;
}

.card-num {
  font-size: 30px;
}

.card-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.bg1 {
  background: #2d8cf0;
}

.bg2 {
  background: #64d572;
}

.bg3 {
  background: #f25e43;
}

.bg4 {
  background: #e9a745;
}

.color1 {
  color: #2d8cf0;
}

.color2 {
  color: #64d572;
}

.color3 {
  color: #ec2e0c;
}

.color4 {
  color: #e9a745;
}

.chart {
  width: 100%;
  height: 500px;
}

.card-header {
  padding-left: 10px;
  margin-bottom: 20px;
}

.card-header-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.card-header-desc {
  font-size: 14px;
  color: #999;
}

.timeline-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  color: #000;
}

.timeline-time,
.timeline-desc {
  font-size: 12px;
  color: #787878;
}

.rank-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.rank-item-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f2f2f2;
  text-align: center;
  line-height: 40px;
  margin-right: 10px;
}

.rank-item-content {
  flex: 1;
}

.rank-item-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #343434;
  margin-bottom: 10px;
}

.rank-item-desc {
  font-size: 14px;
  color: #999;
}

.map-chart {
  width: 100%;
  height: 350px;
}
</style>

<template>
    <div class="page-container">
      <div class="header">
        <h1 class="title">{{ caseName }}</h1>
        <h2 class="average">平均分：{{ caseAverage }}</h2>
      </div>
      <!-- ECharts 容器 -->
      <div class="chart-container" ref="chartRef"></div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useCaseStore } from '@/store/case';
  import * as echarts from 'echarts';
  
  const route = useRoute();
  const caseStore = useCaseStore();
  const caseId = ref(route.params.id as string);
  
  onMounted(async () => {
    await caseStore.fetchCases();
    initChart();
  });
  
  // 从 store 中获取详情数据
  const caseDetail = caseStore.cases[parseInt(caseId.value) - 1];
  const caseName = caseDetail.name;
  const caseAverage = caseDetail.averageScore;
  
  // ECharts 容器 DOM 引用
  const chartRef = ref<HTMLDivElement | null>(null);
  
  /**
   * 初始化直方图
   */
  function initChart() {
    if (!chartRef.value) return;
    const myChart = echarts.init(chartRef.value);
  
    // 根据 caseId % 3 选择样本类型（0、1、2 三种）
    const sampleType = parseInt(caseId.value) % 3;
    // 生成 200 个样本数据（分数）
    const scores = generateScores(sampleType, 200);
    // 根据分数数据计算直方图（分10个区间）
    const histogram = computeHistogram(scores);
    // 生成 x 轴的区间标签，如 "0-10", "10-20", …, "90-100"
    const categories = generateCategories();
  
    const option = {
      title: {
        text: '成绩分布直方图',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: categories,
        name: '分数区间',
        axisLabel: {
          color: '#333'
        },
        axisLine: {
          lineStyle: {
            color: '#ccc'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '数量',
        axisLabel: {
          color: '#333'
        },
        axisLine: {
          lineStyle: {
            color: '#ccc'
          }
        }
      },
      series: [{
        type: 'bar',
        data: histogram,
        barWidth: '60%',
        itemStyle: {
          color: '#409EFF'
        }
      }]
    };
  
    myChart.setOption(option);
  }
  
  /**
   * 根据样本类型生成成绩数据
   * @param sampleType 样本类型：0 - 正态分布，1 - 均匀分布，2 - 双峰分布
   * @param count 数据点数量
   * @returns 分数数组，每个分数在 0 到 100 之间
   */
  function generateScores(sampleType: number, count: number): number[] {
    const scores: number[] = [];
    for (let i = 0; i < count; i++) {
      let score: number;
      if (sampleType === 0) {
        // 样本 0：正态分布（均值 75，标准差 10），自然会有部分分数低于 60
        score = randomNormal(75, 10);
      } else if (sampleType === 1) {
        // 样本 1：均匀分布，在 50 到 90 之间随机生成，允许出现低于 60 的情况
        score = Math.random() * 40 + 50;
      } else {
        // 样本 2：双峰分布，50% 在 65 附近，50% 在 85 附近（标准差为 5）
        score = Math.random() < 0.5 
                ? randomNormal(65, 5) 
                : randomNormal(85, 5);
      }
      // 保证分数在 0 到 100 之间
      score = Math.max(0, Math.min(100, score));
      scores.push(score);
    }
    return scores;
  }
  
  /**
   * 根据分数数据计算直方图
   * 将分数按 0~10、10~20、...、90~100 分为 10 个区间
   * @param scores 分数数组
   * @returns 每个区间内的数量数组
   */
  function computeHistogram(scores: number[]): number[] {
    const bins = new Array(10).fill(0);
    for (const score of scores) {
      let index = Math.floor(score / 10);
      if (index >= 10) index = 9;
      bins[index]++;
    }
    return bins;
  }
  
  /**
   * 生成 x 轴的区间标签数组，如 ["0-10", "10-20", …, "90-100"]
   */
  function generateCategories(): string[] {
    const categories: string[] = [];
    for (let i = 0; i < 10; i++) {
      const start = i * 10;
      const end = start + 10;
      categories.push(`${start}-${end}`);
    }
    return categories;
  }
  
  /**
   * 使用 Box-Muller 算法生成符合正态分布的随机数
   * @param mean 均值
   * @param stdDev 标准差
   * @returns 一个正态分布的随机数
   */
  function randomNormal(mean: number, stdDev: number): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return num * stdDev + mean;
  }
  </script>
  
  <style scoped>
  /* 页面整体容器 */
  .page-container {
    max-width: 800px;
    margin: 40px auto;
    padding: 30px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  
  /* 标题部分 */
  .header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .title {
    font-size: 2em;
    color: #333;
    margin-bottom: 10px;
  }
  
  .average {
    font-size: 1.2em;
    color: #666;
  }
  
  /* 图表容器 */
  .chart-container {
    width: 100%;
    height: 400px;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
  }
  </style>
  
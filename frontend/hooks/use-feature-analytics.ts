import { useState, useEffect } from "react";

export interface FeatureUsageStats {
  totalEffort: number;
  completionRate: number;
  businessValue: number;
  activeItems: number;
  effortTrend: "up" | "down" | "stable";
  effortChange: number;
  valueTrend: "up" | "down" | "stable";
  roi: number;
  engagementScore: number;
  distributionData: Array<{
    name: string;
    value: number;
  }>;
  priorityData: Array<{
    name: string;
    count: number;
    completed: number;
  }>;
}

export interface TrendDataPoint {
  date: string;
  completed: number;
  inProgress: number;
  backlog: number;
}

export interface CostBenefitDataPoint {
  category: string;
  investment: number;
  return: number;
}

export interface EngagementDataPoint {
  name: string;
  tasksCount: number;
  storyPoints: number;
  completionRate: number;
}

interface UseFeatureAnalyticsParams {
  sprint?: string;
  timeRange: "7d" | "30d" | "90d";
  analysisType: "feature" | "project" | "assignee";
}

interface UseFeatureAnalyticsReturn {
  usageStats: FeatureUsageStats | null;
  trendData: TrendDataPoint[] | null;
  costBenefitData: CostBenefitDataPoint[] | null;
  engagementData: EngagementDataPoint[] | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export function useFeatureAnalytics({
  sprint,
  timeRange,
  analysisType,
}: UseFeatureAnalyticsParams): UseFeatureAnalyticsReturn {
  const [usageStats, setUsageStats] = useState<FeatureUsageStats | null>(null);
  const [trendData, setTrendData] = useState<TrendDataPoint[] | null>(null);
  const [costBenefitData, setCostBenefitData] = useState<
    CostBenefitDataPoint[] | null
  >(null);
  const [engagementData, setEngagementData] = useState<
    EngagementDataPoint[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        let rawData: any[] = [];

        try {
          // 嘗試從正確的 API 端點獲取數據
          const response = await fetch(
            "http://localhost:8001/api/table/data?page_size=1000"
          );
          if (!response.ok) {
            throw new Error(
              `API request failed: ${response.status} ${response.statusText}`
            );
          }

          const responseData = await response.json();
          // 從分頁數據中提取實際的項目列表
          rawData = responseData.data || [];
          if (!Array.isArray(rawData)) {
            throw new Error(
              `Invalid data format: expected array, got ${typeof rawData}`
            );
          }
        } catch (apiError) {
          console.warn("API not available, using mock data:", apiError);
          // 使用模擬數據作為後備
          rawData = getMockData();
        }

        // 過濾數據
        let filteredData = rawData;
        if (sprint && sprint !== "All") {
          filteredData = rawData.filter((item) => item.Sprint === sprint);
        }

        // 計算使用率統計
        const stats = calculateUsageStats(filteredData, analysisType);
        setUsageStats(stats);

        // 計算趨勢數據
        const trends = calculateTrendData(filteredData, timeRange);
        setTrendData(trends);

        // 計算成本效益數據
        const costBenefit = calculateCostBenefitData(
          filteredData,
          analysisType
        );
        setCostBenefitData(costBenefit);

        // 計算參與度數據
        const engagement = calculateEngagementData(filteredData, analysisType);
        setEngagementData(engagement);

        setLastUpdated(new Date().toISOString());
      } catch (err) {
        console.error("Feature analytics fetch error:", err);
        if (err instanceof TypeError && err.message.includes("fetch")) {
          setError("無法連接到後端服務，請確認服務已啟動");
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("發生未知錯誤");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [sprint, timeRange, analysisType]);

  return {
    usageStats,
    trendData,
    costBenefitData,
    engagementData,
    loading,
    error,
    lastUpdated,
  };
}

function getMockData() {
  return [
    {
      "Issue Key": "DEMO-1",
      "Issue Type": "Story",
      Status: "Done",
      Priority: "High",
      Assignee: "John Doe",
      Project: "Demo Project",
      Sprint: "Sprint 1",
      "Story Points": "5",
      "Business Points": "8",
      Summary: "Implement login feature",
    },
    {
      "Issue Key": "DEMO-2",
      "Issue Type": "Bug",
      Status: "In Progress",
      Priority: "Medium",
      Assignee: "Jane Smith",
      Project: "Demo Project",
      Sprint: "Sprint 1",
      "Story Points": "3",
      "Business Points": "2",
      Summary: "Fix authentication issue",
    },
    {
      "Issue Key": "DEMO-3",
      "Issue Type": "Epic",
      Status: "Verified",
      Priority: "High",
      Assignee: "Bob Johnson",
      Project: "Demo Project",
      Sprint: "Sprint 2",
      "Story Points": "13",
      "Business Points": "21",
      Summary: "User dashboard redesign",
    },
    {
      "Issue Key": "DEMO-4",
      "Issue Type": "Task",
      Status: "To Do",
      Priority: "Low",
      Assignee: "Alice Brown",
      Project: "Demo Project",
      Sprint: "Sprint 2",
      "Story Points": "2",
      "Business Points": "3",
      Summary: "Update documentation",
    },
    {
      "Issue Key": "DEMO-5",
      "Issue Type": "Story",
      Status: "Done",
      Priority: "Medium",
      Assignee: "John Doe",
      Project: "Demo Project",
      Sprint: "Sprint 1",
      "Story Points": "8",
      "Business Points": "13",
      Summary: "Payment integration",
    },
  ];
}

function calculateUsageStats(
  data: any[],
  analysisType: string
): FeatureUsageStats {
  if (data.length === 0) {
    return {
      totalEffort: 0,
      completionRate: 0,
      businessValue: 0,
      activeItems: 0,
      effortTrend: "stable",
      effortChange: 0,
      valueTrend: "stable",
      roi: 0,
      engagementScore: 0,
      distributionData: [],
      priorityData: [],
    };
  }

  // 計算總工作量 (Story Points)
  const totalEffort = data.reduce((sum, item) => {
    const storyPoints =
      parseFloat(item.story_points || item["Story Points"]) || 0;
    return sum + storyPoints;
  }, 0);

  // 計算完成率
  const completedTasks = data.filter(
    (item) =>
      item.status === "Verified" ||
      item.status === "Done" ||
      item.status === "Closed" ||
      item.Status === "Verified" ||
      item.Status === "Done" ||
      item.Status === "Closed"
  ).length;
  const completionRate =
    data.length > 0 ? (completedTasks / data.length) * 100 : 0;

  // 計算商業價值 (Business Points)
  const businessValue = data.reduce((sum, item) => {
    const businessPoints =
      parseFloat(item.businesspoints || item["Business Points"]) || 0;
    return sum + businessPoints;
  }, 0);

  // 計算活躍項目數
  const activeItems = data.filter(
    (item) =>
      item.status !== "Verified" &&
      item.status !== "Done" &&
      item.status !== "Closed" &&
      item.Status !== "Verified" &&
      item.Status !== "Done" &&
      item.Status !== "Closed"
  ).length;

  // 計算 ROI (Business Points / Story Points)
  const roi = totalEffort > 0 ? (businessValue / totalEffort) * 100 : 0;

  // 分析分布數據
  const distributionData = calculateDistributionData(data, analysisType);

  // 分析優先級數據
  const priorityData = calculatePriorityData(data);

  return {
    totalEffort: Math.round(totalEffort),
    completionRate: Math.round(completionRate),
    businessValue: Math.round(businessValue),
    activeItems,
    effortTrend: Math.random() > 0.5 ? "up" : "down", // 模擬趨勢
    effortChange: Math.round((Math.random() - 0.5) * 40), // 模擬變化百分比
    valueTrend: roi > 100 ? "up" : roi < 80 ? "down" : "stable",
    roi: Math.round(roi),
    engagementScore: Math.min(10, Math.round(completionRate / 10 + roi / 50)),
    distributionData,
    priorityData,
  };
}

function calculateDistributionData(data: any[], analysisType: string) {
  if (analysisType === "feature") {
    // 按 Issue Type 分析
    const typeCount: Record<string, number> = {};
    data.forEach((item) => {
      const type = item.issue_type || item["Issue Type"] || "Unknown";
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    return Object.entries(typeCount).map(([name, value]) => ({
      name,
      value,
    }));
  } else if (analysisType === "project") {
    // 按 Project 分析
    const projectCount: Record<string, number> = {};
    data.forEach((item) => {
      const project = item.projects || item.Project || "Unknown";
      projectCount[project] = (projectCount[project] || 0) + 1;
    });

    return Object.entries(projectCount).map(([name, value]) => ({
      name,
      value,
    }));
  } else {
    // 按 Assignee 分析
    const assigneeCount: Record<string, number> = {};
    data.forEach((item) => {
      const assignee = item.assignee || item.Assignee || "Unassigned";
      assigneeCount[assignee] = (assigneeCount[assignee] || 0) + 1;
    });

    return Object.entries(assigneeCount).map(([name, value]) => ({
      name,
      value,
    }));
  }
}

function calculatePriorityData(data: any[]) {
  const priorityStats: Record<string, { count: number; completed: number }> =
    {};

  data.forEach((item) => {
    const priority = item.priority || item.Priority || "Medium";
    const isCompleted =
      item.status === "Verified" ||
      item.status === "Done" ||
      item.status === "Closed" ||
      item.Status === "Verified" ||
      item.Status === "Done" ||
      item.Status === "Closed";

    if (!priorityStats[priority]) {
      priorityStats[priority] = { count: 0, completed: 0 };
    }

    priorityStats[priority].count++;
    if (isCompleted) {
      priorityStats[priority].completed++;
    }
  });

  return Object.entries(priorityStats).map(([name, stats]) => ({
    name,
    count: stats.count,
    completed: stats.completed,
  }));
}

function calculateTrendData(data: any[], timeRange: string): TrendDataPoint[] {
  // 模擬趨勢數據 - 在實際應用中應該基於時間戳分析
  const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
  const trendData: TrendDataPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // 模擬數據 - 實際應用中應該從歷史數據計算
    const completed = Math.floor(Math.random() * 20) + 10;
    const inProgress = Math.floor(Math.random() * 15) + 5;
    const backlog = Math.floor(Math.random() * 25) + 15;

    trendData.push({
      date: date.toISOString().split("T")[0],
      completed,
      inProgress,
      backlog,
    });
  }

  return trendData;
}

function calculateCostBenefitData(
  data: any[],
  analysisType: string
): CostBenefitDataPoint[] {
  if (analysisType === "feature") {
    // 按功能類型分析投入產出
    const typeStats: Record<string, { investment: number; return: number }> =
      {};

    data.forEach((item) => {
      const type = item["Issue Type"] || "Unknown";
      const storyPoints = parseFloat(item["Story Points"]) || 0;
      const businessPoints = parseFloat(item["Business Points"]) || 0;

      if (!typeStats[type]) {
        typeStats[type] = { investment: 0, return: 0 };
      }

      typeStats[type].investment += storyPoints;
      typeStats[type].return += businessPoints;
    });

    return Object.entries(typeStats).map(([category, stats]) => ({
      category,
      investment: Math.round(stats.investment),
      return: Math.round(stats.return),
    }));
  } else if (analysisType === "project") {
    // 按專案分析
    const projectStats: Record<string, { investment: number; return: number }> =
      {};

    data.forEach((item) => {
      const project = item.Project || "Unknown";
      const storyPoints = parseFloat(item["Story Points"]) || 0;
      const businessPoints = parseFloat(item["Business Points"]) || 0;

      if (!projectStats[project]) {
        projectStats[project] = { investment: 0, return: 0 };
      }

      projectStats[project].investment += storyPoints;
      projectStats[project].return += businessPoints;
    });

    return Object.entries(projectStats).map(([category, stats]) => ({
      category,
      investment: Math.round(stats.investment),
      return: Math.round(stats.return),
    }));
  } else {
    // 按負責人分析
    const assigneeStats: Record<
      string,
      { investment: number; return: number }
    > = {};

    data.forEach((item) => {
      const assignee = item.Assignee || "Unassigned";
      const storyPoints = parseFloat(item["Story Points"]) || 0;
      const businessPoints = parseFloat(item["Business Points"]) || 0;

      if (!assigneeStats[assignee]) {
        assigneeStats[assignee] = { investment: 0, return: 0 };
      }

      assigneeStats[assignee].investment += storyPoints;
      assigneeStats[assignee].return += businessPoints;
    });

    return Object.entries(assigneeStats).map(([category, stats]) => ({
      category,
      investment: Math.round(stats.investment),
      return: Math.round(stats.return),
    }));
  }
}

function calculateEngagementData(
  data: any[],
  analysisType: string
): EngagementDataPoint[] {
  if (analysisType === "assignee") {
    // 按負責人分析參與度
    const assigneeStats: Record<string, { tasks: any[]; storyPoints: number }> =
      {};

    data.forEach((item) => {
      const assignee = item.Assignee || "Unassigned";
      const storyPoints = parseFloat(item["Story Points"]) || 0;

      if (!assigneeStats[assignee]) {
        assigneeStats[assignee] = { tasks: [], storyPoints: 0 };
      }

      assigneeStats[assignee].tasks.push(item);
      assigneeStats[assignee].storyPoints += storyPoints;
    });

    return Object.entries(assigneeStats).map(([name, stats]) => {
      const completedTasks = stats.tasks.filter(
        (task) =>
          task.Status === "Verified" ||
          task.Status === "Done" ||
          task.Status === "Closed"
      ).length;

      const completionRate =
        stats.tasks.length > 0
          ? Math.round((completedTasks / stats.tasks.length) * 100)
          : 0;

      return {
        name,
        tasksCount: stats.tasks.length,
        storyPoints: Math.round(stats.storyPoints),
        completionRate,
      };
    });
  } else {
    // 其他分析類型的參與度數據
    return [];
  }
}

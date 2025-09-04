"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  DollarSign,
  Activity,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useFeatureAnalytics } from "../hooks/use-feature-analytics";

interface FeatureAnalyticsProps {
  selectedSprint?: string;
  className?: string;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
];

const formatValue = (
  value: number,
  type: "percentage" | "number" | "currency" = "number"
) => {
  switch (type) {
    case "percentage":
      return `${value.toFixed(1)}%`;
    case "currency":
      return `$${value.toLocaleString()}`;
    default:
      return value.toLocaleString();
  }
};

const getTrendIcon = (trend: "up" | "down" | "stable") => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case "down":
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    default:
      return <Activity className="h-4 w-4 text-gray-600" />;
  }
};

export function FeatureAnalytics({
  selectedSprint,
  className,
}: FeatureAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [analysisType, setAnalysisType] = useState<
    "feature" | "project" | "assignee"
  >("feature");

  const {
    usageStats,
    trendData,
    costBenefitData,
    engagementData,
    loading,
    error,
    lastUpdated,
  } = useFeatureAnalytics({
    sprint: selectedSprint === "All" ? undefined : selectedSprint,
    timeRange,
    analysisType,
  });

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            功能使用率分析
          </CardTitle>
          <CardDescription>分析功能使用率、投入成本與效益評估</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">正在分析資料...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            功能使用率分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            <p>載入失敗: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          功能使用率與效益分析
        </CardTitle>
        <CardDescription>
          基於任務數據分析功能優先級與投資回報率
          {lastUpdated && (
            <span className="block text-xs text-muted-foreground mt-1">
              最後更新: {new Date(lastUpdated).toLocaleString("zh-TW")}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 控制面板 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select
            value={analysisType}
            onValueChange={(value: "feature" | "project" | "assignee") =>
              setAnalysisType(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="分析維度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="feature">功能類型</SelectItem>
              <SelectItem value="project">專案分析</SelectItem>
              <SelectItem value="assignee">團隊績效</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={timeRange}
            onValueChange={(value: "7d" | "30d" | "90d") => setTimeRange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="時間範圍" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">近 7 天</SelectItem>
              <SelectItem value="30d">近 30 天</SelectItem>
              <SelectItem value="90d">近 90 天</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">總覽</TabsTrigger>
            <TabsTrigger value="trends">趨勢分析</TabsTrigger>
            <TabsTrigger value="cost-benefit">成本效益</TabsTrigger>
            <TabsTrigger value="engagement">參與度</TabsTrigger>
          </TabsList>

          {/* 總覽 Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* 關鍵指標卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        總投入工作量
                      </p>
                      <p className="text-2xl font-bold">
                        {usageStats?.totalEffort || 0} SP
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(usageStats?.effortTrend || "stable")}
                    <span className="text-sm text-muted-foreground ml-1">
                      vs 上期 {usageStats?.effortChange || 0}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">完成率</p>
                      <p className="text-2xl font-bold">
                        {usageStats?.completionRate || 0}%
                      </p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <Progress
                    value={usageStats?.completionRate || 0}
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">商業價值</p>
                      <p className="text-2xl font-bold">
                        {usageStats?.businessValue || 0}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(usageStats?.valueTrend || "stable")}
                    <span className="text-sm text-muted-foreground ml-1">
                      投資回報率 {usageStats?.roi || 0}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">活躍項目</p>
                      <p className="text-2xl font-bold">
                        {usageStats?.activeItems || 0}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-muted-foreground">
                      參與度 {usageStats?.engagementScore || 0}/10
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 功能使用分布 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>功能使用率分布</CardTitle>
                </CardHeader>
                <CardContent>
                  {usageStats?.distributionData &&
                  usageStats.distributionData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={usageStats.distributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }: any) =>
                            `${name} ${
                              percent ? (percent * 100).toFixed(0) : 0
                            }%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {usageStats.distributionData.map(
                            (entry: any, index: number) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>暫無分布數據</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>優先級與狀態分析</CardTitle>
                </CardHeader>
                <CardContent>
                  {usageStats?.priorityData &&
                  usageStats.priorityData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={usageStats.priorityData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" />
                        <Bar dataKey="completed" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>暫無優先級數據</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 趨勢分析 Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>完成趨勢分析</CardTitle>
                <CardDescription>追蹤功能完成率的時間變化趨勢</CardDescription>
              </CardHeader>
              <CardContent>
                {trendData && trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={trendData}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        stroke="#8884d8"
                        name="已完成"
                      />
                      <Line
                        type="monotone"
                        dataKey="inProgress"
                        stroke="#82ca9d"
                        name="進行中"
                      />
                      <Line
                        type="monotone"
                        dataKey="backlog"
                        stroke="#ffc658"
                        name="待辦"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>暫無趨勢數據</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 成本效益 Tab */}
          <TabsContent value="cost-benefit" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>投入與產出分析</CardTitle>
                  <CardDescription>
                    比較 Story Points 投入與 Business Points 產出
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {costBenefitData && costBenefitData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={costBenefitData}>
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="investment"
                          fill="#ff7300"
                          name="投入 (Story Points)"
                        />
                        <Bar
                          dataKey="return"
                          fill="#00C49F"
                          name="產出 (Business Points)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p>暫無成本效益數據</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 參與度 Tab */}
          <TabsContent value="engagement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>團隊參與度分析</CardTitle>
                <CardDescription>
                  分析團隊成員在不同功能的參與程度
                </CardDescription>
              </CardHeader>
              <CardContent>
                {engagementData && engagementData.length > 0 ? (
                  <div className="space-y-4">
                    {engagementData.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.tasksCount} 個任務 • {item.storyPoints} Story
                            Points
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold">{item.completionRate}%</p>
                            <p className="text-sm text-muted-foreground">
                              完成率
                            </p>
                          </div>
                          <Progress
                            value={item.completionRate}
                            className="w-24"
                          />
                          <Badge
                            variant={
                              item.completionRate >= 80
                                ? "default"
                                : item.completionRate >= 60
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {item.completionRate >= 80
                              ? "高效"
                              : item.completionRate >= 60
                              ? "中等"
                              : "需改善"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>暫無參與度數據</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

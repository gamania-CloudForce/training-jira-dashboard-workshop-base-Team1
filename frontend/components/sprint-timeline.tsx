"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Target,
  Clock,
  CheckCircle,
  HourglassIcon,
} from "lucide-react";
import { useSprintTimeline } from "@/hooks/use-sprint-timeline";

interface SprintTimelineProps {
  className?: string;
}

const getStatusConfig = (state: string) => {
  switch (state) {
    case "active":
      return {
        color: "bg-green-500",
        badgeVariant: "default" as const,
        badgeClassName: "bg-green-100 text-green-800 hover:bg-green-100",
        icon: Clock,
        iconColor: "text-green-600",
        label: "進行中",
        description: "當前活躍的 Sprint",
      };
    case "closed":
      return {
        color: "bg-gray-500",
        badgeVariant: "secondary" as const,
        badgeClassName: "bg-gray-100 text-gray-800 hover:bg-gray-100",
        icon: CheckCircle,
        iconColor: "text-gray-600",
        label: "已完成",
        description: "Sprint 已結束",
      };
    case "future":
      return {
        color: "bg-blue-500",
        badgeVariant: "outline" as const,
        badgeClassName: "bg-blue-50 text-blue-800 hover:bg-blue-50",
        icon: HourglassIcon,
        iconColor: "text-blue-600",
        label: "未開始",
        description: "計劃中的 Sprint",
      };
    default:
      return {
        color: "bg-gray-500",
        badgeVariant: "secondary" as const,
        badgeClassName: "bg-gray-100 text-gray-800 hover:bg-gray-100",
        icon: Calendar,
        iconColor: "text-gray-600",
        label: "未知",
        description: "狀態未明",
      };
  }
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr || dateStr.trim() === "") return "未設定";

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "日期格式錯誤";

    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return "日期解析錯誤";
  }
};

export function SprintTimeline({ className }: SprintTimelineProps) {
  const { sprints, loading, error } = useSprintTimeline();

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Sprint 時間軸
          </CardTitle>
          <CardDescription>專案里程碑和 Sprint 進度概覽</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">載入 Sprint 資訊...</span>
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
            <Calendar className="h-5 w-5" />
            Sprint 時間軸
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

  if (!sprints || sprints.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Sprint 時間軸
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>目前沒有可用的 Sprint 資訊</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 按狀態排序：active > future > closed
  const sortedSprints = [...sprints].sort((a, b) => {
    const statusOrder = { active: 0, future: 1, closed: 2 };
    const orderA = statusOrder[a.state as keyof typeof statusOrder] ?? 3;
    const orderB = statusOrder[b.state as keyof typeof statusOrder] ?? 3;

    if (orderA !== orderB) return orderA - orderB;

    // 相同狀態內，按 sprint_id 排序
    return a.sprint_id - b.sprint_id;
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Sprint 時間軸
        </CardTitle>
        <CardDescription>
          專案里程碑和 Sprint 進度概覽 (共 {sprints.length} 個 Sprint)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedSprints.map((sprint) => {
            const statusConfig = getStatusConfig(sprint.state);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={sprint.sprint_id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="mt-1">
                  <StatusIcon className={`h-5 w-5 ${statusConfig.iconColor}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-base truncate">
                      {sprint.sprint_name}
                    </h4>
                    <Badge
                      variant={statusConfig.badgeVariant}
                      className={statusConfig.badgeClassName}
                    >
                      {statusConfig.label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">專案板</p>
                      <p className="font-medium">{sprint.board_name}</p>
                    </div>

                    <div>
                      <p className="text-gray-600 mb-1">開始日期</p>
                      <p className="font-medium">
                        {formatDate(sprint.start_date)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600 mb-1">結束日期</p>
                      <p className="font-medium">
                        {formatDate(sprint.end_date)}
                      </p>
                    </div>
                  </div>

                  {sprint.goal && sprint.goal.trim() !== "" && (
                    <div className="mt-3">
                      <p className="text-gray-600 text-sm mb-1">Sprint 目標</p>
                      <p className="text-sm bg-blue-50 p-2 rounded border-l-4 border-blue-300">
                        <Target className="inline h-4 w-4 mr-1 text-blue-600" />
                        {sprint.goal}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Users,
  Target,
  Calendar,
  ArrowRight,
  Filter,
} from "lucide-react";
import { useTaskRelationships } from "@/hooks/use-task-relationships";

interface TaskRelationshipsProps {
  selectedSprint?: string;
  className?: string;
}

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "highest":
      return "bg-red-100 text-red-800 border-red-200";
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    case "lowest":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "done":
      return "bg-green-100 text-green-800 border-green-200";
    case "in progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "to do":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "backlog":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export function TaskRelationships({
  selectedSprint,
  className,
}: TaskRelationshipsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [showOnlyWithParents, setShowOnlyWithParents] = useState(false);

  const { tasks, parentTasks, assignees, loading, error, pagination } =
    useTaskRelationships({
      sprint: selectedSprint === "All" ? undefined : selectedSprint,
      search: searchTerm,
      assignee: assigneeFilter === "all" ? undefined : assigneeFilter,
      hasParent: showOnlyWithParents,
    });

  if (loading && tasks.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            任務關聯性視圖
          </CardTitle>
          <CardDescription>查看任務之間的層級關係和負責人分配</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">載入任務資料...</span>
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
            <Users className="h-5 w-5" />
            任務關聯性視圖
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
          <Users className="h-5 w-5" />
          任務關聯性視圖
        </CardTitle>
        <CardDescription>
          查看任務之間的層級關係和負責人分配
          {pagination && (
            <span className="ml-2 text-sm">
              (第 {pagination.currentPage} 頁，共 {pagination.totalRecords}{" "}
              個任務)
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* 篩選控制區 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜尋任務標題或 Key..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="選擇負責人" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有負責人</SelectItem>
              {assignees.map((assignee) => (
                <SelectItem key={assignee} value={assignee}>
                  {assignee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={showOnlyWithParents ? "default" : "outline"}
            onClick={() => setShowOnlyWithParents(!showOnlyWithParents)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            僅顯示子任務
          </Button>
        </div>

        {/* 任務列表 */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>沒有找到符合條件的任務</p>
            </div>
          ) : (
            tasks.map((task) => {
              const parentTask = task.parent ? parentTasks[task.parent] : null;

              return (
                <div
                  key={task.key}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  {/* 主任務資訊 */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-sm font-semibold text-blue-600">
                          {task.key}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {task.issue_type}
                        </Badge>
                        <Badge
                          className={`text-xs ${getStatusColor(task.status)}`}
                        >
                          {task.status}
                        </Badge>
                        <Badge
                          className={`text-xs ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </Badge>
                      </div>

                      <h4 className="font-medium text-base mb-2 truncate">
                        {task.summary}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1">負責人</p>
                          <p className="font-medium">
                            {task.assignee || "未分配"}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-600 mb-1">Story Points</p>
                          <p className="font-medium">
                            {task.story_points
                              ? `${task.story_points} SP`
                              : "未估點"}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-600 mb-1">到期日</p>
                          <p className="font-medium">
                            {task.due_date
                              ? new Date(task.due_date).toLocaleDateString(
                                  "zh-TW"
                                )
                              : "未設定"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 父任務關聯 */}
                  {parentTask && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <ArrowRight className="h-4 w-4" />
                        <span>屬於父任務:</span>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-semibold text-blue-700">
                            {parentTask.key}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {parentTask.issue_type}
                          </Badge>
                          <Badge
                            className={`text-xs ${getStatusColor(
                              parentTask.status
                            )}`}
                          >
                            {parentTask.status}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-blue-800">
                          {parentTask.summary}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          負責人: {parentTask.assignee || "未分配"} | Story
                          Points: {parentTask.story_points || "未估點"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 分頁資訊 */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              第 {pagination.currentPage} 頁，共 {pagination.totalPages} 頁 (
              {pagination.totalRecords} 個任務)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

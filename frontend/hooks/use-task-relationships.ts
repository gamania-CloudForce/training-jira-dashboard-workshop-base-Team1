import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export interface TaskData {
  key: string;
  issue_type: string;
  projects: string;
  summary: string;
  parent: string;
  status: string;
  sprint: string;
  due_date: string;
  priority: string;
  urgency: string;
  "t-size": string;
  confidence: string;
  assignee: string;
  tasktags: string;
  businesspoints: string;
  story_points: string;
  status_category: string;
  status_category_changed: string;
  time_spent: string;
  created: string;
  updated: string;
  resolved: string;
  project_name: string;
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface TaskDataResponse {
  data: TaskData[];
  pagination: PaginationInfo;
}

export interface UseTaskRelationshipsParams {
  sprint?: string;
  search?: string;
  assignee?: string;
  hasParent?: boolean;
  pageSize?: number;
}

export function useTaskRelationships(params: UseTaskRelationshipsParams = {}) {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [parentTasks, setParentTasks] = useState<Record<string, TaskData>>({});
  const [assignees, setAssignees] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { sprint, search, assignee, hasParent, pageSize = 20 } = params;

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 構建查詢參數
      const searchParams = new URLSearchParams({
        page: "1",
        page_size: pageSize.toString(),
        sort_by: "key",
        sort_order: "asc",
      });

      if (sprint) {
        searchParams.append("sprint", sprint);
      }

      const response = await fetch(
        `${API_BASE_URL}/api/table/data?${searchParams}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }

      const data: TaskDataResponse = await response.json();
      let filteredTasks = data.data;

      // 前端篩選（因為後端可能不支援所有篩選）
      if (search && search.trim() !== "") {
        const searchLower = search.toLowerCase();
        filteredTasks = filteredTasks.filter(
          (task) =>
            task.key.toLowerCase().includes(searchLower) ||
            task.summary.toLowerCase().includes(searchLower)
        );
      }

      if (assignee && assignee !== "all") {
        filteredTasks = filteredTasks.filter(
          (task) => task.assignee === assignee
        );
      }

      if (hasParent) {
        filteredTasks = filteredTasks.filter(
          (task) => task.parent && task.parent.trim() !== ""
        );
      }

      setTasks(filteredTasks);
      setPagination(data.pagination);

      // 收集所有負責人
      const uniqueAssignees = [
        ...new Set(data.data.map((task) => task.assignee).filter(Boolean)),
      ];
      setAssignees(uniqueAssignees.sort());

      // 獲取父任務資訊
      const parentKeys = [
        ...new Set(filteredTasks.map((task) => task.parent).filter(Boolean)),
      ];
      if (parentKeys.length > 0) {
        const parentTasksMap: Record<string, TaskData> = {};

        // 從現有資料中找父任務
        for (const parentKey of parentKeys) {
          const parentTask = data.data.find((task) => task.key === parentKey);
          if (parentTask) {
            parentTasksMap[parentKey] = parentTask;
          }
        }

        setParentTasks(parentTasksMap);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching tasks";
      setError(errorMessage);
      setTasks([]);
      setParentTasks({});
      setAssignees([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [sprint, search, assignee, hasParent, pageSize]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    parentTasks,
    assignees,
    pagination,
    loading,
    error,
    refetch: fetchTasks,
  };
}

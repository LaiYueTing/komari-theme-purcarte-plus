// API 服務 - 用於與 Komari 後端通訊
import type {
  NodeData,
  ApiResponse,
  PublicInfo,
  HistoryRecord,
  PingHistoryResponse,
  PingHistoryRecord,
  PingTask,
  PingTaskFull,
  Me,
  NodeStats,
} from "@/types/node";
import type { RpcNodeStatus, RpcNodeStatusMap } from "@/types/rpc";
import { convertNodeStatsToRpcNodeStatus } from "@/utils/converters";
import type { SiteStatus } from "@/config/default";

class ApiService {
  private baseUrl: string;
  public useRpc = false;
  private rpcCallId = 1;

  constructor() {
    this.baseUrl = "";
  }

  private async rpcCall<T>(
    method: string,
    params: any = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/rpc2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method,
          params,
          id: this.rpcCallId++,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rpcResponse = await response.json();
      if (rpcResponse.error) {
        throw new Error(
          `RPC Error: ${rpcResponse.error.message} (Code: ${rpcResponse.error.code})`
        );
      }
      return { status: "success", message: "", data: rpcResponse.result };
    } catch (error) {
      console.error(`RPC call to '${method}' failed:`, error);
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown RPC error",
        data: null as any,
      };
    }
  }

  async get<T>(
    endpoint: string
  ): Promise<ApiResponse<T> | { status: string; message: string; data: any }> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      if (!response.ok) {
        return {
          status: "error",
          message: `HTTP error! status: ${response.status}`,
          data: null as any,
        };
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed (network error):", error);
      return {
        status: "error",
        message:
          error instanceof Error ? error.message : "Unknown network error",
        data: null as any,
      };
    }
  }

  // 取得所有節點資訊
  async getNodes(): Promise<NodeData[]> {
    if (this.useRpc) {
      const response = await this.rpcCall<{ [uuid: string]: NodeData }>(
        "common:getNodes"
      );
      if (response.status === "success" && response.data) {
        return Object.values(response.data);
      }
      return [];
    }
    const response = await this.get<NodeData[]>("/api/nodes");
    if ("status" in response && response.status === "success") {
      return (response as ApiResponse<NodeData[]>).data;
    }
    return [];
  }

  // 取得指定節點的最近狀態
  async getNodeRecentStats(uuid: string): Promise<RpcNodeStatus[]> {
    if (this.useRpc) {
      const response = await this.rpcCall<{ records: RpcNodeStatus[] }>(
        "common:getNodeRecentStatus",
        { uuid }
      );
      return response.status === "success" ? response.data.records : [];
    }
    const response = await this.get<NodeStats[]>(`/api/recent/${uuid}`);
    if (response.status === "success" && Array.isArray(response.data)) {
      return response.data.map((stats) =>
        convertNodeStatsToRpcNodeStatus(stats, uuid, true)
      );
    }
    return [];
  }

  // 取得負載歷史記錄
  async getLoadHistory(
    uuid: string,
    hours: number = 24
  ): Promise<{ count: number; records: HistoryRecord[] } | null> {
    if (this.useRpc) {
      const response = await this.rpcCall<any>("common:getRecords", {
        uuid,
        hours,
        type: "load",
      });
      if (response.status === "success" && response.data) {
        const data = response.data;
        // RPC common:getRecords 函式使用 uuid 直接回傳 StatusRecord[] 型別的記錄
        // 如果未提供 uuid，則 records 為 { [uuid]: StatusRecord[] }
        const records = Array.isArray(data.records)
          ? data.records
          : data.records?.[uuid] || [];
        return {
          count: data.count ?? records.length,
          records,
        };
      }
      return null;
    }
    const response = await this.get<{
      count: number;
      records: HistoryRecord[];
    }>(`/api/records/load?uuid=${uuid}&hours=${hours}`);
    return response.status === "success" ? response.data : null;
  }

  // 取得 Ping 歷史記錄
  async getPingHistory(
    uuid: string,
    hours: number = 24
  ): Promise<PingHistoryResponse | null> {
    if (this.useRpc) {
      const response = await this.rpcCall<any>("common:getRecords", {
        uuid,
        hours,
        type: "ping",
      });
      if (response.status === "success" && response.data) {
        const data = response.data;
        // RPC type=ping 回傳值：{ count, basic_info: BasicInfo[], records: PingRecord[], from, to }
        // PingRecord 包含 { task_id, time, value, client }
        const records: PingHistoryRecord[] = Array.isArray(data.records)
          ? data.records
          : [];

        // 嘗試使用回應中的任務（某些伺服器版本包含此功能）
        let tasks: PingTask[] = Array.isArray(data.tasks)
          ? data.tasks
          : [];

        // 如果伺服器未提供任務，則根據記錄中的唯一 task_id 建構任務
        if (tasks.length === 0 && records.length > 0) {
          const taskIdSet = new Set<number>();
          records.forEach((r: PingHistoryRecord) => taskIdSet.add(r.task_id));

          // 如果 basic_info 可用，嘗試從中推導出損失
          const basicInfo: Array<{ client: string; loss: number }> =
            Array.isArray(data.basic_info) ? data.basic_info : [];
          const avgLoss =
            basicInfo.length > 0
              ? basicInfo.reduce((sum: number, b: { loss: number }) => sum + (b.loss || 0), 0) / basicInfo.length
              : 0;

          tasks = Array.from(taskIdSet)
            .sort((a, b) => a - b)
            .map((id) => ({
              id,
              name: `Task ${id}`,
              interval: 30,
              loss: Math.round(avgLoss * 100) / 100,
            }));
        }

        return {
          count: data.count ?? records.length,
          records,
          tasks,
        };
      }
      return null;
    }
    const response = await this.get<PingHistoryResponse>(
      `/api/records/ping?uuid=${uuid}&hours=${hours}`
    );
    return response.status === "success" ? response.data : null;
  }

  // 取得監測節點任務列表（管理員 API）
  async getPingTasks(): Promise<PingTaskFull[]> {
    try {
      const response = await this.get<PingTaskFull[]>("/api/admin/ping/");
      if (response.status === "success" && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch {
      return [];
    }
  }

  // 取得公開設定
  async getPublicSettings(): Promise<PublicInfo | null> {
    if (this.useRpc) {
      const response = await this.rpcCall<PublicInfo>("common:getPublicInfo");
      return response.status === "success" ? response.data : null;
    }
    const response = await this.get<PublicInfo>("/api/public");
    return response.status === "success" ? response.data : null;
  }

  // 取得版本資訊
  async getVersion(): Promise<{ version: string; hash: string }> {
    if (this.useRpc) {
      const response = await this.rpcCall<{ version: string; hash: string }>(
        "common:getVersion"
      );
      if (response.status === "success" && response.data) {
        return response.data;
      }
    }
    const response = await this.get<{ version: string; hash: string }>(
      "/api/version"
    );
    return response.status === "success"
      ? response.data
      : { version: "unknown", hash: "unknown" };
  }

  // 取得使用者資訊
  async getUserInfo(): Promise<Me | null> {
    if (this.useRpc) {
      const response = await this.rpcCall<Me>("common:getMe");
      return response.status === "success" ? response.data : null;
    }
    try {
      const response = await fetch(`${this.baseUrl}/api/me`);
      if (!response.ok) {
        return null;
      }
      const data: Me = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed (network error):", error);
      return null;
    }
  }

  // 檢查站點狀態
  async checkSiteStatus(): Promise<{
    status: SiteStatus;
    publicInfo: PublicInfo | null;
  }> {
    const publicInfoResponse = await this.getPublicSettings();
    const meResponse = await this.getUserInfo();
    const isLoggedIn = meResponse?.logged_in || false;

    if (publicInfoResponse) {
      if (publicInfoResponse.private_site) {
        if (isLoggedIn) {
          return {
            status: "private-authenticated",
            publicInfo: publicInfoResponse,
          };
        }
        return {
          status: "private-unauthenticated",
          publicInfo: publicInfoResponse,
        };
      } else {
        if (isLoggedIn) {
          return { status: "authenticated", publicInfo: publicInfoResponse };
        }
        return { status: "public", publicInfo: publicInfoResponse };
      }
    }
    return { status: "private-unauthenticated", publicInfo: null };
  }

  async saveThemeSettings(
    theme: string,
    settings: Partial<any>
  ): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/admin/theme/settings?theme=${theme}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settings),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to save theme settings:", error);
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        data: null,
      };
    }
  }
}

// 建立 API 服務實例
export const apiService = new ApiService();

// WebSocket 連線管理
export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;
  private listeners: Set<(data: any) => void> = new Set();
  private url: string;
  private statusInterval: ReturnType<typeof setInterval> | null = null;
  private rpcCallId = 1;
  public useRpc = false;

  constructor(url: string = "") {
    this.url = url;
  }

  connect() {
    if (this.ws && this.ws.readyState < 2) {
      return;
    }

    const endpoint = this.useRpc ? "/api/rpc2" : "/api/clients";
    const wsUrl =
      this.url ||
      `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${
        window.location.host
      }${endpoint}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log(`WebSocket connected to ${endpoint}`);
        this.reconnectAttempts = 0;
        this.sendUpdateRequest();
        this.startStatusUpdates();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (this.useRpc) {
            if (data.result) {
              this.listeners.forEach((listener) => listener(data.result));
            }
          } else {
            if (data.status === "success" && data.data) {
              const oldData = data.data as {
                online: string[];
                data: { [uuid: string]: NodeStats };
              };
              if (oldData.online && oldData.data) {
                const convertedData: RpcNodeStatusMap = {};
                for (const uuid in oldData.data) {
                  const isOnline = oldData.online.includes(uuid);
                  convertedData[uuid] = convertNodeStatsToRpcNodeStatus(
                    oldData.data[uuid],
                    uuid,
                    isOnline
                  );
                }
                this.listeners.forEach((listener) => listener(convertedData));
              }
            }
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.stopStatusUpdates();
        this.reconnect();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
      this.reconnect();
    }
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );
      setTimeout(() => this.connect(), this.reconnectInterval);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  private send(data: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    }
  }

  private sendUpdateRequest() {
    if (this.useRpc) {
      const rpcRequest = {
        jsonrpc: "2.0",
        method: "common:getNodesLatestStatus",
        id: this.rpcCallId++,
      };
      this.send(JSON.stringify(rpcRequest));
    } else {
      this.send("get");
    }
  }

  subscribe(listener: (data: any) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.stopStatusUpdates();
    }
  }

  private startStatusUpdates() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
    this.statusInterval = setInterval(() => {
      this.sendUpdateRequest();
    }, 2000);
  }

  private stopStatusUpdates() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
      this.statusInterval = null;
    }
  }
}

// 延遲 WebSocket 服務實例的建立
let wsServiceInstance: WebSocketService | null = null;

export function getWsService(): WebSocketService {
  if (!wsServiceInstance) {
    wsServiceInstance = new WebSocketService();
  }
  return wsServiceInstance;
}

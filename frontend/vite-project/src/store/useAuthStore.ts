import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io, type Socket } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

interface AuthUser {
  _id: string;
  [key: string]: unknown;
}

interface AuthState {
  authUser: AuthUser | null;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: Socket | null;

  checkAuth: () => Promise<void>;
  clearAuth: () => void;
  connectSocket: (user: AuthUser) => void;
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });

      get().connectSocket(res.data);
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  clearAuth: () => {
    set({
      authUser: null,
      isCheckingAuth: false,
      onlineUsers: [],
    });

    get().disconnectSocket();
  },

  connectSocket: (user) => {
    if (!user || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: { userId: user._id },
    });

    set({ socket });

    socket.on("getOnlineUsers", (userIds: string[]) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;

    if (socket?.connected) {
      socket.disconnect();
    }

    set({ socket: null });
  },
}));

import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

interface User {
  _id: string;
  name?: string;
  username?: string;
  profilePic?: string;
  [key: string]: unknown;
}

interface Conversation {
  _id: string;
  [key: string]: unknown;
}

interface Message {
  _id: string;
  senderId: string;
  receiverId?: string;
  text?: string;
  image?: string;
  file?: string;
  createdAt?: string;
  [key: string]: unknown;
}

type MessageData = {
  text?: string;
  [key: string]: unknown;
} | FormData;

type SidebarTab = "chats" | string;

interface ChatState {
  users: User[];
  conversations: Conversation[];
  messages: Message[];
  selectedUser: User | null;

  isConversationsLoading: boolean;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  activeConversationId: string | null;
  searchQuery: string;
  sidebarTab: SidebarTab;
  composerText: string;
  isSoundEnabled: boolean;
  isSendingMedia: boolean;

  getUsers: () => Promise<void>;
  getConversations: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;

  sendMessage: (messageData: MessageData) => Promise<boolean>;

  subscribeToMessages: (userId: string) => void;
  unsubscribeFromMessages: () => void;

  setSelectedUser: (selectedUser: User | null) => void;
  setActiveConversationId: (activeConversationId: string | null) => void;
  setSearchQuery: (searchQuery: string) => void;
  setSidebarTab: (sidebarTab: SidebarTab) => void;
  setComposerText: (composerText: string) => void;
  setSoundEnabled: (isSoundEnabled: boolean) => void;

  sendTextMessage: (conversationId: string) => Promise<boolean>;
  sendMediaMessage: (params: {
    conversationId: string;
    file: File;
  }) => Promise<boolean>;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      users: [],
      conversations: [],
      messages: [],
      selectedUser: null,

      isConversationsLoading: false,
      isUsersLoading: false,
      isMessagesLoading: false,

      activeConversationId: null,
      searchQuery: "",
      sidebarTab: "chats",
      composerText: "",
      isSoundEnabled: true,
      isSendingMedia: false,

      getUsers: async () => {
        set({ isUsersLoading: true });

        try {
          const res = await axiosInstance.get<User[]>("/messages/users");

          set((state) => ({
            users: res.data,
            selectedUser:
              state.selectedUser &&
              res.data.some(
                (user) => user._id === state.selectedUser?._id
              )
                ? state.selectedUser
                : null,
          }));
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            console.log(
              "Error in get Users",
              error.response?.data?.message || error.message
            );
          } else {
            console.log("Error in get Users", error);
          }
        } finally {
          set({ isUsersLoading: false });
        }
      },

      getConversations: async () => {
        set({ isConversationsLoading: true });

        try {
          const res =
            await axiosInstance.get<Conversation[]>(
              "/messages/conversations"
            );

          set({ conversations: res.data });
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            console.log(
              "Error in getConversations",
              error.response?.data?.message || error.message
            );
          } else {
            console.log("Error in getConversations", error);
          }
        } finally {
          set({ isConversationsLoading: false });
        }
      },

      getMessages: async (userId: string) => {
        if (!userId) return;

        set({ isMessagesLoading: true });

        try {
          const res = await axiosInstance.get<Message[]>(
            `/messages/${userId}`
          );

          set({ messages: res.data });
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message ||
                "Failed to load messages"
            );
          } else {
            toast.error("Failed to load messages");
          }
        } finally {
          set({ isMessagesLoading: false });
        }
      },

      sendMessage: async (messageData: MessageData) => {
        const { selectedUser, messages } = get();

        if (!selectedUser) return false;

        try {
          const res = await axiosInstance.post<Message>(
            `/messages/send/${selectedUser._id}`,
            messageData
          );

          set({
            messages: [...messages, res.data],
            composerText: "",
          });

          get().getConversations();

          return true;
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message ||
                "Failed to send message"
            );
          } else {
            toast.error("Failed to send message");
          }

          return false;
        }
      },

      subscribeToMessages: (userId: string) => {
        if (!userId) return;

        const socket = useAuthStore.getState().socket;

        if (!socket) return;

        socket.off("newMessage");

        socket.on("newMessage", (newMessage: Message) => {
          // If I'm not the receiver, don't do anything.
          if (String(newMessage.senderId) !== String(userId)) {
            return;
          }

          set({
            messages: [...get().messages, newMessage],
          });

          get().getConversations();
        });
      },

      unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;

        socket?.off("newMessage");
      },

      setSelectedUser: (selectedUser: User | null) => {
        set({ selectedUser });
      },

      setActiveConversationId: (
        activeConversationId: string | null
      ) => {
        set((state) => ({
          activeConversationId,

          selectedUser:
            state.users.find(
              (user) => user._id === activeConversationId
            ) ||
            state.conversations.find(
              (conversation) =>
                conversation._id === activeConversationId
            ) ||
            null,

          messages: activeConversationId ? state.messages : [],
        }));
      },

      setSearchQuery: (searchQuery: string) => {
        set({ searchQuery });
      },

      setSidebarTab: (sidebarTab: SidebarTab) => {
        set({ sidebarTab });
      },

      setComposerText: (composerText: string) => {
        set({ composerText });
      },

      setSoundEnabled: (isSoundEnabled: boolean) => {
        set({ isSoundEnabled });
      },

      sendTextMessage: async (
        conversationId: string
      ): Promise<boolean> => {
        const messageText = get().composerText.trim();

        if (!conversationId || !messageText) {
          return false;
        }

        return get().sendMessage({
          text: messageText,
        });
      },

      sendMediaMessage: async ({
        conversationId,
        file,
      }: {
        conversationId: string;
        file: File;
      }): Promise<boolean> => {
        if (!conversationId || !file) {
          return false;
        }

        const formData = new FormData();
        formData.append("media", file);

        set({ isSendingMedia: true });

        try {
          return await get().sendMessage(formData);
        } finally {
          set({ isSendingMedia: false });
        }
      },
    }),
    {
      name: "imessage-storage",

      partialize: (state) => ({
        isSoundEnabled: state.isSoundEnabled,
      }),
    }
  )
);

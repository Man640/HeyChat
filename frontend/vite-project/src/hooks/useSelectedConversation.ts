import { useMediaQuery } from "./useMediaQuery";
import { formatMessageTime } from "../lib/utils";
import { useChatStore, type User, type Message } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

interface AuthUser {
  _id: string;
}

interface MappedMessage {
  id: string;
  role: "me" | "them";
  text: string;
  time: string;
  imageUrl?: string;
  videoUrl?: string;
}

interface Conversation {
  id: string;
  peer: {
    name: string;
    subtitle: string;
    isOnline: boolean;
    avatarUrl?: string;
    initials: string;
  };
  messages: MappedMessage[];
}

interface MapUserToConversationParams {
  user: User;
  messages: Message[];
  authUser: AuthUser | null;
  onlineUsers: string[];
}

// John Doe -> JD
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((namePart) => namePart[0])
    .join("");
}

// Converts the raw backend shapes into the view-model
// expected by the chat UI components.
function mapUserToConversation({
  user,
  messages,
  authUser,
  onlineUsers,
}: MapUserToConversationParams): Conversation {
  const mappedMessages: MappedMessage[] = messages.map((message) => ({
    id: message._id,
    role:
      String(message.senderId) === String(authUser?._id)
        ? "me"
        : "them",
    text: message.text || "",
    time: formatMessageTime(message.createdAt),
    imageUrl: message.image,
    videoUrl: message.video,
  }));

  return {
    id: user._id,
    peer: {
      name: user.fullName,
      subtitle: user.email,
      isOnline: onlineUsers.includes(user._id),
      avatarUrl: user.profilePic,
      initials: getInitials(user.fullName),
    },
    messages: mappedMessages,
  };
}

interface UseSelectedConversationReturn {
  activeConversation: Conversation | null;
  activeConversationId: string | null;
  isLargeScreen: boolean;
}

export function useSelectedConversation(): UseSelectedConversationReturn {
  const activeConversationId = useChatStore(
    (state) => state.activeConversationId
  );

  const conversations = useChatStore(
    (state) => state.conversations
  );

  const users = useChatStore((state) => state.users);
  const messages = useChatStore((state) => state.messages);

  const authUser = useAuthStore((state) => state.authUser);
  const onlineUsers = useAuthStore((state) => state.onlineUsers);

  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const selectedUser = activeConversationId
    ? users.find(
        (user) => user._id === activeConversationId
      ) ||
      conversations.find(
        (user) => user._id === activeConversationId
      )
    : null;

  const activeConversation = selectedUser
    ? mapUserToConversation({
        user: selectedUser,
        messages,
        authUser,
        onlineUsers,
      })
    : null;

  return {
    activeConversation,
    activeConversationId,
    isLargeScreen,
  };
}
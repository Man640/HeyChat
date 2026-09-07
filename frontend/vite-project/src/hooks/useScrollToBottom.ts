import { useEffect, useRef } from "react";

/**
 * Scrolls a container to the bottom when `threadKey` or `lastItemId` changes
 * (e.g. new message or switched conversation).
 * Returns a ref for the scrollable element.
 */
function useScrollToBottom(
  threadKey: string | null | undefined,
  lastItemId: string | null | undefined,
): React.RefObject<HTMLDivElement | null> {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (threadKey == null || threadKey === "") return;

    const el = scrollRef.current;
    if (!el) return;

    const scrollToBottom = (): void => {
      el.scrollTop = el.scrollHeight;
    };

    scrollToBottom();

    requestAnimationFrame(scrollToBottom);
  }, [threadKey, lastItemId]);

  return scrollRef;
}

export default useScrollToBottom;
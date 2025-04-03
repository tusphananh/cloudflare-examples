import { getConfig } from '@/config';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useRef, useState } from 'react';

const config = getConfig();

interface IUsePostSocketOptions {
  onOpen?: () => void;
  onMessage?: (data: any) => void;
  onClose?: () => void;
}

export default function usePostSocket(
  postId?: string,
  options?: IUsePostSocketOptions,
) {
  const { onClose, onMessage, onOpen } = options || {};

  const auth = useAuth();
  const ref = useRef<WebSocket>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    auth.getToken().then((token) => {
      if (ref.current) {
        ref.current.close();
      }

      setToken(token);
    });
  }, [auth.getToken]);

  useEffect(() => {
    if (!postId || !token) return;

    if (ref.current) {
      ref.current.close();
    }

    const url =
      config.chatServiceUrl +
      '/websocket' +
      '?' +
      `post=${postId}&auth=${token}`;
    const socket = new WebSocket(url);
    ref.current = socket;

    if (onOpen) {
      socket.onopen = onOpen;
    }

    if (onMessage) {
      socket.onmessage = onMessage;
    }

    if (onClose) {
      socket.onclose = onClose;
    }

    return () => {
      if (ref.current) {
        ref.current.close();
      }
    };
  }, [token, postId]);

  return ref.current;
}

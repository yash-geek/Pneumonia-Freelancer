// ✅ FIXED VERSION OF SocketProvider and Chat
// Changes made to ensure proper real-time behavior after login without refresh

// FILE: socket.jsx

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { server } from './constants/config';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const socketRef = useRef(null);
  const [socketReady, setSocketReady] = useState(false);

  useEffect(() => {
    if (user && !socketRef.current) {
      const socket = io(server, {
        withCredentials: true,
        transports: ['websocket'],
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('🟢 Socket connected:', socket.id);
        setSocketReady(true);
      });

      socket.on('disconnect', () => {
        console.log('🔴 Socket disconnected');
        setSocketReady(false);
      });

      socket.on('connect_error', (err) => {
        console.error('❌ Socket connect error:', err.message);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log('🧹 Cleaned up socket on unmount');
        socketRef.current = null;
        setSocketReady(false);
      }
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socketReady ? socketRef.current : null}>
      {children}
    </SocketContext.Provider>
  );
};



// FILE: Chat.jsx (ONLY MODIFIED PART)

// Add this above your return statement

// 💡 Additional logs to add for debugging
// Inside Chat.jsx -> useEffect(() => { if (!socket) return; ...
// just before setMessages:
// console.log('[💬 Chat.jsx] Received NEW_MESSAGE:', incomingMessage);

// // Inside Chat.jsx -> sendMessage(): after emitting:
// console.log('[📤 Chat.jsx] Sent message:', message);

// In App.jsx, wrap all `<Routes />` and `<Toaster />` inside `{user && socket ? (...) : <LayoutLoader />}` if needed for stability

// Optional in App.jsx if issues persist:
// useEffect(() => {
//   console.log('[🧪 App] Current User:', user);
// }, [user]);

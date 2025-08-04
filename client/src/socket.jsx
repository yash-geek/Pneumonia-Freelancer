// ✅ FIXED VERSION OF SocketProvider and Chat
// Changes made to ensure proper real-time behavior after login without refresh

// FILE: socket.jsx

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { server } from './constants/config';
import toast from 'react-hot-toast';

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
        setSocketReady(true);
      });

      socket.on('disconnect', () => {
        setSocketReady(false);
      });

      socket.on('connect_error', (err) => {
        toast.error('connection error')
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
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




import { io } from "socket.io-client";

export const socket = io("https://wecode-6hfa.onrender.com", {
  autoConnect: false,
});

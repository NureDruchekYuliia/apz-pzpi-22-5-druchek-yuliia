import { agent } from "../api/agent";

export const userService = {
  getAll: () => agent.get('/account'),
};
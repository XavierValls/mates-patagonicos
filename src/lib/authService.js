const SIMULATED_USERS_KEY = 'matesPatagonicos_simulated_users';
const CURRENT_USER_KEY = 'matesPatagonicos_currentUser';

export const getSimulatedUsers = () => {
  if (typeof window === 'undefined') return [];
  const storedUsers = localStorage.getItem(SIMULATED_USERS_KEY);
  if (storedUsers) {
    try {
      return JSON.parse(storedUsers);
    } catch (e) {
      console.error("Error al parsear usuarios de localStorage:", e);
      localStorage.removeItem(SIMULATED_USERS_KEY);
    }
  }
  const defaultUsers = [
    { email: 'admin@test.com', password: '123', role: 'admin', id: 'user-admin-123' },
    { email: 'cliente@test.com', password: '123', role: 'client', id: 'user-client-123' },
  ];
  saveSimulatedUsers(defaultUsers);
  return defaultUsers;
};

export const saveSimulatedUsers = (users) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SIMULATED_USERS_KEY, JSON.stringify(users));
};

export const getSessionUser = () => {
  if (typeof window === 'undefined') return null;
  const storedUser = localStorage.getItem(CURRENT_USER_KEY);
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      console.error("Error al parsear usuario de sesion de localStorage:", e);
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }
  return null;
};

export const setSessionUser = (user) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const clearSessionUser = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const registerUser = async (email, password) => {
  if (!email || !password) {
    return { success: false, error: "Email y contrasena son requeridos." };
  }

  let simulatedUsers = getSimulatedUsers();
  if (simulatedUsers.find(u => u.email === email)) {
    return { success: false, error: "Este email ya esta registrado." };
  }

  const newUser = {
    email,
    password,
    role: 'client',
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };

  simulatedUsers.push(newUser);
  saveSimulatedUsers(simulatedUsers);

  return { success: true, message: "Registro exitoso. Por favor, inicia sesion." };
};

export const loginUser = async (email, password) => {
  const simulatedUsers = getSimulatedUsers();
  const foundUser = simulatedUsers.find(u => u.email === email && u.password === password);

  if (foundUser) {
    const userSessionData = { email: foundUser.email, role: foundUser.role, id: foundUser.id };
    setSessionUser(userSessionData);
    return { success: true, user: userSessionData };
  } else {
    return { success: false, error: "Credenciales incorrectas." };
  }
};

export const logoutUser = async () => {
  clearSessionUser();
  return { success: true };
};

export const fetchAllUsers = () => {
  return getSimulatedUsers();
};

export const updateExistingUserRole = (userId, newRole) => {
  let simulatedUsers = getSimulatedUsers();
  const userIndex = simulatedUsers.findIndex(u => u.id === userId);

  if (userIndex > -1) {
    simulatedUsers[userIndex].role = newRole;
    saveSimulatedUsers(simulatedUsers);
    return { success: true, user: simulatedUsers[userIndex], message: `Rol de ${simulatedUsers[userIndex].email} actualizado a ${newRole}.` };
  }
  return { success: false, error: "Usuario no encontrado." };
};

export const deleteExistingUser = (userIdToDelete) => {
  let simulatedUsers = getSimulatedUsers();
  const initialLength = simulatedUsers.length;
  simulatedUsers = simulatedUsers.filter(u => u.id !== userIdToDelete);

  if (simulatedUsers.length < initialLength) {
    saveSimulatedUsers(simulatedUsers);
    return { success: true, message: "Usuario eliminado." };
  }
  return { success: false, error: "Usuario no encontrado." };
};

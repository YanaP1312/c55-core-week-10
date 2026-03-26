// Change base URL for API requests to the local IP of the Post Central API server
const BASE_URL = "http://localhost:3000";

const friendlyMessages = {
  400: "Bed request - check your input",
  401: "You must be logged in",
  403: "You can modify only your own posts",
  404: "Resource not found",
  500: "Server error - try again later",
};

function getFriendlyErrorMessage(status, defaultText) {
  return friendlyMessages[status] || defaultText;
}

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(
      `${response.status} ${getFriendlyErrorMessage(response.status, response.statusText)}`,
    );
  }

  return await response.json();
}

// ============================================================================
// AUTH TOKEN - Stored after login/register, sent with every request
// ============================================================================

/**
 * The JWT token received from login or register.
 * This token proves who you are to the server.
 */
let authToken = null;

/**
 * Save the token. Called by the UI after login/register and by unit tests.
 */
const setToken = (token) => {
  authToken = token;
};

/**
 * Get the current token. Use this to build the Authorization header
 * for authenticated requests: `Bearer ${getToken()}`
 */
const getToken = () => authToken;

// ============================================================================
// HELLO ENDPOINT - Already implemented! Read this as a reference for your code.
// ============================================================================

/**
 * Get a hello message from Post Central
 * Method: GET | Endpoint: /posts/hello | Auth: No
 * Response: { id: number, user: string, text: string, timestamp: string }
 */
const getHello = async () => {
  return apiRequest("/posts/hello");
};

// ============================================================================
// STAGE 1: GET REQUEST - Read data from the server
// ============================================================================

/**
 * Get current user information
 * Method: GET | Endpoint: /users/me | Auth: Yes
 * Response: { user: string }
 */
const getMe = async () => {
  const token = getToken();

  return apiRequest("/users/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ============================================================================
// STAGE 2: POST REQUEST - createUser() is provided as a reference. Implement loginUser().
// ============================================================================

/**
 * Register a new user
 * Method: POST | Endpoint: /users/register | Auth: No
 * Body: { name, password }
 * Response: { user: string, token: string }
 */
const createUser = async (name, password) => {
  return apiRequest("/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, password }),
  });
};

/**
 * Log in an existing user
 * Method: POST | Endpoint: /users/login | Auth: No
 * Body: { name, password }
 * Response: { user: string, token: string }
 */
const loginUser = async (name, password) => {
  return apiRequest("/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, password }),
  });
};

// ============================================================================
// STAGE 3: More CRUD Operations
// ============================================================================

/**
 * Create a new post
 * Method: POST | Endpoint: /posts | Auth: Yes
 * Body: { text }
 * Response: { id: number, text: string, user: string }
 */
const createPost = async (text) => {
  const token = getToken();
  return apiRequest("/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });
};

/**
 * Get all posts for the current user
 * Method: GET | Endpoint: /posts/me | Auth: Yes
 * Response: Array of { id, text, user }
 */
const getPosts = async () => {
  const token = getToken();
  return apiRequest("/posts/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * Update an existing post
 * Method: PUT | Endpoint: /posts/:id | Auth: Yes
 * Body: { text }
 * Response: { id: number, text: string }
 */
const updatePost = async (id, text) => {
  const token = getToken();

  return apiRequest(`/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });
};

/**
 * Delete current user
 * Method: DELETE | Endpoint: /users/me | Auth: Yes
 * Response: { user: string, message: string }
 */
const deleteUser = async () => {
  const token = getToken();
  return apiRequest("/users/me", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * Delete a post
 * Method: DELETE | Endpoint: /posts/:id | Auth: Yes
 * Response: { id: number, text: string, message: string }
 */
const deletePost = async (id) => {
  const token = getToken();
  return apiRequest(`/posts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ============================================================================
// EXPORTS - Make functions available for testing and main.js
// ============================================================================

export {
  createPost,
  createUser,
  deletePost,
  deleteUser,
  getHello,
  getMe,
  getPosts,
  getToken,
  loginUser,
  setToken,
  updatePost,
};

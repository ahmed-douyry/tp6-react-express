const API_URL = 'http://localhost:4000/api/users';

async function handleResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Une erreur est survenue');
  }

  return data;
}

export async function getUsers() {
  const response = await fetch(API_URL);
  return handleResponse(response);
}

export async function getUserById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  return handleResponse(response);
}

export async function createUser(user) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return handleResponse(response);
}

export async function updateUser(id, user) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return handleResponse(response);
}

export async function deleteUser(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

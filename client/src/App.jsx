import { useEffect, useState } from 'react';
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from './api/users';

const emptyForm = { name: '', email: '' };

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function loadUsers() {
    try {
      setError('');
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingId) {
        await updateUser(editingId, form);
      } else {
        await createUser(form);
      }

      resetForm();
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(user) {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email });
    setError('');
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer cet utilisateur ?')) {
      return;
    }

    try {
      setError('');
      await deleteUser(id);

      if (editingId === id) {
        resetForm();
      }

      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Gestion des utilisateurs</h1>
        <p>Frontend React connecté à l&apos;API Express</p>
      </header>

      <main className="layout">
        <section className="card">
          <h2>{editingId ? 'Modifier un utilisateur' : 'Ajouter un utilisateur'}</h2>

          <form className="form" onSubmit={handleSubmit}>
            <label>
              Nom
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex: Alice Martin"
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Ex: alice@mail.com"
                required
              />
            </label>

            <div className="form-actions">
              <button type="submit" disabled={submitting}>
                {submitting
                  ? 'En cours...'
                  : editingId
                    ? 'Mettre à jour'
                    : 'Créer'}
              </button>

              {editingId && (
                <button type="button" className="secondary" onClick={resetForm}>
                  Annuler
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="card">
          <div className="list-header">
            <h2>Liste des utilisateurs</h2>
            <button type="button" className="secondary" onClick={loadUsers}>
              Actualiser
            </button>
          </div>

          {error && <p className="error">{error}</p>}

          {loading ? (
            <p className="muted">Chargement...</p>
          ) : users.length === 0 ? (
            <p className="muted">Aucun utilisateur pour le moment.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td className="actions">
                        <button type="button" onClick={() => handleEdit(user)}>
                          Modifier
                        </button>
                        <button
                          type="button"
                          className="danger"
                          onClick={() => handleDelete(user.id)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

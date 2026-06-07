import { useEffect, useState } from "react";
import { Section } from "../../components/common/Section.jsx";
import { fetchAdminUploads, fetchAdminUsers } from "../../services/api.js";

const fallbackUsers = [
  { _id: "1", username: "student", email: "student@example.com", role: "user" },
  { _id: "2", username: "admin", email: "admin@example.com", role: "admin" },
];

export function AdminPage() {
  const [users, setUsers] = useState([]);
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [usersResult, uploadsResult] = await Promise.all([fetchAdminUsers(), fetchAdminUploads()]);
        setUsers(usersResult.data ?? usersResult);
        setUploads(uploadsResult.data ?? uploadsResult);
      } catch {
        const localHistory = JSON.parse(localStorage.getItem("plantpulse:history") ?? "[]");
        setUsers(fallbackUsers);
        setUploads(localHistory);
      }
    }
    loadDashboard();
  }, []);

  function promoteUser(id) {
    setUsers((current) =>
      current.map((user) => (user._id === id ? { ...user, role: "admin" } : user))
    );
  }

  function deleteUpload(index) {
    setUploads((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <Section className="admin-page">
      <div className="admin-dashboard">
        <h1>Welcome, Admin!</h1>
        <div className="overview-section">
          <h2>Overview</h2>
          <p>Total Users: {users.length}</p>
          <p>Total Uploads: {uploads.length}</p>
        </div>

        <div className="table-section">
          <h2>Manage Users</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id ?? user.email}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td><button type="button" onClick={() => promoteUser(user._id)}>Promote</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-section">
          <h2>Manage Uploads</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Image Path</th>
                  <th>Disease Label</th>
                  <th>Confidence</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map((upload, index) => (
                  <tr key={upload._id ?? index}>
                    <td>{upload.userId?.username ?? "Local User"}</td>
                    <td>{upload.imagePath ?? "N/A"}</td>
                    <td>{upload.diseaseLabel ?? upload.label}</td>
                    <td>{(((upload.confidence ?? upload.score) || 0) * 100).toFixed(2)}%</td>
                    <td><button type="button" onClick={() => deleteUpload(index)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Section>
  );
}

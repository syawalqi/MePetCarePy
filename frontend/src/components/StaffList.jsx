import React, { useEffect, useState } from 'react';
import { userService } from '../api/userService';
import { Link } from 'react-router-dom';

const StaffList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error loading staff:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading staff profiles...</div>;

  return (
    <div className="staff-list">
      <h2>Clinic Staff Management</h2>
      <Link to="/staff/new" className="button">Add New Staff Member</Link>
      <br /><br />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Account Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.full_name}</td>
              <td><strong>{u.role}</strong></td>
              <td>{u.email}</td>
              <td><span className="badge">Active</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffList;

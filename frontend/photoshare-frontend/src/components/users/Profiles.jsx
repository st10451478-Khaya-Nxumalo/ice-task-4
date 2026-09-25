import { useEffect, useState } from 'react';
import axios from 'axios';

const Profiles = () => {
    const [profiles, setProfiles] = useState(null);
    const [error, setError] = useState('');

    //runs on component mount to fetch user profiles
    useEffect(() => {
        const fetchProfiles = async () => {
            try {

                //Retrieve token from localstorage or other secure storage
                const token = localStorage.getItem('token');

                //make get request to the users route
                const response = await axios.get('/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in the header
                    },
                });

                //set the users from the response
                setProfiles(response.data);
            }catch (error) {
                setError('You are not authorized to view this page.');
            }
        };

        fetchProfiles();
    }, []);

    //function to render the users table - specifically the rows
    //not the use of key in the tr element
    const usersTable = () => {
        const rows = profiles?.map(user =>
          <tr key={user._id}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td className="flex gap-2 justify-center">
              {user.role !== 'admin' ? (<button className="btn btn-xs btn-warning" onClick={() => promoteUser(user._id)}>Promote</button>)
              : (<button className="btn btn-xs btn-accent" onClick={() => demoteUser(user._id)}>Demote</button>)}
              <button className="btn btn-xs btn-error" onClick={() => deleteUser(user._id)}>Delete</button>
            </td>
          </tr>
        );

        return rows;
    }

    //function to delete a user profile
    const deleteUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`/api/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in the header
                },
            });
            // Refresh the profiles list after deletion
            setProfiles(profiles?.filter(user => user._id !== userId));
        }catch (err) {
          console.log(err);
          if (err.response)
          {
            setError(err.response.data.message);
          }
          else {
            setError('Something went wrong. Please try again.');
          }
        }
    };

    //function to promote a user to admin
    const promoteUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`/api/users/${userId}/promote`, {}, {
              headers: {
                Authorization: `Bearer ${token}`, // Include token in the header
              },
            });

            // Refresh the profiles list after promotion
            setProfiles(profiles?.map(user => user._id === userId ? { ...user, role: 'admin' } : user));
        }catch (err) {
          console.log(err);
          if (err.response)
          {
            setError(err.response.data.message);
          }
          else {
            setError('Something went wrong. Please try again.');
          }
        }
    };

    //function to demote an admin to user
    const demoteUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`/api/users/${userId}/demote`, {}, {
              headers: {
                Authorization: `Bearer ${token}`, // Include token in the header
              },
            });
            // Refresh the profiles list after demotion
            setProfiles(profiles?.map(user => user._id === userId ? { ...user, role: 'user' } : user));
        }catch (err) {
          console.log(err);
          if (err.response)
          {
            setError(err.response.data.message);
          }
          else {
            setError('Something went wrong. Please try again.');
          }
        }
    };

    //render the profiles table
    return <div className="overflow-x-auto w-full max-w-4xl">
      {error && <p style={{color: 'red'}}>{error}</p>}
      <table className="table table-zebra w-full">
        {/* <!-- Table Head --> */}
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {usersTable()}
        </tbody>
      </table>
    </div>;
};

export default Profiles;

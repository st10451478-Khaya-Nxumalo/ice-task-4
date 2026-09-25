import { useEffect, useState} from 'react';
import axios from 'axios';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [error, setError] = useState('');

    //runs on component mount to fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {

                //Retrieve token from localstorage or other secure storage
                const token = localStorage.getItem('token');

                //make get request to the user profile route
                const response = await axios.get('/api/users/me', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in the header
                    },
                });

                //set the profile from the response
                setProfile(response.data);
                setIsLoading(false);
            }catch (error) {
                setLoadError('Error loading profile. Please try again.');
            }
        };
        fetchProfile();
    }, []);

    //handles form submission to update user profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');

            const response = await axios.put("/api/users/me", {
                username: profile.username,
                email: profile.email,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in the header
                },
            });

            setProfile(response.data);

        }catch (err) {
            if (err.response)
            {
                setError(err.response.data.message);
            }else {
                setError('Something went wrong. Please try again.');
            }
        }
    };

    //if there was an error loading the profile, show error message
    if(loadError !== ''){
        return <p style={{color: 'red'}}>{loadError}</p>;
    }

    //updates username in profile state - note the use of spread (...) operator to maintain immutability
    const setUsername = (username) => {
        setProfile({...profile, username });
    };

    //updates email in profile state - note the use of spread (...) operator to maintain immutability
    const setEmail = (email) => {
        setProfile({...profile, email });
    };

    //if loading, show skeleton loader, else show profile form
    return isLoading ? (
    <div className="card w-96 shadow-2xl bg-base-100">
      <div className="card-body">
        <div className="flex flex-col gap-4">
          <div className="skeleton h-8 w-3/4 mx-auto" />
          <div className="skeleton h-6 w-full" />
          <div className="skeleton h-6 w-full" />
          <div className="skeleton h-10 w-full" />
        </div>
      </div>
    </div>
    ): (<div className="card w-96 shadow-2xl bg-base-100">
      <div className="card-body">
        <h2 className="text-2xl font-bold text-center">Update Profile</h2>

        <form onSubmit={handleSubmit}>
          {error && <p style={{color: 'red'}}>{error}</p>}
          {/* <!-- Username --> */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input type="text" value={profile?.username || ''} className="input input-bordered"
            onChange={(e) => setUsername(e.target.value)} required />
          </div>

          {/* <!-- Email --> */}
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input type="email" value={profile?.email || ''} className="input input-bordered"
            onChange={(e) => setEmail(e.target.value)} required />
          </div>

          {/* <!-- Save Button --> */}
          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>);
};

export default Profile;

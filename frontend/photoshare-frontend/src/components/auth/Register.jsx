import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import isLoggedIn from '../../utils/isLoggedIn';

function Register(){
    // State for form inputs and error message
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const navigate = useNavigate();

    //on mount, check if user is logged in
    React.useEffect(() => {
        if (isLoggedIn()) {
          navigate('/', { replace: true });
        }
    }, []);

    //function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (password !== confirmPassword) {
              setError('Passwords do not match');
              return;
            }

            const response = await axios.post("/api/auth/signup", {
                username,
                email,
                password,
            });
            if (response.status === 201) {
              localStorage.setItem('token', response.data.token);
              navigate('/');
            }
        } catch (err) {
            if (err.response)
            {
                setError(err.response.data.message);
            }else {
                setError('Something went wrong. Please try again.');
            }
        }
    };

    return (
    <div className="card w-96 shadow-2xl bg-base-100">
    <div className="card-body">
      <h2 className="text-2xl font-bold text-center">Sign Up</h2>

      <form onSubmit={handleSubmit}>
        {error && <p style={{color: 'red'}}>{error}</p>}
        {/* <!-- Name --> */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input type="text" placeholder="John Doe" className="input input-bordered" value={username}
          onChange={(e) => setUsername(e.target.value)} required />
        </div>

        {/* <!-- Email --> */}
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input type="email" placeholder="you@example.com" className="input input-bordered" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        </div>

        {/* <!-- Password --> */}
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input type="password" placeholder="********" className="input input-bordered" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {/* <!-- Confirm Password --> */}
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Confirm Password</span>
          </label>
          <input type="password" placeholder="********" className="input input-bordered" value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>

        {/* <!-- Submit Button --> */}
        <div className="form-control mt-6">
          <button type="submit" className="btn btn-primary">Sign Up</button>
        </div>
      </form>
    </div>
    </div>
    )
}

export default Register;

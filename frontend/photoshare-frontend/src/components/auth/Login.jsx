import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router';
import isLoggedIn from '../../utils/isLoggedIn';

function Login(){
    // State for form inputs and error message
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    //runs on component mount
    useEffect(() => {
      if (isLoggedIn()) {
        navigate('/', { replace: true });
      }
    }, []);

    //function to handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');

      try {
        if(!isLoggedIn()){
          const response = await axios.post("/api/auth/login", {
            email,
            password,
          });
          localStorage.setItem('token', response.data.token);
        }

        navigate('/', { replace: true });

      }catch (err) {
        console.log(err);
        if (err.response)
        {
          setError(err.response.data.error);
        }else {
          setError('Something went wrong. Please try again.');
        }
      }
    };

    //return the login form
    return (
      <div className="card w-96 shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Login</h2>

          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <form onSubmit={handleSubmit}>
              {error && <p style={{color: 'red'}}>{error}</p>}
              {/* <!-- Email --> */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input type="email" placeholder="Email" className="input input-bordered" required value={email}
                  onChange={(e) => setEmail(e.target.value)}/>
              </div>

              {/* <!-- Password --> */}
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input type="password" placeholder="Password" className="input input-bordered" required
                  value={password} onChange={(e) => setPassword(e.target.value)}/>
              </div>

              {/* <!-- Submit Button --> */}
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">Login</button>
              </div>
            </form>

            <label className="label">
              <Link to="/register">New User? Sign-up</Link>
            </label>

          </fieldset>
        </div>
      </div>
    );
}

export default Login;

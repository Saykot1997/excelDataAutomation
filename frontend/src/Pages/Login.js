import React, { useState } from 'react'
import { Host } from "../Data"
import axios from 'axios';
import { loginSuccess } from "../Redux/User_slice"
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        const data = {
            email,
            password
        }

        try {

            const res = await axios.post(`${Host}/api/login`, data);
            dispatch(loginSuccess(res.data));
            navigate('/');

        } catch (error) {

            window.alert("Something went wrong");
        }
    }

    return (
        <div className=' bg-gray-100 min-h-screen w-full flex justify-center pt-20'>
            <div>
                <div className=' bg-white rounded shadow w-[500px] p-10'>
                    <p className=' text-center mb-5 text-3xl font-semibold'>Login</p>

                    <form onSubmit={handleSubmit} className="p-5">
                        <input value={email} onChange={(e) => { setEmail(e.target.value) }} type="email" required placeholder='Enter email' className=' w-full border border-blue-600 rounded py-[6px] px-2 focus:outline-none mb-5' />
                        <input value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" required placeholder='Enter password' className=' w-full border border-blue-600 rounded py-[6px] px-2 focus:outline-none mt-5' />
                        <button className=' bg-blue-500 text-white py-[6px] px-2 rounded mt-10 w-full' type='submit'>Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
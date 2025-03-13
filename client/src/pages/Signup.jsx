import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Label, TextInput } from "flowbite-react";

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Redirect after successful signup

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error before submission

    try {
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      alert("Signup successful!");
      navigate("/sign-in"); // Redirect to login page

    } catch (error) {
      console.error("Signup error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* Left Section */}
        <div className='flex-1'>
          <Link to="/" className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
              Katleho's
            </span> Blog
          </Link>
          <p className='text-sm mt-5'>
            This is a demo blog app built with the MERN stack. Sign up to create and view blog posts.
          </p>
        </div>

        {/* Right Section - Signup Form */}
        <div className='flex-1'>
          <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
            <div>
              <Label value='Your username' />
              <TextInput type='text' placeholder='Username' id='username' onChange={handleChange} required />
            </div>
            <div>
              <Label value='Your email' />
              <TextInput type='email' placeholder='name@company.com' id='email' onChange={handleChange} required />
            </div>
            <div>
              <Label value='Your password' />
              <TextInput type='password' placeholder='Password' id='password' onChange={handleChange} required />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit'>
              Sign Up
            </Button>
          </form>
          {error && <div className='text-red-500 mt-2'>{error}</div>} {/* Display error message */}
          <div className='flex gap-2 text-sm mt-5'>
            <span>Already have an account?</span>
            <Link to="/sign-in" className='text-blue-500'>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;


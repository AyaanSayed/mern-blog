import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { set } from "mongoose";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("please fill out all fields");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen mt-20">
      <div className="flex mx-auto p-3 max-w-3xl md:flex-row flex-col md:items-center gap-5">
        <div className="flex-1">
          <Link
            to={"/"}
            className="text-4xl font-bold  dark:text-white"
          >
            <span
              className="text-white bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-lg px-2 
              pb-1 "
            >
              Ayaan's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            You can sign up with your email and password or with Google
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your username" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : "Sign Up" }
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">Sign In</Link>
          </div>

          {errorMessage && (<Alert className="mt-5" color="failure">
            {errorMessage}
          </Alert>)}
        </div>
      </div>
    </div>
  );
}

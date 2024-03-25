import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { UserContext } from "./UserContext"; // Import UserContext

function LoginSignup() {
  const [signUp, setSignUp] = useState(false);
  const [error, setError] = useState(null);
  const { setUser } = useContext(UserContext); // Use UserContext

  const history = useHistory();

  const handleClick = () => setSignUp((signUp) => !signUp);
  const loginSchema = yup.object().shape({
    username: yup.string().required("Please enter a username"),
    password: yup.string().required("Please enter a password"),
  });

  const signupSchema = yup.object().shape({
    username: yup.string().required("Please enter a username"),
    password: yup.string().required("Please enter a password"),
    email: yup.string().email(),
    name: yup.string().required("Please enter your name"),
    phone: yup
      .string()
      .matches(/^[0-9]{10}$/, "Please enter a valid phone number"),
    role: yup.string().required("Please select a role"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      name: "",
      password: "",
      phone: "",
      role: "",
    },
    validationSchema: signUp ? signupSchema : loginSchema,
    onSubmit: (values) => {
      console.log("Form data:", values);
      fetch(signUp ? "/signup" : "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((res) => {
        console.log("Server response:", res);
        if (res.ok) {
          res.json().then((user) => {
            console.log(user);
            setUser(user); // Use setUser from UserContext
            history.push("/");
            localStorage.setItem("isUserLoggedIn", "true");
            localStorage.setItem("userRole", user.role);
            localStorage.setItem("userId", user.id);
            localStorage.setItem("user", JSON.stringify(user));
          });
        } else {
          res.json().then((error) => setError(error.message));
        }
      });
    },
  });

  return (
    <div className="login-signup-container p-8">
      {error && <h2 className="text-red-500"> {error} </h2>}
      <h2 className="text-2xl font-bold">Sign in</h2>
      <h2>{signUp ? "Already have an account?" : "New User?"}</h2>
      <button
        onClick={handleClick}
        className="bg-blue-500 text-white p-2 rounded mt-2"
      >
        {signUp ? "Log In!" : "Register now!"}
      </button>
      {formik.errors &&
        Object.values(formik.errors).map((error) => (
          <h2 className="text-red-500">{error}</h2>
        ))}
      <form onSubmit={formik.handleSubmit} className="space-y-4 mt-4">
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          className="border p-2 rounded"
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          className="border p-2 rounded"
        />
        {signUp && (
          <>
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              className="border p-2 rounded"
            />
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              className="border p-2 rounded"
            />
            <label>Contact Number</label>
            <input
              type="text"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              className="border p-2 rounded"
            />
            <label>Role</label>
            <select
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              className="border p-2 rounded"
            >
              <option value="">Select a role</option>
              <option value="borrower">Borrower</option>
              <option value="loan_officer">Loan Officer</option>
              <option value="real_estate_agent">Real Estate Agent</option>
            </select>
          </>
        )}
        <input
          type="submit"
          value={signUp ? "Sign Up!" : "Log In!"}
          className="bg-blue-500 text-white p-2 rounded mt-2"
        />
      </form>
    </div>
  );
}

export default LoginSignup;

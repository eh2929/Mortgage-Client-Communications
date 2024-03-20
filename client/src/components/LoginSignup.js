import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useFormik } from "formik";
import * as yup from "yup";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
  font-family: Arial;
`;


  const Heading = styled.h2`
    margin-bottom: 10px; 
  `;
  const StyledButton = styled.button`
    margin-bottom: 20px; 
  `;

  export const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 300px; 
    margin: 10px auto; 
    padding: 20px; 
    font-family: Arial;
    font-size: 20px; 
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); 
    border-radius: 5px; 
    input[type="submit"] {
      background-color: #42ddf5;
      color: white;
      height: 40px;
      font-family: Arial;
      font-size: 20px; 
      margin-top: 10px;
      margin-bottom: 10px;
      border: none; 
      cursor: pointer; 
      transition: background-color 0.3s ease; 
    }
    input[type="submit"]:hover {
      background-color: #5ee7f8; 
    }
  `;

function LoginSignup({ updateUser }) {
  const [signUp, setSignUp] = useState(false);
  const [error, setError] = useState(null);

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
        console.log("Server response:", res)
        if (res.ok) {
          res.json().then((user) => {
            console.log(user);
            updateUser(user);
            history.push("/");
            localStorage.setItem("isUserLoggedIn", "true");
            localStorage.setItem("userRole", user.role);
          });
        } else {
          res.json().then((error) => setError(error.message));
        }
      });
    },
  });



  return (
    <Container>
      {error && <Heading style={{ color: "red" }}> {error} </Heading>}
      <Heading style={{ fontSize: "24px" }}>Sign in</Heading>
      <Heading style={{ fontSize: "14px" }}>{signUp ? "Already have an account?" : "New User?"}</Heading>
      <StyledButton onClick={handleClick}>
        {signUp ? "Log In!" : "Register now!"}
      </StyledButton>
      {formik.errors &&
        Object.values(formik.errors).map((error) => (
          <Heading style={{ color: "red", fontSize: "12px" }}>{error}</Heading>
        ))}
      <Form onSubmit={formik.handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        {signUp && (
          <>
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            <label>Contact Number</label>
            <input
              type="text"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
            />
            <label>Role</label>
            <select
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
            >
              <option value="">Select a role</option>
              <option value="borrower">Borrower</option>
              <option value="loan_officer">Loan Officer</option>
              <option value="real_estate_agent">Real Estate Agent</option>
            </select>
          </>
        )}
        <input type="submit" value={signUp ? "Sign Up!" : "Log In!"} />
      </Form>
    </Container>
  );
}

export default LoginSignup;


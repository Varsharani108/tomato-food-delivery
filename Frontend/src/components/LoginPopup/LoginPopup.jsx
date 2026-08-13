import React, { useState, useContext } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"

const LoginPopup = ({ setShowLogin }) => {

  const { url, setToken } = useContext(StoreContext)

  const [currState, setCurrState] = useState("Sign Up")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  // Change handler
  const onChangeHandler = (event) => {

    const name = event.target.name
    const value = event.target.value

    if (name === "name") {
      setName(value)
    }

    if (name === "email") {
      setEmail(value)
    }

    if (name === "password") {
      setPassword(value)
    }
  }


  // Login / Register handler
  const onLogin = async (event) => {

    event.preventDefault()

    let newUrl = url

    if (currState === "Login") {
      newUrl += "/api/user/login"
    } else {
      newUrl += "/api/user/register"
    }

    const data = {
      name,
      email,
      password
    }

    const response = await axios.post(newUrl, data)

    if (response.data.success) {
      setToken(response.data.token)
      localStorage.setItem("token", response.data.token)
      setShowLogin(false)
    } else {
      alert(response.data.message)
    }
  }


  return (

    <div className='login-popup'>

      <form
        onSubmit={onLogin}
        className='login-popup-container'
      >

        <div className="login-popup-title">

          <h2>{currState}</h2>

          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />

        </div>


        <div className="login-popup-inputs">

          {currState === "Login" ? (
            <></>
          ) : (

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={name}
              onChange={onChangeHandler}
              required
            />

          )}


          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={email}
            onChange={onChangeHandler}
            required
          />


          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onChangeHandler}
            required
          />

        </div>


        <button type="submit">
          {currState === "Sign Up"
            ? "Create account"
            : "Login"}
        </button>


        <div className="login-popup-condition">

          <input
            type="checkbox"
            required
          />

          <p>
            By continuing, I agree to the terms of use & privacy policy.
          </p>

        </div>


        {currState === "Login" ? (

          <p>
            Create a new account?

            <span onClick={() => setCurrState("Sign Up")}>
              Click here
            </span>
          </p>

        ) : (

          <p>
            Already have an account?

            <span onClick={() => setCurrState("Login")}>
              Login here
            </span>
          </p>

        )}

      </form>

    </div>
  )
}

export default LoginPopup
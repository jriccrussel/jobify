import React, { useEffect, useState } from 'react'
import { Logo, FormRow, Alert } from '../components'
import Wrapper from '../assets/wrappers/RegisterPage'
import { useAppContext } from '../context/appContext'
import { useNavigate } from 'react-router-dom'

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
}

const Register = () => {  
  const [values, setValues] = useState(initialState)
  const navigate = useNavigate()
  const { user, isLoading, showAlert, displayAlert, registerUser, loginUser, setupUser } = useAppContext()
  console.log("%c Line:19 🥛 user", "color:#7f2b82", user);

  // global context & useNavigate later

  const handleChange = (e) => {
    setValues({...values, [e.target.name]: e.target.value})
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const {
      name,
      email,
      password,
      isMember
    } = values

    if(!email || !password || (!isMember && !name)){
      // from DISPLAY_ALERT
      displayAlert()
      return
    }

    const currentUser = { name, email, password, }

    if(isMember){
      // console.log("%c Line:46 🥕", "color:#ea7e5c", 'already a member');
      // from LOGIN_USER_BEGIN, LOGIN_USER_SUCCESS, LOGIN_USER_ERROR
      // loginUser(currentUser)
      // from SETUP_USER_BEGIN, SETUP_USER_SUCCESS, SETUP_USER_ERROR
      setupUser({
        currentUser,
        endPoint: 'login',
        alertText: 'Login Successful! Redirecting...'
      })
    } else {
      // from REGISTER_USER_BEGIN, REGISTER_USER_SUCCESS, REGISTER_USER_ERROR
      // registerUser(currentUser)
      // from SETUP_USER_BEGIN, SETUP_USER_SUCCESS, SETUP_USER_ERROR
      setupUser({
        currentUser,
        endPoint: 'register',
        alertText: 'User Created! Redirecting...'
      })
    }

    console.log(values)
  }

  const toggleMember = () => {
    setValues({...values, isMember: !values.isMember})
  }

  useEffect(() => {
    if(user){
      setTimeout(() => {
        navigate('/')
      }, 3000)
    }
  }, [user, navigate])
  
  return (
    <Wrapper>
      <form className='form' onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? 'Login' : 'Register'}</h3>
        {showAlert && <Alert />}
        {/* name input */}
        {!values.isMember && (
           <FormRow 
            type={'text'}
            name={'name'}
            value={values.name}
            handleChange={handleChange}
          />
        )}

        {/* email input */}
        <FormRow 
          type={'email'}
          name={'email'}
          value={values.email}
          handleChange={handleChange}
        />

        {/* password input */}
        <FormRow 
          type={'password'}
          name={'password'}
          value={values.password}
          handleChange={handleChange}
        />
        
        <button 
          type='submit' 
          className="btn btn-block"
          disabled={isLoading}
        >submit</button>

        {/* for test user */} 
        <button
          type='button'
          className='btn btn-block btn-hipster'
          disabled={isLoading}
          onClick={() => {
            setupUser({
              currentUser: { email: 'testUser@test.com', password: 'secret' },
              endPoint: 'login',
              alertText: 'Login Successful! Redirecting...',
            });
          }}
        >
          {isLoading ? 'loading...' : 'demo app'}
        </button>

        {/* toggle button isMember */}
        <p>
          {values.isMember ? 'Not a member yet?' : 'Already a member?'}

          <button 
            type='button'
            className="member-btn"
            onClick={toggleMember}
          >{values.isMember ? 'Register' : 'Login'}</button>
        </p>
      </form>
    </Wrapper>
  )
}

export default Register
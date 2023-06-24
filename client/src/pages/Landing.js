import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import main from '../assets/images/main.svg'
import Wrapper from '../assets/wrappers/Testing'
import { Logo } from '../components'
import { useAppContext } from '../context/appContext'
// import styled from 'styled-components'

const Landing = () => {
  const { user } = useAppContext()

  return (
    <React.Fragment>
      {user && <Navigate to='/' />}
      <Wrapper>
        <nav>
          <Logo />
        </nav>
        <div className="container page">
            <div className="info">
                <h1>Job <span>Tracking</span> App</h1>
                <p>
                  I'm baby williamsburg taxidermy put a bird on it neutral milk hotel, meggings adaptogen sriracha everyday carry thundercats celiac kogi. Art party JOMO fingerstache air plant aesthetic gatekeep ethical cred gluten-free, tousled man braid same readymade mixtape. 
                </p>
                <Link to='/register' className="btn btn-hero">Login/Register</Link>
            </div>
            <img src={main} alt="job hunt" className="img main-img" />
        </div>
      </Wrapper>
    </React.Fragment>
  )
}
 
// const Wrapper =  styled.main`
//     nav {
//         width: var(--fluid-width);
//         max-width: var(--max-width);
//         margin: 0 auto;
//         height: var(--nav-height);
//         display: flex;
//         align-items: center;
//     }

//     .page {
//         min-height: calc(100vh - var(--nav-height));
//         display: grid;
//         align-items: center;
//         margin-top: -3rem;
//     }
    
//     h1 {
//         font-weight: 700;
//         span{
//             color: var(--primary-500);
//         }
//     }
    
//     p{
//         color: var(--gret-600);
//     }

//     .main-img{
//         display: none;
//     }
//     @media(min-width: 992px){
//         .page {
//             grid-template-columns: 1fr 1fr;
//             column-gap: 3rem;
//         }
//         .main-img {
//             display: block;
//         }
//     }
// `
export default Landing
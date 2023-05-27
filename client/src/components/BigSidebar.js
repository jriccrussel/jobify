import React from 'react'
import Wrapper from '../assets/wrappers/BigSidebar'
import { useAppContext } from '../context/appContext'
import Logo from './Logo'
import NavLinks from './NavLinks'

const BigSidebar = () => {
  const { showSidebar, toggleSidebar } = useAppContext();
  return (
    <Wrapper>
      <div
        className={
          showSidebar ? 'sidebar-container ' : 'sidebar-container show-sidebar'
        }
      >
        <div className='content'>
          <header>
            <Logo />
          </header>
          <NavLinks/>
          {/* <NavLinks toggleSidebar={toggleSidebar}/> */}
        </div>
      </div>
    </Wrapper>
  )
}

export default BigSidebar
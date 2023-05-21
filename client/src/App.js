import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { Register, Error, Landing, ProtectedRoute } from './pages'
import { AddJob, AllJobs, Profile, SharedLayout, Stats } from './pages/dashboard'

function App() {
  return (
    // <div>
    //   <Landing />
    // </div>
    <BrowserRouter>
      {/* <nav>
        <Link to='/'>Dashboard</Link>
        <Link to='/register'>Register</Link>
        <Link to='/landing'>Landing</Link>
      </nav> */}
      <Routes>
        <Route 
          path='/' 
          element={
            <ProtectedRoute>
              <SharedLayout/>
            </ProtectedRoute>
        }>
          <Route index element={<Stats/>}/>
          {/* <Route path="stats" element={<Stats/>}/> */}
          <Route path="all-jobs" element={<AllJobs/>}/>
          <Route path="add-job" element={<AddJob/>}/>
          <Route path="profile" element={<Profile/>}/>
        </Route>
        <Route path='/register' element={<Register/>} />
        <Route path='/landing' element={<Landing/>} />
        <Route path='*' element={<Error/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import './App.css'
import Profile from './components/Profile'
import Login from './components/Login'
import UserContext from './context/UserContext'
import UserContextProvider from './context/UserContextProvider'

function App() {

  return (
    <UserContextProvider>
      <h1>Learning Context API in React</h1>
      <Login />
      <Profile />
    </UserContextProvider>
  )
}

export default App

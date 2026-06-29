import './App.css'
import Card from './components/Card'

function App() {
  let myObj = {
    username: "divya",
    age: 25
  }
  let newArr = [1, 2, 3];
  return (
    <>
      <h1 className="bg-green-400 text-black p-4 rounded-xl">Tailwind Test</h1>
      <Card username="Bergen" btnTxt="Book trip to Bergen"/>
      <Card username="Stavanger" />
    </>
  )
}

export default App

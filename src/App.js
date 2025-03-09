import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [attempt, setAttempt] = useState(0);
  const [target, setTarget] = useState("Bread");
  const [slots, setSlots] = useState([]);
  const [switch1, setSwitch] = useState(false);
  const [win, setWin] = useState(false)

  useEffect(()=>{
     // Set Word to Guess
     if (!switch1){
      loadTextFile();
      setSwitch(true)
    }

  },[switch1])

  async function loadTextFile() {
    try {
        const response = await fetch('/en.txt');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const text = await response.text();
        const wordsArray = text.split('\r\n').filter(word => word.length === 5);
        setTarget(wordsArray[Math.floor(Math.random()*wordsArray.length)])
    } catch (error) {
        console.error("Error loading file:", error);
    }
  }
  
  useEffect(() => {
    console.log(target)
    function handleKeyDown(event) {
      if (event.key.length === 1 && event.key.match(/[a-zA-Z]/) && attempt <= 5) {
        setSlots((prevSlots) => (prevSlots.length < 5 ? [...prevSlots, event.key] : prevSlots));
      }
  
      if (event.key === "Enter" && win === false) {
        console.log(win)
        console.log(slots)
        setSlots((prevSlots) => {
          console.log(attempt)
          let result = checkWord(prevSlots);
          console.log(result);
          if (prevSlots.length === 5 && attempt <  5) {
            if (result === "Correct") {
              colorize(["Green", "Green", "Green", "Green", "Green"], attempt);
              console.log("You guessed the word!");
              setWin(true)
              showEnd(result)
              const resetButton = document.getElementById("resetButton");
              resetButton.addEventListener("click", () => {
                console.log("Hello")
                window.location.reload();
              });
              return prevSlots
            } else {
              console.log("Wrong Guess")
              colorize(result, attempt);
              setAttempt((prev) => prev + 1);
            }
            return [];
          }else if((prevSlots.length === 5 && attempt === 5)){
            if (result === "Correct" &&  win === false){
              colorize(["Green", "Green", "Green", "Green", "Green"], attempt);
              console.log("You got it in your last attempt!")
              showEnd(result)
              const resetButton = document.getElementById("resetButton");
              resetButton.addEventListener("click", () => {
                console.log("Hello")
                window.location.reload();
              });
              setWin(true)
            }else if (result != "Correct" &&  win === false){
              console.log("Game Over")
              let result = checkWord(prevSlots);
              colorize(result, attempt);
              showEnd(result)
              const resetButton = document.getElementById("resetButton");
              resetButton.addEventListener("click", () => {
                console.log("Hello")
                window.location.reload();
              });
              setWin(true)
            }
          }
          return prevSlots;
        });
      }
  
      if (event.key === "Backspace" && attempt <= 5) {
        setSlots((prevSlots) => prevSlots.slice(0, -1)); // Remove last character
      }
    }
  
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown); // Cleanup
  }, [attempt, target, win]); 
  
  useEffect(() => {
    updateSlots(slots, attempt);
  }, [slots, attempt]);
  
  useEffect(() => {
    const resetButton = document.getElementById("resetButton");
    if (resetButton) {
      resetButton.addEventListener("click", () => {
        console.log("Hello")
        window.location.reload();
      });
    }
  }, [attempt]);

  // Creates Result Message and Button to reset game
  function showEnd(result){
    console.log("Game Over!!")
    if (result !== "Correct"){
      const showResult = document.createElement("p")
      const showButton = document.createElement("Button")
      showButton.id = "resetButton"
      showButton.innerHTML = "New Word"
      const mainDiv = document.getElementById("Main")
      showResult.innerHTML = "Nice Try! The word was "+target+"!"
      mainDiv.appendChild(showResult)
      mainDiv.appendChild(showButton)
    }else{
      const showResult = document.createElement("p")
      const mainDiv = document.getElementById("Main")
      showResult.innerHTML = "Good Job! The word was "+target+"!"
      const showButton = document.createElement("Button")
      showButton.id = "resetButton"
      showButton.innerHTML = "New Word"
      mainDiv.appendChild(showResult)
      mainDiv.appendChild(showButton)
    }
  }

  // Updates the slots associated with the current attempt
  function updateSlots(slots, attempt) {
    for (let i = 0; i < 5; i++) {
      const element = document.getElementById(attempt * 5 + i);
      if (element) {
        element.innerHTML = slots[i] ? slots[i].toUpperCase() : " ";
      }
    }
  }
  // Checks guessed with target word
  function checkWord(slots){
    let slotsCopy = [...slots]; // Avoid mutating original state
    let listTarget = Array.from(target.toLowerCase())
    let colorResult = []
    let inARow = 0
    // First Check if there any words in the same index that match
    for (let i = 0; i < slotsCopy.length ; i++){
      if (slotsCopy[i] === listTarget[i]){
        slotsCopy.splice(i,1)
        listTarget.splice(i,1)
        colorResult.push("Green")
        inARow += 1
        i -= 1
      }else{
        colorResult.push("-")
        inARow = 0
      }
    }
    if (inARow === 5){
      return "Correct"
    }
    // Then check if there are any letters, but in the wrong location
    let f = 0
    for (let i = 0; i < colorResult.length ; i++){
      if (colorResult[i] === "-"){
        for (let j = 0 ; j < listTarget.length ; j++){
          if (slotsCopy[f] === listTarget[j]){
            colorResult[i] = "Yellow"
            slotsCopy.splice(f,1)
            listTarget.splice(j, 1)
            f-= 1
          }
        }
        if (colorResult[i] === "-"){
          colorResult[i] = "Grey"
        }
        f += 1
      }
    }
    return colorResult
  }

  // Colirzes the slots after user has guessed
  function colorize(list, attempt){
    for (let i = 0; i <= 4; i++){
      const element = document.getElementById(attempt*5 + i)
      if (element){
        element.style.backgroundColor = list[i]
      }
    }
  }

  return (
    <div className="App">
      <div className="header">
        <h1>WORDLE</h1>
      </div>
      <div className="Main" id = "Main">
        <div className="body1">
          {Array.from({ length: 30 }, (_, index) => (
            <h2 className="letterBack" id={index} key={index}>
              {" "}
            </h2>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

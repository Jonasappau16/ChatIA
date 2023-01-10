import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(elemant){
  elemant.textContent = '';

  loadInterval = setInterval(() => {
    elemant.textContent += '.';

    if (elemant.textContent === '....'){
      elemant.textContent = ' ';
    }
  },300)
}

function typeText(elemant, text){
  let index = 0;
  
  let interval = setInterval(() =>{
    if(index < text.length){
      elemant.innerHTML += text.charAt(index);
      index++;
    }else{
      clearInterval(interval);
    }
  }, 20)
}

//########unique ID generator#######//

function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStrip(isAi, value, uniqueId) {
  return (`<div class="wrapper ${isAi && "ai"}">
      <div class="chat">
        <div class = "profile">
          <img src="${isAi ? bot : user}" alt="${
            isAi ? "bot" : "user"}" />
            </div>
            <div class='message' id= ${uniqueId}>${value}</div>
          </div>
        </div>
       `
       )
    }

    // handle submit //
    
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const data = new FormData(form);
    
      //user's chatstripe
       chatContainer.innerHTML += chatStrip(false, data.get("prompt"));
      
       form.reset();
    
      // bot's chatstripe
    
      const uniqueId = generateUniqueId();
      chatContainer.innerHTML += chatStrip(true, "", uniqueId);
    
      chatContainer.scrollTop = chatContainer.scrollHeight;
    
      const messageDiv = document.getElementById(uniqueId);
      loader(messageDiv);

      // fetch data from server -> bot's response

      const response = await fetch('https://chatai-fwjd.onrender.com',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt:data.get('prompt')
        })
      })

      clearInterval(loadInterval);
      messageDiv.innerHTML = '';

      if(response.ok){
        const data = await response.json();
        const parsedData = data.bot.trim();

        console.log({ parsedData })

        typeText(messageDiv, parsedData);
      }else{
        const err = await response.text();

        messageDiv.innerHTML = 'Ooops!! server is down';
         //alert(err);
      }
    }

    form.addEventListener("submit", handleSubmit);
    form.addEventListener("keyup", (e) => {
      if (e.keyCode === 13) {
        handleSubmit(e);
      }
    });
const links = document.querySelectorAll(".links li a");
const activeStatus = document.getElementById("active-status");

[...links].forEach((element) => {
  element.addEventListener("click", function () {
    activeStatus.dataset.active = this.dataset.setActive;
  });
});

function typingEffect(element, speed = 9.2) {
  let iteration = 0; // Track iteration for typing
  let typingText = []; // Track characters for the typing animation
  const mainWord = element.innerHTML;
  const arrMainWord = mainWord.split(""); // Split the word into characters

  const interval = setInterval(() => {
    // Add the next character to the display
    typingText.push(arrMainWord[iteration]);
    element.innerHTML = typingText.join("");
    iteration++;

    // Stop the animation when the word is complete
    if (iteration >= arrMainWord.length) {
      clearInterval(interval);
    }
  }, speed);
}

document.addEventListener("DOMContentLoaded", function () {
  typingEffect(document.getElementById("chat-bot-message"));
});

async function sendMessage(userMessage) {
  const url = "https://chatgpt-42.p.rapidapi.com/gpt4";

  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": "6daf68dcadmsh9963831283174afp154174jsnca7f8df07274",
      "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: `This chat is regarding documenting a sale done by a Sales Rep that want to document their latest Sales Deal, you
          will ask them these questions one by one accordingly, when they answer one you will follow up with the next :
          Questions:
          Which company did you sell to?\n
          Who is the person that signed the contract?\n
          What did he buy?\n
          How much was the contract value?\n
          How long is the contract term?\n
          Why did they buy? What problems did you solve?\n 
          Who helped you close this deal and how?\n

          you already said to them that :\n
          "Hello to Frontline AI, where your sales achievements come to life. Turn your efforts into a dynamic portfolio that showcases your skills, drives growth, and earns the recognition you deserve. Start by telling us:
          Which company did you sell to?"\n
          they will answer you, so the logical next question is "Who is the person that signed the contract?" and so on with the rest of the questions
          here is the user reply to the question you already said: "${userMessage}"`,
        },
      ],
      web_access: false,
    }),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json(); // Parse the response as JSON
    return result; // Assuming the response structure
  } catch (error) {
    console.error(error);
    return "Sorry, there was an error processing your request."; // Default error response
  }
}

const form = document.getElementById("form");
const userText = document.getElementById("userText");

form.addEventListener("submit", async function (e) {
  let check = true;
  e.preventDefault();
  if (check) {
    const parentElement = document.querySelector(".main-chat"); // Select the parent element

    // User's message
    const userMessageDiv = document.createElement("div");
    userMessageDiv.innerHTML = `
      <div class="message">
        <div class="image">
          <img class='danny' src="./media/images/danny.webp" alt="front-line logo" />
        </div>
        <p>
          ${userText.value} <!-- User's message -->
        </p>
      </div>
    `;
    parentElement.appendChild(userMessageDiv); // Append user's message to chat

    // Send user message to bot and await response
    const botReply = await sendMessage(userText.value);

    // Display the bot's reply
    const botMessageDiv = document.createElement("div");
    botMessageDiv.innerHTML = `
      <div class="message">
        <div class="image">
          <img src="./media/images/small-logo.svg" alt="front-line logo" />
        </div>
        <p>
          ${botReply.result} <!-- Bot's reply -->
        </p>
      </div>
    `;
    parentElement.appendChild(botMessageDiv); // Append bot's reply to chat
    typingEffect(botMessageDiv);

    check = false; // Disable further submissions temporarily

    // Re-enable after 3 seconds
    setTimeout(() => {
      check = true;
    }, 3000);
  }
});

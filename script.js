const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT6u5v82Zlu2YXySiHlajDCyj2GuOC8KThqc_TNNTiDMNt4YJ09KkQ9f5aO6MoVk_dptT3947ZZ5XAM/pub?output=csv";

async function fetchQuestions() {
  try {
    const response = await fetch(csvUrl);
    const data = await response.text();
    console.log("Raw CSV Data:", data); // Check if data is fetched

    const rows = data.split("\n").slice(1); // Remove header row
    console.log("Rows:", rows); // Check if rows are split correctly

    const questions = rows.map(row => {
      const [question, optionA, optionB, optionC, optionD, correctAnswer, explanation] = row.split(",");
      return {
        question,
        options: [optionA, optionB, optionC, optionD],
        correctAnswer,
        explanation
      };
    });

    console.log("Processed Questions:", questions); // Check if questions are processed correctly
    return questions;
  } catch (error) {
    console.error("Error fetching or processing data:", error);
    return [];
  }
}

function displayQuestions(questions) {
  const container = document.getElementById("questions-container");
  container.innerHTML = "";

  if (questions.length === 0) {
    container.innerHTML = "<p>No questions found.</p>"; // Display a message if no questions are loaded
    return;
  }

  questions.forEach((q, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";
    questionDiv.innerHTML = `
      <h3>${index + 1}. ${q.question}</h3>
      <div class="options">
        ${q.options.map((option, i) => `
          <div class="option" data-question="${index}" data-option="${i}">
            ${String.fromCharCode(65 + i)}. ${option}
          </div>
        `).join("")}
      </div>
      <p class="feedback" id="feedback-${index}"></p>
    `;
    container.appendChild(questionDiv);
  });

  document.querySelectorAll(".option").forEach(option => {
    option.addEventListener("click", handleAnswer);
  });
}

function handleAnswer(event) {
  const questionIndex = event.target.getAttribute("data-question");
  const selectedOption = event.target.getAttribute("data-option");
  const correctAnswer = questions[questionIndex].correctAnswer.charCodeAt(0) - 65;

  const feedback = document.getElementById(`feedback-${questionIndex}`);
  feedback.textContent = "";

  if (selectedOption == correctAnswer) {
    event.target.classList.add("correct");
    feedback.textContent = "Correct!";
  } else {
    event.target.classList.add("incorrect");
    feedback.textContent = `Incorrect. The correct answer is ${String.fromCharCode(65 + correctAnswer)}.`;
  }
}

let questions = [];
window.onload = async () => {
  questions = await fetchQuestions();
  displayQuestions(questions);
};
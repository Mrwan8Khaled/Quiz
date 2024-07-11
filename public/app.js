const q1 = document.getElementById("q1");
const q2 = document.getElementById("q2");
const q3 = document.getElementById("q3");
const q4 = document.getElementById("q4");
const que = document.getElementById("qs");
let ans = null;

function quest(url) {
  fetch(url, {
    method: "GET",
    headers: {},
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.questions.length === 0) {
        throw new Error("No data available.");
      }

      // Select a random question from the data
      var randomIndex = Math.floor(Math.random() * data.questions.length);
      var ques = data.questions[randomIndex];

      if (!ques || !ques.question || !ques.A || !ques.B || !ques.C || !ques.D || !ques.answer) {
        throw new Error("Invalid question format.");
      }

      que.innerHTML = `${ques.question}`;
      q1.innerHTML = `${ques.A}`;
      q2.innerHTML = `${ques.B}`;
      q3.innerHTML = `${ques.C}`;
      q4.innerHTML = `${ques.D}`;
      ans = `${ques.answer}`;
    })
    .catch((error) => {
      console.error("Error in GET request:", error);
      que.innerHTML = "<p>Error loading data.</p>";
    });
}

// Adjust the path to your JSON file as necessary
quest("../Q&A.json");

let currentQuestionIndex;
let questionsData;
let selectedRows; 

function readExcel() {
  const input = document.getElementById('excelFile');
  const excelDataDiv = document.getElementById('excelData');

  const file = input.files[0];
  if (!file) {
    alert('Please select an Excel file.');
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    // Assuming you have only one sheet in the Excel file
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet data to JSON
    questionsData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Display the first question
    nextQuestion();
  };

  reader.onerror = function (ex) {
    console.error(ex);
    alert('Error reading the file. Please try again.');
  };

  reader.readAsArrayBuffer(file);
}

function nextQuestion() {
  // Clear previous question data
  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';

  // Clear result and options table
  const resultDiv = document.getElementById('result');
  resultDiv.textContent = '';

  const optionsTableDiv = document.getElementById('optionsTable');
  optionsTableDiv.innerHTML = '';

  // Randomly select four different rows
  const rowsCount = questionsData.length;
  selectedRows = [];
  while (selectedRows.length < 4) {
    const randomIndex = Math.floor(Math.random() * rowsCount);
    if (!selectedRows.includes(randomIndex)) {
      selectedRows.push(randomIndex);
    }
  }

  // Randomly choose one row as the question
  currentQuestionIndex = Math.floor(Math.random() * 4);
  const questionData = questionsData[selectedRows[currentQuestionIndex]];

  // Display the question
  const questionDiv = document.getElementById('question');
  questionDiv.textContent = 'Question: ' + questionData.slice(1).join(', ');

  // Display the options
  for (let i = 0; i < 4; i++) {
    const optionButton = document.createElement('button');
    optionButton.textContent = questionsData[selectedRows[i]][0]; // Display the drug name
    optionButton.addEventListener('click', () => checkAnswer(i));
    optionsDiv.appendChild(optionButton);
  }
}


function checkAnswer(selectedIndex) {
  const correctIndex = currentQuestionIndex;

  const resultDiv = document.getElementById('result');
  if (selectedIndex === correctIndex) {
    resultDiv.textContent = 'Correct!';
  } else {
    resultDiv.textContent = 'Incorrect. Correct answer: ' + questionsData[selectedRows[correctIndex]][0];
    
    // Display the four options' data in a table
    const selectedRowsData = selectedRows.map(index => questionsData[index].slice(0, 8)); // Include drug name and the first 7 characteristics
    displayOptionsTable(selectedRowsData);
  }

  // Show the "Next Question" button
  const nextQuestionButton = document.getElementById('nextQuestion');
  nextQuestionButton.style.display = 'block';
}

function displayOptionsTable(selectedRowsData) {
  const optionsTableDiv = document.getElementById('optionsTable');
  optionsTableDiv.innerHTML = ''; // Clear previous data

  const table = document.createElement('table');
  const headerRow = document.createElement('tr');

  // Create table headers based on the headers from the original Excel data
  const headers = questionsData[0].slice(0, 8); // Include drug name and the first 7 characteristics
  for (const header of headers) {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  }

  table.appendChild(headerRow);

  // Create table rows for the selected options only
  for (const rowData of selectedRowsData) {
    const row = document.createElement('tr');
    for (let i = 0; i < rowData.length; i++) {
      const td = document.createElement('td');
      td.textContent = rowData[i];
      row.appendChild(td);
    }
    table.appendChild(row);
  }

  optionsTableDiv.appendChild(table);
}

function resetQuiz() {
  const questionDiv = document.getElementById('question');
  questionDiv.textContent = '';

  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';

  const resultDiv = document.getElementById('result');
  resultDiv.textContent = '';

  const optionsTableDiv = document.getElementById('optionsTable');
  optionsTableDiv.innerHTML = ''; // Clear previous data

  const nextQuestionButton = document.getElementById('nextQuestion');
  nextQuestionButton.style.display = 'none';
}

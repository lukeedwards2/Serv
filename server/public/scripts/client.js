console.log('client.js is sourced!');

// Get references to DOM elements
const calculatorForm = document.querySelector('[data-testid="calculator"]');
const numOneInput = document.querySelector('[data-testid="numOne"]');
const numTwoInput = document.querySelector('[data-testid="numTwo"]');
const operatorButtons = document.querySelectorAll('[data-testid="calculator"] button:not([type="submit"])');
const equalsButton = document.querySelector('[data-testid="calculator"] button[type="submit"]');
const clearButton = document.querySelector('[data-testid="calculator"] button[type="button"]');
const recentResultSection = document.querySelector('[data-testid="recentResult"]');
const resultHistorySection = document.querySelector('[data-testid="resultHistory"]');

let currentOperator = '+';

// Fetch calculation history on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchCalculations();
});

// Event listeners for operator buttons
operatorButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    currentOperator = event.target.textContent;
  });
});

// Event listener for form submission
calculatorForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const numOne = parseFloat(numOneInput.value);
  const numTwo = parseFloat(numTwoInput.value);

  if (isNaN(numOne) || isNaN(numTwo)) {
    alert('Please enter valid numbers');
    return;
  }

  const calculation = {
    numOne,
    numTwo,
    operator: currentOperator
  };

  // Send calculation to server
  postCalculation(calculation);
});

// Event listener for clear button
clearButton.addEventListener('click', (event) => {
  event.preventDefault();
  numOneInput.value = '';
  numTwoInput.value = '';
  currentOperator = '+';
});

// Function to fetch calculations from server
function fetchCalculations() {
  axios.get('/calculations')
    .then(response => {
      const calculations = response.data;
      updateHistory(calculations);
      updateRecentResult(calculations);
    })
    .catch(error => {
      console.error('Error fetching calculations:', error);
    });
}

// Function to send new calculation to server
function postCalculation(calculation) {
  axios.post('/calculations', calculation)
    .then(response => {
      fetchCalculations();
    })
    .catch(error => {
      console.error('Error posting calculation:', error);
    });
}

// Function to update calculation history in DOM
function updateHistory(calculations) {
  resultHistorySection.innerHTML = '';
  calculations.forEach(calculation => {
    const listItem = document.createElement('li');
    listItem.textContent = `${calculation.numOne} ${calculation.operator} ${calculation.numTwo} = ${calculation.result}`;
    resultHistorySection.appendChild(listItem);
  });
}

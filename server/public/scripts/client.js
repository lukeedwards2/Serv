console.log('client.js is sourced!');

document.addEventListener('DOMContentLoaded', () => {
  const calculatorForm = document.querySelector('[data-testid="calculator"]');
  const numOneInput = document.querySelector('[data-testid="numOne"]');
  const numTwoInput = document.querySelector('[data-testid="numTwo"]');
  const recentResultSection = document.querySelector('[data-testid="recentResult"]');
  const resultHistorySection = document.querySelector('[data-testid="resultHistory"]');

  const loadCalculations = () => {
    axios.get('/calculations')
      .then(response => {
        const calculations = response.data;
        resultHistorySection.innerHTML = calculations.map(calc => {
          return `<li>${calc.numOne} ${calc.operator} ${calc.numTwo} = ${calc.result}</li>`;
        }).join('');
        if (calculations.length > 0) {
          const lastCalculation = calculations[calculations.length - 1];
          recentResultSection.innerHTML = `<h2>${lastCalculation.result}</h2>`;
        }
      })
      .catch(error => console.error('Error loading calculations:', error));
  };

  const handleCalculation = (numOne, numTwo, operator) => {
    axios.post('/calculations', { numOne, numTwo, operator })
      .then(() => {
        numOneInput.value = '';
        numTwoInput.value = '';
        loadCalculations();
      })
      .catch(error => console.error('Error making calculation:', error));
  };

  calculatorForm.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      event.preventDefault();
      const operator = event.target.textContent;

      if (operator === 'C') {
        numOneInput.value = '';
        numTwoInput.value = '';
        return;
      }

      if (operator === '=') {
        const numOne = parseFloat(numOneInput.value);
        const numTwo = parseFloat(numTwoInput.value);
        if (isNaN(numOne) || isNaN(numTwo)) {
          return;
        }
        const selectedOperator = calculatorForm.querySelector('button[selected]').textContent;
        handleCalculation(numOne, numTwo, selectedOperator);
      } else {
        const buttons = calculatorForm.querySelectorAll('button');
        buttons.forEach(button => button.removeAttribute('selected'));
        event.target.setAttribute('selected', 'selected');
      }
    }
  });

  loadCalculations();
});

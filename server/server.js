const express = require('express');
const path = require('path');
const app = express();
let PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let calculations = [];

app.get('/calculations', (req, res) => {
  res.json(calculations);
});

app.post('/calculations', (req, res) => {
  const { numOne, numTwo, operator } = req.body;
  let result;

  switch (operator) {
    case '+':
      result = numOne + numTwo;
      break;
    case '-':
      result = numOne - numTwo;
      break;
    case '*':
      result = numOne * numTwo;
      break;
    case '/':
      result = numTwo !== 0 ? numOne / numTwo : 'Error';
      break;
    default:
      return res.status(400).send('Invalid operator');
  }

  const calculation = { numOne, numTwo, operator, result };
  calculations.push(calculation);

  res.status(201).json(calculation);
});

// Start the server
const server = app.listen(PORT, () => {
  console.log('server running on: ', PORT);
});

app.closeServer = () => {
  server.close();
}

app.setCalculations = (calculationsToSet) => {
  calculations = calculationsToSet;
}

module.exports = app;
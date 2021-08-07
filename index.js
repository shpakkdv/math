const taskElement = document.getElementById('task');
const inputElement = document.getElementById('input');
const controlsElement = document.getElementById('controls');
let resultElement = document.getElementById('result');

const RESULT_STATE = {
  NONE: 'none',
  RIGHT: 'right',
  WRONG: 'wrong',
};

const OPERATION = {
  // +
  ADDITION: 'addition',
  // -
  SUBTRACTION: 'subtraction',
  // *
  MULTIPLICATION: 'multiplication',
};

/**
 * order - integer from 0
 * range - any number
 */
const ControlByOperation = {
  [OPERATION.ADDITION]: {
    order: 0,
    range: [0, 100],
    sign: '+',
    tooltip: 'Addition',
  },
  [OPERATION.SUBTRACTION]: {
    order: 1,
    range: [0, 100],
    sign: '-',
    tooltip: 'Subtraction',
  },
  [OPERATION.MULTIPLICATION]: {
    order: 2,
    range: [0, 10],
    sign: '×',
    tooltip: 'Multiplication',
  },
};

const ResultStateByAnswer = {
  true: RESULT_STATE.RIGHT,
  false: RESULT_STATE.WRONG,
};

const ClassByResultState = {
  [RESULT_STATE.RIGHT]: 'right',
  [RESULT_STATE.WRONG]: 'fail',
};

let failRunTask = false;
let previousResultState = null;
let num1, num2, result;

let operations = [OPERATION.ADDITION];

// get data from local storage
const savedOperations = localStorage.getItem('OPERATIONS');
if (savedOperations && savedOperations.length > 0) {
  operations = savedOperations;
}

// set controls
Object.values(OPERATION)
  .reduce(
    (controlsToSet, operation) => {
      const { sign, order } = ControlByOperation[operation];

      const control = document.createElement('input');
      control.setAttribute('id', operation);
      control.setAttribute('type', 'checkbox');
      operations.includes(operation) && control.setAttribute('checked', true);

      const label = document.createElement('label');
      label.setAttribute('for', operation);
      label.innerText = sign;
      
      controlsToSet[order] = [control, label];

      return controlsToSet;
    },
    [],
  )
  .forEach(([control, label] = []) => {
    if (control && label) {
      controlsElement.appendChild(control);
      controlsElement.appendChild(label);
    }
  });

// input listener
inputElement.addEventListener('keydown', (event) => {
  if (!event.target.value) {
    return;
  }

  if (event.key === 'Enter') {
    const value = parseInt(event.target.value);

    const resultState = ResultStateByAnswer[value === result];
    const prevResultState = previousResultState;

    switch (resultState) {
      case RESULT_STATE.RIGHT: {
        setNumbers();
        event.target.value = '';
        resultElement.innerText = 'Так держать!';

        previousResultState = RESULT_STATE.RIGHT;
        break;
      }

      case RESULT_STATE.WRONG: {
        resultElement.innerText = 'Иди учиться!';

        previousResultState = RESULT_STATE.WRONG;
        break;
      }
    }

    setClass(resultElement, resultState, prevResultState);
  }
});

controlsElement.addEventListener('click', () => {
  operations = getOperations();

  if (failRunTask && operations.length > 0) {
    setNumbers();
  }
});

// run the app
setNumbers();

// FUNCTIONS

/**
 * NON-PURE function
 */
function setNumbers() {
  if (operations.length === 0) {
    setTimeout(() => alert('Choose at least one operation!'), 2000);
    taskElement.innerText = 'N/A';
    inputElement.disabled = true;
    failRunTask = true;
    
    return;
  }

  if (failRunTask) {
    inputElement.disabled = false;
    failRunTask = false;
  }

  const operation = operations[getRandomInt(0, operations.length - 1)];
  const { range: [from, to], sign } = ControlByOperation[operation];

  ({ num1, num2, result } = getNumbers(from, to, operation));
  taskElement.innerText = `${num1} ${sign} ${num2} =`;
}

/**
 * NON-PURE function
 */
function getOperations(defaultOperation) {
  return Array.from(controlsElement.children)
    .filter((child) => child instanceof HTMLInputElement)
    .reduce(
      (operations, input) => {
        const { checked, id } = input;
        checked && operations.push(id);
      
        return operations;
      },
      [],
    );
}

/**
 * NON-PURE function
 */
function setClass(element, resultState, previousResultState) {
  const newClass = ClassByResultState[resultState];
  
  if (!previousResultState) {
    element.classList.add(newClass);

    return;
  }

  if (resultState === previousResultState) {
    const cloneElement = element.cloneNode(true);
    element.parentNode.replaceChild(cloneElement, element);
    resultElement = document.getElementById('result');

    return;
  }

  const prevClass = ClassByResultState[previousResultState];
  element.classList.remove(prevClass);
  element.classList.add(newClass);
}

function getNumbers(from = 0, to = 100, operation = OPERATION.ADDITION) {
  const num1 = getRandomInt(from, to);
  const num2 = getRandomInt(from, to);
  const result = getResult(num1, num2, operation);
  
  return {
    num1,
    num2,
    result,
  };
}

function getResult(num1, num2, operation = OPERATION.ADDITION) {
  switch (operation) {
    case OPERATION.ADDITION: {
      return num1 + num2;
    }

    case OPERATION.SUBTRACTION: {
      return num1 - num2;
    }

    case OPERATION.MULTIPLICATION: {
      return num1 * num2;
    }
  }
}

/**
 * Get random integer number (including min and max)
 * @param {number} min 
 * @param {number} max 
 */
function getRandomInt(minInitial, maxInitial) {
  const min = Math.ceil(minInitial);
  const max = Math.floor(maxInitial);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const taskElement = document.getElementById('task');
const inputElement = document.getElementById('input');
let resultElement = document.getElementById('result');

const RESULT_STATE = {
  NONE: 'none',
  RIGHT: 'right',
  WRONG: 'wrong',
};

const ResultStateByAnswer = {
  true: RESULT_STATE.RIGHT,
  false: RESULT_STATE.WRONG,
};

const ClassByResultState = {
  [RESULT_STATE.RIGHT]: 'right',
  [RESULT_STATE.WRONG]: 'fail',
};

let previousResultState = null;
let num1, num2, result;

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

setNumbers();

// FUNCTIONS

/**
 * NON-PURE function
 */
function setNumbers() {
  ({ num1, num2, result } = getNumbers());
  taskElement.innerText = `${num1} + ${num2} =`;
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

function getNumbers() {
  const num1 = getRandomInt(0, 100);
  const num2 = getRandomInt(0, 100);
  
  return {
    num1,
    num2,
    result: num1 + num2,
  };
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

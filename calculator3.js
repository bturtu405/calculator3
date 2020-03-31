      const MAX_CHARACTERS_FOR_INT = 15;
      const MAX_CHARACTERS_INPUT = 20;
      const MATH_ERROR_MESSAGE = 'Math Error';
      const CALCULATOR = document.getElementById('calculator');
      const CALCULATOR_INPUT = document.getElementById('calculatorInput');
      const CALCULATOR_BUTTONS = {
        plus: '+',
        minus: '-',
        multiply: '*',
        divide: '/',
        equal: '=',
        clear: 'c',
        backspace: 'Backspace',
        zero: '0',
        one: '1',
        two: '2',
        three: '3',
        four: '4',
        five: '5',
        six: '6',
        seven: '7',
        eight: '8',
        nine: '9',
        dot: '.'
      };
      const CALCULATOR_OPERATOR_SIGNS = [CALCULATOR_BUTTONS.plus, CALCULATOR_BUTTONS.minus,
        CALCULATOR_BUTTONS.divide, CALCULATOR_BUTTONS.multiply
      ];
      const CALCULATOR_ACTIONS_SIGNS = [CALCULATOR_BUTTONS.equal, CALCULATOR_BUTTONS.clear,
        CALCULATOR_BUTTONS.backspace, 'Enter'
      ];
      const MATH_OPERATOR = {
        '+': (firstNumber, secondNumber) => {
          return firstNumber + secondNumber;
        },
        '-': (firstNumber, secondNumber) => {
          return firstNumber - secondNumber;
        },
        '*': (firstNumber, secondNumber) => {
          return firstNumber * secondNumber;
        },
        '/': (firstNumber, secondNumber) => {
          return firstNumber / secondNumber;
        }
      };

      let isNewEquation = true;
      let equations = [];

      CALCULATOR_INPUT.innerHTML = '';

      const invokeClickedButton = (buttonId) => {
        const BUTTON = document.getElementById(buttonId);
        BUTTON.blur();
        keySorter(CALCULATOR_BUTTONS[buttonId]);
      }

      document.addEventListener('keydown', ({
        key
      }) => keySorter(key));

      const keySorter = (key) => {
        if (CALCULATOR_ACTIONS_SIGNS.includes(key)) {
          calcActions(key);
        } else {

          if (isNewEquation && CALCULATOR_INPUT.innerHTML.length < MAX_CHARACTERS_INPUT) {
            writeInTextbox(key);
            isNewEquation = true;
          }
        }
      }

      const writeInTextbox = (key) => {
        addZeroAtTheBeginningBeforeMinusSign();

        if (key.match(/[0-9]/) !== null && key.length === 1) {
          writeNumbers(key);
        }

        if (key === CALCULATOR_BUTTONS.dot) {
          writeDot();
        }

        if (CALCULATOR_OPERATOR_SIGNS.includes(key)) {
          writeOperator(key);
        }
      }

      const writeNumbers = (key) => {
        const IS_EQUATIONS_NOT_EMPTY = equations.length !== 0;
        const CALC_INPUT = CALCULATOR_INPUT.innerHTML;
        if (CALC_INPUT === CALCULATOR_BUTTONS.zero) {
          backspace();
        }
        if (IS_EQUATIONS_NOT_EMPTY) {
          if (equations[equations.length - 1].secondNum === CALCULATOR_BUTTONS.zero) {
            backspace();
          }
        }
        if (IS_EQUATIONS_NOT_EMPTY) {
          equations[equations.length - 1].secondNum += key;
        }
        CALCULATOR_INPUT.innerHTML += key;
      }

      const writeDot = () => {
        const CALC_INPUT = CALCULATOR_INPUT.innerHTML;
        const IS_EQUATIONS_NOT_EMPTY = equations.length !== 0;
        if (IS_EQUATIONS_NOT_EMPTY) {
          const SECOND_NUM = equations[equations.length - 1].secondNum;
          if (!SECOND_NUM) {
            CALCULATOR_INPUT.innerHTML += CALCULATOR_BUTTONS.zero + CALCULATOR_BUTTONS.dot;
            equations[equations.length - 1].secondNum = CALCULATOR_BUTTONS.zero + CALCULATOR_BUTTONS.dot;
          } else if (!SECOND_NUM.includes(CALCULATOR_BUTTONS.dot)) {
            CALCULATOR_INPUT.innerHTML += CALCULATOR_BUTTONS.dot;
            equations[equations.length - 1].secondNum += CALCULATOR_BUTTONS.dot;
          }
        } else {
          if (!CALC_INPUT) {
            CALCULATOR_INPUT.innerHTML = CALCULATOR_BUTTONS.zero + CALCULATOR_BUTTONS.dot;
          } else if (!CALC_INPUT.includes(CALCULATOR_BUTTONS.dot)) {
            CALCULATOR_INPUT.innerHTML += CALCULATOR_BUTTONS.dot;
          }
        }
      }

      const writeOperator = (key) => {
        const IS_EQUATIONS_NOT_EMPTY = equations.length !== 0;
        IS_EQUATIONS_NOT_EMPTY ? writeOperatorWhenEquationsIsNotEmpty(key)
        : writeOperatorWhenEquationsIsEmpty(key);
      }

      const writeOperatorWhenEquationsIsEmpty = (key) => {
        const CALC_INPUT = CALCULATOR_INPUT.innerHTML;
        const LAST_CHARACTER = CALC_INPUT.charAt(CALC_INPUT.length - 1);
        if (!CALC_INPUT) {
          CALCULATOR_INPUT.innerHTML = CALCULATOR_BUTTONS.zero;
          addEquation(CALCULATOR_BUTTONS.zero, key, '');
        } else if (LAST_CHARACTER === CALCULATOR_BUTTONS.dot) {
          backspace();
          addEquation(CALCULATOR_INPUT.innerHTML, key, '');
        } else {
          addEquation(CALCULATOR_INPUT.innerHTML, key, '');
        }
        CALCULATOR_INPUT.innerHTML += key;
      }

     const writeOperatorWhenEquationsIsNotEmpty = (key) =>{
       const LAST_EQUATION_SECOND_NUM = equations[equations.length - 1].secondNum;
       if (!LAST_EQUATION_SECOND_NUM) {
         equations[equations.length - 1].operator = key;
         const LAST_EQUATION_FIRST_NUM = equations[equations.length - 1].firstNum;
         backspace();
         addEquation(LAST_EQUATION_FIRST_NUM, key, '');
       } else if (LAST_EQUATION_SECOND_NUM.charAt(LAST_EQUATION_SECOND_NUM.length - 1) ===
         CALCULATOR_BUTTONS.dot) {
         backspace();
         addEquation(LAST_EQUATION_SECOND_NUM, key, '');
       } else {
         addEquation(LAST_EQUATION_SECOND_NUM, key, '');
       }
       CALCULATOR_INPUT.innerHTML += key;
     }

      const addEquation = (firstNum, operator, secondNum) => {
        equations.push({
          firstNum: firstNum,
          operator: operator,
          secondNum: secondNum
        });
      }

      const calcActions = (key) => {
        CALCULATOR_ACTIONS[key]();
      }

      const equal = () => {
        flipCalculator();
        const CALC_INPUT = CALCULATOR_INPUT.innerHTML;
        const LAST_CHARACTER = CALC_INPUT.charAt(CALC_INPUT.length - 1);
        if (!CALC_INPUT) {
          CALCULATOR_INPUT.innerHTML = CALCULATOR_BUTTONS.zero;
        } else {
          lastCharacterValid(LAST_CHARACTER);
          let result = Number(getResult());
          if (!validateResult(result)) {
            mathError();
          } else {
            CALCULATOR_INPUT.innerHTML = result;
            equations = [];
          }
        }
      }

      const getResult = () => {
        const CALC_INPUT = CALCULATOR_INPUT.innerHTML;
        let result;
        let hasMultiplyOrDivideSigns;
        for (let equationIndex = 0; equationIndex < equations.length; equationIndex++) {
          hasMultiplyOrDivideSigns = checkMultiplyOrDivideSigns();
          if (!hasMultiplyOrDivideSigns || equationIndex < 0) {
            equationIndex = 0;
          }
          if (equations[equationIndex].operator === CALCULATOR_BUTTONS.divide
            || equations[equationIndex].operator === CALCULATOR_BUTTONS.multiply
            || !hasMultiplyOrDivideSigns) {
            result = calculate(equations[equationIndex]);
            updateEquations(result, equationIndex);
            if (equations.length === 0) {
              return result;
            }
            equationIndex -= 2;
          }
        }
        return CALC_INPUT;
      }

      const backspace = () => {
         const CALC_INPUT = CALCULATOR_INPUT.innerHTML;
        if (isNewEquation) {
          if (equations.length !== 0) {
            const LAST_EQUATION_SECOND_NUM = equations[equations.length - 1].secondNum;
            console.log(CALCULATOR_OPERATOR_SIGNS.includes(CALC_INPUT[CALC_INPUT.length - 1]));
            (CALCULATOR_OPERATOR_SIGNS.includes(CALC_INPUT[CALC_INPUT.length - 1]))
            ? equations.splice(equations.length - 1, 1): equations[equations.length - 1].secondNum =
              LAST_EQUATION_SECOND_NUM.slice(0, LAST_EQUATION_SECOND_NUM.length - 1);
          }
          CALCULATOR_INPUT.innerHTML = CALCULATOR_INPUT.innerHTML.slice(0, -1);
        }
      }

      const clear = () => {
        CALCULATOR_INPUT.innerHTML = '';
        isNewEquation = true;
        equations = [];
      }

      const CALCULATOR_ACTIONS = {
        'Backspace': backspace,
        'c': clear,
        '=': equal,
        'Enter': equal
      };

      const flipCalculator = () => {
        CALCULATOR.classList.add('rotated');
        CALCULATOR_INPUT.classList.add('hidden');
        setTimeout(() => {
          CALCULATOR_INPUT.classList.remove('hidden');
          CALCULATOR.classList.remove('rotated');
        }, 2000);
      }

      const mathError = () => {
        CALCULATOR_INPUT.innerHTML = MATH_ERROR_MESSAGE;
        isNewEquation = false;
        setTimeout(function() {
          clear();
        }, 3000);
      }

      const calculate = (equation) => {
        let firstNumber = equation.firstNum;
        let secondNumber = equation.secondNum;
        let operator = equation.operator;
        let timesMultipliedBy10 = multiplyTimes10ByNumberAfterDot(firstNumber, secondNumber);
        firstNumber *= Math.pow(10, timesMultipliedBy10);
        secondNumber *= Math.pow(10, timesMultipliedBy10);
        let result = MATH_OPERATOR[operator](firstNumber, secondNumber);
        if (operator === CALCULATOR_BUTTONS.multiply) {
          return divdeResult(result, timesMultipliedBy10 * 2);
        } else if (operator === CALCULATOR_BUTTONS.divide) {
          if (secondNumber === 0) {
            return MATH_ERROR_MESSAGE;
          }
          return result;
        } else {
          return divdeResult(result, timesMultipliedBy10);
        }
      }

      const divdeResult = (result, timesMultipliedBy10) => {
        return result / Math.pow(10, timesMultipliedBy10);
      }

      const multiplyTimes10ByNumberAfterDot = (firstNumber, secondNumber) => {
        let firstNumberHasDot = firstNumber.toString().includes(CALCULATOR_BUTTONS.dot);
        let secondNumberHasDot = secondNumber.toString().includes(CALCULATOR_BUTTONS.dot);
        let firstNumberNumbersAfterdot = firstNumber.toString().split(CALCULATOR_BUTTONS.dot)[1];
        let secondNumberNumbersAfterdot = secondNumber.toString().split(CALCULATOR_BUTTONS.dot)[1];
        return firstNumberHasDot && secondNumberHasDot
        ? Math.max(firstNumberNumbersAfterdot.length, secondNumberNumbersAfterdot.length)
         : firstNumberHasDot ? firstNumberNumbersAfterdot.length
         : secondNumberHasDot ? secondNumberNumbersAfterdot.length
         : 0;
      }

      const addZeroAtTheBeginningBeforeMinusSign = () => {
        const CALC_INPUT = CALCULATOR_INPUT.innerHTML;
        if (CALC_INPUT[0] === CALCULATOR_BUTTONS.minus) {
          addEquation(CALCULATOR_BUTTONS.zero, CALCULATOR_BUTTONS.minus,
            CALC_INPUT.slice(1, CALC_INPUT.length));
          CALCULATOR_INPUT.innerHTML = CALCULATOR_BUTTONS.zero +
            CALCULATOR_INPUT.innerHTML;
        }
      }

      const validateResult = (result) => {
        return (result.toString().length < MAX_CHARACTERS_FOR_INT
        || result.toString().includes(CALCULATOR_BUTTONS.dot))
            && !result.toString().includes(NaN)
            && !result.toString().includes('e')
            && result.toString().length <= MAX_CHARACTERS_INPUT;
      }

      const lastCharacterValid = (lastCharacter) => {
        if (!lastCharacter.match(/[0-9]/)) {
          backspace();
        }
      }

      const checkMultiplyOrDivideSigns = () => {
        for (var equationIndex = 0; equationIndex < equations.length; equationIndex++) {
          if (equations[equationIndex].operator === CALCULATOR_BUTTONS.multiply
            || equations[equationIndex].operator === CALCULATOR_BUTTONS.divide) {
            return true;
          }
        }
        return false;
      }

      const updateEquations = (result, equationIndex) => {
        hasNextEquation = equations[equationIndex + 1] !== undefined;
        hasPreviousEquation = equations[equationIndex - 1] !== undefined;
        if (hasNextEquation && hasPreviousEquation) {
          equations[equationIndex - 1].secondNum = result;
          equations[equationIndex + 1].firstNum = result;
        } else if (hasNextEquation) {
          equations[equationIndex + 1].firstNum = result;
        } else if (hasPreviousEquation) {
          equations[equationIndex - 1].secondNum = result;
        }
        equations.splice(equationIndex, 1);
      }

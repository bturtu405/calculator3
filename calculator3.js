      const MAX_CHARACTERS_FOR_INT = 15;
      const MAX_CHARACTERS_INPUT = 20;
      const MATH_ERROR_MESSAGE = 'Math Error';
      const CALCULATOR = document.getElementById('calculator');
      const CALCULATOR_INPUT = document.getElementById('calculatorInput');
      const REGEX_ZERO_TO_NINE = /\d/;
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
      const OPERATOR_SIGNS = [CALCULATOR_BUTTONS.plus, CALCULATOR_BUTTONS.minus,
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
      let isMathErrorDisplayed = false;
      let equations = [];

      CALCULATOR_INPUT.innerHTML = '';

      const invokeClickedButton = (buttonId) => {
        const button = document.getElementById(buttonId);
        button.blur();
        keySorter(CALCULATOR_BUTTONS[buttonId]);
      }

      document.addEventListener('keydown', ({key}) => keySorter(key));

      const keySorter = key => {
      if(!isMathErrorDisplayed){
        if (CALCULATOR_ACTIONS_SIGNS.includes(key)) {
          CALCULATOR_ACTIONS[key]();
        } else {
          if (CALCULATOR_INPUT.innerHTML.length < MAX_CHARACTERS_INPUT) {
            writeInTextbox(key);
          }
        }
      }
    }

      const writeInTextbox = (key) => {
        if (CALCULATOR_INPUT.innerHTML[0] === CALCULATOR_BUTTONS.minus) {
          addZeroAtTheBeginningBeforeMinusSign();
        }
        if (key.match(REGEX_ZERO_TO_NINE) && key.length === 1) {
          writeNumbers(key);
        }

        if (key === CALCULATOR_BUTTONS.dot) {
          writeDot();
        }

        if (OPERATOR_SIGNS.includes(key)) {
          writeOperator(key);
        }
      }

      const writeNumbers = number => {
        const calculatorInput = CALCULATOR_INPUT.innerHTML;
        if (calculatorInput === CALCULATOR_BUTTONS.zero) {
          backspace();
        }
        if (equations.length) {
          if (equations[equations.length - 1].secondNum === CALCULATOR_BUTTONS.zero) {
            backspace();
          }
          equations[equations.length - 1].secondNum += number;
        }
        CALCULATOR_INPUT.innerHTML += number;
      }

      const writeDot = () => {
        const calculatorInput = CALCULATOR_INPUT.innerHTML;
        const isEquationsNotEmpty = equations.length;
        if (isEquationsNotEmpty) {
          const secondNumber = equations[equations.length - 1].secondNum;
          if (!secondNumber) {
            CALCULATOR_INPUT.innerHTML += CALCULATOR_BUTTONS.zero + CALCULATOR_BUTTONS.dot;
            equations[equations.length - 1].secondNum = CALCULATOR_BUTTONS.zero + CALCULATOR_BUTTONS.dot;
          } else if (!secondNumber.includes(CALCULATOR_BUTTONS.dot)) {
            CALCULATOR_INPUT.innerHTML += CALCULATOR_BUTTONS.dot;
            equations[equations.length - 1].secondNum += CALCULATOR_BUTTONS.dot;
          }
        } else {
          if (!calculatorInput) {
            CALCULATOR_INPUT.innerHTML = CALCULATOR_BUTTONS.zero + CALCULATOR_BUTTONS.dot;
          } else if (!calculatorInput.includes(CALCULATOR_BUTTONS.dot)) {
            CALCULATOR_INPUT.innerHTML += CALCULATOR_BUTTONS.dot;
          }
        }
      }

      const writeOperator = (operator) => {
        const isEquationsNotEmpty = equations.length;
        isEquationsNotEmpty ? writeOperatorWhenEquationsIsNotEmpty(operator)
        : writeOperatorWhenEquationsIsEmpty(operator);
        CALCULATOR_INPUT.innerHTML += operator;
      }

      const writeOperatorWhenEquationsIsEmpty = (operator) => {
        const calculatorInput = CALCULATOR_INPUT.innerHTML;
        const lastCharacter = calculatorInput.charAt(calculatorInput.length - 1);
        if (!calculatorInput) {
          CALCULATOR_INPUT.innerHTML = CALCULATOR_BUTTONS.zero;
          addEquation(CALCULATOR_BUTTONS.zero, operator, '');
        } else{
          if (lastCharacter === CALCULATOR_BUTTONS.dot) {
            backspace();
          }
            addEquation(calculatorInput, operator, '');
          }
      }

     const writeOperatorWhenEquationsIsNotEmpty = (operator) =>{
       const lastEquationSecondNumber = equations[equations.length - 1].secondNum;
       if (!lastEquationSecondNumber) {
         equations[equations.length - 1].operator = operator;
         const lastEquationFirstNumber = equations[equations.length - 1].firstNum;
         backspace();
         addEquation(lastEquationFirstNumber, operator, '');
       } else if (lastEquationSecondNumber.charAt(lastEquationSecondNumber.length - 1) ===
         CALCULATOR_BUTTONS.dot) {
         backspace();
         addEquation(lastEquationSecondNumber, operator, '');
       } else {
         addEquation(lastEquationSecondNumber, operator, '');
       }
     }

      const addEquation = (firstNum, operator, secondNum) => {
        equations.push({
          firstNum: firstNum,
          operator: operator,
          secondNum: secondNum
        });
      }

      const equal = () => {
        flipCalculator();
        const calculatorInput = CALCULATOR_INPUT.innerHTML;
        const lastCharacter = calculatorInput.charAt(calculatorInput.length - 1);
        if (!calculatorInput) {
          CALCULATOR_INPUT.innerHTML = CALCULATOR_BUTTONS.zero;
        } else {
          deleteLastCharacterIfNotValid(lastCharacter);
          let result = getResult();
          if (!validateResult(result)) {
            mathError();
          } else {
            CALCULATOR_INPUT.innerHTML = result;
          }
        }
      }

      const getResult = () => {
        const calculatorInput = CALCULATOR_INPUT.innerHTML;
        let result;
        let hasMultiplyOrDivideSigns;
        let equationIndex = 0;
        while (equationIndex < equations.length) {
          hasMultiplyOrDivideSigns = checkMultiplyOrDivideSigns();
          if (!hasMultiplyOrDivideSigns || equationIndex < 0) {
            equationIndex = 0;
          }
          if (equations[equationIndex].operator === CALCULATOR_BUTTONS.divide
            || equations[equationIndex].operator === CALCULATOR_BUTTONS.multiply
            || !hasMultiplyOrDivideSigns) {
            result = calculate(equations[equationIndex]);
            updateEquations(result, equationIndex);
            if (!equations.length) {
              return Number(result);
            }
            equationIndex -= 2;
          }
          equationIndex++;
        }
        return Number(calculatorInput);
      }

      const backspace = () => {
         const calculatorInput = CALCULATOR_INPUT.innerHTML;
          if (equations.length) {
            const lastEquationSecondNumber = equations[equations.length - 1].secondNum;
            OPERATOR_SIGNS.includes(calculatorInput[calculatorInput.length - 1])
            ? equations.splice(equations.length - 1, 1): equations[equations.length - 1].secondNum
            = lastEquationSecondNumber.slice(0, lastEquationSecondNumber.length - 1);
          }
          CALCULATOR_INPUT.innerHTML = calculatorInput.slice(0, -1);
      }

      const clear = () => {
        CALCULATOR_INPUT.innerHTML = '';
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
        isMathErrorDisplayed = true;
        CALCULATOR_INPUT.innerHTML = MATH_ERROR_MESSAGE;
        setTimeout(() =>{
          clear();
          isMathErrorDisplayed = false;
        },3000);

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
        const firstNumberHasDot = firstNumber.toString().includes(CALCULATOR_BUTTONS.dot);
        const secondNumberHasDot = secondNumber.toString().includes(CALCULATOR_BUTTONS.dot);
        const firstNumberDigitsAfterDot = firstNumber.toString().split(CALCULATOR_BUTTONS.dot)[1];
        const secondNumberDigitsAfterDot = secondNumber.toString().split(CALCULATOR_BUTTONS.dot)[1];
        return firstNumberHasDot && secondNumberHasDot
        ? Math.max(firstNumberDigitsAfterDot.length, secondNumberDigitsAfterDot.length)
        : firstNumberHasDot ? firstNumberDigitsAfterDot.length
        : secondNumberHasDot ? secondNumberDigitsAfterDot.length
        : 0;
      }

      const addZeroAtTheBeginningBeforeMinusSign = () => {
        const calculatorInput = CALCULATOR_INPUT.innerHTML;
          addEquation(CALCULATOR_BUTTONS.zero, CALCULATOR_BUTTONS.minus,
            calculatorInput.slice(1, calculatorInput.length));
          CALCULATOR_INPUT.innerHTML = CALCULATOR_BUTTONS.zero
          + calculatorInput;
      }

      const validateResult = (result) => {
        const resultToString = result.toString();
        return (resultToString.length < MAX_CHARACTERS_FOR_INT
        || resultToString.includes(CALCULATOR_BUTTONS.dot))
        && !resultToString.includes(NaN)
        && !resultToString.includes('e')
        && resultToString.length <= MAX_CHARACTERS_INPUT;
      }

      const deleteLastCharacterIfNotValid = (lastCharacter) => {
        if (!lastCharacter.match(REGEX_ZERO_TO_NINE)) {
          backspace();
        }
      }

      const checkMultiplyOrDivideSigns = () => {
        for (let equationIndex = 0; equationIndex < equations.length; equationIndex++) {
          if (equations[equationIndex].operator === CALCULATOR_BUTTONS.multiply
            || equations[equationIndex].operator === CALCULATOR_BUTTONS.divide) {
            return true;
          }
        }
        return false;
      }

      const updateEquations = (result, equationIndex) => {
      let  hasNextEquation = equations[equationIndex + 1] !== undefined;
      let hasPreviousEquation = equations[equationIndex - 1] !== undefined;
        if (hasNextEquation) {
          equations[equationIndex + 1].firstNum = result;
        }
        if (hasPreviousEquation) {
          equations[equationIndex - 1].secondNum = result;
        }
        equations.splice(equationIndex, 1);
      }

'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Update UI
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
//Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
  labelWelcome.textContent = 'Login to get started';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////
/*
//141.)

let arr = ['a', 'b', 'c', 'd', 'e'];

//SLICE
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));

//SPLICE
//console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

//REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());

//CONCAT
const letters = arr.concat(arr2);
console.log(letters);

//JOIN
console.log(letters.join(' - '));
/////////////////////////////////////////////////

/////////////////////////////////////////////////

//142.)

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, movment] of movements.entries()) {
  if (movment > 0) {
    console.log(`Movment ${i + 1}: You deposited ${movment}`);
  } else {
    console.log(`Movment ${i + 1}: You withdrew ${Math.abs(movment)}`);
  }
}
console.log('------ FOREACH ------');
movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movment ${i + 1}: You deposited ${mov}`);
  } else {
    console.log(`Movment ${i + 1}: You withdrew ${Math.abs(mov)}`);
  }
});

/////////////////////////////////////////////////

//143.)

//MAP
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

//SET
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);

currenciesUnique.forEach(function (value, _value, set) {
  console.log(`${value}: ${value}`);
});


/////////////////////////////////////////////////

//146.)
//CODING CHALLANGE #1:

const dogsJulia1 = [3, 5, 2, 12, 7];
const dogsKate1 = [9, 16, 6, 8, 3];
const dogsJulia2 = [9, 16, 6, 8, 3];
const dogsKate2 = [10, 5, 6, 1, 4];

const checkDogs = function (juliaArr, kateArr) {
  const modifedJuliaArr = [...juliaArr].splice(1).splice(-2);
  const mergedArr = modifedJuliaArr.concat(kateArr);

  mergedArr.forEach(function (age, i) {
    console.log(
      `Dog number ${i + 1} is an ${
        age >= 3 ? 'adult' : 'puppy'
      }, and is ${age} years old.`
    );
  });
};

checkDogs(dogsJulia1, dogsKate1);
console.log('------ TEST 2 -----');
checkDogs(dogsJulia2, dogsKate2);


/////////////////////////////////////////////////

//148.)

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;

// const convertedArr = movements.map(function (mov) {
//   return Math.trunc(mov * eurToUsd);
// });

const convertedArr = movements.map(mov => Math.trunc(mov * eurToUsd));
console.log(convertedArr);


/////////////////////////////////////////////////

//150.)
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(function (mov) {
  return mov > 0;
});

console.log(deposits);

const withdrawals = movements.filter(mov => mov < 0);

console.log(withdrawals);


/////////////////////////////////////////////////

//151.)

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// accumulator -> Snowball
// const balance = movements.reduce(function (acc, curr, i, array) {
//   return acc + curr;
// }, 0);

const balance = movements.reduce((acc, cur) => acc + cur, 0);
console.log(balance);

//Maximum value
const maxValue = movements.reduce((acc, cur) => {
  if (acc > cur) {
    return acc;
  } else {
    return cur;
  }
}, movements[0]);
console.log(maxValue);


/////////////////////////////////////////////////

//152.)
//CODING CHALLANGE #2:

const calcAverageHumanAge = function (dogs) {
  const humanYears = dogs.map(dog => (dog <= 2 ? dog * 2 : 16 + dog * 4));
  const lessThan18 = humanYears.filter(years => years > 18);
  const calcAvgYears = lessThan18.reduce((acc, dog) => acc + dog, 0);
  console.log(Math.trunc(calcAvgYears / lessThan18.length));
};

calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

/////////////////////////////////////////////////

//153.)
const eurToUsd = 1.1;

const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((acc, cur) => acc + cur, 0);

console.log(totalDepositsUSD);


/////////////////////////////////////////////////

//154.)
//CODING CHALLANGE #3:

// const calcAverageHumanAge = function (dogs) {
//   const humanYears = dogs.map(dog => (dog <= 2 ? dog * 2 : 16 + dog * 4));
//   const lessThan18 = humanYears.filter(years => years > 18);
//   const calcAvgYears = lessThan18.reduce((acc, dog) => acc + dog, 0);
//   console.log(Math.trunc(calcAvgYears / lessThan18.length));
// };

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

const calcAverageHumanAge = function (age) {
  const ages = age
    .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
    .filter(age => age > 18)
    .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
  console.log(ages);
};

calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);


/////////////////////////////////////////////////

//155.)

const findSome = movements.find(mov => mov < 0);
console.log(findSome);
console.log(movements);

const account = accounts.find(name => name.owner === 'Jessica Davis');
console.log(account);


/////////////////////////////////////////////////

//159.)

console.log(movements);
console.log(movements.includes(-130)); // it is in array, so its true... testing for equality only

//SOME:
const anyDeposits = movements.some(mov => mov > 0); //Not a quality but a codition
console.log(anyDeposits);

//EVERY:
const everyDeposits = movements.every(mov => mov > 0);
console.log(everyDeposits);

// Separate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));


/////////////////////////////////////////////////

//160.)

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat(1)); //Level 1 deep

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2)); //Level 2 deep

const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);
const allMovements = accountMovements.flat();
console.log(allMovements);
const overalBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);

//Chained
// const overalBalancee = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, cur) => acc + cur, 0);
// console.log(overalBalancee);

//flatMap => map() + flat() => it's goes only one level deep in array
const overalBalancee = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, cur) => acc + cur, 0);
console.log(overalBalancee);


/////////////////////////////////////////////////

//161.)

const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());

console.log(movements);

// const sortingNumbers = movements.sort((a, b) => {
//   if (a > b) return 1; // 1 keep order --- return < 0, A, B
//   if (a < b) return -1; // -1 means switch order --- return > 0, B, A
// });

const sortingNumbers = movements.sort((a, b) => a - b); //if a-b negative switch the order, if it's positive keeping order
console.log(sortingNumbers);


/////////////////////////////////////////////////

//162.)

const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array([1, 2, 3, 4, 5, 6, 7]));

//Empty array + fill method
const x = new Array(7);
// console.log(x.fill(1)); //Fill array with 1. Mutate

x.fill(1, 3, 5); // fill with 1, start at index 3 and ends at index 5
console.log(x);

arr.fill(23, 4, 6);
console.log(arr);

//Array.from
const newArr = Array.from({ length: 7 }, () => 1);
console.log(newArr);

const z = Array.from({ length: 7 }, (_, i) => i + 1); // _ thrown away parameter.
console.log(z);

const randomDiceRolls = Array.from({ length: 100 }, () =>
  Math.trunc(Math.random(1) * 100)
).sort((a, b) => a - b);
console.log(randomDiceRolls);

const movementsUI = Array.from(document.querySelectorAll('.movements__value'));
console.log(movementsUI);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'), //Target a UI value
    el => Number(el.textContent.replace('€', '')) // Getting raw element
  );

  // console.log(movementsUI.map(el => Number(el.textContent.replace('€', ''))));
  console.log(movementsUI);

  //Method 2:
  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
  //Prefer method 1, because you can't use maping right away on this method.
});


/////////////////////////////////////////////////

//164.)

const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, cur) => acc + cur, 0);
console.log(bankDepositSum);

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0); // ++ before is prefix
// .filter(mov => mov >= 1000).length; // Without reduce

console.log(numDeposits1000);

const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur); // Possible solution
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

const converTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const expections = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (expections.includes(word) ? word : capitalize(word)))
    .join(' ');

  return capitalize(titleCase);
};

console.log(converTitleCase('This is a nice title'));
console.log(converTitleCase('This is a LONG title but not too long'));
console.log(converTitleCase('and here is another title with an EXAMPLE'));

*/
/////////////////////////////////////////////////

//165.)

//CODING CHALLANGE #4:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
console.log(dogs);
dogs.forEach(dog => (dog.recomendedFood = Math.trunc(dog.weight ** 0.75 * 28)));

const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(
  `Sarah's dog is eating too ${
    sarahDog.curFood > sarahDog.recomendedFood ? 'much' : 'little'
  }. `
);

const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood < dog.recomendedFood)
  .flatMap(owner => owner.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLess = dogs
  .filter(dog => dog.curFood > dog.recomendedFood)
  .flatMap(owner => owner.owners);
console.log(ownersEatTooLess);

console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLess.join(' and ')}'s dogs eat too little!`);

const findCurEqualsRec = dogs.some(dog => dog.curFood === dog.recomendedFood);
console.log(findCurEqualsRec);

const okayDogs = dog =>
  dog.curFood > dog.recomendedFood * 0.9 &&
  dog.curFood < dog.recomendedFood * 1.1;

console.log(dogs.some(okayDogs));

const okayDogsEating = dogs.filter(okayDogs);
console.log(okayDogsEating);

const dogsSorted = dogs
  .slice()
  .sort((a, b) => a.recomendedFood - b.recomendedFood);
console.log(dogsSorted);

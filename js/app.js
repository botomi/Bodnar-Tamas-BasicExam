function getData(url, callbackFunc) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callbackFunc(this);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function successAjax(xhttp) {
  // Innen lesz elérhető a JSON file tartalma, tehát az adatok amikkel dolgoznod kell
  var userDatas = JSON.parse(xhttp.responseText);
  // Separate objects into to arrays. Puts the one with values in order and then joins them together.
  function separateAndSortAsc(array) {
    var nullArr = [];
    var numArr = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i].cost_in_credits === null) {
        nullArr.push(array[i])
      } else {
        numArr.push(array[i])
      }
    }
    var i = numArr.length;
    let swap = false;
    let db = 0;
    do {
      swap = false;
      for (var j = 0; j < i - 1; j++) {
        db++;
        if (parseInt(numArr[j].cost_in_credits) > parseInt(numArr[j + 1].cost_in_credits)) {
          tmp = numArr[j];
          numArr[j] = numArr[j + 1];
          numArr[j + 1] = tmp;
          swap = true;
        }
      }
      i--;
    } while (i >= 0 && swap);
    var sorted = nullArr.concat(numArr);
    return sorted;
  }
  // remove all objects where consumable value is null
  function removeConsumable(array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].consumables === null) {
        array.splice(i, 1);
        i = 0;
      }
    }
    return array;
  }
  // Swaps all null value to unkown
  function swapNulltoUnkown(array) {
    for (let i = 0; i < array.length; i++) {
      for (const member in array[i]) {
        if (array[i][member] === null) {
          array[i][member] = 'unknown';
        }
      }
    }
  }
  // displays all remaining objects on HTML
  function toHTML(array) {
    var mainDiv = document.querySelector('.shapceship-list');
    for (let i = 0; i < array.length; i++) {
      var individualDiv = document.createElement('div');
      var img = document.createElement('img');
      var modelP = document.createElement('p');
      var manufacturerP = document.createElement('p');
      var denominationP = document.createElement('p');
      var cargoP = document.createElement('p');
      var passengersP = document.createElement('p');
      var crewP = document.createElement('p');
      var lengthinessP = document.createElement('p');
      var consumablesP = document.createElement('p');
      var atmospheringSpeedP = document.createElement('p');
      var costP = document.createElement('P');
      var hr = document.createElement('hr')
      individualDiv.classList.add('inDiv');
      img.setAttribute('src', `img/${array[i].image}`);
      img.setAttribute('alt', `${array[i].image}`);
      modelP.innerText = `Model: ${array[i].model}`;
      manufacturerP.innerText = `Manufacturer: ${array[i].manufacturer}`;
      denominationP.innerText = `Denomination: ${array[i].denomination}`;
      cargoP.innerText = `Cargo capacity: ${array[i].cargo_capacity}`;
      passengersP.innerText = `Passengers: ${array[i].passengers}`;
      crewP.innerText = `Crew: ${array[i].crew}`;
      lengthinessP.innerText = `Lengthiness: ${array[i].lengthiness}`;
      consumablesP.innerText = `Consumables: ${array[i].consumables}`;
      atmospheringSpeedP.innerText = `Maximum atmosphering speed: ${array[i].max_atmosphering_speed}`;
      costP.innerText = `Cost: ${array[i].cost_in_credits}`;
      mainDiv.appendChild(individualDiv);
      individualDiv.appendChild(img);
      individualDiv.appendChild(modelP);
      individualDiv.appendChild(manufacturerP);
      individualDiv.appendChild(denominationP);
      individualDiv.appendChild(cargoP);
      individualDiv.appendChild(passengersP);
      individualDiv.appendChild(crewP);
      individualDiv.appendChild(lengthinessP);
      individualDiv.appendChild(consumablesP);
      individualDiv.appendChild(atmospheringSpeedP);
      individualDiv.appendChild(costP);
      individualDiv.appendChild(hr);

    }
  }
  // basic DOM function to be able to display result of functions easily
  function show(result) {
    var div = document.querySelector('.shapceship-list');
    var p = document.createElement('p');
    p.innerText = result;
    div.appendChild(p);
  }
  // calculates how many ships are there with only 1 possible crew member
  function shipsWithOneCrew(array) {
    var db = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i].crew == 1) {
        db++
      }
    }
    return db;
  }
  // Returns the object with the biggest cargo capacity
  function showMaxCargoCapacity(array) {
    var max = array[0];
    for (let i = 0; i < array.length; i++) {
      if (parseInt(max.cargo_capacity) < parseInt(array[i].cargo_capacity)) {
        max = array[i];
      }
    }
    return max.model;
  }
  // Sums all the passenger seats in every single ship
  function passengerSum(array) {
    var sum = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i].passengers !== 'unknown') {
        sum += parseInt(array[i].passengers);
      }
    }
    return sum;
  }
  // Returns the object where the ship is the longest
  function longestShip(array) {
    var max = array[0];
    for (let i = 0; i < array.length; i++) {
      if (parseInt(max.lengthiness) < parseInt(array[i].lengthiness)) {
        max = array[i];
      }
    }
    var div = document.querySelector('.shapceship-list');
    var img = document.createElement('IMG');
    var decP = document.createElement('p');
    decP.innerText = `Name of the longest ship is: ${max.model}
    Picture:`;
    img.setAttribute('src', `img/${max.image}`);
    img.setAttribute('alt', 'no pic');
    div.appendChild(decP);
    div.appendChild(img);
  }
  // Adds an eventlistener to the searchbutton
  function addeventListener() {
    var button = document.getElementById('search-button');
    button.addEventListener('click', linearSearch);
  }
  // Creates the structure of the right-side div
  function createRightSide() {
    var mainDiv = document.querySelector('.one-spaceship');
    var individualDiv = document.createElement('div');
    individualDiv.classList.add('individualDiv');
    var img = document.createElement('img');
    img.classList.add('divimg');
    var modelP = document.createElement('p');
    modelP.classList.add('modelP')
    var manufacturerP = document.createElement('p');
    manufacturerP.classList.add('manufacturerP');
    var denominationP = document.createElement('p');
    denominationP.classList.add('denominationP');
    var cargoP = document.createElement('p');
    cargoP.classList.add('cargoP');
    var passengersP = document.createElement('p');
    passengersP.classList.add('passengersP');
    var crewP = document.createElement('p');
    crewP.classList.add('crewP');
    var lengthinessP = document.createElement('p');
    lengthinessP.classList.add('lengthinessP');
    var consumablesP = document.createElement('p');
    consumablesP.classList.add('consumablesP');
    var atmospheringSpeedP = document.createElement('p');
    atmospheringSpeedP.classList.add('atmospheringSpeedP');
    var costP = document.createElement('P');
    costP.classList.add('costP');
    mainDiv.appendChild(individualDiv);
    individualDiv.appendChild(img);
    individualDiv.appendChild(modelP);
    individualDiv.appendChild(manufacturerP);
    individualDiv.appendChild(denominationP);
    individualDiv.appendChild(cargoP);
    individualDiv.appendChild(passengersP);
    individualDiv.appendChild(crewP);
    individualDiv.appendChild(lengthinessP);
    individualDiv.appendChild(consumablesP);
    individualDiv.appendChild(atmospheringSpeedP);
    individualDiv.appendChild(costP);
  }

  // Search engine... it works, but it's ugly and incorrect
  function linearSearch() {
    var array;
    var value = document.getElementById('search-text').value;
    var img = document.querySelector('.divimg');
    var modelP = document.querySelector('.modelP');
    var manufacturerP = document.querySelector('.manufacturerP');
    var denominationP = document.querySelector('.denominationP');
    var cargoP = document.querySelector('.cargoP');
    var passengersP = document.querySelector('.passengersP');
    var crewP = document.querySelector('.crewP');
    var lengthinessP = document.querySelector('.lengthinessP');
    var consumablesP = document.querySelector('.consumablesP');
    var atmospheringSpeedP = document.querySelector('.atmospheringSpeedP');
    var costP = document.querySelector('.costP');
    for (let i = 0; i < sort.length; i++) {
      if (sort[i].model.toString().toLowerCase().indexOf(value.toLowerCase()) > -1) {
        array = sort[i];
        img.setAttribute('src', `img/${array.image}`);
        img.setAttribute('alt', 'no pic');
        modelP.innerText = `Model: ${array.model}`;
        manufacturerP.innerText = `Manufacturer: ${array.manufacturer}`;
        denominationP.innerText = `Denomination: ${array.denomination}`;
        cargoP.innerText = `Cargo capacity: ${array.cargo_capacity}`;
        passengersP.innerText = `Passengers: ${array.passengers}`;
        crewP.innerText = `Crew: ${array.crew}`;
        lengthinessP.innerText = `Lengthiness: ${array.lengthiness}`;
        consumablesP.innerText = `Consumables: ${array.consumables}`;
        atmospheringSpeedP.innerText = `Maximum atmosphering speed: ${array.max_atmosphering_speed}`;
        costP.innerText = `Cost: ${array.cost_in_credits}`;
        break;
      }
    }
    if (typeof array === "undefined") {
      modelP.innerText = 'NO RESULT';
      img.setAttribute('src', null);
      img.setAttribute('alt', '');
      manufacturerP.innerText = null;
      denominationP.innerText = null;
      cargoP.innerText = null;
      passengersP.innerText = null;
      crewP.innerText = null;
      lengthinessP.innerText = null;
      consumablesP.innerText = null;
      atmospheringSpeedP.innerText = null;
      costP.innerText = null;
    }


  }

  // function calls:
  var sort = separateAndSortAsc(userDatas);
  removeConsumable(sort);
  swapNulltoUnkown(sort);
  toHTML(sort);
  console.log(sort);
  show(`There are ${shipsWithOneCrew(sort)} ships with 1 crew member only.`);
  show(`Ship with highest cargo capacity is the ${showMaxCargoCapacity(sort)}`);
  show(`There are ${passengerSum(sort)} passenger seats altogether.`);
  longestShip(sort);
  addeventListener();
  createRightSide();
}

getData('json/spaceships.json', successAjax);
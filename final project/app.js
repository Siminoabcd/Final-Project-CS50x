// Global Variables
let myDay = JSON.parse(localStorage.getItem('myDay')) || [];
let favoriteFoods = JSON.parse(localStorage.getItem('favoriteFoods')) || [];
let foodData = [];
let formData = JSON.parse(localStorage.getItem('formData')) || {};
let dailyInTake = JSON.parse(localStorage.getItem('dailyInTake')) || 2000;

document.addEventListener("DOMContentLoaded", function () {
    // Load the JSON data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            foodData = data;  // Store the data in the array
            console.log('Data loaded:', foodData);

            // Call other functions that depend on the data
            displayLoggedFoods();
            displayFavFoods();
            displayDailyIntake(); 
        })
        .catch(error => console.error('Error fetching data:', error));

    displayFavFoods();
    displayFoodItems();
})






/* Search Section */

document.querySelector('.searchBTN').addEventListener('click', function() {
    const inputElement = document.querySelector('.inputSearch');
    const searchTerm = inputElement.value.toLowerCase().trim();

    if (searchTerm !== '') {
        const searchResults = [];

        // Use forEach to loop through the data array
        foodData.forEach(food => {
            // Check if the name contains the search term
            if (food.Display_Name.toLowerCase().includes(searchTerm)) {
                searchResults.push(food);
            }
        });

        displayFoodItems(searchResults);

        if (searchResults.length === 0) {
            showWarning('No matches found.');
        }
    } else {
        // Show warning if no search terms were entered
        showWarning('Please enter search terms.');
    }
});

function displayFoodItems(data) {
    const foodList = document.getElementById('foodList');

    // Clear previous results
    foodList.innerHTML = '';

    // Iterate through the data and display each food item
    data.forEach(food => {
        const foodItemDiv = document.createElement('div');
        foodItemDiv.classList.add('food-item');

        // Customize the display based on your JSON structure
        foodItemDiv.innerHTML = `
            <div class="food-container">
                <h3>${food.Display_Name}</h3>
                <p>Calories: ${food.Calories}</p>
                <button class="log-food" onclick="logFood('${food.Display_Name}', ${food.Calories})">Log Food</button>
                <button class="add-to-favorites" onclick="addToFavorites('${food.Display_Name}','${food.Calories}')">Add To Favorites</button>
            </div>
            `;

        foodList.appendChild(foodItemDiv);
    });
}

function logFood(name, calories) {
    const roundedCal = Math.round(calories);
    const meal = {
        name:name,
        calories:roundedCal
    };

    /* console.log(meal); */ // Food is correctly added to object
    myDay.push(meal);

    localStorage.setItem('myDay', JSON.stringify(myDay));
    
     // myDay Array correctly updated

    /* console.log(`Food logged: ${name}, Calories: ${calories}`);  */
    return myDay;
}

function addToFavorites(name, calories) {
    const roundedCal = Math.round(calories);
    const meal = {
        name:name,
        calories:roundedCal
    };

   /*  console.log(meal); */ // Food is correctly added to object
    favoriteFoods.push(meal);

    localStorage.setItem('favoriteFoods', JSON.stringify(favoriteFoods));
    
    /* console.log(favoriteFoods); // favFoods Array correctly updated */

   /*  console.log(`Food logged: ${name}, Calories: ${calories}`);  */
    return favoriteFoods;
}


/* My Day Section */

function displayDailyIntake() {
    const caloriesElement = document.querySelector('.calories-left');
    caloriesElement.innerHTML = dailyInTake;
}

function resetMyDay() {
    // Clear the myDay array
    myDay = [];
    console.log(myDay);

    // Update localStorage to reflect the cleared myDay array
    localStorage.setItem('myDay', JSON.stringify(myDay));

    document.querySelector('.logged-food').innerHTML = '';
    document.querySelector('.calories-eaten').innerHTML = 0;
    document.querySelector('.calories-left').innerHTML = dailyInTake;
}

function changeDailyCalories() {
    const caloriesElement = document.querySelector('.calories-left');
    const newCalories = document.querySelector('.calories-input');

    // Use the submitted value if available, otherwise use the default (2000)
    const submittedCalories = parseInt(newCalories.value, 10) || 2000;

    caloriesElement.innerHTML = submittedCalories;

    // Update the dailyInTake variable
    dailyInTake = submittedCalories;

    // Save as a string in localStorage
    localStorage.setItem('dailyInTake', JSON.stringify(dailyInTake));

    newCalories.value = '';

    // Refresh the display of logged foods
    displayLoggedFoods();
}


function displayLoggedFoods() {
    const loggedFoodContainer = document.querySelector('.logged-food');
    let caloriesEaten = 0;
    let caloriesLeft = dailyInTake;
    const calEatenElement = document.querySelector('.calories-eaten');
    const calLeftElement = document.querySelector('.calories-left');

    // Display the default daily intake when the day is empty
    displayDailyIntake();

    // Clear previous content
    loggedFoodContainer.innerHTML = '';

    // Iterate through the myDay array and create elements for each logged food
    myDay.forEach(food => {
        const foodItemDiv = document.createElement('div');
        foodItemDiv.classList.add('food-item');
        caloriesEaten += food.calories;
        calEatenElement.innerHTML = caloriesEaten;
        caloriesLeft -= food.calories;
        calLeftElement.innerHTML = caloriesLeft;

        // Customize the display based on your myDay array structure
        foodItemDiv.innerHTML = `
            <h3>${food.name}</h3>
            <p>Calories: ${food.calories}</p>
        `;

        loggedFoodContainer.appendChild(foodItemDiv);
    });
}


/* Calorie Calculator Section */


function saveFormData() {
    // Get values from form fields and store them in the object
    formData.age = document.getElementById('age').value;

    // For radio buttons, check which one is selected
    formData.gender = document.getElementById('man').checked ? 'Man' : 'Woman';

    formData.height = document.getElementById('height').value;
    formData.weight = document.getElementById('weight').value;

    // Get the selected activity level id
    var activityLevels = document.getElementsByName('activity');
    for (var i = 0; i < activityLevels.length; i++) {
        if (activityLevels[i].checked) {
            formData.activity = activityLevels[i].id; // Use the id property
            break;
        }
    }

    // Print the collected data to the console (you can modify this part)
    console.log(formData);

}

function calculatePersonalData() {
    console.log('Function was called (calculatePersonalData)')
    const age = Number(formData.age);
    const gender = formData.gender;
    const height = Number(formData.height);
    const weight = Number(formData.weight);
    const activityLVL = Number(formData.activity);
    console.log(age, height, weight, activityLVL);
    let result = 0;

    if (gender === 'Man') {
        result = (10 * weight + 6.25 * height - 5 * age + 5) * activityLVL;
    } else {
        result = (10 * weight + 6.25 * height - 5 * age - 161) * activityLVL;
    }

    const output = document.querySelector('.output-container');
    output.innerHTML = `
    <div class="output-maintain">
        <h3>Maintain Weight:</h3>
        <p>${result}</p>
        <p>Your recommended calories per day to achieve maintaining your weight.</p>
    </div>
    <div class="output-mild-loss">
        <h3>Mild weight loss:</h3>
        <p>${(result / 100) * 81}</p>
        <p>Your recommended calories per day to achieve weight loss of 0.5kg/Week.</p>
    </div>
    <div class="output-extreme-loss">
        <h3>Extreme weight loss</h3>
        <p>${(result / 100) * 62}</p>
        <p>Your recommended calories per day to achieve weight loss of 1.0kg/Week.</p>
    </div>    `;
}

/* FAVORITE FOODS SECTION */

function displayFavFoods() {
    const loggedFoodContainer = document.querySelector('.favFoods-container');
    loggedFoodContainer.innerHTML = ''; // Clear the container before re-rendering

    favoriteFoods.forEach(food => {
        const foodItemDiv = document.createElement('div');
        foodItemDiv.classList.add('food-item');

        foodItemDiv.innerHTML = `
            <h3>${food.name}</h3>
            <p>Calories: ${food.calories}</p>
            <button class="log-food" onclick="logFood('${food.name}', ${food.calories})">Log Food</button>
            <button class="rmv-BTN" onclick="removeFood('${food.name}','${food.calories}');">Remove</button>
        `;

        loggedFoodContainer.appendChild(foodItemDiv);
    });
}

function removeFood(name, calories) {
    // Convert calories to a number for accurate comparison
    const caloriesNumber = parseFloat(calories);

    // Find the index of the food item to be removed
    const indexToRemove = favoriteFoods.findIndex(food => food.name === name && food.calories === caloriesNumber);

    if (indexToRemove !== -1) {
        // Remove the food item from the array
        favoriteFoods.splice(indexToRemove, 1);

        // Update localStorage
        localStorage.setItem('favoriteFoods', JSON.stringify(favoriteFoods));

        // Refresh the display
        displayFavFoods();
    }

    console.log('Removing food:', name, calories);
}
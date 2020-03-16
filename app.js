/*
  Main Application JavaScript File app.js
  Author: Carlos Mazon
  Date: March 2020
  Refer to requirements at bottom of this file as based on the homework assignment.
*/

// All required modules imported js files.
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");

// Used to store the entire team.
const employees = [];

// Main question for the team manager.
const mgrQuestions = [
    {
      message: "Welcome Manager! What is your name:",
    name: "name"
    },
    {
      message: "What is your employee ID:",
      name: "id"
      },
    {
      message: "What is your email:",
      name: "email"
    },
    {
      message: "What is your office number:",
      name: "officeNumber"
      },

  ];

  // Questions for the team members, for Interns & Engineers
const teamQuestions = [{
    type: 'list',
    name: "employeeType",
    message: "What type Employee do you wish to add:",
    choices: ['Engineer', 'Intern']
    },
    {
      message: "Name of team member:",
      name: "name"
    },
    {
      message: "What is their employee ID:",
      name: "id"
    },
    {
      message: "What is their email:",
      name: "email"
    },
    {
      type: 'input',
      name: 'github',
      message: 'What is their github username:',
      // Only prompt if Engineer
      when: function(answers) {
        return answers.employeeType === 'Engineer';
      }
    },
    {
      type: 'input',
      name: 'school',
      message: 'What is the name of their school:',
      // Only prompt if Intern
      when: function(answers) {
        return answers.employeeType === 'Intern';
      }
    }
  ];


function ask(count) {
    inquirer.prompt(teamQuestions).then(teamAnswers => {
    let employee;
    if (teamAnswers.employeeType === 'Intern'){
      employee = new Intern(teamAnswers.name,teamAnswers.id,teamAnswers.email,teamAnswers.school);
    } else 
    {
      employee = new Engineer(teamAnswers.name,teamAnswers.id,teamAnswers.email,teamAnswers.github);
    };
    
    // Push team member into array.
    employees.push(employee);
    
    //DEBUG -- ensuring answers are stored as class objects
    // console.log(employee);
    // console.log(JSON.stringify(teamAnswers, null, ' '));
    
    // After 1st team member is recorded, reduce count and recursively ask
    count--;
    if (count > 0) {
      ask(count);
    };
    })
};


inquirer.prompt(mgrQuestions).then(answers =>
{ 
  // Defining the manager based on the class and adding to array of employees.
  let manager = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
  employees.push(manager);

  // Prompting how many team members the manager has and prompt questions for each member if greater than 0.
  inquirer.prompt(    {
    type: 'input',
    message: "How many employees would you like to add:",
    name: "quantity",
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number
    }).then(answers => {
      //DEBUG
      //console.log(answers);
      if (answers.quantity > 0){
        ask(answers.quantity);
        };
    }).then(async() => {
      // DEBUGGING
      console.log("Total Count:", employees.length);
      //employees.forEach(await function (employee) {
        //console.log("Some Employee: ", employee.getRole(),employee.name);
        let data = await render(employees);
        fs.appendFileSync(outputPath, data, "utf8");
      //});
    }).catch((err) => console.log(err));
});



// INSTRUCTIONS FROM HOMEWORK //

// Write code to use inquirer to gather information about the development team members, and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required above) and pass in an array containing all employee objects; the `render` function will generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML returned from the `render` function. Now write it to a file named `team.html` in the `output` folder. You can use the variable `outputPath` above target this location. 

// Hint: you may need to check if the `output` folder exists and create it if it does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different information; write your code to ask different questions via inquirer depending on employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer, and Intern classes should all extend from a class named Employee; see the directions for further information. Be sure to test out each class and verify it generates an object with the correct structure and methods. This structure will be crucial in order for the provided `render` function to work!
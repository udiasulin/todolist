let taskForm = document.querySelector('form');
let container = document.querySelector('.container');
let list = document.querySelector('.list');

0
const getTodos = () => {

    const todoJSON = localStorage.getItem('todos')

    if (todoJSON !== null) {
        return JSON.parse(todoJSON)
    } else {
        return []
    }
}

const saveTodos = () => {
    localStorage.setItem('todos', JSON.stringify(todos))
}

const todos = getTodos();

let renderTodos = (todoArr) => {

    let openBtn = document.querySelector('.openModal');

    todoArr.sort((a, b) => (a.startDate > b.startDate) ? 1 : ((b.startDate > a.startDate) ? -1 : 0))

    todoArr.forEach((todo) => {
        list.appendChild(displayTask(todo))
    })


    openBtn.addEventListener('click', function () {

        list.style.display = 'none';
        container.style.display = 'inline-flex';

        while (list.lastElementChild && list.lastElementChild.className !== 'inlist') {
            list.removeChild(list.lastElementChild);
        }

    })


}

let todoUpdate = (currentTodo) => {

    list.style.display = 'none';
    container.style.display = 'inline-flex';

    taskForm.name.value = currentTodo['name']
    taskForm.description.value = currentTodo['desc']
    taskForm.startDate.value = currentTodo['startDate']
    taskForm.endDate.value = currentTodo['endDate']

}

let deleteTodo = (currentTodo) => {
    const todoIndex = todos.findIndex((todo1) => todo1.id === currentTodo.id)

    if (todoIndex > -1) {
        todos.splice(todoIndex, 1)
    }
}

let summary = (currentTodo) => {


    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let todoDate = currentTodo.endDate.slice(0, 10);

    const diffInMs = new Date(todoDate) - new Date(date)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays

}



taskForm.addEventListener('submit', function (e) {


    let name = document.querySelector('.name')
    let desc = document.querySelector('.desc')
    let startDate = document.querySelector('.startDate')
    let endDate = document.querySelector('.endDate')


    e.preventDefault()


    container.style.display = 'none';
    list.style.display = 'inline-flex';

    if (name.value === '' || name.value.length > 14) {

        alert('Enter name and name need to be shorter than 10 chrcters')
        container.style.display = 'inline-flex';
        list.style.display = 'none';

    } else if (desc.value === ''  || startDate.value === '' || endDate.value === '') {

        alert('pleast fill the inputs')
        container.style.display = 'inline-flex';
        list.style.display = 'none';

    } else {
        todos.push({
            id: uuidv4(),
            name: name.value,
            desc: desc.value,
            startDate: startDate.value,
            endDate: endDate.value,
            done: false
        })

        saveTodos(todos)
        renderTodos(todos)


        //Clear all the inputs
        name.value = '';
        desc.value = '';
        startDate.value = '';
        endDate.value = '';

    }

})

let displayTask = (todo) => {

    //Task elements
    let taskDiv = document.createElement('div');
    let btnGroup = document.createElement('div');
    let taskName = document.createElement('h2');
    let taskDescription = document.createElement('p');
    let taskDateStart = document.createElement('p');
    let daysRemaining = document.createElement('p');

    // Task content
    let textName = document.createTextNode(todo.name)
    let textDesc = document.createTextNode('Description - ' + todo.desc)
    let textStartDate = document.createTextNode(todo.startDate.slice(0, 10))
    let daysRemainingText = document.createTextNode(summary(todo) + ' Days to complete')


    taskDiv.classList.add('taskDiv')
    taskDescription.classList.add('taskDesc')
    daysRemaining.classList.add('daysRemaining')

    // Task icons 
    let taskDelete = document.createElement('button');
    let taskUpdate = document.createElement('button');
    let taskExpand = document.createElement('button');
    let markTask = document.createElement('input');
    let taskStatus = document.createElement('div');

    // Icons Classes
    taskStatus.setAttribute('class', 'status')
    taskExpand.setAttribute('class', 'fa fa-arrow-circle-down fa-2x btn')
    taskUpdate.setAttribute('class', 'fa fa-edit fa-2x btn')
    taskDelete.setAttribute('class', 'fa fa-minus-circle fa-2x btn')
    markTask.setAttribute('class', 'fa fa-check fa-2x btn checkbox')
    markTask.setAttribute('type', 'checkbox')

    // Appending the text values
    taskName.appendChild(textName)
    taskDescription.appendChild(textDesc)
    taskDateStart.appendChild(textStartDate)
    daysRemaining.appendChild(daysRemainingText)


    // Button group
    btnGroup.appendChild(taskStatus)
    btnGroup.appendChild(markTask)
    btnGroup.appendChild(taskDelete)
    btnGroup.appendChild(taskUpdate)
    btnGroup.appendChild(taskExpand)

    // Appending the elements
    taskDiv.appendChild(taskName)
    taskDiv.appendChild(taskDateStart)
    taskDiv.appendChild(btnGroup)
    taskDiv.appendChild(taskDescription)
    taskDiv.appendChild(daysRemaining)

    //summary if
    if (summary(todo) < 0) {
        taskStatus.style.backgroundColor = '#FFFF1F';
    }

    //Buttons Events 
    markTask.addEventListener('change', function (e) {

        if (e.target.checked) {
            taskStatus.style.backgroundColor = '#4AD361';
            todo['done'] = true;

        } else {
            taskStatus.style.backgroundColor = '#f71b40';
            todo['done'] = false;
        }



    })

    taskDelete.addEventListener('click', function (e) {

        e.target.parentElement.parentElement.remove()
        deleteTodo(todo)
        saveTodos(todos)
    })

    taskUpdate.addEventListener('click', function (e) {
        e.target.parentElement.parentElement.remove()
        deleteTodo(todo)
        todoUpdate(todo)
        saveTodos(todos)
    })

    taskExpand.addEventListener('click', function (e) {

        taskDiv.classList.toggle('expendedTaskDiv')


        if (taskDiv.classList.length > 1) {
            taskDescription.style.display = 'inline-block'
            daysRemaining.style.display = 'inline-block'
            taskExpand.setAttribute('class', 'fa fa-arrow-circle-up fa-2x btn')

        } else {

            taskDescription.style.display = 'none';
            daysRemaining.style.display = 'none';
            taskExpand.setAttribute('class', 'fa fa-arrow-circle-down fa-2x btn')
        }
    })
    return taskDiv;
}

renderTodos(todos)
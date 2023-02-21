/* variables */
let todoLists = []
const themeChanger = document.querySelector('.theme-changer')
const inputBtn = document.querySelector('.input-btn')
const inputEl = document.querySelector('.todo-input')
const listContainer = document.querySelector('.list-container')
const count = document.querySelector('.count')
const clearBtn = document.querySelector('.clear-btn')
const allBtn = document.querySelector('.all-btn')
const activeBtn = document.querySelector('.active-btn')
const completedBtn = document.querySelector('.completed-btn')
const listsFromLocalStorage = JSON.parse(localStorage.getItem('todoLists'))

/* function */
//add todo list
const render = (lists, check) => {
  const listWrapper = document.createElement('div')
  const todoText = document.createElement('p')
  const todoCheckbox = document.createElement('input')
  const todoCheckboxLabel = document.createElement('label')
  const todoCloseBtn = document.createElement('img')

  todoText.textContent = lists
  todoCheckbox.type = 'checkbox'
  todoCheckbox.name = 'checkbox'
  todoCheckboxLabel.htmlFor = 'checkbox'

  todoCheckboxLabel.addEventListener('click', (e) => {
    if (todoCheckbox.checked) {
      todoCheckbox.checked = false
      todoText.style.textDecoration = 'none'
      todoText.style.opacity = '1'
      todoCheckboxLabel.classList.remove('active')
      updateTodoLists(lists, false)
      countItems()
      todoLists.push({ value: lists, checked: check })
      localStorage.setItem('todoLists', JSON.stringify(todoLists))
      // console.log(todoLists)
    } else {
      todoCheckbox.checked = true
      todoText.style.textDecoration = 'line-through'
      todoText.style.opacity = '0.5'
      todoCheckboxLabel.classList.add('active')
      updateTodoLists(lists, true)
      countItems()
      removeLocalTodos(listWrapper)
      // console.log(todoLists)
    }
  })

  //delete todo list
  todoCloseBtn.src = './images/icon-cross.svg'
  todoCloseBtn.addEventListener('click', (e) => {
    e.target.parentElement.remove()
    todoLists = todoLists.filter((t) => t.value !== lists)
    countItems()
    removeLocalTodos(listWrapper)
  })

  function removeLocalTodos(todoRemove) {
    todoLists = listsFromLocalStorage
    const todoIndex = todoRemove.children[2].innerText
    const todoFilter = todoLists.filter((t) => t.value === todoIndex)
    todoLists.splice(todoLists.indexOf(todoFilter[0]), 1)
    localStorage.setItem('todoLists', JSON.stringify(todoLists))
    // console.log(todoFilterString)
  }

  listWrapper.classList.add('list-wrapper')
  todoCheckboxLabel.classList.add('circle')
  todoCloseBtn.classList.add('close-btn')

  listWrapper.appendChild(todoCheckbox)
  listWrapper.appendChild(todoCheckboxLabel)
  listWrapper.appendChild(todoText)
  listWrapper.appendChild(todoCloseBtn)

  // draggable todo list
  listWrapper.classList.add('draggable')
  listWrapper.draggable = true
  listWrapper.addEventListener('dragstart', () => {
    listWrapper.classList.add('dragging')
  })

  listWrapper.addEventListener('dragend', () => {
    listWrapper.classList.remove('dragging')
  })

  listContainer.addEventListener('dragover', (e) => {
    e.preventDefault()
    const afterElement = getDragAfterElement(listContainer, e.clientY)
    const draggable = document.querySelector('.dragging')
    if (afterElement == null) {
      listContainer.appendChild(draggable)
    } else {
      listContainer.insertBefore(draggable, afterElement)
    }
  })

  // determine mouse position on element
  function getDragAfterElement(container, y) {
    const draggableElement = [
      ...container.querySelectorAll('.draggable:not(.dragging)'),
    ]
    return draggableElement.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        // console.log(offset)
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child }
        } else {
          return closest
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
      }
    ).element
  }

  listContainer.appendChild(listWrapper)
}

// count items left
const countItems = () => {
  count.textContent = `
    ${todoLists.filter((t) => t.checked === false).length} item(s) left
  `
}

const updateTodoLists = (value, bool) => {
  todoLists.forEach((t) => {
    if (t.value === value) {
      t.checked = bool
    }
  })
}

if (listsFromLocalStorage) {
  todoLists = listsFromLocalStorage
  todoLists.forEach((todo) => {
    render(todo.value, todo.checked)
  })
}

/*event listener*/
// change theme
themeChanger.addEventListener('click', () => {
  document.body.classList.toggle('light')
  // console.log('changed theme')
})

// keyboard enter
inputEl.addEventListener('keyup', (e) => {
  if (inputEl.value !== '') {
    if (e.key === 'Enter' || e.keyCode === 13) {
      todoLists.push({ value: e.target.value, checked: false })
      render(e.target.value, false)
      inputEl.value = ''
      countItems()
      localStorage.setItem('todoLists', JSON.stringify(todoLists))
      // console.log(todoLists)
    }
  }
})

// clear completed
clearBtn.addEventListener('click', () => {
  document.querySelectorAll('.list-wrapper').forEach((listWrapper) => {
    if (listWrapper.querySelector('input').checked) {
      listWrapper.remove()
    }
  })
  localStorage.removeItem('todoLists')
})

// filter all
allBtn.addEventListener('click', () => {
  document.querySelectorAll('.todo-filter button').forEach((d, i) => {
    if (i === 0) {
      d.classList.add('filter-active')
    } else {
      d.classList.remove('filter-active')
    }
  })
  document.querySelectorAll('.list-wrapper').forEach((listWrapper) => {
    listWrapper.style.display = 'flex'
  })
})

// filter active
activeBtn.addEventListener('click', () => {
  document.querySelectorAll('.todo-filter button').forEach((d, i) => {
    if (i === 1) {
      d.classList.add('filter-active')
    } else {
      d.classList.remove('filter-active')
    }
  })
  document.querySelectorAll('.list-wrapper').forEach((listWrapper) => {
    listWrapper.style.display = 'flex'
    if (listWrapper.querySelector('input').checked) {
      listWrapper.style.display = 'none'
    }
  })
})

// filter completed
completedBtn.addEventListener('click', () => {
  document.querySelectorAll('.todo-filter button').forEach((d, i) => {
    if (i === 2) {
      d.classList.add('filter-active')
    } else {
      d.classList.remove('filter-active')
    }
  })
  document.querySelectorAll('.list-wrapper').forEach((listWrapper) => {
    listWrapper.style.display = 'flex'
    if (!listWrapper.querySelector('input').checked) {
      listWrapper.style.display = 'none'
    }
  })
})

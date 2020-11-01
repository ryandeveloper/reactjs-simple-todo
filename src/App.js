import React, { useState, useEffect, useRef } from 'react'
import TodoItem from './TodoItem';
import Alert from './Alert'
import './index.css';
import uuid from 'uuid'

const getLocalStorage = (keyname = '') => {
   switch (keyname) {
      case 'todolist':
         let todoData = localStorage.getItem(keyname)
         return (todoData ? JSON.parse(todoData) : [])
      default:
         return [];
   }
}

const App = () => {

   // JSON TODO OBJECT { id:123, name='', checked: false/true }

   const [name, setName] = useState('');
   const [list, setList] = useState(getLocalStorage('todolist'));
   const [alert, setAlert] = useState({ show: false, type: '', message: '' })
   const [editing, setEditing] = useState(false)
   const [editID, setEditID] = useState(null)
   const [multipleTodo, setMultipleTodo] = useState('')
   const [options, setOptions] = useState('single')

   const textAreaData = useRef(null)
   const inputRef = useRef(null)

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!name) {
         // if empty show alert
         showAlert(true, 'danger', 'Please Enter Value')
      } else if (name && editing) {
         // if editing

         setList(list.map((todoItem) => {
            if (todoItem.id === editID) {
               return { ...todoItem, name: name }
            }
            return todoItem;
         }))
         setEditing(false)
         setEditID(null)
         setName('')
         showAlert(true, 'success', 'Successfully save changes')
      } else {
         // then submit
         const newTodoItem = {
            id: uuid().replace(/-/g, ''),
            name: name,
            checked: false
         }

         setList([...list, newTodoItem])
         showAlert(true, 'success', 'Successfully Added')
         setName('')
      }
   }

   const showAlert = (show = false, type = '', message = '') => {
      setAlert({ show: show, type, message })
   }

   const editTodo = (id) => {
      const findTodoData = list.find((todoItem) => todoItem.id === id)

      if (findTodoData) {
         setOptions('single')
         setEditing(true)
         setEditID(id)
         setName(findTodoData.name)
      }
   }

   const removeItem = (id, name) => {
      setList(list.filter(item => item.id !== id))
      showAlert(true, 'danger', 'Successfully Deleted: "' + name + '"')
   }

   const removeAllTodos = () => {
      if (window.confirm('Are you sure you want delete all Todo\'s?')) {
         setList([])
         showAlert(true, 'danger', 'Successfully deleted all Todo\'s')
      }
   }

   const removeAllCompleted = () => {
      if (window.confirm('Are you sure you want delete all completed Todo\'s')) {
         setList(list.filter(todo => todo.checked !== true))
         showAlert(true, 'danger', 'Successfully deleted all completed Todo\'s')
      }
   }

   const checkedItem = (id) => {
      setList(list.map((todoItem) => {
         if (todoItem.id === id) {
            return { ...todoItem, checked: !todoItem.checked }
         }
         return todoItem;
      }))
   }

   const optionHandle = () => {
      setOptions((options === 'single' ? 'multiple' : 'single'))
      setEditing(false)
      setEditID(null)
      setName('')
   }

   useEffect(() => {
      localStorage.setItem('todolist', JSON.stringify(list))
   }, [list])

   useEffect(() => {
      if (editing) {
         inputRef.current.focus();
      }
   })

   const handleSubmitMultiple = (e) => {
      if (!textAreaData.current.value) {
         showAlert(true, 'danger', 'Please Enter Value')
      } else if (window.confirm('Are you sure you have already reviewed the list?')) {
         const multipleTodos = textAreaData.current.value.split('\n').map((todoItem, i) => {
            const myReturnData = {
               id: uuid().replace(/-/g, ''),
               name: todoItem,
               checked: false
            }
            return myReturnData
         })

         setList([...list].concat(multipleTodos))
         showAlert(true, 'success', 'Successfully Added')
         setMultipleTodo('');
         setName('')
      }
   }

   return (
      <>
         <section className="section-center">
            {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}

            <h4>Todo List</h4>

            <div className="form-control">
               <select
                  id="selectOpt"
                  className="grocery"
                  value={options} onChange={optionHandle}>
                  <option value="single">Single todo</option>
                  <option value="multiple">Multiple Todo</option>
               </select>
            </div>

            <div className="divider"></div>

            {options === 'multiple' ? (
               <div className="form-control">
                  <textarea
                     className='grocery textarea'
                     cols="30"
                     rows="10"
                     placeholder="Add multiple lines..."
                     value={multipleTodo}
                     ref={textAreaData}
                     onChange={(e) => setMultipleTodo(e.target.value)}
                  />
                  <button type="button" className="submit-btn" onClick={handleSubmitMultiple}>Add Multiple</button>
               </div>
            ) : (
                  <form className="grocery-form" onSubmit={handleSubmit}>
                     <div className="form-control">
                        <input type="text" className="grocery" ref={inputRef} placeholder="Add todo..." value={name} onChange={(e) => setName(e.target.value)} />
                        <button type="submit" className="submit-btn">{editing ? 'Save Changes' : 'Add'}</button>
                     </div>
                  </form>
               )}

         </section>
         {list.length > 0 && (
            <section className="section-center" style={{ marginTop: '1rem' }}>
               <h4>My Todo</h4>

               <div className="divider"></div>

               <div className="grocery-container">
                  <div className="grocery-list">
                     <TodoItem list={list} removeItem={removeItem} editTodo={editTodo} checkedItem={checkedItem} />
                  </div>

                  <div className="divider"></div>

                  <div className="form-control">
                     <button className="clear-btn" onClick={removeAllCompleted}>Remove Completed</button>
                     <button className="clear-btn" onClick={removeAllTodos}>Clear List</button>
                  </div>

               </div>

            </section>
         )}
      </>
   )
}

export default App

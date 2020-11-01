import React from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'

const TodoItem = ({ list, removeItem, editTodo, checkedItem }) => {
   return (
      <>
         {list.map(todoData => {
            const { id, name, checked } = todoData;
            return (
               <article key={id} className="grocery-item">
                  <p className={`title pointer-cursor ${checked && 'completed-item'}`} onClick={() => checkedItem(id)}>
                     <input type="checkbox" checked={checked} onChange={() => checkedItem(id)} /> {name}
                  </p>
                  <div className="btn-container">
                     <button type="button" className="edit-btn" onClick={() => editTodo(id)}><FaEdit /> Edit</button>
                     <button type="button" className="delete-btn" onClick={() => removeItem(id, name)}><FaTrash /> Delete</button>
                  </div>
               </article>
            )
         })}
      </>
   )
}

export default TodoItem;
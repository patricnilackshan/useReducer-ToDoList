import React from 'react'

function App() {
  const ACTIONS = {
    ADD_TODO: 'add-todo',
    SET_TODO: 'set-todo',
    REMOVE_TODO: 'remove-todo',
    TOGGLE_TODO: 'toggle-todo'
  }
  const name = 'John Doe'

  function reducer(state, action) {
    switch(action.type) {
      case ACTIONS.ADD_TODO:
        return [...state, { id: Date.now(), name: action.payload, complete: false }]
      case ACTIONS.SET_TODO:
        return action.payload
      case ACTIONS.REMOVE_TODO:
        return state.filter((todo) => todo.id !== action.payload)
      case ACTIONS.TOGGLE_TODO:
        return state.map((todo) => {
          if (todo.id === action.payload) {
            return { ...todo, complete: !todo.complete }
          }
          return todo
        })
      default:
        return state
    }
  }

  const [state, dispatch] = React.useReducer(reducer, [])
  const [input, setInput] = React.useState('')

  React.useEffect(() => {
    const todos = JSON.parse(localStorage.getItem('todos'))
    if (todos) {
      dispatch({ type: ACTIONS.SET_TODO, payload: todos })
    }
  }, [])

  React.useEffect(() => {
    if (state.length > 0) {     
      localStorage.setItem('todos', JSON.stringify(state))
    }
  }, [state])

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">TO-DO</h1>
      <form onSubmit={(e) => {
        e.preventDefault()
        if (!input) return; // Prevent adding empty todos
        dispatch({ type: ACTIONS.ADD_TODO, payload: input })
        setInput('') // Clear input after submission
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full mb-2"
          placeholder="Add a new task..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded p-2 w-full hover:bg-blue-600"
        >
          Add
        </button>
      </form>
      <div className="mt-4">
        {state.map((todo) => (
          <div key={todo.id} className="flex justify-between items-center p-2 border-b">
            <span className={`flex-1 ${todo.complete ? 'line-through text-gray-400' : ''}`}>
              {todo.name}
            </span>
            <div>
              <button
                onClick={() => dispatch({ type: ACTIONS.TOGGLE_TODO, payload: todo.id })}
                className="bg-yellow-500 text-white rounded p-1 mr-2 hover:bg-yellow-600"
              >
                Toggle
              </button>
              <button
                onClick={() => dispatch({ type: ACTIONS.REMOVE_TODO, payload: todo.id })}
                className="bg-red-500 text-white rounded p-1 hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App

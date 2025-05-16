import { useState } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'

function SearchBar({ onSearch, onClose }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-neutral-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-10 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          placeholder="Search for restaurants or cuisine..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {query && (
          <button
            type="button"
            className="absolute inset-y-0 right-12 flex items-center pr-2"
            onClick={() => setQuery('')}
          >
            <FiX className="h-5 w-5 text-neutral-400 hover:text-neutral-500" />
          </button>
        )}
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={onClose}
        >
          <span className="text-sm font-medium text-primary-500 hover:text-primary-600">
            Close
          </span>
        </button>
      </div>
    </form>
  )
}

export default SearchBar
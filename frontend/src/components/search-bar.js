import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchBar({ onChange }) {
  return (
    <div className="grow">
      <label htmlFor="default-search" className="pt-2 text-sm font-medium sr-only">Search</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon className='w-4 h-4 text-gray-500' />
        </div>
        <input
          onChange={onChange}
          type="search"
          id="default-search"
          className="input w-full max-w-md pl-8 h-12 rounded-lg border"
          placeholder="Search for a course..."
        />
      </div>
    </div>
  );
}

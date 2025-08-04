import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CiSearch as SearchIcon } from 'react-icons/ci';
import { FaFilter as FilterIcon } from 'react-icons/fa';
import GigList from '../../components/specifics/GigList';
import Loading from '../../components/Layouts/Loading'
import { useLazySearchGigsQuery } from '../../redux/apis/api';

const Home = () => {
  const [search, setSearch] = useState('');
  const [minVal, setMinVal] = useState('');
  const [maxVal, setMaxVal] = useState('');
  const [isFilter, setIsFilter] = useState(false);
  const [gigList, setGigList] = useState([]);

  const [triggerSearch, { data, isLoading, error }] = useLazySearchGigsQuery();


  const handleFilterOpen = () => {
    setIsFilter((prev) => !prev)
  }
  const handleFilterApply = () => {
    triggerSearch({ category: search, minPrice:minVal, maxPrice:maxVal });
    setIsFilter((prev) => !prev)
  }
  const clearFilers = () => {
    setMinVal('')
    setMaxVal('')
    triggerSearch({ category: search, minPrice:minVal, maxPrice:maxVal });
    setIsFilter((prev) => !prev)
  }

  const handleSearch = () => {
    if(search==='')return toast.error('Search field is empty')
    triggerSearch({ category: search, minPrice:minVal, maxPrice:maxVal });
  };
  useEffect(() => {
    if (data) {
      setGigList(data?.gigs);
    }
  }, [data])

  return (
    <div className='w-[100%] flex flex-col items-center pt-4 overflow-hidden scrollbar-thin-pretty' >

      <div className="w-[90%] max-w-2xl mx-auto bg-white shadow-md rounded-lg p-4 flex items-center gap-3">
        <FilterIcon className='cursor-pointer m-1 ' onClick={handleFilterOpen} />
        <input
          type="text"

          placeholder="Search by title, tags, category..."
          value={search}
          onChange={e => {
            setSearch(e.target.value)
          }}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-md outline-none"
        />



        <button
          onClick={handleSearch}
          className="px-1 py-1 mx-2 rounded-4xl border-1 cursor-pointer"
        >
          <SearchIcon className="w-6 h-6" />
        </button>
      </div>



      <div className='p-5 w-[100%] overflow-auto'>
        {
          isFilter && <div className="flex fixed flex-col gap-4 p-4 bg-white shadow-lg rounded-2xl w-[90%] sm:w-[60%] md:w-[30%] lg:w-[20%] h-[60vh] overflow-auto z-50 scrollbar-thin-pretty">
            <input
              value={minVal}
              placeholder="Min price"
              type="number"
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) => { setMinVal(e.target.value) }}
            />
            <input
              value={maxVal}
              placeholder="Max price"
              type="number"
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) => { setMaxVal(e.target.value) }}
            />
            <div className='mt-auto flex justify-around mb-2'>
              <button 
            onClick={clearFilers}
            className="mt-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition self-end">
              Clear
            </button>
              <button 
            onClick={handleFilterApply}
            className="mt-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition self-end">
              Apply
            </button>
            </div>
          </div>
        }
        {
          isLoading?<Loading/> :
        <GigList gigs={gigList} />}
      </div>
    </div>
  )
}

export default Home
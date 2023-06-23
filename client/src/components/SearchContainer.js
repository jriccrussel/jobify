import { FormRow, FormRowSelect } from '.'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/SearchContainer'
import { useState, useMemo } from 'react'

const SearchContainer = () => {
    const [localSearch, setLocalSearch] = useState('')

    const {
        isLoading,
        search,
        searchStatus,
        searchType,
        sort,
        sortOptions,
        statusOptions,
        jobTypeOptions,
        handleChange,
        clearFilters,
    } = useAppContext()

    const handleSearch = (e) => {
        // if (isLoading) return
        handleChange({ name: e.target.name, value: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        clearFilters()
    }

    // delay logic - Debounce
    // it runs 2s after last click
    // setTimeout returns id, which pass into clearTimeout
    // const btn = document.querySelector('.btn')
    // const debounce = () => {
    // //      const timeoutID = setTimeout(() => {
    // //          console.log('You clicked me')
    // //      }, 2000)
    // //      console.log(timeoutID)
    // //      clearTimeout(timeoutID)
    // //      console.log('hello')

    // the console.log('You clicked me') will only trigger after the last click
    // when click debounce 1st will trigger console.log(timeoutID) 2nd e clear ang timeoutID or clearTimeout nya, lastly after 2s 3rd trigger nya ang setTimeout and run nya ang console.log('You clicked me')
    //    let = timeoutID 
    //    return () => {
    //        console.log(timeoutID)
    //        clearTimeout(timeoutID)
    //        timeoutID = setTimeout(() => {
    //            console.log('You clicked me')
    //        }, 2000)
    //    }
    // 
    // btn.addEventListener('click', debounce())

    const debounce = () => {
        let timeoutID
        return (e) => {
            setLocalSearch(e.target.value)
            clearTimeout(timeoutID)
            timeoutID = setTimeout(() => {
                handleChange({ name: e.target.name, value: e.target.value })
            }, 1000)
        }
    }

    const optimizedDebounce = useMemo(() => debounce(), [])

    return (
        <Wrapper>
            <form className='form'>
                <h4>search form</h4>

                {/* search position */}
                <div className='form-center'>
                    {/* search by position name */}
                    <FormRow
                        type='text'
                        name='search'
                        value={localSearch}
                        handleChange={optimizedDebounce}
                    ></FormRow>

                    {/* search by status */}
                    <FormRowSelect
                        labelText='job status'
                        name='searchStatus'
                        value={searchStatus}
                        handleChange={handleSearch}
                        list={['all', ...statusOptions]}
                    ></FormRowSelect>

                    {/* search by type */}
                    <FormRowSelect
                        labelText='job type'
                        name='searchType'
                        value={searchType}
                        handleChange={handleSearch}
                        list={['all', ...jobTypeOptions]}
                    ></FormRowSelect>

                    {/* sort */}
                    <FormRowSelect
                        name='sort'
                        value={sort}
                        handleChange={handleSearch}
                        list={sortOptions}
                    ></FormRowSelect>
                    
                    <button
                        className='btn btn-block btn-danger'
                        disabled={isLoading}
                        onClick={handleSubmit}
                    >
                        clear filters
                    </button>
                </div>
            </form>
        </Wrapper>
    )
}

export default SearchContainer
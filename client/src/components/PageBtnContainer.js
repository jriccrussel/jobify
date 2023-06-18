import React from 'react'
import { useAppContext } from '../context/appContext'
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'
import Wrapper from '../assets/wrappers/PageBtnContainer'

const PageBtnContainer = () => {
    const { numOfPages, page, changePage } = useAppContext()
    console.log("%c Line:8 🍞 page - current page", "color:#ea7e5c", page);
    console.log("%c Line:8 🍧 numOfPages - total number of pages", "color:#f5ce50", numOfPages);

    const pages = Array.from({ length: numOfPages }, (_, index) => {
        return index + 1
    })

    const prevPage = () => {
        let newPage = page - 1

        if (newPage < 1) {
            // if ang newPage is greater than 1 then ang newPage stops at page 1  
            newPage = 1

            // alternative
            // if ang newPage is greater than 1 then from page 1 move cya to the last page 
            // newPage = numOfPages
        }
        changePage(newPage)
    }

    const nextPage = () => {
        let newPage = page + 1

        if (newPage > numOfPages) {
            // if ang newPage is less than numOfPages then ang newPage stops at numOfPages (last page)
            newPage = numOfPages

            // alternative
            // if ang newPage is less than numOfPages then ang newPage is set to 1 (page 1)
            // newPage = 1
        }
        changePage(newPage)
    }

    return (
        <Wrapper>
            <button className='prev-btn' onClick={prevPage}>
                <HiChevronDoubleLeft />
                prev
            </button>

            <div className='btn-container'>
                {pages.map((pageNumber) => {
                    return (
                        <button
                            type='button'
                            className={pageNumber === page ? 'pageBtn active' : 'pageBtn'}
                            key={pageNumber}
                            onClick={() => changePage(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    )
                })}
            </div>

            <button className='next-btn' onClick={nextPage}>
                next
                <HiChevronDoubleRight />
            </button>
        </Wrapper>
    )
}

export default PageBtnContainer
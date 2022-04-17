import React from 'react'
import { Link } from 'react-router-dom'

const Pagination = ({postPerPage, totalPosts,paginate}) => {
    const pageNumbers = []


    for(let i = 1; i<= Math.ceil(totalPosts / postPerPage); i++){
        pageNumbers.push(i)
    }

  return (
    <nav >
        <ul className='pagination'>
            {pageNumbers.map((number, i) => ( 
                <li key={i} className="page-item">
                    <Link to="#" onClick={() => paginate(number)} className='page-link text-black'>{number}</Link>
                </li>
            ))}
        </ul>
    </nav>
  )
}

export default Pagination
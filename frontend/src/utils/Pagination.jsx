import React from 'react'

const Pagination = ( {postsPerPage, totalPosts, paginate, currentPage} ) => {
    const pageNumbers = [];
    for (let index = 0; index < Math.ceil(totalPosts / postsPerPage); index++) {
        pageNumbers.push(index)
    }
  return (
        <>
            <div className="flex flex-col items-center my-4">
                <span className="text-sm text-gray-700 dark:text-gray-400 my-3">
                    Mostrando&nbsp;
                    <span className="font-semibold text-gray-900">1</span>&nbsp;
                    a <span className="font-semibold text-gray-900">{postsPerPage}</span>&nbsp;
                    de <span className="font-semibold text-gray-900">{totalPosts}</span>&nbsp;
                    registros.&nbsp;
                    Página <span className="font-semibold text-gray-900">{currentPage}</span> de&nbsp;
                    <span className="font-semibold text-gray-900">{pageNumbers.length}</span>
                </span>
                <ul className="inline-flex -space-x-px">
                    <li>
                        <span key="first" className="py-2 px-3 ml-0 leading-tight text-gray-600 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 cursor-pointer" onClick={() => paginate(1)}>
                            <i className="bi bi-chevron-bar-left"></i>
                        </span>
                    </li>
                    <li>
                        <span key="prev" aria-current="page" className="py-2 px-3 text-gray-600 bg-white border border-gray-300 hover:bg-blue-100 hover:text-blue-700 cursor-pointer" onClick={() => paginate(currentPage > 1 ? currentPage-1 : 1 )}>
                            <i className="bi bi-chevron-compact-left"></i>
                        </span>
                    </li>
                    {pageNumbers.map((number) => (
                        currentPage === number+1
                        ? 
                            <li>
                                <span key="prev" aria-current="page" className="py-2 px-3 text-blue-600 bg-blue-50 border border-gray-300 hover:bg-blue-100 hover:text-blue-700 cursor-pointer">
                                    {number+1}
                                </span>
                            </li>
                        :
                        <li>
                            <span key="prev" aria-current="page" className="py-2 px-3 text-gray-600 bg-white border border-gray-300 hover:bg-blue-100 hover:text-blue-700 cursor-pointer" onClick={() => paginate(number+1)}>
                                {number+1}
                            </span>
                        </li>
                    ))}
                    <li>
                        <span key="prev" aria-current="page" className="py-2 px-3 text-gray-600 bg-white border border-gray-300 hover:bg-blue-100 hover:text-blue-700 cursor-pointer" onClick={() => paginate(currentPage < pageNumbers.length ? currentPage+1 : pageNumbers.length )}>
                            <i className="bi bi-chevron-compact-right"></i>
                        </span>
                    </li>
                    <li>
                        <span key="next" className="py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 cursor-pointer" onClick={() => paginate(pageNumbers.length)}>
                            <i className="bi bi-chevron-bar-right"></i>
                        </span>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Pagination;
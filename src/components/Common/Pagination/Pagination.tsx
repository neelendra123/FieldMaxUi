import { Fragment, useState } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

import { usePagination, DOTS } from './usePagination';

export const DefaultTablePageLimits = [25, 50, 100, 200];

export const Pagination = ({
  totalRows = 0,

  page,
  setPage,

  perPage,
  setPerPage,
}: {
  totalRows: number;

  page: number;
  setPage: (newPage: number) => void;

  perPage: number;
  setPerPage: (newPerPage: number) => void;
}) => {
  const siblingCount = 1;
  const [dropup, setDropup] = useState(false);

  const paginationRange: any = usePagination({
    currentPage: page,
    totalCount: totalRows,
    siblingCount,
    pageSize: perPage,
  });

  // if (page === 0 || paginationRange.length < 2) {
  //   return null;
  // }

  const onNext = () => {
    setPage(page + 1);
  };

  const onPrevious = () => {
    setPage(page - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <Fragment>
      <div className="pagination-wrap">
        <div className="row pb-4">
          <div className="col-xs-12 col-sm-12 col-lg-5">
            <div
              className="flex-content justify-content-center justify-content-lg-start"
              onClick={() => {
                setDropup(!dropup);
              }}
            >
              <p className="mb-0 mr-1 fz-14 font-bold">Rows Per Page:</p>
              <div
                className={
                  dropup
                    ? 'btn-group dropup pr-4 show'
                    : 'btn-group pr-4 dropup'
                }
              >
                <button
                  type="button"
                  className="btn btn-secondary dropdown-toggle"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded={dropup ? 'true' : 'false'}
                >
                  {perPage}
                </button>
                <div
                  className={dropup ? 'dropdown-menu show' : 'dropdown-menu'}
                >
                  {DefaultTablePageLimits.map((limit, index) => {
                    return (
                      <button
                        className="btn btn-style-remove"
                        key={index}
                        onClick={() => {
                          if (limit === perPage) {
                            return;
                          }
                          setPerPage(limit);
                        }}
                      >
                        {limit}
                      </button>
                    );
                  })}
                </div>
              </div>
              <span className="fz-14">
                {`${(page - 1) * perPage + 1}`}-{page * perPage} of {totalRows}
              </span>
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-lg-7">
            <nav
              aria-label="Page navigation example"
              className="d-flex justify-content-center justify-content-lg-end"
            >
              <ul className="pagination mb-0 ml-lg-auto">
                <li className="page-item arrow-left ">
                  <button
                    className="page-link"
                    onClick={onPrevious}
                    disabled={page === 1}
                  >
                    <MdKeyboardArrowLeft />
                  </button>
                </li>
                {paginationRange.map((pageNumber: any, index: number) => {
                  if (pageNumber === DOTS) {
                    return (
                      <li className="pagination-item dots" key={index}>
                        &#8230;
                      </li>
                    );
                  }

                  return (
                    <li className="page-item" key={index}>
                      <button
                        className={`page-link`}
                        onClick={() => {
                          setPage(pageNumber);
                        }}
                      >
                        {' '}
                        {pageNumber}
                      </button>
                    </li>
                  );
                })}
                <li className="page-item arrow-right">
                  <button
                    className="page-link"
                    onClick={onNext}
                    disabled={page === lastPage}
                  >
                    <MdKeyboardArrowRight />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

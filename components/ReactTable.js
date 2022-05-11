import React from 'react'
import { useTable, usePagination, useSortBy } from 'react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const ReactTable = ({ columns, data, onRowClick }) => {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page
    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  )

  // Render the UI for your table
  return (
    <>
      <pre>
        <code>
        <span hidden>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
            },
            null,
            2
          )}
          </span>
        </code>
      </pre>
      <table {...getTableProps()} className="table table-striped table-hover">
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={`table-header-${i}`}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} key={`table-header-${column.render('Header')}`}>{column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? <FontAwesomeIcon icon="sort-down"/>
                        : <FontAwesomeIcon icon="sort-up"/>
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} onClick={(e) => onRowClick(e, row)} key={`table-row-${i}`}>
                {row.cells.map((cell, j) => {
                  return <td {...cell.getCellProps()} key={`table-row-${i}-cell-${j}`}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="d-flex justify-content-end align-items-center p-1">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="btn">
          {'<<'}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage} className="btn">
          {'<'}
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage} className="btn">
          {'>'}
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="btn">
          {'>>'}
        </button>
        <span className="me-2">
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        |
        <span className="ms-2">
          Go to page:
          <input
            type="number"
            className="form-control d-inline-block mx-2 form-control-sm"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '60px' }}
          />
        </span>
        <select
          value={pageSize}
          className="form-select form-select-sm d-inline-block"
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
          style={{ width: '120px' }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

export default ReactTable;

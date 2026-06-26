import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

interface PaginateProps {
  pageCount: number;
  forcePage: number;
  onPageChange: (page: number) => void;
}

function Paginate({ pageCount, forcePage, onPageChange }: PaginateProps) {
  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      pageCount={pageCount}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      forcePage={forcePage - 1}
      containerClassName={"pagination"}
      activeClassName={"active"}
      nextLabel="→"
      previousLabel="←"
    />
  );
}

export default Paginate;

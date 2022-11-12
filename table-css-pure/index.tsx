import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useColorMode } from "@chakra-ui/react";
import { LoadingIcon } from "components/vectors/loading-icon";
import {
  CSSProperties,
  Fragment,
  ReactNode,
  useLayoutEffect,
  useState,
} from "react";

type SimpleColumn = {
  name: string | ReactNode;
  icon?: ReactNode;
  key?: string;
  render?: (row: any, index: number) => ReactNode;
  cellStyle?: CSSProperties;
  sortClick?: undefined;
  headRender?: () => string | ReactNode;
};

type SortableColumn = {
  name: string | ReactNode;
  icon?: ReactNode;
  key: string;
  render?: (row: any, index: number) => ReactNode;
  cellStyle?: CSSProperties;
  sortClick: boolean;
  headRender?: () => string | ReactNode;
};

export type Column = SortableColumn | SimpleColumn;

interface CustomTableProps {
  columns: Column[];
  rows: any[];
  pageSize?: number | null;
  onClickRow?: (row: any) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  sortOrder?: "ASC" | "DESC";
  containerStyle?: CSSProperties;
  rowKey?: string;
  size?: "full" | "md";
  onChangePage?: (index: number) => void;
  pageControl?: number;
}

export function CustomTable({
  columns = [],
  rows = [],
  pageSize = 10,
  onClickRow,
  isLoading,
  emptyMessage = "Sem dados",
  containerStyle,
  size,
  onChangePage,
  pageControl,
}: CustomTableProps) {
  const [indexPage, setIndexPage] = useState(0);
  const { colorMode } = useColorMode();

  useLayoutEffect(() => {
    if (pageControl !== undefined) {
      setIndexPage(pageControl);
    }
  }, [pageControl]);

  return (
    <div
      className={`table-container ${colorMode}`}
      style={{ ...containerStyle }}
    >
      <table>
        <tr className={`table-row ${colorMode}1`}>
          {columns.map(({ name, headRender }, index) => {
            return (
              <th key={`column-${name}-${index}`} className="table-header-cell">
                <div className="header-cell-align">
                  {headRender?.()}
                  {name}{" "}
                </div>
              </th>
            );
          })}
        </tr>
        <tbody>
          {isLoading
            ? null
            : rows?.map((row, rowIndex) => (
                <tr
                  key={`row-${rowIndex}`}
                  onClick={onClickRow ? () => onClickRow(row) : undefined}
                  className={`table-row ${colorMode} ${
                    onClickRow ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map(({ key, render, cellStyle }, index) => {
                    return (
                      <td
                        key={`cell-${rowIndex}-${index}`}
                        className="table-data-cell"
                        style={{ ...cellStyle }}
                      >
                        {render?.(row, rowIndex) ?? row[key ?? ""]}
                      </td>
                    );
                  })}
                </tr>
              ))}
        </tbody>
      </table>
      {isLoading ? (
        <div
          className="loading-container"
          style={{ minHeight: size === "md" ? "200px" : "478px" }}
        >
          <LoadingIcon width="40px" height="40px" />
        </div>
      ) : null}
      {isLoading === false && !rows?.length ? (
        <p className="empty-message">{emptyMessage}</p>
      ) : null}
      {pageSize ? (
        <div className="table-footer-container">
          <div className="buttons-container">
            <button
              aria-label="pagina anterior"
              className={`icon-button outline ${colorMode}`}
              onClick={() => {
                setIndexPage((state) => state - 1);
                onChangePage?.(indexPage - 1);
              }}
              disabled={indexPage === 0}
            >
              <ChevronLeftIcon width="16px" height="16px" />
            </button>
            <p className={`page-number ${colorMode}1`}>{indexPage + 1}</p>
            <button
              className={`icon-button outline ${colorMode}`}
              aria-label="proxima pagina"
              onClick={() => {
                setIndexPage((state) => state + 1);
                onChangePage?.(indexPage + 1);
              }}
              // disabled={(isLoading === false && !rows?.length *) || isLoading}
            >
              <ChevronRightIcon width="16px" height="16px" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

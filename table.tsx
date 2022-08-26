import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Spinner,
  Table,
  TableContainer,
  TableContainerProps,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { defaultScroll } from "chakra/theme";
import { filterArrayBy, sortArrayBy } from "components/filter-array-by";
import { ChevronDownIcon } from "components/vectors/chevron-down-icon";
import { ChevronUpDownIcon } from "components/vectors/chevron-up-down-icon";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, memo, ReactNode, useEffect, useState } from "react";
import { Column } from "./types";

interface DynanmicTableProps {
  columns: Column[];
  rows: any[];
  pageSize?: number | null;
  onClickRow?: (row: any) => void;
  sortBy?: string;
  isLoading?: boolean;
  emptyMessage?: string;
  sortOrder?: "ASC" | "DESC";
  containerStyle?: TableContainerProps;
  rowKey?: string;
  headerButton?: ReactNode;
  lastRow?: any;
  size?: "full" | "md";
}

interface ArrayFilter {
  orderBy: string;
  sortOrder: DynanmicTableProps["sortOrder"];
}

function DynamicTable({
  columns = [],
  rows = [],
  pageSize = 10,
  onClickRow,
  sortBy,
  isLoading,
  emptyMessage = "Sem dados",
  sortOrder = "ASC",
  containerStyle,
  rowKey = "id",
  headerButton,
  lastRow,
  size,
}: DynanmicTableProps) {
  const [currentIndexPage, setCurrentIndexPage] = useState(0);
  const [arrayFilter, setArrayFilter] = useState<ArrayFilter>({
    orderBy: "",
    sortOrder: "DESC",
  });

  let pageArray: number[] = [];

  const numberOfPages = pageSize ? Math.ceil(rows.length / pageSize) : 1;

  useEffect(() => {
    if (currentIndexPage > numberOfPages - 1 && currentIndexPage !== 0)
      setCurrentIndexPage(numberOfPages - 1);
  }, [pageSize]);

  if (sortBy && !arrayFilter.orderBy)
    rows = sortArrayBy(rows, sortBy, sortOrder);

  if (arrayFilter.orderBy)
    rows = sortArrayBy(rows, arrayFilter.orderBy, arrayFilter.sortOrder);

  const paginedData = pageSize
    ? rows.slice(currentIndexPage * pageSize, (currentIndexPage + 1) * pageSize)
    : rows;

  for (let k = 0; k < numberOfPages; k++) {
    pageArray.push(k);
  }

  if (currentIndexPage - 2 >= 0 && numberOfPages > 5) {
    const cut: number[] = pageArray.slice(
      currentIndexPage - 2,
      currentIndexPage + 3
    );
    if (cut.length < 5)
      pageArray = pageArray.slice(numberOfPages - 5, numberOfPages);
    else pageArray = cut;
  } else pageArray = pageArray.slice(0, 5);

  return (
    <TableContainer
      pos="relative"
      bg="#fff"
      pb="30px"
      w="100%"
      overflow="overlay"
      sx={defaultScroll}
      borderRadius="10"
      boxShadow="0px 45px 112px rgba(0, 0, 0, 0.06), 0px 22.7812px 48.825px rgba(0, 0, 0, 0.0405), 0px 9px 18.2px rgba(0, 0, 0, 0.03), 0px 1.96875px 6.475px rgba(0, 0, 0, 0.0195)"
      {...containerStyle}
    >
      {headerButton ? (
        <Flex
          alignItems="center"
          pos="absolute"
          top="0"
          h="50.5px"
          right={{ base: "10px", "2xl": "25px" }}
        >
          {headerButton}
        </Flex>
      ) : null}
      <Table>
        <Thead>
          <Tr bg="#F5F5F5">
            {columns.map(({ name, key, sortClick }, index) => {
              const isSelected = key === arrayFilter.orderBy;
              const isASC = arrayFilter.sortOrder === "ASC";
              return (
                <Th
                  key={`column-${name}-${index}`}
                  textTransform="none"
                  fontSize="15"
                  fontWeight="bold"
                  color="text"
                  fontFamily="Inter"
                  bg={isSelected ? "gray.200" : "none"}
                  _hover={{ bg: sortClick ? "gray.200" : "none" }}
                  onClick={
                    sortClick
                      ? () =>
                          isSelected
                            ? isASC
                              ? setArrayFilter({
                                  orderBy: "",
                                  sortOrder: "DESC",
                                })
                              : setArrayFilter({
                                  orderBy: key,
                                  sortOrder: "ASC",
                                })
                            : setArrayFilter({
                                orderBy: key,
                                sortOrder: "DESC",
                              })
                      : undefined
                  }
                  cursor={sortClick ? "pointer" : undefined}
                >
                  <Flex alignItems="center" gap="8px" h="26px">
                    {name}{" "}
                    {sortClick ? (
                      <Flex
                        alignItems="center"
                        justifyContent="center"
                        w="25px"
                        h="26px"
                        transform={isASC ? undefined : "rotate(180deg)"}
                      >
                        {!isSelected ? (
                          <ChevronUpDownIcon width="8px" />
                        ) : (
                          <ChevronDownIcon width="8px" />
                        )}
                      </Flex>
                    ) : null}
                  </Flex>
                </Th>
              );
            })}
          </Tr>
        </Thead>

        <Tbody>
          <AnimatePresence>
            {paginedData.map((row, rowIndex) => (
              <motion.tr
                key={`row-${rowIndex}`}
                onClick={onClickRow ? () => onClickRow(row) : undefined}
                style={{
                  cursor: onClickRow ? "pointer" : undefined,
                  opacity: "0",
                }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="table-row"
              >
                {columns.map(({ key, render, cellStyle }, index) => {
                  return (
                    <Fragment key={`cell-${rowIndex}-${index}`}>
                      {render ? (
                        <Td py="0.6em" color="text" {...cellStyle}>
                          {render(row, rowIndex)}
                        </Td>
                      ) : (
                        <Td py="0.6em" color="text" {...cellStyle}>
                          {row[key ?? ""]}
                        </Td>
                      )}
                    </Fragment>
                  );
                })}
              </motion.tr>
            ))}
            {lastRow ? (
              <motion.tr
                style={{
                  opacity: "0",
                  background: "#F5F5F5",
                }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {columns.map(({ key, cellStyle, render }, index) => {
                  render?.(lastRow, paginedData.length);
                  return (
                    <Td
                      key={`cell-${paginedData.length}-${index}`}
                      py="0.6em"
                      color="text"
                      {...cellStyle}
                    >
                      {lastRow[key ?? ""]}
                    </Td>
                  );
                })}
              </motion.tr>
            ) : null}
          </AnimatePresence>
        </Tbody>
      </Table>
      {isLoading ? (
        <Flex
          minH={rows.length ? "auto" : size === "md" ? "200px" : "400px"}
          justifyContent="center"
          alignItems="center"
          pos={rows.length ? "absolute" : undefined}
          top="50.5px"
          left="0"
          bottom="0"
          right="0"
          backdropFilter="blur(3px)"
          bg={!rows.length ? "none" : "rgba(0,0,0, 0.1)"}
          zIndex="10"
        >
          <Spinner />
        </Flex>
      ) : null}
      {isLoading === false && !rows.length ? (
        <Text m="15px 0 0 20px">{emptyMessage}</Text>
      ) : null}

      {pageSize && numberOfPages > 1 ? (
        <Flex w="100%" justifyContent="flex-end" p="30px 40px 0">
          <Flex alignItems="center" gap="10px">
            <IconButton
              aria-label="pagina anterior"
              variant="outline"
              icon={<ChevronLeftIcon />}
              onClick={() => setCurrentIndexPage((state) => state - 1)}
              disabled={currentIndexPage === 0}
            />
            {pageArray.map((number, index) => {
              const active = currentIndexPage === number;

              return (
                <Text
                  key={`pagestable-${index}`}
                  _hover={{ textDecor: "underline" }}
                  py="4px"
                  fontWeight={active ? "bold" : "normal"}
                  onClick={() => setCurrentIndexPage(number)}
                  cursor="pointer"
                  w="25px"
                  textAlign="center"
                  borderRadius="5"
                  bg={active ? "#D0DAFF" : "none"}
                >
                  {number + 1}
                </Text>
              );
            })}
            <IconButton
              variant="outline"
              aria-label="proxima pagina"
              icon={<ChevronRightIcon />}
              onClick={() => setCurrentIndexPage((state) => state + 1)}
              disabled={currentIndexPage + 1 === numberOfPages}
            />
          </Flex>
        </Flex>
      ) : null}
    </TableContainer>
  );
}

export default memo(DynamicTable);

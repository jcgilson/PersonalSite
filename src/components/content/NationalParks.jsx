import React, { useState } from "react";
// MUI
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, TableSortLabel, Paper, FormControlLabel, Switch
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
// Consts
import { nationalParks } from './nationalParks';
// CSS
import './content.css';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'National Park',
  },
  {
    id: 'orderVisited',
    numeric: true,
    disablePadding: false,
    label: 'Order Visited',
  },
  {
    id: 'yearsVisited',
    numeric: true,
    disablePadding: false,
    label: 'Visitation Dates',
  },
  {
    id: 'favoriteOrder',
    numeric: true,
    disablePadding: false,
    label: 'Favorite Order',
  }
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
			className="backgroundColorBlue"
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function NationalParks() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - nationalParks.length) : 0;

  return (
	<div className="pageContainer">
		<Box sx={{ width: '80vw', marginLeft: '10%', marginTop: '6vh', maxHeight: '85vh' }}>
			<Paper sx={{ width: '100%', mb: 2, borderRadius: '8px', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.4)' }}>
				<TableContainer>
				<Table
					sx={{ minWidth: 750 }}
					aria-labelledby="tableTitle"
					size={dense ? 'small' : 'medium'}
				>
					<EnhancedTableHead
					order={order}
					orderBy={orderBy}
					onRequestSort={handleRequestSort}
					rowCount={nationalParks.length}
					/>
					<TableBody>
					{stableSort(nationalParks, getComparator(order, orderBy))
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((park) => {
						return (
							<TableRow>
							<TableCell
								component="th"
								id={park}
								style={{ width: '135px', paddingRight: '0' }}
							>
								{park.name}
							</TableCell>
							<TableCell style={{ width: '100px' }} align="right">{park.orderVisited}</TableCell>
							<TableCell style={{ width: '125px' }} align="right">{park.yearsVisited?.join(", ")}</TableCell>
							<TableCell style={{ width: '100px' }} align="right">{park.favoriteOrder}</TableCell>
							</TableRow>
						);
						})}
					{emptyRows > 0 && (
						<TableRow
						style={{
							height: (dense ? 33 : 53) * emptyRows,
						}}
						>
						<TableCell colSpan={6} />
						</TableRow>
					)}
					</TableBody>
				</Table>
				</TableContainer>
				<div className="flexRow justifySpaceBetween paddingLeftExtraLarge backgroundColorGray">
					<FormControlLabel
						control={<Switch checked={dense} onChange={handleChangeDense} />}
						label="Dense padding"
					/>
					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component="div"
						count={nationalParks.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</div>
			</Paper>
		</Box>
	</div>
  );
}
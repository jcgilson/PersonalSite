import React, { useState } from "react";
// Components
import Map from './Map';
// MUI
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, TableSortLabel, Paper, FormControlLabel, Switch,
  ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
// Consts
import { nationalParks } from './consts/NationalParks';
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
  const [display, setDisplay] = useState('map');

  const parksDisplayed = display === 'visited' ? nationalParks.filter((park) => park.visited) : nationalParks;

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

  const handleDisplayChange = (event, newDisplay) => {
		setDisplay(newDisplay);
	};

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - parksDisplayed.length) : 0;

  return (
    <div className="pageContainer">
      <div className="width80Percent marginAuto flexRow justifySpaceBetween marginTopMedium marginBottomSmall">
          <h1 className="massiveFont serifFont marginTopMedium">National Parks</h1>
          <ToggleButtonGroup
              value={display}
              exclusive
              onChange={handleDisplayChange}
              aria-label="display"
          >
              <ToggleButton className="small" value="map" aria-label="map view">
                  Map View
              </ToggleButton>
              <ToggleButton className="small" value="visited" aria-label="visited parks">
                  Visted Only
              </ToggleButton>
              <ToggleButton className="small" value="all" aria-label="all parks">
                  All Parks
              </ToggleButton>
          </ToggleButtonGroup>
      </div>

      {display === 'map' && <Map />}

      {display !== 'map' && <Box sx={{ width: '80vw', marginLeft: '10%', marginTop: '24px', maxHeight: '85vh' }}>
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
              rowCount={parksDisplayed.length}
            />
            <TableBody>
            {stableSort(parksDisplayed, getComparator(order, orderBy))
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
              count={parksDisplayed.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </Paper>
      </Box>}
    </div>
  );
}
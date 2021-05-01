import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Chip,
  Card,
  CardHeader,
  Grid,
} from '@material-ui/core'
import { KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { DataGrid } from '@material-ui/data-grid'
import { formatRelative, differenceInDays } from 'date-fns'

import styles from './Orders.module.scss'

const defaultFilters = {
  status: '',
  date: null,
}

const ORDER_STATUS = {
  PROCESSING: 'processing',
  FINISHED: 'finished',
  NEW: 'new',
  ALL: '',
}

const parseDate = (str) => Date.parse(str.value || str)
const showRelative = (v) => formatRelative(parseDate(v), new Date())
const compareDate = (v1, v2) =>
  parseDate(v1).valueOf() - parseDate(v2).valueOf()
const transformOrder = ({ orderId, ...rest }) => ({ ...rest, id: orderId })
const orderColumns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'orderName', headerName: 'Title', width: 200 },
  { field: 'orderStage', headerName: 'Status', width: 130 },
  {
    field: 'orderDate',
    width: 160,
    headerName: 'Date',
    valueGetter: showRelative,
    sortComparator: compareDate,
  },
]

export const Orders = ({ orders = [] }) => {
  const [selectedOrders, setSelectedOrders] = useState(() =>
    orders.map(transformOrder)
  )
  const [filters, setFilters] = useState(defaultFilters)

  useEffect(() => {
    let filteredOrders = orders
    filteredOrders = orders
      .filter(({ orderStage: status }) => {
        if (filters.status) {
          return (
            status.trim().toLowerCase() === filters.status.trim().toLowerCase()
          )
        } else return true
      })
      .filter(({ orderDate: dt }) => {
        if (filters.date) {
          let filterIn = false
          let leftDate = parseDate(dt)
          let rightDate = filters.date
          const diff = Math.abs(differenceInDays(leftDate, rightDate))
          if (diff === 0) {
            filterIn = true
          }
          return filterIn
        } else return true
      })
      .map(transformOrder)
    setSelectedOrders(filteredOrders)
  }, [filters.status, filters.date, orders])

  const isOrderStatus = (status) => {
    if (!filters?.status) return true
    else return filters.status === status
  }
  const setOrderStatus = (status) => () => setFilters({ ...filters, status })
  const chipColor = (status) => (isOrderStatus(status) ? 'primary' : 'default')

  const orderDate = () => filters.date
  const setOrderDate = (date) => setFilters({ ...filters, date })

  return (
    <Container fixed maxWidth="md" className={styles.orders}>
      <Card className={styles.header}>
        <CardHeader
          title={
            <Typography color="primary" align="center">
              :: Orders ::
            </Typography>
          }
        />
        <Grid
          container
          justify="space-between"
          align="center"
          className={styles.headerContent}
        >
          <Grid item>
            <Chip
              label="All"
              clickable
              color={chipColor(ORDER_STATUS.ALL)}
              onClick={setOrderStatus(ORDER_STATUS.ALL)}
            />
            <Chip
              label="Processing"
              clickable
              color={chipColor(ORDER_STATUS.PROCESSING)}
              onClick={setOrderStatus(ORDER_STATUS.PROCESSING)}
            />
            <Chip
              label="Finished"
              clickable
              color={chipColor(ORDER_STATUS.FINISHED)}
              onClick={setOrderStatus(ORDER_STATUS.FINISHED)}
            />
            <Chip
              label="New"
              clickable
              color={chipColor(ORDER_STATUS.NEW)}
              onClick={setOrderStatus(ORDER_STATUS.NEW)}
            />
          </Grid>
          <Grid item>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                label="Order Date"
                onChange={setOrderDate}
                value={orderDate()}
                format="MM/dd/yyyy"
                clearable
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
      </Card>
      <DataGrid
        rows={selectedOrders}
        columns={orderColumns}
        className={styles.list}
        disableSelectionOnClick
      />
    </Container>
  )
}

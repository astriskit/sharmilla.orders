import { useState } from 'react'
import { Container, Grid, Card, Input } from '@material-ui/core'
import { DataGrid } from '@material-ui/data-grid'
import { formatRelative } from 'date-fns'

import styles from './Orders.module.scss'

const defaultFilters = {}

const parseDate = (str) => Date.parse(str.value || str)
const showRelative = (v) => formatRelative(parseDate(v), new Date())
const compareDate = (v1, v2) =>
  parseDate(v1).valueOf() - parseDate(v2).valueOf()

const orderColumns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'orderName', headerName: 'Title', flex: 0.6 },
  { field: 'orderStage', headerName: 'Status', width: 130 },
  {
    field: 'orderDate',
    flex: 0.4,
    headerName: 'Date',
    valueGetter: showRelative,
    sortComparator: compareDate,
  },
]

export const Orders = ({ orders = [] }) => {
  const [selectedOrders, setSelectedOrder] = useState(() =>
    orders.map(({ orderId, ...rest }) => ({ ...rest, id: orderId }))
  )
  const [filters, setFilters] = useState(defaultFilters)
  return (
    <Container fixed maxWidth="md" className={styles.orders}>
      <DataGrid
        rows={selectedOrders}
        columns={orderColumns}
        className={styles.list}
      />
    </Container>
  )
}

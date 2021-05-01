export { Orders as default } from '../components'

export function getServerSideProps() {
  const orders = require('../orders.json')
  return { props: { orders } }
}

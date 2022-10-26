import React, { useState, useEffect } from 'react'

import useResetState from 'components/hooks/useResetState'
import StocksTable from './StocksTable'
// import GC from 'Context'

const WatchlistTable = () => {
  const [symbols, setSymbols] = useState([])
  const { state } = useResetState()

  useEffect(() => {
    setSymbols(state.userObj?.stock_watchlist)
  }, [state])

  return (
    <>
      <StocksTable symbols={symbols} />
    </>
  )
}

export default WatchlistTable

import { ConvertRegMktTime } from './date'

export const processData = (data, key) => ({
  key,
  Symbol: data.symbol,
  Name: data.shortName,
  LastPrice: data.regularMarketPrice.fmt,
  MarketTime: ConvertRegMktTime(data.regularMarketTime),
  Change: data.regularMarketChange.fmt,
  perChange: data.regularMarketChangePercent.fmt,
  Volume: data.regularMarketVolume.fmt,
  AvgVol: data.regularMarketVolume.fmt,
  MarketCap: data.marketCap?.fmt || '-',
})

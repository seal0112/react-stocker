import React, { useState, useEffect } from 'react'
import { Container, Table } from 'react-bootstrap'
import dayjs from 'dayjs'
import * as recommendStockApi from 'utils/RecommendStockAPI'
import 'assets/css/recommend-stock.css'

const RecommendStockList = () => {
  const [recommendStocks, setRecommendStocks] = useState([])
  const [filterModels, setFilterModels] = useState([])
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [selectedFilterModel, setSelectedFilterModel] = useState('')
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    recommendStockApi.getFilterModels()
      .then(data => {
        setFilterModels(data.filter_models || [])
      })
      .catch(err => console.error('Failed to fetch filter models:', err))
  }, [])

  useEffect(() => {
    fetchRecommendStocks()
    fetchStatistics()
  }, [selectedDate, selectedFilterModel])

  const fetchRecommendStocks = () => {
    setLoading(true)
    const params = {
      date: selectedDate
    }
    if (selectedFilterModel) {
      params.filterModel = selectedFilterModel
    }

    recommendStockApi.getRecommendStockList(params)
      .then(data => {
        setRecommendStocks(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch recommend stocks:', err)
        setRecommendStocks([])
        setLoading(false)
      })
  }

  const fetchStatistics = () => {
    recommendStockApi.getStatistics(selectedDate)
      .then(data => {
        setStatistics(data)
      })
      .catch(err => {
        console.error('Failed to fetch statistics:', err)
        setStatistics(null)
      })
  }

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value)
  }

  const handleFilterModelChange = (e) => {
    setSelectedFilterModel(e.target.value)
  }

  return (
    <Container className="recommend-stock-container">
      <h2>每日推薦股票</h2>

      <div className="recommend-stock-filters">
        <div className="form-group">
          <label htmlFor="date-select">日期:</label>
          <input
            type="date"
            id="date-select"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="filter-model-select">篩選模型:</label>
          <select
            id="filter-model-select"
            value={selectedFilterModel}
            onChange={handleFilterModelChange}
          >
            <option value="">全部</option>
            {filterModels.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
      </div>

      {statistics && (
        <div className="recommend-stock-stats">
          <span>
            日期: {statistics.date} | 推薦總數: {statistics.total_recommendations}
          </span>
        </div>
      )}

      {loading ? (
        <p>載入中...</p>
      ) : recommendStocks.length > 0 ? (
        <Table striped bordered hover responsive className="recommend-stock-table">
          <thead>
            <tr>
              <th>股票代碼</th>
              <th>股票名稱</th>
              <th>篩選模型</th>
              <th>推薦日期</th>
            </tr>
          </thead>
          <tbody>
            {recommendStocks.map(stock => (
              <tr key={stock.id}>
                <td>
                  <a
                    href={`/basic-info/daily-info/${stock.stock_id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {stock.stock_id}
                  </a>
                </td>
                <td>{stock.stock_name}</td>
                <td>
                  <span className="filter-model-badge">{stock.filter_model}</span>
                </td>
                <td>{stock.update_date}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="recommend-stock-empty">
          <p>該日期無推薦股票</p>
        </div>
      )}
    </Container>
  )
}

export default RecommendStockList

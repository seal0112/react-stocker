import React, { useState, useEffect } from 'react'
import { Container, Table, Button, Modal, Spinner, Alert } from 'react-bootstrap'
import dayjs from 'dayjs'
import * as recommendStockApi from 'utils/RecommendStockAPI'
import * as stockAnalysisApi from 'utils/StockAnalysisAPI'
import 'assets/css/recommend-stock.css'

const SIGNAL_CLASS = {
  'Strong Buy': 'strong-buy',
  強力買進: 'strong-buy',
  Buy: 'buy',
  買進: 'buy',
  Sell: 'sell',
  賣出: 'sell',
  'Strong Sell': 'strong-sell',
  強力賣出: 'strong-sell'
}

const getSignalClass = (signal) => SIGNAL_CLASS[signal] || 'neutral'

const RecommendStockList = () => {
  const [recommendStocks, setRecommendStocks] = useState([])
  const [filterModels, setFilterModels] = useState([])
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [selectedFilterModel, setSelectedFilterModel] = useState('')
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(false)

  const [analysisModal, setAnalysisModal] = useState({ show: false, stockId: null, stockName: null })
  const [analysisData, setAnalysisData] = useState(null)
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [analysisError, setAnalysisError] = useState(null)

  useEffect(() => {
    recommendStockApi.getFilterModels()
      .then(data => setFilterModels(data.filter_models || []))
      .catch(err => console.error('Failed to fetch filter models:', err))
  }, [])

  useEffect(() => {
    fetchRecommendStocks()
    fetchStatistics()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedFilterModel])

  const fetchRecommendStocks = () => {
    setLoading(true)
    const params = { date: selectedDate }
    if (selectedFilterModel) params.filterModel = selectedFilterModel

    recommendStockApi.getRecommendStockList(params)
      .then(data => { setRecommendStocks(data); setLoading(false) })
      .catch(err => { console.error('Failed to fetch recommend stocks:', err); setRecommendStocks([]); setLoading(false) })
  }

  const fetchStatistics = () => {
    recommendStockApi.getStatistics(selectedDate)
      .then(data => setStatistics(data))
      .catch(err => { console.error('Failed to fetch statistics:', err); setStatistics(null) })
  }

  const handleViewAnalysis = (stock) => {
    setAnalysisModal({ show: true, stockId: stock.stock_id, stockName: stock.stock_name })
    setAnalysisData(null)
    setAnalysisError(null)
    setAnalysisLoading(true)

    stockAnalysisApi.getStockAnalysis(stock.stock_id)
      .then(data => { setAnalysisData(data); setAnalysisLoading(false) })
      .catch(err => {
        console.error('Failed to fetch stock analysis:', err)
        setAnalysisError('無法取得近況資料，請稍後再試')
        setAnalysisLoading(false)
      })
  }

  const closeAnalysisModal = () => {
    setAnalysisModal({ show: false, stockId: null, stockName: null })
    setAnalysisData(null)
    setAnalysisError(null)
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
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="filter-model-select">篩選模型:</label>
          <select
            id="filter-model-select"
            value={selectedFilterModel}
            onChange={(e) => setSelectedFilterModel(e.target.value)}
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
          <span>日期: {statistics.date} | 推薦總數: {statistics.total_recommendations}</span>
        </div>
      )}

      {loading && <p>載入中...</p>}
      {!loading && recommendStocks.length > 0 && (
        <Table striped bordered hover responsive className="recommend-stock-table">
          <thead>
            <tr>
              <th>股票代碼</th>
              <th>股票名稱</th>
              <th>篩選模型</th>
              <th>推薦日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {recommendStocks.map(stock => (
              <tr key={stock.id}>
                <td>
                  <a href={`/basic-info/daily-info/${stock.stock_id}`} target="_blank" rel="noreferrer">
                    {stock.stock_id}
                  </a>
                </td>
                <td>{stock.stock_name}</td>
                <td><span className="filter-model-badge">{stock.filter_model}</span></td>
                <td>{stock.update_date}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleViewAnalysis(stock)}
                  >
                    查看近況
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {!loading && recommendStocks.length === 0 && (
        <div className="recommend-stock-empty">
          <p>該日期無推薦股票</p>
        </div>
      )}

      <Modal show={analysisModal.show} onHide={closeAnalysisModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {analysisModal.stockId} {analysisModal.stockName}｜近況分析
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {analysisLoading && (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">AI 分析中，請稍候...</p>
            </div>
          )}
          {analysisError && (
            <Alert variant="danger">{analysisError}</Alert>
          )}
          {analysisData && (
            <div className="stock-analysis-content">
              <div className="mb-3">
                <span className={`analysis-signal-badge signal-${getSignalClass(analysisData.signal)}`}>
                  {analysisData.signal || '觀望'}
                </span>
              </div>

              {analysisData.summary && (
                <div className="mb-3">
                  <h6 className="analysis-section-title">總結</h6>
                  <p className="analysis-summary">{analysisData.summary}</p>
                </div>
              )}

              {analysisData.positives?.length > 0 && (
                <div className="mb-3">
                  <h6 className="analysis-section-title text-success">正面因素</h6>
                  <ul className="analysis-list">
                    {analysisData.positives.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysisData.risks?.length > 0 && (
                <div className="mb-3">
                  <h6 className="analysis-section-title text-danger">風險因素</h6>
                  <ul className="analysis-list">
                    {analysisData.risks.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="analysis-footer text-muted small">
                {analysisData.data_freshness && (
                  <span>資料新鮮度：{analysisData.data_freshness}</span>
                )}
                {analysisData.model_name && (
                  <span className="ms-3">模型：{analysisData.model_name}</span>
                )}
                {analysisData.analyzed_at && (
                  <span className="ms-3">
                    分析時間：{dayjs(analysisData.analyzed_at).format('YYYY-MM-DD HH:mm')}
                  </span>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAnalysisModal}>關閉</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default RecommendStockList

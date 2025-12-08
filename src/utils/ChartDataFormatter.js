/**
 * 將 Google Charts 二維陣列格式轉換為 Chart.js 格式
 * @param {Array} googleData - Google Charts 格式的二維陣列，第一行為標題
 * @param {Object} options - 配置選項
 * @returns {Object} Chart.js 格式的數據對象
 */
export const formatForChartJS = (googleData, options = {}) => {
  if (!googleData || googleData.length < 2) {
    return { labels: [], datasets: [] }
  }

  const headers = googleData[0]
  const dataRows = googleData.slice(1)

  const labels = dataRows.map(row => row[0])

  const datasets = headers.slice(1).map((header, index) => {
    const data = dataRows.map(row => row[index + 1])
    const color = options.colors?.[index] || getDefaultColor(index)

    return {
      label: header,
      data,
      borderColor: color,
      backgroundColor: options.type === 'bar'
        ? color
        : `${color}20`,
      fill: options.fill ?? false,
      tension: 0.1,
      pointRadius: options.pointSize ?? 4,
      pointHoverRadius: (options.pointSize ?? 4) + 2
    }
  })

  return { labels, datasets }
}

/**
 * 建立折線圖 dataset
 */
export const createLineDataset = (label, data, options = {}) => {
  const color = options.color || getDefaultColor(0)
  return {
    label,
    data,
    borderColor: color,
    backgroundColor: `${color}20`,
    fill: options.fill ?? false,
    tension: options.tension ?? 0.1,
    pointRadius: options.pointSize ?? 4,
    pointHoverRadius: (options.pointSize ?? 4) + 2,
    borderWidth: options.borderWidth ?? 2
  }
}

/**
 * 建立長條圖 dataset
 */
export const createBarDataset = (label, data, options = {}) => {
  const color = options.color || getDefaultColor(0)
  return {
    label,
    data,
    backgroundColor: options.backgroundColor || color,
    borderColor: options.borderColor || color,
    borderWidth: options.borderWidth ?? 1,
    borderRadius: options.borderRadius ?? 4
  }
}

/**
 * 預設顏色調色盤
 */
const defaultColors = [
  '#6096FD', // 主色藍
  '#2cc185', // 綠色
  '#FF6384', // 紅色
  '#FFCE56', // 黃色
  '#36A2EB', // 淺藍
  '#9966FF', // 紫色
  '#FF9F40', // 橙色
  '#4BC0C0'  // 青色
]

const getDefaultColor = (index) => {
  return defaultColors[index % defaultColors.length]
}

/**
 * 從 Google Charts options 轉換為 Chart.js options
 */
export const convertGoogleOptionsToChartJS = (googleOptions = {}, type = 'line') => {
  const chartJSOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: googleOptions.legend?.position || 'top'
      },
      title: {
        display: !!googleOptions.title,
        text: googleOptions.title || ''
      }
    },
    scales: {
      x: {
        display: true,
        ticks: {
          maxTicksLimit: googleOptions.hAxis?.showTextEvery
            ? Math.ceil(100 / googleOptions.hAxis.showTextEvery)
            : undefined
        }
      },
      y: {
        display: true,
        beginAtZero: googleOptions.vAxis?.minValue === 0,
        title: {
          display: !!googleOptions.vAxis?.title,
          text: googleOptions.vAxis?.title || ''
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  }

  return chartJSOptions
}

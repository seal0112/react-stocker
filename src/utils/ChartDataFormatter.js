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
  '#4BC0C0' // 青色
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
        grid: {
          color: function (context) {
            const label = context.chart.data.labels?.[context.index]
            if (!label) return 'transparent'
            const sep = label.includes('Q') ? 'Q' : label.includes('/') ? '/' : null
            if (!sep) return 'rgba(0,0,0,0.1)'
            const year = label.split(sep)[0]
            if (context.index === 0) return 'rgba(0,0,0,0.2)'
            const prevLabel = context.chart.data.labels?.[context.index - 1]
            const prevYear = prevLabel?.split(sep)[0]
            return year !== prevYear ? 'rgba(0,0,0,0.2)' : 'transparent'
          },
          lineWidth: function (context) {
            const label = context.chart.data.labels?.[context.index]
            if (!label) return 1
            const sep = label.includes('Q') ? 'Q' : label.includes('/') ? '/' : null
            if (!sep) return 1
            const year = label.split(sep)[0]
            if (context.index === 0) return 1
            const prevLabel = context.chart.data.labels?.[context.index - 1]
            const prevYear = prevLabel?.split(sep)[0]
            return year !== prevYear ? 1 : 1
          }
        },
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          callback: function (value, index, ticks) {
            const label = this.getLabelForValue(value)
            if (!label) return ''
            const sep = label.includes('Q') ? 'Q' : label.includes('/') ? '/' : null
            if (!sep) return label
            const year = label.split(sep)[0]
            if (index === 0) return year
            const prevLabel = this.getLabelForValue(ticks[index - 1].value)
            const prevYear = prevLabel?.split(sep)[0]
            return year !== prevYear ? year : ''
          }
        }
      },
      y: {
        display: true,
        position: 'left',
        min: googleOptions.vAxes?.[0]?.minValue ?? googleOptions.vAxis?.minValue ?? undefined,
        title: {
          display: !!googleOptions.vAxes?.[0]?.title || !!googleOptions.vAxis?.title,
          text: googleOptions.vAxes?.[0]?.title || googleOptions.vAxis?.title || ''
        }
      },
      ...(googleOptions.vAxes?.[1] !== undefined && {
        y1: {
          display: true,
          position: 'right',
          grid: { drawOnChartArea: false },
          title: {
            display: !!googleOptions.vAxes[1]?.title,
            text: googleOptions.vAxes[1]?.title || ''
          }
        }
      })
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  }

  return chartJSOptions
}

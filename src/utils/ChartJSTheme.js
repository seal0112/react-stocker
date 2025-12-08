/**
 * Chart.js 主題配置
 */

// 色彩主題
export const colors = {
  primary: '#6096FD',
  success: '#2cc185',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  secondary: '#6c757d',
  light: '#f8f9fa',
  dark: '#343a40'
}

// 圖表專用顏色
export const chartColors = {
  revenue: '#2cc185',
  expense: '#dc3545',
  profit: '#6096FD',
  loss: '#FF6384',
  growth: '#2cc185',
  decline: '#dc3545',
  neutral: '#6c757d'
}

// 調色盤（多系列數據用）
export const palette = [
  '#6096FD',
  '#2cc185',
  '#FF6384',
  '#FFCE56',
  '#36A2EB',
  '#9966FF',
  '#FF9F40',
  '#4BC0C0'
]

// 全局預設配置
export const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: {
        size: 14
      },
      bodyFont: {
        size: 13
      },
      padding: 12,
      cornerRadius: 8,
      displayColors: true
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 11
        }
      }
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        font: {
          size: 11
        }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  },
  animation: {
    duration: 750,
    easing: 'easeInOutQuart'
  }
}

// 折線圖預設配置
export const lineChartDefaults = {
  ...defaultOptions,
  elements: {
    line: {
      tension: 0.3,
      borderWidth: 2
    },
    point: {
      radius: 4,
      hoverRadius: 6,
      borderWidth: 2,
      backgroundColor: '#fff'
    }
  }
}

// 長條圖預設配置
export const barChartDefaults = {
  ...defaultOptions,
  elements: {
    bar: {
      borderRadius: 4,
      borderWidth: 0
    }
  }
}

// 組合圖預設配置
export const comboChartDefaults = {
  ...defaultOptions,
  elements: {
    line: {
      tension: 0.3,
      borderWidth: 2
    },
    point: {
      radius: 4,
      hoverRadius: 6
    },
    bar: {
      borderRadius: 4
    }
  }
}

/**
 * 合併用戶配置與預設配置
 */
export const mergeOptions = (userOptions = {}, defaultOpts = defaultOptions) => {
  return {
    ...defaultOpts,
    ...userOptions,
    plugins: {
      ...defaultOpts.plugins,
      ...userOptions.plugins
    },
    scales: {
      ...defaultOpts.scales,
      ...userOptions.scales
    }
  }
}

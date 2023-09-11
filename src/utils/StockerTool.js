// formatDataForGoogleChart is use to change data format for google chart
export const formatDataForGoogleChart = (data, keyOrder) => {
  const titles = typeof keyOrder[0] === 'object'
    ? keyOrder.map(key => key.title)
    : keyOrder
  const formatData = data.map(e => keyOrder.map(k => parseToFloat(k, e)))
  formatData.unshift(titles)
  return formatData
}

const parseToFloat = (key, data) => {
  if ('transferToFloat' in key && key.transferToFloat) {
    return parseFloat(data[key.title])
  }
  return data[key.title]
}

export const getToken = () =>
  localStorage.getItem('access')

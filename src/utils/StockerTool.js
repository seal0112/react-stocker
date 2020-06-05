
export const formatDataForGoogleChart = (data, keyOrder) => {
    let title = keyOrder
    let formatData = data.map(e=>keyOrder.map(k=>e[k]))
    formatData.unshift(title)
    return formatData
}
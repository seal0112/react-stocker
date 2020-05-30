
export const formatDataForGoogleChart = (data, stateSetter) => {
    let title = Object.keys(data[0])
    let formatData = data.map(d=>Object.values(d))
    formatData.unshift(title)
    return formatData
}
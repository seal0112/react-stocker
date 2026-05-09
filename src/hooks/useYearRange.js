import { useState } from 'react'

const STORAGE_KEY = 'financial_year_range'
const VALID_OPTIONS = [3, 5, 7, 10]
const DEFAULT = 5

const load = () => {
  const saved = parseInt(localStorage.getItem(STORAGE_KEY))
  return VALID_OPTIONS.includes(saved) ? saved : DEFAULT
}

const useYearRange = () => {
  const [yearRange, setYearRangeState] = useState(load)

  const setYearRange = (value) => {
    localStorage.setItem(STORAGE_KEY, value)
    setYearRangeState(value)
  }

  return [yearRange, setYearRange]
}

export default useYearRange

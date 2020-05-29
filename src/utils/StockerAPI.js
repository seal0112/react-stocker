import axios from 'axios';

const api = "http://localhost:5001";
const headers = {
  'Accept': 'application/json'
}

const authRequest = axios.create({
    baseURL: api+"/api/auth",
    headers: headers,
    withCredentials: true,
    mode: 'no-cors'
});

const frontendDataRequest = axios.create({
    baseURL: api+"/api/v0/f",
    headers: headers,
    withCredentials: true,
    mode: 'no-cors'
});

//for user authiciate
export const login = (data) => authRequest.post('/login', data);
export const logout = () => authRequest.get('/logout');
export const checkAuth = () => authRequest.get('/check_auth');

export const getRevenue = (stock_id) => frontendDataRequest.get(`/month_revenue/${stock_id}`)
export const getEps = (stock_id) => frontendDataRequest.get(`/eps/${stock_id}`)
export const getDailyInfo = (stock_id) => frontendDataRequest.get(`/daily_info/${stock_id}`)
export const getIncomeSheet = (stock_id) => frontendDataRequest.get(`/income_sheet/${stock_id}`)
export const getProfitAnalysis = (stock_id) => frontendDataRequest.get(`/profit_analysis/${stock_id}`)
export const getOpExpenseAnalysis = (stock_id) => frontendDataRequest.get(`/op_expense_analysis/${stock_id}`)

import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1'
});

// Add an interceptor to insert the JWT token if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('arcticfresh_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const contentService = {
  async getServices() {
    const { data } = await api.get('/services');
    return data.data;
  },

  async getTestimonials() {
    const { data } = await api.get('/testimonials');
    return data.data;
  }
};

export const sparePartsService = {
  async getSpareParts(category) {
    const { data } = await api.get('/spare-parts', { params: { category } });
    return data.data;
  }
};

export const technicianService = {
  async getTechnicians(status) {
    const { data } = await api.get('/technicians', { params: { status } });
    return data.data;
  }
};

export const bookingService = {
  async estimatePrice(serviceId, partIds = []) {
    const { data } = await api.post('/bookings/estimate', { serviceId, partIds });
    return data.data;
  },

  async createBooking(bookingData) {
    const { data } = await api.post('/bookings', bookingData);
    return data.data;
  },

  async bookService(formData) {
    const { data } = await api.post('/bookings/book-service', formData);
    return data;
  },

  async getUserBookings(userId) {
    const { data } = await api.get(`/bookings/user/${userId}`);
    return data.data;
  },
  
  async getBookingStatus(bookingId) {
    const { data } = await api.get(`/bookings/${bookingId}/status`);
    return data.data;
  }
};

export const contactService = {
  async submitMessage(messageData) {
    const { data } = await api.post('/contact', messageData);
    return data.success;
  }
};

export const pricingService = {
  async getPlans(type) {
    const { data } = await api.get('/pricing/plans', { params: type ? { type } : {} });
    return data.data;
  },

  async getPricingDetails() {
    const { data } = await api.get('/pricing');
    return data.data;
  }
};

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  async register(email, password, fullName) {
    const { data } = await api.post('/auth/register', { email, password, fullName });
    return data;
  },

  async sendOtp(phone) {
    const { data } = await api.post('/auth/send-otp', { phone });
    return data;
  },

  async verifyOtp(phone, otp_code) {
    const { data } = await api.post('/auth/verify-otp', { phone, otp_code });
    return data;
  },

  async logout() {
    const { data } = await api.post('/auth/logout');
    return data;
  }
};

export const adminService = {
  async getDashboard() {
    const { data } = await api.get('/admin/dashboard');
    return data.data;
  },

  async getAllUsers() {
    const { data } = await api.get('/admin/users');
    return data.data;
  },

  async getSiteStats() {
    const { data } = await api.get('/admin/site-stats');
    return data.data;
  }
};

export const dashboardService = {
  getStats: async () => {
    const { data } = await api.get('/dashboard/stats');
    return data.data;
  },
  getUserOverview: async (userId) => {
    const { data } = await api.get(`/dashboard/user-overview/${userId}`);
    return data.data;
  }
};

export default api;

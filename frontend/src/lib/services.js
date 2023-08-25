import jwtDecode from 'jwt-decode';

export const auth = {
    isAuthenticated() {
      return this.getUserInfo();
    },
    storeToken(token) {
      this.clear();
      localStorage.setItem('token', token);
    },
    getToken() {
      return localStorage.getItem('token');
    },
    getExpiration() {
      const token = this.getToken();
      if (token) {
        const decodedData = this.decode(token);
        return decodedData.exp;
      }
      return 0;
    },
    getRole() {
      const token = this.getToken();
      if (token) {
        const decodedData = this.decode(token);
        return decodedData.role;
      }
      return null;
    },
    getUserInfo(){
      const token = this.getToken();
      if (token) {
        const decodedData = jwtDecode(token); 
        return decodedData;
      }
      return null;
    },

    decode(token) {
      let base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    },
    
    getData() {
      return this.decode();
    },
    clear() {
      localStorage.removeItem('token')
      window.location.reload();
    },
  };
  
  
import axios from 'axios';
import { useEffect, useState } from 'react';

function useIPAddress() {
  const [ipResponse, setIpResponse] = useState('');
  useEffect(() => {
    axios
      .get('https://api.ipify.org/?format=json')
      .then((res) => {
        axios
          .get(`https://ipapi.co/${res.data.ip}/json/`)
          .then((res) => {
            const { data } = res;
            setIpResponse(data);
          })
          .catch((err) => {
            console.log('Error while geting Info:', err);
          });
      })
      .catch((err) => {
        console.log('Error while geting IP:', err);
      });
  }, []);

  return { ipResponse };
}

export default useIPAddress;

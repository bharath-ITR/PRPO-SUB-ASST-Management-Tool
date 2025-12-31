import axios from "axios";
const Approve = () => {
  const handleApprove = async () => {
    try {
  
      const searchParams = new URLSearchParams(window.location.search);
    
      const token = searchParams.get('token');
      
      if (token) {
        console.log('Token:', token);
      }
      const response = await axios.post(`${process.env.REACT_APP_API}/action`, {
        action: 'approved',
        token, 
      });

      console.log('Approval request sent:', response.data);
    } catch (error) {
      console.error('Error sending approval request:', error);
    }
  };

  const handleReject = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
    
      const token = searchParams.get('token');
      
      if (token) {
        console.log('Token:', token);
      }

      const response = await axios.post(`${process.env.REACT_APP_API}/action`, {
        action: 'rejected',
        token, 
      });

      console.log('Rejection request sent:', response.data);
    } catch (error) {
      console.error('Error sending rejection request:', error);
    }
  };

  return (
    <div style={{marginTop:800,marginLeft:200}}>
      <button onClick={handleApprove}>Approve</button>
      <button onClick={handleReject}>Reject</button>
    </div>
  );
};

export default Approve;

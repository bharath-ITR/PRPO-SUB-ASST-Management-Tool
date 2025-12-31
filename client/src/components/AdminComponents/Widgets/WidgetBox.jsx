
// import React, { useEffect, useState } from "react";
// import Widgets from './Widgets';
// import { getRequests } from '../../../redux/Action';
// import { useDispatch, useSelector } from 'react-redux';

// const WidgetBox = () => {
//   const dispatch = useDispatch();
//   const { Requests } = useSelector((state) => state.getRequests);
//   const [counts, setCounts] = useState({ USD: 0, INR: 0, AED: 0 }); // Initialize counts per currency for processing
//   const [currencyTotals, setCurrencyTotals] = useState({ USD: 0, INR: 0, AED: 0 }); // Initialize currency totals

//   useEffect(() => {
//     dispatch(getRequests());
//   }, [dispatch]);

//   useEffect(() => {
//     const countsData = { USD: 0, INR: 0, AED: 0 }; // Track counts for processing status with specific currencies
//     const currencyTotalsData = { USD: 0, INR: 0, AED: 0 };

//     Requests?.forEach((request) => {
//       const status = request.status;
//       const amountString = request.body?.approxCost || 'USD 0';
//       const [currency, rawAmount] = amountString.split(' ');
//       const amount = parseFloat(rawAmount) || 0;

//       // Check if the request is in 'processing' status
//       if (status === 'processing') {
//         // Increment counts and totals for the corresponding currency
//         switch (currency) {
//           case 'USD':
//             countsData.USD++;
//             currencyTotalsData.USD += amount;
//             break;
//           case 'INR':
//             countsData.INR++;
//             currencyTotalsData.INR += amount;
//             break;
//           case 'AED':
//             countsData.AED++;
//             currencyTotalsData.AED += amount;
//             break;
//           default:
//             break;
//         }
//       }
//     });

//     setCounts(countsData); // Update counts with processing status per currency
//     setCurrencyTotals(currencyTotalsData); // Update totals with amounts per currency
//   }, [Requests]);

//  const totalCount = Requests?.length || 0;
//   return (
//     <div style={{ display: 'flex', flexDirection: 'column' }}>
//            {/* <h2 style={{ marginLeft: 30, lineHeight: 0, marginTop: 30 }}>Total Requests <span>{totalCount}</span> </h2> */}
//       <div style={{ display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'flex-start', padding: '0 20px' }}>
//         {/* USD Widget */}
//         <Widgets 
//           key="USD" 
//           title="Level-3-Pending Approval (USD)" 
//           number={counts.USD || 0} 
//           amount={currencyTotals.USD || 0} 
//           currency="USD" 
//           className="total-usd" 
//           icon="AttachMoneyIcon" 
//         />
//         {/* INR Widget */}
//         <Widgets 
//           key="INR" 
//           title="Level-3-Pending Approval (INR)" 
//           number={counts.INR || 0} 
//           amount={currencyTotals.INR || 0} 
//           currency="INR" 
//           className="total-inr" 
//           icon="CurrencyRupeeIcon" 
//         />
//         {/* AED Widget */}
//         <Widgets 
//           key="AED" 
//           title="Level-3-Pending Approval (AED)" 
//           number={counts.AED || 0} 
//           amount={currencyTotals.AED || 0} 
//           currency="AED" 
//           className="total-aed" 
//           icon="MonetizationOnIcon" 
//         />
//       </div>
//     </div>
//   );
// };

// export default WidgetBox;
import React from "react";
import Widgets from "./Widgets";

const WidgetBox = ({ processingCurrency }) => {
  // Initialize counts and totals for all supported currencies
  const counts = { USD: 0, INR: 0, AED: 0 };
  const currencyTotals = { USD: 0, INR: 0, AED: 0 };

  // Fill from API response
  processingCurrency?.forEach((item) => {
    const currency = item._id?.currency;
    if (currency) {
      counts[currency] = item.count;
      currencyTotals[currency] = item.totalAmount;
    }
  });

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "0 20px",
        }}
      >
        {/* USD Widget */}
        <Widgets
          key="USD"
          title="Level-3-Pending Approval (USD)"
          number={counts.USD}
          amount={currencyTotals.USD}
          currency="USD"
          className="total-usd"
          icon="AttachMoneyIcon"
        />

        {/* INR Widget */}
        <Widgets
          key="INR"
          title="Level-3-Pending Approval (INR)"
          number={counts.INR}
          amount={currencyTotals.INR}
          currency="INR"
          className="total-inr"
          icon="CurrencyRupeeIcon"
        />

        {/* AED Widget */}
        <Widgets
          key="AED"
          title="Level-3-Pending Approval (AED)"
          number={counts.AED}
          amount={currencyTotals.AED}
          currency="AED"
          className="total-aed"
          icon="MonetizationOnIcon"
        />
      </div>
    </div>
  );
};

export default WidgetBox;

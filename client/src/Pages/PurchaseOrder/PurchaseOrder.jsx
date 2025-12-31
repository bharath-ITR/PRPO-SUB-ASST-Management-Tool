// import React, { useEffect, useState } from 'react';
// import './PurchaseOrder.css';
// import { Table, TableHead, TableRow, TableCell, TableBody, IconButton, Collapse, Button } from '@mui/material';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import { useDispatch, useSelector } from 'react-redux';
// import { getRequests } from '../../redux/Action';
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// const PurchaseOrder = () => {
//   const apiUrl = process.env.REACT_APP_API;

//   const dispatch = useDispatch();
//   const [expandedRows, setExpandedRows] = useState({});
//   const [requestsToDisplay, setRequestsToDisplay] = useState(6);
//   const { Requests = [] } = useSelector((state) => state.getRequests);

//   // Filter requests by status 'Ready For Purchase'
//   const filteredRequests = Requests.filter(request => request.status === 'Ready For Purchase');
//   const sortedRequests = filteredRequests.slice(); // Sorting the requests

//   const tableMainRow = {
//     fontSize: '14px', fontWeight: '600',
//     width: 'auto',
//     border: '1px solid #dedada',
//     color: 'rgb(8 37 103)',
//     height: '10px',
//     background: 'rgb(216, 226, 236)'
//   }

//   const getStatusClassName = (status) => {
//     if (status === "pending for approval") {
//       return "pending for approval";
//     } else if (status === "in process") {
//       return "in process";
//     } else if (status === "processing") {
//       return "processing";
//     } else if (status === "approved") {
//       return "approved";
//     } else if (status === "rejected") {
//       return "rejected";
//     } else if (status === "Ready For Purchase") {
//       return "Ready For Purchase";
//     } else if (status === "completed") {
//       return "completed";
//     } else {
//       return "";
//     }
//   };

//   useEffect(() => {
//     dispatch(getRequests());
//   }, [dispatch]);

//   const toggleRow = (index) => {
//     setExpandedRows((prevState) => ({
//       ...prevState,
//       [index]: !prevState[index],
//     }));
//   };

//   const handleViewMore = () => {
//     setRequestsToDisplay((prevCount) => prevCount + 5);
//   };

//  const handleViewAttachment = async (file) => {
//   try {
//     const response = await axios.post(`${apiUrl}/attachment/${file.filename}`);

//     if (response.status !== 200) {
//       throw new Error("Failed to get SAS URL");
//     }

//     const { sasUrl } = response.data;

//     // ✅ Open in a new tab
//     window.open(sasUrl, '_blank');
//   } catch (err) {
//     console.error("Error opening attachment:", err);
//     alert("Failed to open file. Please try again.");
//   }
// };

//   return (
//     <div className="table-wrapper-PR">

//       <Table className="PR-table">
//         <TableHead>
//           <TableRow>

//             <TableCell style={tableMainRow} >S/N</TableCell>
//             <TableCell style={tableMainRow} >PR/N</TableCell>
//             <TableCell style={tableMainRow} >Requestor</TableCell>
//             <TableCell style={tableMainRow} >Created Date</TableCell>
//             <TableCell style={tableMainRow} >Products</TableCell>
//             <TableCell style={tableMainRow} >Status</TableCell>
//             <TableCell style={tableMainRow} >Action</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {sortedRequests.slice(0, requestsToDisplay).map((request, index) => (
//             <React.Fragment key={index}>
//               <TableRow className={`${expandedRows[index] ? 'expanded' : ''}`}>
//                 <TableCell style={{ border: '1px solid #dedada' }}>
//                   {index + 1}
//                   <IconButton size="small" onClick={() => toggleRow(index)}>
//                     {expandedRows[index] ? <KeyboardArrowDownIcon /> : <ChevronRightIcon />}
//                   </IconButton>
//                 </TableCell>
//                 <TableCell style={{ border: '1px solid #dedada' }}>{request.PR_no}</TableCell>
//                 <TableCell style={{ border: '1px solid #dedada' }}>{request.body?.sender_name}</TableCell>
//                 <TableCell style={{ border: '1px solid #dedada' }}>{request.body?.currentDate}</TableCell>
//                 <TableCell style={{ border: '1px solid #dedada',whiteSpace: 'nowrap',overflow: 'hidden',textOverflow:'ellipsis',maxWidth: '100px' }} title={request?.body?.productName} >{request.body?.productName}</TableCell>
//                 <TableCell style={{ border: '1px solid #dedada' }}>
//                   <p className={request.status}>
//                     {request.status}
//                   </p>
//                 </TableCell>
//                 <TableCell
//                   style={{ border: '1px solid #dedada' }}>
//                   {request.status === 'Ready For Purchase' ? (
//                     request.isPOcreated ? (
//                       <span>Done</span>
//                     ) : (
//                       <Link
//                         to={`/purchase-order-creation/${request.PR_no}`}
//                         variant="contained"
//                         color="primary"
//                         style={{ marginLeft: '10px' }}
//                       >
//                         PO
//                       </Link>
//                     )
//                   ) : "-"}
//                 </TableCell>
//               </TableRow>
//               <TableRow>
//                 <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
//                   <Collapse in={expandedRows[index]} timeout="auto" unmountOnExit>
//                     <div className='details_container'>
//                       <div className="data_wrapper">
//                         <Table style={{ width: '100%' }}>
//                           <TableHead>
//                             <TableRow style={{ height: '10px', }}>
//                               <TableCell style={{ border: '1px solid #dedada', fontSize: '12px', fontWeight: '600', width: '10px',background: 'rgb(216, 226, 236)',color: 'rgb(8 37 103)',}}>S.No</TableCell>
//                               <TableCell style={{ border: '1px solid #dedada', fontSize: '14px', fontWeight: '600', width: '120px',background: 'rgb(216, 226, 236)' ,color: 'rgb(8 37 103)',}} >Approvers</TableCell>
//                               <TableCell style={{ background: 'rgb(216, 226, 236)',border: '1px solid #dedada', fontSize: '14px', fontWeight: '600',color: 'rgb(8 37 103)', }}>Comment</TableCell>
//                               <TableCell style={{background: 'rgb(216, 226, 236)', border: '1px solid #dedada', fontSize: '14px', fontWeight: '600', width: '100px' ,color: 'rgb(8 37 103)',}} >Responses</TableCell>
//                             </TableRow>
//                           </TableHead>
//                           <TableBody>
//                             {request.reportingToAndSupervisor.map((report, reportIndex) => (
//                               <TableRow key={reportIndex} style={{ padding: '-10px 0 -10px 0' }}>
//                                 <TableCell style={{ border: "1px solid #dedada", }}>{reportIndex + 1}</TableCell>
//                                 <TableCell style={{ border: "1px solid #dedada", }}>{report.sendTo}</TableCell>
//                                 <TableCell style={{ border: "1px solid #dedada", }}>{report.Comment}</TableCell>
//                                 <TableCell style={{ border: "1px solid #dedada", }}>
//                                 <p
//                                             variant='p' style={{
//                                               paddingLeft: '15px',
//                                               width: '70%',
//                                               fontSize: 12,
//                                               fontWeight: 500,
//                                               height: 33,
//                                               color: 'whitesmoke',
//                                               borderRadius: '20px',
//                                               display: 'flex',
//                                               alignItems: 'center',
//                                               justifyContent: 'center',
//                                               textAlign: 'center',
//                                             }}
//                                             className={getStatusClassName(
//                                               report.response
//                                             )}
//                                           >
//                                             {report.response}
//                                           </p>
//                                     </TableCell>
//                               </TableRow>
//                             ))}
//                           </TableBody>
//                         </Table>
//                         <div className='attachments-container-parent'>
//                           <div className="attachments-container">
//                           {request.body?.attachment?.map((file, fileIndex) => {
//                               // Truncate the file name
//                               const maxLength = 10; // Define how many characters before truncation
//                               const extension = file.originalname.split('.').pop(); // Extract the file extension
//                               const nameWithoutExtension = file.originalname.slice(0, file.originalname.lastIndexOf('.')); // Get the name without extension

//                               // Apply truncation logic
//                               const truncatedFileName = nameWithoutExtension.length > maxLength
//                                 ? `${nameWithoutExtension.slice(0, maxLength)}...${extension}`
//                                 : file.originalname; // If the name is short enough, don't truncate

//                               return (
//                                 <button
//                                   key={fileIndex}
//                                   onClick={() => handleViewAttachment(file)}
//                                   variant="contained"
//                                 >
//                                   View {truncatedFileName}
//                                 </button>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       </div>
//                       <div className="data_wrapper_items">
//                         <div className='left_items'>
//                           <div className="left_items_wrapper">
//                             <p>Delivery Date:</p>
//                             <span>{request.body?.expectedDate}</span>

//                           </div>
//                           <div className="left_items_wrapper">
//                                   <p>User comment:</p>
//                                   <textarea
//                                     className="flexible_text"
//                                     value={request.body?.comment || ""}
//                                     readOnly
//                                     onMouseDown={(e) => e.stopPropagation()}
//                                   />
//                                 </div>

//                                 <div className="left_items_wrapper">
//                                   <p>Product Description:</p>
//                                   <textarea
//                                     className="flexible_text"
//                                     value={request.body?.productDescription || ""}
//                                     readOnly
//                                     onMouseDown={(e) => e.stopPropagation()}
//                                   />
//                                 </div>
//                                 <div className="left_items_wrapper">
//                                   <p>Reason for Product:</p>
//                                   <textarea
//                                     className="flexible_text"
//                                     value={request.body?.productReason || ""}
//                                     readOnly
//                                     onMouseDown={(e) => e.stopPropagation()}
//                                   />
//                                 </div>
//                         </div>
//                         <div className="right_items">
//                           <div className="right_items_wrapper">
//                             <p>Quantity:</p>
//                             <span>{request.body?.quantity}</span>
//                           </div>
//                           <div className="right_items_wrapper">
//                             <p>Unit price:</p>
//                             <span>{request.body?.unitPrice}</span>
//                           </div>
//                           <div className="right_items_wrapper">
//                             <p>Cost:</p>
//                             <span>{request.body?.approxCost}</span>
//                           </div>
//                           <div className="right_items_wrapper">
//                             <p>Purchase Type:</p>
//                             <span>{request.body?.purchaseType}</span>
//                           </div>
//                           <div className="right_items_wrapper">
//                             <p>Payment Type:</p>
//                             <span>{request.body?.paymentType}</span>
//                           </div>
//                         </div>
//                       </div>

//                     </div>
//                   </Collapse>
//                 </TableCell>
//               </TableRow>
//             </React.Fragment>
//           ))}
//           {filteredRequests.length > requestsToDisplay && (
//             <TableRow>
//               <TableCell colSpan={8} style={{ textAlign: 'center' }}>
//                 <Button onClick={handleViewMore}>View more</Button>
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// export default PurchaseOrder;

import React, { useEffect, useState } from "react";
import "./PurchaseOrder.css";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Collapse,
  Button,
  TablePagination,
  TextField,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useDispatch, useSelector } from "react-redux";
import { getRequests } from "../../redux/Action";
import { Link } from "react-router-dom";
import axios from "axios";

const PurchaseOrder = () => {
  const apiUrl = process.env.REACT_APP_API;

  const dispatch = useDispatch();
  const [expandedRows, setExpandedRows] = useState({});
  const [requestsToDisplay, setRequestsToDisplay] = useState(6);
  const { Requests = {} } = useSelector((state) => state.getRequests);

  const [page, setPage] = useState(0); // TablePagination zero-based
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState("");

  const tableMainRow = {
    fontSize: "14px",
    fontWeight: "600",
    width: "auto",
    border: "1px solid #dedada",
    color: "rgb(8 37 103)",
    height: "10px",
    background: "rgb(216, 226, 236)",
  };

  const getStatusClassName = (status) => {
    if (status === "pending for approval") return "pending for approval";
    if (status === "in process") return "in process";
    if (status === "processing") return "processing";
    if (status === "approved") return "approved";
    if (status === "rejected") return "rejected";
    if (status === "Ready For Purchase") return "Ready For Purchase";
    if (status === "completed") return "completed";
    return "";
  };

  // Fetch requests whenever page, rowsPerPage, or search changes
  useEffect(() => {
    dispatch(getRequests(page + 1, rowsPerPage, search));
  }, [dispatch, page, rowsPerPage, search]);

  // Update totalCount from backend response
  useEffect(() => {
    if (Requests?.totalRecords !== undefined) {
      setTotalCount(Requests.totalRecords);
    }
  }, [Requests]);

  const toggleRow = (index) => {
    setExpandedRows((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleViewMore = () => {
    setRequestsToDisplay((prevCount) => prevCount + 5);
  };

  const handleViewAttachment = async (file) => {
    try {
      const response = await axios.post(
        `${apiUrl}/attachment/${file.filename}`
      );
      if (response.status !== 200) throw new Error("Failed to get SAS URL");
      const { sasUrl } = response.data;
      window.open(sasUrl, "_blank");
    } catch (err) {
      console.error("Error opening attachment:", err);
      alert("Failed to open file. Please try again.");
    }
  };

  return (
    <div className="table-wrapper-PR">
      {/* Search Bar */}
      <div style={{ marginBottom: "10px" }}>
        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0); // reset to first page on search
          }}
        />
      </div>

      <Table className="PR-table">
        <TableHead>
          <TableRow>
            <TableCell style={tableMainRow}>S/N</TableCell>
            <TableCell style={tableMainRow}>PR/N</TableCell>
            <TableCell style={tableMainRow}>Requestor</TableCell>
            <TableCell style={tableMainRow}>Created Date</TableCell>
            <TableCell style={tableMainRow}>Products</TableCell>
            <TableCell style={tableMainRow}>Status</TableCell>
            <TableCell style={tableMainRow}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Requests?.data?.map((request, index) => (
            <React.Fragment key={index}>
              <TableRow className={`${expandedRows[index] ? "expanded" : ""}`}>
                <TableCell style={{ border: "1px solid #dedada" }}>
                  {index + 1 + page * rowsPerPage}
                  <IconButton size="small" onClick={() => toggleRow(index)}>
                    {expandedRows[index] ? (
                      <KeyboardArrowDownIcon />
                    ) : (
                      <ChevronRightIcon />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell style={{ border: "1px solid #dedada" }}>
                  {request.PR_no}
                </TableCell>
                <TableCell style={{ border: "1px solid #dedada" }}>
                  {request.body?.sender_name}
                </TableCell>
                <TableCell style={{ border: "1px solid #dedada" }}>
                  {request.body?.currentDate}
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #dedada",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100px",
                  }}
                  title={request?.body?.productName}
                >
                  {request.body?.productName}
                </TableCell>
                <TableCell style={{ border: "1px solid #dedada" }}>
                  <p className={getStatusClassName(request.status)}>
                    {request.status === "Ready For Purchase" &&
                    request.isPOcreated
                      ? "PO Raised"
                      : request.status}
                  </p>
                </TableCell>

                <TableCell style={{ border: "1px solid #dedada" }}>
                  {request.status === "Ready For Purchase" ? (
                    request.isPOcreated ? (
                      <span>Done</span>
                    ) : (
                      <Link
                        to={`/purchase-order-creation/${request.PR_no}`}
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: "10px" }}
                      >
                        PO
                      </Link>
                    )
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  style={{ paddingBottom: 0, paddingTop: 0 }}
                  colSpan={8}
                >
                  <Collapse
                    in={expandedRows[index]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <div className="details_container">
                      <div className="data_wrapper">
                        <Table style={{ width: "100%" }}>
                          <TableHead>
                            <TableRow style={{ height: "10px" }}>
                              <TableCell
                                style={{
                                  border: "1px solid #dedada",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  width: "10px",
                                  background: "rgb(216, 226, 236)",
                                  color: "rgb(8 37 103)",
                                }}
                              >
                                S.No
                              </TableCell>
                              <TableCell
                                style={{
                                  border: "1px solid #dedada",
                                  fontSize: "14px",
                                  fontWeight: "600",
                                  width: "120px",
                                  background: "rgb(216, 226, 236)",
                                  color: "rgb(8 37 103)",
                                }}
                              >
                                Approvers
                              </TableCell>
                              <TableCell
                                style={{
                                  background: "rgb(216, 226, 236)",
                                  border: "1px solid #dedada",
                                  fontSize: "14px",
                                  fontWeight: "600",
                                  color: "rgb(8 37 103)",
                                }}
                              >
                                Comment
                              </TableCell>
                              <TableCell
                                style={{
                                  background: "rgb(216, 226, 236)",
                                  border: "1px solid #dedada",
                                  fontSize: "14px",
                                  fontWeight: "600",
                                  width: "100px",
                                  color: "rgb(8 37 103)",
                                }}
                              >
                                Responses
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {request.reportingToAndSupervisor?.map(
                              (report, reportIndex) => (
                                <TableRow key={reportIndex}>
                                  <TableCell
                                    style={{ border: "1px solid #dedada" }}
                                  >
                                    {reportIndex + 1}
                                  </TableCell>
                                  <TableCell
                                    style={{ border: "1px solid #dedada" }}
                                  >
                                    {report.sendTo}
                                  </TableCell>
                                  <TableCell
                                    style={{ border: "1px solid #dedada" }}
                                  >
                                    {report.Comment}
                                  </TableCell>
                                  <TableCell
                                    style={{ border: "1px solid #dedada" }}
                                  >
                                    <p
                                      style={{
                                        paddingLeft: "15px",
                                        width: "70%",
                                        fontSize: 12,
                                        fontWeight: 500,
                                        height: 33,
                                        color: "whitesmoke",
                                        borderRadius: "20px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        textAlign: "center",
                                      }}
                                      className={getStatusClassName(
                                        report.response
                                      )}
                                    >
                                      {report.response}
                                    </p>
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                        <div className="attachments-container-parent">
                          <div className="attachments-container">
                            {request.body?.attachment?.map(
                              (file, fileIndex) => {
                                const maxLength = 10;
                                const extension = file.originalname
                                  .split(".")
                                  .pop();
                                const nameWithoutExtension = file.originalname.slice(
                                  0,
                                  file.originalname.lastIndexOf(".")
                                );
                                const truncatedFileName =
                                  nameWithoutExtension.length > maxLength
                                    ? `${nameWithoutExtension.slice(
                                        0,
                                        maxLength
                                      )}...${extension}`
                                    : file.originalname;
                                return (
                                  <button
                                    key={fileIndex}
                                    onClick={() => handleViewAttachment(file)}
                                    variant="contained"
                                  >
                                    View {truncatedFileName}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="data_wrapper_items">
                        <div className="left_items">
                          <div className="left_items_wrapper">
                            <p>Delivery Date:</p>
                            <span>{request.body?.expectedDate}</span>
                          </div>
                          <div className="left_items_wrapper">
                            <p>User comment:</p>
                            <textarea
                              className="flexible_text"
                              value={request.body?.comment || ""}
                              readOnly
                              onMouseDown={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="left_items_wrapper">
                            <p>Product Description:</p>
                            <textarea
                              className="flexible_text"
                              value={request.body?.productDescription || ""}
                              readOnly
                              onMouseDown={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="left_items_wrapper">
                            <p>Reason for Product:</p>
                            <textarea
                              className="flexible_text"
                              value={request.body?.productReason || ""}
                              readOnly
                              onMouseDown={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        <div className="right_items">
                          <div className="right_items_wrapper">
                            <p>Quantity:</p>
                            <span>{request.body?.quantity}</span>
                          </div>
                          <div className="right_items_wrapper">
                            <p>Unit price:</p>
                            <span>{request.body?.unitPrice}</span>
                          </div>
                          <div className="right_items_wrapper">
                            <p>Cost:</p>
                            <span>{request.body?.approxCost}</span>
                          </div>
                          <div className="right_items_wrapper">
                            <p>Purchase Type:</p>
                            <span>{request.body?.purchaseType}</span>
                          </div>
                          <div className="right_items_wrapper">
                            <p>Payment Type:</p>
                            <span>{request.body?.paymentType}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
          {Requests?.data?.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} style={{ textAlign: "center" }}>
                No records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 20, 40]}
      />
    </div>
  );
};

export default PurchaseOrder;

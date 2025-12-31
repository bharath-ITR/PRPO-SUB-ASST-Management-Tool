import React from "react";
import { useNavigate } from "react-router-dom";
import AddCardIcon from "@mui/icons-material/AddCard";

const Main = ({ setHeading }) => {
  const navigate = useNavigate();

  const handleNavigation = (path, heading) => {
    setHeading(heading);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-50 to-gray-200 flex items-center justify-center px-4 py-8">
      <div className="max-w-5xl w-full bg-white shadow-lg rounded-2xl p-8 md:p-10 mt-5">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div
            onClick={() =>
              handleNavigation("/purchase-requisition", "Purchase Requisition")
            }
            className="cursor-pointer group flex flex-col items-center justify-center border border-gray-300 rounded-2xl p-6 bg-gradient-to-tr from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 w-full md:w-1/3 shadow-md hover:shadow-lg"
          >
            <div className="bg-blue-600 text-white rounded-full p-4 mb-3 group-hover:scale-110 transition-transform">
              <AddCardIcon fontSize="large" />
            </div>
            <div className="text-lg font-semibold text-gray-800">
              Purchase Requisition
            </div>
          </div>

          <div className="hidden md:block border-l border-gray-300 h-24 mx-8"></div>

          <div className="text-center md:text-left mt-8 md:mt-0 md:w-2/3">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome to Purchase Requisition
            </h1>
            <p className="text-gray-600 text-sm">
              Streamline your procurement process by submitting requests with
              ease and transparency.
            </p>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Instructions
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700 text-sm leading-relaxed">
            <li>
              Click on the{" "}
              <span className="font-semibold text-blue-600">
                “Purchase Requisition”
              </span>{" "}
              button.
            </li>
            <li>
              Select the type of requisition you want to create (e.g., office
              supplies, equipment, services).
            </li>
            <li>
              Enter Requisition Details:
              <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
                <li>
                  Fill in required fields such as item description, quantity,
                  price, and vendor info.
                </li>
                <li>
                  Provide justification or purpose for the purchase if required.
                </li>
              </ul>
            </li>
            <li>
              Attach Supporting Documents (if applicable):
              <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
                <li>
                  Upload necessary documents like quotes, specs, or approvals to
                  support your requisition.
                </li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Main;

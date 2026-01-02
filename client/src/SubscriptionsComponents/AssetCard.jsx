import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiPackage, 
  FiCalendar, 
  FiShield, 
  FiEdit3, 
  FiTrash2,
  FiArrowRight,
  FiUser
} from "react-icons/fi";
import { getWarrantyStatus } from "../SubscriptionsUtils/warrantyStatus";
import { formatDate } from "../SubscriptionsUtils/dateFormatter";

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      delay: 0.1,
      duration: 0.3
    }
  }
};

export default function AssetCard({ asset, onEdit, onDelete }) {
  const navigate = useNavigate();
  const warranty = getWarrantyStatus(asset.warrantyEnd);

  const badgeColors = {
    red: "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200",
    orange: "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-orange-200",
    yellow: "bg-gradient-to-r from-yellow-50 to-yellow-100 text-amber-700 border-yellow-200",
    green: "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200",
    gray: "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border-gray-200"
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={() => navigate(`/assets/${asset._id}`)}
      className="group relative rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 border-2 border-gray-200 cursor-pointer overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
    >
      {/* Animated background gradient on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-50/0 via-purple-50/0 to-pink-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        initial={false}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div 
          variants={contentVariants}
          className="mb-5"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
                {asset.name}
              </h3>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiPackage className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{asset.type || "No type"}</span>
              </div>
            </div>

            <motion.span
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1 rounded-full text-xs font-semibold border-2 flex-shrink-0 ${
                badgeColors[warranty.color] || badgeColors.gray
              }`}
            >
              {warranty.label}
              {warranty.daysLeft !== undefined && ` · ${warranty.daysLeft}d`}
            </motion.span>
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div 
          variants={contentVariants}
          className="grid grid-cols-2 gap-3 mb-5"
        >
          <motion.div
            whileHover={{ scale: 1.05, x: 4 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-1">
              <FiUser className="text-purple-500 text-sm" />
              <p className="text-xs text-gray-500 font-medium">Assigned To</p>
            </div>
            <p className="text-sm font-bold text-gray-900">
              {asset.assignedTo || "Unassigned"}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, x: 4 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-1">
              <FiCalendar className="text-orange-500 text-sm" />
              <p className="text-xs text-gray-500 font-medium">Warranty End</p>
            </div>
            <p className="text-xs font-bold text-gray-900 line-clamp-1">
              {formatDate(asset.warrantyEnd)}
            </p>
          </motion.div>
        </motion.div>

        {/* Warranty Status Display */}
        <motion.div
          variants={contentVariants}
          className="mb-5"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200">
            <div className="flex items-center gap-2">
              <FiShield className="text-blue-600" />
              <div>
                <p className="text-xs text-blue-700 font-medium">Warranty Status</p>
                <p className="text-sm font-bold text-blue-900">
                  {warranty.label}
                  {warranty.daysLeft !== undefined && ` (${warranty.daysLeft} days left)`}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div 
          variants={contentVariants}
          className="flex items-center justify-between pt-4 border-t border-gray-200"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(asset);
            }}
            className="group/btn flex items-center gap-2 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 border-2 border-blue-200 hover:border-blue-300 hover:shadow-md"
          >
            <FiEdit3 className="transition-transform duration-200 group-hover/btn:rotate-12" />
            Edit
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(asset._id);
            }}
            className="group/btn flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 border-2 border-red-200 hover:border-red-300 hover:shadow-md"
          >
            <FiTrash2 className="transition-transform duration-200 group-hover/btn:scale-110" />
            Delete
          </motion.button>

          <motion.div
            whileHover={{ x: 4 }}
            className="flex items-center gap-1 text-gray-400 group-hover:text-purple-600 transition-colors"
          >
            <span className="text-xs font-medium">View</span>
            <FiArrowRight className="text-sm transition-transform duration-200 group-hover:translate-x-1" />
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}


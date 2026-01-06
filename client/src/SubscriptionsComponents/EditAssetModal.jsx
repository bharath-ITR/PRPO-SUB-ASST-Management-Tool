import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiX, 
  FiPackage, 
  FiTag, 
  FiUser, 
  FiCalendar,
  FiSave
} from "react-icons/fi";
import { validateAsset } from "../SubscriptionsUtils/validation";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: 20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

const fieldVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3
    }
  })
};

const errorVariants = {
  hidden: { opacity: 0, y: -5, height: 0 },
  visible: { 
    opacity: 1, 
    y: 0,
    height: "auto",
    transition: {
      duration: 0.2
    }
  },
  exit: {
    opacity: 0,
    y: -5,
    height: 0,
    transition: {
      duration: 0.15
    }
  }
};

export default function EditAssetModal({
  asset,
  onChange,
  onSubmit,
  onClose
}) {
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const validation = validateAsset(asset);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    onSubmit();
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 w-full max-w-[420px] max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gray-100 relative"
        >
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-2xl -z-0"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                  <FiPackage className="text-base" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
          Edit Asset
        </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <FiX className="text-xl" />
              </motion.button>
            </div>

        <div className="space-y-3">
              <motion.div
                variants={fieldVariants}
                custom={0}
                initial="hidden"
                animate="visible"
              >
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                  <FiPackage className="text-purple-500 text-sm" />
              Asset Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={asset.name}
              onChange={(e) => {
                onChange(e);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              placeholder="Enter asset name"
                  className={`w-full border-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.name 
                      ? "border-red-500 bg-red-50" 
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
            />
                <AnimatePresence>
            {errors.name && (
                    <motion.p
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="text-xs text-red-600 mt-1 font-medium"
                    >
                      {errors.name}
                    </motion.p>
            )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                variants={fieldVariants}
                custom={1}
                initial="hidden"
                animate="visible"
              >
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                  <FiTag className="text-blue-500 text-sm" />
              Asset Type <span className="text-red-500">*</span>
            </label>
            <input
              name="type"
              value={asset.type}
              onChange={(e) => {
                onChange(e);
                if (errors.type) setErrors({ ...errors, type: "" });
              }}
              placeholder="Enter asset type"
                  className={`w-full border-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.type 
                      ? "border-red-500 bg-red-50" 
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
            />
                <AnimatePresence>
            {errors.type && (
                    <motion.p
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="text-xs text-red-600 mt-1 font-medium"
                    >
                      {errors.type}
                    </motion.p>
            )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                variants={fieldVariants}
                custom={2}
                initial="hidden"
                animate="visible"
              >
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                  <FiUser className="text-emerald-500 text-sm" />
              Assigned To
            </label>
            <input
              name="assignedTo"
              value={asset.assignedTo || ""}
              onChange={onChange}
              placeholder="Enter assignee name"
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
            />
              </motion.div>

              <motion.div
                variants={fieldVariants}
                custom={3}
                initial="hidden"
                animate="visible"
              >
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                  <FiCalendar className="text-orange-500 text-sm" />
              Warranty End Date
            </label>
            <input
              name="warrantyEnd"
              type="date"
              value={asset.warrantyEnd || ""}
              onChange={(e) => {
                onChange(e);
                if (errors.warrantyEnd) setErrors({ ...errors, warrantyEnd: "" });
              }}
                  className={`w-full border-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.warrantyEnd 
                      ? "border-red-500 bg-red-50" 
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
            />
                <AnimatePresence>
            {errors.warrantyEnd && (
                    <motion.p
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="text-xs text-red-600 mt-1 font-medium"
                    >
                      {errors.warrantyEnd}
                    </motion.p>
            )}
                </AnimatePresence>
              </motion.div>
        </div>

            <motion.div 
              variants={fieldVariants}
              custom={4}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row justify-end gap-2.5 mt-5 pt-4 border-t border-gray-200"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="group relative px-5 py-2 rounded-lg border-2 border-gray-300 bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-white hover:border-gray-400 transition-all duration-200 font-semibold text-xs text-gray-700 hover:text-gray-900 shadow-sm hover:shadow-md w-full sm:w-auto"
              >
                <span className="relative z-10">Cancel</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
                className="group relative px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-xs font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:from-purple-700 hover:to-purple-800 transition-all duration-200 overflow-hidden w-full sm:w-auto"
          >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                <span className="relative z-10 flex items-center gap-1.5 justify-center">
                  <FiSave className="text-sm" />
            Save
                </span>
              </motion.button>
            </motion.div>
        </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

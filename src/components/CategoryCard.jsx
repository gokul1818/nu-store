import { motion } from "framer-motion";

export default function CategoryCard({ category, onClick }) {
    return (
        <motion.div
            onClick={onClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="
        cursor-pointer
        bg-white/70 backdrop-blur-md
        rounded-xl shadow
        flex flex-col
        w-[180px]
        shrink-0
        overflow-hidden
        transition-all duration-200
        hover:shadow-xl 
        
      "
        >
            {/* IMAGE */}
            <div className="w-full h-[160px] overflow-hidden bg-gray-100">
                {category.image ? (
                    <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover hover:scale-110 duration-200"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-500 text-2xl">
                        {category.icon || "📦"}
                    </div>
                )}
            </div>

            {/* TEXT */}
            <div className="p-3 text-center">
                <h3 className="font-semibold text-gray-900 text-sm">
                    {category.name}
                </h3>

                {category.count && (
                    <p className="text-xs text-gray-500">{category.count} products</p>
                )}
            </div>
        </motion.div>
    );
}

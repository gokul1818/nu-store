// import { useState } from "react";
// import { FaTrash } from "react-icons/fa";
// import { TbEdit } from "react-icons/tb";
// import AppTable from "../../components/AppTable";
// import AppButton from "../../components/AppButton";
// import { Pagination } from "../../components/Pagination";

// export default function MasterDataDummy() {
//   const SECTIONS = [
//     { key: "colors", label: "Colors" },
//     { key: "sizes", label: "Sizes" },
//     { key: "shipping", label: "Shipping Fees" },
//     { key: "offers", label: "Offers & Deals" },
//     { key: "news", label: "News & Announcements" },
//   ];

//   const [activeSection, setActiveSection] = useState(null);

//   // Dummy data
//   const dummyData = {
//     colors: [
//       { _id: 1, name: "Red" },
//       { _id: 2, name: "Blue" },
//       { _id: 3, name: "Green" },
//     ],
//     sizes: [
//       { _id: 1, size: "S" },
//       { _id: 2, size: "M" },
//       { _id: 3, size: "L" },
//     ],
//     shipping: [
//       { _id: 1, region: "Delhi", fee: 50 },
//       { _id: 2, region: "Mumbai", fee: 60 },
//     ],
//     offers: [
//       { _id: 1, title: "Summer Sale", discount: "20%" },
//       { _id: 2, title: "Festive Offer", discount: "15%" },
//     ],
//     news: [
//       { _id: 1, title: "New Arrivals", date: "2025-11-22" },
//       { _id: 2, title: "Holiday Sale", date: "2025-12-01" },
//     ],
//   };

//   // Columns for each section
//   const sectionColumns = {
//     colors: [{ key: "name", label: "Color" }],
//     sizes: [{ key: "size", label: "Size" }],
//     shipping: [
//       { key: "region", label: "Region" },
//       { key: "fee", label: "Fee" },
//     ],
//     offers: [
//       { key: "title", label: "Title" },
//       { key: "discount", label: "Discount" },
//     ],
//     news: [
//       { key: "title", label: "Title" },
//       { key: "date", label: "Date" },
//     ],
//   };

//   // Actions (Edit/Delete)
//   const sectionActions = (sectionKey) => [
//     {
//       icon: <TbEdit className="w-5 h-5 text-primary" />,
//       onClick: (row) => alert(`Edit ${sectionKey}: ${row._id}`),
//       title: "Edit",
//     },
//     {
//       icon: <FaTrash className="w-4 h-4 text-primary" />,
//       onClick: (row) => alert(`Delete ${sectionKey}: ${row._id}`),
//       title: "Delete",
//     },
//   ];

//   return (
//     <div className="container mx-auto p-6">
//       <h2 className="text-2xl font-semibold mb-6 text-center">Master Data</h2>

//       <div className="space-y-4">
//         {SECTIONS.map((sec) => (
//           <div key={sec.key} className="bg-white rounded shadow">
//             {/* Header */}
//             <button
//               onClick={() =>
//                 setActiveSection(activeSection === sec.key ? null : sec.key)
//               }
//               className="w-full text-left p-4 font-semibold flex justify-between items-center hover:bg-gray-50 transition"
//             >
//               {sec.label}
//               <span>{activeSection === sec.key ? "-" : "+"}</span>
//             </button>

//             {/* Content */}
//             {activeSection === sec.key && (
//               <div className="p-4 border-t border-gray-200">
//                 <div className="flex justify-end mb-4">
//                   <AppButton
//                     onClick={() => alert(`Add new ${sec.label}`)}
//                     className="bg-primary text-white hover:bg-primary-dark"
//                   >
//                     + Add {sec.label.slice(0, -1)}
//                   </AppButton>
//                 </div>

//                 <AppTable
//                   columns={sectionColumns[sec.key]}
//                   data={dummyData[sec.key]}
//                   actions={sectionActions(sec.key)}
//                   loading={false}
//                 />

//                 {/* Dummy pagination */}
//                 {dummyData[sec.key].length > 3 && (
//                   <div className="mt-4">
//                     <Pagination
//                       totalPages={2}
//                       currentPage={1}
//                       setCurrentPage={(p) => alert(`Change page to ${p}`)}
//                     />
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

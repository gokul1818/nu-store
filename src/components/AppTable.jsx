export default function AppTable({
  columns = [],
  data = [],
  actions = [],
  loading = false,
}) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-orange-100">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key}
                className={`border-b border-gray-300 p-4 text-left ${idx !== columns.length - 1 || actions.length > 0
                    ? "border-r border-gray-300"
                    : ""
                  }`}
              >
                {col.label}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="border-b border-gray-300 p-4 text-left">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                className="border-b border-gray-300 p-4 text-center"
              >
                <div className="flex justify-center items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                className="border-b border-gray-300 p-4 text-center text-gray-500"
              >
                No records found.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="hover:bg-gray-50 transition"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={col.key}
                    className={`border-b border-gray-300 p-4 ${colIndex !== columns.length - 1 || actions.length > 0
                        ? "border-r border-gray-300"
                        : ""
                      }`}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="border-b border-gray-300 p-4">
                    <div className="flex gap-2">
                      {actions.map((action, idx) => (
                        <button
                          key={idx}
                          className={action.className}
                          title={
                            typeof action.title === "function"
                              ? action.title(row)
                              : action.title
                          }
                          onClick={() => action.onClick(row)}
                        >
                          {typeof action.icon === "function"
                            ? action.icon(row)
                            : action.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

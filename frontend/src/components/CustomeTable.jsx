/* eslint-disable react/prop-types */
export const CustomeTable = ({column, dataSource}) => {
  return (
    <table className="shadow-lg w-full">
        <thead className=" text-white font-poppins h-14 rounded-full">
            <tr className="my-5 rounded-full ">
                {column?.map((col, index) => col.isShow && 
                    <th className="bg-blue-600"  key={index}>
                        {col.title}
                    </th>)}
            </tr>
        </thead>
        <tbody>
            {dataSource.map(item => (
                <tr key={item.key} className=" h-12 rounded-full w-full border-b-blue-500 border-b-2 text-center">
                    {
                        column?.map((col, index) => col.isShow && 
                            <td key={index} 
                                className=" content-center ">
                                {item[col.index]}
                            </td>)
                    }
                </tr>
            ))}
        </tbody>
    </table>
  )
}

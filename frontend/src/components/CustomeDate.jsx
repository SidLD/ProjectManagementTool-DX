/* eslint-disable react/prop-types */

export const CustomeDate = ({date, borderColor, title, color}) => {
    const localDate = new Date(date)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
  return (
    <>
    <div className={`w-1/3 h-full hover:scale-105 delay-250`}>
        <h2 className="text-center uppercase">{title}</h2>
        <div className={`${borderColor} border-t-8 mt-2 shadow-md rounded-lg flex-row text-center justify-center content-center`}>
            <p className="uppercase text-2xl">{localDate.getFullYear().toString()}</p>
            <p className={color}>{monthNames[localDate.getMonth()]} {localDate.getDay().toString()}</p>

        </div>

    </div>
    </>
  )
}

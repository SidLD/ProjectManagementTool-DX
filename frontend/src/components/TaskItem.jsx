/* eslint-disable react/prop-types */
import { useDrag } from "react-dnd"
export const TaskItem = ({item}) => {
    // eslint-disable-next-line no-unused-vars
    const [{isDragging}, drag] = useDrag(() => ({
        type: "task",
        item: item,
        collect: (monitor) => ({
            isDragging : !!monitor.isDragging(),
        })
    }))
    return (
        <div ref={drag}
            className="h-20 border-4 border-pink-600">
                DndItem {item.status}</div>
    )
}
 
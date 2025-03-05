import React from "react";
import { RoadmapItemType } from "../utils/RoadmapItemType";

interface RoadmapItemProps {
  item: RoadmapItemType;
}

const RoadmapItem: React.FC<RoadmapItemProps> = ({ item }) => {
  const statusColor = {
    completed: "bg-green-500",
    "in-progress": "bg-yellow-500",
    planned: "bg-gray-500",
  };

  return (
    <div className="flex items-start space-x-4">
      <div className={`w-4 h-4 rounded-full mt-1 ${statusColor[item.status]}`}></div>
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{item.title}</h3>
        <p className="text-gray-600">{item.description}</p>
      </div>
    </div>
  );
};

export default RoadmapItem;
import { MdDashboard, MdOutlineUnsubscribe } from "react-icons/md";
import { AiOutlineSwap } from "react-icons/ai";
import { FaBook } from "react-icons/fa";
import { BsFillFileRuledFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";

const links = [
  {
    id: 1,
    text: "Dashboard",
    path: "/app/dashboard",
    icon: <MdDashboard />,
  },
  { id: 2, text: "Trades", path: "/app/trades", icon: <AiOutlineSwap /> },
  {
    id: 3,
    text: "Journal",
    path: "/app/journal",
    icon: <FaBook />,
  },
  { id: 4, text: "Rules", path: "/app/rules", icon: <BsFillFileRuledFill /> },
  {
    id: 5,
    text: "Profile",
    path: "/app/profile",
    icon: <FaUserCircle />,
  },
  {
    id: 6,
    text: "Subscription",
    path: "/app/sub",
    icon: <MdOutlineUnsubscribe />,
  },
];

export default links;

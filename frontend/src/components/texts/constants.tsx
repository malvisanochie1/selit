import { BsPostcardHeartFill } from "react-icons/bs";
import { MdMessage } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
// import { IoHome } from "react-icons/io5";
import { TiHomeOutline } from "react-icons/ti";
import {
  MdOutlineDashboard,
  MdOutlineShoppingBag,
  MdOutlineAttachMoney,
} from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { MdFavoriteBorder } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";

//site information
export interface selit {
  name: string;
  description: string;
  contactEmail: string;
  logo: string;
}
export const selit = {
  name: "Selit",
  description: "A platform for buying and selling products",
  logo: "/logo/favi.png",
  url: "https://selit.com",
  contactEmail: "selit.com",
};

//users details
export interface user {
  id: number;
  name: string;
  profilePicture: string;
  address: string;
  role: string;
}

export const users: user[] = [
  {
    id: 1,
    name: "Jane Smith",
    profilePicture:
      "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    address: "123 Main St, Springfield, USA",
    role: "buyer",
  },
  // Add more users as needed
];
import { ReactNode } from "react";

export interface navItem {
  id: number;
  name: string;
  designation: string;
  icon: ReactNode;
  href: string;
}

export const navItems: navItem[] = [
  {
    id: 1,
    name: "Wish lists",
    designation: "",
    icon: <BsPostcardHeartFill />,
    href: "#",
  },
  {
    id: 2,
    name: "Chats",
    designation: "",
    icon: <MdMessage />,
    href: "Chats",
  },
  {
    id: 3,
    name: "Notifications",
    designation: "",
    icon: <IoMdNotifications />,
    href: "#",
  },
  {
    id: 4,
    name: "Products",
    designation: "",
    icon: <FaClipboardList />,
    href: "#",
  },
];

export const sidebarLinks = [
  { label: "Home", href: "/", icon: <TiHomeOutline size={20} /> },
  {
    label: "Product",
    href: "/product",
    icon: <MdOutlineShoppingBag size={20} />,
  },
  {
    label: "Product Sale",
    href: "product_sale",
    icon: <MdOutlineAttachMoney size={20} />,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <MdOutlineDashboard size={20} />,
  },
  {
    label: "Wish List",
    href: "/WishList",
    icon: <MdFavoriteBorder size={20} />,
  },
  { label: "Search", href: "/Search", icon: <FiSearch size={20} /> },
];

export interface products {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  href: string;
  condition: string;
  location: string;
}
export const products = [
  // 50+ realistic campus marketplace products for Nigerian students
  {
    id: 1,
    name: "Bedframe",
    description:
      "A black and white 4 by 6 padded bed frame, just 6 months of usage.",
    price: 150000,
    image: "/user/profile.jpg",
    href: "#",
    condition: "used",
    location: "Umuneze Junction",
  },
  {
    id: 2,
    name: "HP EliteBook 840 G3",
    description:
      "Sleek 14'' laptop, Core i5, 8GB RAM, 256GB SSD. Battery lasts 4+ hours. Perfect for school work.",
    price: 210000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "UNN Hostel Block B",
  },
  {
    id: 3,
    name: "Samsung Galaxy A12",
    description:
      "6.5'' screen, 64GB storage, blue color, no cracks, comes with charger.",
    price: 65000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Nsukka Campus Gate",
  },
  {
    id: 4,
    name: "Reading Table & Chair",
    description:
      "Wooden reading table and padded chair, good for hostel rooms.",
    price: 25000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Chitis Hostel, Room 12",
  },
  {
    id: 5,
    name: "Gas Cylinder (6kg)",
    description: "6kg gas cylinder with burner, barely used, no leaks.",
    price: 12000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Odim Market",
  },
  {
    id: 6,
    name: "Brand New Duvet Set",
    description: "Colorful 6x6 duvet with 2 pillowcases, never used.",
    price: 18000,
    image: "/logo/lg.png",
    href: "#",
    condition: "new",
    location: "UNEC Hostel C",
  },
  {
    id: 7,
    name: "Bluetooth Speaker",
    description: "JBL Go 3, portable, waterproof, 5 hours playtime, red color.",
    price: 9000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Faculty of Engineering",
  },
  {
    id: 8,
    name: "Mathematics Textbook",
    description:
      "Further Mathematics for SSCE, 2022 edition, no markings inside.",
    price: 3500,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "UNN Bookshop",
  },
  {
    id: 9,
    name: "Men's Sneakers (Nike)",
    description: "Black and white Nike Air Max, size 43, gently used.",
    price: 17000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Zik's Flats",
  },
  {
    id: 10,
    name: "iPhone 11 (64GB)",
    description: "Purple, 64GB, Face ID works, minor scratches, with box.",
    price: 230000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Enugu Campus, Hall 2",
  },
  {
    id: 11,
    name: "Hostel Locker",
    description:
      "Metal locker, blue, 3ft tall, with padlock, perfect for hostel storage.",
    price: 8000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Mbakwe Hostel",
  },
  {
    id: 12,
    name: "Electric Kettle",
    description:
      "Binatone 1.7L, boils fast, white, 1 year old, works perfectly.",
    price: 6000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Odim Junction",
  },
  {
    id: 13,
    name: "Brand New Bedsheet",
    description: "6x6 bedsheet, blue stripes, 100% cotton, still in pack.",
    price: 7000,
    image: "/logo/lg.png",
    href: "#",
    condition: "new",
    location: "UNEC Hostel D",
  },
  {
    id: 14,
    name: "Standing Fan",
    description:
      "OX 18'' standing fan, 3 speed, works well, little rust on base.",
    price: 11000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "UNN Hostel Block C",
  },
  {
    id: 15,
    name: "Female Handbag",
    description: "Pink Zara handbag, medium size, used for 2 months only.",
    price: 8000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Faculty of Social Sciences",
  },
  {
    id: 16,
    name: "Mini Fridge",
    description:
      "Haier Thermocool, 90L, works perfectly, low power consumption.",
    price: 35000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "UNN Hostel Block D",
  },
  {
    id: 17,
    name: "Used Microwave Oven",
    description: "LG 20L, white, heats evenly, 2 years old.",
    price: 18000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Odim Market",
  },
  {
    id: 18,
    name: "iPad 7th Gen (32GB)",
    description: "Silver, WiFi only, with case, screen protector applied.",
    price: 120000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "UNEC Library",
  },
  {
    id: 19,
    name: "Hostel Mattress",
    description: "6x4 Vitafoam mattress, blue, 1 year old, no stains.",
    price: 20000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Chitis Hostel, Room 8",
  },
  {
    id: 20,
    name: "Men's Wristwatch",
    description:
      "Casio, black leather strap, water resistant, battery replaced recently.",
    price: 7000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Faculty of Physical Sciences",
  },
  {
    id: 21,
    name: "Used Bicycle",
    description: "Phoenix, 26'' wheels, blue, needs new bell, otherwise fine.",
    price: 25000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "UNN Sports Complex",
  },
  {
    id: 22,
    name: "Android Tablet",
    description: "Tecno DroiPad 7D, 16GB, WiFi + SIM, with charger.",
    price: 22000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Faculty of Education",
  },
  {
    id: 23,
    name: "Used Blender",
    description: "Binatone, 1.5L, white, works well, with extra jar.",
    price: 7000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Odim Market",
  },
  {
    id: 24,
    name: "Hostel Curtain",
    description: "Pair of blue curtains, 6ft long, clean, no tears.",
    price: 4000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "UNEC Hostel B",
  },
  {
    id: 25,
    name: "Used Iron",
    description: "Philips, 1200W, blue, works perfectly, 1 year old.",
    price: 5000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Odim Junction",
  },
  {
    id: 26,
    name: "Female Sandals",
    description: "Brown leather, size 39, worn twice, almost new.",
    price: 6000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Faculty of Arts",
  },
  {
    id: 27,
    name: "Used Backpack",
    description: "Adidas, black, laptop compartment, all zips working.",
    price: 8000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "UNN Hostel Block A",
  },
  {
    id: 28,
    name: "Brand New Pillow",
    description: "Soft fiber pillow, white, still in nylon.",
    price: 3500,
    image: "/logo/lg.png",
    href: "#",
    condition: "new",
    location: "UNEC Hostel E",
  },
  {
    id: 29,
    name: "Used Extension Box",
    description: "6-way extension, surge protected, white, works well.",
    price: 2500,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Odim Market",
  },
  {
    id: 30,
    name: "Men's Leather Belt",
    description: "Black, 44 inches, genuine leather, barely used.",
    price: 3000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Faculty of Law",
  },
  {
    id: 31,
    name: "Used Power Bank",
    description: "Oraimo 20,000mAh, black, holds charge well.",
    price: 9000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "UNN Hostel Block F",
  },
  {
    id: 32,
    name: "Brand New Water Bottle",
    description: "1L, blue, BPA-free, never used.",
    price: 2500,
    image: "/logo/lg.png",
    href: "#",
    condition: "new",
    location: "UNEC Hostel A",
  },
  {
    id: 33,
    name: "Used Calculator",
    description: "Casio fx-991ES, scientific, all buttons working.",
    price: 4000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Faculty of Physical Sciences",
  },
  {
    id: 34,
    name: "Brand New Bedsheet",
    description: "5x6 bedsheet, pink, 100% cotton, still in pack.",
    price: 6500,
    image: "/logo/lg.png",
    href: "#",
    condition: "new",
    location: "UNEC Hostel F",
  },
  {
    id: 35,
    name: "Used Laptop Charger",
    description: "HP 19V, 3.33A, original, works perfectly.",
    price: 5000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "UNN Hostel Block G",
  },
  {
    id: 36,
    name: "Men's Dress Shoes",
    description: "Black, size 44, Clarks, worn for 3 months.",
    price: 12000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Faculty of Social Sciences",
  },
  {
    id: 37,
    name: "Used Table Lamp",
    description: "Rechargeable, white, 3 brightness levels, works well.",
    price: 3500,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "UNN Hostel Block H",
  },
  {
    id: 38,
    name: "Brand New Towel",
    description: "Large, blue, 100% cotton, still in pack.",
    price: 4000,
    image: "/logo/lg.png",
    href: "#",
    condition: "new",
    location: "UNEC Hostel G",
  },
  {
    id: 39,
    name: "Used Android Phone",
    description: "Infinix Hot 10, 32GB, black, with charger, minor scratches.",
    price: 35000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Faculty of Engineering",
  },
  {
    id: 40,
    name: "Brand New School Bag",
    description: "Black, 3 compartments, waterproof, never used.",
    price: 9000,
    image: "/logo/lg.png",
    href: "#",
    condition: "new",
    location: "UNEC Hostel H",
  },
  {
    id: 41,
    name: "Used Headphones",
    description: "Sony, over-ear, black, works perfectly, with case.",
    price: 15000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Faculty of Arts",
  },
  {
    id: 42,
    name: "Brand New Flask",
    description: "1.5L, stainless steel, keeps hot for 12 hours.",
    price: 6000,
    image: "/logo/lg.png",
    href: "#",
    condition: "new",
    location: "UNEC Hostel I",
  },
  {
    id: 43,
    name: "Used Skirt",
    description: "Blue, size 12, worn for 1 semester, no tears.",
    price: 2500,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Faculty of Social Sciences",
  },
  {
    id: 44,
    name: "Brand New Socks (3 pairs)",
    description: "White, ankle length, cotton, still in pack.",
    price: 2000,
    image: "/logo/lg.png",
    href: "#",
    condition: "new",
    location: "UNEC Hostel J",
  },
  {
    id: 45,
    name: "Used Water Dispenser",
    description: "CWAY, 18L, white, works perfectly, 2 years old.",
    price: 25000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Odim Market",
  },
  {
    id: 46,
    name: "Brand New Blanket",
    description: "6x6, grey, soft, still in pack.",
    price: 8000,
    image: "/logo/lg.png",
    href: "#",
    condition: "new",
    location: "UNEC Hostel K",
  },
  {
    id: 47,
    name: "Used Laptop Stand",
    description: "Adjustable, black, metal, sturdy, works well.",
    price: 6000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Faculty of Engineering",
  },
  {
    id: 48,
    name: "Brand New Cutlery Set",
    description: "12 pieces, stainless steel, never used.",
    price: 3500,
    image: "/logo/lg.png",
    href: "#",
    condition: "new",
    location: "UNEC Hostel L",
  },
  {
    id: 49,
    name: "Used Suitcase",
    description: "Medium size, black, all zips working, wheels intact.",
    price: 12000,
    image: "/logo/lg.png",
    href: "#",
    condition: "used",
    location: "Odim Market",
  },
  {
    id: 50,
    name: "Brand New Power Strip",
    description: "6-way, surge protected, white, never used.",
    price: 4000,
    image: "/logo/lg.png",
    href: "#",
    condition: "new",
    location: "UNEC Hostel M",
  },
];
// {
//   id: 4,
//   name: "Product 4",
//   description: "Description of Product 4",
//   price: 39.99,
//   image: "/user/profile.jpg",
// },
// {
//   id: 5,
//   name: "Product 5",
//   description: "Description of Product 5",
//   price: 24.99,
//   image: "/user/profile.jpg",
// },
// {
//   id: 6,
//   name: "Product 6",
//   description: "Description of Product 6",
//   price: 59.99,
//   image: "/user/profile.jpg",
// },
// {
//   id: 7,
//   name: "Product 7",
//   description: "Description of Product 7",
//   price: 34.99,
//   image: "/user/profile.jpg",
// },
// {
//   id: 8,
//   name: "Product 8",
//   description: "Description of Product 8",
//   price: 44.99,
//   image: "/user/profile.jpg",
// },
// {
//   id: 9,
//   name: "Product 9",
//   description: "Description of Product 9",
//   price: 14.99,
//   image: "/user/profile.jpg",
// },
// {
//   id: 10,
//   name: "Product 10",
//   description: "Description of Product 10",
//   price: 54.99,
//   image: "/user/profile.jpg",
// },

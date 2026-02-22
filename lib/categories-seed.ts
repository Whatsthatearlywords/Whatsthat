import { Category } from './types';
import Colors from '@/constants/colors';

export const categoriesSeed: Category[] = [
  {
    id: 'shapes',
    name: 'Shapes',
    icon: 'shape',
    iconFamily: 'MaterialCommunityIcons',
    color: Colors.categories.shapes,
    pages: [
      {
        id: 'shapes-1',
        items: [
          { id: 's1', label: 'Circle', icon: 'circle', iconFamily: 'MaterialCommunityIcons', color: '#FF6B6B' },
          { id: 's2', label: 'Square', icon: 'square', iconFamily: 'MaterialCommunityIcons', color: '#74B9FF' },
          { id: 's3', label: 'Triangle', icon: 'triangle', iconFamily: 'MaterialCommunityIcons', color: '#55EFC4' },
          { id: 's4', label: 'Rectangle', icon: 'rectangle', iconFamily: 'MaterialCommunityIcons', color: '#FDCB6E' },
          { id: 's5', label: 'Star', icon: 'star', iconFamily: 'MaterialCommunityIcons', color: '#FFE66D' },
          { id: 's6', label: 'Heart', icon: 'heart', iconFamily: 'MaterialCommunityIcons', color: '#FD79A8' },
        ],
      },
      {
        id: 'shapes-2',
        items: [
          { id: 's7', label: 'Oval', icon: 'ellipse', iconFamily: 'MaterialCommunityIcons', color: '#A29BFE' },
          { id: 's8', label: 'Diamond', icon: 'diamond', iconFamily: 'MaterialCommunityIcons', color: '#00CEC9' },
          { id: 's9', label: 'Pentagon', icon: 'pentagon', iconFamily: 'MaterialCommunityIcons', color: '#E17055' },
          { id: 's10', label: 'Hexagon', icon: 'hexagon', iconFamily: 'MaterialCommunityIcons', color: '#0984E3' },
          { id: 's11', label: 'Crescent', icon: 'moon-waning-crescent', iconFamily: 'MaterialCommunityIcons', color: '#6C5CE7' },
          { id: 's12', label: 'Arrow', icon: 'arrow-up-bold', iconFamily: 'MaterialCommunityIcons', color: '#00B894' },
        ],
      },
    ],
    isPremium: true,
  },
  {
    id: 'colours',
    name: 'Colours',
    icon: 'palette',
    iconFamily: 'MaterialCommunityIcons',
    color: Colors.categories.colours,
    pages: [
      {
        id: 'colours-1',
        items: [
          { id: 'c1', label: 'Red', icon: 'circle', iconFamily: 'MaterialCommunityIcons', color: '#FF0000' },
          { id: 'c2', label: 'Blue', icon: 'circle', iconFamily: 'MaterialCommunityIcons', color: '#0000FF' },
          { id: 'c3', label: 'Yellow', icon: 'circle', iconFamily: 'MaterialCommunityIcons', color: '#FFD700' },
          { id: 'c4', label: 'Green', icon: 'circle', iconFamily: 'MaterialCommunityIcons', color: '#00CC00' },
          { id: 'c5', label: 'Orange', icon: 'circle', iconFamily: 'MaterialCommunityIcons', color: '#FF8C00' },
          { id: 'c6', label: 'Purple', icon: 'circle', iconFamily: 'MaterialCommunityIcons', color: '#8B00FF' },
        ],
      },
      {
        id: 'colours-2',
        items: [
          { id: 'c7', label: 'Pink', icon: 'circle', iconFamily: 'MaterialCommunityIcons', color: '#FF69B4' },
          { id: 'c8', label: 'Brown', icon: 'circle', iconFamily: 'MaterialCommunityIcons', color: '#8B4513' },
          { id: 'c9', label: 'Grey', icon: 'circle', iconFamily: 'MaterialCommunityIcons', color: '#808080' },
          { id: 'c10', label: 'Black', icon: 'circle', iconFamily: 'MaterialCommunityIcons', color: '#1A1A1A' },
          { id: 'c11', label: 'White', icon: 'circle-outline', iconFamily: 'MaterialCommunityIcons', color: '#E0E0E0' },
          { id: 'c12', label: 'Gold', icon: 'circle', iconFamily: 'MaterialCommunityIcons', color: '#FFD700' },
        ],
      },
    ],
    isPremium: true,
  },
  {
    id: 'animals',
    name: 'Animals',
    icon: 'paw',
    iconFamily: 'MaterialCommunityIcons',
    color: Colors.categories.animals,
    pages: [
      {
        id: 'animals-1',
        items: [
          { id: 'a1', label: 'Cow', icon: 'cow', iconFamily: 'MaterialCommunityIcons', color: '#8B4513' },
          { id: 'a2', label: 'Sheep', icon: 'sheep', iconFamily: 'MaterialCommunityIcons', color: '#B0B0B0' },
          { id: 'a3', label: 'Pig', icon: 'pig', iconFamily: 'MaterialCommunityIcons', color: '#FFB6C1' },
          { id: 'a4', label: 'Horse', icon: 'horse', iconFamily: 'MaterialCommunityIcons', color: '#8B4513' },
          { id: 'a5', label: 'Chicken', icon: 'food-drumstick', iconFamily: 'MaterialCommunityIcons', color: '#FF8C00' },
          { id: 'a6', label: 'Duck', icon: 'duck', iconFamily: 'MaterialCommunityIcons', color: '#FFD700' },
        ],
      },
      {
        id: 'animals-2',
        items: [
          { id: 'a7', label: 'Lion', icon: 'lion-face', iconFamily: 'MaterialCommunityIcons', color: '#DAA520' },
          { id: 'a8', label: 'Elephant', icon: 'elephant', iconFamily: 'MaterialCommunityIcons', color: '#808080' },
          { id: 'a9', label: 'Monkey', icon: 'face-man', iconFamily: 'MaterialCommunityIcons', color: '#8B4513' },
          { id: 'a10', label: 'Giraffe', icon: 'guy-fawkes-mask', iconFamily: 'MaterialCommunityIcons', color: '#DAA520' },
          { id: 'a11', label: 'Zebra', icon: 'horse-variant', iconFamily: 'MaterialCommunityIcons', color: '#1A1A1A' },
          { id: 'a12', label: 'Tiger', icon: 'cat', iconFamily: 'MaterialCommunityIcons', color: '#FF8C00' },
        ],
      },
      {
        id: 'animals-3',
        items: [
          { id: 'a13', label: 'Dog', icon: 'dog', iconFamily: 'MaterialCommunityIcons', color: '#8B4513' },
          { id: 'a14', label: 'Cat', icon: 'cat', iconFamily: 'MaterialCommunityIcons', color: '#FF8C00' },
          { id: 'a15', label: 'Fish', icon: 'fish', iconFamily: 'MaterialCommunityIcons', color: '#74B9FF' },
          { id: 'a16', label: 'Bird', icon: 'bird', iconFamily: 'MaterialCommunityIcons', color: '#FF6B6B' },
          { id: 'a17', label: 'Rabbit', icon: 'rabbit', iconFamily: 'MaterialCommunityIcons', color: '#DDD' },
          { id: 'a18', label: 'Turtle', icon: 'turtle', iconFamily: 'MaterialCommunityIcons', color: '#00B894' },
        ],
      },
    ],
    isPremium: true,
  },
  {
    id: 'food',
    name: 'Food',
    icon: 'food-apple',
    iconFamily: 'MaterialCommunityIcons',
    color: Colors.categories.food,
    pages: [
      {
        id: 'food-1',
        items: [
          { id: 'f1', label: 'Apple', icon: 'food-apple', iconFamily: 'MaterialCommunityIcons', color: '#FF0000' },
          { id: 'f2', label: 'Banana', icon: 'fruit-watermelon', iconFamily: 'MaterialCommunityIcons', color: '#FFD700' },
          { id: 'f3', label: 'Bread', icon: 'bread-slice', iconFamily: 'MaterialCommunityIcons', color: '#DEB887' },
          { id: 'f4', label: 'Milk', icon: 'cup', iconFamily: 'MaterialCommunityIcons', color: '#F5F5DC' },
          { id: 'f5', label: 'Carrot', icon: 'carrot', iconFamily: 'MaterialCommunityIcons', color: '#FF8C00' },
          { id: 'f6', label: 'Cheese', icon: 'cheese', iconFamily: 'MaterialCommunityIcons', color: '#FFD700' },
        ],
      },
      {
        id: 'food-2',
        items: [
          { id: 'f7', label: 'Cookie', icon: 'cookie', iconFamily: 'MaterialCommunityIcons', color: '#8B4513' },
          { id: 'f8', label: 'Yogurt', icon: 'cup', iconFamily: 'MaterialCommunityIcons', color: '#FFB6C1' },
          { id: 'f9', label: 'Crackers', icon: 'food-croissant', iconFamily: 'MaterialCommunityIcons', color: '#DEB887' },
          { id: 'f10', label: 'Juice', icon: 'cup-water', iconFamily: 'MaterialCommunityIcons', color: '#FF8C00' },
          { id: 'f11', label: 'Sandwich', icon: 'food-hot-dog', iconFamily: 'MaterialCommunityIcons', color: '#DEB887' },
          { id: 'f12', label: 'Cereal', icon: 'bowl-mix', iconFamily: 'MaterialCommunityIcons', color: '#DAA520' },
        ],
      },
      {
        id: 'food-3',
        items: [
          { id: 'f13', label: 'Broccoli', icon: 'tree', iconFamily: 'MaterialCommunityIcons', color: '#228B22' },
          { id: 'f14', label: 'Tomato', icon: 'circle', iconFamily: 'MaterialCommunityIcons', color: '#FF0000' },
          { id: 'f15', label: 'Potato', icon: 'circle', iconFamily: 'MaterialCommunityIcons', color: '#DEB887' },
          { id: 'f16', label: 'Corn', icon: 'corn', iconFamily: 'MaterialCommunityIcons', color: '#FFD700' },
          { id: 'f17', label: 'Lettuce', icon: 'leaf', iconFamily: 'MaterialCommunityIcons', color: '#00CC00' },
          { id: 'f18', label: 'Peas', icon: 'circle-multiple', iconFamily: 'MaterialCommunityIcons', color: '#00B894' },
        ],
      },
    ],
    isPremium: true,
  },
  {
    id: 'vehicles',
    name: 'Vehicles',
    icon: 'car',
    iconFamily: 'MaterialCommunityIcons',
    color: Colors.categories.vehicles,
    pages: [
      {
        id: 'vehicles-1',
        items: [
          { id: 'v1', label: 'Car', icon: 'car', iconFamily: 'MaterialCommunityIcons', color: '#FF6B6B' },
          { id: 'v2', label: 'Bus', icon: 'bus', iconFamily: 'MaterialCommunityIcons', color: '#FFD700' },
          { id: 'v3', label: 'Train', icon: 'train', iconFamily: 'MaterialCommunityIcons', color: '#74B9FF' },
          { id: 'v4', label: 'Plane', icon: 'airplane', iconFamily: 'MaterialCommunityIcons', color: '#A29BFE' },
          { id: 'v5', label: 'Boat', icon: 'sail-boat', iconFamily: 'MaterialCommunityIcons', color: '#0984E3' },
          { id: 'v6', label: 'Bike', icon: 'bicycle', iconFamily: 'MaterialCommunityIcons', color: '#00B894' },
        ],
      },
      {
        id: 'vehicles-2',
        items: [
          { id: 'v7', label: 'Police Car', icon: 'car-emergency', iconFamily: 'MaterialCommunityIcons', color: '#0000FF' },
          { id: 'v8', label: 'Fire Truck', icon: 'fire-truck', iconFamily: 'MaterialCommunityIcons', color: '#FF0000' },
          { id: 'v9', label: 'Ambulance', icon: 'ambulance', iconFamily: 'MaterialCommunityIcons', color: '#FFFFFF' },
          { id: 'v10', label: 'Helicopter', icon: 'helicopter', iconFamily: 'MaterialCommunityIcons', color: '#808080' },
          { id: 'v11', label: 'Rescue Boat', icon: 'ferry', iconFamily: 'MaterialCommunityIcons', color: '#FF8C00' },
          { id: 'v12', label: 'Tow Truck', icon: 'tow-truck', iconFamily: 'MaterialCommunityIcons', color: '#DAA520' },
        ],
      },
      {
        id: 'vehicles-3',
        items: [
          { id: 'v13', label: 'Excavator', icon: 'excavator', iconFamily: 'MaterialCommunityIcons', color: '#FFD700' },
          { id: 'v14', label: 'Bulldozer', icon: 'bulldozer', iconFamily: 'MaterialCommunityIcons', color: '#FF8C00' },
          { id: 'v15', label: 'Dump Truck', icon: 'dump-truck', iconFamily: 'MaterialCommunityIcons', color: '#808080' },
          { id: 'v16', label: 'Crane', icon: 'crane', iconFamily: 'MaterialCommunityIcons', color: '#FFD700' },
          { id: 'v17', label: 'Cement Mixer', icon: 'truck', iconFamily: 'MaterialCommunityIcons', color: '#B0B0B0' },
          { id: 'v18', label: 'Forklift', icon: 'forklift', iconFamily: 'MaterialCommunityIcons', color: '#FF8C00' },
        ],
      },
    ],
    isPremium: true,
  },
  {
    id: 'family',
    name: 'Family',
    icon: 'account-group',
    iconFamily: 'MaterialCommunityIcons',
    color: Colors.categories.family,
    pages: [
      {
        id: 'family-1',
        items: [
          { id: 'fm1', label: 'Mum', icon: 'face-woman', iconFamily: 'MaterialCommunityIcons', color: '#FD79A8' },
          { id: 'fm2', label: 'Dad', icon: 'face-man', iconFamily: 'MaterialCommunityIcons', color: '#74B9FF' },
          { id: 'fm3', label: 'Baby', icon: 'baby-face-outline', iconFamily: 'MaterialCommunityIcons', color: '#FFB6C1' },
          { id: 'fm4', label: 'Brother', icon: 'face-man', iconFamily: 'MaterialCommunityIcons', color: '#55EFC4' },
          { id: 'fm5', label: 'Sister', icon: 'face-woman', iconFamily: 'MaterialCommunityIcons', color: '#A29BFE' },
          { id: 'fm6', label: 'Grandma', icon: 'face-woman', iconFamily: 'MaterialCommunityIcons', color: '#DEB887' },
        ],
      },
    ],
  },
  {
    id: 'myHouse',
    name: 'My House',
    icon: 'home',
    iconFamily: 'MaterialCommunityIcons',
    color: Colors.categories.myHouse,
    pages: [
      {
        id: 'house-1',
        items: [
          { id: 'h1', label: 'Table', icon: 'table-furniture', iconFamily: 'MaterialCommunityIcons', color: '#8B4513' },
          { id: 'h2', label: 'Chair', icon: 'chair-rolling', iconFamily: 'MaterialCommunityIcons', color: '#DEB887' },
          { id: 'h3', label: 'Fridge', icon: 'fridge', iconFamily: 'MaterialCommunityIcons', color: '#B0B0B0' },
          { id: 'h4', label: 'TV', icon: 'television', iconFamily: 'MaterialCommunityIcons', color: '#1A1A1A' },
          { id: 'h5', label: 'Door', icon: 'door', iconFamily: 'MaterialCommunityIcons', color: '#8B4513' },
          { id: 'h6', label: 'Window', icon: 'window-open', iconFamily: 'MaterialCommunityIcons', color: '#74B9FF' },
        ],
      },
      {
        id: 'house-2',
        items: [
          { id: 'h7', label: 'Couch', icon: 'sofa', iconFamily: 'MaterialCommunityIcons', color: '#A29BFE' },
          { id: 'h8', label: 'Lamp', icon: 'lamp', iconFamily: 'MaterialCommunityIcons', color: '#FFD700' },
          { id: 'h9', label: 'Sink', icon: 'water', iconFamily: 'MaterialCommunityIcons', color: '#74B9FF' },
          { id: 'h10', label: 'Toilet', icon: 'toilet', iconFamily: 'MaterialCommunityIcons', color: '#F5F5DC' },
          { id: 'h11', label: 'Shower', icon: 'shower', iconFamily: 'MaterialCommunityIcons', color: '#74B9FF' },
          { id: 'h12', label: 'Mirror', icon: 'mirror', iconFamily: 'MaterialCommunityIcons', color: '#C0C0C0' },
        ],
      },
    ],
    isPremium: true,
  },
  {
    id: 'nature',
    name: 'Nature',
    icon: 'tree',
    iconFamily: 'MaterialCommunityIcons',
    color: Colors.categories.nature,
    pages: [
      {
        id: 'nature-1',
        items: [
          { id: 'n1', label: 'Sun', icon: 'white-balance-sunny', iconFamily: 'MaterialCommunityIcons', color: '#FFD700' },
          { id: 'n2', label: 'Moon', icon: 'moon-waning-crescent', iconFamily: 'MaterialCommunityIcons', color: '#A29BFE' },
          { id: 'n3', label: 'Cloud', icon: 'cloud', iconFamily: 'MaterialCommunityIcons', color: '#B0B0B0' },
          { id: 'n4', label: 'Tree', icon: 'tree', iconFamily: 'MaterialCommunityIcons', color: '#228B22' },
          { id: 'n5', label: 'Flower', icon: 'flower', iconFamily: 'MaterialCommunityIcons', color: '#FF69B4' },
          { id: 'n6', label: 'Rain', icon: 'weather-rainy', iconFamily: 'MaterialCommunityIcons', color: '#74B9FF' },
        ],
      },
      {
        id: 'nature-2',
        items: [
          { id: 'n7', label: 'Snow', icon: 'snowflake', iconFamily: 'MaterialCommunityIcons', color: '#ADD8E6' },
          { id: 'n8', label: 'Wind', icon: 'weather-windy', iconFamily: 'MaterialCommunityIcons', color: '#B0B0B0' },
          { id: 'n9', label: 'Mountain', icon: 'mountain', iconFamily: 'MaterialCommunityIcons', color: '#808080' },
          { id: 'n10', label: 'River', icon: 'waves', iconFamily: 'MaterialCommunityIcons', color: '#0984E3' },
          { id: 'n11', label: 'Leaf', icon: 'leaf', iconFamily: 'MaterialCommunityIcons', color: '#00B894' },
          { id: 'n12', label: 'Rock', icon: 'diamond-stone', iconFamily: 'MaterialCommunityIcons', color: '#808080' },
        ],
      },
    ],
    isPremium: true,
  },
];

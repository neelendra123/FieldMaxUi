import React,{useState,useEffect} from 'react';
import { Row, Col, Card, Input } from 'reactstrap';

interface CardCheckboxProps {
  amount: number; // Assuming amount is of type number, change it according to your actual type
  onCheckboxChange: (amount: number) => void;
  id : string
}

const CardCheckbox: React.FC<CardCheckboxProps> = ({ amount, onCheckboxChange,id }) => {
  // Your component logic here
  const [isChecked, setIsChecked] = useState(false);
  const [forceRender, setForceRender] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setForceRender(!forceRender);
    onCheckboxChange(!isChecked ? amount : -amount);
  };
  
  return(
    <Input
    type="checkbox"
    id = {id}
    checked={isChecked}
    onChange={handleCheckboxChange}
    style={{ width: 20, height: 20, left: 9, top: 0, position: 'absolute', border: '1px #4FD44C solid' }}
  />
  )
}

export default CardCheckbox;

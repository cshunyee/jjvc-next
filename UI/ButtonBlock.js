import React from 'react';
import {
    Button,
} from 'react-bootstrap';

const ButtonBlock = (props) => {
  return (
    <div className="d-grid gap-2">
        <Button className={props.className} variant={props.variant} onClick={props.onClick} type={props.type} size={props.size} disabled={props.disabled}>
            {props.text}
        </Button>
    </div>
  )
}

export default ButtonBlock;

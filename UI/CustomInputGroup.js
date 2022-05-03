import React from 'react';
import {
    Form,
    InputGroup,
    FormControl,
} from 'react-bootstrap';

const CustomInputGroup = React.forwardRef((props, ref) => {
  return (
    <InputGroup hasValidation={props.hasValidation} className={props.className || ""}>
      {props.prepend &&
        <InputGroup.Text>
          {props.prepend}
        </InputGroup.Text>
      }
      {props.type !== "select" && <Form.Control
        className={props.inputClass || ""}
        placeholder={props.placeholder}
        size={props.size}
        type={props.type}
        accept={props.accept}
        onChange={props.onChange}
        onBlur={props.onBlur}
        value={props.value}
        autoComplete={props.autoComplete}
        isInvalid={props.isInvalid}
        readOnly={props.readOnly}
        disabled={props.disabled}
        ref={ref}
        />}
      {props.type === "select" && <Form.Select className={props.inputClass || ""}
        placeholder={props.placeholder}
        onChange={props.onChange}
        onBlur={props.onBlur}
        value={props.value}
        autoComplete={props.autoComplete}
        isInvalid={props.isInvalid}
        readOnly={props.readOnly}
        disabled={props.disabled}
        ref={ref}>
        <option value="">{props.placeholder}</option>
        {props.option.map((item) => <option value={item.value} key={`${props.customKey}-${item.value}`}>{item.display}</option>)}
      </Form.Select>}
      {props.append &&
        <InputGroup.Text>
          {props.append}
        </InputGroup.Text>
      }
    <Form.Control.Feedback type="invalid"><small>{props.feedback}</small></Form.Control.Feedback>
    </InputGroup>
  )
});

export default CustomInputGroup;

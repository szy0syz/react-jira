import React from "react";
import {
  Draggable,
  DraggableProps,
  Droppable,
  DroppableProps,
  DroppableProvided,
} from "react-beautiful-dnd";

type DropProps = Omit<DroppableProps, "children"> & {
  children: React.ReactNode;
};

export const Drop = ({ children, ...props }: DropProps) => {
  return (
    <Droppable {...props}>
      {(provided) => {
        if (React.isValidElement(children)) {
          return React.cloneElement(children, {
            ...provided.droppableProps,
            ref: provided.innerRef,
            provided,
          });
        }
        return <div />;
      }}
    </Droppable>
  );
};

type DropChildProps = Partial<
  { provided: DroppableProvided } & DroppableProvided &
    React.HtmlHTMLAttributes<HTMLDivElement>
>;
export const DropChild = React.forwardRef<HTMLDivElement, DropChildProps>(
  (props, ref) => <div ref={ref} {...props} />
);

type DragProps = Omit<DraggableProps, "children"> & {
  children: React.ReactNode;
};

export const Drag = ({ children, ...props }: DragProps) => {
  return (
    <Draggable {...props}>
      {(provided) => {
        if (React.isValidElement(children)) {
          return React.cloneElement(children, {
            ...provided.draggableProps,
            ...provided.dragHandleProps,
            ref: provided.innerRef,
          });
        }
        return <div />;
      }}
    </Draggable>
  );
};
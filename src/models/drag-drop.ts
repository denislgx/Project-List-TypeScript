// Drag & Drop Interfaces

namespace App {
  export interface Draggable {
    dragStartHandler(event: DragEvent): void; //
    dragEndHandler(event: DragEvent): void;
  }

  export interface DragTarget {
    dragOverHandler(event: DragEvent): void; // the thing is draggable
    dropHandler(event: DragEvent): void; // permit the drop
    dragLeaveHandler(event: DragEvent): void; // visual purposes
  }
}

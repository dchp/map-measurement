import "./EditButtons.css";

export function EditButtons({
  isEditing,
  onEditingChange,
  onRemove,
}: {
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
  onRemove?: () => void;
}): JSX.Element {
  return (
    <div className="edit-buttons">
      {isEditing ? (
        <span onClick={() => onEditingChange(false)}>
          <i className="bi bi-check2" />
        </span>
      ) : (
        <span onClick={() => onEditingChange(true)}>
          <i className="bi bi-pencil" />
        </span>
      )}
      {onRemove && (
        <span onClick={() => onRemove()}>
          <i className="bi bi-trash3" />
        </span>
      )}
    </div>
  );
}

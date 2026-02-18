"use client";

interface Props {
  value: string[];
  onChange: (v: string[]) => void;
  name: string;
}

export default function ArrayEditor({ value, onChange }: Props) {
  function updateItem(index: number, val: string) {
    onChange(value.map((item, i) => (i === index ? val : item)));
  }

  function removeItem(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...value, ""]);
  }

  function autoResize(e: React.FormEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget;
    el.style.height = "40px";
    el.style.height = el.scrollHeight + "px";
  }

  return (
    <div className="steps">
      <ul>
        {value.map((item, index) => (
          <li key={index}>
            <span className="delete" onClick={() => removeItem(index)}>&times;</span>
            <div className="textarea-wrap">
              <textarea
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                onInput={autoResize}
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="add" onClick={addItem}>Add</div>
    </div>
  );
}

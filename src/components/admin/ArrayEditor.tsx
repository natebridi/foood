"use client";

import Box from "@mui/material/Box";
import Stack from '@mui/material/Stack';
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

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

  return (
    <Stack spacing={1}>
      {value.map((item, index) => (
        <Stack key={index} direction="row">
          <TextField
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            multiline
            fullWidth
            size="small"
          />
          <IconButton onClick={() => removeItem(index)} size="small" sx={{ mt: 0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      ))}
      <Button
        onClick={addItem}
        startIcon={<AddIcon />}
        size="medium"
        sx={{ alignSelf: "flex-start", mt: 1 }}
      >
        Add
      </Button>
    </Stack>
  );
}

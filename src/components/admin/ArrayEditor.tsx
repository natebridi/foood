"use client";

import Box from "@mui/material/Box";
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {value.map((item, index) => (
        <Box key={index} sx={{ display: "flex", alignItems: "flex-start" }}>
          <TextField
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            multiline
            fullWidth
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: index === 0
                  ? "4px 4px 0 0"
                  : index === value.length - 1
                  ? "0 0 4px 4px"
                  : "0",
              },
            }}
          />
          <IconButton onClick={() => removeItem(index)} size="small" sx={{ mt: 0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Button
        onClick={addItem}
        startIcon={<AddIcon />}
        variant="outlined"
        size="small"
        sx={{ alignSelf: "flex-start", mt: 1 }}
      >
        Add
      </Button>
    </Box>
  );
}

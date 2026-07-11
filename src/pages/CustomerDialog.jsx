import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";

export default function CustomerDialog({
  open,
  onClose,
  form,
  setForm,
  onSave,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">

      <DialogTitle>Add Customer</DialogTitle>

      <DialogContent>

        <Stack spacing={2} mt={1}>

          <TextField
            label="Customer Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <TextField
            label="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <TextField
            label="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <TextField
            label="Company"
            value={form.company}
            onChange={(e) =>
              setForm({ ...form, company: e.target.value })
            }
          />

        </Stack>

      </DialogContent>

      <DialogActions>

        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={onSave}
        >
          Save
        </Button>

      </DialogActions>

    </Dialog>
  );
}
import { Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { DeleteOutline, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../../../api/api";
import { paymentMethodsDelete } from "../../../../api/urls";
import { showMessage } from "../../../../components/ActionResultMessage";

export default function PaymentMethodsTable({ data, onDelete, onRefresh }: { data: any[]; onDelete: (id: number) => void; onRefresh: () => void; }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Sort Order</TableCell>
            <TableCell>Active</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row: any) => (
            <TableRow key={row.paymentMethodId} hover>
              <TableCell>{row.methodCode}</TableCell>
              <TableCell>{row.methodName}</TableCell>
              <TableCell title={row.description}>{row.description}</TableCell>
              <TableCell>{row.sortOrder}</TableCell>
              <TableCell>{row.active ? 'Yes' : 'No'}</TableCell>
              <TableCell align="center">
                <IconButton onClick={() => navigate(`/admin/payment-methods/detail/${row.paymentMethodId}`)} title="View">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => onDelete(row.paymentMethodId)} title="Delete">
                  <DeleteOutline />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
